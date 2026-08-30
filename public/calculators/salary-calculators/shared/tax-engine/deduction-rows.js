/**
 * Deduction-row mapper (common-layer presentation — tax-engine spec §62).
 *
 * Turns a country engine result into an itemised list of deductions for the visible
 * "Deductions" section: each line the country's payroll system actually applies, in order,
 * as `{ id, label, amount }`. Country-agnostic caller; the country-specific knowledge is the
 * per-country mapper below. Pure — no DOM.
 *
 * `amount` is the annual figure at full precision; the UI rounds.
 */

function ukRows(result) {
  const rows = [{ id: 'incomeTax', label: 'Income Tax', amount: result.incomeTax.total }];
  rows.push({ id: 'ni', label: 'National Insurance', amount: result.nationalInsurance.total });
  if (result.pension && result.pension.takeHomeCost > 0) {
    rows.push({
      id: 'pension',
      label: `Pension (${result.pension.reliefMethodName})`,
      amount: result.pension.takeHomeCost,
    });
  }
  for (const loan of result.studentLoans.entries || []) {
    if (loan.amount > 0) rows.push({ id: loan.id, label: loan.name, amount: loan.amount });
  }
  return rows;
}

function usRows(result) {
  const rows = [
    { id: 'federal', label: 'Federal income tax', amount: result.federalTax.total },
  ];
  if (result.stateTax && result.stateTax.total > 0) {
    rows.push({
      id: 'state',
      label: `${result.state ? result.state.name : 'State'} income tax`,
      amount: result.stateTax.total,
    });
  }
  rows.push({ id: 'socialSecurity', label: 'Social Security', amount: result.fica.socialSecurity });
  rows.push({ id: 'medicare', label: 'Medicare', amount: result.fica.medicare });
  if (result.fica.additionalMedicare > 0) {
    rows.push({
      id: 'additionalMedicare',
      label: 'Additional Medicare',
      amount: result.fica.additionalMedicare,
    });
  }
  for (const entry of (result.statePayrollTaxes && result.statePayrollTaxes.entries) || []) {
    if (entry.amount > 0) rows.push({ id: entry.id, label: entry.name, amount: entry.amount });
  }
  if (result.pretaxDeductions > 0) {
    rows.push({
      id: 'pretax',
      label: '401(k) / pre-tax contributions',
      amount: result.pretaxDeductions,
    });
  }
  return rows;
}

function caRows(result) {
  const plan = result.cpp || result.qpp;
  const rows = [
    { id: 'federal', label: 'Federal income tax', amount: result.federalTax.payable },
    {
      id: 'provincial',
      label: `${result.province ? result.province.name : 'Provincial'} income tax`,
      amount: result.provincialTax.afterBpa,
    },
  ];
  if (result.provincialTax.surtax && result.provincialTax.surtax.total > 0) {
    rows.push({
      id: 'surtax',
      label: `${result.province.name} surtax`,
      amount: result.provincialTax.surtax.total,
    });
  }
  if (result.provincialTax.healthPremium && result.provincialTax.healthPremium.total > 0) {
    rows.push({
      id: 'healthPremium',
      label: `${result.province.name} health premium`,
      amount: result.provincialTax.healthPremium.total,
    });
  }
  rows.push({ id: 'pensionPlan', label: result.qpp ? 'QPP' : 'CPP', amount: plan.total });
  rows.push({ id: 'ei', label: result.qpip ? 'EI (Quebec rate)' : 'EI', amount: result.ei.amount });
  if (result.qpip && result.qpip.amount > 0) {
    rows.push({ id: 'qpip', label: 'QPIP', amount: result.qpip.amount });
  }
  return rows;
}

/**
 * @param {object} result  a UK / US / CA engine result (`result.country` distinguishes them)
 * @returns {Array<{id:string,label:string,amount:number}>}
 */
export function deductionRows(result) {
  if (!result || !result.country) return [];
  if (result.country === 'US') return usRows(result).filter((r) => r.amount > 0 || r.id === 'federal');
  if (result.country === 'CA') return caRows(result).filter((r) => r.amount > 0);
  return ukRows(result).filter((r) => r.amount > 0 || r.id === 'incomeTax');
}
