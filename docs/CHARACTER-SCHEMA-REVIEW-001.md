# CHARACTER-SCHEMA-REVIEW-001 — Schema Review Before Expansion

Status: RESEARCH / PROPOSAL ONLY. No JSON, DTO, controller, service, repository, or frontend file was modified to produce this document. No schema change was implemented. `data/characters.json` (19 existing records) and `src/modules/characters/domain/character.entity.ts` are unchanged.

Labeling convention (unchanged from prior documents): **FACT**, **SOURCE CLAIM**, **INFERENCE**, **RECOMMENDATION**. Where evidence is insufficient: "Not established by the reviewed sources."

This document builds on `docs/DATASET-RESEARCH-001.md`, `docs/CHARACTERS-CANDIDATES-001.md`, and `docs/CHARACTERS-CANDIDATES-002.md`. Their conclusions (Ainur Model B lean, licensing stance, confidence criteria, the specific problem cases below) are treated as already established and cited, not re-derived.

---

## Current Character schema (FACT, from `character.entity.ts`)

```ts
id: number
name: string
race: string
gender: string | null
birth: string | null
death: string | null
hair: string | null
height: string | null
realm: string | null
spouse: string | null
wikiUrl: string | null
```

Note: `gender` is nullable in the actual entity, contrary to the user's message which listed it as `string`. Treating the entity file as authoritative (FACT).

## Problem cases that prompted this review

Carried forward from prior docs: Elrond/Elros half-elven race resolution, Witch-king transformation, Bombadil/Goldberry race ambiguity, Smaug/Shelob/Treebeard/Beorn semantically-empty fields, `spouse` free-text bidirectionality, Ainur membership (Gandalf/Saruman/Sauron/Radagast/Melian). None are solved here with workarounds — that is explicitly out of scope.

---

## 1. Race analysis

**FACT**: the live dataset already stores conceptually different *kinds* of thing in one `race: string` field: biological/genetic lineages (`Human`, `Hobbit`, `Dwarf`, `Elf`) and a metaphysical order-of-being (`Maia`, used for Gandalf id 2, Sauron id 14, Saruman id 15).

**INFERENCE**: Tolkien's own terminology is not a single flat taxonomy. Broadly, distinct axes exist in the legendarium:
- **Order of being** (metaphysical origin): Ainur (Valar/Maiar) vs. Children of Ilúvatar (Elves, Men) vs. others (Dwarves — made by Aulë, adopted by Ilúvatar; Ents — awakened by Yavanna; Eagles — servants of Manwë, debated nature; Dragons/spiders — bred/corrupted by Morgoth).
- **Biological kind** within Children of Ilúvatar: Elf, Man, and the debated edge case Half-elven (a choice of fate, not a third biological kind — SOURCE CLAIM, consistent across both candidate documents).
- **Craft-kind**: Dwarves are neither Ainur nor Children of Ilúvatar by origin story, yet function as a peer "race" to Elves/Men/Hobbits in every practical sense the dataset needs.
- **Non-humanoid natural kinds**: Ents, Eagles, Dragons, giant spiders — these have no `Maia`/`Elf`/`Human` peer group; each is functionally a category of one or a handful of members.

**RECOMMENDATION**: `race: string` is not "wrong," but it is doing two jobs at once — biological/craft kind (Elf, Dwarf, Hobbit, Human, Ent, Dragon...) and metaphysical order (Maia) — without distinguishing them. This is exactly why Gandalf's `race: "Maia"` and Legolas's `race: "Elf"` look like peers in the API response but are not answering the same question. This is a **modeling weakness**, not a bug — the field already works today because no consumer needs to ask "is this a biological kind or a metaphysical order," but it is the root cause of the Half-elven and Ainur questions below.

## 2. Half-elven (Elrond / Elros)

**FACT**: existing Elrond (id 12) has `race: "Elf"`. **SOURCE CLAIM** (both candidate docs): Elrond and Elros were both Half-elven and each *chose* a fate — Elrond chose Elf, Elros chose Man (`race: "Human"` proposed for candidate 42 in pass 2).

**FACT**: this means the live dataset has already, silently, resolved "Half-elven" by recording the *chosen* fate rather than the biological origin, with no field indicating a choice was ever made. A new reader of the API has no way to know Elrond is Half-elven at all — the response says `"Elf"`, full stop.

Alternatives considered:
- **Alternative 1 — keep as-is** (`race` = chosen fate only). Simplest, zero schema change, matches existing precedent (Elrond already modeled this way). Loses the "Half-elven" fact entirely from the public data model.
- **Alternative 2 — `race: "Half-elven"`** for both. Consistent for the pair, but breaks with the already-shipped Elrond record (would be a breaking change to an existing field's value, not just additive) and still begs the question of which fate they chose, which is itself notable canon.
- **Alternative 3 — add a field** (e.g., `lineage` or `chosenFate`) to capture both the origin and the choice. Solves it correctly but is a **new field**, explicitly deferred by this task's own instructions (§14 "no intentar resolver todo").

**RECOMMENDATION**: keep `race: "Elf"` for Elrond (already shipped, do not touch) and, per pass-2's own flag, use `race: "Human"` for Elros for internal consistency with that precedent — but treat this as a **known, documented modeling simplification**, not a solved problem. Do not invent a new field in this task. This is a **Defer**, not a **Change**.

## 3. Ainur (Eru, Valar, Maiar)

Current dataset already uses `race: "Maia"` for Gandalf (2), Sauron (14), Saruman (15) — **FACT**. Pass 1 proposed the same pattern for Radagast (32); pass 2 for Melian (49).

**Option A — Ainur as independent resource** (`/api/ainur`). Pros: correctly models Ainur as a distinct order of being with its own attributes (Vala rank, Maia allegiance, etc.); allows querying "all Ainur" without scanning Character race strings. Cons: immediately creates the identity-duplication problem the user explicitly warned against — Gandalf would need to exist as both a Character (has quotes, appears in movies) and an Ainur record, with no established mechanism in this schema for one entity to be two resources without either (a) picking one as canonical and cross-referencing, or (b) duplicating data. Also expands API surface for a category where, per `DATASET-RESEARCH-001.md`, only a handful of members (Valar) have enough independent structured data to justify their own resource at all.

**Option B — Character classification** (current approach: `race: "Maia"`/`"Vala"` as a string value on Character). Pros: zero new resource, zero identity-duplication risk, already shipped and working for 3 existing records, requires no migration. Cons: conflates "biological/craft kind" and "metaphysical order" in one field (per §1), and provides no way to model Valar who are *not* also individually-notable Characters (e.g., if the dataset never adds a Character record for Manwë, "Valar" as a category has no representation at all).

**Option C — Character → Ainur relationship** (Character keeps its own record; a separate `ainurRank`/`ainurOrder` field or a nullable foreign key points to an Ainur classification without duplicating the Character). Pros: keeps single-entity identity (no duplication), still allows richer Ainur-specific data (Vala domain, Maia allegiance) than a bare string, extensible to Valar who lack full Character-level data by using a lighter classification-only concept. Cons: is additive complexity — a new field/relation — which this task's own instructions say not to add casually; only justified if the project actually wants queryable "is this character Ainur, and what rank" beyond what a string already gives.

**RECOMMENDATION**: consistent with `DATASET-RESEARCH-001.md`'s prior lean, **Option B remains correct for now** — it is what's already shipped, costs nothing, and every Ainur candidate surfaced in both candidate passes (Radagast, Melian) fits it without a workaround. Option C is a reasonable **future** upgrade if Valar-without-Character-record becomes a real need; Option A should be avoided unless the project commits to solving cross-resource identity first. No duplication was proposed anywhere in this document.

## 4. Spouse

**FACT**: `spouse: string | null`, free text. Live examples: Aragorn↔Arwen (ids 3/11, cross-referenced by name string in both directions — FACT, re-read from `characters.json`), Faramir↔Éowyn (17/16, same pattern), Galadriel→"Celeborn" (7, one-directional — Celeborn has no record at all today).

**Problem, confirmed by both candidate docs**: `spouse` is a *name string*, not a relation. When both partners exist as records (Aragorn/Arwen), the pairing is duplicated as two independent strings that must stay in sync by convention, not by structure — nothing prevents them from drifting (e.g., a typo in one direction). When only one partner exists (Galadriel/Celeborn today; would also affect Melian/Thingol and Tar-Míriel/Ar-Pharazôn if pass-2 candidates are adopted), the field points to a name with no corresponding entity at all — indistinguishable, from the API consumer's perspective, from a spouse who was never a "real" Character.

**Option A — keep `spouse: string`**. Zero change, zero migration. Continues the drift/dangling-reference risk, but is honest about what it is: a name label, not a guaranteed-resolvable relation (much like `realm` already is).

**Option B — `spouseId: number | null`**. Structurally correct when both partners exist as Characters; but breaks immediately for every spouse who is *not* a Character record (currently: Celeborn, Rosie Cotton, Estella Bolger, Diamond of Long Cleeve, Elfhild — none of the 19 existing spouses besides Arwen/Aragorn/Faramir/Éowyn/Celebrian... **FACT check**: of the 19 existing `spouse` values, only "Arwen"→Arwen(11), "Aragorn II Elessar"→Aragorn(3), "Eowyn"→Éowyn(16), "Faramir"→Faramir(17) resolve to existing ids; "Rosie Cotton," "Estella Bolger," "Diamond of Long Cleeve," "Elfhild," "Celebrian," "Celeborn" do not exist as Character records today). A pure `spouseId` would force either adding minor-character records purely to satisfy the relation, or losing the data for anyone not independently notable enough to be a Character — a real regression.
- **Option C — `spouseIds: number[]`**. Same core problem as B, plus unnecessary complexity (multiple simultaneous spouses is not a modeling need this dataset has ever shown).
- **Option D — separate relationship resource** (e.g., a `Relationship`/`Marriage` entity linking two Character ids, independent of whether both sides also have a `spouse` string). Most structurally correct, mirrors how `Quote` already resolves `characterId`/`movieId` into nested objects — but is a **new resource**, the heaviest option, and only pays for itself if the project wants queryable family/relationship data broadly (not just spouses) — no evidence that need exists yet.

**RECOMMENDATION**: **Keep `spouse: string` for now (Defer B/C/D)**. The honest problem is that a majority of existing spouses are not independently notable enough to be Characters — B/C would either lose data or force scope creep (adding "Rosie Cotton" as a full Character just to satisfy a foreign key). D is the structurally correct long-term answer but is new-resource-level complexity not justified by current usage. This is explicitly a case where, per the user's own minimal-schema principle (§10), a known limitation is preferable to premature complexity.

## 5. Realm

**FACT**: `realm: string | null`, e.g. `"The Shire"`, `"Gondor and Arnor"`, `"Woodland Realm"`. Functions today as an informal blend of birthplace/political affiliation/residence — not narrowly one of those.

**INFERENCE**: converting `realm` to a `Place` foreign key was explicitly flagged as out of scope by the user ("No convertirlo automáticamente en Place"), and for good reason — a `Place` resource doesn't exist yet, and `realm` values like `"Gondor and Arnor"` (Aragorn) are not single places but compound political domains, which a simple FK wouldn't represent cleanly without its own relationship modeling.

**RECOMMENDATION**: **Keep `realm: string`** as-is. It is already doing an acceptable, honest job as a loose descriptive field, and every candidate reviewed across both candidate documents fit it with plain strings, reusing the existing dataset's realm vocabulary or adding a small number of new plain strings (`"Dale"`, `"Moria"`, `"Grey Havens"`, `"Bree"`, `"Fangorn Forest"`, `"Vales of Anduin"`, `"Númenor"`, `"Nargothrond"`, `"Gondolin"`, `"Doriath"` — all schema-compatible, per both candidate docs). No candidate required a structural change here. A `Place` resource remains a legitimate future idea (per `DATASET-RESEARCH-001.md` §8) but is independent of whether `realm` stays a string on Character.

## 6. Hair / Height

**FACT**: `hair: string | null`, `height: string | null`. In the live 19, `height` is `null` for every single record (FACT, re-read); `hair` is populated for most humanoid characters and `null` for Sauron (14) and Gollum (19).

**INFERENCE**: for humanoid Characters (Elf/Human/Hobbit/Dwarf), `hair` is a well-defined, commonly-documented attribute. For non-humanoid candidates flagged in the candidate docs (Smaug/Dragon, Shelob/Giant Spider, Treebeard/Ent), `hair` has no meaningful value — not "unknown," but genuinely not applicable, a distinction the schema cannot express (both candidate docs flag this as the "soft schema gap": `null` collapses "we don't know" and "this doesn't apply" into one value).

**RECOMMENDATION**: **`null` is sufficient and should remain the answer** for both "unknown" and "not applicable" — introducing a tri-state (e.g., `"n/a"` sentinel) would violate the project's own established rule that `null` is the only accepted representation of absence (no `""`, no sentinel strings), and would be exactly the kind of "workaround for a rare case" the user's instructions say to avoid. The semantic collapse is a known, accepted limitation, not a defect requiring a fix.

## 7. Birth / Death

**FACT**: current values mix exact-ish years (`"TA 2968"`), relative/undated markers (`"Before Arda"`, `"First Age"`, `"Before YT 1050"`), and `null` (unknown/unrecorded) — all as freeform strings within one `string | null` field.

**INFERENCE**: this flexibility is precisely what makes candidates like Eärendil (pass 1, "sailed the sky as a star, not a conventional death") and Idril/Tuor (pass 2, "departed over the Sea, not a conventional death") representable at all — a strict date type would break on every one of these. The candidate documents also surface a **scope-widening consequence**: adopting Second Age (`SA`) or First Age (`FA`/`YT`) candidates introduces era prefixes not present anywhere in the live 19 today (which use only `TA`/`FO`) — not a schema problem, but a **data-convention** one worth the project owner's explicit sign-off before insertion (already flagged in `CHARACTERS-CANDIDATES-001.md` §15).

**RECOMMENDATION**: **Keep `birth`/`death` as free-text strings.** A structured date type would need to represent multiple incompatible calendars (Years of the Trees, Years of the Sun/First Age, Second Age, Third Age, Fourth Age/Shire Reckoning) plus non-date events ("sailed West"), which is out of proportion to any actual query need the API has shown (no filter/sort by date exists today). This is a correct existing design, not a gap.

## 8. Wiki URL

**FACT**: all 19 existing values point to `lotr.fandom.com` (a Fandom wiki, third-party, not Tolkien Gateway or an Estate-affiliated source). No licensing review of `lotr.fandom.com`'s own terms has been performed in any prior document (flagged as still-open in `CHARACTERS-CANDIDATES-001.md` §15).

**INFERENCE**: `wikiUrl` is a convenience/attribution field, not load-bearing data — its absence wouldn't break any relationship or filter. But it does create an external dependency: links can rot, pages can be renamed, and the field currently has no accompanying assertion about whether linking to a third-party wiki this way carries any redistribution obligation (distinct from copying that wiki's *text*, which is a separate, already-flagged concern).

**RECOMMENDATION**: **Keep `wikiUrl` in the model** (removing it would be a breaking change to consumers and provides real reader value), but flag as a genuine open item, carried forward rather than resolved here: (1) `lotr.fandom.com`'s terms of use / licensing have never been reviewed in this project — **REQUIRES LEGAL REVIEW** if this becomes a concern at scale; (2) no link-liveness check has ever been run against the 19 existing URLs in any prior document — Not established by the reviewed sources whether all 19 currently resolve.

## 9. Candidate compatibility

Pulled from `CHARACTERS-CANDIDATES-001.md` (34 candidates) and `CHARACTERS-CANDIDATES-002.md` (8 candidates) — 42 candidates total reviewed here for schema fit only (not re-litigating their historical/confidence merits).

| Candidate | Schema fit | Problem | Recommended handling |
|---|---|---|---|
| Thorin Oakenshield | Clean | — | Insert as-is if approved |
| Denethor II | Clean (spouse → null) | Wife (Finduilas) not independently corroborated | Insert, `spouse: null` |
| Éomer | Clean (spouse → null) | Wife (Lothíriel) not corroborated this pass | Insert, `spouse: null` |
| Elendil | Clean | Introduces `SA` era notation (scope decision) | Gate on era-scope sign-off |
| Isildur | Clean | Same era note | Gate on era-scope sign-off |
| Celeborn | Clean (fields), structural | `spouse` string mismatch w/ Galadriel's existing "Celeborn" string — no relation, just two independent strings | Insert; accept known `spouse`-as-string limitation (§4) |
| Thranduil | Needs null (birth/death unknown) | — | Insert with nulls |
| Bard the Bowman | Needs null (birth/death unknown) | — | Insert with nulls |
| Balin | Clean | — | Insert as-is |
| Fili | Clean | — | Insert as-is |
| Kili | Clean | — | Insert as-is |
| Dwalin | Needs null (death unknown) | — | Insert with null |
| Radagast | Needs null (realm/death unknown) | Ainur classification via `race: "Maia"` | Insert, Model B pattern |
| Treebeard (Fangorn) | **Schema gap (soft)** | `hair`/`spouse` semantically empty for an Ent | `null`, accepted limitation (§6) |
| Círdan | Needs null (birth/death imprecise) | — | Insert with nulls |
| Glorfindel | Needs null + unresolved identity conflict | Two-individuals-or-one dispute, not resolved by sources | Defer (Tier 3, unchanged) |
| Gríma Wormtongue | Needs null (birth unknown) | — | Insert with null |
| Beorn | **Schema gap (soft)** | `race: "Skin-changer"` single-member category; `gender`/`spouse`/`hair` thin | `null`, accepted limitation (§6) |
| Barliman Butterbur | Needs null | — | Insert with nulls |
| Elrohir / Elladan | Clean | Twins, identical dates (documentation quirk, not a schema problem) | Insert as-is |
| Anárion | Clean | Same `SA` era note as Elendil/Isildur | Gate on era-scope sign-off |
| Farmer Maggot | Needs null (mostly) | Thin data, not schema-incompatible | Defer (Tier 3, data thinness not schema) |
| Húrin, Túrin, Beren, Lúthien, Fëanor | Clean (fields) | `FA`/`YT` era notation | Gate on First Age scope decision |
| Eärendil | Clean, `death` semantic strain | "Sails as a star," not a conventional death — representable as descriptive string, but stretches the field's intent | Gate on First Age scope; accept `death` semantic strain like Eru-adjacent cases |
| Smaug, Shelob | **Schema gap (soft)** | Non-humanoid; `gender`/`spouse`/`hair` not applicable | `null`, accepted limitation (§6); Defer pending project owner comfort with soft gaps at scale |
| Witch-king of Angmar | **Schema gap (hard)** | Transformation (Man → wraith) not representable by one `race` string | Defer — no workaround, needs real schema decision if ever added |
| Tom Bombadil, Goldberry | **Schema gap (hard)** | No established canonical `race` value exists at all (deliberate authorial ambiguity) | Defer — forcing a string would misrepresent the source material |
| Elros | Clean (INFERENCE-based race choice) | Half-elven → chose-Human modeling precedent, same pattern as Elrond | Insert, `race: "Human"`, documented as modeling choice (§2) |
| Ar-Pharazôn, Tar-Míriel | Clean | Unresolved death-date conflict (SA 3319 vs 3310) | Insert with the conflict preserved in provenance notes, not averaged |
| Finrod Felagund, Turgon, Idril, Tuor | Clean (fields), some `death` semantic strain (Idril/Tuor "sailed West") | Same First Age era gate | Gate on First Age scope decision |
| Melian | Clean | Maia — same pattern as Gandalf/Sauron/Saruman/Radagast; `spouse` → "Elu Thingol" who has no record (dangling reference) | Insert, Model B pattern; accept `spouse` limitation (§4) |

**Summary**: of 42 candidates, **~27 fit cleanly with no gap** (some needing plain `null` for genuinely unknown fields, which is not a schema problem), **~9 are gated on an era-scope decision** (Second/First Age adoption) rather than a schema defect, **~5 reveal the already-known soft schema gap** (Treebeard, Beorn, Smaug, Shelob — non-humanoid semantic emptiness), and **3 reveal the already-known hard schema gap** (Witch-king, Bombadil, Goldberry). No candidate surfaced a schema problem not already identified in the two candidate documents — this review found no *new* hard gap.

## 10. Minimal schema principle

Applied throughout §2–§9: every "Option B/C/D exists but Defer" recommendation above follows the same rule — a rare or edge case that `null` (or an accepted semantic-collapse limitation) already handles honestly is not sufficient justification for a new field, new resource, or new relation. The two genuinely hard gaps (Witch-king, Bombadil/Goldberry) affect **3 candidates out of 42 researched across both passes** — not a pattern that justifies restructuring the schema for everyone else.

## 11. Backward compatibility

The schema's actual consumer is `lort-app` (frontend), per this session's prior audit. Classifying every change discussed above, whether or not recommended:

| Change | Classification | Notes |
|---|---|---|
| Adding 20–49 new Character records (any recommended candidate) | **Non-breaking** | Same shape, more rows; frontend already paginates/filters generically |
| `race: "Human"` for Elros, `"Maia"` for Radagast/Melian | **Non-breaking** | New values in an already-`string` field; no enum constraint exists to violate |
| Introducing `SA`/`FA`/`YT` era prefixes in `birth`/`death` | **Non-breaking** | Still `string \| null`; frontend renders these as opaque display text already (confirmed in the prior frontend audit — truthy-check rendering, no date parsing) |
| Adding a `lineage`/`chosenFate` field for Half-elven (Option 3, §2) | **Additive** | New optional field; existing consumers ignore unknown fields, no break, but not recommended in this task |
| Ainur Option C (relation/classification field) | **Additive** | Same reasoning — optional new field, not implemented here |
| Ainur Option A (independent `/api/ainur` resource) | **Additive at the API level**, but **introduces identity-duplication risk** requiring a design decision (see §3) — not a data-shape break for existing consumers, but a real architectural cost |
| `spouseId`/`spouseIds` replacing `spouse` (Option B/C, §4) | **Breaking** | Removing/retyping an existing field changes the response contract; would need additive coexistence (keep `spouse`, add `spouseId`) to avoid breaking `lort-app` |
| Relationship resource (Option D, §4) | **Additive** | New resource, existing `Character.spouse` untouched |
| `realm` → `Place` foreign key | **Breaking** | Changes `realm`'s type/shape; out of scope per user instruction anyway |

No breaking change is recommended by this document. Every concrete recommendation below is either "no change" or "insert data using the existing schema."

---

## 12. Recommended schema

### Keep
`id`, `name`, `race`, `gender`, `birth`, `death`, `hair`, `height`, `realm`, `spouse`, `wikiUrl` — all eleven fields, unchanged types and semantics.

### Change
None. No field's semantics should change as part of accommodating the researched candidates.

### Add
None. No new field is justified by the candidate pool researched so far (42 candidates, only 3 hit a hard gap, and inventing a field for 3-of-42 cases fails the minimal-schema principle).

### Defer
- Half-elven-specific modeling (`lineage`/`chosenFate` field) — revisit only if Half-elven candidates become numerous enough that the implicit Elrond precedent stops scaling.
- Ainur Option C (classification/relation field) — revisit only if Valar-without-Character-record becomes a real requirement.
- `spouse` restructuring (Option B/C/D) — revisit only if the project wants queryable relationship data broadly, not just a display string.
- Witch-king / Bombadil / Goldberry insertion — revisit only alongside an explicit decision on how to represent transformation/undetermined-nature, not before.
- `Place` resource and `realm` → FK — explicitly out of scope per user instruction; independent decision from this review.

---

## 13. Recommended strategy — direct answers

1. **¿Mantener `race` como string?** Sí. It does two conceptual jobs (biological/craft kind + metaphysical order) without distinguishing them, but no candidate researched requires more than a string can hold, and splitting it is not justified by current data.
2. **¿Agregar clasificación de Ainur?** No, not now. Continue Model B (`race` string value, e.g. `"Maia"`) — already shipped, zero-cost, fits every Ainur candidate found (Radagast, Melian) without duplication.
3. **¿Cambiar `spouse`?** No. Keep as free-text string; a foreign-key model would either lose data (most existing spouses aren't Characters) or force unwanted scope creep.
4. **¿Cambiar `realm`?** No. Keep as free-text string; a `Place` resource is explicitly out of scope for this task and independent of this field's type.
5. **¿Cambiar birth/death?** No. Keep as free-text strings; a structured date type can't cleanly span the legendarium's multiple calendars and non-date "deaths" (Eärendil, Idril, Tuor) without disproportionate complexity.
6. **¿Mantener hair/height?** Sí. `null` already correctly (if losslessly-ambiguous) represents both "unknown" and "not applicable" for non-humanoid entities; no fix needed for a 4-of-42-candidate edge case.
7. **¿Mantener wikiUrl?** Sí, keep it — but flag `lotr.fandom.com`'s own licensing terms as a genuinely open, unreviewed item (carried forward, not resolved here).
8. **¿Qué hacemos con Half-elven?** Follow the Elrond precedent (already shipped): record the chosen fate in `race`, not a synthesized "Half-elven" value. Document this as a known, deliberate simplification — do not add a field for it in this task.
9. **¿Qué hacemos con entidades especiales?** Witch-king, Bombadil, and Goldberry stay deferred (Tier 3, unchanged from both candidate documents) — no schema decision is being forced by this review; they remain unrepresentable without inventing a workaround, which is explicitly prohibited.

---

## Final report

### Schema strengths
`race`/`realm`/`birth`/`death`/`spouse` as loose strings are exactly what makes the schema flexible enough to absorb 39 of 42 researched candidates (including exotic cases like sailed-into-the-West "deaths") without any change. The existing Ainur pattern (`race: "Maia"`) already solves the special-entity problem for 3 shipped records and 2 more candidates, without duplication.

### Schema weaknesses
`race` conflates biological/craft kind with metaphysical order (not visible to API consumers). `spouse` is a display string, not a verifiable relation, and already has dangling references in the live data (Celeborn, Rosie Cotton, etc. have no Character record). Non-humanoid entities (Dragon/Spider/Ent/Skin-changer) leave `gender`/`spouse`/`hair` semantically empty with no way to distinguish "not applicable" from "unknown." One hard gap exists for beings whose nature/race is not resolvable to a single value (Witch-king, Bombadil, Goldberry).

### Candidate compatibility
42 candidates reviewed (34 from pass 1, 8 from pass 2): **~27 fit cleanly**, **~9 gated on an era-scope decision** (not a schema defect), **~5 hit the known soft gap**, **3 hit the known hard gap**. No new schema problem was discovered beyond what the two candidate documents had already flagged.

### Breaking changes identified
None recommended. Inserting any approved candidate is non-breaking. Only hypothetical future changes (`spouseId` replacing `spouse`, `realm` → `Place` FK) would be breaking, and neither is proposed.

### Recommended minimal changes
None to the schema itself. The only actionable recommendation is a **data-convention sign-off**, not a schema change: whether to adopt Second Age/First Age era notation (`SA`/`FA`/`YT`) before inserting the gated candidates.

### Deferred changes
Half-elven lineage field, Ainur relation/classification field (Option C), `spouse` restructuring (Option B/C/D), Witch-king/Bombadil/Goldberry representation, `realm` → `Place`. All deferred for the same reason: no current candidate volume justifies the added complexity.

### Final recommendation
**Keep the current eleven-field Character schema unchanged.** It is small, consistent, and — per the candidate compatibility check — already handles the overwhelming majority of realistic expansion candidates through its existing nullability and string-typing, without inventing workarounds for the genuine edge cases (which remain correctly deferred, not force-fit). Proceed to candidate insertion (a separate, not-yet-authorized task) using the existing schema as-is.

---

## Files created

- `docs/CHARACTER-SCHEMA-REVIEW-001.md` (this file) — new.

No other file was created, modified, or deleted. `data/characters.json`, `src/modules/characters/domain/character.entity.ts`, all DTOs/controllers/services/repositories, and the frontend are unchanged.
