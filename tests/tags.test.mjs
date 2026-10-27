// Teste v2.2.0: gestionare tag-uri (redenumire, îmbinare, ștergere) cu înregistrări în jurnalul de integritate.
import {createRequire} from 'module';
import path from 'path';
import {fileURLToPath} from 'url';
const require = createRequire(process.env.PW_ROOT || import.meta.url);
const {chromium} = require('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const FILE = 'file://' + path.resolve(here, '..', 'index.html');
let ok = 0, bad = 0;
function t(name, cond, extra) { if (cond) { ok++; console.log('  ok  ' + name); } else { bad++; console.log('  FAIL ' + name + (extra ? ' :: ' + extra : '')); } }
const b = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox']});
const SEED = [
  {id: 'a1', url: '', author: 'Ana', title: 'Prima', content: 'Text IT', tags: ['it', 'carieră'], datePosted: '2025-03-01', dateAdded: '2025-03-05T10:00:00.000Z'},
  {id: 'a2', url: '', author: 'Ion', title: 'A doua', content: 'Text date', tags: ['IT', 'date'], datePosted: '', dateAdded: '2025-03-06T10:00:00.000Z'},
  {id: 'a3', url: '', author: 'Vlad', title: 'A treia', content: 'Fără tag-ul it', tags: ['date'], datePosted: '', dateAdded: '2025-03-07T10:00:00.000Z'}
];
const GAL = [{id: 'g1', embedSrc: 'https://www.linkedin.com/embed/feed/update/urn:li:share:1', embedHeight: 400, url: '', note: 'Nota 1', tags: ['video'], dateAdded: '2025-03-05T10:00:00.000Z'}];
const ctx = await b.newContext({viewport: {width: 1000, height: 900}, locale: 'ro-RO'});
const reqs = []; await ctx.route(/^https?:/, (r) => { reqs.push(r.request().url()); r.abort(); });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (/Content Security|Refused to/i.test(m.text())) errs.push(m.text()); });
await p.addInitScript(([A, G]) => { if (!sessionStorage.getItem('seeded')) { sessionStorage.setItem('seeded', '1'); localStorage.setItem('lka_archive_v1', JSON.stringify(A)); localStorage.setItem('lka_gallery_v1', JSON.stringify(G)); } }, [SEED, GAL]);
await p.goto(FILE); await p.waitForTimeout(900);
const arch = () => p.evaluate(() => JSON.parse(localStorage.getItem('lka_archive_v1')));
const journal = () => p.evaluate(() => { const k = Object.keys(localStorage).find((x) => /arhiva-linkedin\.journal$/.test(x)); return k ? JSON.parse(localStorage.getItem(k)) : []; });
const open = async () => { await p.click('#tagMgrBtn'); await p.waitForSelector('#tagDialog[open]'); };
const row = (tag) => p.locator('#tagMgrBody .tm-row[data-tag="' + tag + '"]');

t('buton vizibil când există tag-uri', await p.isVisible('#tagMgrBtn'));
await open();
t('dialog: 4 tag-uri cu număr (it 1, IT 1, carieră 1, date 2)', await p.locator('#tagMgrBody .tm-row').count() === 4 && /date \(2\)/.test(await p.textContent('#tagMgrBody')), await p.textContent('#tagMgrBody'));
const j0 = (await journal()).length;
// redenumire simplă
await row('carieră').locator('input').fill('cariera'); await row('carieră').locator('[data-tm="rename"]').click(); await p.waitForTimeout(500);
let a = await arch();
t('redenumire: tag-ul se schimbă doar în intrarea vizată', JSON.stringify(a.find((x) => x.id === 'a1').tags) === JSON.stringify(['it', 'cariera']), a.find((x) => x.id === 'a1').tags);
let j = await journal();
t('jurnal: o înregistrare „edit” nouă pentru a1', j.length === j0 + 1 && j[j.length - 1].action === 'edit' && j[j.length - 1].id === 'a1', j.slice(-2));
t('toast de redenumire', /Tag redenumit: carieră → cariera \(1 intrări\)/.test(await p.textContent('#toast')), await p.textContent('#toast'));
// îmbinare: IT -> it (it există deja în a1; a2 are doar IT)
await row('IT').locator('input').fill('it'); await row('IT').locator('[data-tm="rename"]').click(); await p.waitForTimeout(500);
a = await arch();
t('îmbinare: a2 are acum „it”, fără dubluri', JSON.stringify(a.find((x) => x.id === 'a2').tags) === JSON.stringify(['it', 'date']) && JSON.stringify(a.find((x) => x.id === 'a1').tags) === JSON.stringify(['it', 'cariera']), a.map((x) => x.tags));
t('toast de îmbinare', /Tag-uri îmbinate: IT → it/.test(await p.textContent('#toast')), await p.textContent('#toast'));
t('lista din dialog actualizată (3 tag-uri, it 2)', await p.locator('#tagMgrBody .tm-row').count() === 3 && /it \(2\)/.test(await p.textContent('#tagMgrBody')));
// nume invalid
await row('date').locator('input').fill('a,b'); await row('date').locator('[data-tm="rename"]').click(); await p.waitForTimeout(150);
t('nume cu virgulă respins (mesaj, fără modificare)', await p.isVisible('#tagMgrErr') && JSON.stringify((await arch()).find((x) => x.id === 'a3').tags) === JSON.stringify(['date']));
await row('date').locator('input').fill('   '); await row('date').locator('[data-tm="rename"]').click(); await p.waitForTimeout(150);
t('nume gol respins', await p.isVisible('#tagMgrErr'));
// ștergere în doi pași
const jBefore = (await journal()).length;
await row('date').locator('[data-tm="delete"]').click(); await p.waitForTimeout(100);
t('prima apăsare doar armează ștergerea', JSON.stringify((await arch()).find((x) => x.id === 'a3').tags) === JSON.stringify(['date']) && /Confirmă/.test(await row('date').locator('[data-tm="delete"]').textContent()));
await row('date').locator('[data-tm="delete"]').click(); await p.waitForTimeout(500);
a = await arch();
t('ștergere: tag-ul dispare din 2 intrări, textul rămâne', a.find((x) => x.id === 'a3').tags.length === 0 && !a.find((x) => x.id === 'a2').tags.includes('date') && a.find((x) => x.id === 'a3').content === 'Fără tag-ul it');
t('jurnal: 2 înregistrări „edit” (a2, a3)', (await journal()).length === jBefore + 2, (await journal()).length - jBefore);
// lanț valid și sigilii intacte
await p.click('#tagMgrCloseBtn'); await p.click('#jBtn'); await p.waitForTimeout(600);
t('lanțul de integritate rămâne valid', /Lanț valid/.test(await p.textContent('#jStatus')), await p.textContent('#jStatus'));
t('toate intrările intacte (sigilii la zi)', /3 intacte · 0 modificate/.test(await p.textContent('#jSummary')), await p.textContent('#jSummary'));
await p.click('#jCloseBtn');
// filtrul activ urmărește redenumirea
await p.click('#tagRow .tag-chip:has-text("it (2)")'); await p.waitForTimeout(100);
await open(); await row('it').locator('input').fill('informatică'); await row('it').locator('[data-tm="rename"]').click(); await p.waitForTimeout(500);
t('tag activ redenumit → filtrul rămâne activ pe numele nou', /informatică/.test(await p.textContent('#tagRow .tag-chip.active')) && await p.locator('#cardGrid article').count() === 2, await p.textContent('#tagRow'));
await p.click('#tagMgrCloseBtn');
// galerie: aceeași funcție, fără jurnal
await p.click('.tab[data-tab="gallery"]'); await p.waitForTimeout(300);
const jg = (await journal()).length;
await open(); await row('video').locator('input').fill('clipuri'); await row('video').locator('[data-tm="rename"]').click(); await p.waitForTimeout(400);
const g = await p.evaluate(() => JSON.parse(localStorage.getItem('lka_gallery_v1')));
t('galerie: tag redenumit, jurnalul neatins', g[0].tags[0] === 'clipuri' && (await journal()).length === jg, g[0].tags);
await p.click('#tagMgrCloseBtn');
// 8 limbi
for (const l of ['en', 'fr', 'it', 'es', 'pt', 'de', 'hu', 'ro']) {
  await p.selectOption('#langSelect', l); await p.waitForTimeout(80);
  const txt = await p.textContent('#tagMgrBtn');
  t('buton tradus în ' + l + ': ' + txt, txt.trim().length > 3 && txt !== 'tagMgrBtn');
}
t('0 erori / CSP', errs.length === 0, errs);
t('0 cereri de rețea', reqs.length === 0, reqs);
await b.close();
console.log(`\n${ok} ok, ${bad} eșuate`); process.exit(bad ? 1 : 0);
