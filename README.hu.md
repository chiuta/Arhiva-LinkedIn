# LinkedIn-archívum és -galéria — mentett pillanatok, fiók nélkül

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · **Magyar**

**Verzió:** 2.2.0 · **Utolsó frissítés:** 2026-10-27

A felület nyelvei: **Română, English, Français, Italiano, Español, Português (PT), Deutsch, Magyar**

Egyetlen HTML-fájl, amelyben helyben tárolhatsz jegyzeteket LinkedIn-bejegyzésekről (kézzel másolva), valamint nyilvános bejegyzések galériáját, amelyeket a LinkedIn hivatalos beágyazása jelenít meg.

**Online alkalmazás:** https://chiuta.github.io/Arhiva-LinkedIn/

![Képernyőkép](screenshot.hu.png)

*(A képernyőkép bemutatás céljából felvett példabejegyzéseket tartalmaz.)*

## Mi ez

Két lap: **Archívum** (szöveg, szerző, hivatkozás, címkék, amelyeket te illesztettél be már látott bejegyzésekből) és **Galéria** (egy nyilvános LinkedIn-bejegyzés hivatkozása vagy az „Embed this post” kód, hivatalos LinkedIn iframe-ben megjelenítve). Az alkalmazás nem csatlakozik a LinkedInhez, nem nyer ki tartalmat (scraping), és nem használja a LinkedIn API-ját: minden, ami az Archívumban megjelenik, az, amit te illesztettél be, a Galéria pedig csupán azt a beágyazást tölti be, amelyet a LinkedIn nyilvánosan kínál. Nem hivatalos, nincs kapcsolatban a LinkedInnel.

## Funkciók

A kódban ellenőrizve:
- Bejegyzések hozzáadása / szerkesztése / törlése (megerősítéssel), mindkét lapon; címkék, szűrés címke szerint, keresés (ékezet- és kisbetű/nagybetű-független), rendezés dátum szerint.
- Galéria: elfogadja az „Embed this post” iframe-kódot, egy `urn:li:activity|share:…` URN-t vagy egy `-activity-<szám>-` részt tartalmazó bejegyzés-hivatkozást; felépíti a `https://www.linkedin.com/embed/feed/update/...` címet; más domainek címeit elutasítja.
- „N / M bejegyzés” számláló, bejegyzések száma címkénként, rendezés szerző szerint is (A–Z).
- Az aktív lap szűrt listájának Markdown-exportja; „Másolás” gomb az Archívum bejegyzésein (szöveg, cím, hivatkozás).
- Figyelmeztetés már létező hivatkozás mentésekor (második megnyomásra mégis menthető).
- Billentyűparancsok: `/` a kereséshez, `n` új bejegyzéshez (ha a fókusz nem szövegmezőben van).
- Nyomtatási stílus: csak az Archívum kártyái nyomtatódnak, eszköztár nélkül.
- CSV-import az Archívumba („Biztonsági mentés / CSV betöltése” gomb): a szöveg oszlop kötelező (`content`, `text`, `commentary` vagy `ShareCommentary`); opcionális `url`/`link`/`ShareLink`, `author`, `title`, `date`, `tags`; `,` vagy `;` elválasztó, idézőjelek közötti mezők; a duplikátumokat (azonos hivatkozás és szöveg) és a szöveg nélküli sorokat kihagyja, a nem http(s) hivatkozásokat figyelmen kívül hagyja. Hasznos jegyzetek tömeges átvételéhez saját táblázatból vagy CSV-exportból.
- JSON biztonsági mentés (letöltés/feltöltés); importáláskor a bejegyzések ellenőrzésen esnek át, és a már létező `id`-jűeket figyelmen kívül hagyja.
- Világos/sötét téma, 8 nyelv (RO, EN, FR, IT, ES, PT, DE, HU).

## Használati útmutató

1. Az **Archívum** lapon nyomd meg a „+” gombot, illeszd be a bejegyzés szövegét (kötelező), opcionálisan a hivatkozást, a szerzőt, a címet, a dátumot és a címkéket, majd „Mentés”.
2. A **Galéria** lapon nyomd meg a „+” gombot, és illeszd be a nyilvános bejegyzés hivatkozását vagy az „Embed this post” kódját (a LinkedInen: a „…” gomb → „Embed this post”).
3. A keresés, a címkék és a rendezés segítségével találhatod meg a bejegyzéseket.
4. A „Biztonsági mentés letöltése” mindent egy JSON-fájlba ment; a „Biztonsági mentés betöltése” egy másik böngészőben visszaállítja.

## Adatvédelem és hálózat

- Tárolás: `localStorage` (`lka_archive_v1`, `lka_gallery_v1`, `lka_theme_v1`, `lka_lang_v1` kulcsok). Az adatok a böngésződben maradnak; nincs saját szerver és nincs statisztika. Ha a tárolás le van tiltva (privát mód), az alkalmazás mentéskor üzenetet jelenít meg.
- Külső gazdagép: `www.linkedin.com`, **kizárólag** a Galéria lapon, megjelenített bejegyzésenként egy kérés. A „fiók nélkül” nem jelent „követés nélkül”-t: a LinkedIn megkapja az IP-címedet és a megjelenített bejegyzés címét, saját sütiket állíthat be az adott keretben, és ha ugyanabban a böngészőben be vagy jelentkezve a LinkedInre, felismerhet. Ha ezt nem szeretnéd, használd csak az Archívum lapot.
- Az „Eredeti megnyitása” hivatkozások csak kattintásra nyílnak meg, `noopener`-rel; csak `http(s)` hivatkozások fogadhatók el.
- Böngészőengedélyek: egyet sem kér.

## Korlátok és figyelmeztetések

- Az Archívum bejegyzései tartalmazhatnak más személyek szövegeit és személyes adatait, és szerzői jog védi őket; személyes használatra őrizd meg őket, és újraközlésük előtt tartsd be a LinkedIn Felhasználási feltételeit és a személyes adatokra vonatkozó jogszabályokat.
- A Galéria csak azt mutatja, amit a LinkedIn beágyazni enged; a törölt vagy privát bejegyzések nem jelennek meg.
- A beágyazások előnézetét ebben a tárolóban nem lehetett valódi hálózattal tesztelni; a tesztek a LinkedIn-keret helyi pótlékát használták.
- A keret sandboxa (`allow-scripts allow-same-origin allow-popups…`) óvintézkedés; ha egy beágyazás nem jelenik meg helyesen, ezt kell először ellenőrizni.

## Helyi / offline futtatás

Töltsd le az `index.html` fájlt, és nyisd meg egy böngészőben. Az Archívum lap teljesen offline működik; a Galériához internet kell.

## Előzmények / Changelog

### 1.2.3 — 2026-10-22
- fff-kit 1.1.4: érintési célpontok és minimális szövegméret

### 1.2.2 — 2026-10-22
- fff-kit 1.1.2: PBKDF2 600 000 iteráció, clickjacking elleni védelem

### 1.2.1 — 2026-10-22
- A Galéria beágyazásai mostantól csak kattintásra töltődnek be: az alkalmazás vagy a Galéria fül megnyitása már nem veszi fel a kapcsolatot a LinkedIn-nel; minden bejegyzés csak a „Bejegyzés betöltése” gombra töltődik be (jelzéssel, hogy ekkor a LinkedIn látja az IP-címedet).
- Mobil: nincs 12 px alatti szöveg, az érintési célpontok legalább 24 px-esek (WCAG 2.5.8).

### 1.1.0 — 2026-10-14
- Adatok biztonsági mentése és címkézése (fff-kit).

### 2026. október 12. (v1.0.0)
- 1.0.0 — 2026-10-12: a verzió és az utolsó frissítés dátuma megjelenik az alkalmazásban

### 2026. október 11. (harmadik bejegyzés)
- CSV-import az Archívumba, az elválasztó és az oszlopok fejléc alapján történő felismerésével, a duplikátumok kihagyásával és üzenetekkel a 7 nyelven; az importálási hibaüzenet most már a CSV-formátumot is megemlíti.

### 2026. október 11. (második bejegyzés)
- CSP-szabályzat: `script-src` hash-sel az `'unsafe-inline'` helyett (az alkalmazásban nem voltak beágyazott `on*` attribútumok).
- Új funkciók: Markdown-export, bejegyzés másolása, számláló és címkénkénti darabszámok, rendezés szerző szerint, figyelmeztetés duplikált hivatkozásokra, billentyűparancsok, nyomtatási stílus; az új szövegek mind a 7 nyelvre le vannak fordítva.
- A képernyőkép frissítve (a „Markdown exportálása” gomb, a számláló és a „Másolás” művelet).

### 2026. október 11.
- Akadálymentesség: a fő tartalom <main> elembe van foglalva (axe: 0 szabálysértés).
- Üres bejegyzés mentésekor a hibaüzenet most képernyőolvasók által felolvasott figyelmeztetésként jelenik meg, és a fókusz a „Tartalom” mezőbe kerül.

## Licenc

MIT — lásd a [LICENSE](LICENSE) fájlt.

## Szerző

Alexio — Alexandru-Ionuț Chiuță, elérhetőség: alexio@trom.tf

## Összefoglaló
Egyfájlos, nem hivatalos jegyzetfüzet LinkedIn-bejegyzésekhez: az Archívum fülön kézzel beillesztett szöveget tárolhatsz, a Galéria fül pedig a nyilvános bejegyzéseket a LinkedIn hivatalos beágyazott iframe-jén keresztül mutatja. Nem scrape-eli a LinkedInt, és nem használja az API-ját. Az adatok a localStorage-ban vannak; a Galéria a www.linkedin.com címet éri el (amely látja az IP-címedet és a bejegyzés címét). 8 felületi nyelv, JSON-mentés, Markdown-export, bejegyzés másolása, ismétlődő hivatkozás figyelmeztetés, billentyűparancsok (/ és n), nyomtatási stíluslap. Licenc: MIT (lásd LICENSE).
