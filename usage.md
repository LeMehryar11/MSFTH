# Usage guide

This guide is for anyone who needs to run or present the Contoso GitHub Enterprise ROI model — the team, and Contoso if the tool is shared with them directly.

## Opening the interactive dashboard

1. Run `npm install`, then `npm run dev` from this folder.
2. Open the local address printed in the terminal.
3. Review the **Parameter inventory** first. Fixed handout facts and researched placeholders are shown separately from editable team assumptions.
4. Move the **Employees** slider (500–1,000) and the **Time horizon** slider (1–60 months). The chart and scenario cards update immediately.
5. Edit **Hours / repo** or **Minutes saved** for any scenario in the parameter rail. These values are validated and passed to the shared formula model without changing its stored defaults.
6. Use the chart legend to show or hide scenarios, and the month inspector to read each scenario at a specific point.
7. Select **Download current scenario** to save the current inputs and results as JSON.

`calculator.html` remains as a compatibility link and redirects to the same dashboard.

## Opening the pitch deck

1. Open `pitch-deck.html` in a browser, the same way as the calculator.
2. Use the **Next / Prev** buttons, or the left/right arrow keys, to move between slides.
3. To print or export to PDF: use your browser's print function (Ctrl/Cmd+P). Each slide prints on its own page.

## Changing the model's assumptions

The stored scenario defaults live in the `SCENARIOS` constant near the top of `roi-model.js`. Both the dashboard and `pitch-deck.html` read from this same file. Dashboard edits are temporary working overrides and do not mutate the defaults.

Do not change the `FACTS` constant unless Contoso provides a new, confirmed figure to replace one from the original handout.

## Running the test suite

Requires Node.js (any reasonably recent version). From this folder:

```
npm test
```

This runs the checks in `roi-model.test.js` using Node's built-in test runner.

## Reading the figures

Every number shown traces back to either:
- a **handout fact** (fixed pricing, discount caps, user ratios, repository count), or
- a **researched placeholder** (tool costs, loaded engineering rate or the illustrative EUR/USD basis), or
- a **labelled team assumption** (productivity value, migration effort per repository, tool retirement and transition timing).

`ROI-Model.md` sets out the exact formulas and the worked example that reproduces the handout's own reference numbers ($234,612/year GitHub cost and $29,880/year Azure DevOps cost at 500 users), so the model can be checked independently of the code. `Sceptic-Report.md`, `Advocate-Report.md`, `Neutral-Report.md` and `Quant-Report.md` each explain, in more detail, why that agent's specific numbers were chosen and where they are still uncertain.
