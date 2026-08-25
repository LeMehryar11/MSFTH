# Contoso GitHub Enterprise ROI Challenge

This repository holds the team's working material and final deliverables for the one-day Contoso GitHub Enterprise ROI business challenge: a financially reasoned recommendation on migrating from Azure DevOps to GitHub Enterprise, with GitHub Copilot explicitly excluded from all figures.

## What is in here

- **`ChallengeFactsheet.md`** — everything known from the handout, summarised.
- **`AgentTeam.md`** — the recommended five-agent working model (Sceptic, Advocate, Neutral, Quant, Presenter).
- **`AGENTS.md`** — operating rules for anyone (human or AI) contributing to this repository.
- **`ROI-Model.md`** — the formula specification behind the numbers.
- **`Sceptic-Report.md`, `Advocate-Report.md`, `Neutral-Report.md`, `Quant-Report.md`** — each agent's detailed reasoning behind their own assumptions and calculations.
- **`roi-model.js`** — the single calculation module the numbers are actually computed from.
- **`calculator.html`** — an interactive ROI calculator for the client.
- **`pitch-deck.html`** — the executive pitch deck.

See `map.md` for the full file listing and `usage.md` for how to run the calculator and deck.

## The headline finding

Contoso has confirmed that maximum discounts (30% GHE, 17% GHAS) apply in every scenario, so discount no longer explains any difference between them. What does: migration efficiency, real developer time saved, and whether existing tools (BlackDuck, SonarQube, Nexus) are actually retired. At 500 users, that spread runs from the **conservative scenario never paying back** to the **upside scenario paying back in about 17 months**. That range is too wide, and too dependent on execution rather than negotiation, to commit the full ~3,000-repository budget against. The recommendation is therefore a small, bounded pilot (~100 users, ~300 repositories, ~$368,820) to find out which scenario Contoso is actually in, before any larger commitment. Advanced Security is not recommended at any scale while BlackDuck, SonarQube and the in-house Dependabot equivalent already cover that need — and GitHub has a track record of porting Advanced-Security-equivalent features back into Azure DevOps within roughly 6 months, a further reason for caution. Full reasoning is in `ROI-Model.md`, the four agent reports, and the pitch deck.

## Running the test suite

```
npm test
```

This runs Node's built-in test runner against `roi-model.js`. No third-party dependencies are required — only Node.js itself.

## Contributing

Read `AGENTS.md` before making any change, in particular the requirement to clarify ambiguous requirements before writing code, and to avoid inventing figures not present in `ChallengeFactsheet.md`.
