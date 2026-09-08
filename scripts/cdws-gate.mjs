/**
 * The CDWS gate. Osama cannot present as a standalone dive business or sell
 * instruction directly: Egyptian diving is operated by CDWS registered centres.
 * This reads a rendered page and reports every word that would make it look like a
 * shop, so the check is something you can see rather than something I promise.
 * Run: node scripts/cdws-gate.mjs http://localhost:3011/diving-with-osama
 */
import { chromium } from '/Users/Hesham/Documents/scrollcraft/builds/osamadives-descent/node_modules/playwright-core/index.mjs';

const MONEY = ['\\$', '€', '£', '\\bEGP\\b', '\\bUSD\\b', '\\bEUR\\b', 'dollar', 'euro',
               'price', 'pricing', '\\bcost', '\\bfee\\b', 'discount', 'deposit'];
// "book" and "order" have innocent senses here: entries go in his logbook, and the
// dive sites are listed in the order the shore road meets them. Match the commerce
// sense only, so the gate never cries wolf.
const SELLING = ['book (a|an|your|now|online|here|with)', '\\bbookings?\\b', '\\breserve\\b', 'reservation',
                 'sign up', 'signup', '\\benrol', '\\bbuy\\b', 'purchase', 'place an order',
                 '\\bpackages?\\b', '\\bdeals?\\b', 'we offer', 'i offer', 'per person'];
const OPERATOR = ['my dive centre', 'my dive center', 'our team', 'our centre', 'our center',
                  'we offer', 'our courses', 'my company', 'my business'];

const url = process.argv[2];
const b = await chromium.launch({ channel: 'chrome' });
const p = await (await b.newContext()).newPage();
await p.goto(url, { waitUntil: 'networkidle' });
await p.waitForTimeout(1200);

const { body, foot } = await p.evaluate(() => {
  // innerText has to be read from the live document. A detached clone has no layout,
  // so its innerText falls back to textContent and drags in every script tag,
  // including the framework's serialized payload.
  const f = document.querySelector('.tail-foot');
  const content = document.querySelector('.inner-body') || document.querySelector('main');
  return { body: content ? content.innerText : '', foot: f ? f.innerText : '' };
});
await b.close();

function hits(text, list) {
  const out = [];
  for (const term of list) {
    const re = new RegExp(term, 'gi');
    let m;
    while ((m = re.exec(text))) {
      const from = Math.max(0, m.index - 45), to = Math.min(text.length, m.index + m[0].length + 45);
      out.push(`"${m[0]}"  ...${text.slice(from, to).replace(/\s+/g, ' ')}...`);
    }
  }
  return out;
}

let fail = 0;
console.log(`\nCDWS GATE  ${url}\n`);
for (const [name, list] of [['money', MONEY], ['selling', SELLING], ['operator framing', OPERATOR]]) {
  const h = hits(body, list);
  if (h.length) { fail += h.length; console.log(`FAIL  ${name}: ${h.length} in the page's own copy`); h.forEach((x) => console.log('      ' + x)); }
  else console.log(`pass  ${name}: none in the page's own copy`);
}
// The cover can come from the page's own words or from the standing notice that sits
// in the foot of every page. Either satisfies it; both is belt and braces.
const onPage = (body.match(/CDWS/g) || []).length;
const inFoot = (foot.match(/CDWS/g) || []).length;
if (onPage === 0 && inFoot === 0) { fail++; console.log('FAIL  nothing on this page says the centres run the diving'); }
else if (onPage > 0) console.log(`pass  the page says it in its own words (${onPage}x), and the standing notice is in the foot`);
else console.log('pass  covered by the standing notice in the foot of every page');

const footHits = hits(foot, [...MONEY, ...SELLING]);
console.log('\nthe standing notice in the foot of every page (expected, it is the disclaimer):');
footHits.forEach((x) => console.log('      ' + x));
console.log(`\n${fail === 0 ? 'GATE PASSED' : 'GATE FAILED, ' + fail + ' to fix'}\n`);
process.exit(fail === 0 ? 0 : 1);
