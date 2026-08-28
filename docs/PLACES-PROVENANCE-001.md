# PLACES-PROVENANCE-001 — Places Provenance Structure

Status: this document DOES accompany a real, non-code repository file: `provenance/places.sources.json` (new, 41 entries, all `entityIdStatus: "provisional"`). Nothing else was created, modified, or deleted. No `data/places.json` exists and none was created. No JSON under `data/`, no DTO, controller, service, repository, frontend file, `explorerConfig.ts`, or Swagger annotation was touched. `provenance/characters.sources.json` was not modified. `src/tools/dataset-validation/validate-dataset.ts` was not touched.

Labeling convention (unchanged): **FACT**, **SOURCE CLAIM**, **INFERENCE**, **RECOMMENDATION**.

This document builds on `docs/PLACES-CANDIDATES-001.md` (41 recommended candidates, 3 deferred), `docs/PLACE-SCHEMA-REVIEW-001.md` (approved schema: `id`, `name`, `type`, `parentId`, `wikiUrl` — no `description`, no `regionId`, no coordinates), `docs/PROVENANCE-001.md` (the structural conventions this document mirrors), and `provenance/characters.sources.json` (the concrete pattern replicated here). No new research was performed to produce this document — every source cited below already appears in `PLACES-CANDIDATES-001.md`.

---

## 1. Purpose

Give the future `Place` resource the same auditable source trail `provenance/characters.sources.json` already gives Characters, **before** any Place record exists in a public dataset. This lets:

- Every candidate that eventually gets inserted into a future `data/places.json` carry a source trail from day one, rather than being reconstructed retroactively.
- Uncertain or unestablished `parentId` relationships (see §7) have a durable, explicit place to live as "not established" rather than being silently guessed at insertion time.
- The distinction between the 41 recommended candidates and the 3 deferred ones (Prancing Pony, Bag End, Meduseld) stay unambiguous at the provenance layer too, not just in the research document.

---

## 2. Relation to `provenance/characters.sources.json`

**Independent files, same pattern, no cross-references at the schema level.** `places.sources.json` does not modify, extend, or read `characters.sources.json` — they are siblings under `provenance/`, each scoped to one `entityType`. Where a Place candidate's notes reference an existing Character (e.g. "resident association: Saruman, existing Character 15"), that is a **documentary cross-reference in free text**, not a structural link — consistent with how `PLACE-SCHEMA-REVIEW-001.md` §11 concluded that `Place → Character` should be a derived query (via `Character.realm` string matching), not stored relational data, even at the provenance layer.

---

## 3. Structure

```json
{
  "entityType": "place",
  "schemaNote": "Internal repository metadata. NOT part of the public API response...",
  "entities": [
    {
      "entityId": 1,
      "entityIdStatus": "provisional",
      "name": "The Shire",
      "sources": [
        {
          "name": "Tolkien Gateway (via WebSearch snippet synthesis — ...)",
          "url": null,
          "confidence": "HIGH",
          "notes": "..."
        }
      ]
    }
  ]
}
```

**No deviation from the `characters.sources.json` pattern.** Same entity-level (not per-field) `sources[]` array, same `entityIdStatus: "final" | "provisional"` field, same `name`/`url`/`confidence`/`notes` source-entry shape. No justification was found to deviate — Place candidate sourcing in `PLACES-CANDIDATES-001.md` is, like the Character research before it, naturally entity-granular (one Tolkien Gateway page/search-synthesis result typically supplying name, type, region, and notable associations together), so the same entity-level reasoning documented in `PROVENANCE-001.md` §2 applies unchanged. Per instruction ("no sobreingenierizar"), no new field was invented for Places-specific concerns (see §7 for how `parentId` provenance is handled *without* a new field).

---

## 4. Provisional vs. final IDs — Places specifically

**Every entry in `places.sources.json` is currently `entityIdStatus: "provisional"`.** There are no `"final"` entries, because there is no `data/places.json` and no Place has been inserted into any public dataset. This differs from `characters.sources.json`'s current state (which has both `"final"` entries for the live 50 Characters and, at the time this document was written, zero remaining `"provisional"` entries after the first expansion round) only because Places hasn't had an insertion round yet — the semantics of the field are identical.

**Provisional IDs in this file (1–41) are sequential per this file only** — not reserved, not final, not to be assumed as the eventual `data/places.json` ids. They follow the same discipline already established for Characters (`CHARACTERS-DATASET-001.md`): if/when candidates are approved for insertion, final ids would be assigned sequentially at that time, and this file's `entityId`/`entityIdStatus` would be updated to match (`"provisional"` → `"final"`, `entityId` renumbered if the final assignment differs from 1–41), exactly as done for the 31 Character candidates.

**Numbering scheme used**: entities 1–22 are `PLACES-CANDIDATES-001.md` §8's Tier 1 (in the order listed there), entities 23–41 are Tier 2 (in the order listed there). This is a document-internal ordering choice, not a ranking of importance beyond what Tier 1/Tier 2 already express.

---

## 5. Confidence model

Same three-level `HIGH`/`MEDIUM`/`LOW` scale as `characters.sources.json`. **No confidence was elevated** beyond what `PLACES-CANDIDATES-001.md` §4/§5 recorded — every Tier 1 entry here is `HIGH` (matching the candidates doc's own HIGH-confidence classification for Tier 1), every Tier 2 entry here is `MEDIUM` (the candidates doc used `MEDIUM`/`MEDIUM-HIGH` for Tier 2; `MEDIUM-HIGH` values were rounded down to `MEDIUM`, same conservative-rounding convention already established in `PROVENANCE-001.md` §4 for Characters). No `LOW`-confidence entry exists in this file — consistent with the source document, which placed all its `LOW`/`LOW-MEDIUM` candidates (The Prancing Pony, Bag End, Meduseld) in Tier 3, excluded from the recommended batch.

---

## 6. Source handling and licensing notes

Every source entry cites `"Tolkien Gateway (via WebSearch snippet synthesis)"` or a close variant, matching exactly how `PLACES-CANDIDATES-001.md` §3 described its own sourcing method (direct `WebFetch` to `tolkiengateway.net` was not attempted in that pass, reusing the prior-session finding that it returns HTTP 403). **No URL was invented.** Every `url` field in this file is `null`, because `PLACES-CANDIDATES-001.md` never recorded an independently-verified URL for any of the 43 candidates it researched (unlike `CHARACTERS-CANDIDATES-002.md`, which did record one live URL for Elros) — there was nothing to carry forward.

**Licensing**: per `DATASET-RESEARCH-001.md` §14 and `PLACES-CANDIDATES-001.md` §13/§15, every fact recorded in this file (name, type, region, notable associations) is factual/structured data, not copyrighted descriptive prose. No entry required a `REQUIRES LEGAL REVIEW` flag. Consistent with `PLACE-SCHEMA-REVIEW-001.md` §4's conclusion that the one genuinely elevated-risk item (a `description` field) is excluded from the schema entirely — there is accordingly no descriptive prose anywhere in this provenance file either, only short structural notes, matching the "no copiar párrafos" discipline already established for `characters.sources.json` §11 rule 5.

---

## 7. `parentId` provenance handling

**No `parentId` field exists in this provenance file** — provenance records sources for facts, and no candidate's `parentId` is yet an inserted, verified fact (there is no `data/places.json` for it to point into). Instead, every entity's `notes` field documents:

- A **plausible parentId candidate**, where `PLACES-CANDIDATES-001.md` §4's own "Region" column or §11's relationship analysis names one (e.g. Minas Tirith's notes cite Gondor, entityId 2, as its plausible parent — the candidates document itself calls this out explicitly).
- The **explicit caveat** that this is a co-occurring region label or a geographically/narratively obvious relationship, not an independently verified record-level relation — and that **`parentId` should be inserted as `null` at insertion time unless separately confirmed**, per the user's own instruction not to invent a hierarchy.
- Where **no** plausible parent could be identified at all (e.g. Mordor, Beleriand, Eriador, Rhovanion, Misty Mountains, Anduin, Valinor, Númenor — all top-level regions/realms or geographic features with no containing candidate in this file's 41 entities), the note says so directly rather than leaving the question unaddressed.
- Where a relationship was **considered but rejected** (e.g. Isengard's notes explicitly reject inferring a Rohan `parentId` from mere geographic adjacency, since Isengard is politically independent; Dale's notes reject an Erebor `parentId` for the same reason), the rejection and its reasoning is recorded, not silently omitted.

This mirrors, at the relational level, the same discipline `PROVENANCE-001.md` §11 rule 3 already established for factual conflicts: **record the uncertainty explicitly, never average or guess.**

---

## 8. Entity identity / alias resolution

Same one-place-one-entity discipline as `PLACES-CANDIDATES-001.md` §6/§11, restated for the provenance layer: no candidate in this file has more than one entry for the same underlying place. Canonical-identity notes already resolved in the candidates document are preserved in the relevant entity's `notes` field (Gondor/Arnor as two records not three variant strings; Woodland Realm not duplicated as "Mirkwood"; Helm's Deep not duplicated as "Hornburg"; Minas Morgul not duplicated as "Minas Ithil"). No alias field was added — aliases remain documented in free-text `notes` only, consistent with the schema review's conclusion that `Place` has no alias field.

**Spelling note**: "Lothlorien" and "Numenor" are recorded here **without diacritics**, deliberately diverging from `PLACES-CANDIDATES-001.md`'s own table spelling (`Lothlórien`, `Númenor`), to match the exact spelling already live in `data/characters.json`'s `realm` field values — this is the same normalize-to-existing-dataset-convention choice already applied when Characters were inserted (`CHARACTERS-DATASET-001.md` §"Data quality decisions", point 3).

---

## 9. Deferred candidates (Prancing Pony, Bag End, Meduseld)

**Decision: excluded entirely from `places.sources.json`, no entry of any kind.** This follows the exact precedent already set for Characters: `characters.sources.json` never included entries for Tier 3/deferred Character candidates (Glorfindel, Farmer Maggot, Smaug, Shelob, Witch-king, Tom Bombadil, Goldberry) — they simply aren't represented, not "demoted" or marked with a special status. Applying the same logic here: The Prancing Pony, Bag End, and Meduseld are not part of the current insertion plan (per `PLACES-CANDIDATES-001.md` §8, all three are Tier 3 — thin sourcing / fine-grained sub-locations, `LOW`/`LOW-MEDIUM` confidence), so writing provisional entries for them would blur the line the user explicitly asked to keep sharp ("no confundir candidate provenance con public dataset provenance"). If a future research pass promotes any of the three (new evidence, per the same "promoted candidate" mechanism used in the Characters passes), they would get their first `places.sources.json` entry at that time, not before.

---

## 10. Geographic information

**Zero coordinates, latitude, longitude, or map-derived data anywhere in `places.sources.json`.** Consistent with `PLACE-SCHEMA-REVIEW-001.md` §6/§22 (coordinates deferred from the schema entirely) and `DATASET-RESEARCH-001.md` §9 (map/image copyright stance) — there is nothing to provenance here because nothing geographic was recorded. This is not an oversight; it mirrors the schema's own omission.

---

## 11. Rules for future contributors

1. When a Place candidate is approved and inserted into a future `data/places.json`, its `places.sources.json` entry's `entityIdStatus` must flip from `"provisional"` to `"final"`, and its `entityId` must match the actual inserted `id` exactly — renumber if the final sequential assignment differs from this document's 1–41, exactly as done for Characters in `CHARACTERS-DATASET-001.md`.
2. Never invent a `url` or a `parentId` to fill a gap. Use `null` and explain the gap in `notes`, exactly as done throughout this file (§7).
3. When a candidate's plausible parent is only a shared region label, not an independently confirmed containment relation, say so explicitly — do not silently promote a "co-occurs in the same region" observation into a confirmed `parentId` fact.
4. `LOW`-confidence sources should not be the sole justification for inserting a Place into the public dataset, same rule as Characters (`PROVENANCE-001.md` §11 rule 4).
5. This file is not a place for descriptive prose copied from a source — `notes` stay short and structural, same discipline as Characters.
6. Deferred/Tier 3 candidates get no entry until independently promoted by new research (§9) — do not add a "placeholder" entry for a candidate that hasn't cleared the confidence bar.

---

## 12. Relationship to the public API

Explicit, by name, mirroring `PROVENANCE-001.md` §10 exactly:

- **Not in `src/api/explorerConfig.ts`** — no `places` endpoint, parameter, or resource is declared there; none was added.
- **Not in Swagger** — no `@ApiProperty` or schema annotation exists anywhere for Place or provenance data (there is no Place DTO at all yet).
- **Not in any DTO** — no `PlaceResponseDto` or equivalent exists.
- **Not read by `JsonDataLoader`** — `JsonDataLoader` resolves only from `join(process.cwd(), 'data', fileName)`; `provenance/` sits outside that directory, same as already verified for `characters.sources.json`.
- **Not exposed by any endpoint** — no controller route exists for Places at all yet, let alone one reading from `provenance/`.

---

## 13. Future validator considerations (not implemented)

**RECOMMENDATION only** — `src/tools/dataset-validation/validate-dataset.ts` was not modified. If Places validation is added later (once `data/places.json` and the corresponding schema exist), candidate rules:

- Unique, positive `id` values within `data/places.json` (mirrors the existing Character/Movie/Book/Quote id checks).
- `type` must be one of the 7 approved categories (`region`, `realm`, `settlement`, `fortress`, `landmark`, `geographic feature`, `dwelling`) — reject unknown values, mirroring the "closed-set" validation style `PLACE-SCHEMA-REVIEW-001.md` §14 already recommended for the `type` field itself.
- `parentId`, where non-null, must reference an existing Place `id` (orphan-reference check, same class as the existing Quote→Character/Movie check).
- No self-parent (`parentId !== id`).
- No cycles in the `parentId` chain (A→B→A or longer loops) — a genuinely new validation concern, not needed by any existing resource, since none of the current four resources has a self-referential relation.
- `wikiUrl`, where non-null, structurally valid (reuse the existing `isValidUrl` helper, no new logic needed).
- (Not proposed as mandatory) A duplicate-name warning, mirroring the existing warning-vs-error distinction already used for Character/Movie/Book name duplicates.
- A provenance-layer check mirroring `PROVENANCE-001.md` §13: every `entityId` with `entityIdStatus: "final"` in `places.sources.json` must exist as a real `id` in `data/places.json`.

None of this was implemented. `validate-dataset.ts` and `validate-dataset.spec.ts` are unchanged.

---

## Final report

### Provenance structure
Identical entity-level pattern to `characters.sources.json` — no deviation found necessary. `entityType: "place"`, 41 entities, every entry `entityIdStatus: "provisional"` (no `"final"` entries exist yet, since no `data/places.json` exists).

### Recommended candidate coverage
All 41 recommended candidates from `PLACES-CANDIDATES-001.md` §8 (22 Tier 1 + 19 Tier 2) received an entry. The 3 deferred/Tier 3 candidates (The Prancing Pony, Bag End, Meduseld) received **no entry**, following the same precedent already set for deferred Character candidates.

### Provisional IDs
1–41, sequential, Tier 1 first (1–22) then Tier 2 (23–41), document-internal ordering only — not reserved, not final.

### Confidence distribution
22 `HIGH` (all Tier 1), 19 `MEDIUM` (all Tier 2, with `MEDIUM-HIGH` source values conservatively rounded down), 0 `LOW`.

### Licensing notes
No `REQUIRES LEGAL REVIEW` flags — all recorded data is factual/structured. No descriptive prose anywhere in the file.

### parentId provenance considerations
No `parentId` field exists in this provenance file; every entity's `notes` documents a plausible parent candidate where one is reasonably inferable from `PLACES-CANDIDATES-001.md`'s own Region column/relationship analysis, explicitly caveated as unconfirmed, with an explicit "insert as null unless verified" instruction — or states plainly that no parent candidate was identified. Two cases (Isengard→Rohan, Dale→Erebor) record a relationship that was considered and explicitly rejected, not silently omitted.

### Future validator rules
Documented only (§13): unique/positive id, closed-set `type` check, `parentId` orphan-reference check, no-self-parent, no-cycles, `wikiUrl` structural validity (reusing `isValidUrl`), optional duplicate-name warning, provenance-entityId-exists check. `validate-dataset.ts` not touched.

### API impact
None. Confirmed by name: not in `explorerConfig.ts`, not in Swagger, not in any DTO (none exists), not read by `JsonDataLoader`, not exposed by any endpoint (none exists).

### Files created
- `provenance/places.sources.json` (new) — 41 entries.
- `docs/PLACES-PROVENANCE-001.md` (this file, new).

### Verification
No git repository exists in `lort-api` (consistent with prior sessions) — files created/modified, listed explicitly:
- **Created**: `provenance/places.sources.json`, `docs/PLACES-PROVENANCE-001.md`.
- **Unchanged**: `data/characters.json`, `data/movies.json`, `data/books.json`, `data/quotes.json` (no `data/places.json` exists and none was created), `provenance/characters.sources.json`, all DTOs/controllers/services/repositories, `src/tools/dataset-validation/validate-dataset.ts`, `src/api/explorerConfig.ts`, all frontend files, Swagger annotations, every prior `docs/*.md` file (read-only inputs).

No Place was added to any dataset. No endpoint was created. Stopping here.
