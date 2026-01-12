import { formatCurrency, formatNumber } from "/assets/js/core/format.js";
import { toNumber } from "/assets/js/core/validate.js";

const balanceInput = document.querySelector("#balance");
const aprInput = document.querySelector("#apr");
const paymentInput = document.querySelector("#payment");
const result = document.querySelector("#payoff-result");
const details = document.querySelector("#payoff-details");
const button = document.querySelector("#payoff-calc");
const explanationContainer = document.querySelector("#payoff-explanation");

function calculatePayoff(balance, apr, payment) {
  if (balance <= 0 || payment <= 0) {
    return {
      error: "Enter a balance and monthly payment above 0.",
    };
  }

  const monthlyRate = apr / 100 / 12;

  if (monthlyRate > 0 && payment <= balance * monthlyRate) {
    return {
      error: "Payment is too low to cover the monthly interest.",
    };
  }

  let months;
  if (monthlyRate === 0) {
    months = balance / payment;
  } else {
    months = Math.log(payment / (payment - balance * monthlyRate)) / Math.log(1 + monthlyRate);
  }

  const roundedMonths = Math.ceil(months);
  const totalPaid = roundedMonths * payment;
  const totalInterest = totalPaid - balance;

  return {
    months: roundedMonths,
    totalPaid,
    totalInterest,
  };
}

function renderResult() {
  const balance = toNumber(balanceInput.value);
  const apr = toNumber(aprInput.value);
  const payment = toNumber(paymentInput.value);

  const payoff = calculatePayoff(balance, apr, payment);

  if (payoff.error) {
    result.textContent = `Result: ${payoff.error}`;
    details.textContent = "";
    return;
  }

  result.textContent = `Result: ${formatNumber(payoff.months)} months to payoff.`;
  details.textContent = `Total paid: ${formatCurrency(payoff.totalPaid)} · Total interest: ${formatCurrency(
    payoff.totalInterest
  )}`;
}

async function loadExplanation() {
  if (!explanationContainer) {
    return;
  }

  try {
    const response = await fetch("./explanation.html");
    explanationContainer.innerHTML = response.ok
      ? await response.text()
      : "Explanation content is unavailable right now.";
  } catch (error) {
    console.error("Unable to load explanation", error);
    explanationContainer.textContent = "Explanation content is unavailable right now.";
  }
}

button.addEventListener("click", renderResult);
renderResult();
loadExplanation();
