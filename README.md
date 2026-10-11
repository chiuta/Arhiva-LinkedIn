# Arhivă & Galerie LinkedIn — clipe salvate fără cont

Un singur fișier HTML în care îți păstrezi local note despre postări LinkedIn (copiate manual) și o galerie de postări publice afișate prin embed-ul oficial LinkedIn.

**Live:** https://chiuta.github.io/Arhiva-LinkedIn/

**Ultima actualizare:** 11 octombrie 2026

![Captura de ecran](screenshot.png)

*(Captura conține intrări de exemplu introduse pentru demonstrație.)*

## Ce este

Două file: **Arhivă** (text, autor, link, tag-uri, lipite de tine din postări pe care le-ai văzut deja) și **Galerie** (linkul unei postări publice LinkedIn sau codul „Embed this post", afișat într-un iframe oficial LinkedIn). Aplicația nu se conectează la LinkedIn, nu extrage (scrape) conținut și nu folosește API-ul LinkedIn: tot ce apare în Arhivă este ce ai lipit tu, iar Galeria doar încarcă embed-ul pe care LinkedIn îl oferă public. Neoficială, neafiliată cu LinkedIn.

## Funcții

Verificate în cod:
- Adăugare / editare / ștergere (cu confirmare) de intrări, în ambele file; tag-uri, filtrare după tag, căutare (fără diacritice și majuscule), sortare după dată.
- Galerie: acceptă codul iframe „Embed this post", un URN `urn:li:activity|share:…` sau un link de postare cu `-activity-<număr>-`; construiește adresa `https://www.linkedin.com/embed/feed/update/...`; adresele de alte domenii sunt respinse.
- Backup JSON (descărcare/încărcare); la import intrările sunt validate și cele cu `id` deja existent sunt ignorate.
- Temă deschisă/întunecată, 7 limbi (RO, EN, FR, IT, ES, PT, DE).

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

## Rulare locală / offline

Descarcă `index.html` și deschide-l în browser. Fila Arhivă funcționează complet offline; Galeria are nevoie de internet.

## Istoric / Changelog

### 11 octombrie 2026
- Accesibilitate: conținutul principal este încadrat în <main> (axe: 0 violări).
- Salvarea unei intrări goale afișează acum mesajul de eroare ca alertă anunțată de cititoarele de ecran și mută focusul în câmpul „Conținut”.

## Licență

Licența nu este încă declarată.

## Autor

Alexio — Alexandru-Ionuț Chiuță, contact: alexio@trom.tf

## English summary

A single-file, unofficial notebook for LinkedIn posts: an Archive tab for text you paste manually, and a Gallery tab that shows public posts through LinkedIn's official embed iframe. It does not scrape LinkedIn or use its API. Data is kept in localStorage; the Gallery contacts www.linkedin.com (which sees your IP and the post address). 7 UI languages, JSON backup. License not yet declared.
