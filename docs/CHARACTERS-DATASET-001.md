# CHARACTERS-DATASET-001 — First Character Expansion, Final Insertion

Status: IMPLEMENTED. `data/characters.json` was modified by this task (19 → 50 records) and `provenance/characters.sources.json` was updated to promote 31 entries from `entityIdStatus: "provisional"` to `"final"`. This document records the concrete decisions made while translating the recommended candidates from `CHARACTERS-CANDIDATES-001.md`, `CHARACTERS-CANDIDATES-002.md`, and `CHARACTERS-CANDIDATES-003.md` into actual public dataset rows.

Existing ids 1–19 were **not** modified — verified field-by-field against the pre-edit file before writing.

---

## Selection

31 new records were inserted, drawn exactly from the three passes' recommended batches:

- Pass 1 recommended batch (19 candidates): all included.
- Pass 2 recommended batch (8 candidates): all included.
- Pass 3 recommended batch (4 candidates): all included.
- **19 + 8 + 4 = 31.** No candidate was added outside these three recommended lists.

**Deferred, not inserted** (per explicit user instruction): the six First Age/Silmarillion candidates gated in `CHARACTERS-CANDIDATES-001.md` §11/§18 — Húrin, Túrin Turambar, Beren, Lúthien, Fëanor, Eärendil. These remain documented in that file, untouched here, and are **not** in `provenance/characters.sources.json` (they were never added to that file either, since it only ever held entries for the 27 pass-1/pass-2 recommended candidates plus the 19 existing).

Also not inserted (were never in any recommended batch, so never a candidate for this task): Glorfindel, Farmer Maggot, Smaug, Shelob, Witch-king of Angmar, Tom Bombadil, Goldberry, Treebeard, Beorn, the remaining sons of Fëanor (Maglor, Celegorm, Caranthir, Curufin, Amrod, Amras), the ~23 unresearched Númenórean kings, and Elu Thingol (referenced only as Melian's dangling `spouse` string).

---

## ID reassignment (provisional → final)

Per instruction, provisional ids from the three research documents were **not** reused as-is. New ids were assigned sequentially from 20, in ascending order of each candidate's original provisional id (ties broken by pass order), producing no gaps in the final 20–50 range.

| Final id | Name | Provisional id (source doc) |
|---:|---|---|
| 20 | Thorin Oakenshield | 20 (Pass 1) |
| 21 | Denethor II | 21 (Pass 1) |
| 22 | Éomer | 22 (Pass 1) |
| 23 | Elendil | 23 (Pass 1) |
| 24 | Isildur | 24 (Pass 1) |
| 25 | Celeborn | 25 (Pass 1) |
| 26 | Thranduil | 26 (Pass 1) |
| 27 | Bard the Bowman | 27 (Pass 1) |
| 28 | Balin | 28 (Pass 1) |
| 29 | Fili | 29 (Pass 1) |
| 30 | Kili | 30 (Pass 1) |
| 31 | Dwalin | 31 (Pass 1) |
| 32 | Radagast | 32 (Pass 1) |
| 33 | Círdan | 34 (Pass 1) |
| 34 | Gríma Wormtongue | 36 (Pass 1) |
| 35 | Barliman Butterbur | 38 (Pass 1) |
| 36 | Elrohir | 39 (Pass 1) |
| 37 | Elladan | 40 (Pass 1) |
| 38 | Anárion | 41 (Pass 1) |
| 39 | Elros | 42 (Pass 2) |
| 40 | Ar-Pharazôn | 43 (Pass 2) |
| 41 | Tar-Míriel | 44 (Pass 2) |
| 42 | Finrod Felagund | 45 (Pass 2) |
| 43 | Turgon | 46 (Pass 2) |
| 44 | Idril | 47 (Pass 2) |
| 45 | Tuor | 48 (Pass 2) |
| 46 | Melian | 49 (Pass 2) |
| 47 | Fingolfin | 50 (Pass 3) |
| 48 | Fingon | 51 (Pass 3) |
| 49 | Maedhros | 52 (Pass 3) |
| 50 | Celebrimbor | 53 (Pass 3) |

---

## Data quality decisions applied at insertion

1. **Never present an inference as fact.** Maedhros's death (`FA 587` in `CHARACTERS-CANDIDATES-003.md`) is explicitly documented there as LORT's own inference from the War of Wrath's dated span, not a directly-quoted source date — inserted as `death: null`, not `"FA 587"`. Ar-Pharazôn's and Tar-Míriel's death year has an unresolved source conflict (SA 3319 vs SA 3310) — inserted as `death: null` in both records rather than picking one.
2. **Era-only values are acceptable, mirroring existing precedent.** Existing `Elrond` (id 12) already uses `birth: "First Age"` with no exact year. New records with a known era but no exact year use the same convention (`"First Age"`, `"Years of the Trees"`) rather than `null`, when the era itself was clearly stated in the source docs (Finrod Felagund, Turgon, Idril, Tuor, Fingon's death). Where even the era was not clearly established, `null` was used (e.g. Thranduil, Bard the Bowman, Círdan, Gríma Wormtongue, Barliman Butterbur birth/death).
3. **Race normalized to the dataset's existing plain convention.** Candidate docs sometimes wrote `"Human (Númenórean)"`; the live dataset has never used sub-race qualifiers (existing 19 use plain `"Human"`, `"Elf"`, `"Dwarf"`, `"Hobbit"`, `"Maia"`) — new records follow that precedent (`"Human"` for Elendil, Isildur, Anárion, Elros, Ar-Pharazôn, Tar-Míriel, Tuor, etc.).
4. **Half-elven resolved per the schema review's decision (`CHARACTER-SCHEMA-REVIEW-001.md` §8/§9, question 8): follow the Elrond precedent, record the chosen fate.** Elros chose mortality → `race: "Human"`. This mirrors how Elrond (chose the Elves) already has `race: "Elf"`. No new field was added; this is a modeling choice, documented as such in provenance, not asserted as settled canon.
5. **`hair` and `height` are `null` for all 31 new records.** None of the three research passes captured hair-color or height data for any candidate (their candidate tables never had those columns) — rather than leave the field silently absent or invent a value, every new record explicitly sets `hair: null, height: null`, consistent with the schema's nullable-field contract.
6. **`wikiUrl` is `null` for all 31 new records.** Per instruction ("si no se puede verificar una URL: dejar null"), no `wikiUrl` was carried into the public dataset from the research docs, even where a specific Tolkien Gateway URL was noted there (e.g. Elros, Fingolfin, Fingon, Celebrimbor) — those pages were never independently re-fetched and confirmed live during this insertion task, only referenced in prior research passes (one of which explicitly recorded that direct `WebFetch` to `tolkiengateway.net` returned HTTP 403). The candidate URLs remain recorded in `provenance/characters.sources.json` for a future verification pass, but are not asserted as verified in the public API response.
7. **Bidirectional spouse pairs mirror the existing free-text convention**, not a new relation mechanism (schema review concluded `spouse` stays free-text, deferred). Celeborn (25) ↔ Galadriel (7), Ar-Pharazôn (40) ↔ Tar-Míriel (41), Idril (44) ↔ Tuor (45) — each side's `spouse` string names the other by given name, matching the existing pattern (e.g. Aragorn ↔ Arwen, Faramir ↔ Eowyn). Melian's `spouse: "Elu Thingol"` remains a dangling free-text reference with no corresponding Character record — documented, not resolved, matching the same tolerance already present in the existing dataset (e.g. Samwise's `spouse: "Rosie Cotton"` has no own record).
8. **No workaround for known hard schema gaps.** No candidate resembling Witch-king/Bombadil/Goldberry was in any recommended batch, so none was inserted; the schema review's conclusion stands unchallenged.
9. **Special entities (Ainur).** Radagast (32) and Melian (46) both use `race: "Maia"`, consistent with the existing pattern already live for Gandalf (2), Sauron (14), and Saruman (15) — Model B (classification on Character, no separate resource), per `DATASET-RESEARCH-001.md`. No Character was duplicated.
10. **Canonical names shortened for dataset-convention consistency.** `"Elros (Tar-Minyatur)"` → `"Elros"`; `"Idril (Celebrindal)"` → `"Idril"` — the live dataset consistently uses given names without parenthetical epithets (cf. `"Aragorn II Elessar"` is the one existing exception, itself already a plain regnal name, not an epithet).

---

## Deferred

- **First Age gate (pass 1's 6 candidates)**: Húrin, Túrin Turambar, Beren, Lúthien, Fëanor, Eärendil — remain gated on an explicit scope decision not made in this task. Not inserted.
- **Remaining sons of Fëanor**: Maglor, Celegorm, Caranthir, Curufin, Amrod, Amras — not researched in any pass, not inserted.
- **Remaining Númenórean kings** (~23 of 25): not researched, not inserted.
- **Elu Thingol**: referenced only as Melian's `spouse` string; never independently researched or added as his own Character.
- **Tier 3 entities from pass 1**: Glorfindel (identity conflict), Farmer Maggot (thin data), Smaug, Shelob, Witch-king of Angmar, Tom Bombadil, Goldberry — all schema-gap or confidence exclusions, not inserted.

---

## Provenance

- 19 existing entries: unchanged, remain `entityIdStatus: "final"`.
- 31 promoted entries: `entityIdStatus` changed from `"provisional"` to `"final"`, `entityId` updated to match the new sequential final id (see mapping table above), source metadata retained from the originating research pass with an added note recording the id renumbering.
- **Total provenance entries: 50 final, 0 provisional.** No dangling provisional entries were left for deferred candidates, because none of the deferred candidates were ever added to `provenance/characters.sources.json` in the first place (that file only ever tracked the 27 candidates that were, in fact, all approved and inserted in this task).

---

## Files changed

- `data/characters.json` — modified (19 → 50 records; ids 1–19 unchanged).
- `provenance/characters.sources.json` — modified (31 entries promoted provisional → final).
- `docs/CHARACTERS-DATASET-001.md` — created (this file).

No other file was modified.
