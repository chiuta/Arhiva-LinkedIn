// Teste v2.0.0: jurnal de integritate (amprente SHA-256 înlănțuite), detectarea modificărilor, export Markdown/JSON, import.
import {createRequire as __fffCR} from 'node:module';
import {readFileSync as __fffRF} from 'node:fs';
import {createRequire} from 'module';
import {createHash} from 'node:crypto';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
const __fffAxe = () => process.env.FFF_AXE || process.env.AXE_PATH || (() => { try { return __fffCR(import.meta.url).resolve('axe-core/axe.min.js'); } catch { return undefined; } })();
const APP = JSON.parse(__fffRF(new URL('../app.json', import.meta.url), 'utf8'));
const require = createRequire(process.env.PW_ROOT || import.meta.url);
const {chromium} = require('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const FILE = 'file://' + path.resolve(here, '..', 'index.html');
const AXE = __fffAxe();
let ok = 0, bad = 0;
function t(name, cond, extra) { if (cond) { ok++; console.log('  ok  ' + name); } else { bad++; console.log('  FAIL ' + name + (extra ? ' :: ' + extra : '')); } }
const sha = (s) => createHash('sha256').update(s, 'utf8').digest('hex');
const b = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox']});
const JKEY = /arhiva-linkedin\.journal$/;

const LEGACY = [
  {id: 'old-1', url: 'https://www.linkedin.com/posts/a-1', author: 'Ana', title: 'T1', content: 'Conținut vechi 1', tags: ['x'], datePosted: '2025-01-02', dateAdded: '2025-01-03T10:00:00.000Z'},
  {id: 'old-2', url: '', author: 'Ion', title: '', content: 'Conținut vechi 2', tags: [], datePosted: '', dateAdded: '2025-02-03T10:00:00.000Z'}
];
async function open(w, h, o = {}) {
  const ctx = o.ctx || await b.newContext({viewport: {width: w, height: h}, locale: 'ro-RO', acceptDownloads: true, ...(o.bypass ? {bypassCSP: true} : {})});
  let net = 0; await ctx.route(/^https?:/, (r) => { net++; r.abort(); });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  p.on('dialog', (d) => d.accept());
  if (o.legacy) await p.addInitScript((L) => { if (!sessionStorage.getItem('seeded')) { sessionStorage.setItem('seeded', '1'); localStorage.setItem('lka_archive_v1', JSON.stringify(L)); } }, LEGACY);
  await p.addInitScript(() => { window.__clip = []; Object.defineProperty(navigator, 'clipboard', {value: {writeText: (x) => { window.__clip.push(x); return Promise.resolve(); }}, configurable: true}); });
  await p.goto(FILE); await p.waitForTimeout(o.legacy ? 900 : 400);
  return {ctx, p, errs, net: () => net};
}
const journal = (p) => p.evaluate(() => { const k = Object.keys(localStorage).find((x) => /arhiva-linkedin\.journal$/.test(x)); return k ? JSON.parse(localStorage.getItem(k)) : []; });
const seals = (p) => p.locator('#cardGrid .seal').allTextContents();
const addNote = async (p, o) => {
  await p.click('#fabAdd');
  await p.fill('#f-author', o.author || ''); await p.fill('#f-title', o.title || ''); await p.fill('#f-url', o.url || ''); await p.fill('#f-content', o.content);
  await p.click('#saveBtn'); await p.waitForTimeout(500);
};
// verificare independentă a lanțului, în Node
function nodeChain(j) {
  let prev = '0'.repeat(64);
  return j.every((r, i) => r.seq === i + 1 && r.prev === prev && sha([prev, r.seq, r.id, r.action, r.at, r.fp].join('|')) === r.hash && (prev = r.hash, true));
}
const entryFpNode = (e) => sha(JSON.stringify([e.id, e.url || '', e.author || '', e.title || '', e.content || '', (e.tags || []).join('\u001f'), e.datePosted || '', e.dateAdded || '']));

{
  const {ctx, p, errs, net} = await open(1280, 900);
  console.log('Pornire');
  t('versiune ' + APP.version, await p.evaluate((v) => document.querySelector('meta[name=application-version]').content === v, APP.version));
  t('jurnal gol, buton vizibil în Arhivă', (await journal(p)).length === 0 && await p.isVisible('#jBtn'));

  console.log('Sigilare la adăugare');
  await addNote(p, {author: 'Maria', title: 'Despre ferigi', url: 'https://www.linkedin.com/posts/maria-1', content: 'Prima notă'});
  let j = await journal(p);
  t('o înregistrare „add"', j.length === 1 && j[0].action === 'add' && j[0].seq === 1 && /^0{64}$/.test(j[0].prev));
  const entries = await p.evaluate(() => JSON.parse(localStorage.getItem('lka_archive_v1')));
  t('amprenta = SHA-256 al notei (calcul independent)', j[0].fp === entryFpNode(entries[0]));
  t('insigna „sigilat" pe card', /^✓ sigilat .+ · [0-9a-f]{8}$/.test((await seals(p))[0]), (await seals(p)).join('|'));
  await addNote(p, {author: 'Ion', content: 'A doua notă'});
  j = await journal(p);
  t('lanț: a doua înregistrare leagă hash-ul primeia', j.length === 2 && j[1].prev === j[0].hash && nodeChain(j));

  console.log('Editare');
  await p.locator('#cardGrid article', {hasText: 'Prima notă'}).locator('[data-action=edit]').click();
  await p.fill('#f-content', 'Prima notă, editată'); await p.click('#saveBtn'); await p.waitForTimeout(500);
  j = await journal(p);
  t('editarea adaugă înregistrare „edit"', j.length === 3 && j[2].action === 'edit' && nodeChain(j));
  t('după editare cardul rămâne sigilat (nu „modificat")', (await seals(p)).every((x) => x.startsWith('✓')), (await seals(p)).join('|'));

  console.log('Dialogul jurnalului');
  await p.click('#jBtn'); await p.waitForTimeout(500);
  t('lanț valid afișat', /Lanț valid: 3 înregistrări/.test(await p.textContent('#jStatus')));
  t('rezumat 2 intacte', /2 intacte · 0 modificate · 0 fără sigiliu/.test(await p.textContent('#jSummary')));
  t('capul lanțului = hash-ul ultimei înregistrări', (await p.textContent('#jHeadVal')) === j[2].hash);
  t('tabel cu 3 rânduri', await p.locator('#jBody tr').count() === 3);
  await p.click('#jCopyBtn'); await p.waitForTimeout(100);
  t('copiere cap lanț', (await p.evaluate(() => window.__clip.pop())) === j[2].hash);
  if (AXE) {
    // axe rulează în contextul cu bypassCSP, mai jos
  }
  await p.click('#jCloseBtn');

  console.log('Ștergere');
  await p.locator('#cardGrid article', {hasText: 'A doua notă'}).locator('[data-action=delete]').click();
  await p.click('#confirmDeleteBtn'); await p.waitForTimeout(500);
  j = await journal(p);
  t('ștergerea lasă urma „delete" în jurnal', j.length === 4 && j[3].action === 'delete' && nodeChain(j));
  t('fără cereri de rețea', net() === 0);
  t('fără pageerror', errs.length === 0, errs.join('|'));
  await ctx.close();
}

console.log('Date existente (bază) și modificări din afara aplicației');
{
  const {ctx, p} = await open(1280, 900, {legacy: true});
  let j = await journal(p);
  t('note vechi sigilate ca „baseline"', j.length === 2 && j.every((r) => r.action === 'baseline') && nodeChain(j));
  t('insigne pentru ambele', (await seals(p)).length === 2);
  // modificare în afara aplicației
  await p.evaluate(() => { const a = JSON.parse(localStorage.getItem('lka_archive_v1')); a[0].content = 'ALTERAT'; localStorage.setItem('lka_archive_v1', JSON.stringify(a)); });
  await p.reload(); await p.waitForTimeout(800);
  const s2 = await seals(p);
  t('nota alterată → „modificată după sigiliu"', s2.filter((x) => x.startsWith('⚠ modificată după sigiliu')).length === 1 && s2.filter((x) => x.startsWith('✓')).length === 1, s2.join('|'));
  await p.click('#jBtn'); await p.waitForTimeout(500);
  t('rezumat: 1 intactă · 1 modificată', /1 intacte · 1 modificate · 0 fără sigiliu/.test(await p.textContent('#jSummary')));
  await p.click('#jCloseBtn');

  console.log('Export Markdown');
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#mdBtn')]);
  const md = fs.readFileSync(await dl.path(), 'utf8');
  t('frontmatter cu capul lanțului și chain valid', /^---\ntitle: "[^\n]+"\nexported: \d{4}-[^\n]+\nentries: 2\ntype: archive\njournal_records: 2\njournal_head: [0-9a-f]{64}\nchain: valid\n---\n/.test(md), md.slice(0, 260));
  t('linie de integritate: intactă și MODIFICATĂ', /Integritate:\*\* intactă — SHA-256 `[0-9a-f]{64}`/.test(md) && /Integritate:\*\* MODIFICATĂ după sigiliu — `[0-9a-f]{16}…` → `[0-9a-f]{16}…`/.test(md));

  console.log('Export JSON și import cu sigilii revendicate');
  const [dj] = await Promise.all([p.waitForEvent('download'), p.click('#exportBtn')]);
  const json = JSON.parse(fs.readFileSync(await dj.path(), 'utf8'));
  t('JSON conține jurnalul și capul lanțului', json.journal.length === 2 && json.integrity.records === 2 && json.integrity.head === json.journal[1].hash);
  await ctx.close();
  const f = await open(1280, 900);
  const tmp = path.join(here, '..', '.tmp-backup.json'); fs.writeFileSync(tmp, JSON.stringify(json));
  await f.p.setInputFiles('#importFile', tmp); await f.p.waitForTimeout(1000);
  const sf = await seals(f.p);
  t('import: nota alterată este marcată modificată în noul browser', sf.filter((x) => x.startsWith('⚠')).length === 1 && sf.filter((x) => x.startsWith('✓')).length === 1, sf.join('|'));
  const jf = await journal(f.p);
  t('import: înregistrări „import" înlănțuite', jf.length === 2 && jf.every((r) => r.action === 'import') && nodeChain(jf));
  fs.unlinkSync(tmp);
  await f.ctx.close();
}

console.log('Lanț întrerupt');
{
  const {ctx, p} = await open(1280, 900, {legacy: true});
  await p.evaluate(() => { const k = Object.keys(localStorage).find((x) => /arhiva-linkedin\.journal$/.test(x)); const j = JSON.parse(localStorage.getItem(k)); j[0].at = '2020-01-01T00:00:00.000Z'; localStorage.setItem(k, JSON.stringify(j)); });
  await p.reload(); await p.waitForTimeout(800);
  await p.click('#jBtn'); await p.waitForTimeout(500);
  t('înregistrare alterată → lanț ÎNTRERUPT la 1', /Lanț ÎNTRERUPT la înregistrarea 1/.test(await p.textContent('#jStatus')) && await p.locator('#jStatus.bad').count() === 1);
  await p.click('#jCloseBtn');
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#mdBtn')]);
  t('Markdown: chain: broken', /chain: broken/.test(fs.readFileSync(await dl.path(), 'utf8')));
  await ctx.close();
}

console.log('Import CSV incremental');
{
  const {ctx, p} = await open(1280, 900);
  const csv = path.join(here, '..', '.tmp.csv');
  fs.writeFileSync(csv, 'text,url,autor,titlu,data,tags\n"Notă CSV unu",https://www.linkedin.com/posts/c-1,Ana,Unu,2025-05-01,a;b\n"Notă CSV doi",,Ion,,,\n');
  await p.setInputFiles('#importFile', csv); await p.waitForTimeout(900);
  t('CSV: 2 note adăugate și sigilate', (await p.locator('#cardGrid article').count()) === 2 && (await journal(p)).filter((r) => r.action === 'import').length === 2);
  await p.setInputFiles('#importFile', csv); await p.waitForTimeout(900);
  t('CSV a doua oară: duplicate sărite, jurnal neschimbat', (await p.locator('#cardGrid article').count()) === 2 && (await journal(p)).length === 2 && /2/.test(await p.textContent('#toast')));
  fs.unlinkSync(csv);
  await ctx.close();
}

console.log('Accesibilitate și mobil');
if (AXE) {
  const {ctx, p} = await open(1280, 900, {legacy: true, bypass: true});
  await p.click('#jBtn'); await p.waitForTimeout(500);
  await p.addScriptTag({content: fs.readFileSync(AXE, 'utf8')});
  const v = await p.evaluate(async () => (await axe.run(document)).violations.map((x) => x.id + ':' + x.nodes.length));
  t('axe 0 violări cu jurnalul deschis', v.length === 0, v.join(','));
  await ctx.close();
}
{
  const {ctx, p} = await open(390, 800, {legacy: true});
  await p.click('#jBtn'); await p.waitForTimeout(500);
  t('fără defilare orizontală la 390px', await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  await ctx.close();
}
await b.close();
console.log(`\n${ok} ok, ${bad} eșuate`);
process.exit(bad ? 1 : 0);
