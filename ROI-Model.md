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

## 2. Confirmed by Contoso: maximum discount applies in every scenario

Contoso has confirmed that the maximum discount (30% GHE, 17% GHAS) applies regardless of scenario. **Discount is therefore fixed and identical across Conservative, Base and Upside** — it is no longer a source of variation between them. This is a meaningful change from an earlier version of this model, which varied discount from 0% to the maximum across the three scenarios; that variation has been removed.

## 3. What still varies between scenarios

With discount fixed, three things now differentiate the scenarios — all editable directly in `calculator.html`, all researched but still requiring Contoso validation:

| Parameter | Conservative | Base | Upside | Basis |
|---|---|---|---|---|
| Migration effort (hours/repository) | 10.0 | 5.0 | 2.5 | Web-researched ADO→GitHub migration benchmarks: 2–4h (small/simple repo), 4–8h (typical medium repo), 8–16h+ (large/complex repo). Upside also reflects Microsoft's own internal migration (~1,600 repos migrated by a small team over 6 months using official tooling and parallelisation, implying roughly 3 hours/repository at scale) — see `Quant-Report.md` for sources. |
| Engineer time saved (min/active committer/month) | 0 | 150 (~7 min/working day) | 300 (~14 min/working day) | Research on DevOps platform consolidation cites recoverable time from reduced context-switching typically in the 20–60 minute/day range, with GitHub's own published case studies citing figures around 24 minutes/day. Both Base and Upside here sit at or below that range — see `Advocate-Report.md` and `Quant-Report.md`. |
| → implied value ($/active committer/month, at $80/hour) | $0 | $200 | $400 | Derived, not invented: minutes × $80/hour placeholder rate. |
| Tools retired (BlackDuck / SonarQube / Nexus) | None | BlackDuck only, after month 9 | All three, after month 12 | Matches the team-supplied scenario table (see Section 5). |

Migration effort and engineer time saved are also live-editable per scenario in `calculator.html`, so the team (or Contoso) can substitute real figures without touching any code.

## 4. Formulas

```
ado_annual(users)              = users × 6 × (1 − 0.17) × 12
ghe_annual(users, d)           = users × 21 × (1 − d) × 12          [d = 0.30 in every scenario]
ghas_annual(users, d)          = users × 0.6 × 49 × (1 − d) × 12    [d = 0.17 in every scenario]
github_annual(users, scenario) = ghe_annual + ghas_annual
incremental_annual(users, s)   = github_annual(users, s) − ado_annual(users)   [identical across all 3 scenarios]
value_per_committer_month(s)   = (minutesSaved / 60) × 80   ($80/hour placeholder rate)
productivity_value(users, s)   = users × 0.6 × value_per_committer_month(s) × 12
tool_retirement_saving(users, s) = sum of researched placeholder costs for each tool s retires
                                    (BlackDuck: $100,000/year flat; SonarQube: $20,000/year flat;
                                     Nexus: $150/active-committer/year)
migration_cost(s, repoCount)   = repoCount × hoursPerRepo(s) × €240
                                  (converted to USD at an illustrative 1:1 rate — see caveat below;
                                   repoCount defaults to ~3,000 but can be set smaller, e.g. for a pilot)
net_annual_position(users, s)  = productivity_value(users, s) + tool_retirement_saving(users, s)
                                  − incremental_annual(users, s)
cumulative_position(users, s, months)
                                = (productivity_value − incremental_annual) × months / 12
                                  + tool_retirement_saving × max(0, months − transitionMonths(s)) / 12
                                  − migration_cost(s)
payback_month(users, s, max)   = first month where cumulative_position ≥ 0, else "not reached"
```

Migration cost does not depend on the employee-count input — it is driven by repository count, which is a separate, fixed quantity (or a smaller, explicitly chosen pilot count). Tool-retirement saving only starts accruing from the scenario's transition month onward — it is not credited retroactively.

## 5. Tool retirement, matching the team-supplied scenario table

| Scenario | What happens to BlackDuck/SonarQube/Nexus | Effect |
|---|---|---|
| Conservative | Kept running alongside GitHub (not cancelled) | No savings — possibly even redundant spend, since GHAS is paid for on top |
| Base | Contoso retires **one** of the three (BlackDuck — the most directly redundant with GHAS's dependency/SCA scanning) after a transition period | Partial saving of $100,000/year, delayed until month 9 |
| Upside | Contoso fully retires all three, once confident in GHAS coverage | Full saving of $165,000/year (at 500 users), delayed until month 12 |

**Important caveat:** GitHub has a track record of porting Advanced-Security-equivalent capability back into Azure DevOps within roughly 6 months of release. If that pattern holds, Advanced Security's differentiation over Azure DevOps's own native capability may be short-lived — which weakens the case for retiring proven tools (BlackDuck/SonarQube) to rely on it. This is not modelled as a number here; it is a risk to test directly during the pilot, not to assume away. See `Sceptic-Report.md`.

## 6. Worked example (matches the handout exactly)

At 500 users and the (now universal) maximum discount:
```
ghe_annual  = 500 × 21 × 0.70 × 12 = $88,200
ghas_annual = 500 × 0.6 × 49 × 0.83 × 12 = $146,412
github_annual = $234,612   ← matches the handout's figure exactly
ado_annual = 500 × 6 × 0.83 × 12 = $29,880   ← matches the handout's figure exactly
incremental_annual = $204,732   ← identical in all three scenarios, since discount no longer varies
```

## 7. Results at 500 users (the lower end of Contoso's range)

| Metric | Conservative | Base | Upside |
|---|---|---|---|
| Incremental annual licence cost vs ADO | $204,732 | $204,732 | $204,732 |
| Productivity value (annual) | $0 | $720,000 | $1,440,000 |
| Tool retirement saving (annual, once active) | $0 | $100,000 | $165,000 |
| One-off migration cost | $7,200,000 | $3,600,000 | $1,800,000 |
| Cumulative position at month 24 | -$7,609,464 | -$2,444,464 | +$835,536 |
| Payback (uncapped horizon) | Not reached | Month 72 (~6 years) | Month 17 (~1.4 years) |

## 8. Material finding

With discount now fixed at the maximum in every scenario, it no longer explains any difference between them. **The entire spread — from "never pays back" to "pays back in about 17 months" — comes from execution: migration efficiency, real developer time saved, and whether existing tools are actually retired.** This is a much wider, and more decision-relevant, range than the model previously showed (when discount uncertainty dominated). It means the business question is not "is GitHub Enterprise worth it in the abstract" but "which of these three execution scenarios will Contoso actually achieve" — which is precisely what the recommended pilot (Section 9) is designed to test, at a fraction of the full migration's cost and risk.

## 9. Recommended pilot scope (a small, bounded alternative to the full estate)

| Metric | Recommended pilot | Full migration (base-case assumptions) |
|---|---|---|
| Users | 100 | 500 (lower end of range) |
| Repositories migrated | 300 (10%) | ~3,000 (100%) |
| Advanced Security included | No | Not recommended at any scale yet |
| Migration cost | $360,000 | $3,600,000 |
| Licence cost (GHE only, 6 months) | $8,820 | $204,732/year incremental (GHE+GHAS) |
| Total bounded cost | **$368,820** | Not recommended at this time |

The pilot's migration cost is calculated with the exact same formula as the full estate (`migration_cost(s, repoCount)`), simply passing a smaller repository count — not a separate, hand-derived number.

## 10. Known caveats, not modelled numerically

- **Currency basis.** Licence prices are quoted in USD; the migration partner's rate is in EUR. This model combines them at an illustrative 1:1 rate. Confirm the real EUR/USD rate with finance before quoting a combined figure externally.
- **Loaded engineering cost.** The $80/hour rate behind the productivity-value figures is a placeholder, not Contoso's real blended cost.
- **Tool retirement pricing.** BlackDuck, SonarQube and Nexus figures are researched, industry-typical placeholders (see `Quant-Report.md` for sources), not Contoso's actual spend.
- **GHAS/ADO feature parity.** If Advanced-Security-equivalent features reach Azure DevOps within ~6 months as GitHub has historically done, the Base/Upside tool-retirement case weakens — not currently reflected as a number, only as a qualitative risk.
- **GitHub Copilot** is excluded from every figure in this model, per the challenge's boundary condition.
