# Advocate report

I own the upside scenario. Two things changed since my last report: Contoso confirmed maximum discounts apply everywhere (which actually helps my case — I no longer need to argue for it, it's now a given), and the team raised my productivity and migration-effort assumptions after a review found my previous figures (45 minutes/month, 0.75 hours/repository) far too conservative for a scenario that's supposed to represent the best legitimate case. This report reflects the revised numbers.

## What I assume now, and why

**Discount: 30% GHE / 17% GHAS — confirmed by Contoso, not just the handout's ceiling.** This is no longer a debate. Incremental licence cost is $204,732/year at 500 users, the same figure in every scenario.

**Migration effort: 2.5 hours/repository.** This is grounded directly in a real case: Microsoft's own internal engineering organisation migrated roughly 1,600 repositories to GitHub in about 6 months with a small team (two technical leads plus a small bench of engineers), using official migration tooling and parallelisation. Worked through, that implies an effective rate on the order of 3 hours per repository at scale — I use 2.5 hours as a slightly more optimistic but directly comparable best case, reflecting Contoso's own preferred partner doing this professionally with dedicated tooling.

**Engineer time saved: 300 minutes (5 hours) per active committer per month — corrected upward from an earlier, indefensibly low 45 minutes.** Independent research on context-switching costs and DevOps tool consolidation cites recoverable productivity in the range of 20–60 minutes per developer per day from reduced tool fragmentation, and GitHub's own published case studies cite around 24 minutes/day (roughly 2 hours/week) from platform consolidation specifically. At 300 minutes/month (about 14 minutes per working day), my figure sits comfortably below even the low end of that daily range — deliberately conservative relative to the cited research, while no longer absurdly low as my previous figure was.

**Tool retirement: all three (BlackDuck, SonarQube, Nexus), after a 12-month transition.** Once Contoso is confident GHAS genuinely covers what these tools do today, full retirement is the logical end state of committing to the platform. I price this using researched, industry-typical placeholder costs (see `Quant-Report.md`), not invented figures.

## Where the case now lands

At 500 users: annual net position is **+$1,400,268** (productivity $1,440,000 + tool saving $165,000 − incremental cost $204,732), against a migration cost of $1,800,000. That pays back in **about 17 months** — genuinely fast, and a real result this time, not a rounding error away from break-even like my previous report's figure.

## What I won't pretend away

1. **The Sceptic's objection about GHAS/ADO feature parity is fair.** If GitHub ports Advanced-Security-equivalent capability into Azure DevOps within about 6 months, as it has a track record of doing, then retiring BlackDuck and SonarQube specifically to gain GHAS's edge is a riskier bet than my numbers alone suggest. I still think the consolidation argument (one platform, less tool-switching) holds regardless of that risk — but the security-tooling-retirement portion of my case is genuinely more fragile than the productivity portion.
2. **My tool-retirement pricing is researched, not Contoso's.** $100,000 (BlackDuck) and $20,000 (SonarQube) flat, and $150/committer (Nexus), come from public enterprise pricing data, not a quote. If Contoso's real contracts are smaller, my payback figure gets worse; if larger, it gets better.
3. **17 months assumes everything goes right at once.** Efficient migration, real productivity gains, and full tool retirement all landing together is the actual best case, not the median case. That's exactly why I support piloting this rather than presenting it as a guaranteed outcome.
