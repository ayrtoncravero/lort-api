# CHARACTERS-CANDIDATES-001 — Character Expansion Candidate List

Status: RESEARCH / DATA PREPARATION ONLY. No JSON, DTO, controller, service, repository, or frontend file was modified to produce this document. Nothing here is authorized for insertion into `data/characters.json` until reviewed and approved separately. Existing ids 1–19 are untouched and were not renumbered. All provisional ids below start at 20 and are **not stable/final** until a candidate is actually approved and inserted.

Labeling convention (per instructions): **FACT** (directly verifiable/observed in this repo), **SOURCE CLAIM** (asserted by a specific external source, not independently re-verified against Tolkien's primary text in this pass), **INFERENCE** (LORT's own reasoning), **RECOMMENDATION** (a proposal, not a decision). Where evidence is insufficient: "Not established by the reviewed sources." Missing field values are written as `null / unknown` — never `""`, `"Unknown"`, `"N/A"`, or `"?"`.

This document builds directly on `docs/DATASET-RESEARCH-001.md` (licensing stance, Ainur Model B lean, source classification, confidence criteria) — those conclusions are treated as already established and are not re-derived here.

---

## 1. Candidate research approach

Candidates were drawn from the pool already identified in `DATASET-RESEARCH-001.md` §3, cross-checked against the 19 existing `characters.json` records (FACT, read directly), and corroborated via WebSearch against Tolkien Gateway content (and, where TG itself was unreachable — see note below — via search-result synthesis of TG content, treated as SOURCE CLAIM with a lower-confidence discount). Wikipedia was never used as the sole source for any candidate.

**Tooling note (FACT):** direct `WebFetch` requests to `tolkiengateway.net` pages returned HTTP 403 (blocked) during this research pass. All Tolkien Gateway-attributed facts below are therefore **SOURCE CLAIM via WebSearch snippet synthesis**, not a direct page fetch — this is a lower-confidence path than a direct fetch would have been, and is reflected in the Confidence column (nothing sourced this way is marked HIGH purely on TG's authority alone; it is cross-checked against the in-repo existing-19 pattern and general legendarium consistency).

Priority followed the user's ordering: LOTR/Hobbit Third Age relevance first, Silmarillion/First Age only where structured data was clearly available, diversity of race/realm within what the schema can represent honestly (see §5 SCHEMA GAP flags).

---

## 2. Duplicate / alias check against the existing 19

Checked every candidate below against `characters.json` id 1–19 by name and by known alias.

- **No candidate below duplicates an existing record.** The 19 existing characters (Frodo, Gandalf, Aragorn, Legolas, Gimli, Sam, Galadriel, Boromir, Merry, Pippin, Arwen, Elrond, Bilbo, Sauron, Saruman, Éowyn, Faramir, Théoden, Gollum) are excluded from the candidate table entirely.
- **Alias watch-list** (documented per §4, not added as separate records): "Estel" / "Strider" / "Elessar" are all the same person as the existing `Aragorn II Elessar` (id 3) — not a new candidate. "Trotter" (early draft name) is not canonical and is excluded. "The Grey Pilgrim" / "Mithrandir" / "Olórin" are all the same person as existing `Gandalf` (id 2) — not a new candidate, documented only as a Notes entry where relevant (§13).
- No candidate in the table below was found to be an unlabeled duplicate of another candidate in the same table.

---

## 3. Canonical identity policy

RECOMMENDATION, documented here per instructions (not implemented as a schema field): each candidate uses **one canonical `name`** — the form most consistently used across Tolkien Gateway and the existing dataset's own naming convention (compare: existing dataset uses `"Aragorn II Elessar"`, `"Samwise Gamgee"`, i.e. fuller formal names rather than nicknames). Aliases/titles/epithets are noted in the Notes column only; no alias field exists in the current schema and none is proposed here (that would be a schema change, out of scope — see §5).

Examples of the policy applied below: `Thorin Oakenshield` (not "Thorin II" or "Thorin"), `Éomer` (not "Éomer Éadig"), `Denethor II` (not "Denethor", which is ambiguous with Denethor I).

---

## 4. Schema compatibility

Current schema (unchanged, per instructions): `id, name, race, gender, birth, death, hair, height, realm, spouse, wikiUrl`.

Every candidate in the recommended batch (§11) fits this schema without a workaround. Candidates that do **not** fit cleanly are flagged `SCHEMA GAP` in the Notes column and are **excluded from the Recommended V1 Expansion batch** (they remain listed, in Tier 3, for future schema discussion — not silently dropped):

- **Smaug** (Dragon) — `race: "Dragon"` is representable as a string, but `gender`/`spouse`/`hair` have no meaningful value for a dragon; the schema doesn't distinguish "not applicable" from "unknown," both of which currently collapse to `null`. SCHEMA GAP (soft — representable but semantically lossy).
- **Treebeard (Fangorn)** — `race: "Ent"` is representable; same soft gap as Smaug for `hair`/`spouse` (Ents have no "spouse" in the human sense; the Entwives are lost, not divorced/widowed in a way the field can express). SCHEMA GAP (soft).
- **Shelob** — same soft gap as Smaug (giant spider, no `gender`/`spouse`/`hair` semantics). SCHEMA GAP (soft).
- **Witch-king of Angmar** — HARD SCHEMA GAP. Originally a Man, transformed into a wraith by a Ring — a single `race` string cannot express "formerly Human, now Nazgûl" without either lying (picking one) or inventing a workaround, which is explicitly forbidden. Excluded from the recommended batch; kept in Tier 3 pending a schema decision (e.g., a `formerRace`/transformation concept), not resolved here.
- **Tom Bombadil / Goldberry** — SCHEMA GAP of a different kind: `race` has no established canonical value at all (Tolkien deliberately left Bombadil's nature unresolved — SOURCE CLAIM, well-documented ambiguity). Forcing any string into `race` would misrepresent the source material as more certain than it is. Excluded from the recommended batch on this basis, not on relevance grounds.
- **Beorn** — soft gap: "skin-changer" is a unique one-member category; representable as `race: "Skin-changer"` but with no peer group, similar to the Ent/Dragon/Shelob cases. Included in Tier 2 (soft gap, not hard) since a single descriptive string is defensible, unlike Bombadil/Witch-king.

No workaround field was invented for any of the above. They are reported, not patched.

---

## 5. Candidate table

`null / unknown` used throughout for unverified fields. Suggested IDs are provisional and sequential per this document only — not reserved, not final, not written anywhere else.

| Candidate | Suggested ID | Race | Gender | Birth | Death | Realm | Sources | Confidence | Notes |
|---|---:|---|---|---|---|---|---|---|---|
| Thorin Oakenshield | 20 | Dwarf | Male | TA 2746 | TA 2941 | Erebor | Tolkien Gateway (via search synthesis), existing-dataset pattern | HIGH | King Under the Mountain; The Hobbit lead dwarf. Dates cross-corroborated across multiple secondary sources in this pass. |
| Denethor II | 21 | Human | Male | TA 2930 | TA 3019 | Gondor | Tolkien Gateway (via search synthesis) | HIGH | 26th Ruling Steward of Gondor; father of Boromir (id 8)/Faramir (id 17) — both already in dataset, so this fills a clear relational gap. `spouse` not corroborated in this pass → `null / unknown` (his wife Finduilas is SOURCE CLAIM from general legendarium knowledge, not independently re-verified here). |
| Éomer | 22 | Human | Male | TA 2991 | FO 63 | Rohan | Tolkien Gateway (via search synthesis) | HIGH | 18th King of Rohan; nephew of Théoden (id 18, already in dataset). `spouse` (Lothíriel) not corroborated in this pass → `null / unknown`. |
| Elendil | 23 | Human (Númenórean) | Male | SA 3119 | SA 3441 | Arnor and Gondor (Realms in Exile) | Tolkien Gateway (via search synthesis) | HIGH | Founder of the Realms in Exile; Aragorn's distant ancestor; Second Age figure — note this extends the dataset's temporal range beyond pure Third Age (flagged, see §15). |
| Isildur | 24 | Human (Númenórean) | Male | SA 3209 | TA 2 | Arnor and Gondor | Tolkien Gateway | HIGH | Son of Elendil (candidate 23); cut the One Ring from Sauron's hand. Death year (`TA 2`) corroborated in prior research pass (`DATASET-RESEARCH-001.md` §3), not re-fetched independently in this pass — confidence held at HIGH based on consistency across passes, not a fresh independent source. |
| Celeborn | 25 | Elf | Male | Before YT 1050 (First Age, exact year not established) | null / unknown | Lothlórien | Tolkien Gateway (via search synthesis) | MEDIUM | Already referenced as free-text `spouse: "Celeborn"` on existing Galadriel (id 7) — adding him as his own Character record creates the same "spouse is a free-text string, not a relation" inconsistency noted in `DATASET-RESEARCH-001.md` §4; documented, not resolved here (schema question, out of scope). |
| Thranduil | 26 | Elf | Male | null / unknown | null / unknown | Woodland Realm (Mirkwood) | Tolkien Gateway | MEDIUM-HIGH | King of the Woodland Realm; father of existing Legolas (id 4) — fills a clear relational gap. Birth/death not established in the sources reviewed this pass. |
| Bard the Bowman | 27 | Human | Male | null / unknown | null / unknown | Dale (founder) | Tolkien Gateway | MEDIUM | Slew Smaug; later King of Dale. Precise birth/death not established in sources reviewed. |
| Balin | 28 | Dwarf | Male | TA 2763 (SOURCE CLAIM, not independently re-verified this pass) | TA 2994 | Moria (briefly, as Lord of Moria) | Tolkien Gateway (via prior pass + search) | MEDIUM-HIGH | Member of Thorin's Company; later died retaking Moria (relevant to Fellowship's Moria chapter). |
| Fili | 29 | Dwarf | Male | TA 2859 | TA 2941 | Erebor | Tolkien Gateway | MEDIUM | Member of Thorin's Company; died defending Thorin at the Battle of the Five Armies. |
| Kili | 30 | Dwarf | Male | TA 2864 | TA 2941 | Erebor | Tolkien Gateway | MEDIUM | Same battle/context as Fili (29). |
| Dwalin | 31 | Dwarf | Male | TA 2772 | null / unknown | Erebor | Tolkien Gateway | MEDIUM | Member of Thorin's Company; survives the events of The Hobbit. |
| Radagast | 32 | Maia | Male | Before Arda | null / unknown | null / unknown | Tolkien Gateway | MEDIUM | One of the Istari (Wizards), like existing Gandalf (id 2)/Saruman (id 15). Special-entity flag — see §13. |
| Treebeard (Fangorn) | 33 | Ent | Male | null / unknown (described as one of the oldest living things in Middle-earth) | null / unknown | Fangorn Forest | Tolkien Gateway | MEDIUM | SCHEMA GAP (soft) — see §4. Included in Tier 2, not the strict recommended batch, pending the soft-gap review. |
| Círdan | 34 | Elf | Male | Before the Years of the Trees (extremely early; exact year not established) | null / unknown | Grey Havens | Tolkien Gateway | MEDIUM | Shipwright; sends the Ring-bearers to Valinor at the end of LOTR. |
| Glorfindel | 35 | Elf | Male | First Age (exact year not established) | null / unknown | Rivendell | Tolkien Gateway | LOW-MEDIUM | SOURCE CLAIM conflict flag: Tolkien Gateway and secondary sources disagree on whether the Third Age Rivendell Glorfindel is the same individual reincarnated from a First Age death in Gondolin, or a distinct namesake. This document does **not** resolve that conflict — documented per instruction §17, not invented an answer. |
| Gríma Wormtongue | 36 | Human | Male | null / unknown | FO 3 (approx.; not independently re-verified this pass) | Rohan | Tolkien Gateway | MEDIUM | Counselor-turned-traitor to Théoden (id 18, existing); kills Saruman (id 15, existing) at the end of LOTR — two direct relational links to existing records. |
| Beorn | 37 | Skin-changer | Male | null / unknown | null / unknown | Vales of Anduin | Tolkien Gateway | MEDIUM | SCHEMA GAP (soft, single-member category) — see §4. Included in Tier 2. |
| Barliman Butterbur | 38 | Human | Male | null / unknown | null / unknown | Bree | Tolkien Gateway | MEDIUM | Innkeeper of The Prancing Pony; minor but recurring and well-documented role. |
| Elrohir | 39 | Elf | Male | TA 130 (SOURCE CLAIM, not independently re-verified this pass) | null / unknown | Rivendell | Tolkien Gateway | MEDIUM | Son of existing Elrond (id 12) — twin of candidate 40. |
| Elladan | 40 | Elf | Male | TA 130 (SOURCE CLAIM, twin of above, same caveat) | null / unknown | Rivendell | Tolkien Gateway | MEDIUM | Son of existing Elrond (id 12) — twin of candidate 39. |
| Anárion | 41 | Human (Númenórean) | Male | SA 3229 | SA 3440 | Gondor (co-founder) | Tolkien Gateway | MEDIUM-HIGH | Son of Elendil (candidate 23); co-founder of Gondor with brother Isildur (candidate 24). |
| Farmer Maggot | 42 | Hobbit | Male | null / unknown | null / unknown | The Shire | Tolkien Gateway | LOW-MEDIUM | Minor Shire character, early Fellowship chapters. Included in Tier 3 (relevance is real but data is thin), not the recommended batch. |
| Húrin | 43 | Human | Male | FA (First Age; exact year not independently re-verified this pass) | FA | Dor-lómin (First Age realm) | Tolkien Gateway, Silmarillion | MEDIUM-HIGH | First Age — a deliberate scope decision flag, see §15. Not included in the recommended batch unless the First Age scope question is resolved by the project owner first. |
| Túrin Turambar | 44 | Human | Male | FA | FA | Nargothrond / Dor-lómin | Tolkien Gateway, Silmarillion, Children of Húrin | MEDIUM-HIGH | Same First Age scope flag as Húrin (43); son of Húrin. |
| Beren | 45 | Human | Male | FA | FA | Dorthonion / Doriath | Tolkien Gateway, Silmarillion | MEDIUM-HIGH | Same First Age scope flag. |
| Lúthien | 46 | Elf | Female | FA | FA (and a unique second death/mortal choice — SOURCE CLAIM, notable legendarium event) | Doriath | Tolkien Gateway, Silmarillion | MEDIUM-HIGH | Same First Age scope flag; spouse of Beren (45) — if both added, this is a real relational pair, same pattern as existing Aragorn/Arwen (ids 3/11). |
| Fëanor | 47 | Elf | Male | YT (Years of the Trees; First Age era) | FA | Formenos / Tirion (exile) | Tolkien Gateway, Silmarillion | MEDIUM-HIGH | Same First Age scope flag; maker of the Silmarils — central Silmarillion figure. |
| Eärendil | 48 | Half-elven | Male | FA | Undated (granted immortality, sails the sky as a star — SOURCE CLAIM, well-known legendarium event, not a "death" in the normal sense) | Gondolin / the Sea | Tolkien Gateway, Silmarillion | MEDIUM-HIGH | Same First Age scope flag; ancestor of Elrond (id 12, existing) and, through him, of Arwen (id 11) and Elladan/Elrohir (39/40) — real relational chain if First Age scope adopted. `death` field is conceptually ill-fitting here (see §15 note on calendar/field strain). |
| Smaug | — (not assigned) | Dragon | null / unknown | null / unknown | TA 2941 | Erebor (occupied) | Tolkien Gateway | MEDIUM | SCHEMA GAP (soft) — see §4. Excluded from recommended batch; Tier 3. |
| Shelob | — (not assigned) | Giant Spider | null / unknown | null / unknown | TA 3019 | Cirith Ungol | Tolkien Gateway | MEDIUM | SCHEMA GAP (soft) — see §4. Excluded from recommended batch; Tier 3. |
| Witch-king of Angmar | — (not assigned) | (transformed — see §4) | Male (originally) | null / unknown | TA 3019 | Angmar / Minas Morgul | Tolkien Gateway | LOW-MEDIUM | HARD SCHEMA GAP — see §4. Excluded from recommended batch entirely; Tier 3, pending schema discussion. |
| Tom Bombadil | — (not assigned) | (undetermined — see §4) | Male | null / unknown | null / unknown | The Old Forest (Withywindle) | Tolkien Gateway, published text | LOW | HARD SCHEMA GAP — see §4. Excluded. |
| Goldberry | — (not assigned) | (undetermined — see §4) | Female | null / unknown | null / unknown | The Old Forest | Tolkien Gateway | LOW | HARD SCHEMA GAP — see §4. Excluded. |

---

## 6. Confidence criteria applied

- **HIGH**: corroborated across at least two independent secondary sources in this pass, and/or consistent with the prior `DATASET-RESEARCH-001.md` pass, with no unresolved conflicts found.
- **MEDIUM / MEDIUM-HIGH**: reasonably established (single search-synthesis source, or dates typical for the character's documented role) but not independently cross-checked against a second source in this pass.
- **LOW / LOW-MEDIUM**: either genuinely ambiguous in-universe (Bombadil, Goldberry), thinly documented (Farmer Maggot), or has a known source conflict (Glorfindel identity question).

Per instruction, **LOW-confidence candidates are excluded from the Recommended V1 Expansion batch** (§11) — they remain visible in the table (§5) and in Tier 3 (§12) for future research, not silently dropped.

---

## 7. Sources (per-candidate sourcing discipline)

Every candidate above cites at least one source in its row. No candidate relies on Wikipedia alone — where Wikipedia appeared in raw search results, it was treated as corroboration only, never as the primary citation. `wikiUrl` values are deliberately left as `null / unknown` in this document for every candidate: per instruction §9, no URL was invented, and no page was independently fetched and verified as live in this pass (WebFetch to tolkiengateway.net was blocked — see §1 tooling note). Assigning a `lotr.fandom.com` or `tolkiengateway.net` URL without having verified the exact page in this pass would risk introducing an unverified link, which the instructions explicitly forbid ("no inventar URLs").

---

## 8. Licensing / redistribution per candidate

Consistent with `DATASET-RESEARCH-001.md` §14: every field proposed above is **factual/structured data** (names, race, dates, realms, family relations) — not copyrighted prose, not verbatim text. Per the established licensing strategy, factual data of this kind does not require the HarperCollins/Estate permission process that verbatim quotes require (§12 of the prior document). No candidate in this table required a `REQUIRES LEGAL REVIEW` flag on this basis.

The one exception class: if any candidate's Notes field is ever expanded into descriptive prose copied from a specific source (not done here — Notes above are LORT's own short structured summaries), that would need to be re-evaluated under the same "facts vs. copyrighted expression" distinction. Flagging this as a **process reminder**, not a finding against any specific candidate.

---

## 9. Wiki URLs

As stated in §7: all `wikiUrl` values in this document are `null / unknown`. No URL was fabricated. If candidates are approved for actual insertion, `wikiUrl` values should be independently verified (page loads, matches the candidate) at that time — not carried over from this document.

---

## 10. Confidence tiers — see §6 above (criteria) and §12 below (assignment)

---

## 11. Recommended V1 Expansion (Tier 1 + Tier 2 only, LOW confidence excluded)

This selects the candidates that are both schema-compatible (no hard gap) and MEDIUM confidence or higher, biased toward Third Age/LOTR-Hobbit-era per `DATASET-RESEARCH-001.md`'s recommendation to keep sourcing quality high (§16/§21 there).

| Provisional ID | Name | Reason for inclusion | Confidence | Source quality | Schema compatibility |
|---:|---|---|---|---|---|
| 20 | Thorin Oakenshield | Central Hobbit-era figure, cross-corroborated dates | HIGH | Multi-source corroborated | Full |
| 21 | Denethor II | Fills direct relational gap (father of existing Boromir/Faramir) | HIGH | TG via search synthesis | Full |
| 22 | Éomer | Fills direct relational gap (nephew of existing Théoden) | HIGH | TG via search synthesis | Full |
| 23 | Elendil | Major Second Age/Gondor-founding figure, ancestor of existing Aragorn | HIGH | TG via search synthesis | Full |
| 24 | Isildur | Direct plot relevance (the Ring), son of 23 | HIGH | TG (prior + current pass) | Full |
| 26 | Thranduil | Fills relational gap (father of existing Legolas) | MEDIUM-HIGH | TG | Full |
| 28 | Balin | Thorin's Company, Moria relevance (ties to Fellowship) | MEDIUM-HIGH | TG | Full |
| 29 | Fili | Thorin's Company | MEDIUM | TG | Full |
| 30 | Kili | Thorin's Company | MEDIUM | TG | Full |
| 31 | Dwalin | Thorin's Company | MEDIUM | TG | Full |
| 41 | Anárion | Co-founder of Gondor with 23/24 | MEDIUM-HIGH | TG | Full |
| 27 | Bard the Bowman | Slew Smaug, founded Dale | MEDIUM | TG | Full |
| 32 | Radagast | Completes the three movie-relevant Istari alongside existing Gandalf/Saruman | MEDIUM | TG | Full |
| 34 | Círdan | Named, plot-relevant (Grey Havens departure) | MEDIUM | TG | Full |
| 36 | Gríma Wormtongue | Direct relational gap (Théoden's counselor, Saruman's killer) | MEDIUM | TG | Full |
| 38 | Barliman Butterbur | Recurring, well-documented minor role | MEDIUM | TG | Full |
| 39 | Elrohir | Son of existing Elrond | MEDIUM | TG | Full |
| 40 | Elladan | Son of existing Elrond (twin of 39) | MEDIUM | TG | Full |
| 25 | Celeborn | Already implicitly referenced via existing Galadriel's `spouse` string | MEDIUM | TG | Full (but see §5 spouse-as-string caveat) |

**Count in this batch: 19.** This does **not** reach the 30–50 range on its own with only MEDIUM+ confidence, schema-clean, Third-Age-biased candidates. Reaching 30–50 additional records (19 → ~50–70 total) requires **one explicit scope decision by the project owner**: whether to adopt the First Age/Silmarillion candidates (Húrin, Túrin, Beren, Lúthien, Fëanor, Eärendil — 6 more, all MEDIUM-HIGH confidence, schema-compatible) — see §15. With that inclusion, the batch reaches **25**, still short of 30-50 without further research into additional First-Age or Second-Age figures not covered in this pass (e.g. more of the Silmarillion's Noldor princes, more Númenórean kings) — **not established by the reviewed sources in this pass**; flagged as a gap in this document's coverage, not filled with invented candidates.

RECOMMENDATION: treat this document's 19 (or 25 with First Age) as a **first tranche**, not the final expansion — a second research pass focused specifically on Second Age (Númenor) and First Age (Silmarillion/Noldor) figures would be needed to responsibly reach the 50–70 target without lowering the confidence bar below MEDIUM.

---

## 12. Tiering

### Tier 1 — Strong candidates (well-documented, schema-clean, HIGH confidence)
Thorin Oakenshield (20), Denethor II (21), Éomer (22), Elendil (23), Isildur (24).
**Count: 5**

### Tier 2 — Good candidates (relevant, schema-clean, MEDIUM/MEDIUM-HIGH confidence, some data gaps)
Thranduil (26), Bard the Bowman (27), Balin (28), Fili (29), Kili (30), Dwalin (31), Radagast (32), Círdan (34), Gríma Wormtongue (36), Barliman Butterbur (38), Elrohir (39), Elladan (40), Anárion (41), Celeborn (25), Treebeard (33, soft schema gap), Beorn (37, soft schema gap), plus the six First Age candidates (Húrin, Túrin Turambar, Beren, Lúthien, Fëanor, Eärendil) *if* First Age scope is adopted.
**Count: 22 (16 without First Age scope decision, +6 if First Age adopted)**

### Tier 3 — Research later (interesting, but LOW confidence, hard schema gap, or thin data)
Glorfindel (35, source conflict on identity), Farmer Maggot (42, thin data), Smaug, Shelob, Witch-king of Angmar, Tom Bombadil, Goldberry (all hard/soft schema gaps per §4).
**Count: 7**

**Total candidates researched in this document: 34** (5 Tier 1 + 22 Tier 2 + 7 Tier 3).

---

## 13. Special entities (Maiar / Valar / Ainur)

Per `DATASET-RESEARCH-001.md` §5/§6, Model B (classification on Character, no separate resource, no duplicate identity) remains the working recommendation. Applied here:

- **Radagast (32)** — Maia (Istar), same category as existing Gandalf (id 2, `race: "Maia"`) and Saruman (id 15, `race: "Maia"`). If added, would use `race: "Maia"`, consistent with the existing pattern — no new field, no duplicate record.
- No other candidate in this table is a Maia, Vala, or other Ainur-order being. Glorfindel (35) is sometimes associated with angelic/reincarnation theories in secondary discussion, but this is **not established by the reviewed sources** as canon fact — not classified as Ainur here; flagged only as the identity-conflict note already in §5.
- No Ainur resource was created. No candidate was represented twice.

---

## 14. Avoid over-expansion — check applied

Every candidate excluded from the recommended batch (§11) was excluded for a stated reason (LOW confidence, hard schema gap, or thin/single-mention data) — see §12 Tier 3. No candidate was included solely because they are "mentioned once"; Farmer Maggot, the thinnest-data inclusion, still has a named, recurring (multi-chapter) role, and was placed in Tier 3 rather than the recommended batch specifically because of thin structured data, not to pad the count.

---

## 15. Current dataset audit (19 existing, read-only, nothing changed)

Cross-referencing the live `characters.json` against this research pass:

- **`birth`/`death` calendar notation**: existing records consistently use Third Age (`TA`) and Fourth Age (`FO`) notation. Several strong Tier 1/2 candidates above (Elendil, Isildur, Anárion — Second Age; Húrin, Túrin, Beren, Lúthien, Fëanor, Eärendil — First Age) would introduce **SA** and **FA**/**YT** notations not currently present anywhere in the live dataset. This is not an error in the existing 19, but a **scope-widening consequence** worth flagging before any insertion: the dataset's implicit "era" would expand for the first time. RECOMMENDATION: this should be an explicit decision, not an incidental one.
- **`realm` free-text values**: existing records use realm names (`"The Shire"`, `"Gondor"`, `"Rohan"`, `"Mordor"`, `"Rivendell"`, `"Lothlorien"`, `"Erebor"`, `"Isengard"`, `"Woodland Realm"`) — all candidates in §11 reuse this same set of realm strings (or introduce a small number of new ones: `"Arnor and Gondor"`, `"Dale"`, `"Moria"`, `"Grey Havens"`, `"Bree"`, `"Fangorn Forest"`, `"Vales of Anduin"`, `"Angmar / Minas Morgul"`) — no candidate invents an implausible or unverifiable realm string.
- **`spouse` as free-text**: already flagged as a modeling inconsistency in `DATASET-RESEARCH-001.md` §4 (not a numeric relation). This audit confirms the inconsistency would grow if Celeborn (25) is added while Galadriel (id 7) still stores `spouse: "Celeborn"` as a string rather than a relation to the new Character record — two records describing a real relationship with no structural link between them. Documented, not resolved (schema question, explicitly out of scope for this task).
- **`wikiUrl` domain**: existing 19 all use `lotr.fandom.com` (FACT, re-confirmed by reading the file again in this pass). This document deliberately does **not** propose any new `wikiUrl` values (§9) — so no domain-consistency decision is forced by this document; noting only that *if* candidates are approved later, matching the existing `lotr.fandom.com` domain convention (rather than mixing in `tolkiengateway.net`) would be the consistent choice, without pre-deciding it here.
- **Overall**: the existing 19 show no internal errors found in this pass. Fields that would benefit from eventual corroboration (per `DATASET-RESEARCH-001.md` §20, not repeated in full here): `birth`/`death` dates are internally consistent but not independently re-verified against primary text in either research pass; `wikiUrl` targets a Fandom wiki whose own licensing terms have not yet been researched (flagged previously, still open).

---

## 16. Provenance proposal (conceptual only, not implemented)

Consistent with `DATASET-RESEARCH-001.md` §15's proposed (not implemented) `provenance/` directory concept, extended here with a concrete example using an actual candidate from this document:

```json
{
  "entityId": 20,
  "sources": [
    {
      "name": "Tolkien Gateway (via search synthesis — direct fetch blocked in this pass)",
      "url": "https://tolkiengateway.net/wiki/Thorin",
      "confidence": "HIGH",
      "notes": "Birth TA 2746 / death TA 2941 corroborated across multiple secondary sources in this research pass. Direct WebFetch to Tolkien Gateway returned HTTP 403; sourced via search-result synthesis instead — flagged for a future direct-fetch verification pass before treating as fully authoritative.",
      "accessedAt": "2026-08-28"
    }
  ]
}
```

This remains a **proposal**, not a file — nothing under `provenance/` was created. If adopted, `characters.sources.json` would hold one such entry per character id (existing 1–19 included retroactively, and any newly-approved 20+ ids), living outside the public API response, per the prior document's guidance.

---

## 17. Important distinction — applied throughout

Every "SOURCE CLAIM" label above means exactly that: an external source (or search-synthesized reflection of one) asserts the fact, not that LORT has independently confirmed it against Tolkien's primary published text in this pass. Where sources conflicted (Glorfindel identity, §5) or where a fact could not be established (most `birth`/`death`/`spouse` fields marked `null / unknown`), no invented answer was substituted. The Glorfindel conflict specifically is documented, not resolved.

---

## 18. Final recommendation

### Recommended Characters Dataset
**Count: 19 (existing) + 19 (this document's clean recommended batch) = 38**, or **19 + 25 = 44** if the First Age/Silmarillion scope question (§15) is resolved affirmatively by the project owner.

**Why:** This is the largest set achievable in this research pass while holding the line at MEDIUM confidence or higher, full schema compatibility (no hard gaps), and no duplicate/alias records — consistent with the user's explicit instruction to prioritize quality and verifiability over hitting a specific number. It does not yet reach the 50–75 target; reaching that responsibly requires a second, more targeted research pass (see §11) plus one explicit scope decision (First Age or not).

### Characters to defer
- Tier 3 entities (§12): Glorfindel (unresolved identity conflict), Farmer Maggot (thin data), Smaug/Shelob/Beorn/Treebeard (schema gaps, soft), Witch-king of Angmar/Tom Bombadil/Goldberry (schema gaps, hard).
- All First Age/Silmarillion candidates, pending an explicit scope decision from the project owner (not assumed here either way).
- Any candidate beyond the 34 researched in this document — a second research pass is needed, not invented placeholders.

### Schema gaps
- **Hard**: Witch-king of Angmar (transformation not representable), Tom Bombadil / Goldberry (no established `race` value exists to assign).
- **Soft**: Smaug, Shelob, Treebeard, Beorn (representable but `gender`/`spouse`/`hair` are semantically empty for these entities, and the schema can't distinguish "not applicable" from "unknown").
- **Structural, not entity-specific**: `spouse` as free-text rather than a numeric relation (affects Celeborn/Galadriel pairing, and would affect Beren/Lúthien and Elendil-lineage records if First Age scope is adopted) — flagged, not fixed, per instructions.

### Licensing concerns
None specific to this candidate batch — all proposed data is factual/structured, consistent with `DATASET-RESEARCH-001.md`'s conclusion that facts do not require the Estate/HarperCollins permission process that verbatim text requires. No `REQUIRES LEGAL REVIEW` flags were needed in this document.

### Current 19 review
No errors found. One structural note carried forward and reinforced by this pass: `spouse` free-text will become an increasingly visible inconsistency as more spouse-pair candidates (Celeborn, Beren/Lúthien) are considered — a schema decision, not a data-quality defect, and explicitly out of scope for this task.

### Provenance recommendation
Adopt the `provenance/characters.sources.json` structure proposed in §16 (and originally in `DATASET-RESEARCH-001.md` §15) **before** any candidate from this document is actually inserted into `characters.json` — so that every new record's sourcing is auditable from day one, rather than retrofitted later. Not implemented as part of this task.

---

## Files created

- `docs/CHARACTERS-CANDIDATES-001.md` (this file) — new.

No other file was created, modified, or deleted. `data/characters.json` and the existing 19 records are untouched.
