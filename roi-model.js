// roi-model.js
//
// Single source-of-truth ROI/sensitivity model for the Contoso GHE ROI
// challenge (Quant's formula specification, implemented once and reused by
// calculator.html and pitch-deck.html — never re-derived downstream).
//
// Three tiers of numbers are used throughout, and kept visually distinct
// wherever they are displayed:
//   FACTS                 — from the handout, do not edit without a new figure.
//   INDUSTRY_PLACEHOLDERS — researched externally (see Quant-Report.md for
//                           sources), not Contoso-specific, replace once real
//                           quotes/costs are known.
//   SCENARIOS             — team assumptions requiring validation with Contoso.
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

// Researched, non-Contoso-specific placeholder figures for the three
// existing tools, used only to price the "tool retirement" scenarios below.
// Sources (see Quant-Report.md for full citations):
//  - BlackDuck: enterprise contracts commonly reported in the $75k–$150k/year
//    range for mid-sized teams (flat, not per-seat, reflecting how these
//    deals are typically structured).
//  - SonarQube Enterprise Edition: typically $16k–$23k/year for a codebase
//    around 1M lines of code (flat, scales with code volume, not headcount).
//  - Nexus Repository Pro (self-hosted): typically $120–$175 per user/year.
const INDUSTRY_PLACEHOLDERS = Object.freeze({
  blackDuckAnnualUsd: 100000, // flat, mid-point of the researched range
  sonarQubeAnnualUsd: 20000, // flat, mid-point of the researched range
  nexusAnnualPerCommitterUsd: 150, // per active committer, mid-point of the researched range
});

// Scenario assumption sets. Discounts are now fixed at the handout's stated
// maximum in all three scenarios, per Contoso's confirmation that maximum
// discounts apply regardless of scenario — discount is therefore no longer
// a source of variation between scenarios. What still varies: migration
// effort, engineer time saved (both editable in calculator.html), and which
// existing tools are assumed retired, and when (see Neutral-Report.md and
// Quant-Report.md for the reasoning and sources behind each figure).
const SCENARIOS = Object.freeze({
  conservative: Object.freeze({
    label: 'Conservative',
    gheDiscount: FACTS.maxGheDiscount,
    ghasDiscount: FACTS.maxGhasDiscount,
    migrationHoursPerRepo: 10.0, // worst case: treats the whole estate as large/complex
    minutesSavedPerCommitterMonth: 0, // no credited value: redundant with existing tooling
    toolsRetired: [], // BlackDuck, SonarQube and Nexus all kept running alongside GitHub
    retirementTransitionMonths: 0, // not applicable — nothing is retired
  }),
  base: Object.freeze({
    label: 'Base',
    gheDiscount: FACTS.maxGheDiscount,
    ghasDiscount: FACTS.maxGhasDiscount,
    migrationHoursPerRepo: 5.0, // typical medium-complexity repository
    minutesSavedPerCommitterMonth: 150, // ~7 minutes/working day
    toolsRetired: ['blackDuck'], // the most directly redundant with GHAS's dependency/SCA scanning
    retirementTransitionMonths: 9, // a transition period before retirement takes effect
  }),
  upside: Object.freeze({
    label: 'Upside',
    gheDiscount: FACTS.maxGheDiscount,
    ghasDiscount: FACTS.maxGhasDiscount,
    migrationHoursPerRepo: 2.5, // best case: high automation reuse, well-tooled migration
    minutesSavedPerCommitterMonth: 300, // ~14 minutes/working day
    toolsRetired: ['blackDuck', 'sonarQube', 'nexus'], // all three, once confident in GHAS coverage
    retirementTransitionMonths: 12, // full retirement takes at least a year to execute safely
  }),
});

/** Dollar value per active committer per month implied by a given time saving. */
function valuePerCommitterMonth(scenarioKey, minutesSavedPerCommitterMonth = SCENARIOS[scenarioKey].minutesSavedPerCommitterMonth) {
  return (minutesSavedPerCommitterMonth / 60) * LOADED_HOURLY_RATE_USD;
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

/**
 * Annual productivity/consolidation value credited to active committers.
 * Accepts an explicit minutesSavedPerCommitterMonth override so the
 * calculator's editable field can recompute this without mutating the
 * frozen SCENARIOS defaults.
 */
function productivityValueAnnual(users, scenarioKey, minutesSavedPerCommitterMonth = SCENARIOS[scenarioKey].minutesSavedPerCommitterMonth) {
  return users * FACTS.activeCommitterRatio * valuePerCommitterMonth(scenarioKey, minutesSavedPerCommitterMonth) * 12;
}

/**
 * One-off migration cost. Defaults to the full ~3,000-repository estate and
 * the scenario's own hours-per-repository assumption, but accepts explicit
 * overrides for both so the same formula can price a smaller pilot, or a
 * user-edited effort figure in the calculator, without duplicating it.
 */
function migrationCostUsd(scenarioKey, repoCount = FACTS.repoCount, hoursPerRepo = SCENARIOS[scenarioKey].migrationHoursPerRepo) {
  const eur = repoCount * hoursPerRepo * FACTS.partnerRateEurPerHour;
  return eur * FX_EUR_TO_USD;
}

/** Annual saving from the tools a scenario assumes are retired, once retired. */
function toolRetirementAnnualSaving(users, scenarioKey) {
  const s = SCENARIOS[scenarioKey];
  const activeCommitters = users * FACTS.activeCommitterRatio;
  let saving = 0;
  if (s.toolsRetired.includes('blackDuck')) saving += INDUSTRY_PLACEHOLDERS.blackDuckAnnualUsd;
  if (s.toolsRetired.includes('sonarQube')) saving += INDUSTRY_PLACEHOLDERS.sonarQubeAnnualUsd;
  if (s.toolsRetired.includes('nexus')) saving += activeCommitters * INDUSTRY_PLACEHOLDERS.nexusAnnualPerCommitterUsd;
  return saving;
}

/**
 * Net annual position: productivity value plus (post-transition) tool
 * retirement saving, minus incremental licence cost. Accepts the same
 * optional minutes-saved override as productivityValueAnnual.
 */
function netAnnualPosition(users, scenarioKey, minutesSavedPerCommitterMonth) {
  return productivityValueAnnual(users, scenarioKey, minutesSavedPerCommitterMonth)
    + toolRetirementAnnualSaving(users, scenarioKey)
    - incrementalAnnualCost(users, scenarioKey);
}

/**
 * Cumulative financial position at a given month. Migration cost is applied
 * up front at month zero (using the given or default hours-per-repository
 * figure); productivity value accrues from month one; tool-retirement
 * saving accrues only from its scenario's transition month onward.
 */
function cumulativePosition(users, scenarioKey, months, overrides = {}) {
  const { minutesSavedPerCommitterMonth, hoursPerRepo } = overrides;
  const s = SCENARIOS[scenarioKey];
  const productivity = productivityValueAnnual(users, scenarioKey, minutesSavedPerCommitterMonth);
  const incremental = incrementalAnnualCost(users, scenarioKey);
  const migration = migrationCostUsd(scenarioKey, FACTS.repoCount, hoursPerRepo);

  const monthsSinceTransition = Math.max(0, months - s.retirementTransitionMonths);
  const toolSaving = toolRetirementAnnualSaving(users, scenarioKey) * (monthsSinceTransition / 12);

  const runningPosition = ((productivity - incremental) * months) / 12;
  return runningPosition + toolSaving - migration;
}

/**
 * First month at which cumulative position reaches zero or above, within
 * maxMonths. Returns null if payback is not reached in the given horizon.
 */
function paybackMonth(users, scenarioKey, maxMonths, overrides = {}) {
  for (let m = 1; m <= maxMonths; m += 1) {
    if (cumulativePosition(users, scenarioKey, m, overrides) >= 0) return m;
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
  formatUsd,
};

if (typeof module === 'object' && module.exports) {
  module.exports = ROIModel;
}
if (typeof window !== 'undefined') {
  window.ROIModel = ROIModel;
}
