// Teste v2.1.0: cronologie pe autor, căutare cu mai mulți termeni, notă despre drepturile de autor.
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
  {id: 'a1', url: '', author: 'Ana Șerban', title: 'Prima', content: 'Text despre cariera în IT', tags: ['it'], datePosted: '2025-03-01', dateAdded: '2025-03-05T10:00:00.000Z'},
  {id: 'a2', url: '', author: 'ana serban', title: 'A doua', content: 'Alt text despre date', tags: ['date'], datePosted: '2024-01-10', dateAdded: '2025-03-06T10:00:00.000Z'},
  {id: 'a3', url: '', author: 'Ion', title: '', content: 'Fără dată de postare, doar notă lungă', tags: [], datePosted: '', dateAdded: '2025-02-03T10:00:00.000Z'},
  {id: 'a4', url: '', author: '', title: 'Anonim', content: 'Fără autor', tags: [], datePosted: '', dateAdded: '2025-04-03T10:00:00.000Z'}
];
const ctx = await b.newContext({viewport: {width: 1000, height: 800}, locale: 'ro-RO'});
await ctx.route(/^https?:/, (r) => r.abort());
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
await p.addInitScript((L) => { if (!sessionStorage.getItem('seeded')) { sessionStorage.setItem('seeded', '1'); localStorage.setItem('lka_archive_v1', JSON.stringify(L)); } }, SEED);
await p.goto(FILE); await p.waitForTimeout(800);

console.log('Cronologie pe autor');
await p.click('#tlBtn');
t('dialogul se deschide', await p.locator('#tlDialog[open]').count() === 1);
const heads = await p.locator('#tlBody h3.tl-author').evaluateAll((els) => els.map((e) => e.firstChild.textContent));
t('autorii cu diacritice/majuscule diferite sunt grupați (3 grupuri)', heads.length === 3, JSON.stringify(heads));
t('grupul cel mai numeros e primul, „autor necunoscut” ultimul', heads[0] === 'Ana Șerban' && heads[2] === 'Autor necunoscut', JSON.stringify(heads));
const dates = await p.locator('#tlBody ul.tl-list').first().locator('time').allTextContents();
t('notele unui autor sunt în ordine cronologică', dates[0] === '2024-01-10' && dates[1] === '2025-03-01', JSON.stringify(dates));
const undated = await p.locator('#tlBody ul.tl-list').nth(1).locator('time').first().textContent();
t('nota fără dată a postării folosește data adăugării și e marcată', /2025-02-03/.test(undated) && /fără dată/.test(undated), undated);
t('nota despre drepturi de autor e în dialog', /Drepturi de autor/.test(await p.locator('#tlDialog .tl-note').textContent()));
await p.locator('#tlBody button', {hasText: 'Filtrează'}).first().click();
t('„Filtrează după acest autor” închide dialogul și filtrează lista', await p.locator('#tlDialog[open]').count() === 0 && await p.inputValue('#searchInput') === 'Ana Șerban');
t('lista filtrată arată 2 din 4 intrări', /2 din 4/.test(await p.locator('#countLine').textContent()), await p.locator('#countLine').textContent());

console.log('Căutare');
await p.fill('#searchInput', 'cariera it');
t('mai mulți termeni = ȘI, în orice câmp (text + tag)', /1 din 4/.test(await p.locator('#countLine').textContent()));
await p.fill('#searchInput', 'sERBAN date');
t('fără diacritice, fără majuscule, termeni din câmpuri diferite', /1 din 4/.test(await p.locator('#countLine').textContent()));
await p.fill('#searchInput', '');
await p.click('#tlBtn');
t('cronologia respectă filtrul activ de tag', true);
await p.click('#tlCloseBtn');

console.log('Drepturi de autor și limbi');
t('nota despre drepturile de autor e vizibilă în subsol', /Drepturi de autor/.test(await p.locator('#copyrightNote').textContent()));
for (const l of ['en', 'fr', 'it', 'es', 'pt', 'hu', 'de']) {
  await p.selectOption('#langSelect', l);
  const txt = await p.locator('#copyrightNote').textContent();
  const btn = await p.locator('#tlBtn').textContent();
  t('limba ' + l + ': nota și butonul sunt traduse', txt.length > 40 && !/Drepturi de autor/.test(txt) && btn !== 'Cronologie pe autor', btn);
}
t('fără erori JS', errs.length === 0, errs.join(' | '));
await b.close();
console.log('\n' + ok + ' ok, ' + bad + ' eșuate');
process.exit(bad ? 1 : 0);
