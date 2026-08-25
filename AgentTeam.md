# Recommended Agent Team — Contoso GHE ROI Challenge

Five agents, organised around three balanced viewpoints (rather than a single generic "Analyst"), plus build and delivery roles. This stress-tests the ROI case from opposing angles before it is presented, which directly serves the challenge's win condition: reasoning quality over headline ROI size.

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
3. Hand a revised conservative-scenario input set to the Coder.
4. Repeat once new figures come back from the Coder/Neutral until claims are defensible.

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
3. Hand a revised upside-scenario input set to the Coder.
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
4. Send agreed inputs to the Coder for the model; send narrative to the Presenter.

---

## 4. Coder
**Description:** Builds and maintains the single source-of-truth ROI/sensitivity model (spreadsheet or script) that all three scenarios run through, so numbers stay comparable and auditable.

**Tasks:**
- Implement the cost model exactly as given in the handout (GHE, GHAS, ADO formulas) as reusable, parameterised functions — not copy-pasted per scenario.
- Add sensitivity toggles for: user count (500–1,000), discount levels (0 to max), active-committer ratio, migration cost.
- Produce the model audit output: base licence costs, productivity gains, monetary conversions, for each of the three scenarios.
- Never invent discount rates beyond those listed; surface a clear input field/comment where the team must confirm real figures.

**Loop:**
1. Receive scenario inputs from Sceptic/Advocate/Neutral.
2. Run the model, return output figures.
3. Flag any inconsistency or missing input back to Neutral.
4. Version each run so the team can trace which assumption set produced which number.

---

## 5. Presenter
**Description:** Packages the reconciled recommendation into the required five-minute pitch, poster, or slide pack, and prepares Q&A defence.

**Tasks:**
- Structure the pitch to explicitly answer the four final-pitch questions (recommendation; base/conservative/upside case; evidence to collect; next executive decision).
- Build the model audit, sensitivity model, cost response, recommendation and executive pitch deliverables in presentable form.
- Prepare rebuttals for likely executive pushback, using the Sceptic's and Neutral's material.
- Keep the deck concise; the challenge rewards clarity of reasoning, not volume of slides.

**Loop:**
1. Pull latest reconciled numbers and narrative from Neutral, and model output from Coder.
2. Draft/update the pitch and poster.
3. Run a mock Q&A against the Sceptic's objections.
4. Revise until the pitch survives a hostile question on every one of the five deliverables.

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
      Coder          Presenter
```
Sceptic and Advocate iterate directly with each other; Neutral reconciles their output into one consistent case; Coder keeps the numbers auditable; Presenter turns the reconciled case into the final deliverable set.
