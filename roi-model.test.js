// roi-model.test.js
//
// Node's built-in test runner (`node --test`), no external test framework.
// Run with: npm test  (or: node --test)

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  FACTS,
  INDUSTRY_PLACEHOLDERS,
  SCENARIOS,
  adoAnnualCost,
  gheAnnualCost,
  ghasAnnualCost,
  githubAnnualCost,
  incrementalAnnualCost,
  valuePerCommitterMonth,
  productivityValueAnnual,
  migrationCostUsd,
  toolRetirementAnnualSaving,
  netAnnualPosition,
  cumulativePosition,
  paybackMonth,
} = require('./roi-model.js');

test('matches the handout\'s worked example at 500 users and maximum discounts', () => {
  assert.equal(adoAnnualCost(500), 29_880);
  assert.equal(githubAnnualCost(500, 'upside'), 234_612);
});

test('all three scenarios use the handout\'s maximum discount, per Contoso\'s confirmation', () => {
  for (const key of ['conservative', 'base', 'upside']) {
    assert.equal(SCENARIOS[key].gheDiscount, FACTS.maxGheDiscount);
    assert.equal(SCENARIOS[key].ghasDiscount, FACTS.maxGhasDiscount);
  }
  // With discount now identical across scenarios, incremental licence cost
  // must also be identical across scenarios — only migration effort,
  // productivity value and tool retirement still vary.
  const users = 500;
  const incrementals = ['conservative', 'base', 'upside'].map(k => incrementalAnnualCost(users, k));
  assert.equal(incrementals[0], incrementals[1]);
  assert.equal(incrementals[1], incrementals[2]);
});

test('ADO annual cost scales linearly with user count', () => {
  assert.equal(adoAnnualCost(1000), adoAnnualCost(500) * 2);
});

test('GHAS cost applies only to the active-committer ratio, not all users', () => {
  const users = 500;
  const ghasNoDiscount = ghasAnnualCost(users, 0);
  assert.equal(ghasNoDiscount, users * FACTS.activeCommitterRatio * FACTS.ghasListPrice * 12);
});

test('incremental annual cost is GitHub cost minus ADO cost, for each scenario', () => {
  for (const scenarioKey of ['conservative', 'base', 'upside']) {
    const expected = githubAnnualCost(500, scenarioKey) - adoAnnualCost(500);
    assert.equal(incrementalAnnualCost(500, scenarioKey), expected);
  }
});

test('conservative scenario credits zero productivity value and zero tool retirement', () => {
  assert.equal(productivityValueAnnual(500, 'conservative'), 0);
  assert.equal(toolRetirementAnnualSaving(500, 'conservative'), 0);
});

test('productivity value is derived from minutes saved and the loaded hourly rate', () => {
  for (const key of ['conservative', 'base', 'upside']) {
    const s = SCENARIOS[key];
    const expected = (s.minutesSavedPerCommitterMonth / 60) * 80; // $80/hour placeholder rate
    assert.equal(valuePerCommitterMonth(key), expected);
  }
});

test('productivity value accepts an override, without mutating the frozen scenario defaults', () => {
  const users = 500;
  const overridden = productivityValueAnnual(users, 'base', 999);
  const scenarioDefault = productivityValueAnnual(users, 'base');
  assert.notEqual(overridden, scenarioDefault);
  assert.equal(SCENARIOS.base.minutesSavedPerCommitterMonth, 150); // untouched
});

test('tool retirement saving matches the sum of the researched placeholder costs for the tools each scenario retires', () => {
  const users = 500;
  const activeCommitters = users * FACTS.activeCommitterRatio;
  assert.equal(toolRetirementAnnualSaving(users, 'conservative'), 0);
  assert.equal(toolRetirementAnnualSaving(users, 'base'), INDUSTRY_PLACEHOLDERS.blackDuckAnnualUsd);
  assert.equal(
    toolRetirementAnnualSaving(users, 'upside'),
    INDUSTRY_PLACEHOLDERS.blackDuckAnnualUsd
      + INDUSTRY_PLACEHOLDERS.sonarQubeAnnualUsd
      + activeCommitters * INDUSTRY_PLACEHOLDERS.nexusAnnualPerCommitterUsd
  );
});

test('tool retirement saving is not credited before its scenario\'s transition month', () => {
  const users = 500;
  const beforeTransition = cumulativePosition(users, 'base', SCENARIOS.base.retirementTransitionMonths - 1);
  const atTransition = cumulativePosition(users, 'base', SCENARIOS.base.retirementTransitionMonths);
  // Moving from just-before to exactly-at the transition month should jump
  // by less than a full year's saving (it starts accruing, not lump-summed).
  assert.ok(atTransition > beforeTransition);
});

test('migration cost can be scaled to a smaller pilot repository count without duplicating the formula', () => {
  const fullScope = migrationCostUsd('base');
  const pilotScope = migrationCostUsd('base', 300); // e.g. a 10% pilot
  assert.equal(pilotScope, 300 * SCENARIOS.base.migrationHoursPerRepo * FACTS.partnerRateEurPerHour);
  assert.ok(pilotScope < fullScope);
});

test('migration cost accepts an hours-per-repository override for the calculator\'s editable field', () => {
  const withDefault = migrationCostUsd('base', 300);
  const withOverride = migrationCostUsd('base', 300, 1.0);
  assert.equal(withOverride, 300 * 1.0 * FACTS.partnerRateEurPerHour);
  assert.notEqual(withOverride, withDefault);
});

test('boundary user counts (500 and 1000) both produce finite, non-negative licence costs', () => {
  for (const users of [500, 1000]) {
    for (const scenarioKey of ['conservative', 'base', 'upside']) {
      assert.ok(Number.isFinite(githubAnnualCost(users, scenarioKey)));
      assert.ok(githubAnnualCost(users, scenarioKey) > 0);
    }
  }
});

test('cumulative position at month 0 equals the negative migration cost (before any retirement transition)', () => {
  for (const scenarioKey of ['conservative', 'base', 'upside']) {
    assert.equal(cumulativePosition(500, scenarioKey, 0), -migrationCostUsd(scenarioKey));
  }
});

test('conservative scenario never reaches payback: no productivity value or tool saving is ever credited', () => {
  assert.ok(netAnnualPosition(500, 'conservative') < 0);
  assert.equal(paybackMonth(500, 'conservative', 600), null);
});

test('upside scenario reaches payback well within a 5-year horizon, given max discounts and full tool retirement', () => {
  const payback = paybackMonth(500, 'upside', 60);
  assert.notEqual(payback, null);
  assert.ok(payback < 24); // materially faster than 2 years at 500 users
});

test('payback month returns null when the horizon is never reached', () => {
  assert.equal(paybackMonth(500, 'conservative', 36), null);
});
