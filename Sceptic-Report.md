# Sceptic report

I own the conservative scenario and the "this is too expensive" response. This report has been substantially rewritten following two changes: Contoso confirmed that maximum discounts apply in every scenario, and the team recalibrated migration effort and productivity assumptions using external research. Here is what I now assume, and where I still push back.

## What changed, and what I think of it

**Discount is no longer mine to argue about.** Contoso has confirmed the maximum discount (30% GHE, 17% GHAS) applies regardless of scenario. That removes discount as a source of disagreement between me and the Advocate — incremental licence cost is now **identical across all three scenarios** ($204,732/year at 500 users). I have no basis to argue for a worse discount than the maximum, so I won't. My scepticism now has to focus entirely on execution: migration effort, productivity claims, and tool retirement.

**Migration effort: 10.0 hours/repository — the top of the researched "large/complex" band.** Independent research on ADO-to-GitHub migrations puts technical effort at roughly 2–4 hours for small/simple repositories, 4–8 hours for typical medium ones, and 8–16+ hours for large or complex ones. I assume the whole ~3,000-repository estate falls in the worst tier. That's harsher than the typical case is likely to be, but Contoso has not told us its actual repository complexity mix, so I am not willing to assume anything better without evidence.

**Productivity value and tool retirement: still $0.** I remain unwilling to credit GitHub Advanced Security, or platform consolidation generally, with value while Contoso's existing BlackDuck, SonarQube, in-house Dependabot equivalent, and Nexus are all still running. Crediting value for tools you haven't retired is exactly the kind of optimistic double-counting a sceptic exists to catch.

## The result

At 500 users, conservative cumulative position is **-$7.6 million at month 24** and **never pays back**, because net annual position is a flat -$204,732/year with no offsetting value credited, against a $7.2 million migration cost (10h × 3,000 repos × €240). That migration cost is the single biggest number in the whole model — bigger, by itself, than either the Base or Upside migration cost by a wide margin — and it is driven entirely by the migration-effort assumption, which is the most important thing for the pilot to actually measure.

## Why I still don't trust the Base and Upside cases, even now

1. **The tool-retirement savings assume GHAS stays differentiated.** GitHub has a track record of porting Advanced-Security-equivalent capability back into Azure DevOps within roughly 6 months of release. If that holds here, then Base's 9-month and Upside's 12-month retirement timelines are retiring proven tools (BlackDuck, SonarQube) in favour of a GHAS advantage that may already be eroding by the time the transition completes. Neither the Advocate's nor the Neutral's case accounts for this. I think it's the single biggest risk to the whole retirement argument, and it should be tested directly during the pilot — does GHAS's coverage actually hold up, or does Azure DevOps catch up before Contoso has fully committed?
2. **The tool pricing behind the retirement savings is researched, not real.** BlackDuck ($100,000/year), SonarQube ($20,000/year) and Nexus ($150/committer/year) are industry-typical placeholders from public pricing data, not Contoso's actual contracts. If Contoso's real spend on any of these is lower than assumed, the retirement savings — and therefore the Base and Upside payback numbers — are overstated.
3. **300 minutes/month of saved engineer time (Upside) is still an estimate, not a measurement.** It sits below the high end of the research I've seen cited (some studies suggest considerably more is recoverable in badly fragmented environments), but it is still unproven for Contoso specifically.

## My position on the recommendation

The spread is now enormous: conservative never pays back, upside pays back in about 17 months. I do not think that gap can be closed by more analysis — it can only be closed by measurement. I support the pilot as the only responsible next step, provided it explicitly tests the three things I distrust most: real migration hours per repository, real developer time saved, and whether GHAS's security-tooling advantage over Azure DevOps actually persists past the 6-month mark before any tool is retired for real.
