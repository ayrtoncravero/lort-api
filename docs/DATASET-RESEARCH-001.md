# DATASET-RESEARCH-001 — LORT Dataset & Scope Research

Status: RESEARCH ONLY. No code, DTO, controller, service, repository, JSON, or frontend changes were made as part of this document. Nothing here is authorized for implementation until reviewed and approved separately.

Labeling convention used throughout: **FACT** (directly verifiable/observed), **SOURCE CLAIM** (asserted by a specific external source, not independently verified by LORT), **INFERENCE** (LORT's own reasoning from facts/claims), **RECOMMENDATION** (a proposal, not a decision). Where sources don't establish something: "Not established by the reviewed sources."

---

## 1. Sources

### Tolkien Estate (tolkienestate.com)
- SOURCE CLAIM: The Estate "does not give permission for use of its copyright works" in commercial, charitable, or not-for-profit contexts, as a general default posture. [tolkienestate.com FAQ]
- SOURCE CLAIM: Tolkien's invented languages/scripts are copyright-protected; private/personal use is tolerated, but publication or group/public use is not permitted without a license. [tolkienestate.com FAQ]
- SOURCE CLAIM: Public readings of Tolkien's text require permission and may not be recorded, streamed, or uploaded. [tolkienestate.com FAQ]
- SOURCE CLAIM: "TOLKIEN" is a registered trademark; clubs/societies need a licence to use the name.
- SOURCE CLAIM: Original drawings, paintings, maps, designs and scripts are copyright-protected and "may not be copied."
- SOURCE CLAIM: Images require permission from the Bodleian Library (which holds much of the Tolkien manuscript/art archive) or Marquette University (for LOTR/Hobbit manuscripts).
- SOURCE CLAIM: Fan fiction, fanzines, and derivative works referencing Tolkien's characters/stories are described as not permitted without authorization.
- INFERENCE: The Estate's posture is maximally restrictive by default; LORT should not assume any implicit "fan API" exemption.

### HarperCollins (Permissions Department)
- SOURCE CLAIM: All bona fide requests to quote from Tolkien's *published* works should go to HarperCollins Publishers' Permissions Department. [tolkienestate.com FAQ; harpercollins.co.uk]
- SOURCE CLAIM: Typical turnaround for a permissions request is 16–20 weeks, longer if estate/author approval is also required. [harpercollins.co.uk glossary page]
- INFERENCE: HarperCollins is the correct channel specifically for *verbatim published-text* licensing (i.e., Option A "full quote text" in §12), not for factual metadata (names, dates, page counts).

### Tolkien Gateway (tolkiengateway.net)
- FACT (per site's own copyright page, as reported by search results): Tolkien Gateway's own written/wiki content is licensed **CC BY-SA 4.0** as of January 1, 2025 (previously GFDL). [tolkiengateway.net/wiki/Tolkien_Gateway:Copyrights]
- SOURCE CLAIM: Images on the site are generally reserved to their individual authors unless otherwise stated; the site relies on US fair-use doctrine for some hosted artwork as a not-for-profit educational site.
- INFERENCE: Tolkien Gateway's *prose/wiki text* (CC BY-SA) is a workable **research source** for LORT (verifying names, dates, relationships) and is even license-compatible for reuse of *original TG wiki prose* with attribution — but the underlying in-universe facts it describes are themselves drawn from Tolkien's copyrighted books, and TG's CC BY-SA license does not extend to Tolkien's original text or images.
- Distinction required by this task: TG is a **research source** for corroborating facts (dates, relationships, categorizations) always; it is a **conditionally redistributable source** only for TG's own original wiki prose (attribution-required, share-alike), never for Tolkien's verbatim text or third-party images hosted there.

### Tolkien Society (tolkiensociety.org)
- FACT: Self-described as "an educational charity, literary society and international fan club" devoted to promoting the life and works of J.R.R. Tolkien.
- SOURCE CLAIM: Publishes a bulletin (*Amon Hen*) and peer-reviewed journal (*Mallorn*); maintains a links/resources page.
- INFERENCE: Useful as a **secondary/community reference** for corroboration and for pointers to scholarly discussion, not as a primary data or licensing source. No licensing terms for bulk reuse of their content were found in the reviewed pages.

### The One API (the-one-api.dev)
- FACT: The One API is a public REST API serving structured data about LOTR/Hobbit books, movies, characters, and quotes (per its own landing/documentation pages and multiple third-party client repos on GitHub).
- Not established by the reviewed sources: exact license terms for the dataset itself. The WebFetch attempt against `the-one-api.dev/documentation` returned insufficient content to confirm license text; this needs a follow-up dedicated fetch/review before any comparison or reuse decision, and MUST NOT be assumed permissive.
- SOURCE CLAIM (from third-party GitHub descriptions, not the-one-api.dev itself): the API "provides you with book, character, movie and quotes data" and requires an API key for access.
- INFERENCE: The One API is useful for **shape/comparison** (what fields do competitors expose, what relationships do they model) but must not be scraped or copied wholesale — both because its own license is unconfirmed, and because doing so would just re-import the same unverified-provenance data LORT is trying to avoid.
- RECOMMENDATION: Before any structural comparison work beyond this document, do a dedicated read of the-one-api.dev's terms/license page and its GitHub repo's LICENSE file.

---

## 2. Source classification

| Source | Type | Reliability | License | Redistribution risk | Attribution required | Usefulness for LORT |
|---|---|---|---|---|---|---|
| Tolkien Estate | Official rights holder | High (authoritative on rights) | N/A (not a content source) | N/A | N/A | Defines the boundary of what LORT can legally do |
| HarperCollins | Official rights holder (publisher) | High | Case-by-case licensing | High if ignored | Required if licensed | Only channel for verbatim published text |
| Tolkien Gateway | Community reference / wiki | Medium-High for structured facts, variable for individual edits | CC BY-SA 4.0 (TG's own prose only) | Medium (must not reuse Tolkien's text or third-party images hosted there) | Yes, for TG-original content | Strong for corroborating facts (dates, relations, categories) |
| Tolkien Society | Community reference / secondary | Medium (curatorial, not primary text) | Not established by the reviewed sources | Low (not proposed as a data source) | Not established | Corroboration / pointer to scholarship |
| The One API | Dataset/API (third-party aggregator) | Unconfirmed provenance | Not established by the reviewed sources | Unknown until confirmed — treat as high until verified | Unknown | Comparison/reference only, not a data source |

---

## 3. Characters research (candidates for 50–75)

This is a candidate list for *future* consideration, not an addition. No JSON was touched.

| Candidate | Category | Importance | Available factual data | Suggested sources | Confidence | Notes |
|---|---|---|---|---|---|---|
| Frodo Baggins | Hobbit | Already in dataset | High | — | — | Existing |
| Gandalf | Maia | Already in dataset | High | — | — | Existing; also an Ainur candidate (see §5) |
| Aragorn | Human | Already in dataset | High | — | — | Existing |
| Legolas | Elf | Already in dataset | High | — | — | Existing |
| Gimli | Dwarf | Already in dataset | High | — | — | Existing |
| Samwise Gamgee | Hobbit | Already in dataset | High | — | — | Existing |
| Galadriel | Elf | Already in dataset | High | — | — | Existing |
| Boromir | Human | Already in dataset | High | — | — | Existing |
| Meriadoc Brandybuck | Hobbit | Already in dataset | High | — | — | Existing |
| Peregrin Took | Hobbit | Already in dataset | High | — | — | Existing |
| Arwen | Elf | Already in dataset | High | — | — | Existing |
| Elrond | Elf | Already in dataset | High | — | — | Existing |
| Bilbo Baggins | Hobbit | Already in dataset | High | — | — | Existing |
| Sauron | Maia | Already in dataset | High | — | — | Existing; Ainur candidate |
| Saruman | Maia | Already in dataset | High | — | — | Existing; Ainur candidate |
| Eowyn | Human | Already in dataset | High | — | — | Existing |
| Faramir | Human | Already in dataset | High | — | — | Existing |
| Theoden | Human | Already in dataset | High | — | — | Existing |
| Gollum | Hobbit (Stoor) | Already in dataset | High | — | — | Existing |
| Denethor II | Human | Major | High | Tolkien Gateway, published text | High | Steward of Gondor, Boromir/Faramir's father |
| Elladan | Elf | Minor-major | Medium | Tolkien Gateway | Medium | Elrond's son |
| Elrohir | Elf | Minor-major | Medium | Tolkien Gateway | Medium | Elrond's son |
| Celeborn | Elf | Major | High | Tolkien Gateway | High | Galadriel's spouse; already referenced as `spouse` string |
| Thranduil | Elf | Major | High | Tolkien Gateway | High | Legolas's father, King of Mirkwood |
| Bard the Bowman | Human | Major | Medium-High | Tolkien Gateway | High | The Hobbit |
| Thorin Oakenshield | Dwarf | Major | High | Tolkien Gateway | High | The Hobbit lead dwarf |
| Balin | Dwarf | Major | High | Tolkien Gateway | High | The Hobbit / Moria |
| Dwalin | Dwarf | Minor-major | Medium | Tolkien Gateway | Medium | The Hobbit |
| Fili | Dwarf | Minor | Medium | Tolkien Gateway | Medium | The Hobbit |
| Kili | Dwarf | Minor | Medium | Tolkien Gateway | Medium | The Hobbit |
| Smaug | Dragon | Major | High | Tolkien Gateway | High | Not a "race" fitting current schema cleanly — see §4 |
| Gollum's precursor: Deagol | Hobbit (Stoor) | Minor | Medium | Tolkien Gateway | Medium | Backstory character |
| Treebeard (Fangorn) | Ent | Major | High | Tolkien Gateway | High | Requires "Ent" as race value |
| Radagast | Maia (Istar) | Minor-major | Medium | Tolkien Gateway | Medium | Ainur candidate |
| Tom Bombadil | Unclassified/unique | Major (lore-significant) | Low-Medium (deliberately ambiguous in-universe) | Tolkien Gateway, published text | Low | Notoriously unresolved nature; document as such, don't force a race |
| Goldberry | Unclassified | Minor | Low | Tolkien Gateway | Low | Same ambiguity as Bombadil |
| Elendil | Human (Númenórean) | Major (historical) | High | Tolkien Gateway, Silmarillion/appendices | High | Second Age; Aragorn's ancestor |
| Isildur | Human (Númenórean) | Major (historical) | High | Tolkien Gateway | High | Second Age |
| Anárion | Human (Númenórean) | Major (historical) | Medium | Tolkien Gateway | Medium | Second Age |
| Círdan | Elf | Minor-major | Medium | Tolkien Gateway | Medium | Shipwright, Third Age |
| Glorfindel | Elf | Minor-major | Medium | Tolkien Gateway | Medium | Appears in both First and Third Age accounts — continuity note |
| Éomer | Human | Major | High | Tolkien Gateway | High | Rohan, King after Théoden |
| Grima Wormtongue | Human | Major (antagonist) | High | Tolkien Gateway | High | Rohan |
| Shelob | Giant spider | Minor-major | Medium | Tolkien Gateway | Medium | Not a humanoid "race" — schema stress case |
| Witch-king of Angmar | Maia? / Human turned wraith | Major (antagonist) | Medium (nature debated) | Tolkien Gateway | Low-Medium | Nazgûl are former Men corrupted by Rings — race field ambiguous |
| The other 8 Nazgûl (unnamed individually in most texts) | Human (formerly) | Minor | Low | Tolkien Gateway | Low | Mostly unnamed; may not be worth individual entries |
| Beorn | Skin-changer/Human | Minor-major | Medium | Tolkien Gateway | Medium | The Hobbit; unique "race" |
| Elanor Gamgee | Hobbit | Minor | Low-Medium | Tolkien Gateway (appendices) | Low | Sam's daughter, Fourth Age |
| Farmer Maggot | Hobbit | Minor | Low | Tolkien Gateway | Low | Minor Shire character |
| Barliman Butterbur | Human | Minor | Medium | Tolkien Gateway | Medium | Bree innkeeper |
| Strider's allies at Bree (Nob) | Hobbit | Minor | Low | Tolkien Gateway | Low | Very minor |
| Húrin | Human | Major (First Age) | High (Silmarillion/Children of Húrin) | Tolkien Gateway | High | Expands scope into First Age/Silmarillion — a scope decision, see §16 |
| Túrin Turambar | Human | Major (First Age) | High | Tolkien Gateway | High | Same scope note |
| Beren | Human | Major (First Age) | High | Tolkien Gateway | High | Same scope note |
| Lúthien | Elf | Major (First Age) | High | Tolkien Gateway | High | Same scope note |
| Fëanor | Elf | Major (First Age) | High | Tolkien Gateway | High | Same scope note |
| Eärendil | Half-elven | Major (First Age) | High | Tolkien Gateway | High | Same scope note |

RECOMMENDATION: reaching 50–75 characters cleanly, without straining the current schema (see §4), likely requires either (a) staying mostly within Third Age LOTR/Hobbit-era characters, where factual data is dense and well-sourced, or (b) explicitly deciding to include First Age/Silmarillion figures, which is a scope expansion beyond "the movies + core books" framing implied by the current dataset. This is a decision for the user, not assumed here.

---

## 4. Character schema evaluation (current fields, no changes made)

Current schema: `id, name, race, gender, birth, death, hair, height, realm, spouse, wikiUrl` — `name`/`race` required, rest nullable.

- **Good availability** (FACT, based on the candidate list above and the existing 19 records): `name`, `gender` (mostly binary and stated in-text for major characters), `wikiUrl` (Tolkien Gateway / Fandom wiki pages exist for essentially all candidates above).
- **Difficult to verify / inconsistent** (INFERENCE):
  - `race`: works for Hobbit/Elf/Human/Dwarf/Maia, but breaks down for Ent (Treebeard), giant spider (Shelob), dragon (Smaug), skin-changer (Beorn), and especially Nazgûl/Witch-king (formerly Human, transformed — "race" as a single string can't express that transformation cleanly) and Tom Bombadil (deliberately unclassifiable in-universe).
  - `height`: already `null` for all 19 existing records — Tolkien rarely gives precise heights; this field currently has **zero populated values** in the real dataset. FACT, verified by reading `characters.json`.
  - `birth`/`death`: populated with in-universe calendar strings (`"TA 2968"`, `"FO 120"`) rather than real dates — internally consistent but not machine-comparable/sortable as-is; expanding to First Age characters would introduce a *third* calendar era ("First Age", "YT") requiring documentation of the calendar system.
  - `hair`: present for many but stylistically inconsistent (colors vs. absent) — low-stakes field.
  - `spouse`: currently a free-text name string, not a relation/id — this is inconsistent with the rest of V1's numeric-relation philosophy (Quote already resolved to numeric ids); if Character-to-Character relations become common (spouse, parent/child, e.g. Elrond↔Elrond's sons, Aragorn↔Arwen), a numeric `spouseId: number|null` would be more consistent, but that's schema work, not in scope here.
- **Could be removed**: Not established that any field should be removed — `height` has zero current data but may become populated for movie-cast-derived data (actor height is documented, but that's an OOC/production fact, not lore) — flag as a modeling ambiguity, not a removal candidate.
- **Could be added** (RECOMMENDATION, not a decision): a `title`/`epithet` field (e.g., "The Grey", "King of the Mark") is common in fan datasets and well-sourced, but this is scope creep beyond what's asked here — noting it only as an observation.

---

## 5. Ainur research

**Hierarchy** (SOURCE CLAIM, standard Tolkien legendarium structure per Tolkien Gateway/Silmarillion accounts, not independently re-verified against primary text in this pass):
- **Eru Ilúvatar** — the singular creator deity, outside and above the Ainur hierarchy.
- **Ainur** — the overarching category of divine/angelic beings created by Eru before the world (Arda) existed.
  - **Valar** — the greatest of the Ainur who entered Arda to shape and govern it (e.g., Manwë, Varda, Ulmo, Aulë, Yavanna, Mandos/Námo, Nienna, Oromë, Tulkas; and the fallen Melkor/Morgoth).
  - **Maiar** — lesser Ainur, servants/associates of the Valar (e.g., Gandalf/Olórin, Saruman/Curumo, Radagast/Aiwendil, Sauron — originally a Maia of Aulë before his corruption, the Balrogs, Melian).

**Which current Characters are Maiar** (FACT, checked against `characters.json`): `Gandalf` (id 2), `Sauron` (id 14), `Saruman` (id 15) all currently have `"race": "Maia"` in the live dataset.

**Identity duplication problem** — the user's explicit concern: if "Ainur" became an independent resource, `Gandalf → Character(id:2)` and a hypothetical `Gandalf → Ainur(id:X)` would be two records describing one entity, with no defined relationship between them unless explicitly modeled.

### Model A — Ainur as an independent resource
- `GET /api/ainur`, `GET /api/ainur/:id` — entities like Manwë, Varda, Melkor, Olórin(Gandalf), Sauron, etc., with Ainur-specific fields (e.g., `category: 'Vala'|'Maia'`, `allegiance`, `domain`/`sphere`).
- Identity resolution requirement: would need an explicit link, e.g., `Character.ainurId: number | null` pointing from the Character record to the Ainur record for characters who are also Ainur (Gandalf, Sauron, Saruman, Radagast, the Balrogs if added, Melian if added).
- Pros: models the theological/cosmological structure properly; lets `/api/ainur` answer "who are the Valar" cleanly; avoids overloading `race` with a value that isn't really a "race" (Ainur are a spiritual order, not a biological race).
- Cons: two-record identity for the same character is inherently confusing for API consumers unless the link is very well documented; increases surface area (new resource, new relation, new validation rules) for a small number of entities (Ainur relevant to current LOTR-movie-era scope: realistically fewer than 10).

### Model B — Ainur as a classification/relation on Character
- Keep `race` as-is, OR add a boolean/enum flag such as `Character.ainurCategory: 'Vala' | 'Maia' | null`.
- Pros: no duplicate identity problem — one record per entity, always; minimal schema change; consistent with how `race: "Maia"` already works today (it's already doing this informally).
- Cons: doesn't cleanly support the Valar who are *not* also "characters" in the LOTR-movie sense (Manwë, Varda, Ulmo etc. never appear as story-participating "characters" the way Gandalf does) — if those are wanted, Model B has nowhere natural to put them without stretching the Character resource to include beings with essentially no traditional Character fields (no birth/death/spouse in the usual sense, no movie/book screen-time).

RECOMMENDATION (not a decision): Model B is the lower-risk, lower-complexity option for the Maiar who are *already* LOTR-movie characters (Gandalf, Saruman, Sauron, Radagast). Model A becomes justified only if LORT decides to also model Valar who never appear as "characters" (Manwë, Varda, etc.) — at that point a separate resource is the more honest model, with an explicit `Character.ainurId` link for the overlap cases, and the identity-duplication question must be answered explicitly before implementation, not left implicit.

---

## 6. Eru / Valar / Maiar table

| Entity | Category | Existing Character? | Candidate API entity? | Notes |
|---|---|---|---|---|
| Eru Ilúvatar | Creator (outside Ainur order) | No | Only if Ainur resource is built; would need special-cased (no "category") | Never appears as a story participant |
| Manwë | Vala | No | Yes, if Model A adopted | King of the Valar |
| Varda (Elbereth) | Vala | No | Yes, if Model A adopted | Frequently invoked in LOTR text/songs |
| Ulmo | Vala | No | Yes, if Model A adopted | — |
| Aulë | Vala | No | Yes, if Model A adopted | Maker of the Dwarves (SOURCE CLAIM per legendarium) |
| Yavanna | Vala | No | Yes, if Model A adopted | — |
| Mandos (Námo) | Vala | No | Yes, if Model A adopted | — |
| Nienna | Vala | No | Yes, if Model A adopted | — |
| Oromë | Vala | No | Yes, if Model A adopted | — |
| Tulkas | Vala | No | Yes, if Model A adopted | — |
| Melkor / Morgoth | Vala (fallen) | No | Yes, if Model A adopted | First Dark Lord, Sauron's original master |
| Olórin / Gandalf | Maia | **Yes** (id 2) | N/A under Model B; needs `ainurId` link under Model A | Already in dataset as `race: "Maia"` |
| Curumo / Saruman | Maia | **Yes** (id 15) | Same as above | Already in dataset |
| Sauron | Maia | **Yes** (id 14) | Same as above | Already in dataset; originally a Maia of Aulë |
| Aiwendil / Radagast | Maia | No (candidate, §3) | Same as above | Not yet in dataset |
| Melian | Maia | No | Same as above | First Age; queen of Doriath — only relevant if First Age scope is adopted |
| Balrogs (incl. "Durin's Bane") | Maiar (corrupted) | No | Possibly, low priority | Antagonist-only, minimal "character" data available |

---

## 7. Peoples / Races

**Terminology** (INFERENCE from the candidate research above): Tolkien's own usage is inconsistent across texts — "race," "kindred," "people," and "folk" are used loosely and interchangeably in different books/appendices. There isn't a single canonical taxonomic term. Not established by the reviewed sources that any one term is "more correct" than the others.

Is `race` conceptually correct as currently used? INFERENCE: it works adequately for the current 19 records because they're drawn from clean categories (Hobbit, Elf, Human, Dwarf, Maia). It starts to strain immediately once entities like Ents, giant spiders, dragons, skin-changers, or corrupted-Men-turned-wraiths are added (§4), because those aren't peer categories with Hobbit/Elf/Human/Dwarf in the way a real taxonomy would organize them.

### Model A — `race` as a string on Character (status quo)
- Pros: zero schema change, already works, no new resource/relations.
- Cons: no structured querying ("give me all Elves"), no place to attach People-level facts (population, homeland region, general characteristics), typos/inconsistent capitalization risk grows with dataset size (already a risk the validator's duplicate-name check doesn't cover for `race` values).

### Model B — People as an independent resource, `Character → People`
- `GET /api/peoples` with entries like Hobbit, Elf, Human, Dwarf, Ent, Maia(?) — each with its own fields (origin, notable traits, homeland).
- Pros: structured, extensible, avoids string-typos, lets People carry their own facts.
- Cons: added complexity for a fairly small, fairly stable category set; Maiar sitting inside "Peoples" is conceptually awkward (see §5 — Maiar aren't a biological people, they're a spiritual order) — Model B would need an explicit decision on whether Maiar belong in `peoples` at all or whether that's exclusively the Ainur resource's job.

### Model C — Both: `race` string kept for simple filtering, plus a `People` resource for structured detail
- Pros: backward compatible (existing consumers filtering by `?race=Elf` keep working), while still enabling a richer resource for those who want it.
- Cons: two sources of truth for the same concept unless one is explicitly derived from the other (e.g., `race` string generated from the linked `People.name`) — needs a clear ownership rule to avoid drift.

RECOMMENDATION: Model C, with `race` treated as *derived/display* data and `People` (if built) as the source of truth, is the safest incremental path — it doesn't break existing consumers and defers the harder Ainur-overlap question to §5/§6 rather than conflating it here.

---

## 8. Places

Research scope note: no dedicated fetch of a Places-specific source was performed in this pass beyond what Tolkien Gateway search results implied is available (regions/settlements articles exist on TG). Not established by the reviewed sources: a ready-made, clearly-licensed structured dataset of Places.

Candidate categories (INFERENCE from what's already implicitly referenced via the `realm` field on 19 existing characters): The Shire, Gondor, Rohan, Mordor, Rivendell (Imladris), Lothlórien, Erebor, Isengard, Woodland Realm (Mirkwood) — these 8 already appear as free-text `realm` values in the current dataset.

- Reasonable V1-if-adopted size: RECOMMENDATION — start with the realms already referenced by existing `Character.realm` values (8) plus a small number of other movie-referenced locations (e.g., Minas Tirith, Helm's Deep, Bree, Moria/Khazad-dûm) — roughly 12–15 places, not dozens, to keep quality high.
- Candidate fields: `id, name, type ('region'|'city'|'fortress'|'realm'), description-free facts (foundedEra, ruler/rulingPeople), approximateRegion`.
- Relations: `Character → Place` is straightforward to add as a numeric `realmId` (replacing/supplementing the current free-text `realm` string, same pattern as the People discussion in §7). `Place → Characters` (reverse listing) is a derived query, not new data — same pattern as how Quote already resolves to nested Character/Movie summaries.

---

## 9. Map

- The Tolkien Estate FAQ (SOURCE CLAIM, §1) explicitly states original maps are copyright-protected and "may not be copied," with image permissions specifically routed through the Bodleian Library. This means: **do not reuse any published Middle-earth map image or its underlying cartographic linework.**
- What LORT could do instead (RECOMMENDATION, not implemented): build an **original, independently-authored schematic representation** using LORT's own `Place` records — i.e., approximate relative-position coordinates (not traced from any published map) placed on a simple custom SVG or a small hand-authored GeoJSON-like coordinate set, styled as clearly non-photorealistic/non-decorative (a schematic node graph, not a "map" in the cartographic-art sense).
- Format evaluation:
  - **SVG (self-authored)**: good fit if the goal is a simple visual; risk is inadvertently mimicking Tolkien's or a film's map layout too closely — would need to be deliberately abstracted (e.g., relative position only, not tracing coastlines).
  - **GeoJSON with invented coordinates**: better fit if the goal is a queryable "position" field per Place (e.g., simple x/y or lat/lng-style relative units) rather than a rendered image — keeps LORT strictly in the business of structured data, not cartographic art, which is the safer posture given the Estate's stance on maps/images specifically.
  - **Fully schematic node/graph (no coordinates at all, just adjacency: "Rivendell is east of the Shire")**: lowest risk, lowest fidelity — avoids any coordinate-guessing entirely.
- RECOMMENDATION: if Places is adopted at all, favor coordinate-free or clearly-approximate self-authored relative positioning over anything resembling a rendered "map," and treat this as a v-later decision, not V1.

---

## 10. Books

| Title | Year | Author | Relevance | Source | Notes |
|---|---|---|---|---|---|
| The Hobbit | 1937 | J.R.R. Tolkien | Already in dataset | — | Existing, id 1 |
| The Fellowship of the Ring | 1954 | J.R.R. Tolkien | Already in dataset | — | Existing, id 2 |
| The Two Towers | 1954 | J.R.R. Tolkien | Already in dataset | — | Existing, id 3 |
| The Return of the King | 1955 | J.R.R. Tolkien | Already in dataset | — | Existing, id 4 |
| The Silmarillion | 1977 | J.R.R. Tolkien (posthumous, ed. Christopher Tolkien) | Candidate | Tolkien Gateway / publisher records | Already in dataset as id 5 — note: posthumous/edited authorship is a nuance the current `author: "J.R.R. Tolkien"` string doesn't capture |
| Unfinished Tales | 1980 | J.R.R. Tolkien (posthumous, ed. Christopher Tolkien) | Candidate for expansion | Tolkien Gateway | Same posthumous-authorship nuance as Silmarillion |
| The Children of Húrin | 2007 | J.R.R. Tolkien (posthumous, ed. Christopher Tolkien) | Candidate, only if First Age scope adopted | Tolkien Gateway | Ties to §3 First Age character candidates |
| The Fall of Gondolin / Beren and Lúthien | 2018 / 2017 | J.R.R. Tolkien (posthumous, ed. Christopher Tolkien) | Candidate, only if First Age scope adopted | Tolkien Gateway | Same as above |

RECOMMENDATION: the 5 books already in the dataset (Hobbit + LOTR trilogy + Silmarillion) form a coherent, well-sourced V1 set. Expanding to Unfinished Tales / Children of Húrin / Beren and Lúthien / Fall of Gondolin is reasonable *only* if the Characters scope is also deliberately expanded into the First Age (§3) — otherwise those books wouldn't connect to any Quote/Character data LORT actually has.

---

## 11. Movies

- FACT (verified by reading `movies.json`): the 6 existing movie records already have populated `releaseYear`, `runtimeInMinutes`, `budgetInMillions`, `boxOfficeRevenueInMillions`, `academyAwardNominations`, `academyAwardWins`, `rottenTomatoesScore` — none are null.
- Not established by the reviewed sources in this pass: a specific citation confirming `budgetInMillions`/`boxOfficeRevenueInMillions` are denominated in **USD millions**. This task explicitly forbids assuming units — flagging as **UNCONFIRMED**. RECOMMENDATION: verify against a specific, citable source (e.g., a specific Box Office Mojo or The Numbers page per film, plus explicit currency confirmation) before documenting the unit as a fact anywhere public-facing (Swagger, docs). Do not silently assume USD even though it's the most likely candidate.
- Reliable-field assessment (INFERENCE, general knowledge of the film-data domain, not tied to a specific fetched citation in this pass): `releaseYear` and `runtimeInMinutes` are the most reliably sourceable/verifiable fields (unambiguous, single accepted value per official theatrical cut). `academyAwardNominations`/`academyAwardWins` are reliably sourceable from the Academy's own records. `rottenTomatoesScore` and box-office/budget figures are the fields most likely to vary by source, by "which cut" (theatrical vs. extended edition), and by inflation-adjustment convention — these need the most explicit sourcing/dating if formalized.
- RECOMMENDATION: for any future update to these numeric fields, record the source and access date (see §15 provenance) precisely because these are the fields most likely to be challenged or to drift between sources.

---

## 12. Quotes

Given the Tolkien Estate's stated position (§1: quoting *published* text requires HarperCollins permission, with a 16–20 week process) and that LORT is not currently pursuing that licensing process:

### Option A — Full quote text (status quo)
- The 8 existing quotes in `quotes.json` are verbatim film/book dialogue.
- Risk: HIGH. This is exactly the category HarperCollins permissions exist for, and the current dataset is already doing this without a documented license. RECOMMENDATION flags this as **REQUIRES LEGAL REVIEW** for the *existing* 8 quotes, separate from any decision about future expansion.

### Option B — Short excerpts (fragments below a length threshold)
- Reduces exposure somewhat but does not eliminate it — short quotations can still infringe, and "how short is safe" is not a bright line established by any source reviewed here. Still **REQUIRES LEGAL REVIEW** if pursued at any meaningful scale (30–50 quotes).

### Option C — Metadata without quote text
- Store `id, movieId, characterId, sceneOrTimestampReference` (or a book chapter/page reference) but not the dialogue text itself; API consumers would need to independently source the line.
- Lowest legal risk of the four options; loses the "quotable API" value proposition that's presumably the point of a Quotes resource.

### Option D — Third-party licensed quote dataset
- Not established by the reviewed sources whether any such licensed, redistributable Tolkien-quote dataset exists. Would require its own dedicated licensing review before being treated as viable — not assumed available here.

RECOMMENDATION: Option C is the only option that avoids **REQUIRES LEGAL REVIEW** status outright. If LORT wants to keep Option A (verbatim text) at any scale beyond a token illustrative handful, that should be an explicit, informed risk decision by the project owner — not a default continuation of current behavior. This document does not recommend removing the existing 8 quotes (no changes were made), but flags them for review.

---

## 13. Comparison with The One API

Based on third-party descriptions and public client libraries (own `the-one-api.dev` license page not successfully confirmed in this pass — see §1):

- SOURCE CLAIM: The One API exposes `book`, `movie`, `character`, and `quote` entities, roughly analogous to LORT's current four resources.
- Useful fields/relationships worth considering (RECOMMENDATION, not a copy — these are *shape* ideas, not data): a `chapter` sub-resource under `book` (not currently in LORT's scope); quote-to-movie and quote-to-character relations (LORT already does this, arguably more cleanly via the resolved-object response shape already implemented).
- Things LORT should NOT copy: any verbatim field values, ids, or text from The One API's dataset — its own provenance/licensing is unconfirmed (§1), so copying it would import an unverified-rights problem rather than solve one.
- Missing concepts in LORT vs. what a "reference API" typically has: no `chapter`-level book structure, no Ainur/Places/Peoples (this whole document's subject).
- Potential improvement: LORT's quote response already nests resolved `character`/`movie` summaries (confirmed via `quote.entity.ts`/`quote-with-relations.entity.ts`) — this is arguably a cleaner API design than exposing raw foreign keys, and should be considered a LORT strength to preserve, not a gap.

---

## 14. Dataset licensing strategy (general, non-legal-advice)

| Category | Can LORT include it without a license, based on reviewed sources? | Notes |
|---|---|---|
| Facts (e.g., "Aragorn is a Human", "released 2001") | INFERENCE: generally yes — facts themselves are not copyrightable, only specific expressions of them | Still must be independently verified/phrased in LORT's own words, not copy-pasted from a specific source's prose |
| Structured data (ids, relations, numeric fields) | INFERENCE: generally yes, same reasoning as Facts | This is most of LORT's current schema |
| Copyrighted text (verbatim book/film dialogue) | **REQUIRES LEGAL REVIEW** | Per §1/§12 — HarperCollins is the stated channel |
| Images | **REQUIRES LEGAL REVIEW** | Per §1 — Estate explicitly restricts; Bodleian Library holds much of the permission authority |
| Maps | **REQUIRES LEGAL REVIEW** — do not reuse existing maps | Per §1/§9 — explicitly called out as protected |
| Third-party datasets (e.g., The One API) | **REQUIRES LEGAL REVIEW** if considering reuse | Per §1/§13 — own license unconfirmed |
| Software code (LORT's own API/validator/frontend) | FACT: LORT's own code is unaffected by any of the above — this whole licensing question is about the *dataset content*, not the codebase | No concern here |

---

## 15. Provenance (proposed structure, not implemented)

RECOMMENDATION — conceptual layout only, nothing created:

```
provenance/
  characters.sources.json
  movies.sources.json
  books.sources.json
  ainur.sources.json       (only if §5/§6 resource is adopted)
  places.sources.json      (only if §8 resource is adopted)
```

Suggested per-record metadata shape (conceptual, not implemented):
```
{
  "recordId": 2,
  "resource": "characters",
  "source": "Tolkien Gateway",
  "sourceUrl": "https://tolkiengateway.net/wiki/Gandalf",
  "accessedAt": "2026-08-28",
  "confidence": "high",
  "notes": "Cross-checked against published Appendices dates."
}
```

This would live outside the public API response (an internal/maintenance file, not a new endpoint), consistent with §16's instruction that provenance is not to be added to the public schema yet.

---

## 16. Dataset size recommendations

| Resource | Current | Recommended future size | Rationale |
|---|---|---|---|
| Characters | 19 | 50–75 (as requested), but RECOMMENDATION: bias toward the lower end (50–60) unless First Age scope is explicitly adopted, to keep quality/verifiability high per §3 |
| Movies | 6 | 6 (no change) | The 6 official Jackson-trilogy films are a closed, well-defined set; no natural candidates to add without redefining scope (e.g., unofficial/animated adaptations) |
| Books | 5 | 5, optionally +3 if First Age scope adopted (§10) | Matches Character scope decision |
| Quotes | 8 | 30–50 (as requested) — but gated entirely on resolving §12's licensing question first | Do not scale up Option A content without review |
| Ainur | 0 | 0–10 if Model B adopted informally via existing Character race field (already partially true: Gandalf/Sauron/Saruman); up to ~15 if Model A (independent resource) adopted | Small, high-confidence set; don't over-scope |
| Places | 0 | 0–15 if adopted (§8) | Start from realms already referenced by existing Character.realm values |
| Peoples | 0 | 0, or ~6–8 if Model B/C adopted (§7) | One record per race category already in use, not more |

---

## 17. Future API resources

| Resource | Value | Complexity | Data availability | Licensing risk | Recommended status |
|---|---|---|---|---|---|
| `/api/characters` | High (core) | Low (already implemented) | High | Low (facts) | **V1** (already live) |
| `/api/movies` | High (core) | Low (already implemented) | High | Low, except unit-confirmation for budget/box office (§11) | **V1** (already live) |
| `/api/books` | Medium-High (core) | Low (already implemented) | High | Low | **V1** (already live) |
| `/api/quotes` | Medium (core, but risky) | Low (already implemented) | High for text, but licensing gated | **REQUIRES LEGAL REVIEW** before scaling | **V1** structurally, but flagged for legal review before quote-count growth |
| `/api/peoples` | Medium (improves queryability) | Low-Medium (new resource + Character relation) | High | Low | **V1.1** candidate |
| `/api/places` | Medium (enables Character↔Place) | Medium (new resource + relations) | Medium | Low (facts), high if any map/image included (§9) | **V1.1** candidate, structured-data only |
| `/api/ainur` | Low-Medium (niche, cosmology-focused) | Medium-High (identity-duplication problem, §5) | Medium | Low | **Future** — needs Model A/B decision first, not V1.1 |
| Map/geo rendering (any visual) | Low-Medium | High, plus real IP risk | Low (would require original authoring) | **REQUIRES LEGAL REVIEW** if it resembles published maps at all | **Do not implement** without a separate, dedicated risk review |

---

## 18. Recommended architecture (conceptual)

```
Character
├── People        (optional, Model B/C — race classification)
├── Ainur link    (optional, Model A — ainurId for Maiar/Valar overlap; Model B — inline classification)
├── Place         (optional — realmId replacing/supplementing free-text realm)
└── Quote         (existing — Quote.characterId → Character)

Movie
└── Quote         (existing — Quote.movieId → Movie)

Book
└── (no current relations; a First-Age Character/Book link is a future possibility, not modeled here)

Ainur (if built)
├── category: Vala | Maia
└── Character link (optional, back-reference for Ainur who are also Characters)

Place (if built)
└── Character (reverse of Character.realmId — derived listing, not new data)
```

Not every arrow above should necessarily be implemented — this is the conceptual map of what *could* relate to what, gated by the per-resource decisions in §5–§9 and §17.

---

## 19. Data quality strategy (proposals only, validator NOT modified)

If Ainur/Places/Peoples were added, the existing `validateDataset` (src/tools/dataset-validation/validate-dataset.ts) would need, conceptually:
- **Ainur**: id/name/category required-field checks (same pattern as existing resources); a new cross-resource check for `Character.ainurId` (if Model A) referencing a valid Ainur id, mirroring the existing Quote→Character/Movie orphan-reference check.
- **Places**: id/name/type required-field checks; a new cross-resource check for `Character.realmId` (if the free-text `realm` were replaced/supplemented) referencing a valid Place id.
- **Peoples**: id/name required-field checks; a new cross-resource check for `Character.peopleId` (if Model B/C) referencing a valid People id; potentially a rule flagging `race` (string) vs `People.name` mismatches if Model C's dual-representation is adopted, to catch drift between the derived string and the source-of-truth relation.
- **General**: the duplicate-name warning logic already implemented would extend naturally to any new resource with a `name` field, with no new design needed.

None of this was implemented; the current validator continues to operate only on the 4 existing resources.

---

## 20. Current dataset review

Read directly from the live JSON files (no modification):

- **Characters (19 records)**: `race`/`gender`/`name` fields are solid and consistent (FACT). `birth`/`death` use in-universe calendar notation consistently (`TA`, `FO`) — internally consistent, sourced-looking, but not independently re-verified against a primary citation in this pass. `height` is `null` for all 19 records — FACT, zero data currently, not "needs corroboration" so much as "not yet attempted." `wikiUrl` values all point to `lotr.fandom.com` (Fandom-hosted wiki, not Tolkien Gateway) — FACT, verified by reading the file. Note: Fandom wikis are a different site/license/reliability profile than Tolkien Gateway (tolkiengateway.net) discussed in §1 — this document's Tolkien Gateway license research does **not** automatically apply to lotr.fandom.com; that site's own terms were not researched in this pass and should be checked separately before treating those URLs as a redistribution-safe reference.
- **Movies (6 records)**: `releaseYear`/`runtimeInMinutes` look internally consistent with known theatrical facts (INFERENCE, general knowledge, not re-verified against a specific cited source this pass). `budgetInMillions`/`boxOfficeRevenueInMillions` — **flagged in §11**: unit (USD millions) is plausible but UNCONFIRMED by any source reviewed in this pass; RECOMMENDATION to source and document explicitly before treating as authoritative in public docs. `rottenTomatoesScore` values are plausible-looking integers but no specific citation/date was checked in this pass — flag as needing a source+access-date if this dataset is to be defended publicly.
- **Books (5)**: solid — publication years for Tolkien's own bibliography are well-established, low risk.
- **Quotes (8)**: HIGHEST RISK item in the current dataset per §12 — verbatim text with no documented license. Flagged for legal review; not modified.

---

## 21. Recommended LORT scope

RECOMMENDATION (not a decision):

**V1 (current + safe expansion):**
- Characters — expand toward 50–75, biased toward Third Age/LOTR-movie-era to keep sourcing quality high (§3, §16).
- Movies — remain at 6 (closed set); resolve the budget/box-office unit-confirmation gap (§11) before further public documentation claims.
- Books — remain at 5, or +3 only if First Age character scope is explicitly adopted.
- Quotes — do **not** scale to 30–50 verbatim quotes without resolving the licensing question in §12 first; Option C (metadata without text) is the lowest-risk path to reach that count if reaching it matters more than preserving verbatim text.

**Do not include as full API resources in V1:**
- **Ainur** — hold for V1.1/Future, gated on resolving the Model A vs. B identity-duplication question (§5) explicitly, not implicitly.
- **Places** — reasonable V1.1 candidate (structured facts only, no map/image); not V1.
- **Peoples** — reasonable V1.1 candidate (Model C); not V1.

**Explicitly out of scope regardless of version:**
- Any reproduction of published maps or images (§9, §14) — REQUIRES LEGAL REVIEW, and this document recommends simply not pursuing it rather than seeking that review, given the Estate's stated posture.

---

## 22. Decision matrix

| Resource | Data availability | Reliability | Licensing risk | Complexity | Value | Recommendation |
|---|---:|---:|---:|---:|---:|---|
| Characters | High | High | Low | Low (existing) | High | Expand — V1 |
| Movies | High | Medium-High (unit gap on 2 fields) | Low | Low (existing) | High | Keep, fix unit documentation — V1 |
| Books | High | High | Low | Low (existing) | Medium-High | Keep as-is / minor expansion — V1 |
| Quotes | High (text availability) / Medium (licensing clarity) | Medium | **High** | Low (existing) | Medium | Gate scale-up on legal review — V1 structurally, growth blocked |
| Ainur | Medium | Medium-High | Low | Medium-High (identity model) | Low-Medium | **Future**, needs Model decision first |
| Places | Medium | Medium | Low (facts) / High (if map/image) | Medium | Medium | **V1.1**, structured data only |
| Peoples | High | Medium-High | Low | Low-Medium | Medium | **V1.1** |

---

## 23. Sources bibliography

- [Frequently Asked Questions and Links — The Tolkien Estate](https://www.tolkienestate.com/frequently-asked-questions-and-links/) — Purpose: official rights-holder policy on copyright, quotations, images, maps, languages, permissions. License/rights info: this IS the rights-holder statement. Accessed: 2026-08-28.
- [Legal Notices — The Official Tolkien Online Bookshop](https://www.tolkien.co.uk/legal-notices/) — Purpose: secondary confirmation of Estate-affiliated legal posture. Accessed: 2026-08-28 (search-result summary only, not independently fetched in full).
- [What is Permissions Department – HarperCollins Publishers UK](https://harpercollins.co.uk/blogs/glossary/what-is-permissions-department) — Purpose: process/turnaround-time info for quoting published Tolkien text. Accessed: 2026-08-28.
- [Permissions - HarperCollins Focus](https://www.harpercollinsfocus.com/permissions/) — Purpose: general HarperCollins permissions process reference. Accessed: 2026-08-28 (search-result summary only).
- [Tolkien Gateway:Copyrights](https://tolkiengateway.net/wiki/Tolkien_Gateway:Copyrights) — Purpose: TG's own content license (CC BY-SA 4.0) and image-handling policy. Accessed: 2026-08-28.
- [Tolkien Gateway:Fair use](https://tolkiengateway.net/wiki/Tolkien_Gateway:Fair_use) — Purpose: TG's fair-use rationale for hosted images. Accessed: 2026-08-28 (search-result summary only, not independently fetched).
- [The Tolkien Society — official site](https://www.tolkiensociety.org/) — Purpose: secondary/community reference, mission statement. Accessed: 2026-08-28.
- [The Tolkien Society is an educational charity...](https://www.tolkiensociety.org/society/) — Purpose: mission statement confirmation. Accessed: 2026-08-28.
- [The Lord of the Rings API - The One API](https://the-one-api.dev/) — Purpose: comparison API landing page. License info: **not established by the reviewed sources** — flagged for follow-up. Accessed: 2026-08-28.
- [The Lord of the Rings API - The One API | Documentation](https://the-one-api.dev/documentation) — Purpose: attempted fetch for entity/field/license detail; fetch returned insufficient content in this pass. Accessed: 2026-08-28 (incomplete).
- [GitHub - gitfrosh/lotr-api](https://github.com/gitfrosh/lotr-api) — Purpose: third-party description of The One API's entity coverage (book/character/movie/quote). Accessed: 2026-08-28 (search-result summary only, not independently fetched).
- Existing local files (not external sources, cited for grounding): `lort-api/data/characters.json`, `lort-api/data/movies.json`, `lort-api/data/books.json`, `lort-api/data/quotes.json`, `lort-api/src/modules/*/domain/*.entity.ts` — read-only, on 2026-08-28, to ground §3/§4/§11/§20 in the actual current dataset.

Note on scope of this bibliography: several results returned by search were listed by the search tool but not independently deep-fetched in this pass (marked "search-result summary only" above); treat those as lower-confidence than the ones explicitly fetched (Tolkien Estate FAQ, Tolkien Gateway Copyrights via search synthesis).
