# Neutral (Synthesiser) report

I don't build either extreme. My job is to reconcile the Sceptic and the Advocate into one financially consistent base case and to own the actual recommendation. This report explains the base-case choices and, more importantly, walks through the reasoning the team was right to push back on: why we recommend anything at all, given that no scenario pays back within 5 years.

## The base scenario's mid-point choices

| Parameter | Value | Reasoning |
|---|---|---|
| GHE discount | 15% | Roughly the mid-point between the Sceptic's zero and the handout's 30% ceiling — a planning guess pending a real quote, not a negotiated figure. |
| GHAS discount | 8% | Same logic, mid-point of 0%–17%. |
| Migration effort | 1.5 hours/repository | Mid-point between the Sceptic's cautious 3.0 and the Advocate's best-case 0.75. |
| Engineer time saved | 15 minutes/active committer/month | Half of the Advocate's 45-minute upside claim, credited only for platform consolidation, not for any Advanced Security capability, since BlackDuck/SonarQube/Dependabot are assumed to stay exactly as they are. |

None of these are facts. They are the mid-point of a genuine range, chosen so the base case isn't quietly doing the Advocate's or the Sceptic's work for them.

## Why the recommendation is a pilot, not a rejection or a full migration

This is the point the team's question was really about, so I want to be explicit about the logic, not just restate the conclusion.

1. **The numbers do not support a full migration.** Conservative, base, and upside all fail to pay back a full ~3,000-repository migration within 5 years. That includes the Advocate's own best legitimate case. A recommendation to "go ahead and migrate everything" would not be consistent with our own model — so we are not making that recommendation.
2. **The numbers also don't support doing nothing.** Every one of our assumptions is a placeholder: the discount tier, the migration effort per repository, and the productivity value are all unverified. We do not actually know whether the real case is better or worse than what's modelled here, because Contoso has not yet negotiated a price, scoped the migration with the partner, or measured any productivity effect.
3. **A bounded pilot is the only action consistent with both facts.** It costs a small, known, largely bounded amount (~$118,710 at base-case assumptions for 100 users and 300 repositories — see `ROI-Model.md`), it replaces the weakest assumptions with real data, and if it fails, Contoso has lost a small amount, not committed to a $540,000–$2,160,000 programme on guesses.

In short: **we're not recommending migration because the numbers look good — they don't. We're recommending a small, reversible way to find out what the numbers actually are**, before either committing further or walking away. That is a different, and more defensible, kind of recommendation than "adopt GitHub Enterprise," and it's the one that actually follows from our own model.

## Existing tooling: what changes, what doesn't

No credit is claimed anywhere in this model for retiring BlackDuck, SonarQube, the in-house Dependabot equivalent, or Nexus. All four continue exactly as they are under this recommendation:

- **BlackDuck and SonarQube** are precisely why Advanced Security is not recommended at any scale in the pilot — paying for GHAS on top of tools that already do the same job would be duplicate spend, not added value.
- **The in-house Dependabot equivalent** already meets Contoso's stated needs; nothing in the pilot touches it.
- **Nexus** is out of scope of the pilot entirely (which covers Git, Boards and Pipelines only). Whether GitHub Packages could later replace it, and at what saving or cost, is unknown and untouched by this model.

If Contoso does decide to retire any of these later, the savings should be added as separate, evidenced upside once real figures exist — not assumed here.

## Evidence to collect, and why each item matters

| Evidence | Why it matters |
|---|---|
| Firm user-count commitment | Total spend scales directly with this; 500 vs 1,000 users materially changes every figure. |
| Actual negotiated GHE/GHAS discount tiers | This is the single largest swing factor between our conservative and upside cases. |
| BlackDuck/SonarQube/Nexus current licence spend | The only way to turn "unquantified upside" into a real, countable number. |
| Confirmed EUR/USD basis | Migration cost is quoted in euros; licences in dollars. Combining them without a real rate is a modelling shortcut, not a fact. |
| Real migration-effort estimate from the partner | Our 0.75–3.0 hour/repository range is a planning guess, not a scoping result. |
| Whether Unified Support is taken, and its cost | An additional cost not modelled here at all. |

## Bottom line

Approve the pilot in `pitch-deck.html` (Slide 5/7). Do not approve a full migration or any Advanced Security rollout today. Re-run this model with the pilot's real numbers at the month-6 decision gate before considering anything larger.
