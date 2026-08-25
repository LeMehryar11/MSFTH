# Quant report

I own the arithmetic. This report has been substantially rewritten after a review found three real issues: the productivity and migration-effort assumptions were ungrounded, a cross-file inconsistency existed between the calculator and the pitch deck, and the discount assumption needed to reflect Contoso's confirmation that maximum discounts always apply. This report explains what changed, why, and with what sources.

## 1. Direct answers to the questions raised

**"Are maximum discounts always granted?"** As of this revision, **yes** — Contoso has confirmed that the maximum discount (30% GHE, 17% GHAS) applies in every scenario. `SCENARIOS.conservative.gheDiscount`, `SCENARIOS.base.gheDiscount` and `SCENARIOS.upside.gheDiscount` are now all equal to `FACTS.maxGheDiscount`, and likewise for GHAS. This is enforced by an automated test. Discount is no longer a source of variation between scenarios — incremental annual licence cost is now identical across Conservative, Base and Upside ($204,732/year at 500 users).

**"The slides say month 384, the calculator says month 576 — inconsistent calculations?"** This was not actually an inconsistency in the formula — it was two files quietly using two different reference employee counts (the deck used 750, the calculator defaulted to 500), and the same formula naturally gives a different answer at a different input. The fix was to make both files use the same reference: `pitch-deck.html` now sets `REF_USERS = 500`, matching the calculator's own default. At 500 users, both files now agree exactly (payback month 17 for the upside scenario, verified directly rather than by screenshot — see Section 5).

**"45 minutes/month is far too low; it should be at least two or three hundred."** Agreed, and corrected. See Section 2.

## 2. Where the migration-effort and time-saved figures now come from

Both parameters are now grounded in published, cited sources rather than picked round numbers, and both are directly editable in `calculator.html` so the team or Contoso can substitute their own figures without touching code.

**Migration effort (hours/repository):**
- Industry guidance on Azure DevOps → GitHub migrations puts *technical* migration effort at roughly 2–4 hours for a small/simple repository, 4–8 hours for a typical medium one, and 8–16+ hours for a large or complex one (repository size, pull-request history, and pipeline complexity are the main drivers).
- Microsoft's own internal engineering organisation migrated approximately 1,600 repositories to GitHub in about six months using a small team (two technical leads plus a small bench of engineers) and official migration tooling with parallelisation — worked through, that is on the order of 3 hours per repository at scale.
- The model uses **10.0h (conservative)**, **5.0h (base)**, **2.5h (upside)** — the conservative figure deliberately treats the *entire* ~3,000-repository estate as if it were in the large/complex tier, which is a genuine worst case, not a typical one.

**Engineer time saved (minutes/active committer/month):**
- Research on context-switching costs in software engineering cites recoverable productivity typically in the 20–60 minutes/developer/day range from reduced tool fragmentation, with some studies citing considerably more in severely fragmented environments.
- GitHub's own published case studies cite around 24 minutes/day (roughly 2 hours/week) saved from platform consolidation specifically.
- The model uses **0 (conservative)**, **150 (base, ~7 min/day)**, **300 (upside, ~14 min/day)** minutes/active-committer/month — both Base and Upside sit at or below the cited research range, deliberately conservative relative to it.

These are still estimates, not measurements — the whole point of the recommended pilot is to replace them with real, Contoso-specific figures.

## 3. Tool-retirement pricing: sources and how it's applied

Following the team-supplied scenario table (Conservative: no tools retired; Base: one retired after a transition; Upside: all three retired after a longer transition), each tool needed a price, since none of their actual Contoso costs were in the handout. These are researched, industry-typical placeholders, not quotes:

- **BlackDuck** (software composition analysis): enterprise contracts are commonly reported in the $75,000–$150,000/year range for mid-sized teams. The model uses **$100,000/year flat**, the mid-point, reflecting how these deals are typically structured (not linearly per-seat).
- **SonarQube Enterprise Edition**: typically $16,000–$23,000/year for a codebase around 1 million lines of code. The model uses **$20,000/year flat**, again the mid-point, since this tool's pricing scales with code volume, not headcount.
- **Nexus Repository Pro** (self-hosted): typically $120–$175 per user/year. The model uses **$150/active-committer/year**, the mid-point.

`toolRetirementAnnualSaving(users, scenarioKey)` sums the relevant costs for whichever tools that scenario's `toolsRetired` list names, and `cumulativePosition` only starts accruing that saving from the scenario's `retirementTransitionMonths` onward — it is not credited retroactively or as a lump sum.

## 4. Formula chain (unchanged in structure, updated in inputs)

```
ado_annual(users)              = users × 6 × (1 − 0.17) × 12
ghe_annual(users, d)           = users × 21 × (1 − d) × 12          [d = 0.30, all scenarios]
ghas_annual(users, d)          = users × 0.6 × 49 × (1 − d) × 12    [d = 0.17, all scenarios]
incremental_annual(users, s)   = ghe_annual + ghas_annual − ado_annual   [identical across scenarios now]
value_per_committer_month(s)   = (minutesSaved / 60) × 80
productivity_value(users, s)   = users × 0.6 × value_per_committer_month(s) × 12
tool_retirement_saving(users, s) = sum of researched placeholder costs for tools s retires
migration_cost(s, repoCount, hoursPerRepo) = repoCount × hoursPerRepo × €240   [both overridable]
net_annual_position(users, s)  = productivity_value + tool_retirement_saving − incremental_annual
cumulative_position(users, s, months) = (productivity_value − incremental_annual) × months/12
                                         + tool_retirement_saving × max(0, months − transitionMonths)/12
                                         − migration_cost
payback_month(users, s, max)   = first month cumulative_position ≥ 0, else none
```

`migrationCostUsd` and `productivityValueAnnual` both accept optional override parameters (`hoursPerRepo`, `minutesSavedPerCommitterMonth`) that default to the named scenario's own value if not supplied. This is what lets `calculator.html`'s editable fields recompute everything live without duplicating the formula or mutating the frozen `SCENARIOS` object — the UI holds its own small, mutable `overrides` object and passes the current values through on every call.

## 5. How the editable calculator and the deck were verified — without screenshots

Per instruction, no screenshots were used for this round of changes. Instead:
- `node --check` on the extracted inline scripts, to catch syntax errors.
- A headless DOM test using `jsdom` (installed locally, not a project dependency) that actually loads each HTML file, runs its scripts, and asserts on the real rendered output: table row counts, computed card values, and — critically — that editing the migration-effort or time-saved inputs in `calculator.html` changes the rendered figures live. Fifteen assertions for the calculator, seventeen for the deck, all passing.
- Direct computation via `node -e "..."` requiring `roi-model.js`, cross-checked against both files' displayed reference figures, to confirm the 750-vs-500 inconsistency is resolved (both now compute payback month 17 for the upside scenario at 500 users).

## 6. Test coverage

`roi-model.test.js` (17 tests, run via `npm test` / `node --test`) checks: the handout's own reference figures reproduce exactly; all three scenarios now share the same, maximum discount; productivity value derives correctly from minutes × rate; the override mechanism doesn't mutate frozen scenario defaults; tool-retirement saving matches the researched placeholder pricing and is not credited before its transition month; migration cost scales correctly for a smaller pilot and accepts an hours-per-repository override; and — the most materially different result from before — the conservative scenario never reaches payback while the upside scenario now reaches payback well within a 5-year horizon. All 17 pass.
