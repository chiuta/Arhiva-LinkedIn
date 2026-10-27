# Jurnal de modificări

Format SemVer (MAJOR.MINOR.PATCH).

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
