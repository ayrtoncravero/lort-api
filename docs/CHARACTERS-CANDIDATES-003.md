# CHARACTERS-CANDIDATES-003 — Character Expansion, Third (Final Targeted) Research Pass

Status: RESEARCH ONLY. No JSON, DTO, controller, service, repository, provenance, schema, or frontend file was modified to produce this document. `data/characters.json` and `provenance/characters.sources.json` are untouched. Nothing here is authorized for insertion until reviewed and approved separately.

Labeling convention (unchanged): **FACT**, **SOURCE CLAIM**, **INFERENCE**, **RECOMMENDATION**. Where evidence is insufficient: "Not established by the reviewed sources." Missing field values: `null / unknown` — never `""`, `"Unknown"`, `"N/A"`, `"?"`.

This document builds on `docs/CHARACTERS-CANDIDATES-001.md` (pass 1, 34 researched / 19 recommended, ids 20–41), `docs/CHARACTERS-CANDIDATES-002.md` (pass 2, 8 researched / 8 recommended, ids 42–49), and `docs/CHARACTER-SCHEMA-REVIEW-001.md` (schema decisions final — no new fields, no workarounds for known hard gaps). Prior findings are treated as established and not re-derived. **No candidate below duplicates a pass-1/pass-2 candidate or an existing 1–19 record.** Provisional IDs continue from pass 2's highest assigned id (**49**, Melian) — this pass starts at **50**.

---

## 1. Scope of this pass

Narrow, directed research per the user's instruction — not exhaustive:

- **Second Age / Númenor**: intentionally *not* re-opened in this pass. The user's instruction listed it as a focus area, but pass 2 already researched Elros/Ar-Pharazôn/Tar-Míriel and explicitly deferred "the remaining ~23 of the 25 kings" as a named future-pass target (`CHARACTERS-CANDIDATES-002.md` §14). This pass, given a 4–10 candidate target, prioritized **First Age gaps** instead (sons of Fëanor, Fingolfin, Fingon, Celebrimbor — explicitly named by the user as this pass's priority list) over researching more Númenórean kings "just for count," per the user's own instruction not to do that. **RECOMMENDATION**: a fourth pass, if ever undertaken, is the place for the remaining Númenórean line.
- **First Age**: Fingolfin, Fingon, Maedhros (eldest son of Fëanor, as a representative of "sons of Fëanor" — see §2 on why only one son was researched), Celebrimbor.

---

## 2. Dedup / scope check

Checked every candidate below against `characters.json` (1–19), `CHARACTERS-CANDIDATES-001.md`'s table (20–41 + 5 unassigned Tier-3), and `CHARACTERS-CANDIDATES-002.md`'s table (42–49). No duplicates found.

- **Fëanor himself** is already a pass-1 gated First-Age candidate (id 47 there per pass-1's recommended-batch listing referenced in pass-2 §11 — see `CHARACTERS-CANDIDATES-001.md`) — not re-researched or re-listed here.
- **"Sons of Fëanor"**: the user named this as a research area but the seven sons (Maedhros, Maglor, Celegorm, Caranthir, Curufin, Amrod, Amras) vary enormously in how much structured, corroborated data is available per Tolkien Gateway. To respect the "quality over quantity" instruction and avoid padding, this pass researched **only Maedhros** (the eldest, by far the best-documented, and the one with direct plot relevance via the Union of Maedhros and the rescue by Fingon). The other six sons are named explicitly in §9 (Deferred) rather than silently dropped.
- No alias-collision issues found among this pass's four candidates.

---

## 3. Canonical identity policy — continued

Unchanged (pass 1 §3/§4, pass 2 §3): one canonical `name`, aliases documented in Notes only, no alias field proposed.

---

## 4. Schema compatibility

Current schema, unchanged per `CHARACTER-SCHEMA-REVIEW-001.md` (concluded no schema change needed): `id, name, race, gender, birth, death, hair, height, realm, spouse, wikiUrl`.

**No new hard schema gaps found in this pass.** All four candidates are Elves (Fingolfin, Fingon, Maedhros, Celebrimbor) with clear identity and representable fields. No candidate in this pass resembles the Witch-king/Bombadil/Goldberry pattern — consistent with the schema review's conclusion, that decision is not revisited here.

One recurring soft note, consistent with prior passes: none of this pass's four candidates has a `spouse` — Fingolfin, Fingon, Maedhros, and Celebrimbor are not recorded as married in the reviewed sources (**SOURCE CLAIM**, absence of any marriage mention across Tolkien Gateway pages consulted) — so the `spouse`-as-free-text structural issue already documented in passes 1–2 is **not** further affected by this pass's candidates.

---

## 5. Candidate table

| Candidate | Suggested ID | Era | Race | Gender | Birth | Death | Realm | Sources | Confidence | Schema compatibility | Notes |
|---|---:|---|---|---|---|---|---|---|---|---|---|
| Fingolfin | 50 | First Age | Elf | Male | YT 1190 (Years of the Trees, Valinor) | FA 456 | (High King of the Noldor; no fixed single "realm" comparable to a city — see Notes) | [Tolkien Gateway — Fingolfin](https://tolkiengateway.net/wiki/Fingolfin) | HIGH | Full | First High King of the Noldor in Beleriand; died in single combat with Morgoth at the end of the Dagor Bragollach (**SOURCE CLAIM**, Tolkien Gateway). `realm` field: no single named seat corresponds cleanly to "High King of the Noldor" the way "Gondolin" does for Turgon — recommend `null / unknown` rather than inventing a value; **INFERENCE**, not resolved by this pass. |
| Fingon | 51 | First Age | Elf | Male | YT (exact year not established in this pass) | FA (died in the Nirnaeth Arnoediad, killed by the Balrog Gothmog) | (Second High King of the Noldor — same realm-field caveat as Fingolfin) | [Tolkien Gateway — Fingon](https://tolkiengateway.net/wiki/Fingon) | HIGH | Full | Succeeded Fingolfin (50) as High King; famed for rescuing Maedhros (52) from Thangorodrim — direct relational link between this pass's own two candidates. Son of Fingolfin (50) — a second, generational relational link. |
| Maedhros | 52 | First Age | Elf | Male | YT (exact year not established in this pass) | FA 587 (**SOURCE CLAIM**, inferred from War of Wrath end-date, not an explicit stated death-year in the sources consulted — see Notes) | March of Maedhros (Himring) | [Tolkien Gateway — Maedhros](https://tolkiengateway.net/wiki/Maedhros) | MEDIUM | Full | Eldest son of Fëanor (pass-1 gated candidate); led the Union of Maedhros; cast himself into a fiery chasm with a Silmaril at war's end (**SOURCE CLAIM**). Confidence held at MEDIUM specifically because the FA 587 death year is this document's own inference from the War of Wrath's dated end (545–587), not a directly-quoted death year in the pages consulted — flagged, not asserted as settled fact. |
| Celebrimbor | 53 | Second Age | Elf | Male | null / unknown (First Age, exact year not established in this pass) | SA 1697 | Eregion (Ost-in-Edhil, as lord of the Gwaith-i-Mírdain) | [Tolkien Gateway — Celebrimbor](https://tolkiengateway.net/wiki/Celebrimbor); [Tolkien Gateway — Sack of Eregion](https://tolkiengateway.net/wiki/Sack_of_Eregion) | HIGH | Full | Forger of the Rings of Power (except the One); grandson of Fëanor (**SOURCE CLAIM**, "last direct descendant of the line of Fëanor"); tortured and killed by Sauron in the Sack of Eregion, SA 1697, cross-corroborated across two Tolkien Gateway pages. Notably crosses Second Age — this pass's one Second-Age candidate, found while researching First Age gaps, not from a Númenor-focused search. |

**Count researched in this section: 4.**

---

## 6. Confidence criteria applied

Unchanged from pass 1/pass 2: HIGH = corroborated across ≥2 independent source pages or internally consistent with no unresolved conflict; MEDIUM = reasonably established but with a documented gap or an inference step; LOW = ambiguous or thinly documented, excluded from the recommended batch. **All 4 candidates in this pass cleared MEDIUM or higher; none is LOW.**

---

## 7. Special entities (Maiar / Valar / Ainur)

None of this pass's four candidates are Ainur. All are Noldorin Elves or (Celebrimbor) an Elf of Ñoldorin descent born later. No Ainur resource created, no candidate duplicated. Consistent with `DATASET-RESEARCH-001.md` Model B and its continued application in passes 1–2.

---

## 8. Recommended additions

All 4 candidates researched in this pass are schema-compatible and MEDIUM confidence or higher — **all 4 qualify.**

| Provisional ID | Name | Reason for inclusion | Confidence | Source quality |
|---:|---|---|---|---|
| 50 | Fingolfin | First High King of the Noldor; direct thematic anchor for the Noldor First Age arc; father of Fingon (51) | HIGH | TG |
| 51 | Fingon | Second High King; direct relational link to Fingolfin (50) and Maedhros (52) via the Thangorodrim rescue | HIGH | TG |
| 52 | Maedhros | Eldest son of Fëanor; leads the Union of Maedhros; direct relational link to Fingon (51) | MEDIUM | TG (death-year is this document's inference — see §5) |
| 53 | Celebrimbor | Forger of the Rings of Power; grandson of the line of Fëanor; central Second Age smith-lore figure not otherwise represented in the dataset | HIGH | TG (2 pages cross-corroborated) |

**Count in this batch: 4.**

---

## 9. Deferred

- **Maglor, Celegorm, Caranthir, Curufin, Amrod, Amras** (remaining sons of Fëanor) — not researched in this pass; deferred per §2's quality-over-count reasoning. A future pass could evaluate them individually rather than as a block.
- **The remaining ~23 of the 25 Númenórean kings** — reiterated from pass 2 §14, still not researched, still a candidate area for a possible fourth pass, deliberately not touched here to keep this pass's stated First Age focus.
- **Fëanor's exact relationship to Celebrimbor** (grandson, per one source) was not independently cross-verified against a second source in this pass — treated as **SOURCE CLAIM**, not upgraded to FACT.

**Count deferred (named, not researched in depth): 6** (the six remaining sons of Fëanor) + the already-known open Númenórean-kings gap from pass 2.

---

## 10. Tiering

### Tier 1 — Strong (HIGH confidence, schema-clean)
Fingolfin (50), Fingon (51), Celebrimbor (53).
**Count: 3**

### Tier 2 — Good (MEDIUM confidence, documented data gap)
Maedhros (52) — death year is this document's own inference, not a directly-quoted source date.
**Count: 1**

### Tier 3 — Research later
None researched to a LOW-confidence outcome in this pass; the six deferred sons of Fëanor were not researched at all (not tiered, simply not covered — see §9).
**Count: 0**

---

## 11. Diversity check (First / Second / Third Age)

- **Existing 19**: entirely Third Age (Elrond's `birth: "First Age"` is the one partial exception, per pass 2 §11).
- **Pass 1 recommended (19)**: predominantly Third Age, plus 4 Second Age (Elendil, Isildur, Anárion, Celeborn-adjacent) and 6 First Age candidates gated on a scope decision (not yet resolved in this document).
- **Pass 2 recommended (8)**: 3 Second Age, 5 First Age.
- **Pass 3 recommended (4, this pass)**: 3 First Age (Fingolfin, Fingon, Maedhros) + 1 Second Age (Celebrimbor).
- **INFERENCE**: across all three passes, First Age and Second Age representation has grown from zero (existing 19) to a combined 15 candidates (6 gated + 5 + 4) — a real shift, not a token one — but the pool remains Third-Age-majority overall even if every candidate from all three passes were adopted, since the existing 19 and most of pass 1 are Third Age. No artificial quota was imposed to change this ratio further; the user's instruction not to force balance was followed.

---

## 12. Provenance notes (conceptual, not implemented)

Per the structure in `provenance/characters.sources.json` and `docs/PROVENANCE-001.md` (already built, not modified by this pass): each of this pass's 4 candidates should eventually get an entry with `entityIdStatus: "provisional"`, e.g. for Celebrimbor:

```json
{
  "entityId": 53,
  "entityIdStatus": "provisional",
  "sources": [
    {
      "name": "Tolkien Gateway",
      "url": "https://tolkiengateway.net/wiki/Celebrimbor",
      "confidence": "HIGH",
      "notes": "Death in S.A. 1697, Sack of Eregion, cross-corroborated with the Sack of Eregion page."
    },
    {
      "name": "Tolkien Gateway",
      "url": "https://tolkiengateway.net/wiki/Sack_of_Eregion",
      "confidence": "HIGH",
      "notes": "Corroborates S.A. 1697 death date and circumstances."
    }
  ]
}
```

For Maedhros (52), the provenance record should explicitly note that the **FA 587 death year is this document's own inference** from the War of Wrath's dated span, not a directly quoted death year — the same "preserve the uncertainty" principle already applied to Ar-Pharazôn's conflicting dates in pass 2. Not implemented — `provenance/characters.sources.json` was not modified by this pass.

---

## 13. Final pool projection

- **19** existing (unchanged, live in `characters.json`)
- **+ 19** from pass 1's recommended batch
- **+ 8** from pass 2's recommended batch
- **+ 4** from this pass's recommended batch (§8)
- **= 50 total potential** (without First Age scope adopted for pass 1's 6 gated candidates), or **56** if the First Age scope question is resolved affirmatively and those 6 (Húrin, Túrin, Beren, Lúthien, Fëanor, Eärendil) are also included.

**Total potential: 50 (baseline) / 56 (with First Age gate opened).**
**Total recommended (this pass only): 4.**
**Total deferred (this pass only): 6 named (remaining sons of Fëanor) + the still-open ~23-king Númenor gap.**

**Does the pool land in 50–55?** Yes, cleanly: **50 without the First Age gate, 56 with it** — both are within or just above the user's stated 50–55 target. **RECOMMENDATION**: 50 is achievable right now without resolving the First Age gate; resolving it pushes the total to 56, slightly past the top of the requested range but still consistent with "quality over exact number" and the user's own instruction not to force 75. No further pass is required to hit the stated target; further passes (remaining Fëanorians, remaining Númenórean kings) remain available as *optional* future work, not a requirement.

---

## 14. Final recommendation

### Recommended additions
Fingolfin (50), Fingon (51), Maedhros (52), Celebrimbor (53) — all 4 researched in this pass, all recommended, none deferred.

### Deferred
Maglor, Celegorm, Caranthir, Curufin, Amrod, Amras (remaining sons of Fëanor, not individually researched); the ~23 remaining Númenórean kings (carried over from pass 2, still not researched).

### Final pool projection
19 existing + 19 (pass 1) + 8 (pass 2) + 4 (pass 3) = **50 potential** (56 if First Age scope is adopted for pass 1's gated 6). Target of 50–55 is met.

### Source quality
All 4 candidates sourced from Tolkien Gateway, with Celebrimbor cross-corroborated across two separate TG pages. No candidate relied on Wikipedia as sole source.

### Licensing concerns
None. All data in this pass is factual/structured (names, titles, dates, kinship, cause and location of death) — no copyrighted prose reproduced. No `REQUIRES LEGAL REVIEW` flags needed.

### Schema gaps
None new. No candidate in this pass resembles the Witch-king/Bombadil/Goldberry hard-gap pattern; the schema review's conclusion (no change needed) is not challenged by this pass's findings.

### Provenance requirements
Per §12: 4 new entries to add to `provenance/characters.sources.json` when/if these candidates are approved for insertion, with `entityIdStatus: "provisional"`, and — specifically for Maedhros — a note flagging the death year as this document's own inference rather than a directly-sourced fact.

---

## Verification

Only file created by this pass: `docs/CHARACTERS-CANDIDATES-003.md` (this file). `data/characters.json`, `provenance/characters.sources.json`, all code, DTOs, controllers, services, repositories, the dataset validator, and the frontend are unchanged. No git repository exists in this project (confirmed in a prior session task) — verification here is by direct statement of what was touched, not `git diff --stat`.
