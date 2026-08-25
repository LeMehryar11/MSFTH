# ROI Model — Formula Specification (Quant)

This is the human-readable specification for `roi-model.js`, the single source of calculations used by both `calculator.html` and `pitch-deck.html`. If this document and the code ever disagree, the code is the implementation and this document should be corrected to match it — do not maintain two separate formulas.

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
| GHE discount applied | 10% | 20% | 30% (= handout maximum) |
| GHAS discount applied | 5% | 12% | 17% (= handout maximum) |
| Migration effort (hours/repository) | 2.0 | 1.0 | 0.5 |
| Productivity/consolidation value ($/active committer/month) | $0 | $20 | $50 |

Only the upside discounts equal a handout fact (the stated maximum); everything else in this table is a labelled assumption, not a given figure.

## 3. Formulas

```
ado_annual(users)              = users × 6 × (1 − 0.17) × 12
ghe_annual(users, d)           = users × 21 × (1 − d) × 12
ghas_annual(users, d)          = users × 0.6 × 49 × (1 − d) × 12
github_annual(users, scenario) = ghe_annual(users, scenario.gheDiscount)
                                  + ghas_annual(users, scenario.ghasDiscount)
incremental_annual(users, s)   = github_annual(users, s) − ado_annual(users)
productivity_value(users, s)   = users × 0.6 × s.valuePerCommitterMonth × 12
migration_cost(s)              = 3,000 × s.migrationHoursPerRepo × €240
                                  (converted to USD at an illustrative 1:1 rate — see caveat below)
net_annual_position(users, s)  = productivity_value(users, s) − incremental_annual(users, s)
cumulative_position(users, s, months)
                                = net_annual_position(users, s) × months / 12 − migration_cost(s)
payback_month(users, s, max)   = first month where cumulative_position ≥ 0, else "not reached"
```

Migration cost does not depend on the employee-count input — it is driven by repository count, which is fixed.

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
| Incremental annual licence cost vs ADO | $376,650 | $339,228 | $307,098 |
| Productivity/consolidation value (annual) | $0 | $108,000 | $270,000 |
| Net annual position | -$376,650 | -$231,228 | -$37,098 |
| One-off migration cost | $1,440,000 | $720,000 | $360,000 |
| Cumulative position at month 24 | -$2,193,300 | -$1,182,456 | -$434,196 |
| Payback within 5 years | Not reached | Not reached | Not reached |

## 6. Material finding

GHE ($21) and GHAS ($49) list prices sit structurally far above ADO's ($6). Under every discount tier available and every labelled assumption above, licence substitution alone never breaks even against the ADO baseline — the upside scenario comes closest (net annual position only -$37,098 at 750 users) but does not cross zero. This is why the recommendation (see `AgentTeam.md` and the pitch deck) is a scoped adoption — GitHub Enterprise for consolidation, GitHub Advanced Security piloted only where it displaces a costed existing tool — rather than a blanket full-scope migration.

## 7. Known caveats, not modelled numerically

- **Currency basis.** Licence prices are quoted in USD; the migration partner's rate is in EUR. This model combines them at an illustrative 1:1 rate. Confirm the real EUR/USD rate with finance before quoting a combined figure externally.
- **Existing security tooling.** BlackDuck, SonarQube and the in-house Dependabot equivalent are not assumed to be retired, and their current licence spend was not given in the handout, so no retirement value is credited anywhere in this model. If Contoso does retire any of them, add their spend as further, separately-evidenced upside.
- **GitHub Copilot** is excluded from every figure in this model, per the challenge's boundary condition.
