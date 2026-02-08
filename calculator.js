 
// calculator.js
// Vrabče, tady máš čistý kód pro obsluhu kalkulačky

// Počkat na načtení DOM
document.addEventListener('DOMContentLoaded', function() {
    importConfig();
});

function importConfig() {
    if (typeof CONFIG === "undefined") {
        console.error("CONFIG není načten — zkontroluj config.js");
        return;
    }

    // Nastavení rozsahů z configu
    document.getElementById("propertyValue").min = CONFIG.property.min;
    document.getElementById("propertyValue").max = CONFIG.property.max;
    document.getElementById("propertyValue").step = CONFIG.property.step;
    document.getElementById("propertyValue").value = CONFIG.property.default;

    document.getElementById("loanAmount").min = CONFIG.loan.min;
    document.getElementById("loanAmount").max = CONFIG.loan.max;
    document.getElementById("loanAmount").step = CONFIG.loan.step;
    document.getElementById("loanAmount").value = CONFIG.loan.default;

    document.getElementById("years").min = CONFIG.years.min;
    document.getElementById("years").max = CONFIG.years.max;
    document.getElementById("years").step = CONFIG.years.step;
    document.getElementById("years").value = CONFIG.years.default;

    document.getElementById("interestRate").min = CONFIG.interestRate.min;
    document.getElementById("interestRate").max = CONFIG.interestRate.max;
    document.getElementById("interestRate").step = CONFIG.interestRate.step;
    document.getElementById("interestRate").value = CONFIG.interestRate.default;

    // Init hodnot a formátování
    propertyValueText.value = formatNumberWithSpaces(propertyValue.value);
    loanAmountText.value = formatNumberWithSpaces(loanAmount.value);
    yearsText.value = years.value;
    interestRateText.value = interestRate.value;

    updateUI();
}

// Pomocné funkce pro formátování
function formatNumberWithSpaces(num) {
    return Number(num).toLocaleString("cs-CZ").replace(/,/g, ' ');
}

function parseFormattedNumber(str) {
    return str.replace(/\s/g, '').replace(/,/g, '');
}

// Form elements
const propertyValue = document.getElementById("propertyValue");
const propertyValueText = document.getElementById("propertyValueText");
const loanAmount = document.getElementById("loanAmount");
const loanAmountText = document.getElementById("loanAmountText");
const years = document.getElementById("years");
const yearsText = document.getElementById("yearsText");
const interestRate = document.getElementById("interestRate");
const interestRateText = document.getElementById("interestRateText");

const monthlyPayment = document.getElementById("monthlyPayment");
const totalPayment = document.getElementById("totalPayment");

// Synchronizace range a text inputů
propertyValue.addEventListener("input", () => {
    propertyValueText.value = formatNumberWithSpaces(propertyValue.value);
    updateUI();
});

propertyValueText.addEventListener("focus", () => {
    propertyValueText.value = propertyValue.value;
});
propertyValueText.addEventListener("blur", () => {
    propertyValueText.value = formatNumberWithSpaces(propertyValue.value);
});
propertyValueText.addEventListener("input", () => {
    const parsed = parseFormattedNumber(propertyValueText.value);
    if (parsed && !isNaN(parsed)) {
        propertyValue.value = parsed;
        updateUI();
    }
});

loanAmount.addEventListener("input", () => {
    loanAmountText.value = formatNumberWithSpaces(loanAmount.value);
    updateUI();
});

loanAmountText.addEventListener("focus", () => {
    loanAmountText.value = loanAmount.value;
});
loanAmountText.addEventListener("blur", () => {
    loanAmountText.value = formatNumberWithSpaces(loanAmount.value);
});
loanAmountText.addEventListener("input", () => {
    const parsed = parseFormattedNumber(loanAmountText.value);
    if (parsed && !isNaN(parsed)) {
        loanAmount.value = parsed;
        updateUI();
    }
});

years.addEventListener("input", () => {
    yearsText.value = years.value;
    updateUI();
});
yearsText.addEventListener("input", () => {
    years.value = yearsText.value;
    updateUI();
});

interestRate.addEventListener("input", () => {
    interestRateText.value = interestRate.value;
    updateUI();
});
interestRateText.addEventListener("input", () => {
    interestRate.value = interestRateText.value;
    updateUI();
});

function updateUI() {
    // Synchronizace text inputů s aktuálními hodnotami
    if (document.activeElement !== propertyValueText) {
        propertyValueText.value = formatNumberWithSpaces(propertyValue.value);
    }
    if (document.activeElement !== loanAmountText) {
        loanAmountText.value = formatNumberWithSpaces(loanAmount.value);
    }
    yearsText.value = years.value;
    interestRateText.value = interestRate.value;

    // Min/max texty
    document.getElementById("propertyValueMin").textContent = format(propertyValue.min) + " Kč";
    document.getElementById("propertyValueMax").textContent = format(propertyValue.max) + " Kč";

    document.getElementById("loanMin").textContent = format(loanAmount.min) + " Kč";
    document.getElementById("loanMax").textContent = format(loanAmount.max) + " Kč";

    calculatePayment();
}

function calculatePayment() {
    const P = Number(loanAmount.value);
    const yearsVal = Number(years.value);
    const r = Number(interestRate.value) / 100 / 12; // měsíční úrok
    const n = yearsVal * 12; // počet splátek

    if (r <= 0) return;

    // Hypoteční vzorec
    const monthly = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = monthly * n;

    monthlyPayment.textContent = format(Math.round(monthly)) + " Kč";
    totalPayment.textContent = format(Math.round(total)) + " Kč";
}

function format(num) {
    return Number(num).toLocaleString("cs-CZ");
}
