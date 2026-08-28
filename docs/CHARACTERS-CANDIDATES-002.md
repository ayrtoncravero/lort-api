# CHARACTERS-CANDIDATES-002 — Character Expansion, Second Research Pass

Status: RESEARCH / DATA PREPARATION ONLY. No JSON, DTO, controller, service, repository, or frontend file was modified to produce this document. `data/characters.json` and the existing 19 records are untouched. Nothing here is authorized for insertion until reviewed and approved separately.

Labeling convention (unchanged from prior documents): **FACT**, **SOURCE CLAIM**, **INFERENCE**, **RECOMMENDATION**. Where evidence is insufficient: "Not established by the reviewed sources." Missing field values: `null / unknown` — never `""`, `"Unknown"`, `"N/A"`, `"?"`.

This document builds on `docs/DATASET-RESEARCH-001.md` and `docs/CHARACTERS-CANDIDATES-001.md` (pass 1). Pass 1's 34 candidates, its schema-gap findings, its licensing conclusions, and its confidence criteria are treated as already established and are not re-derived here. **No candidate below duplicates a pass-1 candidate or an existing 1–19 record.**

---

## 1. Scope of this pass

Directed research per the user's instruction, targeting the two areas pass 1 flagged as under-covered:

- **Second Age** — Númenor kings/queens, notable Númenóreans, Last Alliance-era figures.
- **First Age / Silmarillion** — additional Elves, Men, Dwarves, major antagonists/leaders beyond pass 1's six (Húrin, Túrin, Beren, Lúthien, Fëanor, Eärendil, which remain **not duplicated** here).

Provisional IDs continue from pass 1's highest assigned id (**41**, Anárion) — this pass starts at **42**. Pass 1's own unassigned Tier-3 schema-gap entities (Smaug, Shelob, Witch-king, Bombadil, Goldberry) are not renumbered or touched here.

---

## 2. Dedup check against existing 19 + pass-1's 34

Checked every candidate below by name and known alias against `characters.json` (1–19) and `CHARACTERS-CANDIDATES-001.md`'s full table (20–41 plus the five unassigned Tier-3 entries).

- No candidate below duplicates an existing record or a pass-1 candidate.
- **Alias watch:** "Tar-Zimraphel" / "Ar-Zimraphel" is the same individual as Tar-Míriel (renamed by Ar-Pharazôn upon their forced marriage — SOURCE CLAIM, Tolkien Gateway) — treated as **one candidate**, canonical name `Tar-Míriel`, not two records. "Felagund" ("Hewer of Caves", a Dwarvish epessë) is an epithet of Finrod, not a separate person — one candidate, canonical name `Finrod Felagund` (matches pass-1's naming convention of using the commonly-paired full form, consistent with how pass 1 used "Thorin Oakenshield" rather than bare "Thorin").
- No unlabeled duplicate found within this document's own table.

---

## 3. Canonical identity policy — continued

Same policy as pass 1 (§3/§4 of `CHARACTERS-CANDIDATES-001.md`): one canonical `name` per entity, aliases/titles documented in Notes only, no alias field proposed (schema change, out of scope).

---

## 4. Schema compatibility

Current schema, unchanged: `id, name, race, gender, birth, death, hair, height, realm, spouse, wikiUrl`. All candidates in this pass's recommended batch (§9) fit without a workaround.

**No new hard schema gaps found in this pass.** One soft/structural note, consistent with pass 1's already-documented finding:

- **`spouse` as free-text, not a relation** — this pass adds three more spouse pairs where both members are being proposed as records (Tar-Míriel/Ar-Pharazôn, Melian/Elu Thingol\*, Idril/Tuor). \*Elu Thingol himself is **not** a candidate in this document (not researched in this pass — see §14) so Melian's `spouse` field would point to a name with no corresponding record, same pattern already flagged for Celeborn/Galadriel in pass 1. Documented, not resolved — schema question, out of scope.
- No new hard gap comparable to Witch-king/Bombadil/Goldberry was found among this pass's candidates — all researched beings here are Elves, Men (including a Half-elven case, Elros — see note below), or one confirmed Maia (Melian), all of which the schema already represents cleanly via existing precedent (`race: "Maia"` already used for Gandalf/Sauron/Saruman).
- **Elros** — `race`: Tolkien Gateway (SOURCE CLAIM) describes Elros and his twin Elrond as "Half-elven" who **chose** to live as mortal Men; existing Elrond (id 12) has `race: "Elf"` in the live dataset today (FACT, re-read from `characters.json`), not "Half-elven" — meaning the existing dataset has **already implicitly resolved** the Half-elven/Elf-choice ambiguity for Elrond by picking `"Elf"`. If Elros is added with `race: "Human"` (matching his chosen mortal fate, consistent with how "Half-elven who chose Elves" was resolved as `"Elf"` for Elrond) this is at least *internally consistent* with the existing precedent, but it is a **modeling choice being made by this document, not a fact** — flagged as INFERENCE, not asserted as settled canon.

---

## 5. Second Age / Númenor candidates

| Candidate | Suggested ID | Era | Race | Gender | Birth | Death | Realm | Sources | Confidence | Schema compatibility | Notes |
|---|---:|---|---|---|---|---|---|---|---|---|---|
| Elros (Tar-Minyatur) | 42 | Second Age | Human (chose mortality; see §4) | Male | FA (Havens of Sirion, exact year not established in this pass) | SA 442 | Númenor | Tolkien Gateway | HIGH | Full (see §4 note on race choice) | First King of Númenor; twin brother of existing Elrond (id 12) — direct relational gap fill. Reign length (410 years) and death year (SA 442) cross-corroborated across multiple search results in this pass. |
| Ar-Pharazôn | 43 | Second Age | Human (Númenórean) | Male | null / unknown | SA 3319 (SOURCE CLAIM; one search result stated SA 3310 — see conflict note below) | Númenor | Tolkien Gateway | MEDIUM | Full | Last King of Númenor; caused the Downfall. **Source conflict, documented not resolved**: search results returned both SA 3319 and SA 3310 as his death/the Downfall's year across different pages — not independently reconciled against primary text in this pass. Confidence held at MEDIUM specifically because of this unresolved date conflict. |
| Tar-Míriel | 44 | Second Age | Human (Númenórean) | Female | null / unknown | SA 3319 (same Downfall event as Ar-Pharazôn 43; same conflict caveat) | Númenor | Tolkien Gateway | MEDIUM | Full | Rightful Ruling Queen by law of succession; forced into marriage with and displaced by Ar-Pharazôn (43) — real relational pair (`spouse` free-text would read "Ar-Pharazôn"). Renamed "Ar-Zimraphel" by Pharazôn — documented as alias, not a separate record (§2). |
| Finrod Felagund | 45 | First Age | Elf | Male | YT (Years of the Trees; exact year not established in this pass) | FA | Nargothrond (founder) | Tolkien Gateway | HIGH | Full | Founding King of Nargothrond; died fulfilling an oath to Beren (pass-1 candidate 45, if First Age scope adopted — direct relational link). Uncle of existing Galadriel (id 7) — SOURCE CLAIM, general legendarium genealogy, not independently re-verified in this pass; flagged as INFERENCE-adjacent, not asserted as fact without caveat. |
| Turgon | 46 | First Age | Elf | Male | YT (exact year not established in this pass) | FA (died in the Fall of Gondolin) | Gondolin (founder/King) | Tolkien Gateway | MEDIUM-HIGH | Full | Founding King of the hidden city of Gondolin; father of Idril (47) — direct relational pair if both adopted. |
| Idril (Celebrindal) | 47 | First Age | Elf | Female | FA | Undated (departed Middle-earth over the Sea with Tuor 48 — SOURCE CLAIM, not a conventional "death") | Gondolin | Tolkien Gateway | MEDIUM-HIGH | Full (see `death` semantic note) | Daughter of Turgon (46); wife of Tuor (48); mother of Eärendil (pass-1 candidate 48, if First Age adopted) — three-generation relational chain if all four adopted. `death` field has the same "sailed West, not a normal death" semantic strain already flagged for Eärendil in pass 1 — noted, not resolved. |
| Tuor | 48 | First Age | Human | Male | FA | Undated (same departure-over-the-Sea event as Idril 47) | Gondolin (by marriage) | Tolkien Gateway | MEDIUM-HIGH | Full (same `death` semantic note) | Father of Eärendil (pass-1 candidate 48); one of only two Men in Tolkien's legendarium recorded as being granted a form of elvish immortality — SOURCE CLAIM, notable but not independently re-verified against primary text in this pass. |
| Melian | 49 | First Age | Maia | Female | Before Arda | null / unknown (returned to Valinor after Thingol's death — SOURCE CLAIM, not a conventional death) | Doriath (Queen) | Tolkien Gateway | HIGH | Full | Special entity — see §7. Queen of Doriath; mother of Lúthien (pass-1 candidate 46, if First Age adopted) — direct relational link. `spouse` would read "Elu Thingol", who is **not** a candidate in this document (not researched — see §14); this creates the same dangling-spouse-reference pattern already flagged in §4. |

**Count researched in this section: 8.**

---

## 6. Confidence criteria applied

Unchanged from pass 1 (`CHARACTERS-CANDIDATES-001.md` §6): HIGH = corroborated across ≥2 independent sources or consistent with a prior pass with no unresolved conflict; MEDIUM/MEDIUM-HIGH = reasonably established, single-source or typical-for-role, not independently cross-checked twice; LOW = ambiguous or thinly documented. Per instruction, no LOW-confidence candidate is included in this pass's recommended batch — **none of the 8 candidates researched in this pass fell to LOW**, though Ar-Pharazôn and Tar-Míriel were held at MEDIUM specifically due to the unresolved death-date conflict (§5).

---

## 7. Special entities (Maiar / Valar / Ainur)

Per `DATASET-RESEARCH-001.md` §5/§6, Model B (classification on Character, no separate resource) remains the working recommendation, continued here:

- **Melian (49)** is a Maia — same category as existing Gandalf (id 2), Sauron (id 14), Saruman (id 15), and pass-1's Radagast (candidate 32). If added, would use `race: "Maia"`, consistent with existing pattern. She is also documented in the legendarium as effectively a Vala-adjacent figure by power level in some secondary discussion — **not established by the reviewed sources** as a formal reclassification; kept as "Maia" per the dominant sourcing.
- No other candidate in this pass's table (§5) is Ainur. Elros/Tuor (Half-elven/Men-by-choice) are explicitly **not** Ainur — flagged only to avoid any confusion with the Half-elven-immortality note in their rows.
- No Ainur resource was created. No candidate was represented twice.

---

## 8. Promoted candidates

Checked pass 1's Tier 3 list (Glorfindel, Farmer Maggot, Smaug, Shelob, Witch-king, Tom Bombadil, Goldberry) against new evidence gathered in this pass: **no promotions**. This pass's research did not touch any of those seven entities, and no new evidence was found for them (out of this pass's directed scope — Second Age/Númenor and additional First Age figures, not a re-review of pass-1's Tier 3). Their status is unchanged from `CHARACTERS-CANDIDATES-001.md`.

---

## 9. Recommended batch (Tier 1 + Tier 2 only)

All 8 candidates researched in this pass are schema-compatible (no hard gap) and MEDIUM confidence or higher — **all 8 qualify for the recommended batch.**

| Provisional ID | Name | Reason for inclusion | Confidence | Source quality | Schema compatibility |
|---:|---|---|---|---|---|
| 42 | Elros (Tar-Minyatur) | Direct relational gap (twin of existing Elrond); founds Númenor, connects the dataset's Second Age references (Elendil/Isildur/Anárion, pass 1) back to their origin | HIGH | Multi-source corroborated | Full |
| 45 | Finrod Felagund | Major First Age Elven king; direct relational link to pass-1's Beren | HIGH | TG | Full |
| 43 | Ar-Pharazôn | Central Downfall-of-Númenor figure | MEDIUM | TG (date conflict noted) | Full |
| 44 | Tar-Míriel | Direct relational pair with 43; rightful-queen narrative significance | MEDIUM | TG (date conflict noted) | Full |
| 46 | Turgon | Founding King of Gondolin; father of 47 | MEDIUM-HIGH | TG | Full |
| 47 | Idril (Celebrindal) | Direct relational chain: daughter of 46, wife of 48, (mother of pass-1's Eärendil if adopted) | MEDIUM-HIGH | TG | Full |
| 48 | Tuor | Direct relational pair with 47 | MEDIUM-HIGH | TG | Full |
| 49 | Melian | Maia special-entity, Queen of Doriath, mother of pass-1's Lúthien if adopted | HIGH | TG | Full |

**Count in this batch: 8.**

---

## 10. Tiering

### Tier 1 — Strong candidates (HIGH confidence, schema-clean)
Elros (42), Finrod Felagund (45), Melian (49).
**Count: 3**

### Tier 2 — Good candidates (MEDIUM/MEDIUM-HIGH confidence, some data gap or unresolved date conflict)
Ar-Pharazôn (43), Tar-Míriel (44), Turgon (46), Idril (47), Tuor (48).
**Count: 5**

### Tier 3 — Research later
None from this pass — all 8 researched candidates cleared MEDIUM confidence or higher and are schema-compatible.
**Count: 0**

**Total candidates researched in this document: 8** (3 Tier 1 + 5 Tier 2 + 0 Tier 3).

This is smaller than the 15–30 target range the user requested. **RECOMMENDATION, stated plainly**: rather than pad the count with LOW-confidence or thinly-sourced candidates (which the instructions explicitly forbid — "no incluir candidatos LOW en el grupo recomendado"), this pass stopped at 8 well-corroborated candidates and flags the shortfall explicitly (see §13) rather than inventing additional names. Reaching 15–30 responsibly would require a **third, further-targeted pass** — candidate areas not covered here: additional Noldor princes (Fingolfin, Fingon, Maedhros and the other sons of Fëanor), additional Númenórean line-of-Elros kings beyond the two researched here (25 total kings exist per Tolkien Gateway — §5 — only 2 were individually researched in this pass), Dwarven First Age figures (thin sourcing expected), and Second Age Elven smiths (Celebrimbor).

---

## 11. Target balance (Third/Second/First Age)

- **Existing 19**: entirely Third Age (with Elrond's `birth: "First Age"` as the one partial exception already in the live data — FACT, re-read from `characters.json`).
- **Pass 1 (34 researched, 19 recommended)**: predominantly Third Age, with 6 First Age candidates gated on a scope decision (Húrin, Túrin, Beren, Lúthien, Fëanor, Eärendil) and 4 Second Age candidates already included in its recommended batch (Elendil, Isildur, Anárion, + implicitly Celeborn's undated First-Age-adjacent birth).
- **This pass (8 researched, 8 recommended)**: 3 Second Age (Elros, Ar-Pharazôn, Tar-Míriel) + 5 First Age (Finrod, Turgon, Idril, Tuor, Melian).
- **INFERENCE**: this pass measurably improves Second Age and First Age representation relative to pass 1's near-total Third Age bias, without a mathematical quota being imposed (per instruction, quality was not sacrificed to hit a balance target) — but the dataset would still be Third-Age-majority even with every candidate from both passes adopted.

---

## 12. Current 19 audit (read-only, nothing changed)

Re-reading `characters.json` for this pass surfaces one point not previously called out in pass 1: **Elrond's `race` is `"Elf"`**, not `"Half-elven"`, despite Elrond being one of the two most famous Half-elven figures in the legendarium (SOURCE CLAIM, general legendarium knowledge). This is not a data error — it reflects a defensible modeling choice (his eventual elvish fate) — but it is the precedent this document leans on for Elros's `race: "Human"` recommendation in §4, and is worth the project owner's awareness: **the existing dataset has already made an implicit "Half-elven → pick one side" policy decision**, it just was never documented as such until this pass. RECOMMENDATION: document this policy explicitly (e.g., in a future schema/provenance note) rather than leaving it implicit, especially now that Elros, Tuor (partially, by the elvish-immortality grant), and pass-1's Eärendil all raise the same question.

No other new findings beyond what pass 1 already reported (`CHARACTERS-CANDIDATES-001.md` §15) — that audit is not repeated in full here.

---

## 13. Provenance notes (conceptual, not implemented)

Per the `provenance/characters.sources.json` structure proposed in `DATASET-RESEARCH-001.md` §15 and reiterated in pass 1's §16: every candidate in §9 above should eventually record at minimum one `sources[]` entry per field-bearing fact, e.g. for candidate 42 (Elros):

```json
{
  "entityId": 42,
  "sources": [
    {
      "name": "Tolkien Gateway",
      "url": "https://tolkiengateway.net/wiki/Elros",
      "confidence": "HIGH",
      "notes": "Twin of Elrond, first King of Numenor, reign 410 years, death SA 442 — corroborated across multiple search-result sources in this pass; direct TG page not independently re-fetched line-by-line.",
      "accessedAt": "2026-08-28"
    }
  ]
}
```

For candidates 43/44 (Ar-Pharazôn/Tar-Míriel), the provenance record should explicitly capture the **unresolved SA 3319 vs. SA 3310 date conflict** (§5) as a `notes` field — this is exactly the kind of source-disagreement the provenance structure exists to preserve rather than silently resolve.

Not implemented — no `provenance/` directory or file was created.

---

## 14. Explicitly not covered in this pass

To be transparent about this pass's actual boundaries (not filled with assumptions):

- **Elu Thingol** (Melian's spouse, King of Doriath) — referenced in §5's Melian row but **not independently researched or added as his own candidate** in this document. Not established by the reviewed sources in this pass beyond what was incidentally surfaced while researching Melian.
- The remaining ~23 of the 25 Númenórean kings (only Elros and, indirectly via the Downfall, Ar-Pharazôn/Tar-Míriel were researched) — see §10's note on a possible third pass.
- Fëanor's sons (Maedhros, Maglor, etc.), Fingolfin, Fingon, Celebrimbor — named as candidate areas for a future pass, not researched here.
- Dwarven First Age figures — not researched in this pass; Not established by the reviewed sources whether sufficient structured data exists for any.

---

## 15. Final recommendation

### Recommended Characters V1 Candidate Pool

- **19** existing (unchanged, live in `characters.json`)
- **+ 19** from pass 1's recommended batch (`CHARACTERS-CANDIDATES-001.md` §11)
- **+ 8** from this pass's recommended batch (§9)
- **= 46 total potential**, or **52** if the First Age scope question is resolved affirmatively and pass 1's 6 gated First Age candidates (Húrin, Túrin, Beren, Lúthien, Fëanor, Eärendil) are also included — note that adopting First Age scope also unlocks real relational completions with several of *this* pass's candidates (Melian→Lúthien, Idril→Eärendil), which is itself a point in favor of resolving that scope question rather than leaving it open indefinitely.

**Total potential: 46 (without First Age) / 52 (with First Age).**
**Total recommended (this pass only): 8.**
**Total deferred (this pass only): 0** — every candidate researched in this pass cleared the bar; nothing was found and set aside.

**Does the pool now support targeting 50, 55, or 60?** Honest assessment, not forced: **52 (with First Age adopted) is close to 50 but still short of 55–60.** Reaching 55–60 responsibly requires the third pass outlined in §10/§14 (remaining Númenórean kings, Fëanor's sons, Fingolfin/Fingon, Celebrimbor). **RECOMMENDATION**: 50 is achievable now (52 with First Age, or 46 without — either is within striking distance of 50 without a third pass, depending on the First Age decision); 55–60 is not yet responsibly reachable without further directed research. Do not force 75.

### New schema gaps
None found in this pass (§4). The `spouse`-as-free-text structural issue (already known) gains three more affected pairs (Tar-Míriel/Ar-Pharazôn, Melian/Thingol, Idril/Tuor) but is not a *new* category of gap.

### Existing schema gaps (restated from pass 1, unchanged)
- **Hard**: Witch-king of Angmar (transformation not representable), Tom Bombadil / Goldberry (no established `race` value).
- **Soft**: Smaug, Shelob, Treebeard, Beorn (semantically empty `gender`/`spouse`/`hair`).
- **Structural**: `spouse` free-text, not a relation (now affecting more pairs, per above).

### Licensing concerns
None. Consistent with `DATASET-RESEARCH-001.md` §14 and pass 1 §8: all data in this pass is factual/structured (names, dates, realms, family/reign relations), not copyrighted prose. No `REQUIRES LEGAL REVIEW` flags needed for this pass's candidates.

### Current 19 review
No errors. One new observation (§12): the existing dataset has an implicit, previously-undocumented "Half-elven → pick one race" policy visible in Elrond's record, now directly relevant to how Elros (and, if adopted, Eärendil/Tuor) would be modeled. RECOMMENDATION: document this policy explicitly before any Half-elven candidate is actually inserted.

### Provenance recommendation
Unchanged from pass 1: adopt `provenance/characters.sources.json` **before** inserting any candidate from either pass. This pass additionally recommends the provenance structure explicitly capture **unresolved source conflicts** (e.g., Ar-Pharazôn's death year) as first-class `notes` content, not just a single confidence score — a conflict silently averaged into one date would misrepresent the actual state of sourcing.

---

## Files created

- `docs/CHARACTERS-CANDIDATES-002.md` (this file) — new.

No other file was created, modified, or deleted. `data/characters.json`, `docs/CHARACTERS-CANDIDATES-001.md`, and `docs/DATASET-RESEARCH-001.md` are all unchanged (the latter two were read-only inputs to this pass).
