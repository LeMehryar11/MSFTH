// roi-model.js
//
// Single source-of-truth ROI/sensitivity model for the Contoso GHE ROI
// challenge (Quant's formula specification, implemented once and reused by
// calculator.html and pitch-deck.html — never re-derived downstream).
//
// FACTS come directly from the handout and must not be edited without a new
// handout figure. SCENARIOS are labelled team assumptions requiring
// validation with Contoso before being treated as fact (see ROI-Model.md).
//
// Written as a plain script (not an ES module) so it can be loaded with a
// classic <script src="roi-model.js"> tag straight from the local
// filesystem (file://) without hitting browser module-CORS restrictions,
// while remaining loadable in Node via require() for the test suite.

const FACTS = Object.freeze({
  gheListPrice: 21, // $/user/month
  ghasListPrice: 49, // $/user/month
  activeCommitterRatio: 0.6, // share of users counted as active committers for GHAS
  adoListPrice: 6, // $/user/month
  adoCurrentDiscount: 0.17, // already applied today, not a lever
  repoCount: 3000, // approximate private Azure Git repositories to migrate
  partnerRateEurPerHour: 240, // migration partner rate, per person
  maxGheDiscount: 0.30,
  maxGhasDiscount: 0.17,
});

// Illustrative EUR/USD parity used only to combine the euro-denominated
// migration cost with dollar-denominated licence figures in one chart.
// This is not a handout fact — confirm the real rate with finance before
// using these combined figures in a final business case.
const FX_EUR_TO_USD = 1.0;

// Assumed fully-loaded engineering cost, used only to translate a stated
// number of minutes saved per active committer per month into a dollar
// value. This is a placeholder — replace with Contoso's real blended
// engineering cost before using the productivity figures externally.
const LOADED_HOURLY_RATE_USD = 80;

// Scenario assumption sets. Only the upside discounts equal handout facts
// (the stated maximums). Discounts span the full realistic range: the
// conservative case assumes no discount has been secured at all (the true
// floor, since nothing beyond the stated maximums is guaranteed), through
// to the maximum on offer. Productivity/consolidation value is expressed
// as minutes of engineer time saved per active committer per month, not
// as a bare dollar figure, so the claim behind each number is checkable
// (see Quant-Report.md for the reasoning behind each figure).
const SCENARIOS = Object.freeze({
  conservative: Object.freeze({
    label: 'Conservative',
    gheDiscount: 0.00, // no discount secured — a genuine floor, not a guess
    ghasDiscount: 0.00,
    migrationHoursPerRepo: 3.0, // limited automation reuse, cautious effort
    minutesSavedPerCommitterMonth: 0, // no credited value: redundant with existing tooling
  }),
  base: Object.freeze({
    label: 'Base',
    gheDiscount: 0.15,
    ghasDiscount: 0.08,
    migrationHoursPerRepo: 1.5,
    minutesSavedPerCommitterMonth: 15, // ~2 minutes saved per working day
  }),
  upside: Object.freeze({
    label: 'Upside',
    gheDiscount: FACTS.maxGheDiscount,
    ghasDiscount: FACTS.maxGhasDiscount,
    migrationHoursPerRepo: 0.75, // high automation reuse, best-case effort
    minutesSavedPerCommitterMonth: 45, // ~2 minutes saved per working day, doubled
  }),
});

/** Dollar value per active committer per month implied by a scenario's stated time saving. */
function valuePerCommitterMonth(scenarioKey) {
  const s = SCENARIOS[scenarioKey];
  return (s.minutesSavedPerCommitterMonth / 60) * LOADED_HOURLY_RATE_USD;
}

/** Current-state annual Azure DevOps licence cost for the given user count. */
function adoAnnualCost(users) {
  return users * FACTS.adoListPrice * (1 - FACTS.adoCurrentDiscount) * 12;
}

/** Annual GitHub Enterprise Platform licence cost at the given discount. */
function gheAnnualCost(users, gheDiscount) {
  return users * FACTS.gheListPrice * (1 - gheDiscount) * 12;
}

/** Annual GitHub Advanced Security cost, applied only to active committers. */
function ghasAnnualCost(users, ghasDiscount) {
  return users * FACTS.activeCommitterRatio * FACTS.ghasListPrice * (1 - ghasDiscount) * 12;
}

/** Combined annual GHE + GHAS licence cost for a named scenario. */
function githubAnnualCost(users, scenarioKey) {
  const s = SCENARIOS[scenarioKey];
  return gheAnnualCost(users, s.gheDiscount) + ghasAnnualCost(users, s.ghasDiscount);
}

/** Additional annual licence cost of GitHub versus the Azure DevOps baseline. */
function incrementalAnnualCost(users, scenarioKey) {
  return githubAnnualCost(users, scenarioKey) - adoAnnualCost(users);
}

/** Annual productivity/consolidation value credited to active committers. */
function productivityValueAnnual(users, scenarioKey) {
  return users * FACTS.activeCommitterRatio * valuePerCommitterMonth(scenarioKey) * 12;
}

/**
 * One-off migration cost. Defaults to the full ~3,000-repository estate,
 * but accepts an explicit repository count so the same formula can price
 * a smaller, bounded pilot without duplicating the calculation.
 */
function migrationCostUsd(scenarioKey, repoCount = FACTS.repoCount) {
  const s = SCENARIOS[scenarioKey];
  const eur = repoCount * s.migrationHoursPerRepo * FACTS.partnerRateEurPerHour;
  return eur * FX_EUR_TO_USD;
}

/** Net annual position: productivity value minus incremental licence cost. */
function netAnnualPosition(users, scenarioKey) {
  return productivityValueAnnual(users, scenarioKey) - incrementalAnnualCost(users, scenarioKey);
}

/**
 * Cumulative financial position at a given month, migration cost applied
 * up-front at month zero, net annual position accruing pro-rata thereafter.
 */
function cumulativePosition(users, scenarioKey, months) {
  const net = netAnnualPosition(users, scenarioKey);
  return (net * months) / 12 - migrationCostUsd(scenarioKey);
}

/**
 * First month at which cumulative position reaches zero or above, within
 * maxMonths. Returns null if payback is not reached in the given horizon.
 */
function paybackMonth(users, scenarioKey, maxMonths) {
  for (let m = 1; m <= maxMonths; m += 1) {
    if (cumulativePosition(users, scenarioKey, m) >= 0) return m;
  }
  return null;
}

/** Format a number as US-dollar currency, no decimals, for display. */
function formatUsd(value) {
  const sign = value < 0 ? '-' : '';
  return `${sign}$${Math.abs(Math.round(value)).toLocaleString('en-GB')}`;
}

// Single export surface, exposed both to Node (CommonJS, for the test
// suite) and to the browser (as a global, for a classic <script> tag) —
// one definition, two loading paths, no duplicated logic.
const ROIModel = {
  FACTS,
  FX_EUR_TO_USD,
  LOADED_HOURLY_RATE_USD,
  SCENARIOS,
  adoAnnualCost,
  gheAnnualCost,
  ghasAnnualCost,
  githubAnnualCost,
  incrementalAnnualCost,
  valuePerCommitterMonth,
  productivityValueAnnual,
  migrationCostUsd,
  netAnnualPosition,
  cumulativePosition,
  paybackMonth,
  formatUsd,
};

if (typeof module === 'object' && module.exports) {
  module.exports = ROIModel;
}
if (typeof window !== 'undefined') {
  window.ROIModel = ROIModel;
}
