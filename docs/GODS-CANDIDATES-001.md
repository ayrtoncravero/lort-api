# GODS-CANDIDATES-001 — Cosmological/Divine Entities Resource Research

Status: RESEARCH ONLY. No code, JSON, DTO, controller, service, repository, `explorerConfig.ts`, Swagger, or frontend file was modified. `data/characters.json` and `data/places.json` are untouched. Nothing here is authorized for implementation until reviewed and approved separately.

Labeling convention (unchanged): **FACT**, **SOURCE CLAIM**, **INFERENCE**, **RECOMMENDATION**. Where evidence is insufficient: "Not established by the reviewed sources."

**IMPORTANT, stated up front**: "God" is **not** a canonical Tolkien term — **SOURCE CLAIM**, well-documented: Tolkien's cosmology uses **Eru Ilúvatar** (the singular creator) and **Ainur** (the angelic order he created, subdivided into **Valar** and **Maiar**). "Gods" is used here only because the user's brief uses it as the working/UI-facing term; every section below is precise about which Tolkien-canonical term actually applies. This document builds directly on `docs/DATASET-RESEARCH-001.md` §5/§6 (Ainur Model A/B already proposed and compared there) and `docs/CHARACTER-SCHEMA-REVIEW-001.md` §3 (same Model A/B comparison, reapplied at the schema level) — those documents already did substantial work on this exact question and are **not re-derived from scratch here**; this document extends them into a full resource proposal.

Companion document: `docs/GOD-SCHEMA-REVIEW-001.md`.

---

## 1. Reconciling with the prior Ainur decision

**FACT**: this project already made a working decision — **Model B** (Ainur as a `Character.race` classification, e.g. `race: "Maia"`) — and has **shipped it**: Gandalf (id 2), Sauron (id 14), Saruman (id 15), Radagast (id 32), and Melian (id 46) all exist today as Character records with `race: "Maia"`.

This document does **not** propose undoing that decision. Creating a `/api/gods` resource now must be evaluated as **either**:
- **(a) contradicting** Model B (by also making Gandalf a "God" record — reintroducing the exact identity-duplication problem `DATASET-RESEARCH-001.md` §5 and `CHARACTER-SCHEMA-REVIEW-001.md` §3 both warned against), or
- **(b) extending** Model B (by building `/api/gods` to cover *only* the Ainur who are **not** already Characters — i.e., the Valar, who per `DATASET-RESEARCH-001.md` §6 "never appear as story-participating characters the way Gandalf does" — leaving the 5 already-shipped Maiar-as-Characters untouched), or
- **(c) coexisting** via an explicit back-reference (a `Gods` entry for Gandalf that stores no duplicate data, only `characterId: 2`, pointing at the existing Character record).

**RECOMMENDATION**: **(b), extending, not contradicting** — see §2 for the full model comparison and why (b) is recommended over (a) and (c).

---

## 2. Core question — what should `/api/gods` represent?

**Model A — God = Eru + Valar**: the creator plus the ~14 Valar. Excludes all Maiar (including the 5 already-shipped Character Maiar). Pros: cleanest possible scope — "the pantheon proper," no overlap with existing Characters at all (Eru and the Valar have zero existing Character records), zero identity-duplication risk. Cons: leaves out Sauron, Gandalf, Saruman, Melian, Radagast — arguably the Ainur an actual API consumer is *most* likely to look for, since they're the ones with plot relevance and existing Character records already in this dataset.

**Model B — God = Eru + Valar + Maiar**: everything in Model A, plus all notable Maiar (Gandalf, Saruman, Sauron, Radagast, Melian, and others — see §6). This is the scope the user's brief seems to lean toward ("Investigar el modelo: Eru Ilúvatar, Ainur, Valar, Maiar"). Pros: complete cosmological coverage. Cons: **directly re-triggers the identity-duplication problem** for the 5 already-shipped Maiar-Characters, unless resolved via an explicit link (§1c) rather than duplicated fields — this is not optional if Model B is adopted, it is a hard requirement.

**Model C — Ainur as the resource, "Gods" as a UI label only**: `/api/ainur` (matching the Tolkien-canonical term, per the note at the top of this document) with the frontend free to display "Gods" as a friendlier label, exactly the same UI-label/resource-name split already recommended for Races (`RACES-CANDIDATES-001.md` §2). Scope-wise, this is orthogonal to the A vs B question above — it is a **naming** decision that can be layered on top of either.

**Model D — no separate resource, keep everything in Characters**: do not build `/api/gods` or `/api/ainur` at all; Valar who are never Characters (Manwë, Varda, etc.) simply have **no representation anywhere** in this API. Pros: zero new resource, zero identity-duplication risk (there's nothing to duplicate). Cons: exactly the gap `DATASET-RESEARCH-001.md` §5 already flagged for Model B (Character-only) — "provides no way to model Valar who are not also individually-notable Characters."

**RECOMMENDATION**: **Model B (scope) + Model C (naming), combined, with explicit back-references for the overlap (§1c)** — i.e.: build `/api/ainur` (canonical name; frontend may label it "Gods"), scoped to Eru + Valar + Maiar, where every entry that *also* has a Character record stores a `characterId: number | null` back-reference and **no duplicated fields** (no re-storing `name`/`birth`/`death`/etc. that Character already owns) — entries with no Character record (Manwë, Varda, Eru himself if included, etc.) simply have `characterId: null`. This directly resolves the §1 reconciliation: it is an **extension** of Model B, not a contradiction, because the 5 existing Character-Maiar records are not touched, duplicated, or shadowed — they are referenced.

---

## 3. Duplication analysis — Gandalf, Saruman, Sauron, Radagast, Melian

All 5 are **FACT**, currently live as Characters with `race: "Maia"`. Under the recommended model (§2), each would get **one** `Ainur`/`Gods` catalog row with:
- `characterId` pointing at their existing Character id (2, 15, 14, 32, 46 respectively) — **not** a re-statement of `name`, `birth`, `death`, `realm`, etc., all of which already live on the Character record and would drift out of sync if duplicated.
- `type: "Maia"` (or equivalent) on the Ainur-catalog row — this is the piece of information the Character schema *doesn't* cleanly express today (per `CHARACTER-SCHEMA-REVIEW-001.md` §1/§3, `race: "Maia"` already does double duty as both "this is their kind" and "this is their cosmological order," which this document's Model B+C proposal would let `/api/ainur` express more precisely, without needing to change `Character.race` itself).

**RECOMMENDATION**: this is the **only** clean way to include these 5 in a Gods/Ainur resource without recreating the two-records-one-entity problem. A model that instead re-stores their name/dates on a separate God row would be a clear regression from this project's own established discipline.

---

## 4. Eru Ilúvatar — specific treatment

**FACT**: Eru has **no** existing Character record. **SOURCE CLAIM**: Eru is explicitly **outside and above** the Ainur order in Tolkien's cosmology — he created the Ainur, he is not one of them. This is a documented, meaningful distinction, not a technicality.

- **Should he be a Character?** No — he has no birth/death/realm/spouse/hair in any sense the Character schema expresses, and forcing him into that schema would be the same category error already avoided for Ainur generally (`CHARACTER-SCHEMA-REVIEW-001.md` §3).
- **Should he be a "God"/Ainur-catalog entry?** **Not cleanly** — he is not himself an Ainur; including him in the same table as Manwë/Gandalf under a shared `type` enum (`deity | Vala | Maia`) would need a 4th value (e.g. `type: "creator"`) used by exactly one row, which is a real, if minor, schema wart.
- **RECOMMENDATION**: include Eru as a **single special-cased row** with `type: "creator"` (a category of one, explicitly documented as such — the same "single-member category is acceptable when the source material genuinely has only one member" precedent already used for `Place.type: "region"` entries like Beleriand, and for Character's `Skin-changer` single-member race for Beorn in the deferred-candidate research). Do **not** omit him entirely — `DATASET-RESEARCH-001.md` §6 already flagged that omitting Eru from a hypothetical Ainur resource "would need special-casing," and a category-of-one `type` value is the lowest-cost way to include him honestly rather than mis-filing him under `Vala`.

---

## 5. Valar candidates

**SOURCE CLAIM**, corroborated via WebSearch this pass (Tolkien Gateway "Valar," "Host of the Valar," "Category:Valar" pages — direct `WebFetch` not attempted, per established HTTP 403 precedent) and cross-checked against `DATASET-RESEARCH-001.md` §6's already-researched list (same 9 names independently corroborated across both passes: Manwë, Varda, Ulmo, Aulë, Yavanna, Mandos/Námo, Nienna, Oromë, Tulkas):

Core, well-documented Valar (traditionally 14 "Aratar"/greater Valar plus a few more minor ones, per general legendarium structure — **SOURCE CLAIM**, not independently re-verified name-by-name against primary text in this pass): Manwë, Varda, Ulmo, Aulë, Yavanna, Námo (Mandos), Vairë, Estë, Irmo (Lórien), Nienna, Tulkas, Nessa, Oromë, Vána, and the fallen Melkor/Morgoth (a Vala by origin, before his corruption — already noted as a candidate in `DATASET-RESEARCH-001.md` §6).

**RECOMMENDATION**: prioritize the subset with clear plot/thematic relevance to material already in this dataset over an exhaustive 14-entry list — see §7's tiering, which recommends the 9 already cross-corroborated across two independent research passes as Tier 1, and treats the remaining 5–6 as Tier 2/3 (real, but thinner sourcing in this pass).

---

## 6. Maiar treatment

Beyond the 5 already-shipped Character-Maiar (§3), other notable Maiar exist in the legendarium (**SOURCE CLAIM**, general legendarium knowledge, not independently re-verified against primary text page-by-page in this pass): the Balrogs (including Gothmog, who killed Fingon per `CHARACTERS-CANDIDATES-003.md` §5's own Fingon entry — a direct link to an *existing* Character record), Ungoliant (sometimes classified as a primordial spirit of a different, disputed order rather than a straightforward Maia — **SOURCE CLAIM with documented ambiguity**, not resolved here), and Arien (guide of the Sun) and Tilion (guide of the Moon) as more minor examples.

**RECOMMENDATION**: include the Balrogs (Gothmog specifically, given the direct existing-Character link via Fingon) as a Tier 2 candidate; treat Ungoliant's classification ambiguity the same way this project has always handled unresolved source conflicts (document it, don't invent a resolution — same discipline as the Ar-Pharazôn death-date conflict in `CHARACTERS-CANDIDATES-002.md`).

---

## 7. Candidate table

| Candidate | Classification | Era | Existing Character? | Sources | Confidence | Schema fit | Recommended? |
|---|---|---|---|---|---|---|---|
| Eru Ilúvatar | Creator (outside Ainur order) | Outside time/eras | No | `DATASET-RESEARCH-001.md` §6, Tolkien Gateway | HIGH | Full, with `type: "creator"` special-case (§4) | **Yes** |
| Manwë | Vala | All eras | No | `DATASET-RESEARCH-001.md` §6, Tolkien Gateway (this pass) | HIGH | Full | **Yes** |
| Varda (Elbereth) | Vala | All eras | No | `DATASET-RESEARCH-001.md` §6, Tolkien Gateway (this pass) | HIGH | Full | **Yes** |
| Ulmo | Vala | All eras | No | `DATASET-RESEARCH-001.md` §6, Tolkien Gateway (this pass) | HIGH | Full | **Yes** |
| Aulë | Vala | All eras | No | `DATASET-RESEARCH-001.md` §6, Tolkien Gateway (this pass) | HIGH | Full | **Yes** |
| Yavanna | Vala | All eras | No | `DATASET-RESEARCH-001.md` §6, Tolkien Gateway (this pass) | HIGH | Full | **Yes** |
| Námo (Mandos) | Vala | All eras | No | `DATASET-RESEARCH-001.md` §6, Tolkien Gateway (this pass) | HIGH | Full | **Yes** |
| Nienna | Vala | All eras | No | `DATASET-RESEARCH-001.md` §6, Tolkien Gateway (this pass) | HIGH | Full | **Yes** |
| Oromë | Vala | All eras | No | `DATASET-RESEARCH-001.md` §6, Tolkien Gateway (this pass) | HIGH | Full | **Yes** |
| Tulkas | Vala | All eras | No | `DATASET-RESEARCH-001.md` §6, Tolkien Gateway (this pass) | HIGH | Full | **Yes** |
| Melkor / Morgoth | Vala (fallen) | First Age (active) | No | `DATASET-RESEARCH-001.md` §6, Tolkien Gateway | MEDIUM-HIGH | Full — `type: "Vala"`, notable status documented in Notes, not a new type value | **Yes** |
| Vairë | Vala | All eras | No | Tolkien Gateway (this pass, single-thread corroboration) | MEDIUM | Full | **Yes, Tier 2** |
| Estë | Vala | All eras | No | Tolkien Gateway (this pass, single-thread corroboration) | MEDIUM | Full | **Yes, Tier 2** |
| Irmo (Lórien) | Vala | All eras | No | Tolkien Gateway (this pass, single-thread corroboration) | MEDIUM | Full | **Yes, Tier 2** |
| Nessa | Vala | All eras | No | Tolkien Gateway (this pass, single-thread corroboration) | MEDIUM | Full | **Yes, Tier 2** |
| Vána | Vala | All eras | No | Tolkien Gateway (this pass, single-thread corroboration) | MEDIUM | Full | **Yes, Tier 2** |
| Gandalf (Olórin) | Maia | Third Age (active) | **Yes — id 2** | Existing dataset | HIGH | Full, via `characterId: 2` back-reference (§3), **no duplicated fields** | **Yes** |
| Saruman (Curumo) | Maia | Third Age (active) | **Yes — id 15** | Existing dataset | HIGH | Full, via `characterId: 15` | **Yes** |
| Sauron | Maia (corrupted, originally of Aulë) | All eras (active) | **Yes — id 14** | Existing dataset, `DATASET-RESEARCH-001.md` §5 | HIGH | Full, via `characterId: 14` | **Yes** |
| Radagast (Aiwendil) | Maia | Third Age (active) | **Yes — id 32** | Existing dataset | HIGH | Full, via `characterId: 32` | **Yes** |
| Melian | Maia | First Age (active) | **Yes — id 46** | Existing dataset | HIGH | Full, via `characterId: 46` | **Yes** |
| Gothmog (Lord of Balrogs) | Maia (Balrog) | First Age | No — but directly kills existing Character Fingon(48), per `CHARACTERS-CANDIDATES-003.md` §5 | Tolkien Gateway, `CHARACTERS-CANDIDATES-003.md` | MEDIUM | Full | **Yes, Tier 2** |
| Ungoliant | Disputed classification (primordial spirit, not clearly Maia) | First Age | No | Tolkien Gateway | MEDIUM (classification ambiguity, **SOURCE CLAIM conflict, not resolved**) | Full, with the classification ambiguity documented in Notes, not resolved | **Yes, Tier 2, flagged** |
| Arien | Maia (guide of the Sun) | All eras | No | Tolkien Gateway | LOW-MEDIUM (thin per-entity data) | Full | **No — Tier 3, thin data** |
| Tilion | Maia (guide of the Moon) | All eras | No | Tolkien Gateway | LOW-MEDIUM (thin per-entity data) | Full | **No — Tier 3, thin data** |

**Count researched in this table: 24.**

---

## 8. Confidence criteria applied

Unchanged from every prior candidate pass in this project: HIGH = corroborated across ≥2 independent source references or directly confirmed by this pass's own WebSearch with a clear result, or already established across 2 prior LORT documents (as is the case for the 9 core Valar and the 5 existing Character-Maiar). MEDIUM = reasonably established, single-source or typical-for-role, not independently cross-checked twice. LOW/LOW-MEDIUM = thin data, excluded from the recommended batch (Arien, Tilion).

---

## 9. Recommended candidate batch

**Tier 1 — Strong (HIGH confidence)**: Eru Ilúvatar, Manwë, Varda, Ulmo, Aulë, Yavanna, Námo, Nienna, Oromë, Tulkas, Melkor/Morgoth, Gandalf, Saruman, Sauron, Radagast, Melian.
**Count: 16**

**Tier 2 — Good (MEDIUM confidence)**: Vairë, Estë, Irmo, Nessa, Vána, Gothmog, Ungoliant (classification-flagged).
**Count: 7**

**Tier 3 — Defer (thin data)**: Arien, Tilion.
**Count: 2**

**Recommended batch (Tier 1 + Tier 2): 23 candidates.** Within the user's 15–30 target, not padded.

---

## Files created

- `docs/GODS-CANDIDATES-001.md` (this file) — new.
- `docs/GOD-SCHEMA-REVIEW-001.md` — new (companion document).

No other file was created, modified, or deleted. `data/characters.json`, all code/DTOs/controllers/services/repositories, `explorerConfig.ts`, Swagger, and the frontend are untouched.
