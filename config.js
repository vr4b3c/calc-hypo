 
// config.js
// Tohle si může klient měnit dle libosti — nic není napevno

const CONFIG = {
    property: {
        min: 500000,
        max: 50000000,
        step: 100000,
        default: 5000000
    },

    loan: {
        min: 300000,
        max: 30000000,
        step: 100000,
        default: 4000000
    },

    years: {
        min: 5,
        max: 30,
        step: 1,
        default: 20
    },

    interestRate: {
        default: 5.0,
        min: 0,
        max: 20,
        step: 0.01
    }
};
