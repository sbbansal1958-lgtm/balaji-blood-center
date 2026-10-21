बालाजी ब्लड सेंटर — काम कैसे करना है
====================================

यह एक अलग प्रोजेक्ट है (Firebase प्रोजेक्ट: bloodbank-9b325)
लाइव: https://bloodbank-9b325.web.app

फ़ोल्डर की बनावट
----------------
blood-center\
  index.html            ← HTML + CSS (पेज की shell) + क्लाउड बूट लोडर
  js\cloud.js           ← Firestore सिंक (साझा डेटा, ऑफ़लाइन कतार)
  js\app.js             ← असली ऐप कोड (इसे हाथ से न बदलें!)
  src\app.jsx           ← असली स्रोत फ़ाइल (यही बदलें)
  vendor\               ← React की लोकल फ़ाइलें (इंटरनेट ज़रूरी नहीं)
  sw.js                 ← service worker (ऑफ़लाइन चलाने के लिए)
  manifest.webmanifest  ← PWA (ऐप इंस्टॉल करने के लिए)
  icons\                ← PWA आइकन
  img\donate-qr.png     ← असली UPI QR

कुछ बदलना हो तो
----------------
1. blood-center\src\app.jsx खोलें और बदलाव करें
2. build-blood.cmd चलाएँ (या: node build-blood.js)
   → इससे js\app.js अपने आप बन जाती है
3. sw.js में CACHE का नंबर बढ़ाएँ (bcc-v31 → bcc-v32), वरना पुराना कैश दिखेगा
4. deploy करें (नीचे देखें)

⚠️ js\app.js को सीधे कभी न बदलें — अगली build में आपका बदलाव मिट जाएगा।

डेटा कहाँ रहता है
-----------------
- साझा डेटा Google Firestore में: projects/bloodbank-9b325 → collection "data"
  (हर सेक्शन एक दस्तावेज़: banks, donors, hospitals, staff, contact, camps,
   stories, doctors, alerts, appointments; अंदर एक ही फ़ील्ड "json")
- हर डिवाइस पर localStorage (bcc_*) उसका कैश है — ऑफ़लाइन भी चलता है
- js\cloud.js पेज खुलते ही डेटा लाता है और बदलाव तुरंत क्लाउड पर भेजता है
- इंटरनेट न हो तो बदलाव bcc_pending में रुकते हैं और ऑनलाइन होते ही चले जाते हैं
- नियम: firestore.rules (रूट फ़ोल्डर में)

ऑफ़लाइन कैसे चलता है
--------------------
- कोई CDN नहीं है (React भी लोकल फ़ाइल से)
- सारी फ़ाइलें service worker (sw.js) पहली बार में कैश कर लेता है
- index.html हमेशा no-cache (firebase.blood.json में नियम)
- क्लाउड (firestore.googleapis.com) की calls कैश नहीं होतीं

Deploy कैसे करें
----------------
Root फ़ोल्डर (C:\Users\dell\Documents\Default Project) से:

  firebase deploy --only hosting,firestore:rules --config firebase.blood.json --project bloodbank-9b325

⚠️ हमेशा --config firebase.blood.json डालें।

लॉगिन
------
admin   / admin123     (एडमिन — सब कुछ)
office1 / office1@123  (ऑफ़िस इंचार्ज 1 — जोड़/बदल सकता है, हटा नहीं सकता)
office2 / office2@123  (ऑफ़िस इंचार्ज 2)

🔐 पहली बार लॉगिन के बाद 🔑 "अपना पासकोड बदलें" से पासवर्ड बदल लें।
   बदलाव क्लाउड पर जाता है, इसलिए सभी डिवाइस पर लागू होता है।

सुरक्षा नोट
-----------
Firestore का "data" संग्रह अभी सार्वजनिक है (पढ़ना/लिखना) क्योंकि अलग
यूज़र-लॉगिन (Firebase Auth) नहीं जोड़ा गया। ज़्यादा सुरक्षा चाहिए तो
Firebase Auth जोड़ना होगा।
