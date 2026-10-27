# Jurnal de modificări

Format SemVer (MAJOR.MINOR.PATCH).

## 2.1.0 — 2026-10-27

Anterior: v2.0.0.

- Nou: buton „Cronologie pe autor” (Arhivă): note grupate pe autor, ordonate cronologic, cu filtrare dintr-un clic; respectă căutarea și tag-ul active.
- Îmbunătățit: căutarea combină mai mulți termeni (ȘI) în autor, titlu, text, notă, link și tag-uri.
- Nou: notă despre drepturile de autor ale postărilor arhivate (subsol, formularul de intrare, cronologie), în 8 limbi.
- Documentație: „Stare” și „Offline” în README; tag-urile și căutarea existau deja (v1.x) și sunt doar descrise mai clar.
- Teste: `tests/timeline.test.mjs`.

## 2.0.0 — 2026-10-26

- Jurnal de integritate cu amprente SHA-256 înlănțuite; export Markdown cu frontmatter (vezi README).
