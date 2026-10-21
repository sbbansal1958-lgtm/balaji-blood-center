/* बालाजी ब्लड सेंटर — क्लाउड सिंक (Firestore REST)
   ---------------------------------------------------------------
   • पेज खुलते ही सारा साझा डेटा Firestore से लाकर localStorage में रखता है,
     इसलिए हर फ़ोन/कंप्यूटर पर एक ही डेटा दिखता है।
   • localStorage में कोई बदलाव होते ही उसे Firestore में भेजता है (PATCH)।
   • इंटरनेट न हो तो साइट localStorage से चलती रहती है;
     बदलाव 'bcc_pending' में रुके रहते हैं और ऑनलाइन होते ही भेज दिए जाते हैं।
   • दूसरे डिवाइस से आया नया डेटा मिलने पर नीचे "रीफ़्रेश करें" बटन दिखाता है।
   --------------------------------------------------------------- */
(function () {
  'use strict';

  var PROJECT = 'bloodbank-9b325';
  var API_KEY = 'AIzaSyCAymUm7JLHO9chYyR0mQOH4S8nwEuYQ8k';
  var BASE = 'https://firestore.googleapis.com/v1/projects/' + PROJECT +
             '/databases/(default)/documents/data';
  var KEYS = ['banks', 'donors', 'hospitals', 'staff', 'contact',
              'camps', 'stories', 'doctors', 'alerts', 'appointments'];

  var LAST = {};          // आख़िरी जाना-आया JSON (string)
  var PENDING = null;     // { key: true } — जो बदलाव अभी क्लाउड पर नहीं गए
  var REV = {};           // हर key का बदलाव-क्रम (पुरानी pull नए बदलाव को न मिटाए)
  var polling = false;
  var lastPull = 0;
  var booted = false;

  function rev(k) { return REV[k] || 0; }
  function bump(k) { REV[k] = (REV[k] || 0) + 1; }

  function getPending() {
    if (PENDING === null) {
      try { PENDING = JSON.parse(localStorage.getItem('bcc_pending') || '{}') || {}; }
      catch (e) { PENDING = {}; }
    }
    return PENDING;
  }
  function savePending() {
    try { localStorage.setItem('bcc_pending', JSON.stringify(PENDING)); } catch (e) {}
  }
  function lsGetRaw(k) {
    try { return localStorage.getItem('bcc_' + k); } catch (e) { return null; }
  }

  /* ---------- क्लाउड पर भेजें ---------- */
  function push(key, value) {
    if (KEYS.indexOf(key) < 0) return Promise.resolve(false);
    var raw;
    try { raw = JSON.stringify(value); } catch (e) { return Promise.resolve(false); }
    if (raw === LAST[key] && !getPending()[key]) return Promise.resolve(true);
    LAST[key] = raw;
    bump(key);

    /* Firestore की सीमा 1 MB है — बहुत बड़ा डेटा भेजने की कोशिश न करें */
    if (raw.length > 850000) {
      if (window.console) console.warn('[cloud] डेटा बहुत बड़ा है, क्लाउड पर नहीं भेजा:', key);
      return Promise.resolve(false);
    }

    var p = getPending(); p[key] = true; savePending();

    return fetch(BASE + '/' + encodeURIComponent(key) + '?key=' + API_KEY, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: { json: { stringValue: raw } } })
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      var q = getPending(); delete q[key]; savePending();
      return true;
    }).catch(function (e) {
      if (window.console) console.warn('[cloud] भेज नहीं सके:', key, e.message);
      return false;
    });
  }

  /* ---------- क्लाउड से लाएँ ---------- */
  function pull() {
    if (navigator.onLine === false) return Promise.resolve([]);
    /* अनुरोध भेजने से पहले हर key का revision याद रखें —
       बीच में यूज़र ने कुछ सेव किया तो पुराना जवाब उसे नहीं मिटाएगा */
    var snap = {};
    KEYS.forEach(function (k) { snap[k] = rev(k); });
    return fetch(BASE + '?key=' + API_KEY + '&pageSize=100', { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (j) {
        var changed = [];
        (j.documents || []).forEach(function (doc) {
          var k = doc.name.split('/').pop();
          if (KEYS.indexOf(k) < 0) return;
          var f = doc.fields || {};
          if (!f.json || typeof f.json.stringValue !== 'string') return;
          if (getPending()[k]) return;              // स्थानीय बदलाव पहले भेजना है
          if (rev(k) !== snap[k]) return;           // इस बीच नया स्थानीय बदलाव हुआ
          var raw = f.json.stringValue;
          if (LAST[k] === raw) return;
          try { JSON.parse(raw); } catch (e) { return; }
          if (lsGetRaw(k) !== raw) {
            try { localStorage.setItem('bcc_' + k, raw); } catch (e) {}
            changed.push(k);
          }
          LAST[k] = raw;
        });
        lastPull = Date.now();
        return changed;
      });
  }

  /* ---------- रुके हुए बदलाव भेजें ---------- */
  function flushPending() {
    var p = getPending();
    var keys = Object.keys(p);
    var chain = Promise.resolve();
    keys.forEach(function (k) {
      var raw = lsGetRaw(k);
      if (raw === null) { delete p[k]; return; }
      var val;
      try { val = JSON.parse(raw); } catch (e) { delete p[k]; return; }
      chain = chain.then(function () { return push(k, val); });
    });
    savePending();
    return chain;
  }

  /* ---------- "नया डेटा" बटन ---------- */
  function showBanner() {
    if (!document.body || document.getElementById('bccCloudBanner')) return;
    var lang = 'hi';
    try { lang = JSON.parse(localStorage.getItem('bcc_lang') || '"hi"'); } catch (e) {}
    var wrap = document.createElement('div');
    wrap.id = 'bccCloudBanner';
    wrap.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:14px;z-index:99999;max-width:94vw;';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = lang === 'en'
      ? '🔄 New data available — refresh'
      : '🔄 नई जानकारी मिली — रीफ़्रेश करें';
    btn.style.cssText = 'background:#b91c1c;color:#fff;border:none;border-radius:999px;' +
      'padding:12px 20px;font:inherit;font-weight:800;font-size:14px;cursor:pointer;' +
      'box-shadow:0 8px 24px rgba(120,20,20,.35)';
    btn.onclick = function () { window.location.reload(); };
    wrap.appendChild(btn);
    document.body.appendChild(wrap);
  }

  /* ---------- हर 20 सेकंड जाँच ---------- */
  function tick() {
    if (navigator.onLine === false) return;
    flushPending().then(function () {
      return pull().then(function (changed) {
        if (changed && changed.length) showBanner();
      });
    }).catch(function () {});
  }

  function startPolling() {
    if (polling) return;
    polling = true;
    setInterval(tick, 20000);
    window.addEventListener('focus', function () {
      if (Date.now() - lastPull > 10000) tick();
    });
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && Date.now() - lastPull > 10000) tick();
    });
    window.addEventListener('online', function () { flushPending().then(tick); });
  }

  /* ---------- शुरुआत: ऐप से पहले डेटा लाओ ---------- */
  function boot() {
    if (navigator.onLine === false) { booted = true; return Promise.resolve(false); }

    var timeout = new Promise(function (res) {
      setTimeout(function () { res('timeout'); }, 3000);
    });

    var work = pull().then(function () { return 'ok'; }).catch(function () { return 'err'; });

    return Promise.race([work, timeout]).then(function () {
      /* पहली बार खोलने पर पुराना डेमो-क्लीनअप डेटा न मिटाए */
      try { localStorage.setItem('bcc_data_v', 'v2'); } catch (e) {}
      return flushPending();
    }).then(function () {
      booted = true;
      setTimeout(startPolling, 5000);
      return true;
    });
  }

  window.BC_CLOUD = {
    boot: boot,
    push: push,
    pull: pull,
    keys: KEYS,
    isBooted: function () { return booted; }
  };
})();
