# Arhivă & Galerie LinkedIn — clipe salvate fără cont

[English](README.md) · **Română** · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

**Versiune:** 2.1.0 · **Ultima actualizare:** 2026-10-27

**Stare:** stabil · **Offline:** complet pentru Arhivă; Galeria cere internet (încarcă embed-ul oficial LinkedIn, doar după ce apeși „Încarcă postarea”).

Limbile interfeței: **Română, English, Français, Italiano, Español, Português (PT), Deutsch, Magyar**

Un singur fișier HTML în care îți păstrezi local note despre postări LinkedIn (copiate manual) și o galerie de postări publice afișate prin embed-ul oficial LinkedIn.

**Live:** https://chiuta.github.io/Arhiva-LinkedIn/

![Captura de ecran](screenshot.ro.png)

*(Captura conține intrări de exemplu introduse pentru demonstrație.)*

## Ce este

Două file: **Arhivă** (text, autor, link, tag-uri, lipite de tine din postări pe care le-ai văzut deja) și **Galerie** (linkul unei postări publice LinkedIn sau codul „Embed this post", afișat într-un iframe oficial LinkedIn). Aplicația nu se conectează la LinkedIn, nu extrage (scrape) conținut și nu folosește API-ul LinkedIn: tot ce apare în Arhivă este ce ai lipit tu, iar Galeria doar încarcă embed-ul pe care LinkedIn îl oferă public. Neoficială, neafiliată cu LinkedIn.

## Funcții

Verificate în cod:
- Adăugare / editare / ștergere (cu confirmare) de intrări, în ambele file; tag-uri, filtrare după tag, căutare (fără diacritice și majuscule), sortare după dată.
- Galerie: acceptă codul iframe „Embed this post", un URN `urn:li:activity|share:…` sau un link de postare cu `-activity-<număr>-`; construiește adresa `https://www.linkedin.com/embed/feed/update/...`; adresele de alte domenii sunt respinse.
- Contor „N din M intrări”, număr de intrări pe fiecare tag, sortare și după autor (A–Z).
- Export Markdown al listei filtrate din fila activă; buton „Copiază” pe intrările din Arhivă (text, titlu, link).
- Avertisment la salvarea unui link deja existent (se poate salva oricum la a doua apăsare).
- Scurtături de tastatură: `/` pentru căutare, `n` pentru o intrare nouă (când focusul nu este într-un câmp de text).
- Stil de tipărire: se tipăresc doar cardurile Arhivei, fără bară de instrumente.
- Import CSV în Arhivă (butonul „Încarcă backup / CSV”): coloana de text este obligatorie (`content`, `text`, `commentary` sau `ShareCommentary`); opțional `url`/`link`/`ShareLink`, `author`, `title`, `date`, `tags`; separator `,` sau `;`, câmpuri între ghilimele; duplicatele (același link și text) și rândurile fără text sunt omise, iar linkurile non-http(s) sunt ignorate. Util pentru a prelua în bloc note dintr-un tabel propriu sau dintr-un export CSV.
- Backup JSON (descărcare/încărcare); la import intrările sunt validate și cele cu `id` deja existent sunt ignorate.
- Temă deschisă/întunecată, 8 limbi (RO, EN, FR, IT, ES, PT, DE, HU).
- **Jurnal de integritate (2.0.0):** fiecare notă din Arhivă primește la salvare o amprentă SHA-256, înregistrată într-un jurnal local înlănțuit (fiecare înregistrare include hash-ul precedentei). Cardul arată „sigilat” sau „modificată după sigiliu”; dialogul „Jurnal de integritate” verifică lanțul și arată capul lanțului. Exportul Markdown are frontmatter și o linie de integritate pe notă; backup-ul JSON include jurnalul. Limită: cine are acces la browser poate rescrie lanțul — păstrează separat capul lanțului pentru o dovadă mai puternică.
- **Cronologie pe autor (2.1.0):** butonul „Cronologie pe autor” grupează notele din Arhivă pe autor (fără diferențe de diacritice sau majuscule) și listează notele fiecărui autor în ordine cronologică (data postării sau, dacă lipsește, data adăugării). Respectă căutarea și tag-ul active, iar un autor poate fi aplicat ca filtru dintr-un clic.
- **Căutare (2.1.0):** mai mulți termeni se combină cu ȘI și se caută în autor, titlu, text, notă, link și tag-uri (full-text peste tot ce ai salvat).

## Manual de utilizare

1. În **Arhivă** apasă „+", lipește textul postării (obligatoriu), opțional linkul, autorul, titlul, data și tag-urile, apoi „Salvează".
2. În **Galerie** apasă „+" și lipește linkul postării publice sau codul din „Embed this post" (pe LinkedIn: butonul „…" → „Embed this post").
3. Folosește căutarea, tag-urile și sortarea pentru a găsi intrări.
4. „Descarcă backup" salvează tot într-un fișier JSON; „Încarcă backup" îl reia pe alt browser.

## Confidențialitate și rețea

- Stocare: `localStorage` (chei `lka_archive_v1`, `lka_gallery_v1`, `lka_theme_v1`, `lka_lang_v1`). Datele rămân în browserul tău; nu există server propriu și nu există statistici. Dacă stocarea este blocată (mod privat), aplicația afișează un mesaj la salvare.
- Gazdă externă: `www.linkedin.com`, **doar** în fila Galerie, câte o cerere pentru fiecare postare afișată. „Fără cont" nu înseamnă „fără urmărire": LinkedIn primește adresa ta IP și adresa postării afișate, poate seta cookie-uri proprii în cadrul respectiv și, dacă ești autentificat pe LinkedIn în același browser, te poate recunoaște. Dacă nu vrei acest lucru, folosește doar fila Arhivă.
- Linkurile „Deschide originalul" se deschid doar la click, cu `noopener`; doar linkuri `http(s)` sunt acceptate.
- Permisiuni de browser: nu cere niciuna.

## Limite și avertismente

- Postările din Arhivă pot conține texte și date personale ale altor persoane și sunt protejate de drepturi de autor; păstrează-le pentru uz personal și respectă Termenii LinkedIn și legislația privind datele personale înainte de a le republica.
- Galeria arată doar ce permite LinkedIn să fie încorporat; postări șterse sau private nu se afișează.
- Previzualizarea embed-urilor nu a putut fi testată cu rețea reală în acest repository; testele au folosit un înlocuitor local pentru cadrul LinkedIn.
- Sandbox-ul cadrului (`allow-scripts allow-same-origin allow-popups…`) este o măsură de precauție; dacă un embed nu se afișează corect, aceasta este prima verificare.
- **Drepturi de autor (2.1.0):** aplicația afișează acum o notă despre drepturile de autor (subsol, formularul de intrare, cronologie): postările arhivate aparțin autorilor lor; păstrează-le pentru uz personal și verifică Termenii LinkedIn, acordul autorului și legislația privind datele personale înainte de a republica sau distribui un text. Nota este informativă, nu consultanță juridică.

## Rulare locală / offline

Descarcă `index.html` și deschide-l în browser. Fila Arhivă funcționează complet offline; Galeria are nevoie de internet.

## Istoric / Changelog

### 2.1.0 — 2026-10-27
- Cronologie pe autor, căutare full-text cu mai mulți termeni, notă despre drepturile de autor în aplicație, `CHANGELOG.md`. Anterior: v2.0.0.

### 1.2.3 — 2026-10-22
- fff-kit 1.1.4: ținte tactile și text minim

### 1.2.2 — 2026-10-22
- fff-kit 1.1.2: PBKDF2 600 000 iterații, protecție anti-clickjacking

### 1.2.1 — 2026-10-22
- Embed-urile din Galerie se încarcă acum doar la clic: deschiderea aplicației sau a filei Galerie nu mai contactează LinkedIn; fiecare postare se încarcă abia când apeși „Încarcă postarea” (cu o notă că LinkedIn îți vede apoi IP-ul).
- Mobil: niciun text sub 12 px și ținte tactile de cel puțin 24 px (WCAG 2.5.8).

### 1.1.0 — 2026-10-14
- Copie de rezervă și etichetare date (fff-kit).

### 12 octombrie 2026 (v1.0.0)
- 1.0.0 — 2026-10-12: versiunea și data ultimei actualizări sunt afișate în aplicație

### 11 octombrie 2026 (a treia intrare)
- Import CSV în Arhivă, cu detectarea separatorului și a coloanelor după antet, omiterea duplicatelor și mesaje în cele 7 limbi; mesajul de eroare de import menționează acum și formatul CSV.

### 11 octombrie 2026 (a doua intrare)
- Politica CSP: `script-src` cu hash în loc de `'unsafe-inline'` (aplicația nu avea atribute `on*` inline).
- Funcții noi: export Markdown, copiere intrare, contor și numărători pe tag-uri, sortare după autor, avertisment pentru linkuri duplicate, scurtături de tastatură, stil de tipărire; textele noi sunt traduse în toate cele 7 limbi.
- Captura de ecran actualizată (butonul „Exportă Markdown”, contorul și acțiunea „Copiază”).

### 11 octombrie 2026
- Accesibilitate: conținutul principal este încadrat în <main> (axe: 0 violări).
- Salvarea unei intrări goale afișează acum mesajul de eroare ca alertă anunțată de cititoarele de ecran și mută focusul în câmpul „Conținut”.

## Licență

MIT — vezi fișierul [LICENSE](LICENSE).

## Autor

Alexio — Alexandru-Ionuț Chiuță, contact: alexio@trom.tf

## Rezumat

Un caiet neoficial într-un singur fișier pentru postări LinkedIn: o filă Arhivă pentru textul lipit manual și o filă Galerie care arată postări publice prin iframe-ul oficial de încorporare LinkedIn. Nu extrage date de pe LinkedIn și nu folosește API-ul acestuia. Datele se păstrează în localStorage; Galeria contactează www.linkedin.com (care vede adresa ta IP și adresa postării). 8 limbi de interfață, copie de siguranță JSON, export Markdown, copiere intrare, avertisment pentru linkuri duplicate, scurtături de tastatură (/ și n), foaie de stil pentru tipărire. Licență: MIT (vezi LICENSE).
