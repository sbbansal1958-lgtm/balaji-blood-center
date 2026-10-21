/* blood-center: src/app.jsx  →  js/app.js  (React.createElement वाला तैयार कोड)
   चलाने का तरीका:  node build-blood.js   (या npm run build)
   Babel कहाँ से लें (इसी क्रम में):
     1. node_modules/@babel/standalone   (npm install के बाद — repo में सबसे साफ़ तरीका)
     2. ../tools/babel.min.js            (इस मशीन पर मौजूद लोकल कॉपी)
     3. ../chess-kids/vendor/babel.min.js (पुराना विकल्प, सिर्फ़ बैकअप) */
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const SRC = path.join(DIR, 'src', 'app.jsx');
const OUT = path.join(DIR, 'js', 'app.js');

let Babel, from;
try {
  Babel = require('@babel/standalone');
  from = 'node_modules/@babel/standalone';
} catch (e) {
  const candidates = [
    path.join(DIR, '..', 'tools', 'babel.min.js'),
    path.join(DIR, '..', 'chess-kids', 'vendor', 'babel.min.js')
  ];
  const found = candidates.find((p) => fs.existsSync(p));
  if (!found) {
    console.error('❌ Babel नहीं मिला — पहले `npm install` चलाएँ।');
    process.exit(1);
  }
  Babel = require(found);
  from = path.basename(found);
}
console.log('Babel: ' + from);

const code = fs.readFileSync(SRC, 'utf8');
const res = Babel.transform(code, { presets: [['react', {}]], sourceType: 'script', comments: true });

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT,
  '/* यह फ़ाइल अपने आप बनी है — src\\app.jsx से। सीधे यहाँ बदलाव न करें, build-blood.cmd चलाएँ। */\n' + res.code,
  'utf8');
console.log('✅ बन गया: js/app.js  (' + Math.round(res.code.length / 1024) + ' KB)');
