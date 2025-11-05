// Calculator JavaScript
class Calculator {
  constructor() {
    this.form = document.getElementById('calc-form');
    this.opSelect = document.getElementById('op');
    this.inputA = document.getElementById('a');
    this.inputB = document.getElementById('b');
    this.secondInput = document.getElementById('second-input');
    this.resultSection = document.getElementById('result');
    this.calculationDisplay = document.getElementById('calculation-display');
    this.resultValue = document.getElementById('result-value');
    this.clearBtn = document.getElementById('clear-result');
    this.clearFormBtn = document.getElementById('clear-form');
    
    this.init();
  }
  
  init() {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.opSelect.addEventListener('change', this.handleOperationChange.bind(this));
    this.clearBtn.addEventListener('click', this.clearResult.bind(this));
  if (this.clearFormBtn) this.clearFormBtn.addEventListener('click', this.clearForm.bind(this));
    
    this.handleOperationChange();
    
    this.inputA.addEventListener('input', this.validateInput.bind(this));
    this.inputB.addEventListener('input', this.validateInput.bind(this));
  }
  
  handleOperationChange() {
    const operation = this.opSelect.value;
    const singleInputOps = ['sqrt', 'fact', 'ln'];
    
    if (singleInputOps.includes(operation)) {
      this.secondInput.classList.add('hidden');
      this.inputB.value = 5;
      this.inputB.removeAttribute('required');
      this.updateInputLabels(operation);
    } else {
      this.secondInput.classList.remove('hidden');
      this.inputB.setAttribute('required', 'required');
      this.updateInputLabels(operation);
    }
    
    // Clear any stale validation messages when operation changes
    try {
      this.inputA.setCustomValidity('');
      this.inputB.setCustomValidity('');
    } catch (e) {
      // ignore if elements not present
    }

    this.clearResult();
  }
  
  updateInputLabels(operation) {
    const labels = {
      'pow': { a: 'Base', b: 'Exponent' },
      'sqrt': { a: 'Number' },
      'fact': { a: 'Number (Integer)' },
      'ln': { a: 'Number (Positive)' }
    };
    
    const currentLabels = labels[operation] || { a: 'First Number', b: 'Second Number' };
    
    this.inputA.parentElement.querySelector('label').textContent = currentLabels.a;
    if (currentLabels.b) {
      this.inputB.parentElement.querySelector('label').textContent = currentLabels.b;
    }
    
    this.updatePlaceholders(operation);
  }
  
  updatePlaceholders(operation) {
    const placeholders = {
      'pow': { a: 'e.g., 2', b: 'e.g., 3' },
      'sqrt': { a: 'e.g., 16' },
      'fact': { a: 'e.g., 5' },
      'ln': { a: 'e.g., 2.71828' }
    };
    
    const currentPlaceholders = placeholders[operation] || { a: 'Enter number', b: 'Enter number' };
    
    this.inputA.placeholder = currentPlaceholders.a;
    if (currentPlaceholders.b) {
      this.inputB.placeholder = currentPlaceholders.b;
    }
  }
  
  validateInput(event) {
    const input = event.target;
    const operation = this.opSelect.value;
    
    // Special validation for factorial (must be non-negative integer)
    if (operation === 'fact' && input === this.inputA) {
      const value = parseFloat(input.value);
      if (value < 0 || !Number.isInteger(value)) {
        input.setCustomValidity('Factorial requires a non-negative integer');
      } else {
        input.setCustomValidity('');
      }
    }
    
    // Special validation for ln (must be positive)
    if (operation === 'ln' && input === this.inputA) {
      const value = parseFloat(input.value);
      if (value <= 0) {
        input.setCustomValidity('Natural logarithm requires a positive number');
      } else {
        input.setCustomValidity('');
      }
    }
    
    // Special validation for sqrt (must be non-negative)
    if (operation === 'sqrt' && input === this.inputA) {
      const value = parseFloat(input.value);
      if (value < 0) {
        input.setCustomValidity('Square root requires a non-negative number');
      } else {
        input.setCustomValidity('');
      }
    }
    
    // General validation can be kept for power operations
    if (operation === 'pow' && input === this.inputB) {
      // No specific validation needed here, will be handled in isValidInput
    }
  }
  
  async handleSubmit(event) {
    event.preventDefault();
    
    const operation = this.opSelect.value;
    const a = parseFloat(this.inputA.value);
    const b = this.inputB.value ? parseFloat(this.inputB.value) : null;
    
    // Client-side validation
    // clear any stale validity messages (defensive)
    this.inputA.setCustomValidity('');
    this.inputB.setCustomValidity('');

    if (!this.isValidInput(operation, a, b)) {
      return;
    }
    
    this.showLoading(true);
    this.resultSection.classList.remove('error');
    
    try {
      const data = { op: operation, a: a };
      if (b !== null) {
        data.b = b;
      }
      
      const response = await fetch('/calc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        this.showError(result.error || 'Calculation failed');
        return;
      }
      
      this.showResult(operation, a, b, result.result);
      
    } catch (error) {
      console.error('Calculation error:', error);
      this.showError('Network error. Please try again.');
    } finally {
      this.showLoading(false);
    }
  }

  // Clear the whole form (inputs + result + validation)
  clearForm() {
    // Reset HTML form fields
    try {
      this.form.reset();
    } catch (e) {
      // ignore
    }

    // Clear validation messages
    try {
      this.inputA.setCustomValidity('');
      this.inputB.setCustomValidity('');
    } catch (e) {}

    // Hide result and reset UI to the current operation state
    this.clearResult();
    this.handleOperationChange();
  }
  
  isValidInput(operation, a, b) {
    // clear previous custom validity messages
    try {
      this.inputA.setCustomValidity('');
      this.inputB.setCustomValidity('');
    } catch (e) {}

    // Check for NaN
    if (isNaN(a)) {
      try { this.inputA.setCustomValidity('Please enter a valid number'); this.inputA.reportValidity(); } catch (e) {}
      this.clearResult();
      return false;
    }

    if (b !== null && isNaN(b)) {
      try { this.inputB.setCustomValidity('Please enter a valid second number'); this.inputB.reportValidity(); } catch (e) {}
      this.clearResult();
      return false;
    }

    // Specific validations for our 4 operations - use native validation bubbles
    switch (operation) {
      case 'fact':
        if (a < 0 || !Number.isInteger(a)) {
          try { this.inputA.setCustomValidity('Factorial requires a non-negative integer'); this.inputA.reportValidity(); } catch (e) {}
          this.clearResult();
          return false;
        }
        if (a > 170) {
          try { this.inputA.setCustomValidity('Factorial result would be too large (max: 170!)'); this.inputA.reportValidity(); } catch (e) {}
          this.clearResult();
          return false;
        }
        break;

      case 'sqrt':
        if (a < 0) {
          try { this.inputA.setCustomValidity('Square root requires a non-negative number'); this.inputA.reportValidity(); } catch (e) {}
          this.clearResult();
          return false;
        }
        break;

      case 'ln':
        if (a <= 0) {
          try { this.inputA.setCustomValidity('Natural logarithm requires a positive number'); this.inputA.reportValidity(); } catch (e) {}
          this.clearResult();
          return false;
        }
        break;

      case 'pow':
        if (a === 0 && b < 0) {
          try { this.inputB.setCustomValidity('Cannot raise zero to a negative power'); this.inputB.reportValidity(); } catch (e) {}
          this.clearResult();
          return false;
        }
        if (a < 0 && !Number.isInteger(b)) {
          try { this.inputB.setCustomValidity('Cannot raise negative number to non-integer power'); this.inputB.reportValidity(); } catch (e) {}
          this.clearResult();
          return false;
        }
        break;
    }

    return true;
  }
  
  showResult(operation, a, b, result) {
    const calculation = this.formatCalculation(operation, a, b);
    const formattedResult = this.formatResult(result);
    
    this.calculationDisplay.textContent = calculation;
    this.resultValue.textContent = formattedResult;
    
    this.resultSection.classList.remove('hidden', 'error');
  }
  
  showError(message) {
    this.calculationDisplay.textContent = 'Error';
    this.resultValue.textContent = message;
    this.resultSection.classList.remove('hidden');
    this.resultSection.classList.add('error');
  }
  
  formatCalculation(operation, a, b) {
    const symbols = {
      'pow': '^',
      'sqrt': '√',
      'fact': '!',
      'ln': 'ln'
    };
    
    switch (operation) {
      case 'sqrt':
        return `√${this.formatNumber(a)}`;
      case 'fact':
        return `${this.formatNumber(a)}!`;
      case 'ln':
        return `ln(${this.formatNumber(a)})`;
      case 'pow':
        return `${this.formatNumber(a)} ^ ${this.formatNumber(b)}`;
      default:
        return `${this.formatNumber(a)} ${symbols[operation]} ${this.formatNumber(b)}`;
    }
  }
  
  formatNumber(num) {
    // Format numbers for display
    if (Number.isInteger(num)) {
      return num.toString();
    } else {
      // Limit decimal places for display
      return parseFloat(num.toFixed(10)).toString();
    }
  }
  
  formatResult(result) {
    if (typeof result !== 'number' || isNaN(result)) {
      return 'Invalid result';
    }
    
    if (!isFinite(result)) {
      return result > 0 ? '∞' : '-∞';
    }
    
    // Format very large or very small numbers
    if (Math.abs(result) > 1e15 || (Math.abs(result) < 1e-6 && result !== 0)) {
      return result.toExponential(6);
    }
    
    // Format regular numbers
    if (Number.isInteger(result)) {
      return result.toLocaleString();
    } else {
      // Limit decimal places and remove trailing zeros
      return parseFloat(result.toFixed(10)).toLocaleString();
    }
  }
  
  showLoading(isLoading) {
    if (isLoading) {
      this.form.classList.add('loading');
      this.form.querySelector('button[type="submit"]').disabled = true;
      this.calculationDisplay.textContent = 'Calculating...';
      this.resultValue.textContent = '';
      this.resultSection.classList.remove('hidden', 'error');
    } else {
      this.form.classList.remove('loading');
      this.form.querySelector('button[type="submit"]').disabled = false;
    }
  }
  
  clearResult() {
    this.resultSection.classList.add('hidden');
    this.resultSection.classList.remove('error');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Calculator();
});