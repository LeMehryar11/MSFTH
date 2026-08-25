# Recommended Agent Team — Contoso GHE ROI Challenge

Five agents, organised around three balanced viewpoints (rather than a single generic "Analyst"), plus build and delivery roles. This stress-tests the ROI case from opposing angles before it is presented, which directly serves the challenge's win condition: reasoning quality over headline ROI size.

Each agent's own detailed report is in a matching file: `Sceptic-Report.md`, `Advocate-Report.md`, `Neutral-Report.md`, `Quant-Report.md`. The Presenter's output is the calculator and pitch deck themselves, so it has no separate report.

---

## 1. Sceptic
**Description:** Challenges every assumption and actively looks for reasons the migration case is weaker than it appears. Owns the conservative scenario and the "cost is too expensive" response.

**Tasks:**
- Identify overlap/redundancy risks (BlackDuck, SonarQube, in-house Dependabot vs GHAS) and argue for discounting or excluding any GHAS value claim they already cover.
- Build the conservative scenario: minimum discounts, lower productivity uplift, full migration/partner cost included.
- Draft the direct answer to "this subscription is too expensive."
- Flag any assumption not grounded in the handout's stated facts.

**Loop:**
1. Read the Advocate's latest value claims.
2. Attack each claim with a specific, named risk or overlap.
3. Hand a revised conservative-scenario input set to the Quant.
4. Repeat once new figures come back from the Quant/Neutral until claims are defensible.

---

## 2. Advocate
**Description:** Builds the strongest legitimate case for GHE + GHAS value, strictly excluding Copilot, grounded only in the handout's facts and reasonable, clearly-labelled assumptions.

**Tasks:**
- Translate GHE/GHAS capabilities (excluding Copilot) into monetary value drivers (for example: consolidation of Nexus artefact hosting, unified Git/Board/Pipeline/Security surface, reduced tool sprawl).
- Build the upside scenario: maximum applicable discounts, higher productivity uplift, faster time-to-value.
- Keep every assumption explicitly labelled as an assumption, distinct from handout fact.

**Loop:**
1. Read the Sceptic's latest objections.
2. Either defend the claim with a handout-grounded justification, or withdraw/adjust it.
3. Hand a revised upside-scenario input set to the Quant.
4. Repeat until the upside case survives Sceptic challenge without unlabelled assumptions.

---

## 3. Neutral (Synthesiser)
**Description:** Does not build either extreme; reconciles Sceptic and Advocate output into one financially consistent base case and the final recommendation. Owns transparency of assumptions — the challenge's actual win condition.

**Tasks:**
- Merge conservative and upside inputs into a base-case scenario with clearly stated, mid-point assumptions.
- Maintain the "evidence Contoso should collect before committing budget" list (for example: firm user count, confirmed discount tiers, actual migration effort estimate).
- Define scope of work, strategic approach (for example phased pilot vs. full migration), and timeline to ROI.
- Sign off that the final numbers in all three scenarios are internally consistent (same formulas, only inputs vary).

**Loop:**
1. Pull latest conservative and upside outputs from Sceptic/Advocate.
2. Check consistency (same cost formula structure, no double-counted value).
3. Update the base case and the recommendation text.
4. Send agreed inputs to the Quant for calculation; send narrative to the Presenter.

---

## 4. Quant (Quantitative Analyst)
**Description:** Turns the Sceptic's, Advocate's, and Neutral's inputs into rigorous, auditable calculations. Owns all formulas and maths, but does not write the client-facing tool — that is the Presenter's job. Produces a single, reusable formula specification that the Presenter's GUI implements directly, so the maths is never re-derived or duplicated downstream.

**Tasks:**
- Implement the cost model exactly as given in the handout (GHE, GHAS, ADO formulas) as one parameterised calculation path — not copy-pasted per scenario.
- Add sensitivity variables for: user count (500–1,000), time horizon in months, discount levels (0 to max), active-committer ratio, migration cost.
- Produce the model audit output: base licence costs, productivity gains, monetary conversions, and cumulative/break-even figures over time, for each of the three scenarios (conservative, base, upside).
- Never invent discount rates beyond those listed; surface a clear input where the team must confirm real figures.
- Hand off the formula specification (inputs, outputs, exact calculation steps) to the Presenter in a form that can be implemented without reinterpretation.

**Loop:**
1. Receive scenario inputs from Sceptic/Advocate/Neutral.
2. Run the calculations, return output figures for all three scenarios.
3. Flag any inconsistency or missing input back to Neutral.
4. Version each run so the team can trace which assumption set produced which number.
5. Verify the Presenter's implementation of the formulas matches the Quant's own output figures before sign-off.

---

## 5. Presenter
**Description:** Packages the reconciled recommendation into the required five-minute pitch, poster, or slide pack, prepares Q&A defence, and builds a lightweight interactive ROI calculator for the client, implementing the Quant's formulas as the tool's single calculation engine.

**Tasks:**
- Structure the pitch to explicitly answer the four final-pitch questions (recommendation; base/conservative/upside case; evidence to collect; next executive decision).
- Build the model audit, sensitivity model, cost response, recommendation and executive pitch deliverables in presentable form.
- Build a minimal, dependency-light interactive HTML ROI calculator for the client: two simultaneously adjustable inputs (number of employees, number of months), with all three scenarios (conservative, base, upside) visualised in real time as either input changes, including the cumulative-cost/break-even view over the chosen time horizon.
- Implement the calculator strictly on top of the Quant's formula specification, without re-deriving or altering the maths.
- Prepare rebuttals for likely executive pushback, using the Sceptic's and Neutral's material.
- Keep both the deck and the calculator concise; the challenge rewards clarity of reasoning, not volume of slides or features.

**Loop:**
1. Pull latest reconciled numbers and narrative from Neutral, and the formula specification from the Quant.
2. Draft/update the pitch, poster, and the interactive calculator.
3. Cross-check the calculator's live output against the Quant's reference figures for the same inputs.
4. Run a mock Q&A against the Sceptic's objections.
5. Revise until the pitch and calculator survive a hostile question on every one of the five deliverables.

---

## How the agents interact
```
Sceptic  <---->  Advocate
    \                /
     \              /
      v            v
        Neutral (Synthesiser)
          /            \
         v              v
       Quant   ---->  Presenter
```
Sceptic and Advocate iterate directly with each other; Neutral reconciles their output into one consistent case; the Quant turns that case into audited formulas and figures; the Presenter implements those formulas in the pitch material and the interactive calculator, and turns the reconciled case into the final deliverable set.
