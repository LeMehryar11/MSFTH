# Neutral (Synthesiser) report

I reconcile the Sceptic and the Advocate into one base case and own the recommendation. Two things changed this round: Contoso confirmed maximum discount applies everywhere, and the team recalibrated migration effort, productivity, and tool retirement using external research and the scenario table the team supplied. This report explains the new base case and the recommendation logic that follows from it.

## The base scenario's choices

| Parameter | Value | Reasoning |
|---|---|---|
| GHE / GHAS discount | 30% / 17% (maximum) | No longer mine to set — Contoso confirmed this applies to every scenario. |
| Migration effort | 5.0 hours/repository | Mid-point of the Sceptic's cautious 10.0 and the Advocate's best-case 2.5, and sits within the researched "typical medium repository" band (4–8 hours). |
| Engineer time saved | 150 minutes/active committer/month (~7 min/working day) | Half of the Advocate's 300-minute upside figure, and below the low end of the research the Advocate cites (20–60 min/day), credited only for platform consolidation. |
| Tools retired | BlackDuck only, after a 9-month transition | Matches the team-supplied scenario table: Base retires "the most redundant one" — BlackDuck overlaps most directly with GHAS's own dependency/SCA scanning. |

## Why the recommendation changed

Previously, with discount varying by scenario, the model showed all three scenarios failing to pay back within any reasonable horizon — the recommendation was simply "don't do this yet." That is no longer true. With discount now fixed and the productivity/migration-effort figures corrected:

- **Conservative never pays back** (no productivity credit, no tool retirement, worst-case migration effort).
- **Base pays back around month 72** (~6 years) — slow, but real.
- **Upside pays back around month 17** (~1.4 years) — genuinely attractive, if the assumptions hold.

This is a fundamentally different, and more useful, finding than before: **the decision is no longer "is this worth doing," it's "which of these three execution scenarios will Contoso actually land in."** That is not a question analysis can answer from a desk — it requires measurement. The recommendation is therefore still a pilot, but the reasoning behind it has shifted:

- We are **not** recommending a pilot because the numbers look bad (they don't, necessarily — Upside is a strong case).
- We **are** recommending a pilot because the three things that separate a 17-month payback from never paying back — migration efficiency, real developer time saved, and whether tools are actually retired — are all currently placeholders, and the gap between the best and worst case is worth roughly $7 million in cumulative position at month 24 alone. That gap is too large, and too determined by execution rather than negotiation, to commit to blind.

## Existing tooling: the scenario table, and why it looks the way it does

| Scenario | What happens | Effect |
|---|---|---|
| Conservative | BlackDuck, SonarQube and Nexus all kept running alongside GitHub, not cancelled | No savings — and arguably redundant spend, since GHAS would be paid for on top with nothing retired |
| Base | BlackDuck retired after a 9-month transition | Partial saving ($100,000/year at researched pricing), delayed |
| Upside | BlackDuck, SonarQube and Nexus all retired, once confident in GHAS coverage | Full saving ($165,000/year at 500 users), delayed to month 12 |

The dollar figures behind "saving" are researched, industry-typical placeholder prices (see `Quant-Report.md`), not Contoso's real contracts — this is flagged everywhere the figures appear.

**A real risk that cuts across Base and Upside alike:** GitHub has a track record of porting Advanced-Security-equivalent features back into Azure DevOps within roughly 6 months of release. If Contoso retires BlackDuck or SonarQube on the assumption that GHAS is durably superior, and Azure DevOps then narrows that gap, the retirement decision becomes harder to reverse than the licence decision was. I recommend the pilot explicitly test GHAS's coverage against the existing tools' current capability, not just against their price.

## Evidence to collect, and why each item matters

| Evidence | Why it matters |
|---|---|
| Firm user-count commitment | Total spend still scales directly with this, even with discount now fixed. |
| Real migration-effort estimate from the partner | This is now the single biggest swing factor in absolute dollar terms — a $5.4 million difference between the conservative and upside migration-cost assumptions alone. |
| Contoso's actual BlackDuck/SonarQube/Nexus spend | Replaces the researched placeholder figures with real ones, in both directions. |
| Whether GHAS features really do reach ADO within ~6 months | Directly tests whether the Base/Upside retirement timelines are wise or premature. |
| Confirmed EUR/USD basis | Migration cost is quoted in euros; licences in dollars. |
| Whether Unified Support is taken, and its cost | Not modelled here at all. |

## Bottom line

Approve the pilot in `pitch-deck.html` (Slide 5/7): ~100 users, ~300 repositories, ~$368,820 at base-case assumptions. Do not approve a full migration or Advanced Security rollout today — not because the numbers are necessarily bad, but because we do not yet know which of the three scenarios is real, and the difference between them is worth roughly $7 million.
