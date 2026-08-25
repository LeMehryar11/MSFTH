(function () {
  'use strict';

  const {
    FACTS,
    SCENARIOS,
    adoAnnualCost,
    githubAnnualCost,
    incrementalAnnualCost,
    productivityValueAnnual,
    migrationCostUsd,
    toolRetirementAnnualSaving,
    netAnnualPosition,
    cumulativePosition,
    paybackMonth,
    formatUsd,
  } = window.ROIModel;

  const SCENARIO_KEYS = ['conservative', 'base', 'upside'];
  const STYLE = {
    conservative: { colour: '#c75a3b', soft: '#f5ded4', label: 'Conservative' },
    base: { colour: '#1e4858', soft: '#dfeaed', label: 'Base' },
    upside: { colour: '#3d7564', soft: '#dfeae5', label: 'Upside' },
  };
  const TOOL_LABELS = { blackDuck: 'BlackDuck', sonarQube: 'SonarQube', nexus: 'Nexus' };
  const DEFAULTS = Object.fromEntries(SCENARIO_KEYS.map((key) => [key, {
    hoursPerRepo: SCENARIOS[key].migrationHoursPerRepo,
    minutesSaved: SCENARIOS[key].minutesSavedPerCommitterMonth,
  }]));

  const state = {
    employees: 500,
    months: 60,
    inspectMonth: 60,
    visible: { conservative: true, base: true, upside: true },
    overrides: structuredClone(DEFAULTS),
  };

  const elements = {
    employees: document.getElementById('employees'),
    employeesValue: document.getElementById('employeesValue'),
    months: document.getElementById('months'),
    monthsValue: document.getElementById('monthsValue'),
    inspectMonth: document.getElementById('inspectMonth'),
    inspectMonthValue: document.getElementById('inspectMonthValue'),
    scenarioControls: document.getElementById('scenarioControls'),
    scenarioCards: document.getElementById('scenarioCards'),
    assumptionRows: document.getElementById('assumptionRows'),
    legend: document.getElementById('legend'),
    chart: document.getElementById('roiChart'),
    chartReadout: document.getElementById('chartReadout'),
    adoAnnual: document.getElementById('adoAnnual'),
    githubAnnual: document.getElementById('githubAnnual'),
    incrementalAnnual: document.getElementById('incrementalAnnual'),
    basePosition: document.getElementById('basePosition'),
    basePositionCaption: document.getElementById('basePositionCaption'),
    baseStatus: document.getElementById('baseStatus'),
    baseStatusDetail: document.getElementById('baseStatusDetail'),
    resetButton: document.getElementById('resetButton'),
    downloadButton: document.getElementById('downloadButton'),
  };

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, Number.isFinite(value) ? value : minimum));
  }

  function modelOverrides(key) {
    return {
      hoursPerRepo: state.overrides[key].hoursPerRepo,
      minutesSavedPerCommitterMonth: state.overrides[key].minutesSaved,
    };
  }

  function compactUsd(value, signed = false) {
    const absolute = Math.abs(value);
    const digits = absolute >= 1_000_000 ? `${(absolute / 1_000_000).toFixed(2)}m` : `${Math.round(absolute / 1_000)}k`;
    const sign = value < 0 ? '−' : signed && value > 0 ? '+' : '';
    return `${sign}$${digits}`;
  }

  function scenarioResult(key, month = state.months) {
    const overrides = modelOverrides(key);
    return {
      migration: migrationCostUsd(key, FACTS.repoCount, overrides.hoursPerRepo),
      productivity: productivityValueAnnual(state.employees, key, overrides.minutesSavedPerCommitterMonth),
      toolSaving: toolRetirementAnnualSaving(state.employees, key),
      netAnnual: netAnnualPosition(state.employees, key, overrides.minutesSavedPerCommitterMonth),
      cumulative: cumulativePosition(state.employees, key, month, overrides),
      payback: paybackMonth(state.employees, key, 60, overrides),
    };
  }

  function renderControls() {
    elements.scenarioControls.innerHTML = SCENARIO_KEYS.map((key) => {
      const scenario = SCENARIOS[key];
      const style = STYLE[key];
      return `
        <article class="scenario-control" style="--scenario-colour:${style.colour}">
          <header><strong>${style.label}</strong><span>${scenario.retirementTransitionMonths ? `${scenario.retirementTransitionMonths}m transition` : 'No retirement'}</span></header>
          <div class="scenario-fields">
            <label>Hours / repo
              <input type="number" data-key="${key}" data-field="hoursPerRepo" min="0.1" max="40" step="0.1" value="${state.overrides[key].hoursPerRepo}" aria-label="${style.label} migration hours per repository" />
            </label>
            <label>Minutes saved
              <input type="number" data-key="${key}" data-field="minutesSaved" min="0" max="1200" step="10" value="${state.overrides[key].minutesSaved}" aria-label="${style.label} minutes saved per active committer per month" />
            </label>
          </div>
        </article>`;
    }).join('');
  }

  function renderLegend() {
    elements.legend.innerHTML = SCENARIO_KEYS.map((key) => `
      <button type="button" data-legend="${key}" aria-pressed="${state.visible[key]}" style="--scenario-colour:${STYLE[key].colour}">
        <i></i>${STYLE[key].label}
      </button>`).join('');
  }

  function renderLedger() {
    elements.assumptionRows.innerHTML = SCENARIO_KEYS.map((key) => {
      const scenario = SCENARIOS[key];
      const style = STYLE[key];
      const tools = scenario.toolsRetired.length ? scenario.toolsRetired.map((tool) => TOOL_LABELS[tool]).join(', ') : 'None';
      return `
        <tr>
          <td><strong style="--scenario-colour:${style.colour}"><i></i>${style.label}</strong></td>
          <td>${state.overrides[key].hoursPerRepo.toFixed(1)} h</td>
          <td>${Math.round(state.overrides[key].minutesSaved)} min</td>
          <td>${tools}</td>
          <td>${scenario.retirementTransitionMonths ? `${scenario.retirementTransitionMonths} months` : 'Not applicable'}</td>
          <td><span class="tag assumption">Team assumption</span></td>
        </tr>`;
    }).join('');
  }

  function renderMetrics() {
    const base = scenarioResult('base');
    elements.employeesValue.textContent = state.employees.toLocaleString('en-GB');
    elements.monthsValue.textContent = `${state.months} ${state.months === 1 ? 'month' : 'months'}`;
    elements.inspectMonthValue.textContent = state.inspectMonth;
    elements.adoAnnual.textContent = formatUsd(adoAnnualCost(state.employees));
    elements.githubAnnual.textContent = formatUsd(githubAnnualCost(state.employees, 'base'));
    elements.incrementalAnnual.textContent = formatUsd(incrementalAnnualCost(state.employees, 'base'));
    elements.basePosition.textContent = compactUsd(base.cumulative, true);
    elements.basePosition.className = base.cumulative >= 0 ? 'positive' : 'negative';
    elements.basePositionCaption.textContent = `At month ${state.months} · full estate`;
    elements.baseStatus.textContent = base.payback ? `Base payback at month ${base.payback}` : 'Base case does not pay back';
    elements.baseStatusDetail.textContent = base.payback
      ? 'Within the model’s 60-month test horizon.'
      : 'No break-even within the 60-month model horizon.';
  }

  function renderScenarioCards() {
    elements.scenarioCards.innerHTML = SCENARIO_KEYS.map((key) => {
      const result = scenarioResult(key);
      const style = STYLE[key];
      const payback = result.payback ? `${result.payback} months` : 'Beyond 60 months';
      return `
        <article class="scenario-card" style="--scenario-colour:${style.colour};--scenario-soft:${style.soft}">
          <header><h3>${style.label}</h3><span>${result.payback ? 'PAYBACK FOUND' : 'NO PAYBACK'}</span></header>
          <p class="scenario-value ${result.cumulative >= 0 ? 'positive' : 'negative'}">${compactUsd(result.cumulative, true)}</p>
          <p class="scenario-caption">Cumulative position at month ${state.months}</p>
          <div class="scenario-stats">
            <div><span>Migration cost</span><strong>${compactUsd(result.migration)}</strong></div>
            <div><span>Payback</span><strong>${payback}</strong></div>
            <div><span>Annual productivity</span><strong>${compactUsd(result.productivity)}</strong></div>
            <div><span>Annual tool saving</span><strong>${compactUsd(result.toolSaving)}</strong></div>
          </div>
        </article>`;
    }).join('');
  }

  function chartData() {
    return Object.fromEntries(SCENARIO_KEYS.map((key) => [key,
      Array.from({ length: state.months + 1 }, (_, month) => cumulativePosition(
        state.employees,
        key,
        month,
        modelOverrides(key),
      )),
    ]));
  }

  function drawChart() {
    const canvas = elements.chart;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const context = canvas.getContext('2d');
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const width = rect.width;
    const height = rect.height;
    const margin = { top: 24, right: 28, bottom: 42, left: width < 600 ? 58 : 76 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    const data = chartData();
    const visibleKeys = SCENARIO_KEYS.filter((key) => state.visible[key]);
    const values = visibleKeys.flatMap((key) => data[key]);
    const rawMin = Math.min(0, ...(values.length ? values : [0]));
    const rawMax = Math.max(0, ...(values.length ? values : [1]));
    const padding = Math.max((rawMax - rawMin) * 0.1, 100_000);
    const low = rawMin - padding;
    const high = rawMax + padding;
    const x = (month) => margin.left + (month / Math.max(1, state.months)) * plotWidth;
    const y = (value) => margin.top + ((high - value) / (high - low)) * plotHeight;

    context.clearRect(0, 0, width, height);
    context.font = '11px Inter, Segoe UI, sans-serif';
    context.textBaseline = 'middle';

    for (let tick = 0; tick <= 4; tick += 1) {
      const value = high - ((high - low) * tick) / 4;
      const yy = y(value);
      context.beginPath();
      context.moveTo(margin.left, yy);
      context.lineTo(width - margin.right, yy);
      context.strokeStyle = Math.abs(value) < (high - low) / 8 ? '#a9a196' : '#e4ddd2';
      context.lineWidth = Math.abs(value) < (high - low) / 8 ? 1.4 : 1;
      context.stroke();
      context.fillStyle = '#748086';
      context.textAlign = 'right';
      context.fillText(compactUsd(value), margin.left - 10, yy);
    }

    const xTicks = [0, 0.25, 0.5, 0.75, 1].map((fraction) => Math.round(state.months * fraction));
    [...new Set(xTicks)].forEach((month) => {
      const xx = x(month);
      context.beginPath();
      context.moveTo(xx, margin.top);
      context.lineTo(xx, height - margin.bottom);
      context.strokeStyle = '#ece6dc';
      context.lineWidth = 1;
      context.stroke();
      context.fillStyle = '#748086';
      context.textAlign = 'center';
      context.fillText(`${month}m`, xx, height - 19);
    });

    visibleKeys.forEach((key) => {
      context.beginPath();
      data[key].forEach((value, month) => {
        const xx = x(month);
        const yy = y(value);
        if (month === 0) context.moveTo(xx, yy);
        else context.lineTo(xx, yy);
      });
      context.strokeStyle = STYLE[key].colour;
      context.lineWidth = key === 'base' ? 3.3 : 2.4;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.setLineDash(key === 'conservative' ? [7, 5] : []);
      context.stroke();
      context.setLineDash([]);
    });

    const inspectX = x(state.inspectMonth);
    context.beginPath();
    context.moveTo(inspectX, margin.top);
    context.lineTo(inspectX, height - margin.bottom);
    context.strokeStyle = '#707b80';
    context.setLineDash([3, 4]);
    context.lineWidth = 1;
    context.stroke();
    context.setLineDash([]);

    visibleKeys.forEach((key) => {
      context.beginPath();
      context.arc(inspectX, y(data[key][state.inspectMonth]), 4.8, 0, Math.PI * 2);
      context.fillStyle = STYLE[key].colour;
      context.fill();
      context.strokeStyle = '#fffdf8';
      context.lineWidth = 2;
      context.stroke();
    });

    elements.chartReadout.innerHTML = visibleKeys.map((key) => `
      <span style="--scenario-colour:${STYLE[key].colour}"><i></i>${STYLE[key].label} <strong>${compactUsd(data[key][state.inspectMonth], true)}</strong></span>`).join('');
  }

  function render() {
    renderMetrics();
    renderScenarioCards();
    renderLedger();
    drawChart();
  }

  function reset() {
    state.employees = 500;
    state.months = 60;
    state.inspectMonth = 60;
    state.visible = { conservative: true, base: true, upside: true };
    state.overrides = structuredClone(DEFAULTS);
    elements.employees.value = state.employees;
    elements.months.value = state.months;
    elements.inspectMonth.max = state.months;
    elements.inspectMonth.value = state.inspectMonth;
    renderControls();
    renderLegend();
    render();
  }

  function downloadScenario() {
    const results = Object.fromEntries(SCENARIO_KEYS.map((key) => [key, scenarioResult(key)]));
    const payload = {
      generatedAt: new Date().toISOString(),
      model: 'Contoso GitHub Enterprise ROI',
      parameters: {
        employees: state.employees,
        timeHorizonMonths: state.months,
        fixedFacts: FACTS,
        scenarioOverrides: state.overrides,
      },
      results,
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'contoso-ghe-roi-scenario.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  elements.employees.addEventListener('input', (event) => {
    state.employees = clamp(Number(event.target.value), 500, 1000);
    render();
  });
  elements.months.addEventListener('input', (event) => {
    state.months = clamp(Number(event.target.value), 1, 60);
    state.inspectMonth = Math.min(state.inspectMonth, state.months);
    elements.inspectMonth.max = state.months;
    elements.inspectMonth.value = state.inspectMonth;
    render();
  });
  elements.inspectMonth.addEventListener('input', (event) => {
    state.inspectMonth = clamp(Number(event.target.value), 0, state.months);
    renderMetrics();
    drawChart();
  });
  elements.scenarioControls.addEventListener('input', (event) => {
    const input = event.target.closest('input[data-key][data-field]');
    if (!input) return;
    const key = input.dataset.key;
    const field = input.dataset.field;
    const minimum = field === 'hoursPerRepo' ? 0.1 : 0;
    const maximum = field === 'hoursPerRepo' ? 40 : 1200;
    state.overrides[key][field] = clamp(Number(input.value), minimum, maximum);
    render();
  });
  elements.scenarioControls.addEventListener('change', (event) => {
    const input = event.target.closest('input[data-key][data-field]');
    if (!input) return;
    input.value = state.overrides[input.dataset.key][input.dataset.field];
  });
  elements.legend.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-legend]');
    if (!button) return;
    const key = button.dataset.legend;
    state.visible[key] = !state.visible[key];
    button.setAttribute('aria-pressed', String(state.visible[key]));
    drawChart();
  });
  elements.resetButton.addEventListener('click', reset);
  elements.downloadButton.addEventListener('click', downloadScenario);
  window.addEventListener('resize', drawChart);
  if ('ResizeObserver' in window) new ResizeObserver(drawChart).observe(elements.chart);

  renderControls();
  renderLegend();
  render();
}());
