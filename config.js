/**
 * Configuration file for the mortgage calculator
 * All constants and configuration values are defined here
 */
const CONFIG = {
  // Property types available in Step 1
  propertyTypes: [
    { value: "byt", label: "Byt" },
    { value: "pozemek", label: "Pozemek" },
    { value: "rodinny-dum", label: "Rodinný dům" },
    { value: "chata-chalupa", label: "Chata/chalupa" },
    { value: "bytovy-dum", label: "Bytový dům" }
  ],

  // Predefined loan percentage presets for Step 3
  loanPercentPresets: [90, 80, 60, 50],

  // Loan percentage slider configuration for Step 3
  loanPercentSlider: {
    min: 5,
    max: 100,
    step: 5
  },

  // Duration slider configuration for Step 4
  durationSlider: {
    min: 1,
    max: 30,
    step: 1
  },

  // Annual interest rate for mortgage calculation (in percentage)
  interestRate: 4.5,

  // Currency symbol
  currency: "Kč",

  // PHP endpoint for form submission
  phpEndpoint: "send.php",

  // Email recipient for form submissions
  emailRecipient: "info@example.com",

  // Text labels for UI
  labels: {
    step1Title: "Výběr typu nemovitosti",
    step1Subtitle: "Vyberte typ nemovitosti, kterou chcete financovat",
    step2Title: "Jaká je kupní (odhadní) cena",
    step2Subtitle: "Zadejte hodnotu nemovitosti",
    step3Title: "Kolik si chcete půjčit?",
    step3Subtitle: "Vyberte procento z hodnoty nemovitosti nebo zadejte vlastní hodnotu",
    step4Title: "Délka splácení",
    step4Subtitle: "Vyberte dobu splácení hypotéky",
    step5Title: "Kontaktní údaje",
    step5Subtitle: "Vyplňte kontaktní formulář a my vás budeme kontaktovat",
    nextButton: "Další krok",
    prevButton: "Zpět",
    submitButton: "Odeslat poptávku",
    otherAmount: "Jiná výše"
  }
};
