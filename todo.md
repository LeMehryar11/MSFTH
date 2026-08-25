# Todo

## Done
- [x] Read and summarise the handout into `ChallengeFactsheet.md`.
- [x] Recommend the five-agent team in `AgentTeam.md` (Sceptic, Advocate, Neutral, Quant, Presenter).
- [x] Write `AGENTS.md`, including the eleven mandated operating rules.
- [x] Build the Quant's formula module (`roi-model.js`), verified against the handout's exact reference figures.
- [x] Write and pass the test suite (`roi-model.test.js`, 17 tests, `npm test`).
- [x] Build the Presenter's interactive calculator (`calculator.html`), with editable migration-effort and engineer-time-saved fields per scenario.
- [x] Build the Presenter's pitch deck (`pitch-deck.html`), 9 slides.
- [x] Write `map.md`, `README.md`, `usage.md`, and this file.
- [x] Write `Sceptic-Report.md`, `Advocate-Report.md`, `Neutral-Report.md`, `Quant-Report.md`.
- [x] Recalibrate per Contoso's confirmation that maximum discounts apply in every scenario — discount is no longer a source of variation between scenarios.
- [x] Recalibrate migration-effort and engineer-time-saved assumptions using web research (previously ungrounded/too low); both are now cited and directly editable in the calculator.
- [x] Add tool-retirement modelling (BlackDuck/SonarQube/Nexus) matching the team-supplied scenario table, using researched industry-typical pricing.
- [x] Fix a cross-file inconsistency: the deck and calculator previously used different reference employee counts (750 vs 500), producing different payback months for the same scenario. Both now use 500 users and agree exactly.
- [x] Add the GHAS-features-port-to-Azure-DevOps-within-6-months risk to the reasoning throughout.
- [x] Verify the calculator's and deck's rendered output with headless-DOM (`jsdom`) functional tests instead of screenshots (32 assertions total, all passing).

## Outstanding — requires Contoso input before finalising the business case
- [ ] Confirm the firm user-count commitment (500 vs. 1,000).
- [ ] Obtain a real migration-effort estimate per repository from the preferred partner — this is now the single biggest swing factor in absolute dollar terms.
- [ ] Obtain Contoso's current BlackDuck, SonarQube and Nexus licence spend, to replace the researched placeholder pricing with real figures.
- [ ] Confirm whether GitHub's Advanced-Security-equivalent features really do reach Azure DevOps within roughly 6 months — this materially affects whether retiring existing tools (Base/Upside) is wise.
- [ ] Confirm the real EUR/USD basis for combining migration cost with licence cost (currently modelled at an illustrative 1:1 rate).
- [ ] Confirm whether Contoso will take Microsoft's Unified Support, and its cost.
- [ ] Confirm Contoso's real blended/loaded engineering cost, to replace the $80/hour placeholder behind the productivity-value figures.

## Possible follow-ups (not started — raise before picking up)
- [ ] Add a printable one-page poster version of the pitch deck's key numbers, if the format is wanted alongside the slides.
- [ ] Re-run the model once real figures from the evidence list above are available, and update `ROI-Model.md`'s worked example accordingly — this is the explicit purpose of the pilot's month-6 decision gate.
