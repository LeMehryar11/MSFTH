# Challenge Factsheet — Contoso GitHub Enterprise ROI Challenge

## 1. Purpose
A one-day business challenge. The team must advise Contoso on the financial business case for moving from Azure DevOps (ADO) to GitHub Enterprise (GHE), and present a financially reasoned recommendation, not a feature pitch.

## 2. Core question
What financially reasoned recommendation and/or strategy should Contoso accept for the GitHub Enterprise Platform, given the cost model, expected productivity value and migration effort?

## 3. Stakeholders
- Decision makers: David Schankwirt, Johannes Starkwind.
- Audience expects a financially consistent, realistic, transparent case — not the highest possible ROI figure.

## 4. Hard boundary conditions
- **GitHub Copilot is out of scope.** It must not be used as an argument for or against the recommendation, nor included in any ROI calculation.
- Do not assume any Microsoft discounts beyond those explicitly listed below.
- Maximum discounts are caps, not guaranteed rates; the final commit on user count (500–1000) is not yet fixed.

## 5. Current state (Azure DevOps)
- Contoso uses Boards, Git and Pipelines within Azure DevOps.
- Artefacts are hosted on Nexus (separate from ADO).
- Approximately 3,000 private Azure Git repositories; no public repositories.
- A custom-built Dependabot equivalent already meets Contoso's needs.
- BlackDuck and SonarQube are already integrated into the Azure DevOps environment.
- Contoso does **not** currently hold Microsoft's Unified Support (including GitHub services).
- Current ADO list price: $6/user/month, with a 17% applied discount.

## 6. Proposed state (GitHub Enterprise)
- GitHub Enterprise Platform (GHE) list price: $21/user/month; maximum discount 30%.
- GitHub Advanced Security (GHAS) list price: $49/user/month; maximum discount 17%.
- GHAS applies only to active committers, assumed at 60% of total users.
- User count range: 500–1,000 (no final commitment yet).
- Migration would use a Contoso-preferred partner at approximately €240/hour/person.

## 7. Reference cost calculation (500 users, as given in the handout)
**Azure DevOps (current):**
500 × $6 × 0.83 discount = $2,490/month = **$29,880/year**

**GitHub Enterprise + GHAS (illustrative, at maximum discounts):**
- GHE: 500 × $21 × 0.70 = $7,350/month
- GHAS: 500 × 0.60 × $49 × 0.83 = 300 × $40.67 = $12,201/month
- Total: $19,551/month = **$234,612/year**

These figures are cost inputs only; they say nothing yet about productivity value, migration cost, or ROI — that reasoning is left to the team.

## 8. Value drivers to evaluate
The productivity/value case must come from GHE + GHAS capabilities specifically (excluding Copilot). Relevant context to weigh:
- Overlap/redundancy risk: BlackDuck, SonarQube and the custom Dependabot already cover security/dependency scanning — any GHAS value claim must account for this overlap, not double-count it.
- Artefacts currently sit outside ADO on Nexus — migration scope and consolidation benefit (or lack thereof) needs explicit treatment.
- No public repositories — GHAS/GHE community-edition arguments do not apply.
- Migration effort for ~3,000 private repositories, at ~€240/hour/person via the preferred partner, is a real cost input for the business case.
- Lack of Unified Support today is a current-state gap, not automatically a migration benefit — treat carefully.

## 9. Required deliverables
| Deliverable | Must include |
|---|---|
| Model audit | Base licence costs, productivity gains, and values converted into monetary terms |
| Sensitivity model | At minimum, conservative and upside scenarios |
| Cost response | A direct answer to an executive who says the subscription is too expensive |
| Recommendation | Scope of work and effort, strategic approach, timeline to ROI |
| Executive pitch | Five-minute pitch including Q&A |

## 10. Final pitch must answer
1. What is your recommendation?
2. What is the financial case in the base, conservative, and upside scenarios?
3. What evidence should Contoso collect before committing budget?
4. What decision should the executive team make next?

## 11. Win condition
The winning team is the one with the most useful, well-reasoned recommendation — financial consistency and transparency of assumptions matter more than the size of the headline ROI number.
