# Advocate report

I own the upside scenario. My job is to make the strongest legitimate case for value, without inventing anything the handout doesn't support. This report is an honest account of where that case lands — including where it doesn't fully land.

## What I assumed, and why

**Discount: 30% GHE / 17% GHAS — the handout's own stated maximums.** This is the one place in the whole model where "upside" is not a guess: it is the ceiling Microsoft itself has offered. I am not assuming Contoso gets *better* than the handout states, only that Contoso's negotiating position (500–1,000 seats, an existing Microsoft relationship) is strong enough to reach the ceiling that's on the table.

**Migration effort: 0.75 hours/repository.** This is defensible only if most of the ~3,000 repositories are straightforward: standard Git history, limited custom pipeline logic, migrated with a high degree of automation and reuse across similar repositories (which is realistic when many repos in a large engineering organisation share similar structure). It is a best-case, not a typical-case, figure.

**Productivity/consolidation value: 45 minutes per active committer per month.** I want to be precise about what this claim actually is, because "productivity value" is exactly the kind of soft number the Sceptic (rightly) distrusts. It is **not** a market-research figure and **not** Contoso-specific data — neither exists yet. It is a deliberately modest placeholder: 45 minutes a month is under 2.5 minutes per working day, credited for working in one platform (Git, Boards, Pipelines, and optionally security) instead of switching between Azure DevOps and separate tooling. At an assumed $80/hour loaded engineering cost (also a placeholder — see Quant-Report.md), that comes to $60 per active committer per month. I chose minutes, not a bare dollar figure, specifically so this claim could be checked and challenged, rather than accepted on faith.

## Where the honest case lands

At 750 users: annual net position is **+$16,902** — genuinely positive, for the first time across the three scenarios. But the one-off migration cost is **$540,000**, and $16,902 a year does not pay that back on any sensible timeline: full payback is not reached until **month 384 (~32 years)**. I will not dress this up as a win. Even my best legitimate case does not make a full migration financially sound within any planning horizon a business would actually use.

## What I would still argue for

1. **Don't judge the full-scope case and stop there.** The gap between "positive but slow" and "genuinely attractive" is not large — roughly the size of the migration cost itself. If Contoso later retires BlackDuck, SonarQube, or Nexus licence spend as part of a wider consolidation (none of which is credited anywhere in this model, because we don't have their costs), that alone could close much of the remaining gap. This is the single largest source of *real, uncounted* upside — see the Cost response and Existing tooling slides in `pitch-deck.html`.
2. **Shrink the fixed cost, don't inflate the assumptions.** The migration cost is large mostly because it's a single, big, one-off outlay across the whole estate. A phased migration — proving the tooling and automation on a subset first, then reusing that automation across the rest — is a more credible way to bring the effective cost down than assuming a rosier hours-per-repo figure from day one.
3. **A pilot is where my case earns its keep.** I support the Sceptic and Neutral's recommendation of a bounded pilot, not because I've conceded the financial case, but because the pilot is exactly what would let us replace my placeholder assumptions (discount tier, hours/repo, minutes saved) with Contoso's own measured numbers — the only way my upside case becomes a real one rather than a modelled one.
