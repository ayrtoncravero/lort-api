# RACES-CANDIDATES-001 — Races/Peoples Resource Research

Status: RESEARCH ONLY. No code, JSON, DTO, controller, service, repository, `explorerConfig.ts`, Swagger, or frontend file was modified to produce this document. `data/characters.json` and `data/places.json` are untouched. Nothing here is authorized for implementation until reviewed and approved separately.

Labeling convention (unchanged from prior documents): **FACT**, **SOURCE CLAIM**, **INFERENCE**, **RECOMMENDATION**. Where evidence is insufficient: "Not established by the reviewed sources."

This document builds on `docs/DATASET-RESEARCH-001.md` §7 (Peoples/Races — Model A/B/C already proposed there, Model C recommended), `docs/CHARACTER-SCHEMA-REVIEW-001.md` §1 (existing `race: string` field already conflates biological/craft kind with metaphysical order), and `docs/PLACES-CANDIDATES-001.md`/`docs/PLACE-SCHEMA-REVIEW-001.md` (structural precedent for this exact document pair). Those conclusions are treated as established, not re-derived. Companion document: `docs/RACE-SCHEMA-REVIEW-001.md`.

---

## 1. What does "Race" mean here?

**FACT** (re-read from `data/characters.json`): the live 50-Character dataset uses exactly 5 `race` values: `Human` (17), `Elf` (16), `Hobbit` (6), `Dwarf` (6), `Maia` (5, all Ainur — Gandalf/2, Sauron/14, Saruman/15, Radagast/32, Melian/46).

**SOURCE CLAIM** (Tolkien Gateway "Free peoples" page, via WebSearch): Appendix F of *The Lord of the Rings* lists seven peoples: Elves, Men, Dwarves, Hobbits, Ents, Orcs, Trolls. "Free Peoples" is a narrower subset (those who never fell under Morgoth/Sauron — Elves, Dwarves, Ents, and the Men of the West) — not identical to "all races," a distinction worth preserving rather than collapsing.

**INFERENCE**, extending `CHARACTER-SCHEMA-REVIEW-001.md` §1's finding: the candidates below are not conceptually uniform even within "biological kind":
- **Biological/genetic kinds** in the classic sense: Men, Elves, Dwarves, Hobbits, Orcs — each reproduces, has lineage, has sub-groups (see §2).
- **A grown/awakened-but-not-born kind**: Ents (SOURCE CLAIM: "shepherds of the trees," awakened by Yavanna, not born in the human sense) — biologically distinct enough that lumping it with Men/Elves/Dwarves/Hobbits under one flat list is defensible but not perfectly clean.
- **Non-humanoid animal-adjacent kinds**: Great Eagles, Dragons, Great Spiders (Shelob's kind) — these already surfaced as **schema gaps (soft)** for Character in `CHARACTERS-CANDIDATES-001.md` §4 (Smaug, Shelob) precisely because they don't fit the Character schema's `gender`/`spouse`/`hair` fields; the same tension applies to a Races resource's assumptions about what fields all "races" share.
- **A metaphysical order, not a biological race at all**: Maiar/Valar (Ainur). `CHARACTER-SCHEMA-REVIEW-001.md` §1/§3 already flagged that `race: "Maia"` is doing a different job than `race: "Elf"`. **RECOMMENDATION, reaffirmed here**: a Races resource should **not** include Ainur as a race-of-Character in the same list as Elf/Dwarf/Human/Hobbit — Ainur remain the separate concern addressed in `docs/GODS-CANDIDATES-001.md`. Including "Maia" as a row in a `/api/races` table would misrepresent it as a peer category to "Elf," which `DATASET-RESEARCH-001.md` §7 and `CHARACTER-SCHEMA-REVIEW-001.md` §1 both already identified as a conflation, not a fact.

**RECOMMENDATION**: scope this resource to the biological/craft "peoples" sense — Men, Elves, Dwarves, Hobbits, Ents, Orcs, Trolls, plus their well-documented sub-groups — and explicitly exclude Ainur/Maiar/Valar (covered separately) and animal-adjacent one-off kinds (Eagles, Dragons, Great Spiders — each effectively a species of one notable individual in the current dataset, not a "people" with sub-groups or population).

---

## 2. API naming

**Option A — `/api/races`**: matches the existing `Character.race` field name exactly (zero terminology mismatch for developers reading both resources side by side); matches Appendix F's own "races" framing in some editions; is the term the user has used throughout this entire project's prior documents (`race: string`, "Race analysis," etc.).

**Option B — `/api/peoples`**: **SOURCE CLAIM** — Tolkien's own preferred terms in his later writing lean toward "peoples" or "kindreds" rather than "races" for Elves/Men/Dwarves specifically (a documented authorial preference, not universally applied though — "race" appears throughout published LOTR text too, e.g. "the race of Hobbits"). `DATASET-RESEARCH-001.md` §7 already used "Peoples" as the working section title. Pro: arguably more accurate to Tolkien's later terminology for some groups. Con: introduces a **new** term (`peoples`) not used anywhere else in this API's existing schema (`Character.race`), which is a real naming-consistency cost — a developer would need to learn that `/api/peoples` returns rows named by what `Character.race` calls a "race," not a "people" in the exact same denotational sense the endpoint name implies.

**Option C — other**: not identified; no third term (e.g. `/api/kindreds`, `/api/species`) is both accurate and lower-friction than A or B.

**RECOMMENDATION**: **Option A, `/api/races`** — for API consistency, not for Tolkien-purist accuracy: the existing public field is `Character.race`, and a resource named `/api/races` reads as its natural catalog counterpart with zero translation cost for API consumers (`GET /api/characters?race=Elf` next to `GET /api/races` — same word, same concept, immediately legible). The frontend UI label can still say "Peoples" or "Races & Peoples" if that reads better for end users — the user explicitly allowed this UI-label/resource-name split, and it costs nothing at the API layer. This is a **naming recommendation only**, not an endpoint implementation.

---

## 3. Schema candidates

**Model A — minimal**:
```
{ id: number, name: string, wikiUrl: string | null }
```
Pros: trivially safe, no copyright surface, matches the "minimal schema principle" already applied to Place (`PLACE-SCHEMA-REVIEW-001.md` §4 rejected `description` for exactly this reason). Cons: arguably too thin to be useful — doesn't even record whether a "race" is itself a sub-group of a larger one (see §5 hierarchy question).

**Model B — structured**:
```
{ id: number, name: string, type: string, wikiUrl: string | null }
```
where `type` distinguishes broad categories the actual candidate research below surfaced — e.g. `major-race` (Men, Elves, Dwarves, Hobbits, Ents, Orcs, Trolls) vs `subgroup` (Noldor, Sindar, Rohirrim, Dúnedain, etc., see §5). This mirrors exactly how `Place.type` already distinguishes `region`/`realm`/`settlement`/etc. — same pattern, same discipline, not a new idea for this API.

A `description` field was considered and **rejected**, for the same reason `PLACE-SCHEMA-REVIEW-001.md` §4 rejected it for Place: any real description of "what Elves are" risks reproducing Tolkien's own prose or a wiki's paraphrase of it, and a one-line LORT-original summary is either so generic it adds no value ("A people of Middle-earth") or risks drifting into copyrighted characterization. **RECOMMENDATION**: omit `description` from V1, consistent with the Place precedent — this is now a repeated, deliberate pattern across this API's resources, not an oversight.

**RECOMMENDATION**: **Model B** (with `type`) — the `type` field costs nothing extra in complexity (it's a string, same validation cost as `Place.type`) and answers a real question the candidate table below needs to express (is "Rohirrim" a race, or a sub-group of "Men"?) without requiring a full `parentId` hierarchy (see §5).

---

## 4. Relationship with `Character.race`

`Character.race: string` is **not modified by this document** — this section documents impact only, per instruction.

**Option A — keep `Character.race` as a free-text string, Races as an independent, informative-only catalog**: zero migration, zero breaking change, zero frontend impact today. The catalog and the Character field are simply not formally linked — `Character.race` values (`Human`, `Elf`, `Hobbit`, `Dwarf`, `Maia`) would need to *happen* to match Race catalog `name` values for a developer to cross-reference them by string equality, but nothing in the schema guarantees that. This is exactly the "informative catalog" pattern `DATASET-RESEARCH-001.md` §7 already flagged as Model C-adjacent.

**Option B — change `Character.race` to `Character.raceId: number`**: **breaking change** — every existing consumer (including `lort-app`, per this project's own prior frontend-audit findings) reads `character.race` as a string today; replacing it outright would break every character card, filter, and detail view that currently displays or filters on `race`. Not recommended, and explicitly out of scope for this task regardless (Character schema is not to be touched).

**Option C — add `Character.raceId: number | null` alongside the existing `race: string`, additive**: non-breaking (existing consumers untouched), but doubles the source of truth for the same concept on every Character record going forward, and requires a migration pass across all 50 existing Characters to backfill `raceId` correctly (including judgment calls: does Gandalf get a `raceId` at all, given "Maia" is being deliberately excluded from the Races catalog per §1?). This is real, non-trivial migration work, not a free addition.

**Option D — Races as a purely informative, independent catalog (no `Character` field change of any kind, ever, not even future)**: same practical shape as Option A but stated as the *intended end state*, not a temporary stepping stone — i.e., don't plan a future `raceId` migration at all; let `Character.race` remain the display string it already is, and let `/api/races` be a separate reference table a developer can consult (e.g., "what other Elves exist," "what does 'Dúnedain' mean") without a formal foreign-key relationship.

**RECOMMENDATION**: **Option A/D combined** — ship Races as an independent, informative catalog now, explicitly **not** linked via a new Character field. This is the lowest-risk choice (zero Character schema change, zero migration, zero breaking-change classification needed) and matches this project's established minimal-schema discipline (`PLACE-SCHEMA-REVIEW-001.md` reached the same conclusion for `Place → Character`, recommending a derived/reverse query over a stored relation — §11 there). If a future task wants tighter linkage, Option C (additive `raceId`) is the only non-breaking path, but that is a **separate, future decision**, not implied or pre-committed by this document.

---

## 5. Hierarchy

**FACT/SOURCE CLAIM**: several of the strongest candidates below are documented sub-groups of a broader race, not peer-level races themselves — e.g. Rohirrim and Dúnedain are both "Men," Noldor/Sindar/Vanyar/Teleri are all "Elves," Longbeards (Durin's Folk) is a Dwarf clan, Harfoots/Stoors/Fallohides are Hobbit strains.

**Comparing to the `Place.parentId` precedent** (`PLACE-SCHEMA-REVIEW-001.md` §3/§19 adopted a flat record + self-referential `parentId`, justified by places nesting unevenly with no fixed depth): the Races case is structurally similar — Rohirrim nests under Men exactly one level deep, with no further sub-sub-groups needed at this dataset's scale, and Noldor/Sindar/Teleri/Vanyar under Elves is the same one-level pattern.

**RECOMMENDATION**: `parentId: number | null`, same self-referential pattern as `Place`, is **justified, not overengineering** — it directly answers a real, already-surfaced question (§4's own candidate table needs it) with a mechanism this API has already built, tested, and validated once for Place. A `type` field alone (`major-race` vs `subgroup`, per §3) is not sufficient on its own, because it can't express *which* major race a subgroup belongs to — that requires the relation. Depth in practice will be exactly 1 level (major race → subgroup) for every candidate identified in this pass; no candidate needs 2+ levels of nesting, so this is a much shallower tree than Place's occasional 2–3-hop chains, not a more complex one.

---

## 6. Sources consulted in this pass

- **Tolkien Gateway** — "Free peoples" page (WebSearch snippet synthesis; direct `WebFetch` to `tolkiengateway.net` not attempted this pass, per this project's established HTTP 403 precedent from `CHARACTERS-CANDIDATES-001.md` §1) — confirms the Appendix F seven-race list and the narrower "Free Peoples" subset.
- **Wikipedia** ("Middle-earth peoples," "Men in Middle-earth," "Elves in Middle-earth") — appeared in the same search results, used only as corroboration, never as sole citation, per this project's established discipline.
- **`DATASET-RESEARCH-001.md` §7** and **`CHARACTER-SCHEMA-REVIEW-001.md` §1** — reused directly for the conceptual race/kind/order analysis, not re-derived.
- No place-specific licensed dataset or structured races API was found or assumed to exist.

---

## 7. Candidate table

`null / unknown` used for unverified fields — never `""`, `"Unknown"`, `"N/A"`, `"?"`. Suggested `Parent` values reference other rows in this same table by name (no ids are assigned in a research document — ids remain a future insertion-time decision, per this project's established two-step candidate→dataset pattern).

| Candidate | Category | Parent | Era | Importance | Sources | Confidence | Schema fit | Notes |
|---|---|---|---|---|---|---|---|---|
| Men | major-race | — | All eras | High — 17 existing Characters use `race: "Human"` | Tolkien Gateway, existing dataset | HIGH | Full | Broadest race by existing Character count. |
| Elves | major-race | — | All eras | High — 16 existing Characters use `race: "Elf"` | Tolkien Gateway, existing dataset | HIGH | Full | Second-largest by existing Character count. |
| Dwarves | major-race | — | All eras | High — 6 existing Characters use `race: "Dwarf"` | Tolkien Gateway, existing dataset | HIGH | Full | — |
| Hobbits | major-race | — | Third Age (dominant visibility) | High — 6 existing Characters use `race: "Hobbit"` | Tolkien Gateway, existing dataset | HIGH | Full | — |
| Ents | major-race | — | All eras (awakened early) | Medium-High — notable existing-Character association (Treebeard is a deferred Character candidate, `CHARACTERS-CANDIDATES-001.md`) | Tolkien Gateway | HIGH | Full, with the "awakened not born" conceptual caveat (§1) | — |
| Orcs | major-race | — | All eras (corrupted origin, disputed in-universe) | Medium — plot-relevant as an antagonist race but no existing Character uses this race value | Tolkien Gateway | MEDIUM-HIGH | Full | Origin (corrupted Elves, per one legendarium account) is itself a **SOURCE CLAIM** with documented in-universe ambiguity — not resolved here, not required to be. |
| Trolls | major-race | — | All eras | Medium — Appendix F-listed but thin per-individual data in this pass | Tolkien Gateway | MEDIUM | Full | — |
| Dúnedain | subgroup | Men | Second/Third Age | High — directly relevant to existing Characters Aragorn(3)/Boromir(8)/Faramir(17)/Denethor II(21)/Elendil(23)/Isildur(24)/Anárion(38) | Tolkien Gateway | HIGH | Full | "Men of the West," descendants of Númenóreans — the strongest-sourced subgroup in this pass by existing-Character relevance. |
| Rohirrim | subgroup | Men | Third Age | High — directly relevant to Théoden(18)/Éowyn(16)/Éomer(22)/Gríma(34)/Edoras(existing Place 35) | Tolkien Gateway | HIGH | Full | — |
| Noldor | subgroup | Elves | First Age onward | High — relevant to Galadriel(7)/Finrod Felagund(42)/Fingolfin(47)/Fingon(48)/Maedhros(49)/Celebrimbor(50) | Tolkien Gateway | HIGH | Full | — |
| Sindar | subgroup | Elves | First Age onward | Medium-High — relevant to Celeborn(25)/Thranduil(26) | Tolkien Gateway | MEDIUM-HIGH | Full | — |
| Silvan Elves | subgroup | Elves | Third Age (Woodland Realm/Lothlórien) | Medium — relevant to existing Place records Woodland Realm(10)/Lothlorien(7) | Tolkien Gateway | MEDIUM | Full | — |
| Vanyar | subgroup | Elves | First Age (Valinor-based, rarely in Middle-earth) | Low-Medium — no existing Character or Place directly tied | Tolkien Gateway | MEDIUM | Full | Thinnest of the three Eldar branches for this dataset's purposes. |
| Teleri | subgroup | Elves | First Age onward | Low-Medium — indirectly relevant (Sindar/Silvan both trace to Teleri lineage per legendarium) | Tolkien Gateway | MEDIUM | Full | — |
| Longbeards (Durin's Folk) | subgroup | Dwarves | All eras | High — relevant to Thorin(20)/Balin(28)/Fili(29)/Kili(30)/Dwalin(31)/Gimli(5)/existing Places Erebor(8)/Moria(13) | Tolkien Gateway | HIGH | Full | Strongest-sourced Dwarf subgroup by far. |
| Harfoots | subgroup | Hobbits | Third Age | Medium — SOURCE CLAIM, ancestral Shire-Hobbit strain | Tolkien Gateway | MEDIUM | Full | — |
| Stoors | subgroup | Hobbits | Third Age | Medium — SOURCE CLAIM, associated with Sméagol/Gollum's origin (existing Character 19) | Tolkien Gateway | MEDIUM | Full | — |
| Fallohides | subgroup | Hobbits | Third Age | Low-Medium — SOURCE CLAIM, associated with Took/Brandybuck lines (existing Characters 9/10) | Tolkien Gateway | MEDIUM | Full | — |
| Uruk-hai | subgroup | Orcs | Third Age | Medium — plot-relevant (Isengard/Mordor forces) but no existing individually-named Uruk-hai Character | Tolkien Gateway | MEDIUM | Full | — |
| Half-elven | classification (not a biological race) | — | All eras | High — directly describes existing Characters Elrond(12)/Arwen(11)/Elros(39) | Tolkien Gateway, `CHARACTERS-CANDIDATES-001.md`/`002.md`/`CHARACTER-SCHEMA-REVIEW-001.md` §2 | HIGH (as a documented concept) | **SCHEMA GAP** — see §8 | Not a "race" a Character belongs to in the same sense as Elf/Human; it is the *reason* a Character chooses one. Recommended for **exclusion** from the Races catalog, not inclusion — see §8. |
| Great Eagles | one-off kind | — | All eras | Low-Medium — plot-relevant (rescues) but no named existing Character | Tolkien Gateway | MEDIUM | **SCHEMA GAP (soft)** | Same "single-notable-individual, no population data" pattern already flagged for Smaug/Shelob in `CHARACTERS-CANDIDATES-001.md` §4. Excluded from recommended batch, see §8. |
| Dragons | one-off kind | — | Third Age (Smaug) | Low-Medium — Smaug is a deferred Character candidate | Tolkien Gateway | MEDIUM | **SCHEMA GAP (soft)** | Same reasoning as Great Eagles. Excluded. |
| Great Spiders | one-off kind | — | Third Age (Shelob) | Low — Shelob is a deferred Character candidate | Tolkien Gateway | MEDIUM | **SCHEMA GAP (soft)** | Same reasoning. Excluded. |
| Maiar / Valar (Ainur) | metaphysical order, not race | — | All eras | High (already 5 existing Characters, `race: "Maia"`) | `DATASET-RESEARCH-001.md` §5/§6, `CHARACTER-SCHEMA-REVIEW-001.md` §3 | HIGH (as a documented concept) | **Out of scope for this document** | Covered separately in `docs/GODS-CANDIDATES-001.md`. Explicitly **not** a candidate row for the Races catalog — see §1/§8. |

**Count researched in this table: 24** (7 major races + 12 subgroups + 5 excluded/out-of-scope rows carried for transparency, not padding).

---

## 8. Recommended candidate batch

Schema-clean, HIGH/MEDIUM confidence, biological/craft-kind scope (excludes Half-elven, Ainur, and the three animal-adjacent one-off kinds, each for a stated reason, not silently dropped):

**Tier 1 — Strong (HIGH confidence, directly relevant to ≥3 existing Characters or Places)**:
Men, Elves, Dwarves, Hobbits, Dúnedain, Rohirrim, Noldor, Longbeards (Durin's Folk).
**Count: 8**

**Tier 2 — Good (MEDIUM/MEDIUM-HIGH confidence, real but thinner relevance)**:
Ents, Orcs, Trolls, Sindar, Silvan Elves, Vanyar, Teleri, Harfoots, Stoors, Fallohides, Uruk-hai.
**Count: 11**

**Tier 3 — Excluded from the Races catalog on conceptual grounds (not thin data)**:
Half-elven (classification, not a race — §1), Great Eagles / Dragons / Great Spiders (one-off animal-adjacent kinds with the same soft schema gap already documented for their Character-candidate counterparts), Maiar/Valar (out of scope, covered in `docs/GODS-CANDIDATES-001.md`).
**Count: 5**

**Recommended batch (Tier 1 + Tier 2): 19 candidates.** This lands within the user's own 15–30 target range without padding — no LOW-confidence candidate was needed to reach it, and no candidate was force-included past what the sources actually support.

---

## Files created

- `docs/RACES-CANDIDATES-001.md` (this file) — new.
- `docs/RACE-SCHEMA-REVIEW-001.md` — new (companion document).

No other file was created, modified, or deleted. `data/characters.json`, `data/places.json`, all code/DTOs/controllers/services/repositories, `explorerConfig.ts`, Swagger, and the frontend are untouched.
