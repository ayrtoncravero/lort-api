# PROVENANCE-001 — Internal Dataset Provenance Structure

Status: this document DOES accompany real, non-code repository files: `provenance/characters.sources.json` (new) and this document (new). Nothing else was created, modified, or deleted. No JSON under `data/`, no DTO, controller, service, repository, frontend file, `explorerConfig.ts`, or Swagger annotation was touched. No new Character was added to `data/characters.json`. No dataset validator code (`src/tools/dataset-validation/validate-dataset.ts`) was touched.

Labeling convention (unchanged from prior documents): **FACT**, **SOURCE CLAIM**, **INFERENCE**, **RECOMMENDATION**.

This document builds on `docs/DATASET-RESEARCH-001.md` (§15, original provenance proposal), `docs/CHARACTERS-CANDIDATES-001.md` (§16), `docs/CHARACTERS-CANDIDATES-002.md` (§13), and `docs/CHARACTER-SCHEMA-REVIEW-001.md`. Their conclusions are treated as already established.

---

## 1. Purpose

**RECOMMENDATION, now implemented as a real file (not just proposed):** `provenance/` gives LORT a place to record *where a data point came from* — separately from the dataset itself. This exists so that:

- Every character eventually inserted into `data/characters.json` has an auditable source trail from the moment it is added, rather than sourcing being reconstructed retroactively (which the project has explicitly refused to do for the existing 19 — see §5).
- Unresolved source conflicts (e.g. Ar-Pharazôn's death year, disputed between `SA 3319` and `SA 3310` — see `CHARACTERS-CANDIDATES-002.md` §5) have a durable place to live as an explicit note, instead of being silently averaged away or lost.
- Licensing/redistribution notes about a data point's origin (fair use of a fact vs. copyrighted text — see `DATASET-RESEARCH-001.md` §14) travel with the record, without turning the repository into a legal document store.

**FACT:** No existing repository structure served this purpose before this task — `find` across the repo (excluding `node_modules`/`dist`) found no prior `provenance/`-equivalent directory.

---

## 2. Structure

### Chosen shape: entity-level, not per-field

```json
{
  "entityType": "character",
  "schemaNote": "Internal repository metadata. NOT part of the public API...",
  "entities": [
    {
      "entityId": 20,
      "entityIdStatus": "provisional",
      "name": "Thorin Oakenshield",
      "sources": [
        {
          "name": "Tolkien Gateway (via search-result synthesis — ...)",
          "url": null,
          "confidence": "HIGH",
          "notes": "..."
        }
      ]
    }
  ]
}
```

**RECOMMENDATION, decided:** entity-level `sources[]` (one or more sources per character), not a per-field structure (`{"field": "birth", "source": "..."}` for every individual field). Justification:

- The project's own research documents already demonstrate that per-candidate sourcing is naturally entity-granular in practice: a single Tolkien Gateway page (or search-synthesis result) typically supplies name, race, dates, and realm together as one coherent fact-set, not field-by-field from independent pages.
- Per-field provenance is justified when different fields of the *same* entity routinely come from *materially different, independently-verified* sources (e.g. one source for identity, a different one for a disputed date). That situation is rare in the current research — the one clear case (Ar-Pharazôn/Tar-Míriel's date conflict) is captured adequately as a **note within a single entity-level source entry**, not by splintering the record into per-field source objects.
- Per-field provenance is meaningfully more complex to write, validate, and keep in sync, for a dataset currently sized at 19 live + at most 46 potential records. **INFERENCE:** the added structure would not currently pay for itself — this is the same minimal-schema principle the project applied to the public `Character` schema in `CHARACTER-SCHEMA-REVIEW-001.md` §10, applied here to internal tooling instead.
- Nothing in this structure prevents a *future* migration to per-field sourcing if the dataset grows enough that entity-level sourcing becomes ambiguous (e.g. a character whose birth year and death year come from two contradicting, independently-cited pages) — `sources[]` already being an array (not a single object) leaves room to add multiple source entries per entity today, and a `field` key could be added to individual source objects later without breaking the shape.

### `entityIdStatus`

Added one field beyond the user's example structure: `entityIdStatus: "final" | "provisional"`. **RECOMMENDATION:** this directly encodes the distinction the user repeatedly required across three prior documents — the 19 existing ids are final, the 20–49 candidate ids are *not* final until a candidate is actually approved and inserted. Without this field, a reader of the raw JSON has no machine-readable way to tell a stable id from a provisional one; embedding it removes any risk of the two being confused later.

---

## 3. Source metadata fields

Each `sources[]` entry:

| Field | Required | Purpose |
|---|---|---|
| `name` | Yes | Human-readable source identifier (e.g. "Tolkien Gateway", "Fandom LOTR Wiki (lotr.fandom.com)"). |
| `url` | Yes (nullable) | The actual page, if one was independently verified/cited in a prior document. `null` where no URL was verified — never fabricated (see §7). |
| `confidence` | Yes | `HIGH` \| `MEDIUM` \| `LOW`. |
| `notes` | Yes | Free-text: what the source established, what it didn't, any unresolved conflicts, any modeling choices this source informed. |
| `accessedAt` | No | ISO date string, only where an actual access date is known. |

### `accessedAt` — evaluated, kept as optional

**RECOMMENDATION, decided:** keep `accessedAt`, but as optional, not required. It has real value for a dataset built from web sources that can change (a wiki page can be edited after the fact) — knowing *when* a source was read lets a future maintainer judge whether it's worth re-checking. It was **not** backfilled for the existing 19 characters' entries (§5) or for most Pass-1 candidates (§6), because the actual access date for that research is not reliably known field-by-field across two different prior documents — inventing a date would violate the same "don't invent" discipline applied to sources and URLs. It **was** populated (`"2026-08-28"`) for the Pass-2 candidates, because that pass's research happened in a single, dated session this same day and the date is genuinely known — not a fabrication.

---

## 4. Confidence levels

`HIGH` / `MEDIUM` / `LOW`, consistent with the three-value scale already used across all four prior research documents.

**Per instruction:** `LOW` is excluded from anything actually intended to enter the dataset. Concretely: none of the 27 recommended-batch candidates (19 from Pass 1 + 8 from Pass 2) carry `LOW` in `provenance/characters.sources.json` — Pass 1's `LOW`/`LOW-MEDIUM` candidates (Glorfindel, Farmer Maggot, Smaug, Shelob, Witch-king, Tom Bombadil, Goldberry) were never in the recommended batch and have **no entry** in this provenance file at all (they were not "demoted" or given a `LOW` entry — they simply aren't represented yet, consistent with them not being candidates for insertion).

**Normalization note (FACT):** the two candidate documents used a five-value scale in places (`HIGH`, `MEDIUM-HIGH`, `MEDIUM`, `LOW-MEDIUM`, `LOW`) that this three-value provenance schema doesn't carry directly. Every `MEDIUM-HIGH` value from the source documents was rounded **down** to `MEDIUM` in `characters.sources.json` (conservative direction — never rounded up), with a note preserving the original label so no information is lost, only compressed.

---

## 5. Existing 19 — what provenance could honestly be established

**FACT, per instruction §2 ("Los 19 Characters actuales NO necesitan ser completamente migrados... Si la provenance de un registro existente no puede establecerse con confianza: documentarlo"):** no history was invented for the existing 19.

What was actually recorded for each of the 19: their existing `wikiUrl` field (already present in `data/characters.json`, all pointing to `lotr.fandom.com`) is the **only** source currently traceable for each record. This was captured as one `MEDIUM`-confidence source entry per existing character (not `HIGH`, because a link alone does not establish that every field value — `birth`, `death`, `spouse`, etc. — was individually verified against it), with an explicit note stating that the original field-by-field sourcing predates this provenance system and **is not established retroactively**.

No `accessedAt` was added for these 19 — the actual date any of them was first sourced is unknown, and inventing one would be exactly the kind of fabrication this task prohibits.

**RECOMMENDATION:** if the project later wants stronger provenance for the existing 19 (not required now), that would mean *independently re-verifying* each field against a source, at which point it stops being "documentation of existing gaps" and becomes new research — out of scope here.

---

## 6. Candidate coverage (Pass 1 + Pass 2)

All **27** candidates in the two prior documents' recommended batches (19 from `CHARACTERS-CANDIDATES-001.md` §11 + 8 from `CHARACTERS-CANDIDATES-002.md` §9) received a `provenance/characters.sources.json` entry, `entityIdStatus: "provisional"`, using only sourcing already recorded in those two documents — no new research was performed for this task (per instruction §9).

- **19 Pass-1 candidates:** all sourced as `"Tolkien Gateway (via search-result synthesis — direct WebFetch to tolkiengateway.net returned HTTP 403...)"`, `url: null` throughout — because `CHARACTERS-CANDIDATES-001.md` §7/§9 explicitly states no URL was independently verified in that pass ("Assigning a `lotr.fandom.com` or `tolkiengateway.net` URL without having verified the exact page in this pass would risk introducing an unverified link"). Carrying that discipline forward here: no URL was invented to fill the gap.
- **8 Pass-2 candidates:** sourced as `"Tolkien Gateway"`, with **one** URL populated — `https://tolkiengateway.net/wiki/Elros` (candidate 42) — because that is the one URL `CHARACTERS-CANDIDATES-002.md` §13 itself already wrote down, with its own caveat that the page wasn't independently re-fetched line-by-line. That caveat was preserved in the `notes` field, not dropped. The other 7 Pass-2 candidates: `url: null`, same reasoning as Pass 1.
- Candidates **excluded** from the recommended batch (Tier 3 in both passes: Glorfindel, Farmer Maggot, Smaug, Shelob, Witch-king of Angmar, Tom Bombadil, Goldberry) have **no entry** in `characters.sources.json` — they are not part of the dataset-expansion plan being provenance-prepared right now, so provenance for them would be premature and was not written.

Total entries in `provenance/characters.sources.json`: **46** (19 existing + 19 Pass-1 recommended + 8 Pass-2 recommended).

---

## 7. URLs — discipline applied

No URL in `characters.sources.json` was invented. Every URL present (the 19 existing `wikiUrl` values, plus the single Elros URL from Pass 2) already existed in a file this task read (`data/characters.json` or `CHARACTERS-CANDIDATES-002.md`). No scraping, no mass verification requests, no live-link checks were performed to produce this file — consistent with the instruction not to do so.

---

## 8. Licensing / redistribution notes

Per `DATASET-RESEARCH-001.md` §14 and both candidate documents' §8, every entry so far represents **factual, structured data** (names, dates, realms, family/reign relationships) — not copyrighted prose. No entry in `characters.sources.json` needed a `REQUIRES LEGAL REVIEW` flag. The provenance structure supports adding such a flag inside an entry's `notes` field if a future entity's sourcing does raise that concern (e.g. if a future field is ever populated from a source's *descriptive text* rather than extracted facts) — this is a **capability of the notes field**, not a separate schema element, keeping the structure from becoming "a legal system," per instruction §7.

---

## 9. Relationship to the dataset

`provenance/characters.sources.json` is **not** read by `JsonDataLoader`, not referenced by any repository/service/controller, and not loaded at runtime in any code path. **FACT, verified:** `src/infrastructure/json/json-data-loader.ts` resolves files from `join(process.cwd(), 'data', fileName)` only — `provenance/` sits outside that directory and is never passed to `.load()`. The dataset (`data/*.json`) and its provenance (`provenance/*.json`) are two separate files with no code-level link between them; the link is documentary (an entity's `id` matches its `entityId`), maintained by convention and, eventually, by validator rules (§13), not by the running application.

---

## 10. Relationship to the public API

Explicit, by name, per instruction §11:

- **Not in `src/api/explorerConfig.ts`** (frontend) or its backend equivalent — no endpoint, parameter, or resource references provenance.
- **Not in Swagger** — no `@ApiProperty` or schema annotation was added anywhere for provenance data.
- **Not in any DTO** — `CharacterResponseDto` (or equivalent) is untouched; provenance fields are not nested into or alongside any Character response.
- **Not exposed by any endpoint** — no controller route reads from or returns `provenance/`.

`provenance/` is **repository metadata**, consumed by humans (contributors, reviewers) and, potentially in the future, by the dataset validator (§13) — never by an HTTP response.

---

## 11. Rules for future contributors

1. When a new Character is approved and inserted into `data/characters.json`, its `provenance/characters.sources.json` entry's `entityIdStatus` must flip from `"provisional"` to `"final"`, and its `entityId` must match the actual inserted `id` exactly (if the final id differs from the provisional one used during research, update `entityId` — do not leave a stale provisional id pointing at the wrong record).
2. Never invent a `url`, `accessedAt`, or fact to fill a gap. Use `null` (for `url`) or omit the field (for `accessedAt`) and explain the gap in `notes`, exactly as done throughout this file.
3. When a source conflicts with another (dates, spelling, identity), record the conflict explicitly in `notes` — do not average, guess, or silently pick one.
4. `LOW` confidence sources should not be the sole justification for actually inserting a character into the public dataset (per §4) — they may still be recorded (e.g. for a Tier 3 candidate under future research), just not treated as insertion-ready.
5. This file is **not** a place for descriptive prose copied from a source. `notes` should stay short and structural, consistent with every prior document's "no copiar párrafos" discipline.

---

## 12. Future resources — scope of this task

Only `characters` was prepared (`provenance/characters.sources.json`). **No** placeholder files were created for `movies`, `books`, `quotes`, `places`, `peoples`, or `ainur` — per instruction §13, an empty file with no real content would not be useful and was explicitly discouraged. If/when those resources are researched and expanded, the same entity-level structure documented here (§2) is intended to extend to them directly: `provenance/movies.sources.json`, `provenance/books.sources.json`, etc., each with `entityType` set accordingly — not designed here, just left as a clear, unforced extension point.

---

## 13. Future validator considerations (not implemented)

**RECOMMENDATION only** — `src/tools/dataset-validation/validate-dataset.ts` was not modified as part of this task. If provenance validation is added later, candidate rules (mirroring the existing validator's style of pure-function, non-runtime checks):

- Every `entityId` with `entityIdStatus: "final"` must exist as a real `id` in the corresponding `data/*.json` file (orphan-provenance check, the mirror image of the existing Quote→Character/Movie orphan-reference check).
- Every `url`, where non-null, should be structurally valid (the existing validator already has `isValidUrl` for `wikiUrl` — the same helper could be reused here without duplicating logic).
- `confidence` must be one of exactly `"HIGH" | "MEDIUM" | "LOW"`.
- No duplicate `entityId` within the same `entities[]` array for a given `entityType`.
- (Not proposed as mandatory, flagged only as a possible future rule) A character with `entityIdStatus: "final"` and zero `sources[]` entries could be flagged as a warning, not an error — mirroring the existing validator's warning-vs-error distinction for duplicate names.

None of this was implemented. `validate-dataset.ts` and `validate-dataset.spec.ts` are unchanged.

---

## Final report

### Provenance structure
Entity-level (not per-field) `sources[]` array under `provenance/characters.sources.json`, keyed by `entityId` + `entityIdStatus` (`"final"` | `"provisional"`). Justification: current dataset size doesn't justify per-field granularity; entity-level sourcing already matches how the prior research documents actually gathered facts (one source informing several fields at once); source conflicts are captured in `notes` on a single source entry rather than requiring a field-by-field structure.

### Files created
- `provenance/characters.sources.json` (new) — 46 entries.
- `docs/PROVENANCE-001.md` (this file, new).

No other file created, modified, or deleted.

### Candidate coverage
All 27 recommended-batch candidates from `CHARACTERS-CANDIDATES-001.md` (19) and `CHARACTERS-CANDIDATES-002.md` (8) have a provisional entry. Tier-3/deferred candidates from both passes (Glorfindel, Farmer Maggot, Smaug, Shelob, Witch-king, Tom Bombadil, Goldberry) have no entry — not part of the current insertion plan.

### Existing dataset coverage
All 19 existing characters have an entry, `entityIdStatus: "final"`, sourced only from their already-present `wikiUrl` field at `MEDIUM` confidence, with an explicit note that field-level provenance predating this system is not established retroactively — nothing was invented.

### Confidence model
Three-level `HIGH`/`MEDIUM`/`LOW`, matching prior documents. `LOW` excluded from anything in the recommended batch. Five-level source labels (`MEDIUM-HIGH`, `LOW-MEDIUM`) from the candidate documents were conservatively rounded down, with the original label preserved in `notes`.

### Licensing notes
No entry required a `REQUIRES LEGAL REVIEW` flag — every currently-provenanced fact is structured/factual data per the established `DATASET-RESEARCH-001.md` §14 distinction. The `notes` field can carry such a flag in the future without a schema change.

### Public API impact
None. Confirmed by name: not in `explorerConfig.ts`, not in Swagger, not in any DTO, not exposed by any endpoint, not read by `JsonDataLoader` or any runtime code path.

### Validator future considerations
Documented only (§13) — entityId-exists check, URL structural validity (reusing the existing `isValidUrl` helper), confidence-enum check, no-duplicate-entityId check, optional zero-sources warning. `validate-dataset.ts` not modified.

### Verification
No git repository exists in `lort-api` — files created/modified, listed explicitly:
- **Created:** `provenance/` (directory), `provenance/characters.sources.json`, `docs/PROVENANCE-001.md`.
- **Unchanged (verified by not touching):** `data/characters.json`, `data/movies.json`, `data/books.json`, `data/quotes.json`, all DTOs/controllers/services/repositories, `src/tools/dataset-validation/validate-dataset.ts`, all frontend files, `src/api/explorerConfig.ts`, Swagger annotations, every prior `docs/*.md` file (read-only inputs).

No Characters were added to `data/characters.json`. Stopping here.
