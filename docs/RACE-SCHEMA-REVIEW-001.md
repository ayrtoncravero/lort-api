# RACE-SCHEMA-REVIEW-001 — Races/Peoples Resource Schema Proposal

Status: RESEARCH / MODEL REVIEW ONLY. No code, JSON, DTO, controller, service, repository, `explorerConfig.ts`, Swagger, or frontend file was modified. `Character` schema is **not** modified or proposed for modification as an action to take now — impact is documented only. Companion document: `docs/RACES-CANDIDATES-001.md`.

Labeling convention (unchanged): **FACT**, **SOURCE CLAIM**, **INFERENCE**, **RECOMMENDATION**. Where evidence is insufficient: "Not established by the reviewed sources."

---

## 1. Recommended public resource name

Per `RACES-CANDIDATES-001.md` §2: **`/api/races`** (API/schema level), with the frontend free to display "Peoples" or "Races & Peoples" as a UI label without any backend naming change. **RECOMMENDATION**, not a decision — naming is cheap to revisit before implementation, expensive after.

---

## 2. Recommended schema

```
{
  id: number,
  name: string,
  type: string,        // "major-race" | "subgroup"
  parentId: number | null,
  wikiUrl: string | null
}
```

Directly mirrors `Place`'s existing shape (`id`/`name`/`type`/`parentId`/`wikiUrl`) — same field count, same nullability pattern, same validator extension shape this project already built once (`PLACE_TYPES` → an equivalent `RACE_TYPES` constant, `checkPlaceParentHierarchy`-equivalent cycle/self-reference check). This is a **deliberate consistency choice**, not a coincidence: the two resources solve structurally identical problems (a small closed category set, one level of optional parent-nesting, no description/coordinates).

`description` is **omitted**, for the same reason `PLACE-SCHEMA-REVIEW-001.md` §4 omitted it for Place — see §4 below.

---

## 3. `type` field values

Per `RACES-CANDIDATES-001.md` §7's candidate table, exactly two values are needed for every researched candidate:

- `major-race` — Men, Elves, Dwarves, Hobbits, Ents, Orcs, Trolls (the Appendix F seven, per **SOURCE CLAIM**, Tolkien Gateway).
- `subgroup` — Dúnedain, Rohirrim, Noldor, Sindar, Silvan Elves, Vanyar, Teleri, Longbeards, Harfoots, Stoors, Fallohides, Uruk-hai.

**RECOMMENDATION**: keep this to exactly 2 values, not more — no candidate researched needed a third category (e.g. no "sub-subgroup" was found; every subgroup nests exactly one level under a major race). Do not invent additional granularity the source material doesn't support.

---

## 4. Description field

**Same conclusion as `PLACE-SCHEMA-REVIEW-001.md` §4, reapplied**: a `description` field for a race is high-risk. "What are Elves" or "what is the Rohirrim" cannot be meaningfully answered in one field without either (a) reproducing Tolkien's own characterization in paraphrase (a copyright-adjacent risk this project has consistently avoided — see `DATASET-RESEARCH-001.md` §14), or (b) being so generic ("a people of Middle-earth") that it adds zero developer value. **RECOMMENDATION**: omit `description` from V1, exactly as done for Place. This is not a missed opportunity — it is the same deliberate, now-repeated pattern.

---

## 5. Region / Realm — not applicable here

Not evaluated for Races (this section exists in `PLACE-SCHEMA-REVIEW-001.md` because Place's own `region`-vs-`parentId` question was specific to geography). Races has no analogous field; skipped rather than forced.

---

## 6. Geographic data

**Not applicable.** Races are not places; no coordinates, no map data, no geographic field of any kind is proposed. Consistent with this project's standing map-deferral stance (`DATASET-RESEARCH-001.md` §9, `PLACE-SCHEMA-REVIEW-001.md` §6/§7/§22) — reaffirmed, not re-derived.

---

## 7. `Character.race` relationship — impact summary (documentation only)

Per `RACES-CANDIDATES-001.md` §4: **RECOMMENDATION** is Option A/D — Races ships as an independent, informative catalog; `Character.race` is **not** modified, now or as a committed future plan. This is a **non-breaking, zero-migration** choice. If a future task later wants a formal link, the only non-breaking path is an *additive* `Character.raceId: number | null` (Option C) — but that is explicitly a separate future decision, not proposed for action here, and Character schema is out of scope for this task regardless.

---

## 8. Hierarchy — `parentId`

**RECOMMENDATION, reaffirmed from `RACES-CANDIDATES-001.md` §5**: `parentId: number | null`, self-referential, one level deep in practice for every researched candidate (subgroup → major race). This is **not overengineering** — it directly represents a real, sourced relationship (Rohirrim *is* a subgroup of Men) using a mechanism this API has already implemented, tested (`checkPlaceParentHierarchy`, 4 dedicated tests), and shipped once for `Place`. A `type` string alone cannot express *which* major race a subgroup belongs to.

---

## 9. Do we need `description`? Coordinates? `parentId`? `regionId`?

Answered directly, per the ten-questions format `PLACE-SCHEMA-REVIEW-001.md` §18 used:

1. **What fields should Race have?** `id`, `name`, `type`, `parentId`, `wikiUrl` — five fields, mirroring `Place` exactly.
2. **What types should they have?** `id: number`, `name: string`, `type: string`, `parentId: number | null`, `wikiUrl: string | null`.
3. **What should be nullable?** `parentId` (major races have none) and `wikiUrl` (only where independently verifiable, per §11).
4. **What should be a relation?** Only `parentId` — see §8.
5. **What should be a string?** `name`, `type`, `wikiUrl` (when present).
6. **Do we need coordinates?** No — see §6.
7. **Do we need `description`?** No — see §4.
8. **Do we need `parentId`?** Yes — see §8.
9. **Do we need `regionId`?** No — no candidate researched has a geographic-region relationship distinct from `Place`'s own already-rejected `regionId` (`PLACE-SCHEMA-REVIEW-001.md` §5 concluded region-as-a-separate-field is redundant with `parentId` for Place; Races has no geographic dimension at all, so the question doesn't even arise the same way).
10. **What should we leave out?** `description`, coordinates, `Character.raceId` (deferred per §7), population/demographic data (not requested, not sourced), and Ainur/Maiar/Valar rows (out of scope — see `RACES-CANDIDATES-001.md` §1).

---

## 10. Model comparison

| Model | Simplicity | API usability | Data quality | Maintenance | Frontend usefulness | Recommendation |
|---|---|---|---|---|---|---|
| **A — flat** (`id`, `name`, `wikiUrl` only) | Highest | Low — can't express subgroup relationships at all | High (nothing to get wrong) | Lowest | Low — can't show "Rohirrim is a kind of Men" | Not recommended — too thin for the candidate data actually gathered |
| **B — flat + `type`** (`id`, `name`, `type`, `wikiUrl`) | High | Medium — distinguishes major-race vs subgroup by label only | High | Low | Medium — UI can group by `type` string but can't link a specific subgroup to its specific parent | Partial credit, insufficient alone |
| **C — `parentId` (recommended)** (`id`, `name`, `type`, `parentId`, `wikiUrl`) | Medium (same as Place, already proven) | High — same query pattern as Place, developers already know it | High | Medium (identical validator extension already built once for Place) | High — UI can render "Rohirrim → Men" directly | **Recommended** |

---

## 11. Public API proposal (not implemented)

```
GET /api/races
GET /api/races/:id
```

**Filters** (justified only, no invented ones): `name` (substring, matching the existing convention for Character/Movie/Book/Place), `type` (exact match, matching `Place.type`'s existing convention). No `parentId` filter proposed — not requested by the user's brief and no clear demonstrated need beyond what `GET /api/races/:id` combined with client-side filtering already covers; can be added later without a breaking change if real usage shows demand.

**Pagination**: same `{data, page, limit, total}` envelope as every other resource — no reason to deviate, per this project's consistently-applied "match existing contract unless there's a strong reason not to" rule.

**`wikiUrl`**: same discipline as Place — no URL is asserted unless independently verifiable at insertion time; `null` otherwise, never invented.

---

## 12. Provenance (conceptual only, not created)

Same structure as `provenance/characters.sources.json` and `provenance/places.sources.json`: `entityType: "race"`, `entities[]` with `entityId`/`entityIdStatus` (`"provisional"` until inserted)/`name`/`sources[]` (`name`/`url`/`confidence`/`notes`). No new fields needed — Races' provenance concerns (source reliability, confidence, unresolved conflicts like Orc origin-story ambiguity) are identical in shape to Characters' and Places'. **Not created by this document.**

---

## 13. Compare complexity — restated for clarity

See §10 above (already covers Model A/B/C per the user's exact naming). No additional "Model D" was found necessary — the candidate research in `RACES-CANDIDATES-001.md` didn't surface a need for a fully relational multi-entity model (e.g. a separate `Subgroup` resource distinct from `Race`) — one self-referential table handles every case found.

---

## 14. Final recommendation

### Recommended public resource name
`/api/races` (schema/API level); frontend UI label may say "Peoples" or "Races & Peoples" without a backend change.

### Recommended schema
`{ id: number, name: string, type: "major-race" | "subgroup", parentId: number | null, wikiUrl: string | null }` — Model C (`parentId`), mirroring `Place`'s already-proven shape.

### Recommended relationships
`parentId` only (self-referential, one level deep in practice). No `Character.raceId` link — Races ships as an independent, informative catalog (Option A/D, §7). No `Character → Race` reverse query proposed in this document (unlike Place, which explicitly recommended a derived `?realm=` query — Races candidates don't have a comparably strong demonstrated case for this in the current research pass; can be revisited later, not decided against permanently, just not established here).

### Recommended dataset size
**19** (the Tier 1 + Tier 2 recommended batch from `RACES-CANDIDATES-001.md` §8) — within the user's 15–30 target, reached without padding. Not forced to 30; quality bar (HIGH/MEDIUM confidence, no schema gap) already comfortably clears 19 distinct, well-documented entries.

---

## 15. Decision matrix

| Aspect | Option | Pros | Cons | Recommendation |
|---|---|---|---|---|
| Naming | `/api/races` vs `/api/peoples` | Races: matches existing `Character.race` field, zero new vocabulary | Peoples: arguably more Tolkien-accurate for later terminology | **`/api/races`**, UI label may differ |
| Schema | flat vs flat+type vs parentId | parentId: expresses real sourced subgroup relationships | parentId: one more field, one more validator extension (already built once for Place though) | **`parentId` model (Model C)** |
| Hierarchy | none vs `parentId` | `parentId`: matches real data (subgroups exist); none: simpler | none: can't represent Rohirrim-under-Men at all | **`parentId`, one level deep** |
| Character relationship | none vs `raceId` (additive) vs `raceId` (breaking) | none: zero migration, zero breaking risk | none: no formal link, string-matching only if a consumer wants one | **None now (Option A/D)**; additive `raceId` remains a possible, undecided future step |
| Description | include vs omit | include: more informative | include: copyright risk, same as Place's rejected `description` | **Omit**, consistent with Place precedent |
| Provenance | mirror Characters/Places vs new structure | mirror: zero new design cost, proven pattern | none identified | **Mirror exactly**, not created yet |

---

## Files created

- `docs/RACE-SCHEMA-REVIEW-001.md` (this file) — new.
- `docs/RACES-CANDIDATES-001.md` — new (companion document).

No other file was created, modified, or deleted. `Character` and `Place` schemas, all code, JSON data, and the frontend are untouched.
