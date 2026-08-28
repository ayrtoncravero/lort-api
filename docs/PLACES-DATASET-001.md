# PLACES-DATASET-001 — First Places Dataset, Final Insertion

Status: IMPLEMENTED (dataset + validator only). `data/places.json` was created (41 records) and `provenance/places.sources.json` was updated (all 41 entries promoted `provisional` → `final`). The dataset validator (`src/tools/dataset-validation/validate-dataset.ts` + its spec) was extended to validate Places. **No API module, controller, service, repository, DTO, `explorerConfig.ts`, Swagger, or frontend change was made** — Places is not yet reachable via any endpoint, by design.

Characters (50), Movies (6), Books (5), Quotes (8) were **not modified**.

---

## Dataset

**Places = 41.**

All 41 candidates from the recommended batch (Tier 1: 22 + Tier 2: 19) in `PLACES-CANDIDATES-001.md` §8 were inserted. Per the user's explicit instruction ("si los 41 son suficientemente buenos y no existe una razón objetiva para excluir uno, se puede justificar mantener 41"), no candidate was dropped just to force a round 40 — every entry already cleared the MEDIUM/HIGH confidence bar and had no schema-fit or identity problem, so excluding one arbitrarily would have been the actual arbitrary act.

Provisional ids in `provenance/places.sources.json` were already sequential 1–41 with no gaps or reservations, so no renumbering was needed — final ids match provisional ids exactly (documented explicitly, not assumed).

## IDs

| id | name | type | parentId |
|---:|---|---|---:|
| 1 | The Shire | realm | null |
| 2 | Gondor | realm | null |
| 3 | Arnor | realm | null |
| 4 | Rohan | realm | null |
| 5 | Mordor | realm | null |
| 6 | Rivendell | settlement | null |
| 7 | Lothlorien | realm | null |
| 8 | Erebor | realm | null |
| 9 | Isengard | realm | null |
| 10 | Woodland Realm | realm | null |
| 11 | Bree | settlement | null |
| 12 | Dale | settlement | null |
| 13 | Moria | realm | null |
| 14 | Grey Havens | settlement | 37 (Lindon) |
| 15 | Eregion | realm | null |
| 16 | Numenor | realm | null |
| 17 | Minas Tirith | settlement | 2 (Gondor) |
| 18 | Osgiliath | settlement | 2 (Gondor) |
| 19 | Mount Doom | landmark | 5 (Mordor) |
| 20 | Helm's Deep | fortress | 4 (Rohan) |
| 21 | Beleriand | region | null |
| 22 | Eriador | region | null |
| 23 | Gondolin | realm | null |
| 24 | Nargothrond | realm | null |
| 25 | Doriath | realm | null |
| 26 | Himring | fortress | null |
| 27 | Minas Morgul | settlement | null |
| 28 | Barad-dur | fortress | 5 (Mordor) |
| 29 | Orthanc | fortress | 9 (Isengard) |
| 30 | Fangorn Forest | geographic feature | null |
| 31 | Weathertop | landmark | null |
| 32 | Hobbiton | settlement | 1 (The Shire) |
| 33 | Amon Hen | landmark | null |
| 34 | Cirith Ungol | landmark | null |
| 35 | Edoras | settlement | 4 (Rohan) |
| 36 | Ithilien | region | null |
| 37 | Lindon | region | null |
| 38 | Anduin | geographic feature | null |
| 39 | Misty Mountains | geographic feature | null |
| 40 | Rhovanion | region | null |
| 41 | Valinor | realm | null |

Every record has `wikiUrl: null` — no URL from the research passes was independently re-verified/re-fetched during this insertion task (same discipline already applied for `CHARACTERS-DATASET-001.md`'s 31 new Characters), so none was carried into the public dataset even where a candidate URL was noted in provenance.

## Categories

| type | count |
|---|---:|
| realm | 16 |
| settlement | 9 |
| region | 5 |
| landmark | 4 |
| fortress | 4 |
| geographic feature | 3 |
| dwelling | 0 (all 3 dwelling candidates were Tier 3 deferred, not inserted) |

**Normalization note**: `PLACES-CANDIDATES-001.md` §4 (per-candidate) and §14 (category-set summary) occasionally gave different type suggestions for the same candidate (e.g. Isengard: §4 wrote "fortress/realm", §14's `realm` list explicitly includes Isengard; Himring: §4 wrote plain "fortress", §14's `realm` list also includes it). Where the two disagreed, this task followed §14 for Isengard (its explicit categorization pass) and §4 for Himring (its unambiguous single-value candidate-row entry), since §14 itself had a minor internal count mismatch (claimed "6" region candidates but named 5, and omitted The Shire and Lothlórien from any list entirely) — treated as a known clerical gap in the source document, not something to silently paper over. The Shire and Lothlórien were assigned `realm` per their own unambiguous §4 row values.

## Hierarchy

**9 `parentId` relationships set**, all requiring the source notes to describe a "clearly established containment" (not merely a shared free-text "Region" column value, which the research documents themselves distinguish from a confirmed formal relation):

- Minas Tirith → Gondor (capital city)
- Osgiliath → Gondor (former capital)
- Mount Doom → Mordor
- Helm's Deep → Rohan
- Barad-dûr → Mordor
- Orthanc → Isengard
- Hobbiton → The Shire
- Edoras → Rohan (capital city)
- Grey Havens → Lindon (explicitly named in `PLACES-CANDIDATES-001.md` §11 as the strongest parent candidate in the batch)

**32 records have `parentId: null`**, including every top-level realm/region (Gondor, Rohan, Mordor, The Shire, Eriador, Beleriand, Rhovanion, Lindon, etc.) and every case where the provenance notes explicitly flagged the relationship as unconfirmed, a mere co-occurring region label, or actively rejected:

- Isengard was explicitly **not** given `parentId: 4` (Rohan) — the provenance note for Isengard states it is "politically independent of Rohan... despite geographic proximity," and the instruction not to infer containment from adjacency alone was followed literally.
- Dale was explicitly **not** given `parentId: 8` (Erebor) — "a distinct, independently-ruled settlement, not contained within Erebor," per its provenance note.
- Region-level entities that merely share a "Region" table column with other candidates (e.g. The Shire/Arnor/Rivendell/Bree/Eregion all list "Eriador" in that column) were **not** auto-linked to Eriador — the research documents themselves distinguish this from a confirmed formal relation ("only a co-occurring region label... not independently confirmed"), and the task instruction was explicit: no inventing a hierarchy from adjacency or shared labeling.

No self-references, no cycles — verified both by the validator's automated check (see below) and manually during construction.

## Deferred

The 3 Tier 3 candidates from `PLACES-CANDIDATES-001.md` §8 were **not** inserted, per the default (no new evidence was found or introduced in this task to justify overriding that deferral):

- **The Prancing Pony** — dwelling/inn, sub-location of Bree; thin structured data beyond being a named scene location.
- **Bag End** — dwelling, sub-location of Hobbiton; iconic but a single smial, arguably too fine-grained for a V1 Place peer-record.
- **Meduseld** — dwelling/hall, sub-location of Edoras; LOW-MEDIUM confidence, the closest of the three to the confidence floor.

None of the three ever had a `provenance/places.sources.json` entry (that file only ever tracked the 41 recommended candidates), so no dangling provisional provenance record exists for them.

## Provenance

- **41 final, 0 provisional.** All entries in `provenance/places.sources.json` were promoted from `entityIdStatus: "provisional"` to `"final"`.
- Since provisional ids already matched the final sequential 1–41 range, no `entityId` renumbering was needed (unlike the Characters insertion, which did require renumbering) — this was verified, not assumed.
- The top-level `schemaNote` was updated to reflect that `data/places.json` now exists (still explicitly stating no Places API/controller/service/repository/DTO exists).
- Confidence values were carried over unchanged (22 HIGH, 19 MEDIUM) — none elevated.
- No licensing concern was flagged; all inserted data is factual/structured (name, type, parent relationship where established) — no descriptions, no coordinates, no copied prose.

## Validator

`src/tools/dataset-validation/validate-dataset.ts` extended with:

- A local `Place` interface (`id`, `name`, `type`, `parentId`, `wikiUrl`) — no API domain entity exists yet, so this type is intentionally scoped to the validator, documented as such in a comment, until a real Places module is built.
- `PLACE_TYPES` — the closed set of 7 categories (`region`, `realm`, `settlement`, `fortress`, `landmark`, `geographic feature`, `dwelling`) approved in `PLACE-SCHEMA-REVIEW-001.md`.
- `checkPlaceType` — rejects missing/non-string/not-in-the-closed-set values.
- `checkPlaceParentHierarchy` — validates `parentId` is null or a positive integer referencing an existing Place id, rejects self-reference (`parentId === id`), and walks the parent chain to detect cycles of any length (not just direct 2-node cycles).
- `id`/`name` reuse the existing `checkId`/`checkRequiredString` helpers (no duplication).
- `wikiUrl` reuses the existing nullable-string + `isValidUrl` structural check.
- Duplicate-name detection reuses the existing `checkDuplicateNames` helper (warning, not error).
- `DatasetInput`/`ValidationResult` extended with `places`/`places: number` respectively; `ResourceName` extended with `'places'`.
- The CLI wrapper (`scripts/validate-dataset.ts`) now loads `places.json` and prints its count in the summary.

No new dependency was introduced. The pure-function-plus-CLI-wrapper architecture was preserved exactly; no I/O was added inside `validateDataset`.

## Tests

14 new Place-specific tests added (`describe('places', ...)` block) covering exactly the 14 cases requested: valid dataset, invalid id, duplicate id, invalid type, missing name, empty/whitespace name, invalid parentId, orphan parentId, self-parent, cycle, null parentId, invalid wikiUrl, valid nullable wikiUrl, duplicate-name warning.

One additional "real dataset" test loads all 5 actual JSON files from disk via `fs.readFileSync` (not hardcoded fixtures) and asserts: zero validation errors, and that `result.counts` exactly matches each file's real `.length` — with only `characters`/`movies`/`books`/`quotes` pinned to their known-stable values (50/6/5/8); `places` is asserted only via the derived-count equality, never hardcoded to 41, so the test doesn't need updating if Places grows later.

All prior tests preserved unchanged (`baseDataset()` now includes one `place` fixture so every pre-existing test continues to exercise a Place-inclusive dataset without needing individual edits).

**Result: 7 suites / 45 tests passed** (17 pre-existing + 14 Place-specific + 1 real-dataset + duplicated top-level "valid dataset"/"counts" assertions extended in place, not duplicated as new tests).

## Quality

- `pnpm lint` — clean.
- `pnpm exec tsc --noEmit` — clean.
- `pnpm build` — clean.

## Regression

Runtime-verified with the API running on a local port:

- `GET /api/characters` → total 50 (unchanged).
- `GET /api/movies` → total 6 (unchanged).
- `GET /api/books` → total 5 (unchanged).
- `GET /api/quotes` → total 8 (unchanged).
- `GET /api/places` → **404** (expected — no Places API exists; confirms this task did not accidentally wire up an endpoint).

`pnpm test:e2e` — 3 suites / 10 tests passed, unaffected.

## Files changed

- `data/places.json` — created (41 records, ids 1–41).
- `provenance/places.sources.json` — modified (41 entries promoted provisional → final; `schemaNote` updated).
- `src/tools/dataset-validation/validate-dataset.ts` — modified (Place type, `PLACE_TYPES`, `checkPlaceType`, `checkPlaceParentHierarchy`, integrated into `validateDataset`, `DatasetInput`/`ValidationResult`/`ResourceName` extended).
- `src/tools/dataset-validation/validate-dataset.spec.ts` — modified (`place` fixture added to `baseDataset()`, 14 new Place tests, 1 new real-dataset test).
- `scripts/validate-dataset.ts` — modified (loads `places.json`, prints Places count) — necessary for the CLI to actually validate the new resource.
- `docs/PLACES-DATASET-001.md` — created (this file).

No API module, controller, service, repository, DTO, `explorerConfig.ts`, Swagger definition, or frontend file was created or modified. No `data/characters.json`, `data/movies.json`, `data/books.json`, or `data/quotes.json` change. No Ainur or Peoples work started.
