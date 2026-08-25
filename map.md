# Repository map

```
.
├── AGENTS.md              Operating rules for anyone (human or AI) working in this repository.
├── AgentTeam.md           The five recommended agents (Sceptic, Advocate, Neutral, Quant, Presenter),
│                          their tasks and iteration loops.
├── ChallengeFactsheet.md  Concise summary of the handout: scenario, boundaries, cost facts,
│                          value drivers, deliverables and final-pitch questions.
├── ROI-Model.md           Quant's human-readable formula specification, matching roi-model.js exactly.
├── Sceptic-Report.md      Sceptic's detailed reasoning for the conservative assumptions and open risks.
├── Advocate-Report.md     Advocate's detailed reasoning for the upside assumptions, honestly including
│                          where even the best legitimate case falls short.
├── Neutral-Report.md      Neutral's reconciliation of the two, the base-case choices, and the full
│                          explanation of why the recommendation is a bounded pilot, not a full migration.
├── Quant-Report.md        Quant's explanation of every formula, each derivation, and test coverage.
├── roi-model.js           Single source-of-truth calculation module (facts, scenario assumptions,
│                          and pure functions). Loaded by both calculator.html and pitch-deck.html,
│                          and required directly by roi-model.test.js.
├── roi-model.test.js      Node built-in test suite (node --test) covering the three scenarios,
│                          boundary user counts, and edge cases.
├── calculator.html        Presenter's interactive ROI calculator for the client — two live sliders
│                          (employees, months), all three scenarios plotted in real time.
├── pitch-deck.html        Presenter's minimal, corporate-styled slide deck (keyboard-navigable,
│                          print-friendly), computed from the same roi-model.js.
├── package.json           Marks this as a Node project; `npm test` runs the test suite. No
│                          third-party dependencies.
├── todo.md                Current outstanding tasks and their status.
├── map.md                 This file.
├── README.md              Project overview for contributors.
└── usage.md               Instructions for end users (the team, and Contoso) on running the tool.
```

Update this file whenever a file is added, moved, or removed.
