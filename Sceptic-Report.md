# Sceptic report

I own the conservative scenario and the "this is too expensive" response. This report sets out exactly what I assumed, why, and what I still don't trust.

## What I assumed, and why

**Discount: 0% for both GHE and GHAS.** Not 10%, not "a bit less than the maximum" — zero. The handout states *maximum* discounts (30% GHE, 17% GHAS); it says nothing about a minimum or a typical negotiated rate. Until Contoso has an actual quote, the only defensible floor is "no discount secured at all." Anyone assuming a "conservative" discount that is still comfortably positive (as an earlier draft of this model did, at 10%/5%) is quietly assuming negotiating success before any negotiation has happened. I would rather show the true floor and let the numbers speak.

To be direct about a question the team was right to ask: **no, this model does not assume maximum discounts are always granted.** Only the upside scenario uses the handout's stated maximum. The conservative scenario uses zero. That the *base* scenario (15% GHE / 8% GHAS) sits closer to the maximum than to zero is a mid-point planning assumption, not a claim that Microsoft will grant it — see Neutral-Report.md for how that mid-point was chosen.

**Migration effort: 3.0 hours/repository.** This is the effort figure if Pipelines need substantial hand-conversion to GitHub Actions (not just a Git history import), automation reuse from the partner is limited, and Contoso's ~3,000 repositories include a meaningful share of non-trivial, custom CI/CD setups. I have no repository-complexity data from Contoso, so I assumed the less favourable end.

**Productivity/consolidation value: $0.** Contoso already runs BlackDuck, SonarQube, and a working in-house Dependabot equivalent. I am not willing to credit GitHub Advanced Security with value it would be *duplicating*, not adding. Nor will I credit "platform consolidation" with a made-up productivity number when the tools being consolidated (Boards, Pipelines, Git) are not shown to be a proven bottleneck for Contoso today. Zero is the only figure I can defend without inventing a benefit.

## What this produces

At 750 users, the conservative scenario shows an annual net position of roughly **-$409,000** and a migration cost of **$2,160,000**. Cumulative position at month 24 is about **-$2,978,000**. Nothing about this scenario approaches break-even, at any horizon.

## What I still don't trust, even in the Base and Upside cases

- **The EUR/USD parity assumption (1:1).** Licence prices are in USD, the partner's rate is in EUR. A realistic EUR/USD rate could move the migration cost materially. I have not seen anyone correct for this with a real rate.
- **The "60% active committers" ratio is a given fact, but committer *behaviour* isn't.** If active committers churn (people leave, new hires ramp up), GHAS spend does not shrink proportionally in-year, and the Advocate's productivity claims assume a stable, engaged committer base that may not hold.
- **Repository count and complexity are both unverified.** ~3,000 is described as approximate. A wider tail of large monorepos or heavily pipeline-dependent repos would push the true migration cost above even my conservative figure.

## My position on the recommendation

I do not think a full ~3,000-repository migration is justified by anything in this model, including the Advocate's own upside numbers (see Quant-Report.md — even upside does not pay back within 5 years). I support the Neutral's recommendation of a small, bounded pilot only, provided:
- it stays capped at the ~100 users / ~300 repositories scope costed in `ROI-Model.md`,
- no Advanced Security is deployed in this phase, and
- the decision gate at month 6 is a genuine gate, not a formality on the way to a full rollout that has already been decided.
