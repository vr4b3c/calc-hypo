/**
 * Multi-step Mortgage Calculator Application
 * All configuration values are loaded from config.js
 */

// Form data object to store all user inputs
const formData = {
  propertyType: "",
  propertyValue: 0,
  loanPercent: 0,
  loanAmount: 0,
  durationYears: 0,
  monthlyPayment: 0,
  name: "",
  email: "",
  phone: "",
  zip: ""
};

// Current step tracker
let currentStep = 1;
const totalSteps = 5;

/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', function() {
  initializeUI();
  initializeStep1();
  initializeStep2();
  initializeStep3();
  initializeStep4();
  initializeStep5();
  updateProgressBar();
});

/**
 * Initialize UI labels from config
 */
function initializeUI() {
  // Set all text labels from config
  document.getElementById('step1Title').textContent = CONFIG.labels.step1Title;
  document.getElementById('step1Subtitle').textContent = CONFIG.labels.step1Subtitle;
  document.getElementById('step2Subtitle').textContent = CONFIG.labels.step2Subtitle;
  document.getElementById('step3Title').textContent = CONFIG.labels.step3Title;
  document.getElementById('step3Subtitle').textContent = CONFIG.labels.step3Subtitle;
  document.getElementById('step4Title').textContent = CONFIG.labels.step4Title;
  document.getElementById('step4Subtitle').textContent = CONFIG.labels.step4Subtitle;
  document.getElementById('step5Title').textContent = CONFIG.labels.step5Title;
  document.getElementById('step5Subtitle').textContent = CONFIG.labels.step5Subtitle;

  // Set button labels
  document.getElementById('nextButton1').textContent = CONFIG.labels.nextButton;
  document.getElementById('nextButton2').textContent = CONFIG.labels.nextButton;
  document.getElementById('nextButton3').textContent = CONFIG.labels.nextButton;
  document.getElementById('nextButton4').textContent = CONFIG.labels.nextButton;
  
  document.getElementById('prevButton2').textContent = CONFIG.labels.prevButton;
  document.getElementById('prevButton3').textContent = CONFIG.labels.prevButton;
  document.getElementById('prevButton4').textContent = CONFIG.labels.prevButton;
  document.getElementById('prevButton5').textContent = CONFIG.labels.prevButton;
  
  document.getElementById('submitButton').textContent = CONFIG.labels.submitButton;
  document.getElementById('otherAmountLabel').textContent = CONFIG.labels.otherAmount;

  // Set currency symbols
  document.getElementById('currencySymbol1').textContent = CONFIG.currency;
  document.getElementById('currencySymbol2').textContent = CONFIG.currency;
  document.getElementById('currencySymbol3').textContent = CONFIG.currency;
  document.getElementById('currencySymbol4').textContent = CONFIG.currency;
  document.getElementById('currencySymbol5').textContent = CONFIG.currency;
}

/**
 * Initialize Step 1: Property Type Selection
 */
function initializeStep1() {
  const container = document.getElementById('propertyTypeContainer');
  
  // Generate property type buttons from config
  CONFIG.propertyTypes.forEach(type => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-outline-primary btn-lg';
    button.textContent = type.label;
    button.dataset.value = type.value;
    button.dataset.label = type.label;
    
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      container.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Store selection
      formData.propertyType = this.dataset.value;
      
      // Enable next button
      document.getElementById('step1Next').disabled = false;
    });
    
    container.appendChild(button);
  });
  
  // Next button
  document.getElementById('step1Next').addEventListener('click', function() {
    if (formData.propertyType) {
      // Update step 2 title with selected property type
      const selectedLabel = CONFIG.propertyTypes.find(t => t.value === formData.propertyType).label;
      document.getElementById('step2Title').textContent = 
        `${CONFIG.labels.step2Title} ${selectedLabel.toLowerCase()}?`;
      nextStep();
    }
  });
}

/**
 * Initialize Step 2: Property Value
 */
function initializeStep2() {
  const input = document.getElementById('propertyValue');
  
  // Validate and enable next button
  input.addEventListener('input', function() {
    const value = parseFloat(this.value);
    const isValid = !isNaN(value) && value > 0;
    document.getElementById('step2Next').disabled = !isValid;
    
    if (isValid) {
      formData.propertyValue = value;
    }
  });
  
  // Navigation buttons
  document.getElementById('step2Prev').addEventListener('click', prevStep);
  document.getElementById('step2Next').addEventListener('click', function() {
    if (formData.propertyValue > 0) {
      nextStep();
    }
  });
}

/**
 * Initialize Step 3: Loan Amount
 */
function initializeStep3() {
  const container = document.getElementById('loanPresetContainer');
  const customContainer = document.getElementById('customLoanContainer');
  const slider = document.getElementById('loanPercentSlider');
  
  // Set slider attributes from config
  slider.min = CONFIG.loanPercentSlider.min;
  slider.max = CONFIG.loanPercentSlider.max;
  slider.step = CONFIG.loanPercentSlider.step;
  slider.value = 50; // Default value
  
  // Generate preset buttons from config
  CONFIG.loanPercentPresets.forEach(percent => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-outline-primary btn-lg';
    button.textContent = `${percent}%`;
    button.dataset.percent = percent;
    
    button.addEventListener('click', function() {
      // Remove active class from all preset buttons
      container.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Add active class
      this.classList.add('active');
      
      // Hide custom slider
      customContainer.classList.add('d-none');
      
      // Calculate loan amount
      const percent = parseFloat(this.dataset.percent);
      formData.loanPercent = percent;
      formData.loanAmount = formData.propertyValue * (percent / 100);
      
      // Enable next button
      document.getElementById('step3Next').disabled = false;
    });
    
    container.appendChild(button);
  });
  
  // Show custom loan slider button
  document.getElementById('showCustomLoan').addEventListener('click', function() {
    // Hide active states on presets
    container.querySelectorAll('button').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Show custom slider
    customContainer.classList.remove('d-none');
    
    // Update values
    updateLoanSlider();
    
    // Enable next button
    document.getElementById('step3Next').disabled = false;
  });
  
  // Slider input
  slider.addEventListener('input', updateLoanSlider);
  
  // Navigation buttons
  document.getElementById('step3Prev').addEventListener('click', prevStep);
  document.getElementById('step3Next').addEventListener('click', function() {
    if (formData.loanAmount > 0) {
      nextStep();
    }
  });
}

/**
 * Update loan slider display
 */
function updateLoanSlider() {
  const slider = document.getElementById('loanPercentSlider');
  const percent = parseFloat(slider.value);
  
  formData.loanPercent = percent;
  formData.loanAmount = formData.propertyValue * (percent / 100);
  
  document.getElementById('loanPercentDisplay').textContent = percent;
  document.getElementById('loanAmountDisplay').textContent = formatNumber(formData.loanAmount);
}

/**
 * Initialize Step 4: Duration
 */
function initializeStep4() {
  const slider = document.getElementById('durationSlider');
  
  // Set slider attributes from config
  slider.min = CONFIG.durationSlider.min;
  slider.max = CONFIG.durationSlider.max;
  slider.step = CONFIG.durationSlider.step;
  slider.value = 15; // Default value
  
  // Initialize duration
  formData.durationYears = 15;
  updateDurationDisplay();
  
  // Slider input
  slider.addEventListener('input', function() {
    formData.durationYears = parseInt(this.value);
    updateDurationDisplay();
  });
  
  // Navigation buttons
  document.getElementById('step4Prev').addEventListener('click', prevStep);
  document.getElementById('step4Next').addEventListener('click', function() {
    calculateMonthlyPayment();
    updateStep5Summary();
    nextStep();
  });
}

/**
 * Update duration display and recalculate payment
 */
function updateDurationDisplay() {
  document.getElementById('durationDisplay').textContent = formData.durationYears;
  calculateMonthlyPayment();
  updateSummary();
}

/**
 * Update summary in step 4
 */
function updateSummary() {
  document.getElementById('summaryPropertyValue').textContent = formatNumber(formData.propertyValue);
  document.getElementById('summaryLoanAmount').textContent = formatNumber(formData.loanAmount);
  document.getElementById('summaryDuration').textContent = formData.durationYears;
  document.getElementById('monthlyPayment').textContent = formatNumber(formData.monthlyPayment);
}

/**
 * Calculate monthly payment using annuity formula
 */
function calculateMonthlyPayment() {
  const principal = formData.loanAmount;
  const annualRate = CONFIG.interestRate / 100;
  const monthlyRate = annualRate / 12;
  const numberOfPayments = formData.durationYears * 12;
  
  if (monthlyRate === 0) {
    // If interest rate is 0, simple division
    formData.monthlyPayment = principal / numberOfPayments;
  } else {
    // Annuity formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    const denominator = Math.pow(1 + monthlyRate, numberOfPayments) - 1;
    const numerator = monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments);
    formData.monthlyPayment = principal * (numerator / denominator);
  }
  
  // Round to 2 decimal places
  formData.monthlyPayment = Math.round(formData.monthlyPayment * 100) / 100;
}

/**
 * Initialize Step 5: Contact Form
 */
function initializeStep5() {
  const form = document.getElementById('contactForm');
  
  // Navigation button
  document.getElementById('step5Prev').addEventListener('click', prevStep);
  
  // Form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (this.checkValidity()) {
      // Store form data
      formData.name = document.getElementById('name').value;
      formData.email = document.getElementById('email').value;
      formData.phone = document.getElementById('phone').value;
      formData.zip = document.getElementById('zip').value;
      
      // Disable submit button
      const submitBtn = document.getElementById('submitBtn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Odesílám...';
      
      // Send data to PHP endpoint
      submitFormData();
    }
  });
}

/**
 * Update summary display in step 5 if needed
 */
function updateStep5Summary() {
  // This function can be used to show a summary in step 5 if desired
  // Currently not used but kept for extensibility
}

/**
 * Submit form data to PHP endpoint
 */
function submitFormData() {
  fetch(CONFIG.phpEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = false;
    submitBtn.innerHTML = CONFIG.labels.submitButton;
    
    if (data.success) {
      // Show success message
      document.getElementById('successMessage').classList.remove('d-none');
      document.getElementById('errorMessage').classList.add('d-none');
      document.getElementById('contactForm').classList.add('d-none');
      submitBtn.classList.add('d-none');
      document.getElementById('step5Prev').classList.add('d-none');
    } else {
      // Show error message
      document.getElementById('errorMessage').classList.remove('d-none');
      document.getElementById('successMessage').classList.add('d-none');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = false;
    submitBtn.innerHTML = CONFIG.labels.submitButton;
    
    // Show error message
    document.getElementById('errorMessage').classList.remove('d-none');
    document.getElementById('successMessage').classList.add('d-none');
  });
}

/**
 * Navigate to next step
 */
function nextStep() {
  if (currentStep < totalSteps) {
    // Hide current step
    document.getElementById(`step${currentStep}`).classList.add('d-none');
    
    // Show next step
    currentStep++;
    document.getElementById(`step${currentStep}`).classList.remove('d-none');
    
    // Update summary if moving to step 4
    if (currentStep === 4) {
      calculateMonthlyPayment();
      updateSummary();
    }
    
    // Update progress bar
    updateProgressBar();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/**
 * Navigate to previous step
 */
function prevStep() {
  if (currentStep > 1) {
    // Hide current step
    document.getElementById(`step${currentStep}`).classList.add('d-none');
    
    // Show previous step
    currentStep--;
    document.getElementById(`step${currentStep}`).classList.remove('d-none');
    
    // Update progress bar
    updateProgressBar();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/**
 * Update progress bar
 */
function updateProgressBar() {
  const progress = (currentStep / totalSteps) * 100;
  document.getElementById('progressBar').style.width = `${progress}%`;
  document.getElementById('currentStepNumber').textContent = currentStep;
}

/**
 * Format number with thousand separators
 */
function formatNumber(num) {
  return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
