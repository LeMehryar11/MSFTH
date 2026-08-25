# Quant report

I own the arithmetic. This report explains exactly how every figure in `roi-model.js`, `calculator.html`, and `pitch-deck.html` is calculated, so the numbers can be checked independently rather than taken on trust.

## 1. What is fact, and how I know

Every value in `FACTS` (in `roi-model.js`) is copied directly from the handout: GHE $21/user/month, GHAS $49/user/month, 60% active-committer ratio, ADO $6/user/month at a 17% current discount, ~3,000 repositories, €240/hour/person partner rate, and the 30%/17% maximum discounts. I did not adjust, round, or reinterpret any of these. As a check, the model reproduces the handout's own worked example exactly: at 500 users and maximum discounts, `githubAnnualCost` returns **$234,612** and `adoAnnualCost` returns **$29,880** — both to the dollar. This check is enforced by an automated test (`roi-model.test.js`), not just eyeballed once.

## 2. Discount assumptions — direct answer to "are maximum discounts always granted?"

No. Only the **upside** scenario uses the handout's stated maximum (30% GHE, 17% GHAS). The **conservative** scenario uses **0%** for both — a genuine floor, not a softened guess — because nothing in the handout guarantees any discount below the stated maximum. The **base** scenario uses a mid-point (15%/8%) as an explicit planning placeholder. This is a change from an earlier version of this model, which used 10%/5% for the conservative case — that understated how bad the true worst case could be, and effectively assumed a discount was secured before any negotiation happened. See `Sceptic-Report.md` for the reasoning behind the floor.

## 3. How productivity/consolidation value is actually calculated

This was previously a bare number ($0/$20/$50 per active committer per month) with no shown working — a fair thing to challenge. It is now derived, in code, as:

```
valuePerCommitterMonth(scenario) = (minutesSavedPerCommitterMonth / 60) × LOADED_HOURLY_RATE_USD
```

`LOADED_HOURLY_RATE_USD` is a single placeholder constant ($80/hour) representing a fully loaded engineering cost — this is **not** Contoso's real cost and must be replaced with it before these figures are used externally. `minutesSavedPerCommitterMonth` is 0 (conservative), 15 (base), or 45 (upside) — deliberately small, checkable claims (well under 2.5 minutes per working day even at the upside), rather than an unexplained dollar figure. The resulting values ($0, $20, $60 per active committer per month) are what feed `productivityValueAnnual`.

## 4. The full formula chain

```
ado_annual(users)              = users × 6 × (1 − 0.17) × 12
ghe_annual(users, d)           = users × 21 × (1 − d) × 12
ghas_annual(users, d)          = users × 0.6 × 49 × (1 − d) × 12
github_annual(users, scenario) = ghe_annual + ghas_annual
incremental_annual(users, s)   = github_annual − ado_annual
value_per_committer_month(s)   = (minutesSaved / 60) × 80
productivity_value(users, s)   = users × 0.6 × value_per_committer_month(s) × 12
migration_cost(s, repoCount)   = repoCount × hoursPerRepo(s) × €240 (× illustrative 1:1 FX)
net_annual_position(users, s)  = productivity_value − incremental_annual
cumulative_position(users, s, months) = net_annual_position × months / 12 − migration_cost(s)
payback_month(users, s, max)   = first month where cumulative_position ≥ 0, else none
```

Two design choices worth flagging explicitly:

- **Migration cost does not scale with the employee-count input.** It is driven by repository count, which is a separate, fixed quantity. This is why the calculator's migration-cost figure does not move when you drag the employees slider — that is correct behaviour, not a bug (confirmed by a dedicated test).
- **`migrationCostUsd` accepts an optional repository-count argument**, defaulting to the full ~3,000-repository estate. This is what lets the pilot's cost (300 repositories) and the full estate's cost (3,000 repositories) be computed from the exact same formula, rather than a second, hand-copied calculation that could drift out of sync.

## 5. Why "payback within 5 years" is the number that matters

The team's own framing — "even after 5 years" — is exactly the horizon this model is built to answer. At 60 months:

- Conservative and base scenarios never reach payback, at any horizon, because their net annual position is negative (more is spent on incremental licence cost than is credited back in value).
- The upside scenario's net annual position is small but **positive** ($16,902/year at 750 users) — yet because the one-off migration cost ($540,000) is large relative to that margin, full payback isn't reached until month 384 (~32 years). Within the 60-month (5-year) window the team asked about, it also shows "not reached" — this is not an inconsistency, it's two different questions (is the annual run-rate positive? vs. has the upfront cost been paid back?) with two different, both-true answers.

## 6. What isn't modelled, on purpose

- **BlackDuck, SonarQube, Nexus, and Dependabot retirement value.** None of their current licence costs were given in the handout, so crediting any dollar value for retiring them would be inventing a fact. This is very likely the largest real source of unmodelled upside — see `Neutral-Report.md`.
- **A real EUR/USD rate.** Licence prices are USD; the partner's rate is EUR. `FX_EUR_TO_USD` is fixed at an illustrative 1.0 and flagged everywhere it's used. Do not treat combined dollar totals as exact until a real rate is applied.
- **Repository complexity distribution.** The 0.75–3.0 hours/repository range is a planning band, not derived from Contoso's actual repository sizes or pipeline complexity, which the handout does not provide.

## 7. Test coverage

`roi-model.test.js` (17 tests, run via `npm test` / `node --test`) checks: the handout's own reference figures reproduce exactly; the conservative discount floor is genuinely zero; the productivity-value derivation matches minutes × rate, for all three scenarios; migration cost scales correctly for a smaller pilot repository count without duplicating the formula; and payback is not reached within 5 years in any of the nine (scenario × user-count) combinations tested. All 17 pass.
