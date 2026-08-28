# AINUR-DATASET-001

Final Ainur dataset documentation, following the pattern of `CHARACTERS-DATASET-001.md` / `PLACES-DATASET-001.md`. Reflects `data/ainur.json` and `provenance/ainur.sources.json` as they exist post V1-freeze (see `RACES-DATASET-001`-adjacent freeze round: `parentId` was removed from Ainur — it was not part of the approved schema in `GOD-SCHEMA-REVIEW-001.md` and has been fully stripped from entity, DTOs, dataset, validator, and tests).

Source research: `docs/GODS-CANDIDATES-001.md` (24 candidates researched, 23 recommended) and `docs/GOD-SCHEMA-REVIEW-001.md` (schema decision).

## Schema (approved, final)

```
{
  id: number,
  name: string,
  type: "creator" | "Vala" | "Maia",
  characterId: number | null,
  wikiUrl: string | null
}
```

No `parentId`, no `description`, no biography, no coordinates, no duplicated Character fields.

## Dataset — 23 records

| id | name | type | characterId |
|---|---|---|---|
| 1 | Eru Iluvatar | creator | null |
| 2 | Manwe | Vala | null |
| 3 | Varda | Vala | null |
| 4 | Ulmo | Vala | null |
| 5 | Aule | Vala | null |
| 6 | Yavanna | Vala | null |
| 7 | Namo | Vala | null |
| 8 | Nienna | Vala | null |
| 9 | Orome | Vala | null |
| 10 | Tulkas | Vala | null |
| 11 | Melkor | Vala | null |
| 12 | Gandalf | Maia | 2 |
| 13 | Saruman | Maia | 15 |
| 14 | Sauron | Maia | 14 |
| 15 | Radagast | Maia | 32 |
| 16 | Melian | Maia | 46 |
| 17 | Vaire | Vala | null |
| 18 | Este | Vala | null |
| 19 | Irmo | Vala | null |
| 20 | Nessa | Vala | null |
| 21 | Vana | Vala | null |
| 22 | Gothmog | Maia | null |
| 23 | Ungoliant | Maia | null |

## Type distribution

- `creator`: 1 (Eru Iluvatar)
- `Vala`: 15
- `Maia`: 7

## characterId relationships

5 of 23 Ainur rows reference an existing Character record; 18 are `null`.

| Ainur | characterId | Character |
|---|---|---|
| Gandalf | 2 | Character id 2 |
| Saruman | 15 | Character id 15 |
| Sauron | 14 | Character id 14 |
| Radagast | 32 | Character id 32 |
| Melian | 46 | Character id 46 |

All 5 referenced ids exist in `data/characters.json` (validator's `checkAinurCharacterId` orphan-check passes with 0 errors). No Character fields (name/race/gender/birth/death/realm/etc.) are duplicated into the Ainur record — the relationship is a bare numeric back-reference, matching Model B established earlier in this project (Ainur-as-Character-classification is unaffected; this resource is an *extension*, not a replacement).

## Eru

Category-of-one, `type: "creator"`. Outside and above the Vala/Maia order — not force-fit into `Vala`, not omitted. No Character record exists for Eru; `characterId: null`. Same precedent as single-member categories used elsewhere in this project (e.g. `Place.type: "region"` for Beleriand-like entries).

## Valar (15)

Manwe, Varda, Ulmo, Aule, Yavanna, Namo, Nienna, Orome, Tulkas, Melkor, Vaire, Este, Irmo, Nessa, Vana. No Vala-to-Vala hierarchy is established by the source research, consistent with removing `parentId` from the schema entirely — there was never a supported containment relationship to represent.

## Maiar (7)

Gandalf, Saruman, Sauron, Radagast, Melian (all with `characterId`), plus Gothmog and Ungoliant (both `characterId: null`, no Character equivalent exists for either).

## Classification decisions / notes

- **Gothmog** (id 22): Maia (Balrog). Directly relevant to existing Character Fingon (id 48, killed by Gothmog per prior Characters research) but has no Character record of his own. No source establishes a specific Vala-allegiance parent for him individually — none was guessed, consistent with the removal of any Ainur-to-Ainur hierarchy field.
- **Ungoliant** (id 23): classification ambiguity flagged in provenance — sometimes treated in source material as a primordial spirit of a disputed order rather than a straightforward Maia. Not resolved; recorded as `type: "Maia"` per `GODS-CANDIDATES-001.md` §6 while the dispute remains flagged in `provenance/ainur.sources.json`, consistent with this project's preserve-uncertainty discipline (never silently resolve a genuine source disagreement).

## Deferred candidates

`Arien` and `Tilion` — researched in `GODS-CANDIDATES-001.md` but excluded from the recommended batch (LOW/LOW-MEDIUM confidence: thin, not independently cross-checked). Not inserted. No other candidates from the 24 researched were dropped.

## Inclusion criteria

Candidates from `GODS-CANDIDATES-001.md` recommended at HIGH or MEDIUM confidence were included (23 of 24 researched). HIGH = corroborated across ≥2 independent source references, or already established across 2+ prior LORT documents (applies to the 9 core Valar and the 5 existing Character-Maiar). MEDIUM = reasonably established, single-source or typical-for-role. LOW/LOW-MEDIUM excluded.

## Provenance

`provenance/ainur.sources.json` — 23 entities, all `entityIdStatus: "final"`, ids match `data/ainur.json` exactly. Entity-level (not per-field) sourcing, confidence graded HIGH/MEDIUM (no LOW entries inserted), `schemaNote` confirms non-public-API status. Internal bookkeeping only — never read by runtime code, never exposed in DTOs/Swagger/`explorerConfig.ts`.

Note: a small number of provenance `notes` fields still reference the pre-removal `parentId: null` state (harmless historical commentary written before the freeze round stripped the field from the schema) — not corrected here since provenance content itself was out of scope for the freeze round; the schema and dataset are authoritative and no longer carry the field.
