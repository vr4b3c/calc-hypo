 
// calculator.js
// Vrabče, tady máš čistý kód pro obsluhu kalkulačky

// Načtení konfigu
importConfig();

function importConfig() {
    if (typeof CONFIG === "undefined") {
        console.error("CONFIG není načten — zkontroluj config.js");
        return;
    }

    // Naplnění dropdownu sazeb
    const rateSelect = document.getElementById("interestRate");
    CONFIG.interestRates.forEach(r => {
        const opt = document.createElement("option");
        opt.value = r.rate;
        opt.textContent = `${r.years} let – ${r.rate}%`;
        rateSelect.appendChild(opt);
    });

    // Nastavení rozsahů z configu
    document.getElementById("propertyValue").min = CONFIG.property.min;
    document.getElementById("propertyValue").max = CONFIG.property.max;
    document.getElementById("propertyValue").step = CONFIG.property.step;

    document.getElementById("loanAmount").min = CONFIG.loan.min;
    document.getElementById("loanAmount").max = CONFIG.loan.max;
    document.getElementById("loanAmount").step = CONFIG.loan.step;

    // Init hodnot
    updateUI();
}

// Form elements
const propertyValue = document.getElementById("propertyValue");
const loanAmount = document.getElementById("loanAmount");
const years = document.getElementById("years");
const interestRate = document.getElementById("interestRate");

const monthlyPayment = document.getElementById("monthlyPayment");
const totalPayment = document.getElementById("totalPayment");

// Event listenery
[propertyValue, loanAmount, years, interestRate].forEach(el => {
    el.addEventListener("input", updateUI);
});

function updateUI() {
    document.getElementById("propertyValueDisplay").textContent = format(propertyValue.value) + " Kč";
    document.getElementById("loanDisplay").textContent = format(loanAmount.value) + " Kč";
    document.getElementById("yearsDisplay").textContent = years.value + " let";

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
