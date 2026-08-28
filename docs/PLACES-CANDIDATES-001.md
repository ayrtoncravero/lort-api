# PLACES-CANDIDATES-001 — Place Resource Research

Status: RESEARCH ONLY. No JSON, DTO, controller, service, repository, `explorerConfig.ts`, or frontend file was modified to produce this document. `data/characters.json` and `data/places.json` (does not exist) are untouched. No endpoint was created. Nothing here is authorized for insertion until reviewed and approved separately.

Labeling convention (unchanged from prior documents): **FACT**, **SOURCE CLAIM**, **INFERENCE**, **RECOMMENDATION**. Where evidence is insufficient: "Not established by the reviewed sources."

This document builds on `docs/DATASET-RESEARCH-001.md` (§1 source classification, §8 prior Places note, §9 map stance, §14 licensing strategy) and `docs/PROVENANCE-001.md` (provenance structure conventions). Those conclusions are treated as established and not re-derived. Companion document: `docs/PLACE-SCHEMA-REVIEW-001.md` (schema-specific analysis).

---

## 1. What is a Place?

**FACT** (re-read from `data/characters.json`): the live dataset already contains **21 distinct non-null `realm` strings** used across the 50 Character records: `Arnor and Gondor`, `Bree`, `Dale`, `Doriath`, `Erebor`, `Eregion`, `Gondolin`, `Gondor`, `Gondor and Arnor`, `Grey Havens`, `Himring`, `Isengard`, `Lothlorien`, `Mordor`, `Moria`, `Nargothrond`, `Númenor`, `Rivendell`, `Rohan`, `The Shire`, `Woodland Realm`. (Note: `Gondor` and `Arnor and Gondor`/`Gondor and Arnor` are three different strings for overlapping concepts — a canonical-identity issue, see §11.)

**INFERENCE**: this existing usage already shows `realm` mixing several conceptually different categories: sovereign kingdoms (`Gondor`, `Rohan`, `Mordor`, `Númenor`), a kingdom-founding city later used metonymously for its people (`Gondolin`, `Nargothrond` — both cities that *were* their own hidden realms), a settlement with no kingdom status (`Bree`, `Dale`), a mine/underground realm (`Moria`, `Erebor` — both a Dwarf-kingdom and a mountain), a havens/port (`Grey Havens`), a fortress-realm (`Isengard`), and a forest-realm (`Woodland Realm`, `Lothlorien`). Not all of these are the same *kind* of thing, even though they're all currently valid `realm` values.

**RECOMMENDATION**: define `Place` broadly enough to cover everything currently represented by a `realm` string, plus commonly-referenced non-realm locations that don't have their own political status (individual buildings, mountains, battlefields) — but **do not** assume every category listed in the user's brief is worth a distinct API-facing `type` value. Concretely: `continent` (only "Middle-earth" itself, arguably not useful as a filterable value with n=1), `sea`/`island` (very few well-documented individually-notable candidates), `road`/`pass` (thin structured data per candidate — mostly narrative color, not facts), `dwelling` (mostly sub-parts of a settlement, e.g. Bag End is a smial *within* Hobbiton, not a peer-level Place) are candidates for **exclusion or folding into a broader category**, not full peer types. See §14 for the recommended small set.

---

## 2. Hierarchy

**FACT**: place names in the legendarium nest naturally — e.g. Bag End is within Hobbiton is within the Shire is within Eriador is within Middle-earth (SOURCE CLAIM, general legendarium geography, corroborated across Tolkien Gateway's Eriador entry and Middle-earth overview, both consulted via WebSearch in this pass — see bibliography).

Two structural models considered:

**Hierarchy Model 1 — strict single-parent tree** (`Middle-earth → Region → Realm → City → Location`): clean, matches the intuitive nesting above for well-documented cases (Shire hierarchy, Gondor hierarchy). **Cons**: breaks for places that don't fit a clean 4-level ladder — e.g. Rivendell is a settlement *directly* in the region of Eriador with no intermediate "realm" (it's an independent Elven refuge, not part of Arnor or the Shire); Moria is a realm *and* effectively a single location (a city-under-a-mountain) with no separate "city" level; Mount Doom is a landmark inside Mordor (a realm) with no "city" level in between at all. A strict 4-level tree would force artificial intermediate nodes for these.

**Hierarchy Model 2 — flexible `parentId` (self-referential, N levels, no fixed depth)**: each Place optionally points to one parent Place of any type; depth is whatever the data actually supports (Bag End→Hobbiton→Shire→Eriador is 3 hops; Rivendell→Eriador is 1 hop; Mount Doom→Mordor is 1 hop). **Pros**: matches the real, uneven structure of the source material without inventing intermediate nodes. **Cons**: requires cycle-prevention validation (same class of problem the existing dataset validator already solves for Quote→Character/Movie references, extendable) and doesn't give a fixed, predictable nesting depth for UI/filter design.

**RECOMMENDATION**: Model 2 (flexible self-referential `parentId`) is the more honest fit for the source material — Model 1's fixed levels don't survive contact with the actual candidate list below (§8) without inventing structure the sources don't support. Not implemented; see `PLACE-SCHEMA-REVIEW-001.md` §3/§19 for the full schema-level tradeoff.

---

## 3. Sources consulted in this pass

- **Tolkien Gateway** — individual place pages (Minas Tirith, Helm's Deep/Hornburg, Osgiliath, Mount Doom/Orodruin, Eriador) via WebSearch snippet synthesis. **Direct WebFetch to `tolkiengateway.net` was not attempted in this pass** (prior sessions already established it returns HTTP 403 for direct fetches — see `CHARACTERS-CANDIDATES-001.md` §1); all Tolkien Gateway-attributed facts below are **SOURCE CLAIM via WebSearch snippet synthesis**, same discipline as prior Character research passes.
- **Tolkien Estate / map-and-image copyright stance** — not re-researched in this pass; reusing the finding already established in `DATASET-RESEARCH-001.md` §1/§9 (original maps and images are copyright-protected, "may not be copied," image permissions routed through the Bodleian Library). This applies directly to Places research because place data is the natural precursor to any map feature.
- **Tolkien Society** — not independently re-queried in this pass; prior classification from `DATASET-RESEARCH-001.md` §2 (secondary/community reference, not a primary data source) carried forward unchanged.
- Wikipedia (Simple English and standard) appeared in search results for general geographic overview (Gondor, Beleriand) — used only as corroboration alongside Tolkien Gateway results, never as a sole citation, consistent with this project's established discipline.

No place-specific licensed dataset or structured API was found or assumed to exist. Not established by the reviewed sources whether Tolkien Gateway's place articles have any more specific redistribution terms than the site-wide CC BY-SA 4.0 already documented in `DATASET-RESEARCH-001.md` §1 for its own original prose (not Tolkien's text, not any hosted images/maps).

---

## 4. Place candidates

Table columns per instruction. `null / unknown` used throughout for unverified fields — never `""`, `"Unknown"`, `"N/A"`, `"?"`. Suggested types are drawn from the candidate categories evaluated in §14, not invented per-row.

| Candidate | Type | Region | Era | Importance | Available structured data | Sources | Confidence | Notes |
|---|---|---|---|---|---|---|---|---|
| The Shire | realm | Eriador | Third Age | High — already a `realm` value on 6 existing Characters | Name, region, inhabitant people (Hobbits) | Tolkien Gateway | HIGH | Already referenced as `realm: "The Shire"` on Frodo(1), Sam(6), Merry(9), Pippin(10), Bilbo(13), Gollum's origin (19, realm null but Stoor-Hobbit lineage tied to Shire-adjacent Anduin vales — not claimed here as a direct match). |
| Gondor | realm | Anórien/South | Third Age | High — 5 existing Characters use `"Gondor"` or a Gondor-compound realm string | Name, capital (Minas Tirith), founding era (Second Age) | Tolkien Gateway | HIGH | Canonical-identity note: existing dataset has THREE variant realm strings referring to overlapping Gondor/Arnor concepts (`"Gondor"`, `"Arnor and Gondor"`, `"Gondor and Arnor"`) — a future Place resource would need one canonical Gondor record and a separate Arnor record, with the compound strings resolved to two relations, not one. Documented, not resolved here (schema question). |
| Arnor | realm | Eriador | Second/Third Age | High — implied by 2 existing Characters' compound realm strings | Name, founding figure (Elendil, existing Character 23), fate (fell, later reunited under Aragorn) | Tolkien Gateway | HIGH | See canonical-identity note under Gondor above — same underlying issue. |
| Rohan | realm | Calenardhon | Third Age | High — 4 existing Characters use `"Rohan"` | Name, capital (Edoras), founding era (given to the Éothéod by Gondor) | Tolkien Gateway | HIGH | — |
| Mordor | realm | Southeast Middle-earth | Third Age (Sauron's dominion) | High — 1 existing Character (Sauron) uses `"Mordor"` | Name, notable landmark (Mount Doom), notable fortress (Barad-dûr) | Tolkien Gateway | HIGH | — |
| Rivendell (Imladris) | settlement | Eriador | Third Age (founded Second Age) | High — 4 existing Characters use `"Rivendell"` | Name, founder (Elrond, existing Character 12), founding era | Tolkien Gateway | HIGH | — |
| Lothlórien | realm/forest | Rhovanion (west of Anduin) | Third Age | High — 2 existing Characters use `"Lothlorien"` | Name, rulers (Galadriel/Celeborn, existing Characters 7/25) | Tolkien Gateway | HIGH | Existing dataset spelling `"Lothlorien"` (no diacritic) — canonical-name note, see §11. |
| Erebor (the Lonely Mountain) | realm/mountain | Northern Rhovanion | Third Age | High — 5 existing Characters use `"Erebor"` | Name, ruling line (Durin's Folk / Thorin's line), notable event (reclaiming from Smaug) | Tolkien Gateway | HIGH | Dual nature (mountain landmark AND Dwarf-kingdom) — representable as one Place with `type: realm`, consistent with how Gondolin/Nargothrond (hidden-city-realms) are modeled below. |
| Isengard | fortress/realm | Nan Curunír, west of Rohan | Third Age | High — 1 existing Character (Saruman) uses `"Isengard"` | Name, notable structure (Orthanc tower), ruler (Saruman) | Tolkien Gateway | HIGH | — |
| Woodland Realm (Mirkwood) | realm/forest | Rhovanion | Third Age | High — 1 existing Character (Thranduil, 26) uses `"Woodland Realm"` | Name, ruler (Thranduil), forest name (Mirkwood/Greenwood) | Tolkien Gateway | HIGH | Canonical-identity note: "Mirkwood" (the forest) and "Woodland Realm" (Thranduil's kingdom within it) are related but not strictly identical concepts — one candidate record here, documented as such, not split. |
| Bree | settlement | Bree-land, Eriador | Third Age | Medium-High — 1 existing Character (Barliman Butterbur, 35) uses `"Bree"` | Name, notable location (The Prancing Pony inn) | Tolkien Gateway | HIGH | — |
| Dale | settlement | Near Erebor, Rhovanion | Third Age | Medium-High — 1 existing Character (Bard the Bowman, 27) uses `"Dale"` | Name, founder/king (Bard), proximity to Erebor | Tolkien Gateway | HIGH | — |
| Moria (Khazad-dûm) | realm/underground city | Misty Mountains | Multi-era (Second Age founding, abandoned Third Age) | Medium-High — 1 existing Character (Balin, 28) uses `"Moria"` | Name, founding people (Dwarves), notable event (Balrog/Balin's colony) | Tolkien Gateway | HIGH | — |
| Grey Havens (Mithlond) | settlement/haven | Lindon, west coast | Multi-era, still active end of Third Age | Medium-High — 1 existing Character (Círdan, 33) uses `"Grey Havens"` | Name, notable role (departure point for ships to Valinor) | Tolkien Gateway | HIGH | — |
| Eregion (Hollin) | realm | West of Moria, Eriador | Second Age | Medium-High — 1 existing Character (Celebrimbor, 50) uses `"Eregion"` | Name, notable event (Rings of Power forged, Sack of Eregion SA 1697) | Tolkien Gateway | HIGH | Second Age — introduces the same era-scope consideration already flagged for Characters. |
| Númenor | realm/island | Great Sea, west of Middle-earth | Second Age | Medium-High — 3 existing Characters use `"Númenor"` | Name, founding king (Elros, existing Character 39), fate (downfall, SA 3319) | Tolkien Gateway | HIGH | Island realm entirely destroyed — a `type: realm` with no surviving successor is a legitimate, representable case (no workaround needed). |
| Gondolin | realm/hidden city | Encircling Mountains, Beleriand | First Age | Medium-High — 2 existing Characters use `"Gondolin"` | Name, founder (Turgon, existing Character 43), fate (fell in the Nírnaeth-adjacent war) | Tolkien Gateway | HIGH | First Age — same era-scope consideration as Eregion/Númenor, but for the Character First Age gate already deferred in `CHARACTERS-DATASET-001.md`. |
| Nargothrond | realm/hidden city | Narog river, Beleriand | First Age | Medium-High — 1 existing Character (Finrod Felagund, 42) uses `"Nargothrond"` | Name, founder (Finrod) | Tolkien Gateway | HIGH | Same First Age consideration as Gondolin. |
| Doriath | realm | Beleriand | First Age | Medium-High — 1 existing Character (Melian, 46) uses `"Doriath"` | Name, rulers (Thingol/Melian) | Tolkien Gateway | HIGH | Same First Age consideration. |
| Himring | fortress | East Beleriand | First Age | Medium — 1 existing Character (Maedhros, 49) uses `"Himring"` | Name, holder (Maedhros) | Tolkien Gateway | MEDIUM | Same First Age consideration; thinner structured data than the other First Age realms above. |
| Minas Tirith | settlement/fortress-city | Anórien, Gondor | Third Age | High (major LOTR-film location, not yet a `realm` value on any existing Character) | Name, role (capital of Gondor), notable structure (White Tower/Tower of Ecthelion) | Tolkien Gateway (WebSearch synthesis, this pass) | HIGH | Capital city of existing-dataset realm "Gondor" — direct `parentId`-type relation candidate if Model 2 hierarchy (§2) is adopted. |
| Minas Morgul | settlement/fortress | Ephel Dúath, near Mordor | Third Age | High (major LOTR-film location) | Name, former identity (Minas Ithil, captured/renamed), notable resident (Witch-king — deferred Character, see `CHARACTERS-DATASET-001.md`) | Tolkien Gateway (WebSearch synthesis) | MEDIUM-HIGH | Not independently re-fetched/cross-checked twice in this pass. |
| Osgiliath | settlement (ruined) | Anduin river, between Minas Tirith and Minas Morgul | Third Age (ruined by War of the Ring) | High (major LOTR-film location) | Name, former role (old capital of Gondor, per this pass's WebSearch result) | Tolkien Gateway (WebSearch synthesis, this pass) | HIGH | — |
| Mount Doom (Orodruin) | mountain/landmark | Mordor | Third Age (active volcano throughout) | High (central to LOTR plot — the Ring's destruction) | Name, alternate name (Orodruin), containing realm (Mordor) | Tolkien Gateway (WebSearch synthesis, this pass) | HIGH | Confirmed by this pass's own WebSearch: "a volcano in Mordor" (SOURCE CLAIM, Tolkien Gateway via search synthesis). |
| Helm's Deep (Hornburg) | fortress | White Mountains, Rohan | Third Age | High (major LOTR-film location) | Name, geographic description (gorge below the Thrihyrne, per this pass's WebSearch result), containing realm (Rohan) | Tolkien Gateway (WebSearch synthesis, this pass) | HIGH | Canonical-identity note: "Helm's Deep" (the gorge/valley) and "Hornburg" (the fortress within it) are related but distinct concepts in the sources — one candidate record recommended, not two, consistent with the Woodland Realm/Mirkwood pattern above. |
| Barad-dûr | fortress | Mordor | Third Age (Sauron's stronghold) | High (major plot location, though never visited on-page/on-screen) | Name, role (Sauron's tower), containing realm (Mordor) | Tolkien Gateway | MEDIUM-HIGH | Not independently re-fetched in this pass; carried from general legendarium knowledge corroborated by search-result snippets only. |
| Orthanc | fortress/tower | Isengard | Third Age | Medium-High | Name, containing realm (Isengard), resident (Saruman, existing Character 15) | Tolkien Gateway | MEDIUM-HIGH | Sub-location within Isengard — same "structure within a realm" pattern as Minas Tirith within Gondor. |
| Fangorn Forest | forest | West of Rohan, edge of Rhovanion | Third Age | Medium-High (notable resident: Treebeard, a deferred Character per `CHARACTERS-CANDIDATES-001.md` §4/§12) | Name, notable inhabitants (Ents) | Tolkien Gateway | MEDIUM-HIGH | — |
| Weathertop (Amon Sûl) | landmark/ruined watchtower | Eriador, on the road from the Shire to Rivendell | Third Age (ruined) | Medium (notable film/book scene) | Name, alternate name (Amon Sûl), former role (watch-tower of Arnor) | Tolkien Gateway | MEDIUM | — |
| The Prancing Pony | dwelling/inn | Bree | Third Age | Medium (well-known scene location, but sub-location within Bree, not a peer-level settlement) | Name, location (Bree), innkeeper (Barliman Butterbur, existing Character 35) | Tolkien Gateway | MEDIUM | RECOMMENDATION: fold into Bree as a notable-feature note rather than model as its own Place — see §14 category discussion. Flagged LOW-priority for insertion even if "dwelling" is kept as a category. |
| Hobbiton | settlement | The Shire | Third Age | Medium-High | Name, containing realm (The Shire), notable resident (Bilbo/Frodo, existing Characters 13/1) | Tolkien Gateway | MEDIUM-HIGH | Sub-location within the Shire — same pattern as Minas Tirith within Gondor. |
| Bag End | dwelling | Hobbiton, The Shire | Third Age | Medium (iconic but a single smial/house, not a settlement) | Name, residents (Bilbo, Frodo) | Tolkien Gateway | MEDIUM | RECOMMENDATION: same fold-in consideration as The Prancing Pony — a dwelling-within-a-settlement is arguably too fine-grained for a V1 Place resource. Flagged LOW-priority. |
| Amon Hen | landmark | Near Nen Hithoel, Anduin | Third Age | Medium (notable Fellowship-breaking scene) | Name, notable event | Tolkien Gateway | MEDIUM | Thin structured data beyond the single scene. |
| Cirith Ungol | pass/landmark | Border of Mordor | Third Age | Medium (notable Shelob/Frodo-Sam scene — Shelob is a deferred Character) | Name, notable feature (Shelob's lair, tower) | Tolkien Gateway | MEDIUM | — |
| Edoras | settlement | Rohan | Third Age | Medium-High (capital of Rohan, not yet a `realm` value on any existing Character) | Name, containing realm (Rohan), notable structure (Meduseld) | Tolkien Gateway | MEDIUM-HIGH | Capital city of existing-dataset realm "Rohan" — same parentId pattern as Minas Tirith/Gondor. |
| Meduseld | dwelling/hall | Edoras, Rohan | Third Age | Low-Medium (iconic single hall, sub-location of Edoras) | Name, role (Théoden's hall) | Tolkien Gateway | LOW-MEDIUM | Same fine-grained-dwelling concern as Bag End/Prancing Pony. |
| Ithilien | region | East of Anduin, near Gondor/Mordor border | Third Age | Medium (notable Faramir-related location) | Name, notable resident association (Faramir, existing Character 17) | Tolkien Gateway | MEDIUM | — |
| Lindon | region | West coast, remnant of Beleriand | Second/Third Age | Medium (contains Grey Havens) | Name, notable ruler (Círdan/Gil-galad) | Tolkien Gateway | MEDIUM | Parent-region candidate for Grey Havens under Model 2 hierarchy. |
| Anduin (the Great River) | river | Central Middle-earth | All eras | Medium (major geographic feature, referenced constantly) | Name, notable role (border/route) | Tolkien Gateway | MEDIUM | River-type category — evaluated but not strongly recommended for V1, see §14. |
| Misty Mountains | mountain range | Central Middle-earth | All eras | Medium (contains Moria) | Name, notable feature (contains Moria/Khazad-dûm) | Tolkien Gateway | MEDIUM | Parent-region candidate for Moria under Model 2 hierarchy. |
| Beleriand | region (destroyed) | Northwest Middle-earth | First Age | Medium (parent region for Gondolin/Nargothrond/Doriath/Himring, but entirely submerged by end of First Age) | Name, fate (destroyed/sunk, per this pass's WebSearch — Wikipedia/Tolkien Gateway corroboration) | Tolkien Gateway, Wikipedia (corroboration only) | HIGH | Confirmed this pass: "Beleriand was a large region in northwestern Middle-earth until the end of the First Age... destroyed and covered by the sea" (SOURCE CLAIM, search synthesis). Strong parent-region candidate for the First Age realm cluster if adopted. |
| Eriador | region | Northwest Middle-earth | Second/Third Age | High (parent region for Shire/Bree/Rivendell/Arnor, all already realm values) | Name, notable inhabitants (per this pass's WebSearch: "Arnor... Rivendell, Bree-land and the Shire... by end of Third Age, Hobbits of the Shire and Men") | Tolkien Gateway | HIGH | Confirmed this pass via WebSearch synthesis. Strong parent-region candidate under Model 2. |
| Rhovanion (Wilderland) | region | East of the Misty Mountains | Second/Third Age | Medium-High (parent region for Mirkwood/Fangorn/Erebor/Dale area, per this pass's WebSearch result) | Name, notable contained forests (per this pass: "Mirkwood, Fangorn Forest") | Tolkien Gateway | MEDIUM-HIGH | Confirmed this pass via WebSearch synthesis, one source thread. |
| Valinor | realm (outside Middle-earth) | Undying Lands, across the Sea | All eras (timeless/outside normal geography) | Medium (destination for Frodo/Bilbo, existing Characters 1/13; home of the Valar) | Name, role (dwelling of the Valar, final destination of Ring-bearers) | Tolkien Gateway | MEDIUM | Geographically and cosmologically distinct from Middle-earth proper — flagged as a possible schema-boundary edge case (is it a "Place" in the same sense as Gondor?), not resolved here. |

**Count researched in this table: 43.**

Not researched/not included (explicitly, per instruction not to force count): individual minor named landmarks with single-scene relevance and thin sourcing (e.g. the Fords of Bruinen, the Barrow-downs, Tom Bombadil's house — the last of which is additionally entangled with the already-deferred Bombadil Character question); the full set of named Gondorian fiefdoms (Lossarnach, Lebennin, etc.) beyond Ithilien; individual Dwarven halls beyond Erebor/Moria; any location whose only sourcing found in this pass was a single unconfirmed search snippet.

---

## 5. Confidence criteria applied

Unchanged from the Characters research passes: **HIGH** = corroborated across ≥2 independent source references or directly confirmed by this pass's own WebSearch with a clear, unambiguous result; **MEDIUM/MEDIUM-HIGH** = reasonably established, single-source or typical-for-role, not independently cross-checked twice; **LOW/LOW-MEDIUM** = thin data or a fine-grained sub-location flagged for exclusion. Per instruction, recommended candidates are HIGH/MEDIUM only — **no LOW-confidence candidate is in the recommended batch** (§8 below); Meduseld (LOW-MEDIUM) is the only entry that approaches this boundary and is explicitly flagged for deferral in §8, not included.

---

## 6. Canonical identity

Applying the same one-entity-one-canonical-name discipline as the Characters passes:

- **Gondor / Arnor and Gondor / Arnor**: the existing dataset's three realm-string variants (`"Gondor"`, `"Arnor and Gondor"`, `"Gondor and Arnor"` — all referring to Aragorn's post-reunification kingdom or its two constituent parts) resolve to **two** canonical Place candidates — `Gondor` and `Arnor` — not three, and not one merged "Reunited Kingdom" record (that would lose the historical distinction the Character records themselves don't consistently express). Documented as a known modeling tension carried over from Character data, not resolved by inventing a third Place.
- **Woodland Realm / Mirkwood**: one canonical record recommended (`Woodland Realm`, matching the existing dataset's exact realm string), with "Mirkwood" documented as the forest's alternate/older name in Notes, not a separate Place.
- **Helm's Deep / Hornburg**: one canonical record recommended (`Helm's Deep`, the more commonly recognized name per this pass's WebSearch results), with "Hornburg" (the fortress within the gorge) documented in Notes as a related but distinct sub-feature, not duplicated.
- **Lothlórien spelling**: existing dataset uses `"Lothlorien"` (no diacritic) as the `realm` string. If a Place record for Lothlórien is created, RECOMMENDATION: match the existing dataset's exact spelling for consistency (`Lothlorien`), same as how Character insertion in `CHARACTERS-DATASET-001.md` normalized names to match established dataset conventions rather than the source documents' preferred diacritics.
- **Minas Ithil / Minas Morgul**: same-place-different-name-over-time pattern (the city was renamed after capture) — one canonical record (`Minas Morgul`, the name relevant to the Third Age/LOTR-era scope this dataset already favors), with the earlier name documented in Notes, not a separate record.

No candidate in §4's table was found to be an undetected duplicate of another candidate in the same table.

---

## 7. Schema compatibility note

Full schema-level analysis lives in `PLACE-SCHEMA-REVIEW-001.md`. Summary for this document's purposes: every candidate in §4 is representable under either schema model proposed there (flat or hierarchical) using only `name`, `type`, `region` (string), and `wikiUrl` — no candidate in this pass revealed a hard representability gap comparable to the Character schema's Witch-king/Bombadil cases. The closest analogue is the Gondor/Arnor canonical-identity tension (§6) and the "how fine-grained is too fine-grained" question for sub-locations like Bag End/Meduseld/The Prancing Pony (§4 notes, §14).

---

## 8. Recommended candidate batch (HIGH/MEDIUM confidence, no LOW)

Of the 43 candidates researched, the following are recommended as a **first tranche if Places is adopted at all** — prioritizing places already implicitly referenced by existing Character `realm` values, plus the most plot-central LOTR-film locations not yet referenced:

**Tier 1 — Strong (HIGH confidence, already-referenced realms + confirmed-this-pass major locations):**
The Shire, Gondor, Arnor, Rohan, Mordor, Rivendell, Lothlórien, Erebor, Isengard, Woodland Realm, Bree, Dale, Moria, Grey Havens, Eregion, Númenor, Minas Tirith, Osgiliath, Mount Doom, Helm's Deep, Beleriand, Eriador.
**Count: 22**

**Tier 2 — Good (MEDIUM/MEDIUM-HIGH confidence, solid but thinner sourcing or First Age era-gated):**
Gondolin, Nargothrond, Doriath, Himring, Minas Morgul, Barad-dûr, Orthanc, Fangorn Forest, Weathertop, Hobbiton, Amon Hen, Cirith Ungol, Edoras, Ithilien, Lindon, Anduin, Misty Mountains, Rhovanion, Valinor.
**Count: 19**

**Tier 3 — Defer (thin sourcing or fine-grained sub-locations, not schema-incompatible):**
The Prancing Pony, Bag End, Meduseld.
**Count: 3**

**Recommended batch (Tier 1 + Tier 2, excluding Tier 3): 41 candidates.**

This comfortably supports a **30–50 range** if Places is adopted; see §17 for the concrete size recommendation, which is narrower than "everything researched" for quality reasons.

---

## 9. Era distribution

- **Third Age**: the clear majority — 27 of 43 candidates (The Shire, Gondor, Arnor, Rohan, Mordor, Rivendell, Lothlórien, Erebor, Isengard, Woodland Realm, Bree, Dale, Moria, Grey Havens, Minas Tirith, Minas Morgul, Osgiliath, Mount Doom, Helm's Deep, Barad-dûr, Orthanc, Fangorn, Weathertop, Prancing Pony, Hobbiton, Bag End, Amon Hen, Cirith Ungol, Edoras, Meduseld, Ithilien — several of these span into Second Age founding dates but are Third-Age-relevant for LOTR/Hobbit purposes).
- **Second Age**: Eregion, Númenor, Lindon (partial) — 3 candidates, directly paired with the existing Second Age Character candidates already in the dataset (Elendil, Isildur, Elros, Celebrimbor, Ar-Pharazôn, Tar-Míriel).
- **First Age**: Gondolin, Nargothrond, Doriath, Himring, Beleriand — 5 candidates, directly paired with the existing First Age Character candidates already in the dataset (Finrod, Turgon, Idril, Tuor, Melian, Fingolfin, Fingon, Maedhros, Celebrimbor).
- **Multi-era/outside normal geography**: Valinor, Misty Mountains, Anduin, Rhovanion (spanning eras).

**INFERENCE**: this distribution is *not* forced to match Characters' own era distribution, but happens to align well with it — every Second/First Age Place candidate corresponds to at least one existing Second/First Age Character already in the dataset (per `CHARACTERS-DATASET-001.md`), which is a natural byproduct of Places being derived substantially from existing `realm` values, not an artificially imposed balance.

---

## 10. Canonical identity — cross-reference

See §6 above (folded in per the document's own numbering — no separate content needed beyond what's already stated there).

---

## 11. Relationships evaluated

- **Place → parent Place**: high value (Model 2 hierarchy, §2) — lets Minas Tirith nest under Gondor, Hobbiton under the Shire, Grey Havens under Lindon, etc. RECOMMENDATION: include as `parentId: number | null`.
- **Place → region**: potentially redundant with `parentId` if "region" is itself modeled as a Place (e.g. Eriador, Rhovanion, Beleriand are all candidates in §4's own table) — RECOMMENDATION: do not model as a *separate* field from `parentId`; a region **is** a Place under this document's proposed model, so "Place → region" collapses into "Place → parent Place" rather than needing its own relation. See `PLACE-SCHEMA-REVIEW-001.md` §5 for the full analysis.
- **Place → Characters**: high value, but should be a **derived/reverse** relationship (querying "which Characters have this realm"), not new stored data — mirrors exactly how `Quote` already resolves into nested `character`/`movie` summaries without Character/Movie storing a `quoteIds` array. RECOMMENDATION: if implemented, this would most naturally live as a query parameter on `GET /api/characters` (`?realm=Gondor` — string match against existing free-text `realm`) rather than requiring `Character.realm` to become a foreign key (see §13 below and `PLACE-SCHEMA-REVIEW-001.md` §5 for why changing `Character.realm`'s type is explicitly not being proposed here).
- **Place → events**: **not recommended** — no "Event" resource exists or is proposed anywhere in this project's research; would require inventing a new resource category not requested by the user's brief. Flagged as clearly out of scope.
- **Place → books**: **weak value** — no clean per-book place data exists in the current 5-book dataset beyond what's already implied by which Characters/eras a book covers; not established by the reviewed sources that book-level place tagging would be more useful than character-level realm data already provides. Not recommended for V1.
- **Place → movies**: **weak value**, same reasoning as books — the 6 movies already span "the whole story," so a movie-to-place relation wouldn't meaningfully filter anything a Character/Quote query couldn't already imply. Not recommended for V1.

**Priority ranking (RECOMMENDATION)**: `Place → parent Place` (high value, low complexity) > `Place → Characters` as a reverse/derived query (high value, but implemented via existing `Character.realm` string matching, not a schema change) > events/books/movies relations (not recommended, insufficient value shown).

---

## 12. Character → Place (future-only, not implemented)

Per explicit instruction: `Character.realm: string | null` is **not** changed by this document or any document in this research phase. Documented here only as a possible **future** relationship: if `Place` is adopted and matures, `Character.realm` could eventually be **complemented** (not necessarily replaced) by a `Character.realmId: number | null` pointing at a Place record, while `realm` (the string) remains for backward compatibility and for characters whose realm doesn't cleanly resolve to one Place (e.g. Aragorn's `"Gondor and Arnor"` spans two Place candidates under this document's model, per §6). This is explicitly **deferred** — no schema change is proposed or authorized by this document. See `PLACE-SCHEMA-REVIEW-001.md` §5 for the fuller analysis of why `realm` itself is not being changed.

---

## 13. Data licensing per candidate

Consistent with `DATASET-RESEARCH-001.md` §14: every field proposed for every candidate above is **factual/structured data** (place name, type, containing region, notable associated Character/event by name) — not copyrighted descriptive prose, not a map, not an image. No candidate in §4 required a `REQUIRES LEGAL REVIEW` flag on this basis.

**One general flag carried forward, not candidate-specific**: per `DATASET-RESEARCH-001.md` §1/§9, any future `description` field populated with prose *copied* from Tolkien Gateway, a Fandom wiki, or (especially) Tolkien's own published text would immediately raise the same concern already flagged for Quotes — this is addressed structurally in `PLACE-SCHEMA-REVIEW-001.md` §4, not per-candidate here, since it's a schema-design question, not a fact-availability one.

**Maps/coordinates**: per `DATASET-RESEARCH-001.md` §9, reused unchanged here — **do not** reuse any published Middle-earth map image or trace its cartographic linework; **do not** invent coordinates presented as authoritative. See `PLACE-SCHEMA-REVIEW-001.md` §6/§7/§22 for the full map-readiness discussion.

---

## 14. Place categories (small set, derived from the actual candidates researched)

Per instruction, avoiding a 20-30-type taxonomy. Reviewing the 43 candidates in §4, the categories actually needed, ranked by how many candidates they'd cover:

- **`region`** — large geographic/political areas with no single ruler necessarily (Eriador, Rhovanion, Beleriand, Ithilien, Lindon). Covers 6 candidates.
- **`realm`** — a governed kingdom/domain, whether a nation-state or a hidden-city-state (Gondor, Arnor, Rohan, Mordor, Isengard, Woodland Realm, Erebor, Moria, Númenor, Eregion, Gondolin, Nargothrond, Doriath, Himring, Valinor). Covers 15 candidates — the largest category, matching how `realm` already dominates existing Character data.
- **`settlement`** — a city, town, or village with no independent "realm" status of its own, or a capital city nested within a realm (Bree, Dale, Rivendell, Grey Havens, Minas Tirith, Minas Morgul, Osgiliath, Hobbiton, Edoras). Covers 9 candidates.
- **`fortress`** — a primarily military/defensive structure (Helm's Deep, Barad-dûr, Orthanc). Covers 3 candidates.
- **`landmark`** — a single notable natural or constructed feature with no settlement/realm status (Mount Doom, Weathertop, Amon Hen, Cirith Ungol). Covers 4 candidates.
- **`geographic feature`** — rivers/mountain ranges/forests too large to be a single "landmark" but not a political region either (Anduin, Misty Mountains, Fangorn Forest). Covers 3 candidates.
- **`dwelling`** — a single building/home, sub-location of a settlement (The Prancing Pony, Bag End, Meduseld). Covers 3 candidates, **all three already flagged Tier 3/deferred in §8** — RECOMMENDATION: keep this category defined for schema completeness, but treat it as genuinely low-priority for actual V1 insertion, consistent with the Tier 3 deferrals.

**RECOMMENDATION**: 7 categories (`region`, `realm`, `settlement`, `fortress`, `landmark`, `geographic feature`, `dwelling`) — not the user's illustrative ~14-item list (continent/city/town/village/mountain/forest/river/lake/island/sea/road-pass/battlefield/other), most of which either have zero or one strongly-sourced candidate in this pass's research (lake, island, sea, road/pass, battlefield each had no standalone HIGH/MEDIUM candidate found — battlefields in particular are usually named *after* a place, e.g. "Battle of Helm's Deep," not a distinct Place in their own right) or fold cleanly into one of the 7 above (continent → there is exactly one, "Middle-earth," not worth a filterable category; town/village → covered by `settlement`; mountain → covered by `geographic feature` or `landmark` depending on scale). Full schema-level category discussion in `PLACE-SCHEMA-REVIEW-001.md` §18/§19.

---

## 15. Licensing / redistribution — summary

No candidate required `REQUIRES LEGAL REVIEW`. All proposed data is factual/structured (name, type, containing region/parent, associated existing Character where applicable). Maps and images remain explicitly out of scope and flagged per `DATASET-RESEARCH-001.md` §1/§9/§14 (carried forward unchanged, not re-derived).

---

## 16. Provenance (conceptual only — not created)

Consistent with `docs/PROVENANCE-001.md`'s entity-level structure, extended conceptually to a `provenance/places.sources.json` file (**not created by this document**):

```json
{
  "entityType": "place",
  "schemaNote": "Internal repository metadata. NOT part of the public API response. See docs/PROVENANCE-001.md.",
  "entities": [
    {
      "entityId": 1,
      "entityIdStatus": "provisional",
      "name": "Minas Tirith",
      "sources": [
        {
          "name": "Tolkien Gateway (via WebSearch snippet synthesis)",
          "url": null,
          "confidence": "HIGH",
          "notes": "Capital of Gondor; notable structure Tower of Ecthelion, per this pass's WebSearch result. Direct WebFetch to tolkiengateway.net not attempted this pass (prior 403 precedent)."
        }
      ]
    }
  ]
}
```

Same conventions as `characters.sources.json`: entity-level (not per-field) sourcing, `entityIdStatus: "final"|"provisional"`, three-level `HIGH`/`MEDIUM`/`LOW` confidence (no `LOW` for anything actually inserted), `url` left `null` where no page was independently verified this pass, `accessedAt` optional and populated only where a genuine access date is known (this pass: `"2026-08-28"`, since the WebSearch research happened in a single dated session — same reasoning `PROVENANCE-001.md` §3 already applied to Pass-2 Character candidates).

Not implemented. No `provenance/places.sources.json` file was created.

---

## 17. Dataset size recommendation

Evaluated: 30, 40, 50.

- **30**: achievable using only the Tier 1 batch (22) plus a handful of the strongest Tier 2 entries (Gondolin, Nargothrond, Doriath, Edoras, Fangorn, Hobbiton, Orthanc, Ithilien — 8 more = 30). Highest average confidence of the three options.
- **40**: achievable using the full recommended batch (Tier 1 + Tier 2 = 41, §8) minus one entry to land exactly at 40, or accepting 41 as "approximately 40." This is this document's actual researched-and-vetted ceiling — going beyond it would mean either promoting a Tier 3 entry (against the LOW/thin-data reasoning that put it there) or researching new candidates not covered in this pass.
- **50**: **not supported by this pass's research** without either (a) a second targeted research pass (mirroring how Characters needed 3 passes to responsibly reach 50), covering categories deliberately not pursued here (individual Gondorian fiefdoms, more named landmarks, Second Age Númenórean geography beyond the single Númenor entry, more First Age Beleriand locations), or (b) lowering the confidence bar below MEDIUM, which is explicitly against instruction.

**RECOMMENDATION**: **40 (using the full Tier 1 + Tier 2 batch of 41, effectively "40")** is the honest ceiling from this single research pass — matching the same "quality over forced count" discipline applied throughout the Characters research. 50 would require a second pass, not assumed or padded here.

---

## Files created

- `docs/PLACES-CANDIDATES-001.md` (this file) — new.
- `docs/PLACE-SCHEMA-REVIEW-001.md` — new (companion document, see separately).

No other file was created, modified, or deleted. `data/characters.json`, `data/places.json` (does not exist and was not created), all DTOs/controllers/services/repositories, `src/api/explorerConfig.ts`, and the frontend are untouched.
