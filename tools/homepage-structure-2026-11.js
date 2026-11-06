// November 2026 copy update, part 2: the pieces of the new homepage copy that need more items than the
// old layout had. Run once, after `node tools/rebrand.js tools/content-update-2026-11.js`:
//
//   - hero: trust strip and "See pricing" link under the main button
//   - new "The problem" section between the capability grid and Business impact
//   - Business impact: 4th pillar ("Your data stays yours.")
//   - How we work: 4 stages (new stage 3 "Pilot deployment")
//   - Where else we build: 6 industries
//   - Why Scalezix: 4th card ("Priced for value."), grid becomes 2 x 2
//   - FAQ: 10 questions (Faq chunk is shared by Home and Solutions)
//
// Every change is made to both the JS chunk and the prerendered HTML, with markup identical to what React
// renders, so hydration keeps the server HTML. The script refuses to run twice.
const fs = require('fs');
const path = require('path');

const SITE = path.join(__dirname, '..', 'altrdtech.com');
const ASSETS = path.join(SITE, 'assets');
const chunk = (prefix) => path.join(ASSETS, fs.readdirSync(ASSETS).find((f) => f.startsWith(prefix + '-') && f.endsWith('.js')));
const read = (fp) => fs.readFileSync(fp, 'utf8');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
const tl = (s) => '`' + s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${') + '`';

function replaceOnce(src, from, to, what) {
  const n = src.split(from).length - 1;
  if (n !== 1) throw new Error(`${what}: expected 1 match, found ${n}`);
  return src.replace(from, () => to);
}
// Returns [start, end) of the source between `startMarker` and `endMarker` (exclusive of endMarker).
function between(src, startMarker, endMarker, what) {
  const s = src.indexOf(startMarker);
  if (s < 0) throw new Error(`${what}: start not found`);
  const e = src.indexOf(endMarker, s);
  if (e < 0) throw new Error(`${what}: end not found`);
  return [s, e];
}
const evalArray = (code) => Function(`return (${code})`)();

// ── Content ──────────────────────────────────────────────────────────────────
const TRUST = '99.8% accuracy · Zero data retention · DPDP Act 2023 aligned · Private VPC or on-premise hosting';
const PRICING_URL = 'https://www.scalezix.com/pricing';
const PRICING_LABEL = 'See pricing (from ₹3,000/month)';

const PROBLEM = {
  eyebrow: 'THE PROBLEM',
  title: 'Your best people are spending their days on work a system should do.',
  p1: 'Re-keying data between Excel, WhatsApp, your CRM and your ERP. Chasing leads that went cold overnight. Reading invoices line by line. Building the weekly report by hand.',
  p2: 'Every hour of it costs salary, speed and customers. We find those hours, put a number on them, and replace them with systems that run 24/7 at a fixed monthly cost.',
  label: 'THREE LEAKS WE SEE MOST OFTEN',
  leaks: [
    { title: 'Slow lead response.', body: 'Enquiries wait hours for a reply. By then the buyer has called a competitor.' },
    { title: 'Manual back-office work.', body: 'Invoices, POs, GRNs and reconciliations are typed in twice and checked by hand.' },
    { title: 'Reporting lag.', body: 'Leadership decides on last month’s numbers because nobody has time to compile this week’s.' },
  ],
};
const IMPACT_4 = { title: 'Your data stays yours.', body: 'Zero data retention. Nothing is stored by AI vendors or used to train public models.' };
const STAGE_3 = {
  label: 'Pilot deployment',
  heading: 'Weeks 3–6: agents and connectors go live inside your ERP, CRM and communication channels.',
  body: 'We track real KPIs from day one. Deliverables: live pilot, KPI dashboard, team handover.',
  image: '/img/how-we-work/hww-torus-3.png',
};
const WHERE_ELSE = ['Real estate', 'D2C brands', 'Healthcare', 'Logistics', 'Construction & procurement', 'Growing SMEs'];
const WHY_4 = { title: 'Priced for value.', body: 'Modular pods instead of big consulting fees. You pay for outcomes, not seats.' };
const FAQ_NEW = {
  1: { q: 'How is Scalezix different from a traditional IT consultancy?', a: 'We start from your workflows and a modelled ROI, not a technology wish list. You get a dedicated pod, fixed-scope delivery in weeks, and an SLA after launch.' },
  5: { q: 'How do you keep AI accurate and prevent errors?', a: 'We route work across multiple models, validate outputs against your business rules and keep a human in the loop for high-stakes steps. Every action is logged.' },
  8: { q: 'Can we start small before a full transformation?', a: 'Yes. Begin with a modular product such as the WhatsApp AI Suite or Scalezix CRM, then expand.' },
};

// ── Files ────────────────────────────────────────────────────────────────────
const routesFp = chunk('routes');
const faqFp = chunk('Faq');
const indexFp = path.join(SITE, 'index.html');
let routes = read(routesFp);
let faqJs = read(faqFp);
let index = read(indexFp);
if (routes.includes(STAGE_3.label)) {
  console.log('already applied, nothing to do');
  process.exit(0);
}

// ── 1. Hero: trust strip + pricing link ──────────────────────────────────────
const heroBtnJs = '(0,h.jsx)(o,{onClick:e,className:`mt-[30px] w-full max-w-[214px]`,children:`Book strategy audit`})';
routes = replaceOnce(routes, heroBtnJs,
  heroBtnJs +
  `,(0,h.jsx)(\`a\`,{href:${tl(PRICING_URL)},className:\`mt-5 text-[15px] text-[#C9C9CE] underline hover:text-white\`,children:${tl(PRICING_LABEL)}})` +
  `,(0,h.jsx)(\`p\`,{className:\`mt-6 max-w-[760px] text-center text-[14px] leading-[1.5] text-white/70\`,children:${tl(TRUST)}})`,
  'hero button (js)');
{
  const h1 = index.indexOf('<h1');
  const end = index.indexOf('</button>', h1) + '</button>'.length;
  index = index.slice(0, end) +
    `<a href="${esc(PRICING_URL)}" class="mt-5 text-[15px] text-[#C9C9CE] underline hover:text-white">${esc(PRICING_LABEL)}</a>` +
    `<p class="mt-6 max-w-[760px] text-center text-[14px] leading-[1.5] text-white/70">${esc(TRUST)}</p>` +
    index.slice(end);
}

// ── 2. New "The problem" section ─────────────────────────────────────────────
const leakCls = 'border-t-2 border-t-hairline-dark px-6 py-10 md:border-l md:border-l-hairline-dark md:first:border-l-0 lg:px-10';
const problemJs =
  'function sxProblem(){return(0,h.jsx)(`section`,{className:`relative overflow-hidden bg-ink text-white`,children:(0,h.jsxs)(i,{className:`pt-20 pb-10 lg:pt-[120px] lg:pb-[47px]`,children:[' +
  '(0,h.jsxs)(`div`,{className:`lg:pl-10`,children:[' +
  '(0,h.jsxs)(`div`,{className:`flex items-center gap-4`,children:[(0,h.jsx)(`span`,{className:`block h-3 w-3 shrink-0 bg-lime`}),(0,h.jsx)(`span`,{className:`font-mono text-[13px] font-medium tracking-[0.22em] text-white`,children:' + tl(PROBLEM.eyebrow) + '})]}),' +
  '(0,h.jsx)(`h2`,{className:`mt-[21px] max-w-[1000px] text-[clamp(2rem,4.4vw,4rem)] font-medium leading-[1.09] tracking-[-0.01em]`,children:' + tl(PROBLEM.title) + '}),' +
  '(0,h.jsx)(`p`,{className:`mt-8 max-w-[760px] text-[19px] leading-[1.6] text-white/70`,children:' + tl(PROBLEM.p1) + '}),' +
  '(0,h.jsx)(`p`,{className:`mt-5 max-w-[760px] text-[19px] leading-[1.6] text-white/70`,children:' + tl(PROBLEM.p2) + '})]}),' +
  '(0,h.jsx)(`div`,{className:`mt-16 lg:pl-10 font-mono text-[13px] font-medium tracking-[0.22em] text-indigo-soft-2`,children:' + tl(PROBLEM.label) + '}),' +
  '(0,h.jsx)(`div`,{className:`mt-6 grid grid-cols-1 md:grid-cols-3`,children:sxLeaks.map(e=>(0,h.jsxs)(`div`,{className:' + tl(leakCls) + ',children:[(0,h.jsx)(`h3`,{className:`text-[20px] font-medium leading-[1.3] tracking-[-0.01em]`,children:e.title}),(0,h.jsx)(`p`,{className:`mt-4 max-w-[330px] text-[14.5px] leading-[22px] text-white/70 text-pretty`,children:e.body})]},e.title))})]})})}' +
  'var sxLeaks=[' + PROBLEM.leaks.map((l) => `{title:${tl(l.title)},body:${tl(l.body)}}`).join(',') + '];';
routes = replaceOnce(routes, 'function V(){', problemJs + 'function V(){', 'page component (js)');
routes = replaceOnce(routes, '(0,h.jsx)(y,{}),(0,h.jsx)(S,{})', '(0,h.jsx)(y,{}),(0,h.jsx)(sxProblem,{}),(0,h.jsx)(S,{})', 'page sections (js)');
const problemHtml =
  '<section class="relative overflow-hidden bg-ink text-white"><div class="mx-auto w-full max-w-[1232px] px-6 md:px-12 xl:px-0 pt-20 pb-10 lg:pt-[120px] lg:pb-[47px]">' +
  '<div class="lg:pl-10"><div class="flex items-center gap-4"><span class="block h-3 w-3 shrink-0 bg-lime"></span><span class="font-mono text-[13px] font-medium tracking-[0.22em] text-white">' + esc(PROBLEM.eyebrow) + '</span></div>' +
  '<h2 class="mt-[21px] max-w-[1000px] text-[clamp(2rem,4.4vw,4rem)] font-medium leading-[1.09] tracking-[-0.01em]">' + esc(PROBLEM.title) + '</h2>' +
  '<p class="mt-8 max-w-[760px] text-[19px] leading-[1.6] text-white/70">' + esc(PROBLEM.p1) + '</p>' +
  '<p class="mt-5 max-w-[760px] text-[19px] leading-[1.6] text-white/70">' + esc(PROBLEM.p2) + '</p></div>' +
  '<div class="mt-16 lg:pl-10 font-mono text-[13px] font-medium tracking-[0.22em] text-indigo-soft-2">' + esc(PROBLEM.label) + '</div>' +
  '<div class="mt-6 grid grid-cols-1 md:grid-cols-3">' +
  PROBLEM.leaks.map((l) => `<div class="${leakCls}"><h3 class="text-[20px] font-medium leading-[1.3] tracking-[-0.01em]">${esc(l.title)}</h3><p class="mt-4 max-w-[330px] text-[14.5px] leading-[22px] text-white/70 text-pretty">${esc(l.body)}</p></div>`).join('') +
  '</div></div></section>';
{
  const at = index.lastIndexOf('<section', index.indexOf('Measured in rupees saved'));
  index = index.slice(0, at) + problemHtml + index.slice(at);
}

// ── 3. Business impact: 4th pillar ───────────────────────────────────────────
{
  const [s, e] = between(routes, 'var x=[', ';function S(){', 'impact array');
  const items = evalArray(routes.slice(s + 'var x='.length, e));
  const next = [...items, IMPACT_4];
  routes = routes.slice(0, s) + 'var x=[' + next.map((t) => `{title:${tl(t.title)},body:${tl(t.body)}}`).join(',') + ']' + routes.slice(e);
  const item = (t) => `<div><div class="text-[26px] font-semibold leading-[32px] tracking-[-0.01em] text-indigo">${esc(t.title)}</div><div class="mt-[14px] text-[19px] font-normal leading-[26px] text-muted">${esc(t.body)}</div></div>`;
  index = replaceOnce(index, items.map(item).join(''), next.map(item).join(''), 'impact items (html)');
}

// ── 4. How we work: insert stage 3, renumber the last stage to 04 ─────────────
{
  const [s, e] = between(routes, 'T=[{num:', ',E=`cubic', 'stages array');
  const stages = evalArray(routes.slice(s + 2, e));
  if (stages.length !== 3) throw new Error('expected 3 stages');
  const next = [stages[0], stages[1], { num: '03', ...STAGE_3 }, { ...stages[2], num: '04' }];
  routes = routes.slice(0, s) + 'T=[' + next.map((t) => `{num:${tl(t.num)},label:${tl(t.label)},heading:${tl(t.heading)},body:${tl(t.body)},image:${tl(t.image)}}`).join(',') + ']' + routes.slice(e);

  const c1 = index.indexOf('<div class="hww-card" style="--hww-i:1">');
  const c2 = index.indexOf('<div class="hww-card" style="--hww-i:2">');
  if (c1 < 0 || c2 < 0) throw new Error('hww cards not found');
  const s1 = stages[1];
  const swap = (html, from, to) => html.split(from).join(to);
  let card = index.slice(c1, c2);
  card = swap(card, '--hww-i:1', '--hww-i:2');
  card = swap(card, '>02<', '>03<');
  card = swap(card, '>' + esc(s1.label) + '<', '>' + esc(STAGE_3.label) + '<');
  card = swap(card, '>' + esc(s1.heading) + '<', '>' + esc(STAGE_3.heading) + '<');
  card = swap(card, '>' + esc(s1.body) + '<', '>' + esc(STAGE_3.body) + '<');
  card = swap(card, s1.image.slice(1), STAGE_3.image.slice(1)); // HTML uses relative img/ paths
  card = swap(card, s1.image, STAGE_3.image);
  if (!card.includes(esc(STAGE_3.body)) || !card.includes(STAGE_3.image.slice(1))) throw new Error('stage 3 card build failed');
  // Old 3rd card → 4th
  const rest = index.slice(c2);
  const restEnd = rest.indexOf('</div></div></section>');
  let last = rest.slice(0, restEnd);
  last = last.replace('--hww-i:2', '--hww-i:3').split('>03<').join('>04<');
  index = index.slice(0, c2) + card + last + rest.slice(restEnd);
}

// ── 5. Where else we build: 6 industries ─────────────────────────────────────
{
  const [s, e] = between(routes, 'var A=[', '],j=', 'where-else array');
  const old = evalArray(routes.slice(s + 'var A='.length, e + 1));
  routes = routes.slice(0, s) + 'var A=[' + WHERE_ELSE.map(tl).join(',') + routes.slice(e);
  const icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" class="shrink-0"><g stroke="#0C0D0F" stroke-width="1.7" stroke-linecap="round"><path d="M3 8V5a2 2 0 0 1 2-2h3"></path><path d="M16 3h3a2 2 0 0 1 2 2v3"></path><path d="M21 16v3a2 2 0 0 1-2 2h-3"></path><path d="M8 21H5a2 2 0 0 1-2-2v-3"></path><path d="M7 10h10"></path><path d="M7 14h6"></path></g></svg>';
  const li = (n) => `<li class="flex items-center gap-[9px]">${icon}<span class="text-[15px] font-medium leading-5 whitespace-nowrap">${esc(n)}</span></li>`;
  index = replaceOnce(index, old.map(li).join(''), WHERE_ELSE.map(li).join(''), 'where-else list (html)');
}

// ── 6. Why Scalezix: 4th card, 2 x 2 grid ─────────────────────────────────────
{
  const [s, e] = between(routes, 'var F=[', ';function I(){', 'why array');
  const cards = evalArray(routes.slice(s + 'var F='.length, e));
  const next = [...cards, WHY_4];
  routes = routes.slice(0, s) + 'var F=[' + next.map((t) => `{title:${tl(t.title)},body:${tl(t.body)}}`).join(',') + ']' + routes.slice(e);
  routes = replaceOnce(routes, 'className:`grid grid-cols-1 md:grid-cols-3`,children:F.map', 'className:`grid grid-cols-1 md:grid-cols-2`,children:F.map', 'why grid (js)');
  const card = (t, i) => `<div class="border-t-2 px-6 py-10 transition-[border-color] duration-300 ease-out md:border-l md:border-l-hairline-dark md:first:border-l-0 lg:px-10 lg:py-[52px] ${i === 0 ? 'border-t-indigo-soft' : 'border-t-hairline-dark'}"><h3 class="text-[20px] font-medium leading-[1.3] tracking-[-0.01em]">${esc(t.title)}</h3><p class="mt-4 max-w-[330px] text-[14.5px] leading-[22px] text-white/70 text-pretty">${esc(t.body)}</p></div>`;
  index = replaceOnce(index, '<div class="grid grid-cols-1 md:grid-cols-3">' + cards.map(card).join(''),
    '<div class="grid grid-cols-1 md:grid-cols-2">' + next.map(card).join(''), 'why cards (html)');
}

// ── 7. FAQ: 10 questions (Home + Solutions pages) ────────────────────────────
const faqHtmlFiles = ['index.html', 'what-we-do.html'];
{
  const [s, e] = between(faqJs, 'l=[{q:', ';function u(){', 'faq array');
  const faqs = evalArray(faqJs.slice(s + 2, e));
  const next = [...faqs];
  for (const at of Object.keys(FAQ_NEW).map(Number).sort((a, b) => a - b)) next.splice(at, 0, FAQ_NEW[at]);
  faqJs = faqJs.slice(0, s) + 'l=[' + next.map((f) => `{q:${tl(f.q)},a:${tl(f.a)}}`).join(',') + ']' + faqJs.slice(e);
  const item = (f, i) => `<div class="border-b border-[#DED8CF]"><button type="button" aria-expanded="${i === 0}" class="w-full bg-transparent border-none px-1 py-[26px] flex items-center justify-between gap-6 cursor-pointer text-left font-[inherit]"><span class="text-[23px] font-semibold leading-[1.3] text-[#111]">${esc(f.q)}</span><span class="flex items-center text-[#111] shrink-0 transition-transform duration-[250ms] ease-[ease]" style="transform:rotate(${i === 0 ? 180 : 0}deg)"><svg width="14" height="8" viewBox="0 0 14 8" fill="none" aria-hidden="true"><path d="M1 1L7 7L13 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></span></button><div class="overflow-hidden" style="max-height:${i === 0 ? '400px' : '0px'};opacity:${i === 0 ? 1 : 0};transition:max-height .3s ease, opacity .25s ease"><p class="px-1 pb-[30px] text-[19px] leading-[1.6] text-[#555] max-w-[700px] text-pretty">${esc(f.a)}</p></div></div>`;
  const oldHtml = faqs.map(item).join('');
  const newHtml = next.map(item).join('');
  for (const f of faqHtmlFiles) {
    const fp = path.join(SITE, f);
    const src = f === 'index.html' ? index : read(fp);
    const out = replaceOnce(src, oldHtml, newHtml, `faq items (${f})`);
    if (f === 'index.html') index = out;
    else fs.writeFileSync(fp, out);
  }
}

// Syntax check before writing the chunks.
const acorn = require('acorn');
acorn.parse(routes, { ecmaVersion: 'latest', sourceType: 'module' });
acorn.parse(faqJs, { ecmaVersion: 'latest', sourceType: 'module' });
fs.writeFileSync(routesFp, routes);
fs.writeFileSync(faqFp, faqJs);
fs.writeFileSync(indexFp, index);
console.log('homepage structure updated: hero trust strip, problem section, impact x4, stages x4, industries x6, why x4, FAQ x10');
