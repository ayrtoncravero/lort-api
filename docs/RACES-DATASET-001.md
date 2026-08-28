# RACES-DATASET-001 — Races Dataset Insertion

Status: DATASET + PROVENANCE + VALIDATION insertion. NOT an API implementation. `GET /api/races` returns 404 (no route exists) — expected. `data/characters.json`, `data/places.json`, and all API modules/frontend files are untouched.

Source documents: `docs/RACES-CANDIDATES-001.md` (24 researched, 19 recommended), `docs/RACE-SCHEMA-REVIEW-001.md` (Model C schema, approved).

---

## 1. Selected candidates (19 of 19 recommended, all inserted)

All 19 Tier 1 + Tier 2 candidates from `RACES-CANDIDATES-001.md` §8 were inserted without exception — no objective incompatibility surfaced during implementation.

## 2. Excluded candidates (Tier 3, per research, not re-decided here)

- **Half-elven** — a classification, not a biological race (schema gap by design; covered conceptually elsewhere).
- **Great Eagles / Dragons / Great Spiders** — one-off animal-adjacent kinds, no population/subgroup structure.
- **Maiar/Valar (Ainur)** — out of scope, covered by `docs/GODS-CANDIDATES-001.md` / future Ainur work.

## 3. Final IDs

| id | name | type | parentId |
|---|---|---|---|
| 1 | Men | major-race | null |
| 2 | Elves | major-race | null |
| 3 | Dwarves | major-race | null |
| 4 | Hobbits | major-race | null |
| 5 | Dunedain | subgroup | 1 (Men) |
| 6 | Rohirrim | subgroup | 1 (Men) |
| 7 | Noldor | subgroup | 2 (Elves) |
| 8 | Longbeards | subgroup | 3 (Dwarves) |
| 9 | Ents | major-race | null |
| 10 | Orcs | major-race | null |
| 11 | Trolls | major-race | null |
| 12 | Sindar | subgroup | 2 (Elves) |
| 13 | Silvan Elves | subgroup | 2 (Elves) |
| 14 | Vanyar | subgroup | 2 (Elves) |
| 15 | Teleri | subgroup | 2 (Elves) |
| 16 | Harfoots | subgroup | 4 (Hobbits) |
| 17 | Stoors | subgroup | 4 (Hobbits) |
| 18 | Fallohides | subgroup | 4 (Hobbits) |
| 19 | Uruk-hai | subgroup | 10 (Orcs) |

Ids assigned sequentially 1–19; no renumbering was needed against the research document (candidates were inserted in Tier 1 → Tier 2 order from `RACES-CANDIDATES-001.md` §8, with major races listed first within each tier for readability). Research-document candidate order is not itself an id — final ids are defined only by this document and `data/races.json`.

## 4. Type distribution

`major-race`: 7 (Men, Elves, Dwarves, Hobbits, Ents, Orcs, Trolls)
`subgroup`: 12 (Dunedain, Rohirrim, Noldor, Longbeards, Sindar, Silvan Elves, Vanyar, Teleri, Harfoots, Stoors, Fallohides, Uruk-hai)

## 5. Parent hierarchy

One level deep in every case, exactly as `RACE-SCHEMA-REVIEW-001.md` §8 predicted — no candidate needed 2+ levels of nesting. 12 subgroups have a `parentId`; 7 major races have `parentId: null`.

## 6. Provenance

`provenance/races.sources.json` — 19 entities, `entityType: "race"`, all `entityIdStatus: "final"`, ids matching `data/races.json` exactly. Confidence: 4 HIGH (Men/Elves/Dwarves/Hobbits — matched directly to existing Character race-value counts), plus Dunedain/Rohirrim/Noldor/Longbeards/Ents also HIGH; remainder MEDIUM/MEDIUM-HIGH, none LOW.

## 7. Licensing

No structured/factual field beyond `id`/`name`/`type`/`parentId`/`wikiUrl`. No description or narrative prose copied. No `REQUIRES LEGAL REVIEW` flags raised — consistent with the source research's own conclusion.

## 8. Simplifications

- `wikiUrl: null` for all 19 records — no URL independently re-verified at insertion time (same discipline applied to Characters/Places insertions).
- Canonical identity: no alias/spelling-variant duplication needed — all 19 candidate names in the research table were already singular, unambiguous entity names.
- "Dúnedain" and "Umlaut"-bearing names stored as plain ASCII (`Dunedain`) to match this dataset's existing convention (`data/places.json` already stores `Numenor`, `Barad-dur` without diacritics).

## 9. Deferred decisions

- `Character.raceId` link: not implemented, not planned as a committed next step (Option A/D per `RACE-SCHEMA-REVIEW-001.md` §7). `Character.race` remains an untouched free-text string.
- `/api/races` REST implementation: deferred to a future, separately-approved task, mirroring the Places dataset → Places API sequencing already used in this project.
