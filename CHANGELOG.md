# Jurnal de modificări

Format SemVer (MAJOR.MINOR.PATCH).

## 2.4.3 — 2026-11-20

- fff-kit 1.8.1: când `localStorage`/`sessionStorage` aruncă sau lipsesc (cookie-uri și date de site blocate, WebView fără stocare, `<iframe sandbox>`), kitul pune în loc o stocare în memorie, iar pagina pornește în loc să se oprească; datele nu se păstrează după închiderea paginii
- fff-kit 1.8.1: ghidajul care mărește controalele mici la 44 px măsoară acum și lățimea corpului paginii și a părintelui, deci un rând de butoane nu mai poate ieși din ecran (grupul rămâne neatins când mărirea l-ar depăși)

## 2.4.2 — 2026-11-17

- Compatibilitate cu browsere mai vechi (Chrome/Edge 55+, Firefox 52+, Safari 10.1+/iOS 10.3+): kitul 1.8.0 aduce stratul de compatibilitate (rezerve pentru API-urile care lipsesc în motoarele vechi), iar sintaxa JavaScript mai nouă decât ES2017 a fost înlocuită cu forme echivalente acolo unde exista; expresiile regulate noi și `import()` trec prin rezerve. Fără modificări de funcționalitate intenționate. Verificat cu parser ES2017 și într-un motor vechi simulat, nu pe dispozitive reale.

## 2.4.1 — 2026-11-15

- Nou: butoane de distribuire pe rețele sociale (vertical, pe marginea din stânga; fără scripturi externe, doar linkuri deschise la clic); bara de zoom cu lupă și „potrivire ecran” revine pe marginea din dreapta, centrată pe verticală; corectat afișarea suprapusă la zoom mare (panourile cu înălțimi în vh/vw nu mai ies din ecran).

## 2.4.0 — 2026-11-15

- Nou: accesibilitate pe toate ecranele — butonul „Aa” (mărimea textului, contrast ridicat, fără animații, text lizibil, linkuri subliniate, citire cu voce), săgeata „Înapoi sus” și „Sari la conținut”; fereastra se potrivește mereu ecranului; zoom-ul cu lupă și „potrivire ecran” stau acum pe marginea din stânga (fff-kit 1.6.0).

## 2.3.8 — 2026-11-15

- Nou: texturi fractale hiper-detaliate (fff-texturi 1.1.2) — fundalul și suprafețele mari (carduri, panouri, antete, butoane; filele și dialogurile ascunse la încărcare, când se deschid) primesc un material generat local (WebGL2, fără rețea și fără imagini), care se repetă fără cusătură; culorile aplicației rămân ale ei. Se oprește din dialogul „Transparență” sau cu `?notex=1`.

## 2.3.0 — 2026-11-02 (reîmprospătare kit)

- Nou (kit): **Sincronizare între dispozitive** (`FFF.sync`) — în dialogul «Transparență» (clic pe versiune → Copie de siguranță): conectezi două dispozitive direct (WebRTC, cod/QR, fără server și fără cont) și își schimbă datele aplicației; cea mai recentă valoare câștigă, secretele (chei API, parole) nu se trimit, ștergerile nu se propagă. Aplicarea trece prin importul kitului (confirmare, chei permise, rollback).
- Nou (kit): **Istoric local — «mașina timpului»** (`FFF.history`) — instantanee automate ale datelor (IndexedDB, fără secrete), diferență față de starea curentă și restaurare reversibilă; «Șterge datele aplicației» șterge și istoricul.
- Module adăugate: `qr`, `p2p`, `sync`, `history` (+~140 KB). Versiunea aplicației nu se schimbă.

## 2.3.0 — 2026-11-01

- Corectat: adaptorul «Trimite la…» nu mai aruncă eroare când kitul FFF lipsește (gardian pe fiecare bloc; găsit de testul «fără kit» din CI).

Nou: «Trimite la…» (fff-kit, modulul FFF.bridge) — după orice export de fișier (GPX, ICS, CSV, Markdown) apare butonul «Trimite la…» către aplicațiile compatibile, iar importul de fișiere al aplicației primește plicuri .fff.json trimise de ele, cu confirmare înainte de import. Fără rețea, fără telemetrie.

## 2.2.0 — 2026-10-27

Anterior: v2.1.0.

- Nou: **gestionare tag-uri** (buton „Gestionează tag-uri”): redenumire, îmbinare și ștergere a unui tag în toate intrările filei curente; în Arhivă fiecare intrare modificată primește o înregistrare `edit` în jurnalul de integritate (lanțul rămâne valid, sigiliile la zi). Nume de cel mult 60 de caractere, fără virgule; filtrul activ urmărește redenumirea. Texte în 8 limbi (fr/it/es/pt/de/hu automate, nerevizuite de vorbitori nativi).
- Tag-urile, filtrarea după tag și contoarele existau deja din v1.x; nu au fost refăcute.
- Teste: `tests/tags.test.mjs` (27 de verificări); `timeline` și `integrity-journal` trec.
- Nu s-a făcut: filtrare după mai multe tag-uri simultan (rămâne un singur tag activ); tag-uri ierarhice; sugestii de completare în formular; previzualizarea embed LinkedIn rămâne netestată cu rețea reală.

## 2.1.0 — 2026-10-27

Anterior: v2.0.0.

- Nou: buton „Cronologie pe autor” (Arhivă): note grupate pe autor, ordonate cronologic, cu filtrare dintr-un clic; respectă căutarea și tag-ul active.
- Îmbunătățit: căutarea combină mai mulți termeni (ȘI) în autor, titlu, text, notă, link și tag-uri.
- Nou: notă despre drepturile de autor ale postărilor arhivate (subsol, formularul de intrare, cronologie), în 8 limbi.
- Documentație: „Stare” și „Offline” în README; tag-urile și căutarea existau deja (v1.x) și sunt doar descrise mai clar.
- Teste: `tests/timeline.test.mjs`.

## 2.0.0 — 2026-10-26

- Jurnal de integritate cu amprente SHA-256 înlănțuite; export Markdown cu frontmatter (vezi README).
