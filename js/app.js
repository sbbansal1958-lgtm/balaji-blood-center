/* यह फ़ाइल अपने आप बनी है — src\app.jsx से। सीधे यहाँ बदलाव न करें, build-blood.cmd चलाएँ। */
const {
  useState,
  useEffect,
  useContext,
  createContext,
  useMemo
} = React;

/* ============ भाषा (Language) ============ */
const D = (hi, en) => ({
  hi,
  en
});
const LangCtx = createContext({
  lang: 'hi',
  t: k => k,
  L: o => o
});
const GROUPS = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
const COMPAT = {
  'O-': ['O-'],
  'O+': ['O+', 'O-'],
  'A-': ['A-', 'O-'],
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'AB+': ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-']
};
const MALE = D('पुरुष', 'Male'),
  FEMALE = D('महिला', 'Female');

/* ============ संपर्क (Contact) ============ */
const CONTACT = {
  phone: '9039914160',
  tel: '+919039914160',
  email: 'balajisst171218@gmail.com',
  whats: ['9039914160', '7049993303', '7583017789'],
  hours: D('रोज़ सुबह 8:00 – शाम 7:00', 'Daily 8:00 AM – 7:00 PM'),
  addr: D('दूसरी मंज़िल, नारायण कुंज, 239-240, बिचोली हापसी मेन रोड, श्री मंगल नगर, इंदौर, मध्य प्रदेश – 452016', '2nd Floor, Narayan Kunj, 239-240, Bicholi Hapsi Main Rd, Sri Mangal Nagar, Indore, Madhya Pradesh 452016'),
  maps: 'https://maps.google.com/?cid=11952045942201618525',
  insta: 'https://www.instagram.com/balaji_charitable_blood_centre/',
  instaHandle: '@balaji_charitable_blood_centre',
  facebook: 'https://www.facebook.com/share/18wXrxYgwp/',
  qr: 'img/donate-qr.png'
};
const fmtPhone = p => String(p || '').replace(/^(\d{5})(\d{5})$/, '$1 $2');

/* एडमिन जो संपर्क/सोशल जानकारी सेव करे, वही साइट पर दिखे */
const getContact = () => {
  const s = LS.get('contact', null);
  if (!s || typeof s !== 'object') return CONTACT;
  const phone = String(s.phone || CONTACT.phone).replace(/\D/g, '').slice(-10);
  return {
    ...CONTACT,
    ...s,
    phone,
    tel: '+91' + phone,
    whats: Array.isArray(s.whats) && s.whats.length ? s.whats : CONTACT.whats,
    addr: s.addr && s.addr.hi ? s.addr : CONTACT.addr,
    hours: s.hours && s.hours.hi ? s.hours : CONTACT.hours,
    maps: s.maps || CONTACT.maps,
    insta: s.insta || CONTACT.insta,
    instaHandle: s.instaHandle || CONTACT.instaHandle,
    facebook: s.facebook || CONTACT.facebook || '',
    qr: s.qr || CONTACT.qr || ''
  };
};
const SEED_BANKS = [{
  id: 1,
  name: D('बालाजी चैरिटेबल ब्लड सेंटर', 'Balaji Charitable Blood Center'),
  city: D('इंदौर', 'Indore'),
  phone: '9039914160',
  type: D('चैरिटेबल (NGO)', 'Charitable (NGO)'),
  units: {
    'O+': 0,
    'O-': 0,
    'A+': 0,
    'A-': 0,
    'B+': 0,
    'B-': 0,
    'AB+': 0,
    'AB-': 0
  }
}];

/* जुड़े अस्पताल — सूची शुरू में खाली; एडमिन पैनल → 🏥 अस्पताल टैब से जोड़ें */
const SEED_HOSPITALS = [];

/* कोई डेमो डोनर नहीं — असली डोनर एडमिन/रजिस्ट्रेशन से जुड़ेंगे */
const SEED_DONORS = [];

/* शिविर और कहानियाँ — शुरू में खाली; एडमिन पैनल से जोड़ें */
const CAMPS = [];
const STORIES = [];
const FAQ = [[D('कौन रक्त दान कर सकता है?', 'Who can donate blood?'), D('18 से 65 वर्ष का कोई भी स्वस्थ व्यक्ति, जिसका वज़न 50 kg से ऊपर हो और पिछले 3 महीने में दान न किया हो।', 'Any healthy person aged 18–65, weight above 50 kg, who has not donated in the last 3 months.')], [D('कितनी बार दान कर सकते हैं?', 'How often can I donate?'), D('पुरुष हर 3 महीने में और महिला हर 4 महीने में एक बार (NBTC नियम)।', 'Men: once in 3 months. Women: once in 4 months (NBTC norms).')], [D('दान से पहले क्या करें?', 'What should I do before donating?'), D('अच्छा भोजन खाएँ, 3–4 लीटर पानी पिएँ, 12 घंटे का उपवास करें, दवाई/सिगरेट/शराब बंद करें।', 'Eat well, drink 3–4 litres of water, fast for 12 hours, avoid medicine/smoking/alcohol.')], [D('दान के बाद क्या करें?', 'What after donation?'), D('15 मिनट लेटें, पानी और नींद पूरी लें, 24 घंटे भारी काम न करें, 2 दिन टेढ़े दाँत न निकालें।', 'Rest 15 minutes, drink water, sleep well, no heavy work for 24 hours, no dental extraction for 2 days.')], [D('कौन नहीं कर सकता?', 'Who cannot donate?'), D('कमरा/कान रोग, हृदय रोग, HIV/HBsAg पॉज़िटिव, तपेदिक, मलेरिया, कैंसर, 12 महीने में गर्भपात।', 'Kidney/ear disease, heart disease, HIV/HBsAg positive, TB, malaria, cancer, abortion within 12 months.')], [D('दान कितना होता है?', 'How much blood is taken?'), D('एक बार में 350–450 ml। 48 घंटे में अलग-अलग घटक (component) बनाए जाते हैं।', '350–450 ml per session; components are separated within 48 hours.')], [D('क्या रक्त सस्ता/मुफ़्त में मिलता है?', 'Is blood free or cheap?'), D('चैरिटेबल केंद्र पर कम से कम शुल्क या मुफ़्त। सरकारी ब्लड बैंक दानित रक्त नहीं बेचते।', 'Charitable centres give it free or at minimal cost; government blood banks never sell donated blood.')], [D('मेरा रक्त किसे मिलेगा?', 'Who receives my blood?'), D('केवल उसी रक्त समूह के मरीज़ को (और ज़रूरत होने पर अन्य समूहों को)। डोनर की जानकारी गोपनीय रहती है।', 'Patients of the same group (and other compatible groups when needed). Donor identity stays confidential.')]];
const LEGAL = [[D('ब्लड बैंक / कलेक्शन सेंटर लाइसेंस', 'Blood Bank / Collection Centre Licence'), D('ड्रग्स एंड कॉस्मेटिक्स अधिनियम 1940, भाग VII — राज्य Drug Controller से लाइसेंस अनिवार्य।', 'Drugs & Cosmetics Act 1940, Part VII — licence from the State Drug Controller is mandatory.')], [D('NBDTC / राज्य ब्लड ट्रांसफ्यूजन काउंसिल', 'NBDTC / State Blood Transfusion Council'), D('रक्तदान केंद्र का पंजीकरण, तकनीकी कर्मियों की नियुक्ति व प्रशिक्षण NBTC मानकों के अनुसार।', 'Registration of collection centre, appointment and training of technical staff as per NBTC standards.')], [D('साथी रक्तदाता / तकनीकी पर्यवेक्षक अनिवार्य', 'Companion (Technical Supervisor) mandatory'), D('हर ब्लड बैंक में कम से कम एक योग्य तकनीकी अधिकारी (Technical Supervisor) नियुक्त होना ज़रूरी है।', 'Every blood bank must have at least one qualified technical supervisor on record.')], [D('सहमति प्रपत्र (Consent Form)', 'Written Consent Form'), D('दान से पहले लिखित सहमति — दान की प्रक्रिया, जोखिम, गोपनीयता व उपयोग के बारे में स्पष्ट सूचना।', 'Written consent before donation explaining procedure, risks, confidentiality and use.')], [D('डोनर पात्रता एवं अंतराल', 'Donor eligibility & interval'), D('आयु 18–65, वज़न 50 kg+, पुरुष 3 महीने / महिला 4 महीने का अंतराल।', 'Age 18–65, weight 50 kg+, interval 3 months (men) / 4 months (women).')], [D('संक्रामक रोग जाँच (TTI)', 'Transfusion Transmissible Infection testing'), D('HIV, HBsAg, HCV, VDRL, मलेरिया — हर यूनिट की जाँच अनिवार्य; रिपोर्ट 20 वर्ष सुरक्षित।', 'HIV, HBsAg, HCV, VDRL, malaria — mandatory for every unit; records kept 20 years.')], [D('रिकॉर्ड सुरक्षा', 'Record retention'), D('खरीद-बेच, यूनिट नंबर, डोनर रजिस्टर व जारी सूची (Issue List) — 20 वर्ष तक सुरक्षित।', 'Procurement, unit numbers, donor register, issue list — preserved for 20 years.')], [D('रोगी का गोपन', 'Patient confidentiality'), D('मरीज़ का नाम/पहचान सार्वजनिक नहीं होनी चाहिए; केवल रक्त समूह व ज़रूरत साझा होती है।', 'Patient identity must not be public; only blood group and requirement are shared.')], [D('DPDP Act, 2023 (डेटा सुरक्षा)', 'DPDP Act 2023 (Data Protection)'), D('डोनर/मरीज़ के फ़ोन, पता, ईमेल के लिए स्पष्ट सहमति व सुरक्षा प्रावधान आवश्यक।', 'Explicit consent and data security measures for donor/patient contact details are required.')], [D('वित्तीय पारदर्शिता', 'Financial transparency'), D('चैरिटेबल संस्था: दान रसीद, 80G/12A लाभ, लेखा परीक्षण (Audit) व वार्षिक रिपोर्ट सार्वजनिक।', 'Charitable body: donation receipts, 80G/12A benefit, audited accounts and annual report.')], [D('विज्ञापन सीमा', 'Advertising limits'), D('रक्त बेचने या डोनर से पैसे लेने का पूर्ण प्रतिषेध; भ्रामक दावे (जैसे "सबसे अच्छा") नहीं।', 'Strictly no sale of blood or payment to donors; no misleading claims.')], [D('चिकित्सा अस्वीकरण', 'Medical disclaimer'), D('साइट केवल सहायक है — रोग पहचान व उपचार के लिए योग्य चिकित्सक की सलाह से ही।', 'Website is informational only; always follow a qualified doctor’s advice.')]];
const SERVICES = [['🚑', D('आपात रक्त सेवा', 'Emergency Blood Service'), D('खुलने के समय (रोज़ 8 AM – 7 PM) आपात रक्त उपलब्ध।', 'Emergency blood available during opening hours (daily 8 AM – 7 PM).')], ['🏕️', D('रक्तदान शिविर', 'Donation Camps'), D('गाँव, कॉलेज, कारखानों में मुफ़्त शिविर।', 'Free camps in villages, colleges and factories.')], ['🧪', D('समूह (Component) सेपरेटर', 'Component Separator'), D('एक दान से RBC, प्लेटलेट, प्लाज़्मा अलग।', 'RBC, platelets and plasma separated from one donation.')], ['🚗', D('मोबाइल कलेक्शन', 'Mobile Collection'), D('आपके गाँव/घर पर आकर रक्त संग्रह।', 'Blood collected at your village or home.')], ['🩹', D('थैलेसीमिया सेंटर', 'Thalassemia Centre'), D('नियमित दानकरों के लिए निःशुल्क रक्त।', 'Free blood for regular thalassemia donors.')], ['👩‍⚕️', D('स्वास्थ्य जाँच', 'Health Check-up'), D('ब्लड प्रेशर, शुगर, हीमोग्लोबिन जाँच।', 'BP, sugar and haemoglobin testing.')], ['📚', D('जागरूकता कार्यक्रम', 'Awareness Programmes'), D('स्कूल-कॉलेज में रक्तदान शिक्षा।', 'Blood donation education in schools and colleges.')], ['🆘', D('आपात अलर्ट', 'Emergency Alerts'), D('ज़रूरत पड़ने पर 1 क्लिक में डोनर अलर्ट।', 'One-click donor alerts when needed.')]];
const HN = ['शून्य', 'एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ', 'दस', 'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सहरा', 'अठारह', 'उन्नीस', 'बीस'];
const EN = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const hn = n => HN[n] || String(n);
const en = n => EN[n] || String(n);
const say = (text, rate = 0.8, lang = 'hi-IN') => {
  try {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = rate;
    u.pitch = 1.15;
    speechSynthesis.speak(u);
  } catch (e) {/* speech not supported */}
};
const stopSay = () => {
  try {
    speechSynthesis.cancel();
  } catch (e) {}
};
const nextEligible = (d, lang) => {
  if (!d.last) return lang === 'hi' ? 'अभी दान कर सकते हैं' : 'Eligible now';
  const dt = new Date(d.last);
  const months = d.gender && d.gender.hi === 'महिला' ? 4 : 3;
  dt.setMonth(dt.getMonth() + months);
  return dt.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN');
};
const CLOUD_KEYS = ['banks', 'donors', 'hospitals', 'staff', 'contact', 'camps', 'stories', 'doctors', 'alerts', 'appointments'];
const LS = {
  get(k, d) {
    try {
      const v = localStorage.getItem('bcc_' + k);
      return v ? JSON.parse(v) : d;
    } catch (e) {
      return d;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem('bcc_' + k, JSON.stringify(v));
    } catch (e) {}
    /* साझा डेटा क्लाउड (Firestore) पर भी भेजें — बाकी सभी डिवाइस को दिखे */
    try {
      if (CLOUD_KEYS.indexOf(k) >= 0 && window.BC_CLOUD && window.BC_CLOUD.push) {
        window.BC_CLOUD.push(k, v);
      }
    } catch (e) {}
  }
};

/* पुराना डेमो डेटा एक बार में साफ़ करें (इसके बाद एडमिन का जोड़ा डेटा सुरक्षित रहेगा) */
try {
  if (localStorage.getItem('bcc_data_v') !== 'v2') {
    ['banks', 'donors', 'camps', 'stories', 'doctors', 'hospitals', 'alerts', 'appointments'].forEach(k => localStorage.removeItem('bcc_' + k));
    localStorage.setItem('bcc_data_v', 'v2');
  }
} catch (e) {}

/* ============ UI शब्द (labels) ============ */
const LABELS = {
  hi: {
    home: 'होम',
    find: 'रक्त खोजें',
    donate: 'दान करें',
    request: 'अनुरोध',
    inventory: 'इन्वेंटरी',
    camps: 'शिविर',
    stories: 'कहानियाँ',
    doctor: 'डॉक्टर',
    about: 'हमारे बारे में',
    guide: 'नियम',
    legal: 'कानूनी',
    contact: 'संपर्क',
    profile: 'डोनर लॉगिन',
    admin: 'एडमिन',
    staff: 'स्टाफ',
    logout: 'लॉगआउट',
    activity: 'गतिविधि लॉग',
    bhelp: 'ब्लड हेल्पलाइन',
    tag: '🩸 रक्तदान सर्वोपरि धर्म है',
    h1: 'एक बूंट रक्त,',
    h2: 'एक जान',
    h3: 'बचाए',
    sub: 'बालाजी चैरिटेबल ब्लड सेंटर — रियल-टाइम रक्त उपलब्धता, जुड़े अस्पतालों की सूची, डोनर रजिस्ट्रेशन, रक्त अनुरोध, डॉक्टर बुकिंग — सब एक जगह।',
    q_donate: '🩸 रक्त दान करें',
    q_find: '🔎 रक्त खोजें',
    q_doctor: '👩‍⚕️ डॉक्टर बुक करें',
    q_req: '🆘 रक्त अनुरोध',
    q_profile: '👤 डोनर लॉगिन',
    q_admin: '🔐 एडमिन पैनल',
    city_ph: 'शहर का नाम',
    btn: 'खोजें',
    today: 'आज की स्थिति',
    units: 'कुल यूनिट',
    banks: 'ब्लड बैंक',
    donors: 'डोनर',
    helpline: 'हेल्पलाइन',
    inv_t: '📊 लाइव ब्लड इन्वेंटरी',
    inv_s: 'ब्लड बैंक द्वारा अपडेट की गई वर्तमान उपलब्धता। आपात स्थिति में फ़ोन करके पक्का कर लें।',
    none: 'उपलब्ध नहीं',
    low: 'कम',
    enough: 'पर्याप्त',
    banks_t: '🏥 ब्लड बैंक सूची',
    call: '📞 कॉल',
    th_name: 'ब्लड बैंक',
    th_city: 'शहर',
    th_type: 'प्रकार',
    th_phone: 'फ़ोन',
    th_units: 'कुल यूनिट',
    hosp_t: '🏥 हमारे जुड़े अस्पताल',
    hospitals: 'अस्पताल',
    th_hosp: 'अस्पताल का नाम',
    hosp_s: 'इन अस्पतालों से हमारा सीधा संपर्क है — ज़रूरत पड़ने पर रक्त यहाँ पहुँचाया जाता है।',
    no_hosp: 'अभी कोई अस्पताल नहीं जोड़ा गया — एडमिन पैनल → 🏥 अस्पताल से जोड़ें।',
    no_banks: 'अभी कोई ब्लड बैंक नहीं जोड़ा गया — एडमिन पैनल → 📦 इन्वेंटरी से जोड़ें।',
    no_docs: 'अभी कोई डॉक्टर नहीं जोड़ा गया — एडमिन पैनल → 👨‍⚕️ डॉक्टर से जोड़ें।',
    no_stories: 'अभी कोई कहानी नहीं जोड़ी गई — एडमिन पैनल → 💛 कहानियाँ से जोड़ें।',
    add_hosp: '➕ नया अस्पताल जोड़ें',
    hosp_added: '✅ अस्पताल जुड़ गया!',
    hosp_del: '✅ अस्पताल हटा दिया',
    del: 'हटाएँ',
    hosp_err: '⚠️ अस्पताल का नाम और 10 अंकों का फ़ोन ज़रूरी है',
    add_bank: '➕ नया ब्लड बैंक',
    add_donor: '➕ नया डोनर',
    add_camp: '➕ नया शिविर',
    add_story: '➕ नई कहानी',
    add_doc: '➕ नया डॉक्टर',
    edit: 'बदलें',
    saved: '✅ सेव हो गया',
    saved_del: '✅ हटा दिया',
    del_q: 'पक्का हटाना है?',
    mon: 'महीना',
    yr: 'साल',
    plc: 'जगह',
    msg: 'संदेश / कहानी',
    spec: 'विशेषज्ञता',
    exp: 'अनुभव (साल)',
    fee: 'फीस (₹)',
    name: 'नाम',
    da: 'दिन (जैसे 12)',
    camp_tab: 'शिविर',
    stories_tab: 'कहानियाँ',
    docs_tab: 'डॉक्टर',
    site_data: 'साइट डेटा',
    find_t: '🔎 रक्त खोजें',
    find_s: 'अपना रक्त समूह और शहर चुनें — उपलब्ध ब्लड बैंक और डोनर तुरंत दिखेंगे।',
    city_any: 'शहर (खाली = सभी)',
    for_group: 'के लिए ये समूह दे सकते हैं',
    tot: 'कुल',
    no_bank: 'कोई ब्लड बैंक नहीं मिला — हेल्पलाइन पर कॉल करें।',
    no_donor: 'कोई डोनर नहीं — कृपया रक्तदान शिविर में ज़रूर आएँ।',
    avail: 'डोनर उपलब्ध',
    next_d: 'अगला दान',
    can_call: '📞 कॉल करें',
    wait: '⏳ बाकी',
    don_t: '🩸 रक्तदाता पंजीकरण',
    don_s: 'एक बार रजिस्टर करें — ज़रूरत पड़ने पर आपको सीधे कॉल किया जाएगा।',
    reg_t: 'नया डोनर रजिस्ट्रेशन',
    f_name: 'पूरा नाम',
    f_age: 'उम्र',
    f_gender: 'लिंग',
    f_group: 'रक्त समूह',
    f_city: 'शहर / गाँव',
    f_phone: 'मोबाइल नंबर',
    f_last: 'पिछली बार दान (अगर हुआ हो)',
    agree: 'मैं पुष्टि करता/करती हूँ कि दान से पहले मेरा हालत स्वस्थ है',
    register: 'रजिस्टर करें',
    hero_t: '🏅 हीरो — सबसे ज़्यादा दान करने वाले',
    times: 'बार दान',
    warn: '⚠️ दान से पहले: अच्छा भोजन खाएँ, पानी पिएँ, 3/4 महीने का अंतराल रखें।',
    req_t: '🆘 रक्त की आवश्यकता',
    req_s: 'फ़ॉर्म भरते ही उसी इलाके के सही रक्त समूह वाले डोनरों की सूची मिल जाएगी (ऑटो-मैच)।',
    req_f: 'अनुरोध फ़ॉर्म',
    f_patient: 'मरीज़ का नाम',
    f_units: 'कितनी यूनिट',
    f_urg: 'ज़रूरत की तिथि',
    f_hosp: 'अस्पताल',
    f_contact: 'संपर्क मोबाइल',
    normal: 'सामान्य',
    soon: 'जल्दी (24 घंटे)',
    crit: 'अत्यावश्यक (6 घंटे)',
    submit: 'अनुरोध दर्ज करें',
    recent: '📋 हाल के अनुरोध',
    none_req: 'अभी कोई अनुरोध दर्ज नहीं।',
    alerted: 'डोनर को अलर्ट भेजा गया',
    match_t: '🔔 मैच-मैकिंग डोनर — कॉल करके सहायता करें',
    camp_t: '📅 रक्तदान शिविर कैलेंडर',
    camp_s: 'आने वाले शिविरों की तारीख, समय और स्थान।',
    reg_btn: 'पंजीकरण',
    serv_t: '🏥 हमारी सुविधाएँ',
    stor_t: '💛 सफलता की कहानियाँ',
    stor_s: 'समय पर रक्त मिलने से बची ज़िंदगियाँ।',
    gal_t: '📸 गैलरी',
    gal_n: '📸 असली फ़ोटो यहाँ अपलोड की जा सकती हैं।',
    doc_t: '👩‍⚕️ डॉक्टर बुकिंग',
    doc_s: 'अनुभवी विशेषज्ञों से अपॉइंटमेंट बुक करें।',
    book: 'बुक करें',
    appt_t: 'अपॉइंटमेंट बुक करें',
    f_dept: 'विभाग',
    f_date: 'तारीख़',
    f_slot: 'समय',
    confirm: 'बुकिंग कन्फर्म करें',
    prof_t: '👤 डोनर प्रोफ़ाइल (लॉगिन)',
    prof_s: 'अपना रजिस्टर्ड मोबाइल नंबर डालकर दान जानकारी देखें।',
    my_phone: 'अपना मोबाइल नंबर (जैसे 0000000000)',
    view: 'देखें',
    not_found: '❌ इस नंबर से कोई डोनर रजिस्टर्ड नहीं मिला।',
    hist: '📜 मेरी दान इतिहास',
    no_hist: 'अभी कोई रिकॉर्ड नहीं।',
    don_today: '🩸 आज रक्त दान किया (रिकॉर्ड करें)',
    tot_don: 'कुल दान',
    last_d: 'पिछली बार',
    next_elig: 'अगला दान',
    elig_now: 'अभी दान योग्य',
    adm_t: '🔐 ब्लड बैंक / एडमिन पैनल',
    pass_ph: 'पासकोड (डेमो: 1234)',
    login: 'लॉगिन',
    wrong: '❌ गलत पासकोड',
    adm_s: 'स्टाफ और एडमिन यहाँ लॉगिन कर सकते हैं — इन्वेंटरी अपडेट, अनुरोध, डोनर और स्टाफ मैनेजमेंट।',
    login_err: '❌ ग़लत यूज़र नाम या पासकोड',
    f_user: 'यूज़र नाम (User ID)',
    f_pass: 'पासकोड',
    f_role: 'भूमिका (Role)',
    role_admin: 'एडमिन',
    role_office: 'ऑफ़िस इंचार्ज',
    login_quick: 'त्वरित लॉगिन — यूज़र ID चुनें',
    login_note: 'पासकोड अपने एडमिन/ऑफ़िस इंचार्ज से लें। पहली बार लॉगिन के बाद 🔑 "अपना पासकोड बदलें" टैब से पासकोड बदल लें।',
    mypass: 'अपना पासकोड बदलें',
    mypass_s: 'सुरक्षा के लिए समय-समय पर पासकोड बदलते रहें।',
    cur_pass: 'पुराना पासकोड',
    new_pass: 'नया पासकोड',
    new_pass2: 'नया पासकोड दोबारा',
    pass_changed: '✅ पासकोड बदल गया',
    pass_wrong: '❌ पुराना पासकोड गलत है',
    pass_mismatch: '❌ दोनों नए पासकोड एक जैसे नहीं हैं',
    pass_short: '⚠️ नया पासकोड कम से कम 6 अक्षर का रखें',
    admin_only_del: 'ℹ️ हटाने का अधिकार सिर्फ़ एडमिन के पास है',
    office_note: 'आप सभी ज़रूरी एंट्री जोड़ व बदल सकते हैं। हटाने का अधिकार सिर्फ़ एडमिन के पास है।',
    f_fullname: 'पूरा नाम',
    demo_cred: 'डेमो लॉगिन:',
    staff_list: '👥 स्टाफ सूची',
    add_staff: '➕ नया स्टाफ जोड़ें',
    staff_added: '✅ स्टाफ जुड़ गया!',
    dup_user: '❌ यह यूज़र नाम पहले से है',
    req_fields: '⚠️ यूज़र नाम और पासकोड ज़रूरी है',
    save: 'सेव करें',
    cancel: 'रद्द करें',
    none: 'कोई रिकॉर्ड नहीं।',
    fulfil: 'पूरा किया',
    dash: '🔐 एडमिन पैनल',
    reqs: 'अनुरोध',
    appts: 'अपॉइंटमेंट',
    upd_t: 'इन्वेंटरी अपडेट करें',
    bank: 'ब्लड बैंक',
    add_u: 'यूनिट जोड़ें / घटाएँ',
    update: 'अपडेट करें',
    emg_req: '🆘 आपात अनुरोध',
    da: 'तारीख़',
    grp: 'समूह',
    group: 'समूह',
    g_t_t: '📋 रक्तदान नियम और FAQ',
    g_t_s: 'रक्तदान से जुड़ी ज़रूरी जानकारी।',
    before: '✅ दान से पहले की तैयारी',
    b1: 'खाना खाएँ',
    b1d: 'दान वाले दिन सुबह अच्छा नाश्ता + पानी लें।',
    b2: 'पानी पिएँ',
    b2d: 'दान से 2 घंटे पहले 3–4 लीटर पानी।',
    b3: 'नींद पूरी लें',
    b3d: 'कम से कम 7 घंटे की नींद।',
    b4: 'दवाई बंद',
    b4d: 'दवाई, शराब, सिगरेट 48 घंटे पहले बंद।',
    ab_t: '🏥 हमारे बारे में',
    p1: 'बालाजी चैरिटेबल ब्लड सेंटर एक नल-लाभ (not-for-profit) संस्था है, जिसकी स्थापना 2005 में हुई। उद्देश्य — किसी मरीज़ को रक्त की कमी के कारण अस्पताल में न टालना पड़े।',
    p2: 'हमारा केंद्र रोज़ सुबह 8:00 से शाम 7:00 तक खुला रहता है — आपात रक्त, मोबाइल कलेक्शन, कंपोनेंट सेपरेटर, थैलेसीमिया सेवा और स्कूल-कॉलेज में जागरूकता कार्यक्रम।',
    vis: '🎯 हमारा विज़न',
    vis_t: '“कोई भी मरीज़ रक्त की कमी से न मरे — और हर युवा रक्तदान के बारे में जागरूक हो।”',
    ach: '📊 हमारी उपलब्धि',
    pledge: '🔑 हमारी प्रतिज्ञा',
    pl1: 'दानित रक्त कभी नहीं बेचा जाता',
    pl2: 'हर यूनिट की जाँच के बाद ही दिया जाता है',
    pl3: 'डोनर का नाम किसी को नहीं दिया जाता',
    pl4: 'खुलने के समय (8 AM – 7 PM) हेल्पलाइन',
    pl5: 'गरीब व ज़रूरतमंद को मुफ़्त रक्त',
    bank_t: 'दान के लिए बैंक विवरण',
    bank_s: 'बालाजी सेवा संस्थान ट्रस्ट को सीधे बैंक ट्रांसफर (NEFT / IMPS / UPI) से दान करें।',
    don_contact: 'रक्तदान हेतु संपर्क',
    quote: 'रक्तदान से बड़ा कोई दान नहीं — एक यूनिट रक्त किसी की पूरी ज़िंदगी बचा सकता है। आइए, इस पुनीत कार्य में साथ दें।',
    quote_by: 'बालाजी चैरिटेबल ब्लड सेंटर परिवार',
    quote2: 'रक्तदान से जान बचती है, और आपका आर्थिक सहयोग उस जान को बचाए रखता है। आपका हर रुपया ज़रूरतमंद मरीज़ों की मुफ़्त रक्त सेवा, थैलेसीमिया सहायता और रक्तदान शिविरों में लगता है — इस पुनीत कार्य में हिस्सा बनें।',
    bank_name: 'बैंक',
    branch: 'शाखा',
    acc_name: 'खाताधारक',
    trust_name: 'बालाजी सेवा संस्थान ट्रस्ट',
    acc_no: 'खाता संख्या',
    copy: 'कॉपी',
    bank_note: 'रसीद तथा 80G / 12A कर-लाभ के लिए संपर्क करें:',
    tax_note: '(80G / 12A लाभ प्राप्त करें)',
    blood_only: '9039914160 केवल रक्तदान/रक्त संबंधी संपर्क के लिए है।',
    qr_t: 'दान के लिए QR कोड',
    qr_s: 'किसी भी UPI ऐप से स्कैन करके या UPI ID से सीधे दान करें।',
    qr_upi: 'UPI ID',
    qr_soon: 'QR कोड जल्द यहाँ जोड़ा जाएगा',
    f_qr: 'QR इमेज लिंक (चाहें तो)',
    d51_t: '₹51 से दान की शुरुआत करें',
    d51_s: 'रक्तदान जितना ज़रूरी है, आर्थिक सहयोग भी उतना ही। ₹51 से शुरुआत करें — आपका हर रुपया ज़रूरतमंद मरीज़ों की मुफ़्त रक्त सेवा, थैलेसीमिया सहायता और रक्तदान शिविरों में लगता है।',
    d51_btn: '₹51 दान करें',
    d51_close: 'बंद करें',
    d51_amt: 'राशि चुनें (बाद में बदल भी सकते हैं)',
    d51_how: 'राशि चुनें, फिर QR स्कैन करें या नीचे के बटन से सीधे UPI ऐप में भेजें।',
    d51_open: '📲 UPI ऐप में ₹51 भेजें',
    d51_note: 'रसीद तथा 80G / 12A कर-लाभ के लिए: 75830 17789 · 70499 93303',
    lg_t: '⚖️ कानूनी, लाइसेंस और अनुपालन',
    lg_s: 'रक्त बैंक अत्यधिक विनियमित क्षेत्र है। साइट लाइव करने से पहले ये बिंदु पूरे किए जाएँ।',
    pg_t: '📄 आवश्यक पेज (जोड़े जा सकते हैं)',
    lg_note: '⚠️ यह वेबसाइट केवल सूचना व समन्वय के लिए है। रक्त का भंडारण, परीक्षण और वितरण केवल लाइसेंस प्राप्त ब्लड बैंक करता है। रोगी का नाम कभी सार्वजनिक न करें।',
    ct_t: '📞 संपर्क करें',
    addr: 'पता',
    time: 'समय',
    time_note: 'आपात रक्त के लिए भी संपर्क करें।',
    email: 'ईमेल',
    whatsapp: 'WhatsApp',
    map_open: '🗺️ Google Maps में खोलें',
    msg_t: '✉️ संदेश भेजें',
    send: 'भेजें',
    sent: '✅ संदेश भेज दिया गया। धन्यवाद!',
    soc_tab: 'संपर्क/सोशल',
    soc_s: 'फ़ोन, WhatsApp, ईमेल, पता, समय, Maps, Instagram और Facebook — यहाँ से बदलें। बदलाव होम, संपर्क पेज और फुटर में तुरंत दिखेगा।',
    link_soon: 'जल्द जोड़ा जाएगा',
    fb_page: 'Facebook पेज',
    f_insta: 'Instagram लिंक',
    f_facebook: 'Facebook लिंक',
    f_maps: 'Google Maps लिंक',
    f_whats: 'WhatsApp नंबर (कॉमा से अलग करें)',
    f_addr_hi: 'पता (हिन्दी)',
    f_addr_en: 'पता (English)',
    f_hours_hi: 'समय (हिन्दी)',
    f_hours_en: 'समय (English)',
    err_msg: '⚠️ नाम, 10 अंक का मोबाइल और संदेश भरें।',
    sc_t: '✅ धन्यवाद! आप डोनर सूची में जुड़ गए।',
    sc_err: '⚠️ नाम, उम्र, शहर और 10 अंक का मोबाइल ज़रूरी है।',
    age_err: '⚠️ आयु 18–65 वर्ष होनी चाहिए।',
    disc: 'यह साइट केवल सूचना/समन्वय हेतु है। निदान या उपचार योग्य चिकित्सक की सलाह से ही कराएँ।',
    npl: 'नल-लाभ संस्था — रक्तदान से जीवन बचता है।',
    quick_links: 'त्वरित लिंक',
    discl: 'अस्वीकरण',
    patient: 'मरीज़ का नाम',
    phone: 'मोबाइल',
    hospital: 'अस्पताल',
    name: 'नाम',
    ok: 'पर्याप्त'
  },
  en: {
    home: 'Home',
    find: 'Find Blood',
    donate: 'Donate',
    request: 'Request',
    inventory: 'Inventory',
    camps: 'Camps',
    stories: 'Stories',
    doctor: 'Doctor',
    about: 'About Us',
    guide: 'Guidelines',
    legal: 'Legal',
    contact: 'Contact',
    profile: 'Donor Login',
    admin: 'Admin',
    staff: 'Staff',
    logout: 'Logout',
    activity: 'Activity Log',
    bhelp: 'Blood Helpline',
    tag: '🩸 Donating blood is the highest act of humanity',
    h1: 'One drop of blood,',
    h2: 'one life',
    h3: 'saved',
    sub: 'Balaji Charitable Blood Center — live blood availability, associated hospital list, donor registration, blood requests and doctor booking, all in one place.',
    q_donate: '🩸 Donate Blood',
    q_find: '🔎 Find Blood',
    q_doctor: '👩‍⚕️ Book Doctor',
    q_req: '🆘 Request Blood',
    q_profile: '👤 Donor Login',
    q_admin: '🔐 Admin Panel',
    city_ph: 'City name',
    btn: 'Search',
    today: 'Today’s Status',
    units: 'Total Units',
    banks: 'Blood Banks',
    donors: 'Donors',
    helpline: 'Helpline',
    inv_t: '📊 Live Blood Inventory',
    inv_s: 'Current availability updated by blood banks. Please confirm by phone in an emergency.',
    none: 'Not available',
    low: 'Low',
    enough: 'Sufficient',
    banks_t: '🏥 Blood Bank List',
    call: '📞 Call',
    th_name: 'Blood Bank',
    th_city: 'City',
    th_type: 'Type',
    th_phone: 'Phone',
    th_units: 'Total Units',
    hosp_t: '🏥 Our Associated Hospitals',
    hospitals: 'Hospitals',
    th_hosp: 'Hospital Name',
    hosp_s: 'We work directly with these hospitals — blood is delivered there whenever needed.',
    no_hosp: 'No hospital added yet — add one from Admin Panel → 🏥 Hospitals.',
    no_banks: 'No blood bank added yet — add one from Admin Panel → 📦 Inventory.',
    no_docs: 'No doctor added yet — add one from Admin Panel → 👨‍⚕️ Doctors.',
    no_stories: 'No story added yet — add one from Admin Panel → 💛 Stories.',
    add_hosp: '➕ Add new hospital',
    hosp_added: '✅ Hospital added!',
    hosp_del: '✅ Hospital removed',
    del: 'Delete',
    hosp_err: '⚠️ Hospital name and a 10-digit phone number are required',
    add_bank: '➕ New blood bank',
    add_donor: '➕ New donor',
    add_camp: '➕ New camp',
    add_story: '➕ New story',
    add_doc: '➕ New doctor',
    edit: 'Edit',
    saved: '✅ Saved',
    saved_del: '✅ Deleted',
    del_q: 'Delete this record?',
    mon: 'Month',
    yr: 'Year',
    plc: 'Place',
    msg: 'Message / story',
    spec: 'Speciality',
    exp: 'Experience (years)',
    fee: 'Fee (₹)',
    name: 'Name',
    da: 'Day (e.g. 12)',
    camp_tab: 'Camps',
    stories_tab: 'Stories',
    docs_tab: 'Doctors',
    site_data: 'Site data',
    find_t: '🔎 Find Blood',
    find_s: 'Choose your blood group and city — matching banks and donors appear instantly.',
    city_any: 'City (blank = all)',
    for_group: 'can be donated by these groups',
    tot: 'total',
    no_bank: 'No blood bank found — call the helpline.',
    no_donor: 'No donor found — please visit a donation camp.',
    avail: 'Donors Available',
    next_d: 'Next donation',
    can_call: '📞 Call',
    wait: '⏳ Not yet',
    don_t: '🩸 Donor Registration',
    don_s: 'Register once — we will call you directly when blood is needed.',
    reg_t: 'New Donor Registration',
    f_name: 'Full name',
    f_age: 'Age',
    f_gender: 'Gender',
    f_group: 'Blood Group',
    f_city: 'City / Village',
    f_phone: 'Mobile number',
    f_last: 'Last donation date (if any)',
    agree: 'I confirm that I am healthy before donating',
    register: 'Register',
    hero_t: '🏅 Heroes — top donors',
    times: 'donations',
    warn: '⚠️ Before donating: eat well, drink water, keep the 3/4 month gap.',
    req_t: '🆘 Request Blood',
    req_s: 'Submit the form and the matching donor list of that area appears instantly (auto-match).',
    req_f: 'Request Form',
    f_patient: 'Patient name',
    f_units: 'Units needed',
    f_urg: 'Urgency',
    f_hosp: 'Hospital',
    f_contact: 'Contact mobile',
    normal: 'Normal',
    soon: 'Urgent (24 hrs)',
    crit: 'Critical (6 hrs)',
    submit: 'Submit Request',
    recent: '📋 Recent Requests',
    none_req: 'No request submitted yet.',
    alerted: 'donors alerted',
    match_t: '🔔 Matched donors — please call and help',
    camp_t: '📅 Blood Donation Camp Calendar',
    camp_s: 'Upcoming camps with date, time and venue.',
    reg_btn: 'Register',
    serv_t: '🏥 Our Services',
    stor_t: '💛 Success Stories',
    stor_s: 'Lives saved because blood arrived on time.',
    gal_t: '📸 Gallery',
    gal_n: '📸 Real photographs can be uploaded here.',
    doc_t: '👩‍⚕️ Book a Doctor',
    doc_s: 'Book an appointment with experienced specialists.',
    book: 'Book',
    appt_t: 'Book Appointment',
    f_dept: 'Department',
    f_date: 'Date',
    f_slot: 'Time',
    confirm: 'Confirm Booking',
    prof_t: '👤 Donor Profile (Login)',
    prof_s: 'Enter your registered mobile number to see your donation record.',
    my_phone: 'Your mobile number (e.g. 0000000000)',
    view: 'View',
    not_found: '❌ No donor found with this number.',
    hist: '📜 My Donation History',
    no_hist: 'No record yet.',
    don_today: '🩸 I donated today (save record)',
    tot_don: 'Total Donations',
    last_d: 'Last donation',
    next_elig: 'Next eligible',
    elig_now: 'Eligible now',
    adm_t: '🔐 Blood Bank / Admin Panel',
    pass_ph: 'Passcode (demo: 1234)',
    login: 'Login',
    wrong: '❌ Wrong passcode',
    adm_s: 'Staff and admins can log in here — update inventory, requests, donors and manage staff.',
    login_err: '❌ Wrong user ID or passcode',
    f_user: 'User ID',
    f_pass: 'Passcode',
    f_role: 'Role',
    role_admin: 'Admin',
    role_office: 'Office In-charge',
    login_quick: 'Quick login — pick a user ID',
    login_note: 'Get the passcode from your admin/office in-charge. After the first login, change it from the 🔑 "Change my passcode" tab.',
    mypass: 'Change my passcode',
    mypass_s: 'Change your passcode from time to time for security.',
    cur_pass: 'Current passcode',
    new_pass: 'New passcode',
    new_pass2: 'Repeat new passcode',
    pass_changed: '✅ Passcode changed',
    pass_wrong: '❌ Current passcode is wrong',
    pass_mismatch: '❌ The two new passcodes do not match',
    pass_short: '⚠️ New passcode must be at least 6 characters',
    admin_only_del: 'ℹ️ Only the admin can delete records',
    office_note: 'You can add and update all required entries. Only the admin can delete records.',
    f_fullname: 'Full name',
    demo_cred: 'Demo login:',
    staff_list: '👥 Staff List',
    add_staff: '➕ Add new staff',
    staff_added: '✅ Staff added!',
    dup_user: '❌ This user ID already exists',
    req_fields: '⚠️ User ID and passcode are required',
    save: 'Save',
    cancel: 'Cancel',
    none: 'No records yet.',
    fulfil: 'Fulfilled',
    dash: '🔐 Admin Panel',
    reqs: 'Requests',
    appts: 'Appointments',
    upd_t: 'Update Inventory',
    bank: 'Blood Bank',
    add_u: 'Add / remove units',
    update: 'Update',
    emg_req: '🆘 Emergency Requests',
    da: 'Date',
    grp: 'Group',
    group: 'Group',
    g_t_t: '📋 Blood Donation Rules & FAQ',
    g_t_s: 'Everything you need to know before donating.',
    before: '✅ Preparation before donation',
    b1: 'Eat well',
    b1d: 'A good breakfast and water on the donation day.',
    b2: 'Drink water',
    b2d: '3–4 litres, 2 hours before.',
    b3: 'Sleep well',
    b3d: 'At least 7 hours of sleep.',
    b4: 'Stop medicines',
    b4d: 'No medicine, alcohol or smoking 48 hours before.',
    ab_t: '🏥 About Us',
    p1: 'Balaji Charitable Blood Center is a not-for-profit organisation founded in 2005. Our goal: no patient should ever be turned away in hospital because of a blood shortage.',
    p2: 'Our centre is open daily from 8:00 AM to 7:00 PM — emergency blood, mobile collection, component separation, thalassemia support and awareness programmes in schools and colleges.',
    vis: '🎯 Our Vision',
    vis_t: '“No patient should die for want of blood, and every young person should know about donation.”',
    ach: '📊 Our Achievements',
    pledge: '🔑 Our Promise',
    pl1: 'Donated blood is never sold',
    pl2: 'Every unit released only after screening',
    pl3: 'Donor identity is never disclosed',
    pl4: 'Helpline during opening hours (8 AM – 7 PM)',
    pl5: 'Free blood for the poor and needy',
    bank_t: 'Bank details for donations',
    bank_s: 'Donate directly to Balaji Seva Sansthan Trust by bank transfer (NEFT / IMPS / UPI).',
    don_contact: 'Contact for blood donation',
    quote: 'There is no greater gift than blood — one unit can save a whole life. Be a part of this noble cause.',
    quote_by: 'Balaji Charitable Blood Centre family',
    quote2: 'Blood donation saves a life, and your financial support keeps it saved. Every rupee goes to free blood service for needy patients, thalassemia care and blood donation camps — be a part of this noble cause.',
    bank_name: 'Bank',
    branch: 'Branch',
    acc_name: 'Account holder',
    trust_name: 'Balaji Seva Sansthan Trust',
    acc_no: 'Account number',
    copy: 'Copy',
    bank_note: 'For receipt and 80G / 12A tax benefit, contact:',
    tax_note: '(avail 80G / 12A benefit)',
    blood_only: '9039914160 is only for blood donation / blood-related queries.',
    qr_t: 'QR code for donation',
    qr_s: 'Scan with any UPI app, or pay directly using the UPI ID.',
    qr_upi: 'UPI ID',
    qr_soon: 'QR code will be added here soon',
    f_qr: 'QR image link (optional)',
    d51_t: 'Start donating with just ₹51',
    d51_s: 'Blood donation is vital, and so is financial support. Start with ₹51 — every rupee goes to free blood service for needy patients, thalassemia care and blood donation camps.',
    d51_btn: 'Donate ₹51',
    d51_close: 'Close',
    d51_amt: 'Choose amount (you can change it later)',
    d51_how: 'Choose an amount, then scan the QR or send directly from your UPI app using the button below.',
    d51_open: '📲 Send ₹51 via UPI app',
    d51_note: 'For receipt and 80G / 12A tax benefit: 75830 17789 · 70499 93303',
    lg_t: '⚖️ Legal, Licence & Compliance',
    lg_s: 'Blood banking is a highly regulated field. Complete these points before going live.',
    pg_t: '📄 Pages to add',
    lg_note: '⚠️ This website is only for information and coordination. Storage, testing and distribution of blood is done only by a licensed blood bank. Never publish patient identity.',
    ct_t: '📞 Contact Us',
    addr: 'Address',
    time: 'Hours',
    time_note: 'Emergency blood is available — call us.',
    email: 'Email',
    whatsapp: 'WhatsApp',
    map_open: '🗺️ Open in Google Maps',
    msg_t: '✉️ Send a message',
    send: 'Send',
    sent: '✅ Message sent. Thank you!',
    soc_tab: 'Contact/Social',
    soc_s: 'Change phone, WhatsApp, email, address, hours, Maps, Instagram and Facebook here. Changes appear instantly on Home, Contact and Footer.',
    link_soon: 'Will be added soon',
    fb_page: 'Facebook page',
    f_insta: 'Instagram link',
    f_facebook: 'Facebook link',
    f_maps: 'Google Maps link',
    f_whats: 'WhatsApp numbers (comma separated)',
    f_addr_hi: 'Address (Hindi)',
    f_addr_en: 'Address (English)',
    f_hours_hi: 'Hours (Hindi)',
    f_hours_en: 'Hours (English)',
    err_msg: '⚠️ Enter name, 10-digit mobile and message.',
    sc_t: '✅ Thank you! You have been added to the donor list.',
    sc_err: '⚠️ Name, age, city and 10-digit mobile are required.',
    age_err: '⚠️ Age must be between 18 and 65 years.',
    disc: 'This site is for information and coordination only. Always follow a qualified doctor’s advice.',
    npl: 'A not-for-profit organisation — donation saves lives.',
    quick_links: 'Quick Links',
    discl: 'Disclaimer',
    patient: 'Patient name',
    phone: 'Mobile',
    hospital: 'Hospital',
    name: 'Name',
    ok: 'Sufficient'
  }
};

/* ============ घटक (Components) ============ */
function Header({
  page,
  setPage
}) {
  const {
    t,
    lang,
    setLang
  } = useContext(LangCtx);
  const [open, setOpen] = useState(false);
  const links = [['home'], ['find'], ['donate'], ['request'], ['inventory'], ['camps'], ['stories'], ['doctor'], ['about'], ['guide'], ['legal'], ['contact']];
  const go = p => {
    setPage(p);
    setOpen(false);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("header", {
    className: "header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap nav"
  }, /*#__PURE__*/React.createElement("div", {
    className: "brand",
    onClick: () => go('home'),
    style: {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("img", {
    className: "logo",
    src: "img/logo.png",
    alt: "BCBC \u2014 Balaji Charitable Blood Centre",
    width: "44",
    height: "44"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, lang === 'hi' ? 'बालाजी चैरिटेबल ब्लड सेंटर' : 'Balaji Charitable Blood Center'), /*#__PURE__*/React.createElement("small", null, lang === 'hi' ? 'रक्तदान • चिकित्सा • मानवता' : 'Donation • Care • Humanity'))), /*#__PURE__*/React.createElement("div", {
    className: "langbar"
  }, /*#__PURE__*/React.createElement("button", {
    className: lang === 'hi' ? 'on' : '',
    onClick: () => setLang('hi')
  }, "\u0939\u093F\u0928\u094D\u0926\u0940"), /*#__PURE__*/React.createElement("button", {
    className: lang === 'en' ? 'on' : '',
    onClick: () => setLang('en')
  }, "English"), /*#__PURE__*/React.createElement("button", {
    className: "menu-btn",
    onClick: () => setOpen(!open)
  }, "\u2630")), /*#__PURE__*/React.createElement("nav", {
    className: open ? 'open' : ''
  }, links.map(([p]) => /*#__PURE__*/React.createElement("button", {
    key: p,
    className: page === p ? 'on' : '',
    onClick: () => go(p)
  }, t(p)))))));
}
function Home({
  setPage
}) {
  const {
    t,
    lang,
    L
  } = useContext(LangCtx);
  const C = getContact();
  const [g, setG] = useState('O+');
  const [city, setCity] = useState('');
  const banks = LS.get('banks', SEED_BANKS);
  const donors = LS.get('donors', SEED_DONORS);
  const hosp = LS.get('hospitals', SEED_HOSPITALS);
  const total = banks.reduce((s, b) => s + Object.values(b.units).reduce((a, c) => a + c, 0), 0);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("section", {
    className: "hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap hero-in"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, t('tag')), /*#__PURE__*/React.createElement("h1", null, t('h1'), " ", /*#__PURE__*/React.createElement("span", null, t('h2')), " ", t('h3')), /*#__PURE__*/React.createElement("p", null, t('sub')), /*#__PURE__*/React.createElement("div", {
    className: "quick"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setPage('donate')
  }, t('q_donate')), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPage('find')
  }, t('q_find')), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPage('doctor')
  }, t('q_doctor'))), /*#__PURE__*/React.createElement("div", {
    className: "searchbar"
  }, /*#__PURE__*/React.createElement("select", {
    "aria-label": t('f_group'),
    value: g,
    onChange: e => setG(e.target.value)
  }, GROUPS.map(x => /*#__PURE__*/React.createElement("option", {
    key: x
  }, x))), /*#__PURE__*/React.createElement("input", {
    "aria-label": t('city_ph'),
    placeholder: t('city_ph'),
    value: city,
    onChange: e => setCity(e.target.value)
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPage('find')
  }, t('btn')))), /*#__PURE__*/React.createElement("div", {
    className: "hero-art"
  }, /*#__PURE__*/React.createElement("div", {
    className: "big"
  }, "\uD83E\uDE78"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 16,
      margin: '1em 0'
    }
  }, t('today')), /*#__PURE__*/React.createElement("div", {
    className: "line"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", {
    style: {
      fontSize: 20
    }
  }, total, total > 0 ? '+' : ''), /*#__PURE__*/React.createElement("br", null), t('units')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", {
    style: {
      fontSize: 20
    }
  }, hosp.length), /*#__PURE__*/React.createElement("br", null), t('hospitals')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", {
    style: {
      fontSize: 20
    }
  }, donors.length), /*#__PURE__*/React.createElement("br", null), t('donors'))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      marginTop: 8
    }
  }, t('helpline'), ": ", /*#__PURE__*/React.createElement("a", {
    href: 'tel:' + C.tel,
    style: {
      color: '#fff',
      fontWeight: 800,
      textDecoration: 'underline'
    }
  }, fmtPhone(C.phone))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      opacity: .92
    }
  }, "\uD83D\uDD57 ", L(C.hours))))));
}
function Inventory({
  hospitals = false
}) {
  const {
    t,
    L
  } = useContext(LangCtx);
  const banks = LS.get('banks', SEED_BANKS);
  const hosp = LS.get('hospitals', SEED_HOSPITALS);
  const totals = useMemo(() => {
    const x = {};
    GROUPS.forEach(g => x[g] = 0);
    banks.forEach(b => GROUPS.forEach(g => x[g] += b.units[g] || 0));
    return x;
  }, [banks]);
  const st = u => u === 0 ? 'out' : u < 6 ? 'low' : 'ok';
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", null, t('inv_t')), /*#__PURE__*/React.createElement("p", {
    className: "lead"
  }, t('inv_s')), /*#__PURE__*/React.createElement("div", {
    className: "inv-grid"
  }, GROUPS.map(g => {
    const u = totals[g];
    return /*#__PURE__*/React.createElement("div", {
      className: "blood",
      key: g
    }, /*#__PURE__*/React.createElement("div", {
      className: "g"
    }, g), /*#__PURE__*/React.createElement("div", {
      className: "u"
    }, u), /*#__PURE__*/React.createElement("div", {
      className: 's ' + st(u)
    }, t(st(u) === 'out' ? 'none' : st(u) === 'ok' ? 'enough' : 'low')), /*#__PURE__*/React.createElement("div", {
      className: "blood-bar"
    }, /*#__PURE__*/React.createElement("i", {
      style: {
        width: Math.min(100, u * 2) + '%'
      }
    })));
  })), hospitals ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", {
    style: {
      marginTop: 24
    }
  }, t('hosp_t')), /*#__PURE__*/React.createElement("p", {
    className: "small"
  }, t('hosp_s')), !hosp.length ? /*#__PURE__*/React.createElement("p", {
    className: "small"
  }, t('no_hosp')) : /*#__PURE__*/React.createElement("div", {
    className: "table-wrap"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, t('th_hosp')), /*#__PURE__*/React.createElement("th", null, t('th_city')), /*#__PURE__*/React.createElement("th", null, t('th_type')), /*#__PURE__*/React.createElement("th", null, t('th_phone')))), /*#__PURE__*/React.createElement("tbody", null, hosp.map(h => /*#__PURE__*/React.createElement("tr", {
    key: h.id
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, L(h.name))), /*#__PURE__*/React.createElement("td", null, L(h.city) || '—'), /*#__PURE__*/React.createElement("td", null, L(h.type) || '—'), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("a", {
    href: 'tel:' + String(h.phone || '').replace(/\D/g, '')
  }, h.phone)))))))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", {
    style: {
      marginTop: 24
    }
  }, t('banks_t')), !banks.length && /*#__PURE__*/React.createElement("p", {
    className: "small"
  }, t('no_banks')), /*#__PURE__*/React.createElement("div", {
    className: "table-wrap"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, t('th_name')), /*#__PURE__*/React.createElement("th", null, t('th_city')), /*#__PURE__*/React.createElement("th", null, t('th_type')), /*#__PURE__*/React.createElement("th", null, t('th_phone')), /*#__PURE__*/React.createElement("th", null, t('th_units')))), /*#__PURE__*/React.createElement("tbody", null, banks.map(b => /*#__PURE__*/React.createElement("tr", {
    key: b.id
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, L(b.name))), /*#__PURE__*/React.createElement("td", null, L(b.city)), /*#__PURE__*/React.createElement("td", null, L(b.type)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("a", {
    href: 'tel:' + b.phone.replace(/\D/g, '')
  }, b.phone)), /*#__PURE__*/React.createElement("td", null, Object.values(b.units).reduce((a, c) => a + c, 0)))))))));
}
function FindBlood() {
  const {
    t,
    lang,
    L
  } = useContext(LangCtx);
  const [g, setG] = useState('O+');
  const [city, setCity] = useState('');
  const [res, setRes] = useState(null);
  const banks = LS.get('banks', SEED_BANKS);
  const donors = LS.get('donors', SEED_DONORS);
  const search = () => setRes({
    banks: banks.filter(b => (b.units[g] || 0) > 0 && (!city || L(b.city).includes(city))),
    donors: donors.filter(d => COMPAT[g].includes(d.group) && (!city || L(d.city).includes(city)))
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", null, t('find_t')), /*#__PURE__*/React.createElement("p", {
    className: "lead"
  }, t('find_s')), /*#__PURE__*/React.createElement("form", {
    className: "searchbar",
    onSubmit: e => {
      e.preventDefault();
      search();
    }
  }, /*#__PURE__*/React.createElement("select", {
    "aria-label": t('f_group'),
    value: g,
    onChange: e => setG(e.target.value)
  }, GROUPS.map(x => /*#__PURE__*/React.createElement("option", {
    key: x
  }, x))), /*#__PURE__*/React.createElement("input", {
    "aria-label": t('city_any'),
    placeholder: t('city_any'),
    value: city,
    onChange: e => setCity(e.target.value)
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit"
  }, t('btn'))), res && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "alert"
  }, "\u2139\uFE0F ", g, " ", t('for_group'), ": ", /*#__PURE__*/React.createElement("b", null, COMPAT[g].join(', ')), " \u2014 ", t('tot'), " ", /*#__PURE__*/React.createElement("b", null, res.donors.length), " ", t('donors'), ", ", /*#__PURE__*/React.createElement("b", null, res.banks.length), " ", t('banks')), /*#__PURE__*/React.createElement("h3", {
    style: {
      marginTop: 16
    }
  }, t('banks_t')), !res.banks.length && /*#__PURE__*/React.createElement("p", {
    className: "small"
  }, t('no_bank')), res.banks.map(b => /*#__PURE__*/React.createElement("div", {
    className: "donor",
    key: b.id
  }, /*#__PURE__*/React.createElement("div", {
    className: "av"
  }, "\uD83C\uDFE5"), /*#__PURE__*/React.createElement("div", {
    className: "info"
  }, /*#__PURE__*/React.createElement("b", null, L(b.name)), /*#__PURE__*/React.createElement("div", null, L(b.city), " \u2022 ", L(b.type), " \u2022 ", /*#__PURE__*/React.createElement("span", {
    className: "pill"
  }, g, ": ", b.units[g]))), /*#__PURE__*/React.createElement("a", {
    className: "btn sm",
    href: 'tel:' + b.phone.replace(/\D/g, '')
  }, t('call')))), /*#__PURE__*/React.createElement("h3", {
    style: {
      marginTop: 20
    }
  }, t('avail'), " (", res.donors.length, ")"), !res.donors.length && /*#__PURE__*/React.createElement("p", {
    className: "small"
  }, t('no_donor')), res.donors.map(d => /*#__PURE__*/React.createElement("div", {
    className: "donor",
    key: d.id
  }, /*#__PURE__*/React.createElement("div", {
    className: "av"
  }, L(d.name)[0]), /*#__PURE__*/React.createElement("div", {
    className: "info"
  }, /*#__PURE__*/React.createElement("b", null, L(d.name)), " ", /*#__PURE__*/React.createElement("span", {
    className: "pill"
  }, d.group), /*#__PURE__*/React.createElement("div", null, L(d.city), " \u2022 ", d.age, " \u2022 ", d.count, " \u2022 ", t('next_d'), ": ", nextEligible(d, lang))), /*#__PURE__*/React.createElement("a", {
    className: "btn sm",
    href: 'tel:' + d.phone
  }, t('can_call'))))));
}
function Donate() {
  const {
    t,
    lang,
    L
  } = useContext(LangCtx);
  const [f, setF] = useState({
    name: '',
    age: '',
    gender: MALE,
    group: 'O+',
    city: '',
    phone: '',
    last: ''
  });
  const [msg, setMsg] = useState(null);
  const [donors, setDonors] = useState(() => LS.get('donors', SEED_DONORS));
  const submit = e => {
    e.preventDefault();
    const a = Number(f.age);
    if (!f.name || !a || !f.city || !/^[0-9]{10}$/.test(f.phone)) return setMsg(['no', t('sc_err')]);
    if (a < 18 || a > 65) return setMsg(['no', t('age_err')]);
    const next = [{
      id: 'u' + Date.now(),
      name: f.name,
      age: a,
      gender: f.gender,
      group: f.group,
      city: f.city,
      phone: f.phone,
      last: f.last || new Date().toISOString().slice(0, 10),
      count: 1
    }, ...donors];
    setDonors(next);
    LS.set('donors', next);
    const months = f.gender.hi === 'महिला' ? 4 : 3;
    setF({
      name: '',
      age: '',
      gender: MALE,
      group: 'O+',
      city: '',
      phone: '',
      last: ''
    });
    setMsg(['ok', t('sc_t') + ' ' + (lang === 'hi' ? `अगला दान: ${months} महीने बाद` : `Next donation after ${months} months`)]);
  };
  const set = k => e => setF({
    ...f,
    [k]: e.target.value
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", null, t('don_t')), /*#__PURE__*/React.createElement("p", {
    className: "lead"
  }, t('don_s')), /*#__PURE__*/React.createElement("div", {
    className: "two"
  }, /*#__PURE__*/React.createElement("form", {
    className: "form",
    onSubmit: submit
  }, /*#__PURE__*/React.createElement("h3", null, t('reg_t')), /*#__PURE__*/React.createElement("div", {
    className: "two"
  }, /*#__PURE__*/React.createElement("label", null, t('f_name'), /*#__PURE__*/React.createElement("input", {
    value: f.name,
    onChange: set('name')
  })), /*#__PURE__*/React.createElement("label", null, t('f_age'), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: f.age,
    onChange: set('age'),
    placeholder: "25"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "two"
  }, /*#__PURE__*/React.createElement("label", null, t('f_gender'), /*#__PURE__*/React.createElement("select", {
    value: f.gender.hi,
    onChange: e => setF({
      ...f,
      gender: e.target.value === 'महिला' ? FEMALE : MALE
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: "\u092A\u0941\u0930\u0941\u0937"
  }, L(MALE)), /*#__PURE__*/React.createElement("option", {
    value: "\u092E\u0939\u093F\u0932\u093E"
  }, L(FEMALE)))), /*#__PURE__*/React.createElement("label", null, t('f_group'), /*#__PURE__*/React.createElement("select", {
    value: f.group,
    onChange: set('group')
  }, GROUPS.map(g => /*#__PURE__*/React.createElement("option", {
    key: g
  }, g))))), /*#__PURE__*/React.createElement("div", {
    className: "two"
  }, /*#__PURE__*/React.createElement("label", null, t('f_city'), /*#__PURE__*/React.createElement("input", {
    value: f.city,
    onChange: set('city')
  })), /*#__PURE__*/React.createElement("label", null, t('f_phone'), /*#__PURE__*/React.createElement("input", {
    value: f.phone,
    maxLength: "10",
    onChange: set('phone'),
    placeholder: "10"
  }))), /*#__PURE__*/React.createElement("label", null, t('f_last'), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: f.last,
    onChange: set('last')
  })), /*#__PURE__*/React.createElement("label", {
    className: "check"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    required: true
  }), " ", t('agree')), /*#__PURE__*/React.createElement("button", {
    className: "btn red block"
  }, t('register')), msg && /*#__PURE__*/React.createElement("p", {
    className: 'msg ' + msg[0]
  }, msg[1])), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, t('hero_t')), [...donors].sort((a, b) => b.count - a.count).slice(0, 5).map((d, i) => /*#__PURE__*/React.createElement("div", {
    className: "donor",
    key: d.id
  }, /*#__PURE__*/React.createElement("div", {
    className: "av"
  }, i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🎖️'), /*#__PURE__*/React.createElement("div", {
    className: "info"
  }, /*#__PURE__*/React.createElement("b", null, L(d.name)), " ", /*#__PURE__*/React.createElement("span", {
    className: "pill"
  }, d.group), /*#__PURE__*/React.createElement("div", null, L(d.city), " \u2022 ", d.count, " ", t('times'))))), /*#__PURE__*/React.createElement("div", {
    className: "alert"
  }, t('warn')))));
}
function RequestBlood() {
  const {
    t,
    lang,
    L
  } = useContext(LangCtx);
  const [f, setF] = useState({
    patient: '',
    group: 'O+',
    units: 1,
    city: '',
    hospital: '',
    phone: '',
    urgent: D('सामान्य', 'Normal')
  });
  const [msg, setMsg] = useState(null);
  const [alerts, setAlerts] = useState(() => LS.get('alerts', []));
  const donors = LS.get('donors', SEED_DONORS);
  const submit = e => {
    e.preventDefault();
    if (!f.patient || !f.city || !f.hospital || !/^[0-9]{10}$/.test(f.phone)) return setMsg(['no', t('sc_err')]);
    const match = donors.filter(d => COMPAT[f.group].includes(d.group) && L(d.city).includes(f.city));
    const rec = {
      id: 'r' + Date.now(),
      patient: f.patient,
      group: f.group,
      units: f.units,
      city: f.city,
      hospital: f.hospital,
      urgent: f.urgent,
      date: new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN'),
      matched: match.length
    };
    const next = [rec, ...alerts];
    setAlerts(next);
    LS.set('alerts', next);
    setMsg(['ok', (lang === 'hi' ? '✅ अनुरोध दर्ज! ' : '✅ Request saved! ') + match.length + ' ' + (lang === 'hi' ? 'डोनर को अलर्ट भेजा गया।' : 'donors alerted.')]);
  };
  const set = k => e => setF({
    ...f,
    [k]: e.target.value
  });
  const matched = alerts.length ? donors.filter(d => COMPAT[alerts[0].group].includes(d.group) && L(d.city).includes(alerts[0].city)) : [];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", null, t('req_t')), /*#__PURE__*/React.createElement("p", {
    className: "lead"
  }, t('req_s')), /*#__PURE__*/React.createElement("div", {
    className: "two"
  }, /*#__PURE__*/React.createElement("form", {
    className: "form",
    onSubmit: submit
  }, /*#__PURE__*/React.createElement("h3", null, t('req_f')), /*#__PURE__*/React.createElement("div", {
    className: "two"
  }, /*#__PURE__*/React.createElement("label", null, t('f_patient'), /*#__PURE__*/React.createElement("input", {
    value: f.patient,
    onChange: set('patient')
  })), /*#__PURE__*/React.createElement("label", null, t('f_group'), /*#__PURE__*/React.createElement("select", {
    value: f.group,
    onChange: set('group')
  }, GROUPS.map(g => /*#__PURE__*/React.createElement("option", {
    key: g
  }, g))))), /*#__PURE__*/React.createElement("div", {
    className: "two"
  }, /*#__PURE__*/React.createElement("label", null, t('f_units'), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "1",
    max: "20",
    value: f.units,
    onChange: set('units')
  })), /*#__PURE__*/React.createElement("label", null, t('f_urg'), /*#__PURE__*/React.createElement("select", {
    value: f.urgent.hi,
    onChange: e => setF({
      ...f,
      urgent: e.target.value === 'अत्यावश्यक (6 घंटे)' ? D('अत्यावश्यक (6 घंटे)', 'Critical (6 hrs)') : e.target.value === 'जल्दी (24 घंटे)' ? D('जल्दी (24 घंटे)', 'Urgent (24 hrs)') : D('सामान्य', 'Normal')
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: "\u0938\u093E\u092E\u093E\u0928\u094D\u092F"
  }, t('normal')), /*#__PURE__*/React.createElement("option", {
    value: "\u091C\u0932\u094D\u0926\u0940 (24 \u0918\u0902\u091F\u0947)"
  }, t('soon')), /*#__PURE__*/React.createElement("option", {
    value: "\u0905\u0924\u094D\u092F\u093E\u0935\u0936\u094D\u092F\u0915 (6 \u0918\u0902\u091F\u0947)"
  }, t('crit'))))), /*#__PURE__*/React.createElement("div", {
    className: "two"
  }, /*#__PURE__*/React.createElement("label", null, t('f_hosp'), /*#__PURE__*/React.createElement("input", {
    value: f.hospital,
    onChange: set('hospital')
  })), /*#__PURE__*/React.createElement("label", null, t('f_city'), /*#__PURE__*/React.createElement("input", {
    value: f.city,
    onChange: set('city')
  }))), /*#__PURE__*/React.createElement("label", null, t('f_contact'), /*#__PURE__*/React.createElement("input", {
    value: f.phone,
    maxLength: "10",
    onChange: set('phone'),
    placeholder: "10"
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn red block"
  }, t('submit')), msg && /*#__PURE__*/React.createElement("p", {
    className: 'msg ' + msg[0]
  }, msg[1])), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, t('recent')), !alerts.length && /*#__PURE__*/React.createElement("p", {
    className: "small"
  }, t('none_req')), alerts.slice(0, 5).map(a => /*#__PURE__*/React.createElement("div", {
    className: "donor",
    key: a.id
  }, /*#__PURE__*/React.createElement("div", {
    className: "av"
  }, "\uD83C\uDD98"), /*#__PURE__*/React.createElement("div", {
    className: "info"
  }, /*#__PURE__*/React.createElement("b", null, a.group, " \u2014 ", a.units), /*#__PURE__*/React.createElement("div", null, a.hospital, ", ", a.city, " \u2022 ", a.date, " \u2022 ", L(a.urgent)), /*#__PURE__*/React.createElement("div", {
    className: "small"
  }, "\uD83D\uDD14 ", a.matched, " ", t('alerted'))))))), alerts.length > 0 && matched.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement("h3", null, t('match_t')), matched.map(d => /*#__PURE__*/React.createElement("div", {
    className: "donor",
    key: d.id
  }, /*#__PURE__*/React.createElement("div", {
    className: "av"
  }, L(d.name)[0]), /*#__PURE__*/React.createElement("div", {
    className: "info"
  }, /*#__PURE__*/React.createElement("b", null, L(d.name)), " ", /*#__PURE__*/React.createElement("span", {
    className: "pill"
  }, d.group), /*#__PURE__*/React.createElement("div", null, L(d.city), " \u2022 ", t('next_d'), ": ", nextEligible(d, lang))), /*#__PURE__*/React.createElement("a", {
    className: "btn sm",
    href: 'tel:' + d.phone
  }, t('call'))))));
}
function Camps() {
  const {
    t,
    L
  } = useContext(LangCtx);
  const camps = LS.get('camps', CAMPS);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", null, t('camp_t')), /*#__PURE__*/React.createElement("p", {
    className: "lead"
  }, t('camp_s')), !camps.length && /*#__PURE__*/React.createElement("p", {
    className: "small"
  }, t('none')), /*#__PURE__*/React.createElement("div", {
    className: "cal"
  }, camps.map((c, i) => /*#__PURE__*/React.createElement("div", {
    className: "day",
    key: c.id || i
  }, /*#__PURE__*/React.createElement("div", {
    className: "d"
  }, c.d), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, L(c.m), " ", c.y)), /*#__PURE__*/React.createElement("p", {
    className: "small"
  }, "\uD83D\uDD58 ", L(c.time)), /*#__PURE__*/React.createElement("p", {
    className: "small"
  }, "\uD83D\uDCCD ", L(c.place), ", ", L(c.city)), /*#__PURE__*/React.createElement("button", {
    className: "btn sm red"
  }, t('reg_btn'))))), /*#__PURE__*/React.createElement("h3", {
    style: {
      marginTop: 24
    }
  }, t('serv_t')), /*#__PURE__*/React.createElement("div", {
    className: "cards"
  }, SERVICES.map(s => /*#__PURE__*/React.createElement("div", {
    className: "card",
    key: s[1].hi
  }, /*#__PURE__*/React.createElement("div", {
    className: "ic"
  }, s[0]), /*#__PURE__*/React.createElement("h3", null, L(s[1])), /*#__PURE__*/React.createElement("p", null, L(s[2]))))));
}
function Stories() {
  const {
    t,
    L
  } = useContext(LangCtx);
  const stories = LS.get('stories', STORIES);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", null, t('stor_t')), /*#__PURE__*/React.createElement("p", {
    className: "lead"
  }, t('stor_s')), !stories.length && /*#__PURE__*/React.createElement("p", {
    className: "small"
  }, t('no_stories')), /*#__PURE__*/React.createElement("div", {
    className: "cards three"
  }, stories.map((s, i) => /*#__PURE__*/React.createElement("div", {
    className: "card story",
    key: s.id || i
  }, /*#__PURE__*/React.createElement("h3", null, L(s.name), " ", /*#__PURE__*/React.createElement("span", {
    className: "pill"
  }, L(s.city))), /*#__PURE__*/React.createElement("p", {
    className: "q"
  }, "\u201C", L(s.text), "\u201D")))));
}
const SEED_DOCS = [];

/* विभाग का नाम भाषा के हिसाब से (पुराने रिकॉर्ड में हिंदी नाम सेव रहता है) */
const deptName = (hi, lang) => {
  const d = LS.get('doctors', SEED_DOCS).find(x => x.dept && x.dept.hi === hi);
  return d ? lang === 'hi' ? d.dept.hi : d.dept.en : hi;
};

/* ============ एडमिन: हर डेटा के लिए एक ही एडिटर ============ */
const SCHEMAS = {
  banks: [{
    k: 'name',
    type: 'D',
    label: 'th_name'
  }, {
    k: 'city',
    type: 'D',
    label: 'th_city'
  }, {
    k: 'type',
    type: 'D',
    label: 'th_type'
  }, {
    k: 'phone',
    type: 'tel',
    label: 'th_phone'
  }, {
    k: 'units',
    type: 'units',
    label: 'th_units'
  }],
  hospitals: [{
    k: 'name',
    type: 'D',
    label: 'th_hosp'
  }, {
    k: 'city',
    type: 'D',
    label: 'th_city'
  }, {
    k: 'type',
    type: 'D',
    label: 'th_type'
  }, {
    k: 'phone',
    type: 'tel',
    label: 'th_phone'
  }],
  donors: [{
    k: 'name',
    type: 'D',
    label: 'f_name'
  }, {
    k: 'age',
    type: 'number',
    num: true,
    label: 'f_age'
  }, {
    k: 'gender',
    type: 'gender',
    label: 'f_gender'
  }, {
    k: 'group',
    type: 'select',
    opts: GROUPS,
    label: 'f_group'
  }, {
    k: 'city',
    type: 'D',
    label: 'f_city'
  }, {
    k: 'phone',
    type: 'tel',
    label: 'f_phone'
  }, {
    k: 'last',
    type: 'date',
    label: 'f_last'
  }, {
    k: 'count',
    type: 'number',
    num: true,
    label: 'tot_don'
  }],
  camps: [{
    k: 'd',
    type: 'text',
    label: 'da'
  }, {
    k: 'm',
    type: 'D',
    label: 'mon'
  }, {
    k: 'y',
    type: 'number',
    num: true,
    label: 'yr'
  }, {
    k: 'time',
    type: 'D',
    label: 'f_slot'
  }, {
    k: 'city',
    type: 'D',
    label: 'f_city'
  }, {
    k: 'place',
    type: 'D',
    label: 'plc'
  }],
  stories: [{
    k: 'name',
    type: 'D',
    label: 'name'
  }, {
    k: 'city',
    type: 'D',
    label: 'f_city'
  }, {
    k: 'text',
    type: 'D',
    label: 'msg'
  }],
  docs: [{
    k: 'name',
    type: 'D',
    label: 'name'
  }, {
    k: 'dept',
    type: 'D',
    label: 'f_dept'
  }, {
    k: 'spec',
    type: 'D',
    label: 'spec'
  }, {
    k: 'exp',
    type: 'number',
    num: true,
    label: 'exp'
  }, {
    k: 'fee',
    type: 'number',
    num: true,
    label: 'fee'
  }],
  appts: [{
    k: 'name',
    type: 'text',
    label: 'f_patient'
  }, {
    k: 'phone',
    type: 'tel',
    label: 'f_phone'
  }, {
    k: 'dept',
    type: 'text',
    label: 'f_dept'
  }, {
    k: 'date',
    type: 'date',
    label: 'f_date'
  }],
  staff: [{
    k: 'user',
    type: 'text',
    label: 'f_user'
  }, {
    k: 'pass',
    type: 'text',
    label: 'f_pass'
  }, {
    k: 'name',
    type: 'D',
    label: 'f_fullname'
  }, {
    k: 'phone',
    type: 'tel',
    label: 'f_phone'
  }, {
    k: 'role',
    type: 'role',
    label: 'f_role'
  }]
};
function RecForm({
  title,
  fields,
  rec,
  onSave,
  onCancel
}) {
  const {
    t,
    lang,
    L
  } = useContext(LangCtx);
  const [v, setV] = useState(() => {
    const o = {};
    fields.forEach(f => {
      if (f.type === 'D') o[f.k] = rec && rec[f.k] ? [rec[f.k].hi || '', rec[f.k].en || ''] : ['', ''];else if (f.type === 'units') {
        const u = {};
        GROUPS.forEach(g => u[g] = rec && rec[f.k] && rec[f.k][g] || 0);
        o[f.k] = u;
      } else if (f.type === 'gender') o[f.k] = rec && rec[f.k] && rec[f.k].en === 'Female' ? 'f' : 'm';else if (rec && rec[f.k] != null) o[f.k] = String(rec[f.k]);else o[f.k] = f.def != null ? String(f.def) : '';
    });
    return o;
  });
  const set = (k, x) => setV(o => ({
    ...o,
    [k]: x
  }));
  const submit = e => {
    e.preventDefault();
    const out = {};
    fields.forEach(f => {
      if (f.type === 'D') {
        const hi = v[f.k][0].trim(),
          en = v[f.k][1].trim();
        out[f.k] = D(hi || en, en || hi);
      } else if (f.type === 'units') {
        const u = {};
        GROUPS.forEach(g => u[g] = Math.max(0, Number(v[f.k][g] || 0)));
        out[f.k] = u;
      } else if (f.type === 'gender') out[f.k] = v[f.k] === 'f' ? FEMALE : MALE;else if (f.type === 'select' || f.type === 'role') out[f.k] = v[f.k];else if (f.num) out[f.k] = Number(v[f.k] || 0);else out[f.k] = v[f.k].trim();
    });
    onSave(out);
  };
  return /*#__PURE__*/React.createElement("form", {
    className: "form",
    onSubmit: submit,
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("h3", null, title), fields.map(f => {
    if (f.type === 'D') return /*#__PURE__*/React.createElement("div", {
      className: "two",
      key: f.k
    }, /*#__PURE__*/React.createElement("label", null, t(f.label), " (\u0939\u093F\u0928\u094D\u0926\u0940)", /*#__PURE__*/React.createElement("input", {
      value: v[f.k][0],
      onChange: e => set(f.k, [e.target.value, v[f.k][1]])
    })), /*#__PURE__*/React.createElement("label", null, t(f.label), " (English)", /*#__PURE__*/React.createElement("input", {
      value: v[f.k][1],
      onChange: e => set(f.k, [v[f.k][0], e.target.value])
    })));
    if (f.type === 'units') return /*#__PURE__*/React.createElement("div", {
      className: "two",
      key: f.k
    }, GROUPS.map(g => /*#__PURE__*/React.createElement("label", {
      key: g
    }, g, /*#__PURE__*/React.createElement("input", {
      type: "number",
      min: "0",
      value: v[f.k][g],
      onChange: e => set(f.k, {
        ...v[f.k],
        [g]: e.target.value
      })
    }))));
    if (f.type === 'gender') return /*#__PURE__*/React.createElement("label", {
      key: f.k
    }, t(f.label), /*#__PURE__*/React.createElement("select", {
      value: v[f.k],
      onChange: e => set(f.k, e.target.value)
    }, /*#__PURE__*/React.createElement("option", {
      value: "m"
    }, L(MALE)), /*#__PURE__*/React.createElement("option", {
      value: "f"
    }, L(FEMALE))));
    if (f.type === 'role') return /*#__PURE__*/React.createElement("label", {
      key: f.k
    }, t(f.label), /*#__PURE__*/React.createElement("select", {
      value: v[f.k],
      onChange: e => set(f.k, e.target.value)
    }, /*#__PURE__*/React.createElement("option", {
      value: "staff"
    }, L(ROLE_LABEL.staff)), /*#__PURE__*/React.createElement("option", {
      value: "admin"
    }, L(ROLE_LABEL.admin))));
    if (f.type === 'select') return /*#__PURE__*/React.createElement("label", {
      key: f.k
    }, t(f.label), /*#__PURE__*/React.createElement("select", {
      value: v[f.k],
      onChange: e => set(f.k, e.target.value)
    }, f.opts.map(o => /*#__PURE__*/React.createElement("option", {
      key: o,
      value: o
    }, o))));
    return /*#__PURE__*/React.createElement("label", {
      key: f.k
    }, t(f.label), /*#__PURE__*/React.createElement("input", {
      type: f.type === 'date' ? 'date' : f.type === 'tel' ? 'tel' : f.num ? 'number' : 'text',
      value: v[f.k],
      onChange: e => set(f.k, e.target.value)
    }));
  }), /*#__PURE__*/React.createElement("div", {
    className: "two"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn red block",
    type: "submit"
  }, t('save')), /*#__PURE__*/React.createElement("button", {
    className: "btn block",
    type: "button",
    onClick: onCancel
  }, t('cancel'))));
}
function Doctor() {
  const {
    t,
    lang,
    L
  } = useContext(LangCtx);
  const docs = LS.get('doctors', SEED_DOCS);
  const [f, setF] = useState({
    dept: docs[0] ? docs[0].dept.hi : '',
    name: '',
    phone: '',
    date: '',
    slot: D('सुबह 10:00', '10:00 AM')
  });
  const [ok, setOk] = useState(null);
  const book = e => {
    e.preventDefault();
    if (!f.name || !/^[0-9]{10}$/.test(f.phone) || !f.date) return setOk(false);
    const list = [{
      ...f,
      id: Date.now()
    }, ...LS.get('appointments', [])];
    LS.set('appointments', list);
    setOk(true);
    setF({
      ...f,
      name: '',
      phone: '',
      date: ''
    });
  };
  if (!docs.length) return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", null, t('doc_t')), /*#__PURE__*/React.createElement("p", {
    className: "lead"
  }, t('doc_s')), /*#__PURE__*/React.createElement("p", {
    className: "small"
  }, t('no_docs')));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", null, t('doc_t')), /*#__PURE__*/React.createElement("p", {
    className: "lead"
  }, t('doc_s')), /*#__PURE__*/React.createElement("div", {
    className: "cards"
  }, docs.map(d => /*#__PURE__*/React.createElement("div", {
    className: "card",
    key: d.id
  }, /*#__PURE__*/React.createElement("div", {
    className: "ic"
  }, "\uD83D\uDC68\u200D\u2695\uFE0F"), /*#__PURE__*/React.createElement("h3", null, L(d.name)), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "pill"
  }, L(d.dept))), /*#__PURE__*/React.createElement("p", null, L(d.spec), " \u2022 ", d.exp, " ", lang === 'hi' ? 'वर्ष' : 'yrs', " \u2022 \u20B9", d.fee), /*#__PURE__*/React.createElement("button", {
    className: "btn sm red",
    onClick: () => {
      setF({
        ...f,
        dept: d.dept.hi
      });
      document.getElementById('appt').scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, t('book'))))), /*#__PURE__*/React.createElement("form", {
    className: "form",
    id: "appt",
    style: {
      marginTop: 18
    },
    onSubmit: book
  }, /*#__PURE__*/React.createElement("h3", null, t('appt_t')), /*#__PURE__*/React.createElement("div", {
    className: "two"
  }, /*#__PURE__*/React.createElement("label", null, t('f_dept'), /*#__PURE__*/React.createElement("select", {
    value: f.dept,
    onChange: e => setF({
      ...f,
      dept: e.target.value
    })
  }, docs.map(d => /*#__PURE__*/React.createElement("option", {
    key: d.id,
    value: d.dept.hi
  }, L(d.dept))))), /*#__PURE__*/React.createElement("label", null, t('f_patient'), /*#__PURE__*/React.createElement("input", {
    value: f.name,
    onChange: e => setF({
      ...f,
      name: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("div", {
    className: "two"
  }, /*#__PURE__*/React.createElement("label", null, t('f_phone'), /*#__PURE__*/React.createElement("input", {
    value: f.phone,
    maxLength: "10",
    onChange: e => setF({
      ...f,
      phone: e.target.value
    }),
    placeholder: "10"
  })), /*#__PURE__*/React.createElement("label", null, t('f_date'), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: f.date,
    onChange: e => setF({
      ...f,
      date: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("label", null, t('f_slot'), /*#__PURE__*/React.createElement("select", {
    value: f.slot.hi,
    onChange: e => setF({
      ...f,
      slot: D(e.target.value, e.target.value)
    })
  }, ['सुबह 10:00', 'दोपहर 12:00', 'शाम 4:00', 'रात 7:00'].map(s => /*#__PURE__*/React.createElement("option", {
    key: s,
    value: s
  }, lang === 'hi' ? s : s.replace('सुबह', 'AM').replace('दोपहर', 'PM').replace('शाम', 'PM').replace('रात', 'PM'))))), /*#__PURE__*/React.createElement("button", {
    className: "btn red block"
  }, t('confirm')), ok === true && /*#__PURE__*/React.createElement("p", {
    className: "msg ok"
  }, "\u2705 ", lang === 'hi' ? 'अपॉइंटमेंट बुक हो गई!' : 'Appointment booked!'), ok === false && /*#__PURE__*/React.createElement("p", {
    className: "msg no"
  }, "\u26A0\uFE0F ", lang === 'hi' ? 'नाम, 10 अंक का मोबाइल और तारीख़ भरें।' : 'Enter name, 10-digit mobile and date.')));
}
function DonorProfile() {
  const {
    t,
    lang,
    L
  } = useContext(LangCtx);
  const [phone, setPhone] = useState('');
  const [me, setMe] = useState(null);
  const [hist, setHist] = useState(() => LS.get('history', []));
  const donors = LS.get('donors', SEED_DONORS);
  const find = e => {
    e.preventDefault();
    setMe(donors.find(x => x.phone === phone.trim()) || null);
  };
  const donateNow = () => {
    if (!me) return;
    const updated = donors.map(d => d.id === me.id ? {
      ...d,
      last: new Date().toISOString().slice(0, 10),
      count: d.count + 1
    } : d);
    LS.set('donors', updated);
    const h = [{
      date: new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN'),
      group: me.group
    }, ...hist];
    setHist(h);
    LS.set('history', h);
    setMe(updated.find(d => d.id === me.id));
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", null, t('prof_t')), /*#__PURE__*/React.createElement("p", {
    className: "lead"
  }, t('prof_s')), /*#__PURE__*/React.createElement("form", {
    className: "searchbar",
    onSubmit: find
  }, /*#__PURE__*/React.createElement("input", {
    placeholder: t('my_phone'),
    value: phone,
    maxLength: "10",
    onChange: e => setPhone(e.target.value)
  }), /*#__PURE__*/React.createElement("button", null, t('view'))), me && /*#__PURE__*/React.createElement("div", {
    className: "form",
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("h3", null, L(me.name), " ", /*#__PURE__*/React.createElement("span", {
    className: "pill"
  }, me.group)), /*#__PURE__*/React.createElement("div", {
    className: "tiles"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tile"
  }, /*#__PURE__*/React.createElement("b", null, me.count), t('tot_don')), /*#__PURE__*/React.createElement("div", {
    className: "tile"
  }, /*#__PURE__*/React.createElement("b", null, me.last ? new Date(me.last).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN') : '—'), t('last_d')), /*#__PURE__*/React.createElement("div", {
    className: "tile"
  }, /*#__PURE__*/React.createElement("b", null, nextEligible(me, lang)), t('next_elig')), /*#__PURE__*/React.createElement("div", {
    className: "tile"
  }, /*#__PURE__*/React.createElement("b", null, new Date(nextEligible(me, lang)) <= new Date() ? lang === 'hi' ? 'हाँ' : 'Yes' : lang === 'hi' ? 'नहीं' : 'No'), t('elig_now'))), /*#__PURE__*/React.createElement("h3", {
    style: {
      marginTop: 14
    }
  }, t('hist')), !hist.length && /*#__PURE__*/React.createElement("p", {
    className: "small"
  }, t('no_hist')), hist.map((h, i) => /*#__PURE__*/React.createElement("div", {
    className: "donor",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "av"
  }, "\uD83E\uDE78"), /*#__PURE__*/React.createElement("div", {
    className: "info"
  }, /*#__PURE__*/React.createElement("b", null, h.date), " ", /*#__PURE__*/React.createElement("span", {
    className: "pill"
  }, h.group)))), /*#__PURE__*/React.createElement("button", {
    className: "btn green block",
    onClick: donateNow
  }, t('don_today'))), !me && phone.length === 10 && /*#__PURE__*/React.createElement("p", {
    className: "msg no"
  }, t('not_found')));
}

/* ============ स्टाफ / एडमिन लॉगिन ============ */
const DEFAULT_STAFF = [{
  id: 's1',
  user: 'admin',
  pass: 'admin123',
  role: 'admin',
  name: D('सुपर एडमिन', 'Super Admin'),
  phone: '9039914160'
}, {
  id: 's2',
  user: 'office1',
  pass: 'office1@123',
  role: 'staff',
  name: D('ऑफ़िस इंचार्ज — 1', 'Office In-charge — 1'),
  phone: '9039914160'
}, {
  id: 's3',
  user: 'office2',
  pass: 'office2@123',
  role: 'staff',
  name: D('ऑफ़िस इंचार्ज — 2', 'Office In-charge — 2'),
  phone: '9039914160'
}];
const ROLE_LABEL = {
  admin: D('एडमिन', 'Admin'),
  staff: D('ऑफ़िस इंचार्ज', 'Office In-charge')
};

/* पुराना डेमो 'staff' खाता हटाकर दो ऑफ़िस इंचार्ज खाते जोड़ें (सिर्फ़ इस डिवाइस पर —
   क्लाउड पर नहीं भेजते, वरना पुराना डेटा नए डेटा को मिटा सकता है) */
try {
  const cur = LS.get('staff', null);
  if (Array.isArray(cur) && cur.some(s => s.user === 'staff')) {
    const kept = cur.filter(s => s.user !== 'staff');
    ['office1', 'office2'].forEach(u => {
      if (!kept.some(s => s.user === u)) kept.push(DEFAULT_STAFF.find(s => s.user === u));
    });
    localStorage.setItem('bcc_staff', JSON.stringify(kept));
  }
} catch (e) {}

/* पहली बार खोलने पर डिफ़ॉल्ट खाते सिर्फ़ इस डिवाइस पर रखें (क्लाउड पर नहीं भेजते) */
try {
  if (!localStorage.getItem('bcc_staff')) localStorage.setItem('bcc_staff', JSON.stringify(DEFAULT_STAFF));
} catch (e) {}
function LoginPage() {
  const {
    t,
    lang
  } = useContext(LangCtx);
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const submit = e => {
    e.preventDefault();
    const list = LS.get('staff', DEFAULT_STAFF);
    const u = list.find(s => s.user.toLowerCase() === id.trim().toLowerCase() && s.pass === pass);
    if (!u) {
      setErr(t('login_err'));
      return;
    }
    LS.set('session', {
      user: u.user,
      role: u.role,
      at: Date.now()
    });
    LS.set('page', 'admin');
    window.location.reload();
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", null, t('adm_t')), /*#__PURE__*/React.createElement("p", {
    className: "lead"
  }, t('adm_s')), /*#__PURE__*/React.createElement("form", {
    className: "form",
    style: {
      maxWidth: 460,
      margin: '0 auto'
    },
    onSubmit: submit
  }, /*#__PURE__*/React.createElement("h3", null, t('login')), /*#__PURE__*/React.createElement("p", {
    className: "small",
    style: {
      margin: '0 0 2px'
    }
  }, /*#__PURE__*/React.createElement("b", null, t('login_quick'))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn sm",
    onClick: () => setId('admin')
  }, "\uD83D\uDEE1\uFE0F ", t('role_admin')), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn sm",
    onClick: () => setId('office1')
  }, "\uD83D\uDC64 ", t('role_office'), " 1"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn sm",
    onClick: () => setId('office2')
  }, "\uD83D\uDC64 ", t('role_office'), " 2")), /*#__PURE__*/React.createElement("label", null, t('f_user'), /*#__PURE__*/React.createElement("input", {
    value: id,
    onChange: e => setId(e.target.value),
    placeholder: "admin / office1 / office2",
    autoComplete: "username"
  })), /*#__PURE__*/React.createElement("label", null, t('f_pass'), /*#__PURE__*/React.createElement("input", {
    type: "password",
    value: pass,
    onChange: e => setPass(e.target.value),
    autoComplete: "current-password"
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn red block"
  }, t('login')), err && /*#__PURE__*/React.createElement("p", {
    className: "msg no"
  }, err), /*#__PURE__*/React.createElement("p", {
    className: "small"
  }, t('login_note'))));
}
function SocialEditor() {
  const {
    t
  } = useContext(LangCtx);
  const base = getContact();
  const [c, setC] = useState(() => ({
    phone: base.phone,
    whats: (base.whats || []).join(', '),
    email: base.email,
    addrHi: base.addr.hi,
    addrEn: base.addr.en,
    hoursHi: base.hours.hi,
    hoursEn: base.hours.en,
    maps: base.maps,
    insta: base.insta,
    facebook: base.facebook || '',
    qr: base.qr || ''
  }));
  const [ok, setOk] = useState('');
  const f = k => e => setC({
    ...c,
    [k]: e.target.value
  });
  const save = e => {
    e.preventDefault();
    const insta = c.insta.trim();
    const m = insta.match(/instagram\.com\/([^/?#]+)/i);
    LS.set('contact', {
      phone: c.phone.replace(/\D/g, ''),
      whats: c.whats.split(',').map(x => x.replace(/\D/g, '')).filter(Boolean),
      email: c.email.trim(),
      addr: {
        hi: c.addrHi.trim(),
        en: c.addrEn.trim()
      },
      hours: {
        hi: c.hoursHi.trim(),
        en: c.hoursEn.trim()
      },
      maps: c.maps.trim(),
      insta,
      instaHandle: m ? '@' + m[1] : base.instaHandle,
      facebook: c.facebook.trim(),
      qr: c.qr.trim()
    });
    setOk(t('saved'));
  };
  return /*#__PURE__*/React.createElement("form", {
    className: "form",
    onSubmit: save
  }, /*#__PURE__*/React.createElement("h3", null, "\uD83D\uDCDE ", t('soc_tab')), /*#__PURE__*/React.createElement("p", {
    className: "small"
  }, t('soc_s')), /*#__PURE__*/React.createElement("div", {
    className: "two"
  }, /*#__PURE__*/React.createElement("label", null, t('bhelp'), /*#__PURE__*/React.createElement("input", {
    value: c.phone,
    onChange: f('phone'),
    placeholder: "9039914160"
  })), /*#__PURE__*/React.createElement("label", null, t('email'), /*#__PURE__*/React.createElement("input", {
    value: c.email,
    onChange: f('email')
  }))), /*#__PURE__*/React.createElement("label", null, t('f_whats'), /*#__PURE__*/React.createElement("input", {
    value: c.whats,
    onChange: f('whats'),
    placeholder: "9039914160, 7049993303"
  })), /*#__PURE__*/React.createElement("div", {
    className: "two"
  }, /*#__PURE__*/React.createElement("label", null, t('f_addr_hi'), /*#__PURE__*/React.createElement("input", {
    value: c.addrHi,
    onChange: f('addrHi')
  })), /*#__PURE__*/React.createElement("label", null, t('f_addr_en'), /*#__PURE__*/React.createElement("input", {
    value: c.addrEn,
    onChange: f('addrEn')
  }))), /*#__PURE__*/React.createElement("div", {
    className: "two"
  }, /*#__PURE__*/React.createElement("label", null, t('f_hours_hi'), /*#__PURE__*/React.createElement("input", {
    value: c.hoursHi,
    onChange: f('hoursHi')
  })), /*#__PURE__*/React.createElement("label", null, t('f_hours_en'), /*#__PURE__*/React.createElement("input", {
    value: c.hoursEn,
    onChange: f('hoursEn')
  }))), /*#__PURE__*/React.createElement("div", {
    className: "two"
  }, /*#__PURE__*/React.createElement("label", null, t('f_insta'), /*#__PURE__*/React.createElement("input", {
    value: c.insta,
    onChange: f('insta'),
    placeholder: "https://www.instagram.com/..."
  })), /*#__PURE__*/React.createElement("label", null, t('f_facebook'), /*#__PURE__*/React.createElement("input", {
    value: c.facebook,
    onChange: f('facebook'),
    placeholder: "https://www.facebook.com/..."
  }))), /*#__PURE__*/React.createElement("label", null, t('f_maps'), /*#__PURE__*/React.createElement("input", {
    value: c.maps,
    onChange: f('maps'),
    placeholder: "https://maps.google.com/?cid=..."
  })), /*#__PURE__*/React.createElement("label", null, t('f_qr'), /*#__PURE__*/React.createElement("input", {
    value: c.qr,
    onChange: f('qr'),
    placeholder: "img/donate-qr.png"
  })), ok && /*#__PURE__*/React.createElement("p", {
    className: "msg ok"
  }, ok), /*#__PURE__*/React.createElement("button", {
    className: "btn red block"
  }, t('save')));
}
function MyPass({
  staffList,
  setStaffList,
  session,
  addLog
}) {
  const {
    t,
    L
  } = useContext(LangCtx);
  const me = staffList.find(s => s.user === (session && session.user));
  const [cur, setCur] = useState('');
  const [np, setNp] = useState('');
  const [np2, setNp2] = useState('');
  const [m, setM] = useState(null);
  if (!me) return null;
  const save = e => {
    e.preventDefault();
    if (cur !== me.pass) return setM(['no', t('pass_wrong')]);
    if (np.length < 6) return setM(['no', t('pass_short')]);
    if (np !== np2) return setM(['no', t('pass_mismatch')]);
    const next = staffList.map(s => s.id === me.id ? {
      ...s,
      pass: np
    } : s);
    setStaffList(next);
    LS.set('staff', next);
    if (addLog) addLog('Password changed: ' + me.user);
    setCur('');
    setNp('');
    setNp2('');
    setM(['ok', t('pass_changed')]);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", null, "\uD83D\uDD11 ", t('mypass')), /*#__PURE__*/React.createElement("p", {
    className: "lead"
  }, t('mypass_s')), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      maxWidth: 480
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 0
    }
  }, /*#__PURE__*/React.createElement("b", null, t('f_user'), ":"), " ", me.user, " ", /*#__PURE__*/React.createElement("span", {
    className: "pill"
  }, L(ROLE_LABEL[me.role]))), /*#__PURE__*/React.createElement("form", {
    className: "form",
    onSubmit: save
  }, /*#__PURE__*/React.createElement("label", null, t('cur_pass'), /*#__PURE__*/React.createElement("input", {
    type: "password",
    value: cur,
    onChange: e => setCur(e.target.value),
    autoComplete: "current-password"
  })), /*#__PURE__*/React.createElement("div", {
    className: "two"
  }, /*#__PURE__*/React.createElement("label", null, t('new_pass'), /*#__PURE__*/React.createElement("input", {
    type: "password",
    value: np,
    onChange: e => setNp(e.target.value),
    autoComplete: "new-password"
  })), /*#__PURE__*/React.createElement("label", null, t('new_pass2'), /*#__PURE__*/React.createElement("input", {
    type: "password",
    value: np2,
    onChange: e => setNp2(e.target.value),
    autoComplete: "new-password"
  }))), /*#__PURE__*/React.createElement("button", {
    className: "btn red block"
  }, t('save')), m && /*#__PURE__*/React.createElement("p", {
    className: 'msg ' + m[0]
  }, m[1]))));
}
function Admin() {
  const {
    t,
    lang,
    L
  } = useContext(LangCtx);
  const [msg, setMsg] = useState('');
  const [banks, setBanks] = useState(() => LS.get('banks', SEED_BANKS));
  const [d, setD] = useState({
    bank: 1,
    group: 'O+',
    units: 4
  });
  const [donors, setDonors] = useState(() => LS.get('donors', SEED_DONORS));
  const [alerts, setAlerts] = useState(() => LS.get('alerts', []));
  const [appts, setAppts] = useState(() => LS.get('appointments', []));
  const [staffList, setStaffList] = useState(() => LS.get('staff', DEFAULT_STAFF));
  const [hospitals, setHospitals] = useState(() => LS.get('hospitals', SEED_HOSPITALS));
  const [camps, setCamps] = useState(() => LS.get('camps', CAMPS).map((c, i) => ({
    ...c,
    id: c.id || 'camp' + i
  })));
  const [stories, setStories] = useState(() => LS.get('stories', STORIES).map((s, i) => ({
    ...s,
    id: s.id || 'story' + i
  })));
  const [docs, setDocs] = useState(() => LS.get('doctors', SEED_DOCS));
  const [edit, setEdit] = useState(null);
  const [tab, setTab] = useState('inv');
  const [adding, setAdding] = useState(false);
  const [nf, setNf] = useState({
    user: '',
    pass: '',
    role: 'staff',
    name: '',
    phone: '0000000000'
  });
  const [nmsg, setNmsg] = useState(null);
  const session = LS.get('session', null);
  const isAdmin = session && session.role === 'admin';

  // बिना लॉगिन एडमिन पैनल नहीं दिखना चाहिए
  if (!session) return /*#__PURE__*/React.createElement(LoginPage, null);
  const logout = () => {
    LS.set('session', null);
    LS.set('page', 'home');
    window.location.reload();
  };
  const addLog = line => {
    const logs = LS.get('logs', []);
    LS.set('logs', [{
      at: new Date().toLocaleString(lang === 'hi' ? 'hi-IN' : 'en-IN'),
      by: session ? session.user : '-',
      line
    }, ...logs].slice(0, 60));
  };
  const saveBanks = (next, note) => {
    setBanks(next);
    LS.set('banks', next);
    setMsg('✅ ' + note);
    addLog(note);
  };

  /* ===== हर डेटा पर पूरा अधिकार: जोड़ें / बदलें / हटाएँ ===== */
  const DATASETS = {
    banks: {
      list: banks,
      set: setBanks,
      key: 'banks',
      name: r => r.name
    },
    hospitals: {
      list: hospitals,
      set: setHospitals,
      key: 'hospitals',
      name: r => r.name
    },
    donors: {
      list: donors,
      set: setDonors,
      key: 'donors',
      name: r => r.name
    },
    camps: {
      list: camps,
      set: setCamps,
      key: 'camps',
      name: r => r.place
    },
    stories: {
      list: stories,
      set: setStories,
      key: 'stories',
      name: r => r.name
    },
    docs: {
      list: docs,
      set: setDocs,
      key: 'doctors',
      name: r => r.name
    },
    appts: {
      list: appts,
      set: setAppts,
      key: 'appointments',
      name: r => null
    },
    staff: {
      list: staffList,
      set: setStaffList,
      key: 'staff',
      name: r => null
    }
  };
  const saveRecord = (key, rec) => {
    const ds = DATASETS[key];
    if (key === 'staff') {
      if (!rec.user || !rec.pass) return setMsg(t('req_fields'));
      if (staffList.some(x => x.id !== rec.id && x.user.toLowerCase() === rec.user.toLowerCase())) return setMsg(t('dup_user'));
      const cur = staffList.find(x => x.id === rec.id);
      if (cur && cur.role === 'admin' && staffList.filter(x => x.role === 'admin').length < 2) rec = {
        ...rec,
        role: 'admin'
      };
    }
    const exists = ds.list.some(x => x.id === rec.id);
    const next = exists ? ds.list.map(x => x.id === rec.id ? rec : x) : [...ds.list, rec];
    ds.set(next);
    LS.set(ds.key, next);
    addLog((lang === 'hi' ? 'सेव किया: ' : 'Saved: ') + key + ' ' + rec.id);
    setMsg(t('saved'));
    setEdit(null);
  };
  const delRecord = (key, rec) => {
    if (!isAdmin) {
      setMsg(t('admin_only_del'));
      return;
    }
    const ds = DATASETS[key];
    if (key === 'staff' && !canDelete(rec)) return;
    const next = ds.list.filter(x => x.id !== rec.id);
    ds.set(next);
    LS.set(ds.key, next);
    addLog((lang === 'hi' ? 'हटाया: ' : 'Deleted: ') + key + ' ' + rec.id);
    setMsg(t('saved_del'));
  };
  const openEditor = (key, rec) => setEdit({
    key,
    rec
  });
  const rowBtns = (key, rec) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "btn sm",
    title: t('edit'),
    onClick: () => openEditor(key, rec)
  }, "\u270F\uFE0F"), ' ', isAdmin && /*#__PURE__*/React.createElement("button", {
    className: "btn sm",
    title: t('del'),
    onClick: () => {
      if (window.confirm(t('del_q'))) delRecord(key, rec);
    }
  }, "\uD83D\uDDD1\uFE0F"));

  /* स्टाफ जोड़ना — सिर्फ़ लॉगिन-इन एडमिन के पास (स्टाफ टैब) */
  const addStaff = e => {
    e.preventDefault();
    if (!nf.user || !nf.pass) return setNmsg(['no', t('req_fields')]);
    if (staffList.some(s => s.user.toLowerCase() === nf.user.toLowerCase())) return setNmsg(['no', t('dup_user')]);
    const nm = (nf.name || nf.user).trim();
    const next = [...staffList, {
      id: 'u' + Date.now(),
      user: nf.user.trim(),
      pass: nf.pass,
      role: nf.role,
      name: D(nm, nm),
      phone: nf.phone
    }];
    setStaffList(next);
    LS.set('staff', next);
    setNf({
      user: '',
      pass: '',
      role: 'staff',
      name: '',
      phone: '0000000000'
    });
    setNmsg(['ok', t('staff_added')]);
    addLog('Added staff ' + nf.user);
  };

  /* हटाना: खुद को और आख़िरी एडमिन को हटाना बंद (वरना पैनल हमेशा के लिए बंद हो जाएगा) */
  const canDelete = s => {
    if (session && s.user === session.user) return false;
    if (s.role === 'admin' && staffList.filter(x => x.role === 'admin').length < 2) return false;
    return true;
  };
  const delStaff = s => {
    if (!canDelete(s)) return;
    const next = staffList.filter(x => x.id !== s.id);
    setStaffList(next);
    LS.set('staff', next);
    addLog('Removed staff ' + s.user);
  };
  const totalUnits = banks.reduce((s, b) => s + Object.values(b.units).reduce((a, c) => a + c, 0), 0);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "head"
  }, /*#__PURE__*/React.createElement("h2", null, t('dash')), /*#__PURE__*/React.createElement("span", {
    className: "pill"
  }, session ? session.user : '', " \u2022 ", L(ROLE_LABEL[session ? session.role : 'staff']))), /*#__PURE__*/React.createElement("div", {
    className: "tiles"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tile"
  }, /*#__PURE__*/React.createElement("b", null, totalUnits), t('units')), /*#__PURE__*/React.createElement("div", {
    className: "tile"
  }, /*#__PURE__*/React.createElement("b", null, banks.length), t('banks')), /*#__PURE__*/React.createElement("div", {
    className: "tile"
  }, /*#__PURE__*/React.createElement("b", null, hospitals.length), t('hospitals')), /*#__PURE__*/React.createElement("div", {
    className: "tile"
  }, /*#__PURE__*/React.createElement("b", null, donors.length), t('donors')), /*#__PURE__*/React.createElement("div", {
    className: "tile"
  }, /*#__PURE__*/React.createElement("b", null, alerts.length), t('reqs')), /*#__PURE__*/React.createElement("div", {
    className: "tile"
  }, /*#__PURE__*/React.createElement("b", null, appts.length), t('appts')), /*#__PURE__*/React.createElement("div", {
    className: "tile"
  }, /*#__PURE__*/React.createElement("b", null, staffList.length), t('staff'))), /*#__PURE__*/React.createElement("div", {
    className: "tabs"
  }, [['inv', '📦 ' + t('inventory')], ['hos', '🏥 ' + t('hospitals')], ['req', '🆘 ' + t('reqs')], ['don', '🩸 ' + t('donors')], ['app', '👩‍⚕️ ' + t('appts')], ['cmp', '📅 ' + t('camp_tab')], ['str', '💛 ' + t('stories_tab')], ['doc', '👨‍⚕️ ' + t('docs_tab')], isAdmin ? ['soc', '📞 ' + t('soc_tab')] : null, isAdmin ? ['stf', '👥 ' + t('staff')] : null, ['me', '🔑 ' + t('mypass')], ['log', '📜 ' + t('activity')]].filter(Boolean).map(([k, lb]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    className: 'tab' + (tab === k ? ' on' : ''),
    onClick: () => setTab(k)
  }, lb)), /*#__PURE__*/React.createElement("button", {
    className: "tab",
    onClick: logout
  }, "\uD83D\uDEAA ", t('logout'))), msg && /*#__PURE__*/React.createElement("p", {
    className: "msg ok"
  }, msg), !isAdmin && /*#__PURE__*/React.createElement("p", {
    className: "small"
  }, "\u2139\uFE0F ", t('office_note')), edit && /*#__PURE__*/React.createElement(RecForm, {
    title: edit.rec && DATASETS[edit.key].list.some(x => x.id === edit.rec.id) ? '✏️ ' + t('edit') : t(edit.key === 'banks' ? 'add_bank' : edit.key === 'hospitals' ? 'add_hosp' : edit.key === 'donors' ? 'add_donor' : edit.key === 'camps' ? 'add_camp' : edit.key === 'stories' ? 'add_story' : edit.key === 'docs' ? 'add_doc' : edit.key === 'staff' ? 'add_staff' : 'edit'),
    fields: SCHEMAS[edit.key],
    rec: edit.rec,
    onSave: rec => saveRecord(edit.key, {
      ...edit.rec,
      ...rec,
      id: edit.rec.id
    }),
    onCancel: () => setEdit(null)
  }), tab === 'inv' && /*#__PURE__*/React.createElement("div", {
    className: "two"
  }, /*#__PURE__*/React.createElement("form", {
    className: "form",
    onSubmit: e => {
      e.preventDefault();
      const next = banks.map(b => b.id === Number(d.bank) ? {
        ...b,
        units: {
          ...b.units,
          [d.group]: Math.max(0, (b.units[d.group] || 0) + Number(d.units))
        }
      } : b);
      saveBanks(next, lang === 'hi' ? 'इन्वेंटरी अपडेट' : 'Inventory updated');
    }
  }, /*#__PURE__*/React.createElement("h3", null, t('upd_t')), !banks.length && /*#__PURE__*/React.createElement("p", {
    className: "small"
  }, t('no_banks')), /*#__PURE__*/React.createElement("div", {
    className: "two"
  }, /*#__PURE__*/React.createElement("label", null, t('bank'), /*#__PURE__*/React.createElement("select", {
    value: d.bank,
    onChange: e => setD({
      ...d,
      bank: e.target.value
    })
  }, banks.map(b => /*#__PURE__*/React.createElement("option", {
    key: b.id,
    value: b.id
  }, L(b.name))))), /*#__PURE__*/React.createElement("label", null, t('f_group'), /*#__PURE__*/React.createElement("select", {
    value: d.group,
    onChange: e => setD({
      ...d,
      group: e.target.value
    })
  }, GROUPS.map(g => /*#__PURE__*/React.createElement("option", {
    key: g
  }, g))))), /*#__PURE__*/React.createElement("label", null, t('add_u'), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: d.units,
    onChange: e => setD({
      ...d,
      units: e.target.value
    })
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn red block"
  }, t('update'))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, t('banks_t')), /*#__PURE__*/React.createElement("button", {
    className: "btn sm",
    style: {
      marginBottom: 8
    },
    onClick: () => openEditor('banks', {
      id: 'b' + Date.now(),
      units: {}
    })
  }, t('add_bank')), /*#__PURE__*/React.createElement("div", {
    className: "table-wrap"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, t('th_name')), /*#__PURE__*/React.createElement("th", null, t('th_city')), /*#__PURE__*/React.createElement("th", null, t('th_phone')), GROUPS.map(g => /*#__PURE__*/React.createElement("th", {
    key: g
  }, g)), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, banks.map(b => /*#__PURE__*/React.createElement("tr", {
    key: b.id
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, L(b.name))), /*#__PURE__*/React.createElement("td", null, L(b.city)), /*#__PURE__*/React.createElement("td", null, b.phone), GROUPS.map(g => /*#__PURE__*/React.createElement("td", {
    key: g
  }, b.units[g] || 0)), /*#__PURE__*/React.createElement("td", {
    style: {
      whiteSpace: 'nowrap'
    }
  }, rowBtns('banks', b))))))))), tab === 'soc' && isAdmin && /*#__PURE__*/React.createElement(SocialEditor, null), tab === 'hos' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", null, t('hosp_t')), /*#__PURE__*/React.createElement("button", {
    className: "btn sm",
    style: {
      marginBottom: 8
    },
    onClick: () => openEditor('hospitals', {
      id: 'h' + Date.now()
    })
  }, t('add_hosp')), !hospitals.length ? /*#__PURE__*/React.createElement("p", {
    className: "small"
  }, t('no_hosp')) : /*#__PURE__*/React.createElement("div", {
    className: "table-wrap"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, t('th_hosp')), /*#__PURE__*/React.createElement("th", null, t('th_city')), /*#__PURE__*/React.createElement("th", null, t('th_type')), /*#__PURE__*/React.createElement("th", null, t('th_phone')), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, hospitals.map(h => /*#__PURE__*/React.createElement("tr", {
    key: h.id
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, L(h.name))), /*#__PURE__*/React.createElement("td", null, L(h.city) || '—'), /*#__PURE__*/React.createElement("td", null, L(h.type) || '—'), /*#__PURE__*/React.createElement("td", null, h.phone), /*#__PURE__*/React.createElement("td", {
    style: {
      whiteSpace: 'nowrap'
    }
  }, rowBtns('hospitals', h)))))))), tab === 'req' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", null, t('emg_req')), !alerts.length && /*#__PURE__*/React.createElement("p", {
    className: "small"
  }, t('none_req')), alerts.map(a => /*#__PURE__*/React.createElement("div", {
    className: "donor",
    key: a.id
  }, /*#__PURE__*/React.createElement("div", {
    className: "av"
  }, "\uD83C\uDD98"), /*#__PURE__*/React.createElement("div", {
    className: "info"
  }, /*#__PURE__*/React.createElement("b", null, a.group, " \u2014 ", a.units, " ", t('f_units').toLowerCase()), " \u2022 ", L(a.urgent), /*#__PURE__*/React.createElement("div", null, a.patient, " \u2022 ", a.hospital, ", ", a.city, " \u2022 ", a.date, " \u2022 \uD83D\uDD14 ", a.matched, " ", t('alerted')), /*#__PURE__*/React.createElement("div", {
    className: "small"
  }, "\uD83D\uDCDE ", a.phone)), /*#__PURE__*/React.createElement("span", {
    style: {
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn sm green",
    onClick: () => {
      const next = alerts.filter(x => x.id !== a.id);
      setAlerts(next);
      LS.set('alerts', next);
      setMsg('✅ ' + (lang === 'hi' ? 'अनुरोध पूरा हुआ' : 'Request fulfilled'));
      addLog('Fulfilled request ' + a.id);
    }
  }, "\u2705 ", t('fulfil')), ' ', /*#__PURE__*/React.createElement("button", {
    className: "btn sm",
    title: t('del'),
    onClick: () => {
      if (!window.confirm(t('del_q'))) return;
      const next = alerts.filter(x => x.id !== a.id);
      setAlerts(next);
      LS.set('alerts', next);
      setMsg(t('saved_del'));
      addLog('Deleted request ' + a.id);
    }
  }, "\uD83D\uDDD1\uFE0F"))))), tab === 'don' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", null, t('donors'), " (", donors.length, ")"), /*#__PURE__*/React.createElement("button", {
    className: "btn sm",
    style: {
      marginBottom: 8
    },
    onClick: () => openEditor('donors', {
      id: 'd' + Date.now(),
      age: 18,
      gender: MALE,
      group: 'O+',
      count: 0,
      units: {}
    })
  }, t('add_donor')), /*#__PURE__*/React.createElement("div", {
    className: "table-wrap"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, t('f_name')), /*#__PURE__*/React.createElement("th", null, t('f_group')), /*#__PURE__*/React.createElement("th", null, t('f_city')), /*#__PURE__*/React.createElement("th", null, t('f_phone')), /*#__PURE__*/React.createElement("th", null, t('tot_don')), /*#__PURE__*/React.createElement("th", null, t('last_d')), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, donors.map(rr => /*#__PURE__*/React.createElement("tr", {
    key: rr.id
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, L(rr.name))), /*#__PURE__*/React.createElement("td", null, rr.group), /*#__PURE__*/React.createElement("td", null, L(rr.city)), /*#__PURE__*/React.createElement("td", null, rr.phone), /*#__PURE__*/React.createElement("td", null, rr.count), /*#__PURE__*/React.createElement("td", null, rr.last || '—'), /*#__PURE__*/React.createElement("td", {
    style: {
      whiteSpace: 'nowrap'
    }
  }, rowBtns('donors', rr)))))))), tab === 'app' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", null, t('appts'), " (", appts.length, ")"), !appts.length && /*#__PURE__*/React.createElement("p", {
    className: "small"
  }, t('none')), /*#__PURE__*/React.createElement("div", {
    className: "table-wrap"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, t('f_patient')), /*#__PURE__*/React.createElement("th", null, t('f_phone')), /*#__PURE__*/React.createElement("th", null, t('f_dept')), /*#__PURE__*/React.createElement("th", null, t('f_date')), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, appts.map(a => /*#__PURE__*/React.createElement("tr", {
    key: a.id
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, a.name)), /*#__PURE__*/React.createElement("td", null, a.phone), /*#__PURE__*/React.createElement("td", null, deptName(a.dept, lang)), /*#__PURE__*/React.createElement("td", null, a.date), /*#__PURE__*/React.createElement("td", {
    style: {
      whiteSpace: 'nowrap'
    }
  }, rowBtns('appts', a)))))))), tab === 'cmp' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", null, t('camp_t'), " (", camps.length, ")"), /*#__PURE__*/React.createElement("button", {
    className: "btn sm",
    style: {
      marginBottom: 8
    },
    onClick: () => openEditor('camps', {
      id: 'c' + Date.now(),
      d: '',
      y: 2026
    })
  }, t('add_camp')), !camps.length && /*#__PURE__*/React.createElement("p", {
    className: "small"
  }, t('none')), /*#__PURE__*/React.createElement("div", {
    className: "table-wrap"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, t('da')), /*#__PURE__*/React.createElement("th", null, t('mon')), /*#__PURE__*/React.createElement("th", null, t('yr')), /*#__PURE__*/React.createElement("th", null, t('f_slot')), /*#__PURE__*/React.createElement("th", null, t('f_city')), /*#__PURE__*/React.createElement("th", null, t('plc')), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, camps.map(c => /*#__PURE__*/React.createElement("tr", {
    key: c.id
  }, /*#__PURE__*/React.createElement("td", null, c.d), /*#__PURE__*/React.createElement("td", null, L(c.m)), /*#__PURE__*/React.createElement("td", null, c.y), /*#__PURE__*/React.createElement("td", null, L(c.time)), /*#__PURE__*/React.createElement("td", null, L(c.city)), /*#__PURE__*/React.createElement("td", null, L(c.place)), /*#__PURE__*/React.createElement("td", {
    style: {
      whiteSpace: 'nowrap'
    }
  }, rowBtns('camps', c)))))))), tab === 'str' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", null, t('stor_t'), " (", stories.length, ")"), /*#__PURE__*/React.createElement("button", {
    className: "btn sm",
    style: {
      marginBottom: 8
    },
    onClick: () => openEditor('stories', {
      id: 's' + Date.now()
    })
  }, t('add_story')), !stories.length && /*#__PURE__*/React.createElement("p", {
    className: "small"
  }, t('none')), /*#__PURE__*/React.createElement("div", {
    className: "table-wrap"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, t('f_name')), /*#__PURE__*/React.createElement("th", null, t('f_city')), /*#__PURE__*/React.createElement("th", null, t('msg')), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, stories.map(s => /*#__PURE__*/React.createElement("tr", {
    key: s.id
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, L(s.name))), /*#__PURE__*/React.createElement("td", null, L(s.city)), /*#__PURE__*/React.createElement("td", null, L(s.text)), /*#__PURE__*/React.createElement("td", {
    style: {
      whiteSpace: 'nowrap'
    }
  }, rowBtns('stories', s)))))))), tab === 'doc' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", null, t('docs_tab'), " (", docs.length, ")"), /*#__PURE__*/React.createElement("button", {
    className: "btn sm",
    style: {
      marginBottom: 8
    },
    onClick: () => openEditor('docs', {
      id: 'doc' + Date.now(),
      exp: 1,
      fee: 0
    })
  }, t('add_doc')), !docs.length && /*#__PURE__*/React.createElement("p", {
    className: "small"
  }, t('none')), /*#__PURE__*/React.createElement("div", {
    className: "table-wrap"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, t('name')), /*#__PURE__*/React.createElement("th", null, t('f_dept')), /*#__PURE__*/React.createElement("th", null, t('spec')), /*#__PURE__*/React.createElement("th", null, t('exp')), /*#__PURE__*/React.createElement("th", null, t('fee')), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, docs.map(x => /*#__PURE__*/React.createElement("tr", {
    key: x.id
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, L(x.name))), /*#__PURE__*/React.createElement("td", null, L(x.dept)), /*#__PURE__*/React.createElement("td", null, L(x.spec)), /*#__PURE__*/React.createElement("td", null, x.exp), /*#__PURE__*/React.createElement("td", null, x.fee), /*#__PURE__*/React.createElement("td", {
    style: {
      whiteSpace: 'nowrap'
    }
  }, rowBtns('docs', x)))))))), tab === 'stf' && isAdmin && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", null, t('staff_list'), " (", staffList.length, ")"), !staffList.length && /*#__PURE__*/React.createElement("p", {
    className: "small"
  }, t('none')), staffList.map(s => /*#__PURE__*/React.createElement("div", {
    className: "donor",
    key: s.id
  }, /*#__PURE__*/React.createElement("div", {
    className: "av"
  }, s.role === 'admin' ? '🛡️' : '👨‍⚕️'), /*#__PURE__*/React.createElement("div", {
    className: "info"
  }, /*#__PURE__*/React.createElement("b", null, s.user), " ", /*#__PURE__*/React.createElement("span", {
    className: "pill"
  }, L(ROLE_LABEL[s.role])), /*#__PURE__*/React.createElement("div", null, L(s.name), " \u2022 ", s.phone, " \u2022 \uD83D\uDD11 ", s.pass)), /*#__PURE__*/React.createElement("span", {
    style: {
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn sm",
    title: t('edit'),
    onClick: () => openEditor('staff', s)
  }, "\u270F\uFE0F"), ' ', canDelete(s) ? /*#__PURE__*/React.createElement("button", {
    className: "btn sm",
    onClick: () => delStaff(s)
  }, "\uD83D\uDDD1\uFE0F") : /*#__PURE__*/React.createElement("span", {
    className: "pill"
  }, lang === 'hi' ? '🔒 रक्षित' : '🔒 Protected')))), /*#__PURE__*/React.createElement("button", {
    className: "btn block",
    style: {
      marginTop: 10
    },
    onClick: () => {
      setAdding(!adding);
      setNmsg(null);
    }
  }, adding ? '✖ ' + t('cancel') : t('add_staff')), adding && /*#__PURE__*/React.createElement("form", {
    className: "form",
    onSubmit: addStaff,
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "two"
  }, /*#__PURE__*/React.createElement("label", null, t('f_user'), /*#__PURE__*/React.createElement("input", {
    value: nf.user,
    onChange: e => setNf({
      ...nf,
      user: e.target.value
    }),
    autoComplete: "off"
  })), /*#__PURE__*/React.createElement("label", null, t('f_pass'), /*#__PURE__*/React.createElement("input", {
    value: nf.pass,
    onChange: e => setNf({
      ...nf,
      pass: e.target.value
    }),
    autoComplete: "new-password"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "two"
  }, /*#__PURE__*/React.createElement("label", null, t('f_role'), /*#__PURE__*/React.createElement("select", {
    value: nf.role,
    onChange: e => setNf({
      ...nf,
      role: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: "staff"
  }, L(ROLE_LABEL.staff)), /*#__PURE__*/React.createElement("option", {
    value: "admin"
  }, L(ROLE_LABEL.admin)))), /*#__PURE__*/React.createElement("label", null, t('f_phone'), /*#__PURE__*/React.createElement("input", {
    value: nf.phone,
    maxLength: "10",
    onChange: e => setNf({
      ...nf,
      phone: e.target.value
    }),
    placeholder: "0000000000"
  }))), /*#__PURE__*/React.createElement("label", null, t('f_fullname'), /*#__PURE__*/React.createElement("input", {
    value: nf.name,
    onChange: e => setNf({
      ...nf,
      name: e.target.value
    })
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn red block"
  }, t('save')), nmsg && /*#__PURE__*/React.createElement("p", {
    className: 'msg ' + nmsg[0]
  }, nmsg[1]))), tab === 'me' && /*#__PURE__*/React.createElement(MyPass, {
    staffList: staffList,
    setStaffList: setStaffList,
    session: session,
    addLog: addLog
  }), tab === 'log' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", null, "\uD83D\uDCDC ", t('activity')), !LS.get('logs', []).length && /*#__PURE__*/React.createElement("p", {
    className: "small"
  }, t('none')), /*#__PURE__*/React.createElement("div", {
    className: "table-wrap"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, lang === 'hi' ? 'कब' : 'When'), /*#__PURE__*/React.createElement("th", null, lang === 'hi' ? 'किसने' : 'By'), /*#__PURE__*/React.createElement("th", null, lang === 'hi' ? 'क्या' : 'Action'))), /*#__PURE__*/React.createElement("tbody", null, LS.get('logs', []).map((l, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", null, l.at), /*#__PURE__*/React.createElement("td", null, l.by), /*#__PURE__*/React.createElement("td", null, l.line))))))));
}
function Guide() {
  const {
    t,
    L
  } = useContext(LangCtx);
  const [open, setOpen] = useState(0);
  const prep = [['b1', 'b1d'], ['b2', 'b2d'], ['b3', 'b3d'], ['b4', 'b4d']];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", null, t('g_t_t')), /*#__PURE__*/React.createElement("p", {
    className: "lead"
  }, t('g_t_s')), FAQ.map((f, i) => /*#__PURE__*/React.createElement("div", {
    className: "faq",
    key: i
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(open === i ? -1 : i)
  }, open === i ? '▼' : '▶', " ", L(f[0])), open === i && /*#__PURE__*/React.createElement("div", {
    className: "a"
  }, L(f[1])))), /*#__PURE__*/React.createElement("h3", {
    style: {
      marginTop: 22
    }
  }, t('before')), /*#__PURE__*/React.createElement("div", {
    className: "cards"
  }, prep.map(p => /*#__PURE__*/React.createElement("div", {
    className: "card",
    key: p[0]
  }, /*#__PURE__*/React.createElement("div", {
    className: "ic"
  }, p[0] === 'b1' ? '🍽️' : p[0] === 'b2' ? '💧' : p[0] === 'b3' ? '😴' : '💊'), /*#__PURE__*/React.createElement("h3", null, t(p[0])), /*#__PURE__*/React.createElement("p", null, t(p[1]))))));
}
function QrImg({
  src,
  soon
}) {
  const [bad, setBad] = useState(false);
  if (!src || bad) return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 180,
      height: 180,
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px dashed #d9b3b3',
      borderRadius: 12,
      color: '#8a6a6a',
      fontSize: 12,
      textAlign: 'center',
      padding: 10
    }
  }, soon);
  return /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "UPI QR Code",
    onError: () => setBad(true),
    style: {
      width: 186,
      height: 186,
      objectFit: 'contain',
      margin: '0 auto',
      display: 'block',
      imageRendering: 'pixelated'
    }
  });
}
function CopyBtn({
  text,
  label
}) {
  const [ok, setOk] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      } catch (e2) {
        return;
      }
    }
    setOk(true);
    setTimeout(() => setOk(false), 1600);
  };
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn sm",
    onClick: copy
  }, ok ? '✅' : '📋', " ", label);
}
function Donate51() {
  const {
    t,
    lang
  } = useContext(LangCtx);
  const C = getContact();
  const [open, setOpen] = useState(false);
  const [amt, setAmt] = useState(51);
  const amounts = [51, 101, 251, 501, 1100];
  const upiId = '57798701@ubin';
  const upiLink = 'upi://pay?pa=' + encodeURIComponent(upiId) + '&pn=' + encodeURIComponent('BALAJI SEVA SANSTHAN TR') + '&am=' + amt + '.00&cu=INR';
  const sendLabel = lang === 'hi' ? '📲 UPI ऐप में ₹' + amt + ' भेजें' : '📲 Send ₹' + amt + ' via UPI app';
  const scanNote = lang === 'hi' ? 'स्कैन करने के बाद राशि ₹' + amt + ' डालें' : 'Enter ₹' + amt + ' after scanning';
  return /*#__PURE__*/React.createElement("section", {
    className: "card",
    style: {
      marginTop: 10,
      borderLeft: '4px solid #15803d',
      background: 'linear-gradient(135deg,#f2fbf5,#fff6f4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 280px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 16,
      margin: 0
    }
  }, "\uD83D\uDE4F ", t('d51_t')), /*#__PURE__*/React.createElement("p", {
    className: "lead",
    style: {
      margin: '6px 0 0'
    }
  }, t('d51_s'))), /*#__PURE__*/React.createElement("button", {
    className: "btn red",
    onClick: () => setOpen(!open),
    style: {
      flex: '0 0 auto'
    }
  }, open ? '✕ ' + t('d51_close') : '🙏 ' + t('d51_btn'))), open && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "small",
    style: {
      margin: '0 0 7px'
    }
  }, /*#__PURE__*/React.createElement("b", null, t('d51_amt'), ":")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      marginBottom: 12
    }
  }, amounts.map(a => /*#__PURE__*/React.createElement("button", {
    key: a,
    type: "button",
    onClick: () => setAmt(a),
    className: 'btn sm' + (amt === a ? ' red' : ''),
    style: {
      minWidth: 78
    }
  }, "\u20B9", a))), /*#__PURE__*/React.createElement("div", {
    className: "two"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(QrImg, {
    src: C.qr,
    soon: t('qr_soon')
  }), /*#__PURE__*/React.createElement("p", {
    className: "small",
    style: {
      marginTop: 8,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("b", null, t('qr_upi'), ":"), " ", /*#__PURE__*/React.createElement("b", null, upiId), " ", /*#__PURE__*/React.createElement(CopyBtn, {
    text: upiId,
    label: t('copy')
  })), /*#__PURE__*/React.createElement("p", {
    className: "small",
    style: {
      margin: 0
    }
  }, scanNote)), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("p", {
    className: "small",
    style: {
      marginTop: 0
    }
  }, t('d51_how')), /*#__PURE__*/React.createElement("a", {
    className: "btn red block",
    href: upiLink,
    style: {
      textDecoration: 'none'
    }
  }, sendLabel), /*#__PURE__*/React.createElement("p", {
    className: "small",
    style: {
      marginBottom: 0,
      marginTop: 10
    }
  }, "\uD83D\uDCDE ", t('d51_note'))))));
}
function About() {
  const {
    t,
    L
  } = useContext(LangCtx);
  const C = getContact();
  const pledges = [t('pl1'), t('pl2'), t('pl3'), t('pl4'), t('pl5')];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", null, t('ab_t')), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      borderLeft: '4px solid #b91c1c',
      background: '#fff5f5',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "q",
    style: {
      fontSize: 17,
      fontStyle: 'italic',
      marginBottom: 4
    }
  }, "\u201C", t('quote'), "\u201D"), /*#__PURE__*/React.createElement("p", {
    className: "small",
    style: {
      margin: 0
    }
  }, "\u2014 ", t('quote_by'))), /*#__PURE__*/React.createElement("div", {
    className: "two",
    style: {
      alignItems: 'stretch'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 0
    }
  }, t('p1')), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 10,
      marginBottom: 0
    }
  }, t('p2')), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      paddingTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff7f7',
      border: '1px solid #f3d6d6',
      borderRadius: 12,
      padding: '12px 14px'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 6px',
      fontSize: 16
    }
  }, t('vis')), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, t('vis_t'))))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 2px',
      fontSize: 17
    }
  }, t('pledge')), /*#__PURE__*/React.createElement("ul", {
    className: "legal",
    style: {
      listStyle: 'none',
      padding: 0,
      margin: '10px 0 0',
      display: 'grid',
      gap: 7
    }
  }, pledges.map((x, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'flex-start',
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#15803d',
      fontWeight: 900
    }
  }, "\u2705"), /*#__PURE__*/React.createElement("span", null, x)))))), /*#__PURE__*/React.createElement("h3", {
    style: {
      marginTop: 28
    }
  }, t('ct_t')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))',
      gap: 11,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ic"
  }, "\uD83D\uDCDE"), /*#__PURE__*/React.createElement("b", null, t('don_contact')), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '5px 0 0'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: 'tel:' + C.tel
  }, /*#__PURE__*/React.createElement("b", null, fmtPhone(C.phone)))), C.whats && C.whats.length > 0 && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0'
    }
  }, "\uD83D\uDCAC ", t('whatsapp'), ": ", C.whats.map((w, i) => /*#__PURE__*/React.createElement("span", {
    key: w
  }, i > 0 ? ' · ' : '', /*#__PURE__*/React.createElement("a", {
    href: 'https://wa.me/91' + w,
    target: "_blank",
    rel: "noopener noreferrer"
  }, fmtPhone(w)))))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ic"
  }, "\uD83D\uDD57"), /*#__PURE__*/React.createElement("b", null, t('time')), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '5px 0 0'
    }
  }, L(C.hours)), /*#__PURE__*/React.createElement("p", {
    className: "small",
    style: {
      margin: '4px 0 0'
    }
  }, t('time_note'))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ic"
  }, "\uD83D\uDCCD"), /*#__PURE__*/React.createElement("b", null, t('addr')), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '5px 0 0'
    }
  }, L(C.addr)), /*#__PURE__*/React.createElement("p", {
    className: "small",
    style: {
      margin: '6px 0 0'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: C.maps,
    target: "_blank",
    rel: "noopener noreferrer"
  }, t('map_open')))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ic"
  }, "\u2709\uFE0F"), /*#__PURE__*/React.createElement("b", null, t('email')), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '5px 0 0',
      wordBreak: 'break-all'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: 'mailto:' + C.email
  }, C.email)), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '7px 0 0'
    }
  }, "\uD83D\uDCF7 ", /*#__PURE__*/React.createElement("a", {
    href: C.insta,
    target: "_blank",
    rel: "noopener noreferrer"
  }, C.instaHandle)), C.facebook && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '5px 0 0'
    }
  }, "\uD83D\uDCD8 ", /*#__PURE__*/React.createElement("a", {
    href: C.facebook,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Facebook")))), /*#__PURE__*/React.createElement("h3", {
    style: {
      marginTop: 28
    }
  }, "\uD83D\uDCB3 ", t('bank_t')), /*#__PURE__*/React.createElement("p", {
    className: "lead"
  }, t('bank_s')), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      borderLeft: '4px solid #15803d',
      background: '#f2fbf5',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "q",
    style: {
      fontSize: 16,
      fontStyle: 'italic',
      margin: 0
    }
  }, "\uD83D\uDE4F \u201C", t('quote2'), "\u201D")), /*#__PURE__*/React.createElement("div", {
    className: "two",
    style: {
      alignItems: 'stretch'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, t('bank_name'), ":"), " Union Bank of India"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, t('branch'), ":"), " Geeta Bhawan"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, t('acc_name'), ":"), " ", t('trust_name')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, t('acc_no'), ":"), " ", /*#__PURE__*/React.createElement("b", null, "520202050000068"), " ", /*#__PURE__*/React.createElement(CopyBtn, {
    text: "520202050000068",
    label: t('copy')
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "IFSC:"), " ", /*#__PURE__*/React.createElement("b", null, "UBIN0552020"), " ", /*#__PURE__*/React.createElement(CopyBtn, {
    text: "UBIN0552020",
    label: t('copy')
  })))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 8px',
      fontSize: 17
    }
  }, "\uD83D\uDCF1 ", t('qr_t')), /*#__PURE__*/React.createElement(QrImg, {
    src: C.qr,
    soon: t('qr_soon')
  }), /*#__PURE__*/React.createElement("p", {
    className: "small",
    style: {
      marginTop: 10,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("b", null, t('qr_upi'), ":"), " ", /*#__PURE__*/React.createElement("b", null, "57798701@ubin"), " ", /*#__PURE__*/React.createElement(CopyBtn, {
    text: "57798701@ubin",
    label: t('copy')
  })), /*#__PURE__*/React.createElement("p", {
    className: "small",
    style: {
      margin: 0
    }
  }, t('qr_s')))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      background: '#fffaf5',
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "small",
    style: {
      margin: 0
    }
  }, "\uD83D\uDCDE ", t('bank_note'), " ", /*#__PURE__*/React.createElement("a", {
    href: "tel:+917583017789"
  }, fmtPhone('7583017789')), " \xB7 ", /*#__PURE__*/React.createElement("a", {
    href: "tel:+917049993303"
  }, fmtPhone('7049993303')), " ", /*#__PURE__*/React.createElement("b", null, t('tax_note'))), /*#__PURE__*/React.createElement("p", {
    className: "small",
    style: {
      margin: '7px 0 0'
    }
  }, "\uD83E\uDE78 ", t('blood_only'))));
}
function Legal() {
  const {
    t,
    lang,
    L
  } = useContext(LangCtx);
  const extra = [{
    hi: 'गोपनीयता नीति',
    en: 'Privacy Policy',
    d: D('डोनर/मरीज़ के डेटा का DPDP Act 2023 प्रावधान।', 'DPDP Act 2023 data-protection policy for donors and patients.')
  }, {
    hi: 'नियम एवं शर्तें',
    en: 'Terms & Conditions',
    d: D('साइट की शर्तें और दान नीति।', 'Website terms and donation policy.')
  }, {
    hi: 'चिकित्सा अस्वीकरण',
    en: 'Medical Disclaimer',
    d: D('रोग पहचान व उपचार के लिए योग्य चिकित्सक की सलाह लें।', 'Always follow advice of a qualified doctor.')
  }, {
    hi: 'कुकी सहमति',
    en: 'Cookie Consent',
    d: D('Analytics से पहले सहमति बैनर।', 'Consent banner before analytics.')
  }, {
    hi: 'सुगम्यता (A11Y)',
    en: 'Accessibility (A11Y)',
    d: D('WCAG के अनुसार सुगम्यता प्रतिज्ञा।', 'WCAG accessibility statement.')
  }, {
    hi: 'दान / CSR (80G)',
    en: 'Donation / CSR (80G)',
    d: D('दान विवरण, 80G लाभ और वित्तीय रिपोर्ट।', 'Donation details, 80G benefit and financial reports.')
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", null, t('lg_t')), /*#__PURE__*/React.createElement("p", {
    className: "lead"
  }, t('lg_s')), /*#__PURE__*/React.createElement("div", {
    className: "card legal"
  }, /*#__PURE__*/React.createElement("ol", null, LEGAL.map(l => /*#__PURE__*/React.createElement("li", {
    key: l[0].hi
  }, /*#__PURE__*/React.createElement("b", null, L(l[0]), ":"), " ", L(l[1]))))), /*#__PURE__*/React.createElement("h3", {
    style: {
      marginTop: 22
    }
  }, t('pg_t')), /*#__PURE__*/React.createElement("div", {
    className: "cards"
  }, extra.map(x => /*#__PURE__*/React.createElement("div", {
    className: "card",
    key: x.en
  }, /*#__PURE__*/React.createElement("div", {
    className: "ic"
  }, "\uD83D\uDCC4"), /*#__PURE__*/React.createElement("h3", null, x[lang]), /*#__PURE__*/React.createElement("p", null, L(x.d)), /*#__PURE__*/React.createElement("p", {
    className: "small"
  }, lang === 'hi' ? x.en : x.hi)))), /*#__PURE__*/React.createElement("div", {
    className: "alert"
  }, t('lg_note')));
}
function Contact() {
  const {
    t,
    lang,
    L
  } = useContext(LangCtx);
  const C = getContact();
  const [f, setF] = useState({
    name: '',
    phone: '',
    msg: ''
  });
  const [st, setSt] = useState('');
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", null, t('ct_t')), /*#__PURE__*/React.createElement("div", {
    className: "two"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      display: 'grid',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("li", null, "\uD83D\uDCCD ", /*#__PURE__*/React.createElement("b", null, t('addr'), ":"), /*#__PURE__*/React.createElement("br", null), L(C.addr)), /*#__PURE__*/React.createElement("li", null, "\uD83D\uDCDE ", /*#__PURE__*/React.createElement("b", null, t('bhelp'), ":"), " ", /*#__PURE__*/React.createElement("a", {
    href: 'tel:' + C.tel
  }, fmtPhone(C.phone))), /*#__PURE__*/React.createElement("li", null, "\uD83D\uDCAC ", /*#__PURE__*/React.createElement("b", null, t('whatsapp'), ":"), " ", C.whats.map((w, i) => /*#__PURE__*/React.createElement("span", {
    key: w
  }, i > 0 && ' · ', /*#__PURE__*/React.createElement("a", {
    href: 'https://wa.me/91' + w,
    target: "_blank",
    rel: "noopener noreferrer"
  }, fmtPhone(w))))), /*#__PURE__*/React.createElement("li", null, "\u2709\uFE0F ", /*#__PURE__*/React.createElement("b", null, t('email'), ":"), " ", /*#__PURE__*/React.createElement("a", {
    href: 'mailto:' + C.email
  }, C.email)), /*#__PURE__*/React.createElement("li", null, "\uD83D\uDD57 ", /*#__PURE__*/React.createElement("b", null, t('time'), ":"), " ", L(C.hours)), /*#__PURE__*/React.createElement("li", null, "\uD83D\uDCF7 ", /*#__PURE__*/React.createElement("b", null, "Instagram:"), " ", /*#__PURE__*/React.createElement("a", {
    href: C.insta,
    target: "_blank",
    rel: "noopener noreferrer"
  }, C.instaHandle)), /*#__PURE__*/React.createElement("li", null, "\uD83D\uDCD8 ", /*#__PURE__*/React.createElement("b", null, "Facebook:"), " ", C.facebook ? /*#__PURE__*/React.createElement("a", {
    href: C.facebook,
    target: "_blank",
    rel: "noopener noreferrer"
  }, t('fb_page')) : /*#__PURE__*/React.createElement("span", {
    className: "small"
  }, t('link_soon')))), /*#__PURE__*/React.createElement("a", {
    className: "btn block",
    href: C.maps,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      marginTop: 12
    }
  }, t('map_open'))), /*#__PURE__*/React.createElement("form", {
    className: "form",
    onSubmit: e => {
      e.preventDefault();
      if (!f.name || !f.msg || !/^[0-9]{10}$/.test(f.phone)) return setSt('no');
      setSt('ok');
      setF({
        name: '',
        phone: '',
        msg: ''
      });
    }
  }, /*#__PURE__*/React.createElement("h3", null, t('msg_t')), /*#__PURE__*/React.createElement("label", null, t('f_name'), /*#__PURE__*/React.createElement("input", {
    value: f.name,
    onChange: e => setF({
      ...f,
      name: e.target.value
    })
  })), /*#__PURE__*/React.createElement("label", null, t('f_phone'), /*#__PURE__*/React.createElement("input", {
    value: f.phone,
    maxLength: "10",
    onChange: e => setF({
      ...f,
      phone: e.target.value
    }),
    placeholder: "10"
  })), /*#__PURE__*/React.createElement("label", null, lang === 'hi' ? 'संदेश' : 'Message', /*#__PURE__*/React.createElement("textarea", {
    rows: "4",
    value: f.msg,
    onChange: e => setF({
      ...f,
      msg: e.target.value
    })
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn red block"
  }, t('send')), st === 'ok' && /*#__PURE__*/React.createElement("p", {
    className: "msg ok"
  }, t('sent')), st === 'no' && /*#__PURE__*/React.createElement("p", {
    className: "msg no"
  }, t('err_msg')))));
}
function Footer({
  setPage
}) {
  const {
    t,
    lang,
    L
  } = useContext(LangCtx);
  const C = getContact();
  return /*#__PURE__*/React.createElement("footer", {
    className: "footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap footer-in"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "\uD83E\uDE78 ", lang === 'hi' ? 'बालाजी चैरिटेबल ब्लड सेंटर' : 'Balaji Charitable Blood Center'), /*#__PURE__*/React.createElement("p", null, t('npl')), /*#__PURE__*/React.createElement("p", null, "\uD83D\uDCCD ", L(C.addr)), /*#__PURE__*/React.createElement("p", null, "\uD83D\uDCDE ", /*#__PURE__*/React.createElement("a", {
    href: 'tel:' + C.tel,
    style: {
      color: '#fecaca'
    }
  }, fmtPhone(C.phone)), " \xB7 \uD83D\uDD57 ", L(C.hours)), /*#__PURE__*/React.createElement("p", null, "\u2709\uFE0F ", /*#__PURE__*/React.createElement("a", {
    href: 'mailto:' + C.email,
    style: {
      color: '#fecaca'
    }
  }, C.email)), /*#__PURE__*/React.createElement("p", null, "\uD83D\uDCF7 ", /*#__PURE__*/React.createElement("a", {
    href: C.insta,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      color: '#fecaca'
    }
  }, "Instagram"), C.facebook && /*#__PURE__*/React.createElement(React.Fragment, null, " \xB7 \uD83D\uDCD8 ", /*#__PURE__*/React.createElement("a", {
    href: C.facebook,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      color: '#fecaca'
    }
  }, "Facebook")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, t('quick_links')), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => setPage('home')
  }, "\uD83C\uDFE0 ", t('home')), " \u2022 ", /*#__PURE__*/React.createElement("button", {
    onClick: () => setPage('donate')
  }, t('donate')), " \u2022 ", /*#__PURE__*/React.createElement("button", {
    onClick: () => setPage('find')
  }, t('find')), " \u2022 ", /*#__PURE__*/React.createElement("button", {
    onClick: () => setPage('inventory')
  }, t('inventory'))), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => setPage('guide')
  }, t('guide')), " \u2022 ", /*#__PURE__*/React.createElement("button", {
    onClick: () => setPage('legal')
  }, t('legal')), " \u2022 ", /*#__PURE__*/React.createElement("button", {
    onClick: () => setPage('admin')
  }, t('admin')))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, t('discl')), /*#__PURE__*/React.createElement("p", null, t('disc')), /*#__PURE__*/React.createElement("p", null, "\xA9 ", new Date().getFullYear()))));
}
function App() {
  const [lang, setLangState] = useState(() => LS.get('lang', 'hi'));
  const [page, setPageState] = useState(() => LS.get('page', 'home'));
  const setPage = p => {
    setPageState(p);
    LS.set('page', p);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  const setLang = l => {
    setLangState(l);
    LS.set('lang', l);
    document.documentElement.lang = l;
  };
  const t = k => LABELS[lang] && LABELS[lang][k] || k;
  const L = o => o && typeof o === 'object' && o.hi !== undefined ? o[lang] : o;
  const ctx = useMemo(() => ({
    lang,
    setLang,
    t,
    L
  }), [lang]);
  return /*#__PURE__*/React.createElement(LangCtx.Provider, {
    value: ctx
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Header, {
    page: page,
    setPage: setPage
  }), /*#__PURE__*/React.createElement("main", {
    className: "wrap section"
  }, page === 'home' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Home, {
    setPage: setPage
  }), /*#__PURE__*/React.createElement(Donate51, null), /*#__PURE__*/React.createElement("hr", {
    className: "sep"
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 21,
      margin: '1em 0'
    }
  }, lang === 'hi' ? '🏃 तुरंत काम आने वाले लिंक' : '🏃 Quick Actions'), /*#__PURE__*/React.createElement("div", {
    className: "quick"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setPage('home')
  }, "\uD83C\uDFE0 ", t('home')), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPage('request')
  }, t('q_req')), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPage('profile')
  }, t('q_profile')), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPage('admin')
  }, t('q_admin'))), /*#__PURE__*/React.createElement("hr", {
    className: "sep"
  }), /*#__PURE__*/React.createElement(Inventory, {
    hospitals: true
  })), page === 'find' && /*#__PURE__*/React.createElement(FindBlood, null), page === 'donate' && /*#__PURE__*/React.createElement(Donate, null), page === 'request' && /*#__PURE__*/React.createElement(RequestBlood, null), page === 'inventory' && /*#__PURE__*/React.createElement(Inventory, null), page === 'camps' && /*#__PURE__*/React.createElement(Camps, null), page === 'stories' && /*#__PURE__*/React.createElement(Stories, null), page === 'doctor' && /*#__PURE__*/React.createElement(Doctor, null), page === 'profile' && /*#__PURE__*/React.createElement(DonorProfile, null), page === 'admin' && /*#__PURE__*/React.createElement(Admin, null), page === 'guide' && /*#__PURE__*/React.createElement(Guide, null), page === 'about' && /*#__PURE__*/React.createElement(About, null), page === 'legal' && /*#__PURE__*/React.createElement(Legal, null), page === 'contact' && /*#__PURE__*/React.createElement(Contact, null)), /*#__PURE__*/React.createElement(Footer, {
    setPage: setPage
  })));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));