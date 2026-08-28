# GOD-SCHEMA-REVIEW-001 — Ainur/"Gods" Resource Schema Proposal

Status: RESEARCH / MODEL REVIEW ONLY. No code, JSON, DTO, controller, service, repository, `explorerConfig.ts`, Swagger, or frontend file was modified. `Character` schema is **not** modified — impact documented only. Companion document: `docs/GODS-CANDIDATES-001.md`.

Labeling convention (unchanged): **FACT**, **SOURCE CLAIM**, **INFERENCE**, **RECOMMENDATION**. Where evidence is insufficient: "Not established by the reviewed sources."

---

## 1. Recommended public resource name

**`/api/ainur`** — the Tolkien-canonical term for the order this resource actually covers (Eru + Valar + Maiar, per `GODS-CANDIDATES-001.md` §2 Model B), not "gods" or "deities," neither of which is a term Tolkien's cosmology itself uses (**SOURCE CLAIM**, stated up front in the companion document). The frontend UI is free to display "Gods" as a friendlier label — same UI-label/resource-name split already recommended for Races (`RACE-SCHEMA-REVIEW-001.md` §1) and consistent with the naming precedent this project has now applied twice.

This directly answers the user's own explicit "GODS — CORE QUESTION" / Model C: **Ainur as the resource, "Gods" as the UI label** — adopted here alongside the Model B scope decision (§2 below), not as competing options but as two independent axes (scope vs naming) that combine.

---

## 2. Recommended scope

**Model B** (`GODS-CANDIDATES-001.md` §2): Eru + Valar + Maiar. This is **not** a contradiction of the already-shipped Ainur-as-Character-classification decision (`race: "Maia"` for Gandalf/Sauron/Saruman/Radagast/Melian) — it is an **extension**, because every Maia who already has a Character record is represented in `/api/ainur` via a `characterId` back-reference with **zero duplicated fields**, not a second, independent record. See §4 for the exact mechanism.

---

## 3. Recommended schema

```
{
  id: number,
  name: string,
  type: string,          // "creator" | "Vala" | "Maia"
  parentId: number | null,
  characterId: number | null,
  wikiUrl: string | null
}
```

Six fields — one more than `Place`/`Race` (the added `characterId`), justified specifically by the duplication-avoidance requirement in §4, which has no analogue in either of those two other resources (neither Places nor Races have an existing overlapping resource to cross-reference).

`type: "deity" | "Vala" | "Maia" | "other"` (the user's suggested enum) was evaluated and **refined**: "deity" is dropped in favor of the more precise, Tolkien-accurate three-value set `"creator" | "Vala" | "Maia"` — "deity"/"other" would either duplicate what "creator"/"Vala"/"Maia" already express, or silently catch genuinely ambiguous cases (like Ungoliant, `GODS-CANDIDATES-001.md` §6) that deserve an explicit note, not a vague "other" bucket. **RECOMMENDATION**: keep the enum closed and precise (3 values), document ambiguous cases in provenance notes rather than inventing a 4th catch-all value.

---

## 4. Avoiding Character duplication — the `characterId` mechanism

Per `GODS-CANDIDATES-001.md` §3: any Ainur/Maia/Vala row that also has a Character record (currently: Gandalf/2, Sauron/14, Saruman/15, Radagast/32, Melian/46) stores **only** `characterId` pointing at that record — `name`, `birth`, `death`, `realm`, etc. are **not** re-stored on the Ainur row. A consumer wanting Gandalf's biographical fields follows `characterId` to `GET /api/characters/2`; a consumer wanting "is Gandalf a Maia, and who else is" queries `/api/ainur`. This is the same non-duplication discipline `PLACES-CANDIDATES-001.md` §11 already applied to `Place → Characters` (recommended as a derived/reverse query, not stored duplicate data) — reapplied here in the opposite direction (Ainur references Character, rather than Character being queried by a Place's free-text field).

Rows with **no** Character record (Manwë, Varda, Eru, etc.) simply have `characterId: null` — this is the large majority of the recommended batch (16 of 23, per `GODS-CANDIDATES-001.md` §9).

---

## 5. Eru Ilúvatar

Per `GODS-CANDIDATES-001.md` §4: included as a single `type: "creator"` row, `parentId: null`, `characterId: null`. A category-of-one `type` value is accepted here on the same precedent already used elsewhere in this API for single-member categories (`Place.type: "dwelling"` was defined even though no dwelling was actually inserted in `PLACES-DATASET-001.md`; Character's `race: "Skin-changer"` for Beorn was accepted in prior schema review as a defensible single-member category). Eru is **not** given `type: "Vala"` — he is explicitly outside that order, and mis-filing him would misrepresent the source cosmology.

---

## 6. Valar

16 of the 23 recommended candidates (`GODS-CANDIDATES-001.md` §9) are Valar-or-creator-tier, none with existing Character records, all `parentId: null` (Valar have no parent in this model — they are peers under Eru, not a hierarchy among themselves per the sources reviewed; **INFERENCE**: no source in this pass established a Valar-to-Valar containment relationship, so none is invented). `type: "Vala"` for all, including the fallen Melkor/Morgoth — his fallen status is documented in a provenance note, not a separate `type` value (he was, canonically, a Vala by origin; changing his `type` post-corruption would be inventing a distinction the sources don't draw at the schema level, similar in spirit to why this project declined to invent a `formerRace` field for the Witch-king in `CHARACTER-SCHEMA-REVIEW-001.md`).

---

## 7. Maiar

7 of the 23 recommended candidates are Maiar-tier: 5 with existing Character records (`characterId` set, §4), plus Gothmog (Balrog, `parentId` could point to a `"Maia"`-general grouping but no source establishes a specific Vala-allegiance parent relationship for him individually in this pass — `parentId: null`, not guessed) and Ungoliant (classification ambiguity explicitly flagged in provenance notes per `GODS-CANDIDATES-001.md` §6, not silently resolved either way).

---

## 8. Relationships evaluated

- **Ainur → Character** (`characterId`): **high value, required** for the duplication-avoidance mechanism (§4). The one relationship this resource cannot ship without.
- **Ainur → Ainur classification** (`type`): already the core field (§3) — not a separate relationship, just the primary categorical field.
- **Ainur → parent/entity** (`parentId`): evaluated, **not recommended as a general mechanism** — no source in this pass established a genuine Ainur-to-Ainur containment hierarchy (Valar don't have "parent" Valar; Maiar are traditionally "servants of" a particular Vala, e.g. Gandalf/Olórin is associated with Manwë and Varda per some accounts, Sauron originally served Aulë — but this is an *allegiance*, not a *containment*, and modeling it as `parentId` would misrepresent the relationship type Place's `parentId` correctly captures for geography). **RECOMMENDATION**: keep `parentId` in the schema for structural consistency with Place/Race (§3), but expect it to be `null` for nearly every row in practice — it is not a load-bearing field for this resource the way it is for Place, and no candidate in this pass had a confidently-sourced allegiance relationship strong enough to populate it without guessing.
- **Ainur → realm**: evaluated, **not recommended** — no candidate in this pass has a `Place` association strong enough to justify a field (Valinor exists as a candidate Place in `PLACES-CANDIDATES-001.md` §4/§8 already, but linking every Vala to it would be a low-information, redundant relationship — "all the Valar live in Valinor" is not a fact worth a per-row foreign key).
- **Ainur → era**: evaluated, **not recommended** — nearly every Ainur candidate spans "all eras" (they predate Arda itself, per **SOURCE CLAIM**), making an `era` field low-information for this specific resource, unlike Character/Place where era genuinely varies and is useful for filtering.

---

## 9. `type` field — direct evaluation

Confirmed apt, with the refinement noted in §3 (3 values, not 4): `"creator" | "Vala" | "Maia"`. This is a closed, small, well-sourced enum — no candidate researched required a 4th value, and inventing one (`"other"`) would only invite miscategorization of genuinely ambiguous cases (Ungoliant) that deserve a documented note instead.

---

## 10. Public API proposal (not implemented)

```
GET /api/ainur
GET /api/ainur/:id
```

**Filters**: `name` (substring, existing convention), `type` (exact match, existing convention — same as `Place.type`/proposed `Race.type`). No `characterId` filter proposed (thin use case — a consumer wanting "which Ainur are also Characters" can filter client-side on `characterId !== null` against the already-paginated list; not worth a dedicated query param for a resource this small). No `era` filter (per §8, not useful here).

**Pagination**: same `{data, page, limit, total}` envelope — no deviation.

---

## 11. Provenance (conceptual only, not created)

Same structure as `provenance/characters.sources.json`/`provenance/places.sources.json`: `entityType: "ainur"`, `entities[]` with `entityId`/`entityIdStatus`/`name`/`sources[]`. **One addition specific to this resource**: provenance notes must explicitly capture classification disputes (Ungoliant) and allegiance claims not promoted to `parentId` (e.g. "Gandalf/Olórin associated with Manwë/Varda per some secondary accounts — not encoded as `parentId`, not independently re-verified") — the same "preserve uncertainty, don't average it away" principle already applied to the Ar-Pharazôn death-date conflict (`CHARACTERS-CANDIDATES-002.md` §5) and the Maedhros inferred-death-year case (`CHARACTERS-DATASET-001.md`). **Not created by this document.**

---

## 12. Final recommendation

### Recommended public resource name
`/api/ainur` (schema/API level); frontend UI label may say "Gods" without a backend naming change.

### Recommended scope
Eru + Valar + Maiar (Model B), including the 5 already-shipped Character-Maiar via `characterId` back-reference, **zero duplicated fields**.

### Recommended schema
`{ id: number, name: string, type: "creator" | "Vala" | "Maia", parentId: number | null, characterId: number | null, wikiUrl: string | null }`.

### Recommended relationships
`characterId` (required mechanism, §4/§8) and `parentId` (kept for schema consistency with Place/Race, expected mostly `null` in practice — not a load-bearing field here). No `realm` or `era` relationship — insufficient demonstrated value (§8).

### Recommended dataset size
**23** (`GODS-CANDIDATES-001.md` §9's Tier 1 + Tier 2 batch: 16 Tier 1 + 7 Tier 2) — within the user's 15–30 target, not padded. 5 of the 23 are `characterId`-linked (no new biographical data introduced for them, only a classification row); 18 are genuinely new entities with no prior representation anywhere in this API.

---

## 13. Decision matrix

| Aspect | Option | Pros | Cons | Recommendation |
|---|---|---|---|---|
| Naming | `/api/gods` vs `/api/ainur` (+ UI label) | Ainur: Tolkien-canonical, avoids asserting a non-canonical term as the schema's own vocabulary | Gods: more immediately legible to a general developer audience unfamiliar with the term | **`/api/ainur`**, UI label "Gods" |
| Scope | Eru+Valar (A) vs Eru+Valar+Maiar (B) vs Ainur-resource/Gods-label (C) vs no resource (D) | B: complete, matches user's own framing | B: re-triggers duplication risk unless `characterId` mechanism is mandatory (not optional) | **B (scope) + C (naming), combined** |
| Schema | minimal (A) vs relational w/ `parentId` (B) | Minimal: simpler; relational: consistent with Place/Race pattern | Minimal: can't express `type`/hierarchy at all | **Relational, 6 fields including `characterId`** |
| Character relationship | duplicate fields vs `characterId` back-reference vs no link at all | back-reference: zero duplication, zero drift risk | back-reference: one more field than Place/Race have | **`characterId` back-reference — mandatory, not optional, for any Ainur with an existing Character record** |
| Ainur classification | keep Model B (existing `race:"Maia"`) unchanged vs replace with this resource | Keep unchanged: zero migration, zero breaking risk to the 5 existing records | none identified — this document does not propose changing `Character.race` at all | **Keep `Character.race:"Maia"` exactly as-is; `/api/ainur` is additive, not a replacement** |
| Eru | Character vs God/Ainur-row vs unique treatment | Unique (`type:"creator"`, category-of-one): honest, matches precedent already set for other single-member categories in this API | Adds one `type` value used by exactly one row | **`type: "creator"`, single-member category, not omitted** |
| Valar | full list (14+) vs prioritized subset | Full: complete; subset: matches actual per-entity sourcing strength found in this pass | Full: several names had only single-thread corroboration in this pass | **16 Tier 1 (9 cross-corroborated + Eru + Melkor + the 5 Character-Maiar) + 7 Tier 2, not forced to a fixed "14"** |
| Maiar | exclude entirely vs include via duplication vs include via `characterId` | `characterId`: only option consistent with this project's no-duplication discipline | none identified for this specific choice | **Include via `characterId`, mandatory mechanism** |
| Provenance | mirror Characters/Places vs new structure | mirror: proven, zero new design cost | none identified | **Mirror exactly, plus explicit dispute-preservation notes (Ungoliant, unconfirmed allegiances)** |

---

## Files created

- `docs/GOD-SCHEMA-REVIEW-001.md` (this file) — new.
- `docs/GODS-CANDIDATES-001.md` — new (companion document).

No other file was created, modified, or deleted. `Character` schema, `Place` schema, all code, JSON data, and the frontend are untouched.
