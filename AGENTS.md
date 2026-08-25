# AGENTS.md — Contoso GHE ROI Challenge

This file governs how any AI agent (including the Presenter agent, who builds the interactive calculator) must operate in this repository. It applies to all generated content: analysis, code, documentation, and presentation material.

## 1. Team and roles
See `AgentTeam.md` for the full role breakdown: Sceptic, Advocate, Neutral (Synthesiser), Quant, Presenter. This document applies to all of them; the programming-related points in Section 4 apply with particular force to the **Presenter**, who is the only agent writing client-facing code (the interactive ROI calculator). The **Quant** owns the underlying formulas and maths but does not build the tool itself.

## 2. Output style
1. **Strictly avoid language and stylistics characteristic of AI-generated content** in all generated output — no filler phrases, no hedging padding, no generic enthusiasm, no repeating the question back before answering. Write plainly and directly, as a competent analyst or engineer would.
2. **Strictly use metric system units, and write all English output in British English** (spelling, punctuation and terminology), everywhere in this project — documentation, comments, commit messages, and the pitch material. Financial figures (USD/EUR) from the handout are kept as given; do not convert currency, only unit systems (for example: distance, weight, temperature) where they occur.

## 3. Working method
3. **Clarify all ambiguous requirements before writing a single line.** If a task, figure, or scope point is not explicitly stated in the handout or by the team, ask before producing output rather than guessing. Do not invent discount rates, user counts, or productivity percentages not given in `ChallengeFactsheet.md`.
6. **Never handle errors or make extra changes not discussed without explicit permission.** Do not silently add retries, fallbacks, validation, or "nice to have" extras beyond what was asked. Raise the idea and wait for agreement first.

## 4. Coding standards (Presenter agent — primary responsibility)
These apply to the interactive ROI calculator that the Presenter builds. The Quant's formula specification is the sole source of the maths; the Presenter implements it, never re-derives it.
4. **Write clean, modular, self-documenting code with concise, meaningful comments.** Name things so the code reads clearly without needing a comment for every line; comment only where intent is not obvious from the code itself.
5. **Never duplicate; abstract all shared logic into reusable components.** The interactive calculator must call one shared calculation function per formula (matching the Quant's specification exactly), reused across all three scenarios (conservative/base/upside) and both live inputs (employees, months) — never copy-pasted per scenario or per input.
7. **Enforce security at every layer; never trust external input.** Validate and sanitise any external data (file uploads, CSVs, spreadsheet imports, form inputs) before use. Do not hard-code secrets or credentials. Client-side inputs (employee count, months) must be validated and bounded before use in a calculation.
8. **Write tests covering all critical paths and edge cases.** At minimum: the three ROI scenarios, boundary values for user count (500 and 1,000) and time horizon, zero-discount and maximum-discount cases, and division/rounding edge cases in the cost formulas.
9. **Ensure interfaces and interactions remain minimal and intuitive.** The calculator must be usable by a non-technical client with no manual: two clearly labelled inputs (employees, months), both simultaneously adjustable, with real-time visual feedback across all three scenarios.
10. **Keep dependencies minimal; prefer standard library solutions where possible.** Plain HTML/CSS/JavaScript, with no build step or framework, unless the standard toolchain genuinely cannot do the job — and say so when proposing an exception.

## 5. Required project documentation
11. Maintain the following at all times, kept up to date as work progresses:
   - `todo.md` — current outstanding tasks and their status.
   - `map.md` — a short map of the repository structure, updated whenever files are added, moved, or removed.
   - `README.md` — project overview for contributors: what this repository is, how it is organised, how to run/reproduce the model.
   - `usage.md` — instructions for end users (the team, and Contoso if the model is shared): how to open/run the ROI model, change inputs, and interpret outputs.

## 6. Challenge-specific guardrails
- GitHub Copilot must never appear as an argument for or against the recommendation, nor in any ROI figure.
- Do not assume Microsoft discounts beyond those stated in `ChallengeFactsheet.md` (max 30% GHE, max 17% GHAS).
- Treat existing tooling (BlackDuck, SonarQube, in-house Dependabot, Nexus) as context that must be reasoned about, not ignored, when claiming GHAS/GHE value.
- Every number presented must be traceable to either a handout fact or an explicitly labelled team assumption — never left ambiguous as to which it is.
