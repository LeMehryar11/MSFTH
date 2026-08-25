# Usage guide

This guide is for anyone who needs to run or present the Contoso GitHub Enterprise ROI model — the team, and Contoso if the tool is shared with them directly.

## Opening the interactive calculator

1. Locate `calculator.html` in this folder.
2. Double-click it, or open it directly in any modern web browser (Chrome, Firefox, Edge, Safari). No installation, server, or internet connection is required.
3. Move the **Employees** slider (500–1,000) and the **Time horizon (months)** slider (1–36). The chart and the three scenario cards update immediately.
4. The table beneath the chart lists every input the model uses, tagged as either a handout **Fact** or a team **Assumption**. Assumptions should be validated with Contoso before the figures are used externally.

## Opening the pitch deck

1. Open `pitch-deck.html` in a browser, the same way as the calculator.
2. Use the **Next / Prev** buttons, or the left/right arrow keys, to move between slides.
3. To print or export to PDF: use your browser's print function (Ctrl/Cmd+P). Each slide prints on its own page.

## Changing the model's assumptions

The scenario assumptions (discount levels, migration effort, productivity value) live in one place: the `SCENARIOS` constant near the top of `roi-model.js`. Both `calculator.html` and `pitch-deck.html` read from this same file, so a change made there is reflected everywhere automatically — there is nothing to update in the HTML files themselves.

Do not change the `FACTS` constant unless Contoso provides a new, confirmed figure to replace one from the original handout.

## Running the test suite

Requires Node.js (any reasonably recent version). From this folder:

```
npm test
```

This runs the checks in `roi-model.test.js` using Node's built-in test runner — no separate install step is needed.

## Reading the figures

Every number shown traces back to either:
- a **handout fact** (fixed pricing, discount caps, user ratios, repository count), or
- a **labelled team assumption** (discount level actually negotiated, productivity value, migration effort per repository).

`ROI-Model.md` sets out the exact formulas and the worked example that reproduces the handout's own reference numbers ($234,612/year GitHub cost and $29,880/year Azure DevOps cost at 500 users), so the model can be checked independently of the code. `Sceptic-Report.md`, `Advocate-Report.md`, `Neutral-Report.md` and `Quant-Report.md` each explain, in more detail, why that agent's specific numbers were chosen and where they are still uncertain.
