# PLACE-SCHEMA-REVIEW-001 — Place Resource Schema Proposal

Status: RESEARCH / PROPOSAL ONLY. No JSON, DTO, controller, service, repository, `explorerConfig.ts`, or frontend file was modified to produce this document. No `Place` schema was implemented. No `places.json` was created. Nothing here is authorized for implementation until reviewed and approved separately.

Labeling convention (unchanged): **FACT**, **SOURCE CLAIM**, **INFERENCE**, **RECOMMENDATION**. Where evidence is insufficient: "Not established by the reviewed sources."

This document builds on `docs/PLACES-CANDIDATES-001.md` (43 researched candidates, category analysis, hierarchy models) and reuses `docs/DATASET-RESEARCH-001.md` §1/§9/§14 (map/image copyright stance) and `docs/PROVENANCE-001.md` (provenance conventions) without re-deriving them. Also grounded in `docs/CHARACTER-SCHEMA-REVIEW-001.md` §5 (the existing `realm: string | null` field's current behavior, explicitly not changed here) and the actual live `realm` values in `data/characters.json` (21 distinct strings, re-read in this pass — see `PLACES-CANDIDATES-001.md` §1).

---

## 3. Schema candidates

### Model A — minimal (flat)

```
id: number
name: string
type: string  (region | realm | settlement | fortress | landmark | geographic feature | dwelling — see §14)
region: string | null
wikiUrl: string | null
```

No `description`, no `parentId`, no coordinates. Every field is either required-and-simple or an optional string, mirroring the Character/Movie/Book schema's own minimalism.

**Pros**: zero relational complexity; trivially representable for all 43 candidates researched (`region` as a free-text string works exactly like `Character.realm` already does — no candidate needs anything more structured); fastest to implement and validate; matches the project's established minimal-schema principle (`CHARACTER-SCHEMA-REVIEW-001.md` §10).
**Cons**: `region` as a free string duplicates the exact same non-relational weakness already documented for `Character.realm` (`CHARACTER-SCHEMA-REVIEW-001.md` §5) — Minas Tirith's `region: "Gondor"` and Gondor's own Place record become two independent strings with no structural link, the same drift risk already accepted for `Character.spouse`. No support for the hierarchy findings in `PLACES-CANDIDATES-001.md` §2 (Model 2) beyond a single flat "region" label — can't express Bag End→Hobbiton→Shire→Eriador as a real chain, only as a flat "region: Eriador" (losing the Hobbiton/Shire intermediate steps entirely).

### Model B — relational (hierarchical)

```
id: number
name: string
type: string
regionId: number | null   (self-reference: points to another Place acting as the containing region)
parentId: number | null   (self-reference: points to the immediate containing Place, any type)
wikiUrl: string | null
```

**Pros**: supports the flexible hierarchy (`PLACES-CANDIDATES-001.md` §2, Model 2) properly — Minas Tirith can `parentId → Gondor`, Gondor can `parentId → null` (a top-level realm) or eventually `regionId → (a "Westlands" region record, if ever added)`. Structurally correct, avoids the string-drift problem Model A inherits from `Character.realm`.
**Cons**: `regionId` and `parentId` as **two separate self-referential fields** is redundant — per `PLACES-CANDIDATES-001.md` §11, "region" is not conceptually distinct from "parent Place" once regions themselves are modeled as Places (Eriador, Rhovanion, Beleriand are all candidate Place rows in their own right, not a separate category). Two fields doing overlapping jobs is exactly the kind of unjustified complexity `CHARACTER-SCHEMA-REVIEW-001.md` §10's minimal-schema principle warns against. Requires cycle-prevention validation (a Place cannot be its own ancestor) — new validator logic, not currently needed by any existing resource.

**RECOMMENDATION, resolving the A-vs-B tension**: neither model as originally specified. A collapsed **Model B′** — drop the redundant `regionId`, keep a single `parentId: number | null` self-reference, and let "region" simply be *whatever Place a given record's `parentId` points to* (a region is a Place with `type: "region"`, not a separate field). This gets Model B's structural correctness without Model B's redundancy. See §19 for the full three-way comparison (flat / hierarchical / relational-with-entities) that led to this conclusion.

---

## 4. Description field

**FACT**: the current Character/Movie/Book/Quote schemas have **no `description` field anywhere** — this would be a genuinely new kind of field for LORT's public API, not an extension of an existing pattern.

**Value assessment**: a one-line factual descriptor ("the capital city of Gondor," "a fortress in the White Mountains of Rohan") would help API consumers who don't already know Middle-earth geography — real value, not decorative.

**Copyright risk assessment**: per `DATASET-RESEARCH-001.md` §14, *facts* are not copyrightable but *specific expressions* of them are. A `description` field populated by copy-pasting a sentence from Tolkien Gateway or a Fandom wiki would risk reproducing that source's specific *expression* (even if CC BY-SA-licensed, per `DATASET-RESEARCH-001.md` §1, that license requires attribution and share-alike terms this project has not committed to honoring per-field) — and would risk paraphrasing Tolkien's own published prose if the wiki source itself is a close paraphrase of the books (common in fan wikis). This is the same category of risk already flagged for Quotes (`DATASET-RESEARCH-001.md` §12), just at lower severity (a one-line factual descriptor is not verbatim dialogue).

**RECOMMENDATION**: **omit `description` from V1 Place schema entirely.** Not because it has no value, but because:
1. It's the one field in this whole proposal with a *non-zero, non-trivial* copyright question, and the project's established discipline (`DATASET-RESEARCH-001.md` §14) is to flag uncertainty rather than proceed on an assumption.
2. If added later, it should be **LORT-original, independently-written** short factual summaries (e.g., "Capital city of the realm of Gondor" — a bare structural fact, not a narrative description) — never copied or closely paraphrased from any source. This is a **process discipline**, not a schema field, and is better enforced by *not having the field* until someone commits to writing original summaries, than by having the field and hoping contributors remember not to copy-paste.
3. Every candidate in `PLACES-CANDIDATES-001.md` §4 is fully identifiable and useful via `name` + `type` + `region`/`parentId` alone — no candidate *requires* a description to be minimally useful, consistent with the minimal-schema principle.

---

## 5. Region / Realm

**FACT**: `Character.realm` is `string | null`, free text, already containing 21 distinct values (`PLACES-CANDIDATES-001.md` §1) that mix realms, cities, and forest-kingdoms without distinction — this is the exact same modeling looseness Model A above would inherit if `Place.region` were also a bare string.

**Analysis specific to Place** (not Character — `Character.realm` itself is explicitly **not** being changed by this document, per instruction §13/§25): for a *new* `Place` resource, using a bare string for "region" would be a **self-inflicted** version of the same problem — Place is the resource that's supposed to solve free-text drift, so giving it its own free-text region field would be internally inconsistent. **RECOMMENDATION**: within `Place`, region/parent should be the relational `parentId` (§3, Model B′), never a string — this is different advice than what applies to `Character.realm`, precisely because `Place` is a new resource being designed now with the lesson already learned, whereas `Character.realm` is an existing, shipped field where changing it is a breaking-change question outside this task's scope (`CHARACTER-SCHEMA-REVIEW-001.md` §5, unchanged).

**Case study grounding this recommendation** (from `PLACES-CANDIDATES-001.md` §6): Gondor/Arnor/"Arnor and Gondor"/"Gondor and Arnor" — four distinct strings in the wild (three in `Character.realm`, a fourth if Place used its own free string) referring to two real underlying places. A relational `parentId` doesn't automatically fix this (Aragorn's compound realm still spans two Place records, an inherent multi-realm case, not a typo), but it stops the problem from *multiplying* — at least the two canonical Place records (Gondor, Arnor) each have one stable identity, rather than each also accumulating their own free-text spelling variants.

---

## 6. Geographic data

**Explicit constraint carried forward from `DATASET-RESEARCH-001.md` §9** (not re-derived, reused): do not reuse coordinates copied from any published/protected map; do not invent coordinates presented as authoritative real-world-style lat/long data.

**Evaluated**:
- **Real-world-style `latitude`/`longitude`**: **not recommended, ever** — Middle-earth is fictional and has no real-world coordinate system; assigning lat/long values would either (a) be meaningless placeholder numbers presented as if they were data, which is a fabrication, or (b) imply a real-world geographic mapping (e.g., "the Shire is at 51°N") that no source establishes and that would misrepresent the material.
- **Approximate/relative coordinates (self-authored, abstract units, not lat/long)**: e.g., a simple `x`/`y` pair on an arbitrary internal grid, authored by LORT itself (not traced from any map), purely for relative-position layout purposes (Rivendell is roughly northeast of the Shire). **Feasible only as a genuinely later task** — it requires someone to actually author a full coordinate set for all 41 recommended Places, which is real design/authoring work (not free from any source), and doing it carelessly risks inadvertently reproducing a recognizable map layout (the same risk `DATASET-RESEARCH-001.md` §9 already flagged). **Not done in this document** — no coordinate was invented here for any candidate.
- **Bounding boxes**: same concerns as coordinates, at higher authoring cost, for a benefit (rendering a region's "area" rather than a point) that no candidate in this research pass demonstrated a clear need for.

**RECOMMENDATION**: **defer all geographic/coordinate fields from V1 Place schema.** If self-authored approximate positioning is wanted later, it should be its own dedicated task (its own document, its own explicit authoring pass, likely alongside whatever future map work `DATASET-RESEARCH-001.md` §9 already flagged as "v-later, not V1") — not bundled into the initial Place schema, and not populated by guessing coordinates now.

---

## 7. Map readiness (see also §22)

Addressed jointly with §22 below, per the user's own structure (§7 and §22 cover overlapping ground). See §22 for the full "what would Place need to contain" analysis.

---

## 14. Place categories

Derived from actual candidate research, not proposed abstractly here — full derivation lives in `PLACES-CANDIDATES-001.md` §14. Restated for this document's schema purposes:

**Recommended category set (7 values)**: `region`, `realm`, `settlement`, `fortress`, `landmark`, `geographic feature`, `dwelling`.

**Schema implication**: `type` should be a constrained string (an enum-like set at the DTO/validation layer, consistent with how the existing validator already does closed-set-style checks for `confidence` in the provenance proposal, `PROVENANCE-001.md` §13) rather than a fully free string — unlike `Character.race`, which the schema review (`CHARACTER-SCHEMA-REVIEW-001.md` §1) deliberately left as an unconstrained string because Character categories are genuinely open-ended (new races/orders-of-being keep appearing). Place categories, by contrast, are a small, closed, well-understood set per this research pass — RECOMMENDATION: constrain `type` at the API validation layer (reject unknown type values with 400, mirroring the existing numeric-filter rejection behavior already established for Characters/Movies/Books/Quotes), not leave it fully open like `race`.

---

## 18. Ten questions — direct answers

1. **¿Qué campos debería tener Place?** `id`, `name`, `type`, `parentId`, `wikiUrl` — five fields. Minimal, matching the Character/Movie/Book precedent of small, flat schemas.
2. **¿Qué tipos deberían tener?** `id: number`, `name: string`, `type: string` (constrained to the 7-value set, §14), `parentId: number | null` (self-reference), `wikiUrl: string | null`.
3. **¿Qué debería ser nullable?** `parentId` (top-level regions/realms with no container, e.g. Middle-earth-level entries like Eriador itself) and `wikiUrl` (not every candidate has an independently verified page — several §4 candidates in `PLACES-CANDIDATES-001.md` were not independently re-fetched this pass). `id`, `name`, `type` required, matching the required/nullable split already established for Character (`id`/`name`/`race` required) and Movie/Book (all required — Place's optionality profile sits between the two, closer to Character).
4. **¿Qué debería ser una relación?** `parentId` — the hierarchy (§2 in the candidates doc) and the region/realm distinction (§5 above) are both relational, not string, concerns. This is the one place (pun acknowledged, not pursued) where Place's design should differ from Character's string-heavy approach, precisely because Place's whole reason for existing is to fix what a free-text `realm` string can't do.
5. **¿Qué debería ser string?** `name`, `type` (constrained), `wikiUrl`.
6. **¿Necesitamos coordinates?** No, not in V1 — see §6. Defer to a dedicated future task if self-authored approximate positioning is ever wanted.
7. **¿Necesitamos description?** No, not in V1 — see §4. The copyright-risk profile is the one genuinely elevated-risk item in this whole proposal; omission is the safer default until someone commits to writing original, non-copied summaries.
8. **¿Necesitamos parentId?** Yes — see §3/§5. This is the one relational field actually justified by the research (fixes the exact weakness `Character.realm` already demonstrates).
9. **¿Necesitamos regionId?** No, as a *separate* field from `parentId` — see §3's Model B′ resolution. A region is simply a Place whose `type` is `"region"`; `parentId` already covers "what contains this place" whether the container is a region, a realm, or a settlement.
10. **¿Qué debemos dejar fuera?** `description` (§4), all coordinate/geographic fields (§6), `regionId` as a field distinct from `parentId` (§3/§9 above), any `Event`/`Book`/`Movie` relation (`PLACES-CANDIDATES-001.md` §11 — insufficient demonstrated value), and any change to `Character.realm` itself (explicitly out of scope per instruction).

---

## 19. Compare complexity: Model A (flat) / B (hierarchical) / C (relational + entities)

| Aspect | Model A — flat (`region: string`) | Model B′ — hierarchical (`parentId: number \| null`, single self-reference) | Model C — relational + entities (separate `Region` resource, `Place.regionId` + `Place.parentId` + full CRUD-style sub-resources) |
|---|---|---|---|
| Simplicity | Highest — no self-reference, no cycle checks | Medium — one self-referential field, needs cycle-prevention validation | Lowest — two relations, a whole second resource (`Region`), duplicated concerns about *its* own hierarchy |
| API usability | Simple filters (`?region=Gondor` as a string match) but inherits `Character.realm`'s drift risk | `?parentId=X` or a resolved nested `parent: {id, name}` object (mirrors the existing Quote pattern of resolving `movieId`/`characterId` into nested summaries — a proven LORT pattern) | Most "correct" REST modeling, but requires consumers to understand two relations and a second resource just to answer "where is this" |
| Data quality | String drift risk (same as `Character.realm`, `Character.spouse` today) | Structural correctness; a `parentId` is either valid or a validator-catchable orphan reference, same class of check the validator already does for Quote→Character/Movie | Best data quality in theory, but the added `Region` resource just relocates the drift risk to *its own* self-reference, without eliminating it |
| Maintenance | Low effort now, but accumulates the same string-inconsistency debt already visible in `Character.realm` (§5 case study) | Moderate — one new validator rule (cycle detection + orphan `parentId` check), otherwise consistent with existing patterns | Highest maintenance — two resources to keep in sync, two sets of validator rules, two provenance files |
| Frontend usefulness | Works today with zero new UI concepts (just another string filter, like existing `race`/`gender` filters) | Enables a real "browse by containment" UI (drill down region→realm→settlement) without new resources | Same drill-down capability as B′, no added frontend benefit over B′ for the extra backend complexity |
| Future map support | Weak — flat strings give no structural basis for a containment-aware visualization | Strong — `parentId` chains are exactly what a schematic containment-based map/tree visualization needs (§22) | Same strength as B′ for map purposes; the extra `Region` resource adds no map-specific capability B′ doesn't already have |
| **Recommendation** | Not recommended — repeats `Character.realm`'s known weakness in a resource whose purpose is to fix that weakness | **Recommended** | Not recommended — Model C's extra resource is complexity without a corresponding capability gain over B′ |

---

## 20. Public API proposal (not implemented)

`GET /api/places` — paginated list, same envelope as existing resources (see §21).
`GET /api/places/:id` — single record, numeric id, 400 on non-numeric per the existing Characters/Movies/Books/Quotes convention (`error-contract.e2e-spec.ts` precedent), 404 on not-found.

**Filters evaluated**:
- `name` — RECOMMENDATION: yes, same pattern as `Character.name`/`Movie.name` substring or exact match (whichever the existing filter convention uses — not re-derived here, follow existing precedent).
- `type` — RECOMMENDATION: yes, exact match against the constrained 7-value set (§14); reject unknown type values with 400, consistent with the numeric-filter rejection discipline already established (`DATASET-RESEARCH-001.md`'s prior migration work, per this session's history).
- `region` — RECOMMENDATION: **not as a separate filter name** — since region collapses into `parentId` (§3/§9), this would be `?parentId=X` (numeric), not `?region=Gondor` (string). If a string-based "find places in Gondor by name" convenience filter is wanted later, it could resolve `Gondor` → its id first, but that's a v-later UX nicety, not proposed now.
- `era` — **not recommended for V1**: no `era` field is proposed in the schema at all (§18, question 1's five-field list has no era field) — era is implicit in which Places exist (a First Age realm like Gondolin doesn't need an explicit `era: "First Age"` string any more than `Character` needs one; the era is knowable from context/associated Characters, same as how Character itself has no `era` field either). Not established that a dedicated `era` filter/field would add value the `type`+`parentId` combination doesn't already provide.

---

## 21. Pagination

**RECOMMENDATION**: use the identical envelope already shared by Characters/Movies/Books/Quotes:
```json
{ "data": [], "page": 1, "limit": 20, "total": 0 }
```
No reason found in this research to diverge — Place's data shape (flat records with one optional self-reference) doesn't introduce any pagination complexity the existing envelope can't handle. Maintaining consistency here is a pure win for API predictability with zero identified cost.

---

## 22. Map readiness

**What `Place` would need to contain for a future self-built map/visualization to be possible** (per `DATASET-RESEARCH-001.md` §9's prior conclusion: self-authored, non-map-derived, schematic only):

1. **`parentId` (recommended, §3/§18)** — this alone is sufficient for a **containment-based schematic** (a collapsible tree or nested-boxes diagram: Middle-earth → Eriador → The Shire → Hobbiton → Bag End), which requires zero coordinates and zero risk of resembling a published map's cartographic layout. This is the **lowest-risk, highest-readiness** map-adjacent feature achievable with the schema recommended in this document, and it comes for free if `parentId` is adopted for its own (non-map) structural reasons.
2. **Approximate relative positioning (explicitly deferred, §6)** — only needed for a spatial (not just hierarchical) visualization, e.g. "the Shire is west of Bree." Not part of this document's recommended schema; would need its own dedicated authoring task per §6.
3. **`type` (already recommended)** — useful for map styling (a `fortress` icon vs. a `settlement` icon vs. a `region` boundary label), a presentation-layer concern with no schema cost beyond what's already proposed.
4. **Character/Place association (already covered by existing `Character.realm` string matching, §11 in the candidates doc)** — supports a "characters associated with this place" panel in a future map UI without any new relation.

**RECOMMENDATION**: adopting `parentId` (already independently justified in §3/§5/§9) is sufficient to make a future **containment-based schematic** (tree/nested-diagram style, not a geographic map) buildable later without further schema work. A **geographic/spatial** map remains a separate, larger, explicitly-deferred undertaking (§6) requiring its own authoring pass and its own risk review, consistent with `DATASET-RESEARCH-001.md` §9's original "v-later, not V1" conclusion — not contradicted or advanced by this document, just re-confirmed with the added clarity that the schema recommended here doesn't block it, but doesn't build it either.

---

## 23. Final recommendation

### Recommended Place schema
```
id: number
name: string
type: string        (constrained: region | realm | settlement | fortress | landmark | geographic feature | dwelling)
parentId: number | null   (self-reference to another Place)
wikiUrl: string | null
```
Five fields. No `description`, no coordinates, no separate `regionId`.

### Recommended categories
`region`, `realm`, `settlement`, `fortress`, `landmark`, `geographic feature`, `dwelling` — 7 values, derived from the 43 researched candidates (`PLACES-CANDIDATES-001.md` §14), not proposed abstractly.

### Recommended relationships
`Place.parentId → Place` (self-reference, the one relation actually justified by research). `Place → Character` as a **derived/reverse** query only (via existing `Character.realm` string matching), not new stored data. No `Place → Book`/`Place → Movie`/`Place → Event` relations — insufficient demonstrated value (`PLACES-CANDIDATES-001.md` §11).

### Recommended dataset size
**~40** (the Tier 1 + Tier 2 batch from `PLACES-CANDIDATES-001.md` §8, 41 candidates) if Places is adopted at all — not 50, which would require a second research pass, consistent with how Characters needed three passes to responsibly reach 50.

### Recommended API endpoints
`GET /api/places`, `GET /api/places/:id`, filters `name` (string) and `type` (constrained enum, 400 on unknown value). No `region` filter (collapses into `parentId`). No `era` filter (no `era` field proposed). Same pagination envelope as existing resources.

### Deferred features
`description` (copyright-risk profile, §4), all coordinate/geographic fields (§6), `regionId` as a field separate from `parentId` (§3/§9), `Character.realmId` replacing/complementing `Character.realm` (`PLACES-CANDIDATES-001.md` §12 — explicitly future-only, no Character schema change here), any geographic/spatial map rendering (§22).

### Map strategy
A containment-based schematic (tree/nested-diagram, using `parentId`) is buildable later without further schema changes, once `Place` exists. A geographic/spatial map remains explicitly deferred, requiring its own future authoring task and risk review — not proposed, not scheduled, consistent with `DATASET-RESEARCH-001.md` §9.

---

## 24. Decision matrix

| Aspect | Option | Pros | Cons | Recommendation |
|---|---|---|---|---|
| Schema | Model A (flat, `region: string`) vs. Model B′ (hierarchical, `parentId`) vs. Model C (relational + `Region` resource) | A: simplest. B′: structurally correct, low added complexity. C: theoretically cleanest | A: repeats `Character.realm`'s known drift weakness. C: added resource with no capability gain over B′ | **B′ — flat record with a single self-referential `parentId`** |
| Coordinates | None vs. self-authored approximate vs. real lat/long | Self-authored: enables spatial map later. None: zero risk, zero authoring cost | Self-authored: real authoring effort + risk of resembling published maps if done carelessly. Real lat/long: fictional world, would be fabrication | **None in V1 — defer to a dedicated future task** |
| Description | Omit vs. LORT-original short summary vs. copied/paraphrased from a source | Original summary: real reader value | Copied/paraphrased: copyright risk (same class as Quotes concern). Even "original" requires a process discipline this task isn't chartered to establish | **Omit from V1** |
| Hierarchy | Fixed 4-level tree vs. flexible self-referential `parentId` | Fixed tree: predictable depth for UI | Fixed tree: breaks on real candidates (Rivendell, Moria, Mount Doom don't fit 4 clean levels) — per `PLACES-CANDIDATES-001.md` §2 | **Flexible `parentId`, no fixed depth** |
| Region | Free-text string (like `Character.realm`) vs. relational (region = a Place with `type: "region"`) | String: zero relational complexity | String: repeats the exact weakness Place exists to fix | **Relational — region is just a Place, no separate field** |
| Relationships | Full set (parent + Characters + Books + Movies + Events) vs. minimal (`parentId` only, others derived/omitted) | Full set: theoretically richer | Full set: Books/Movies/Events relations have no demonstrated value in this research pass; Events resource doesn't exist and isn't proposed | **Minimal — `parentId` only; Character association via existing `realm` string match, not new data** |
| Map | Build now (SVG/GeoJSON with authored coordinates) vs. defer, but design schema to not block it later | Build now: earlier payoff | Build now: real authoring/risk work not yet scoped or approved, contradicts `DATASET-RESEARCH-001.md` §9's "v-later" conclusion | **Defer — but `parentId` alone already enables a containment-based schematic later at zero extra schema cost** |

---

## Files created

- `docs/PLACE-SCHEMA-REVIEW-001.md` (this file) — new.
- `docs/PLACES-CANDIDATES-001.md` — new (companion document, see separately).

No other file was created, modified, or deleted. `data/characters.json`, `data/places.json` (does not exist and was not created), all DTOs/controllers/services/repositories, `src/api/explorerConfig.ts`, and the frontend are untouched.
