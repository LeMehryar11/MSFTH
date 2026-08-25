# ROI Model — Formula Specification (Quant)

This is the human-readable specification for `roi-model.js`, the single source of calculations used by both `calculator.html` and `pitch-deck.html`. If this document and the code ever disagree, the code is the implementation and this document should be corrected to match it — do not maintain two separate formulas. For the reasoning behind each assumption, see `Sceptic-Report.md`, `Advocate-Report.md`, `Neutral-Report.md` and `Quant-Report.md`.

## 1. Facts (from the handout — do not edit without a new handout figure)

| Fact | Value |
|---|---|
| GitHub Enterprise Platform (GHE) list price | $21/user/month |
| GitHub Advanced Security (GHAS) list price | $49/user/month |
| Active committers (GHAS applies to this share only) | 60% of users |
| Azure DevOps (ADO) list price | $6/user/month |
| ADO current applied discount | 17% |
| Private repositories to migrate | ~3,000 |
| Preferred migration partner rate | €240/hour/person |
| Maximum GHE discount | 30% |
| Maximum GHAS discount | 17% |

## 2. Scenario assumptions (team estimates — require Contoso validation)

| Parameter | Conservative | Base | Upside |
|---|---|---|---|
| GHE discount applied | **0%** (no discount secured) | 15% | 30% (= handout maximum) |
| GHAS discount applied | **0%** | 8% | 17% (= handout maximum) |
| Migration effort (hours/repository) | 3.0 | 1.5 | 0.75 |
| Engineer time saved (min/active committer/month) | 0 | 15 | 45 |
| → implied value ($/active committer/month, at $80/hour) | $0 | $20 | $60 |

Only the upside discounts equal a handout fact (the stated maximum). Everything else, including the conservative discount, is a labelled team assumption — the conservative case assumes **no discount has been secured at all**, since nothing below the maximum is guaranteed by the handout. See `Sceptic-Report.md`, `Advocate-Report.md` and `Neutral-Report.md` for why each figure was chosen.

## 3. Formulas

```
ado_annual(users)              = users × 6 × (1 − 0.17) × 12
ghe_annual(users, d)           = users × 21 × (1 − d) × 12
ghas_annual(users, d)          = users × 0.6 × 49 × (1 − d) × 12
github_annual(users, scenario) = ghe_annual(users, scenario.gheDiscount)
                                  + ghas_annual(users, scenario.ghasDiscount)
incremental_annual(users, s)   = github_annual(users, s) − ado_annual(users)
value_per_committer_month(s)   = (s.minutesSavedPerCommitterMonth / 60) × 80   ($80/hour placeholder rate)
productivity_value(users, s)   = users × 0.6 × value_per_committer_month(s) × 12
migration_cost(s, repoCount)   = repoCount × s.migrationHoursPerRepo × €240
                                  (converted to USD at an illustrative 1:1 rate — see caveat below;
                                   repoCount defaults to ~3,000 but can be set smaller, e.g. for a pilot)
net_annual_position(users, s)  = productivity_value(users, s) − incremental_annual(users, s)
cumulative_position(users, s, months)
                                = net_annual_position(users, s) × months / 12 − migration_cost(s)
payback_month(users, s, max)   = first month where cumulative_position ≥ 0, else "not reached"
```

Migration cost does not depend on the employee-count input — it is driven by repository count, which is a separate, fixed quantity (or a smaller, explicitly chosen pilot count).

## 4. Worked example (matches the handout exactly)

At 500 users and maximum discounts (the upside scenario's discount tier):
```
ghe_annual  = 500 × 21 × 0.70 × 12 = $88,200
ghas_annual = 500 × 0.6 × 49 × 0.83 × 12 = $146,412
github_annual = $234,612   ← matches the handout's figure exactly
ado_annual = 500 × 6 × 0.83 × 12 = $29,880   ← matches the handout's figure exactly
```

## 5. Results at 750 users (planning midpoint, not a commitment), 24 months

| Metric | Conservative | Base | Upside |
|---|---|---|---|
| Incremental annual licence cost vs ADO | $408,780 | $359,262 | $307,098 |
| Productivity/consolidation value (annual) | $0 | $108,000 | $324,000 |
| Net annual position | -$408,780 | -$251,262 | +$16,902 |
| One-off migration cost (full ~3,000 repos) | $2,160,000 | $1,080,000 | $540,000 |
| Cumulative position at month 24 | -$2,977,560 | -$1,582,524 | -$506,196 |
| Payback within 5 years (60 months) | Not reached | Not reached | Not reached |
| Payback ever (uncapped horizon) | Not reached | Not reached | Month 384 (~32 years) |

## 6. Recommended pilot scope (a small, bounded alternative to the full estate)

| Metric | Recommended pilot | Full migration (base-case assumptions) |
|---|---|---|
| Users | 100 | 750 (planning midpoint) |
| Repositories migrated | 300 (10%) | ~3,000 (100%) |
| Advanced Security included | No | Scenario-dependent |
| Migration cost | $108,000 | $1,080,000 |
| Licence cost (GHE only, 6 months) | $10,710 | $359,262/year incremental (GHE+GHAS) |
| Total bounded cost | **$118,710** | Not recommended at this time |

The pilot's migration cost is calculated with the exact same formula as the full estate (`migration_cost(s, repoCount)`), simply passing a smaller repository count — not a separate, hand-derived number.

## 7. Material finding, and why the recommendation is a pilot, not a migration

GHE ($21) and GHAS ($49) list prices sit structurally far above ADO's ($6). Under every discount tier modelled here — including the handout's own stated maximum — a full ~3,000-repository migration does not pay back within 5 years. Even the upside scenario, whose annual run-rate does turn marginally positive, only reaches full payback around month 384 (roughly 32 years) — far outside any planning horizon a business would use.

**This means a full-scope migration is not currently recommended.** The recommendation instead is the bounded pilot in Section 6: a small, known cost (~$118,710) to replace this document's placeholder assumptions — discount tier, migration effort, and productivity value — with Contoso's own measured figures, before any decision on a wider rollout. See `pitch-deck.html` and `Neutral-Report.md` for the full reasoning.

## 8. Existing tooling: what this model assumes happens to each

No monetary credit is claimed anywhere in this model for retiring any existing tool, because none of their costs were provided in the handout.

| Tool | Assumed under this recommendation | Why |
|---|---|---|
| BlackDuck | Kept, unchanged | Already covers software composition analysis — this is exactly why Advanced Security is not recommended at scale: paying for both would be duplicate spend. |
| SonarQube | Kept, unchanged | Already covers static analysis/code quality; same reasoning as above. |
| In-house Dependabot equivalent | Kept, unchanged | Already meets Contoso's dependency-scanning needs, per the handout. |
| Nexus (artefact hosting) | Kept, unchanged, for now | Out of scope of the pilot (Git, Boards, Pipelines only). Any GitHub Packages consolidation value is unknown and untouched by this model. |

If any of these are retired later, add their real licence spend as separate, evidenced upside — do not assume it here.

## 9. Known caveats, not modelled numerically

- **Currency basis.** Licence prices are quoted in USD; the migration partner's rate is in EUR. This model combines them at an illustrative 1:1 rate. Confirm the real EUR/USD rate with finance before quoting a combined figure externally.
- **Loaded engineering cost.** The $80/hour rate behind the productivity-value figures is a placeholder, not Contoso's real blended cost.
- **GitHub Copilot** is excluded from every figure in this model, per the challenge's boundary condition.
