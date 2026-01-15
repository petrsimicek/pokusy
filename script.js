// Simple calculator logic
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const decimalButton = document.querySelector('[data-decimal]');
const plusMinusButton = document.querySelector('[data-plusminus]');

const previousOperandText = document.querySelector('[data-previous-operand]');
const currentOperandText = document.querySelector('[data-current-operand]');

let currentOperand = '';
let previousOperand = '';
let operation = undefined;

function clearAll() {
  currentOperand = '';
  previousOperand = '';
  operation = undefined;
  updateDisplay();
}

function deleteDigit() {
  if (currentOperand === 'Error') { currentOperand = ''; updateDisplay(); return; }
  currentOperand = currentOperand.toString().slice(0, -1);
  updateDisplay();
}

function appendNumber(number) {
  if (number === '.' && currentOperand.includes('.')) return;
  // avoid multiple leading zeros
  if (number === '0' && currentOperand === '0') return;
  if (number !== '.' && currentOperand === '0') currentOperand = number;
  else currentOperand = currentOperand.toString() + number.toString();
  updateDisplay();
}

function chooseOperation(op) {
  if (currentOperand === '' && previousOperand === '') return;
  if (currentOperand === '' && previousOperand !== '') {
    operation = op;
    updateDisplay();
    return;
  }
  if (previousOperand !== '') {
    compute();
  }
  operation = op;
  previousOperand = currentOperand;
  currentOperand = '';
  updateDisplay();
}

function plusMinus() {
  if (!currentOperand) return;
  if (currentOperand === 'Error') return;
  currentOperand = (parseFloat(currentOperand) * -1).toString();
  updateDisplay();
}

function compute() {
  let computation;
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return;
  switch (operation) {
    case '+':
      computation = prev + current;
      break;
    case '-':
      computation = prev - current;
      break;
    case '×':
      computation = prev * current;
      break;
    case '÷':
      if (current === 0) {
        computation = 'Error';
      } else {
        computation = prev / current;
      }
      break;
    default:
      return;
  }
  currentOperand = computation.toString();
  operation = undefined;
  previousOperand = '';
  updateDisplay();
}

function formatNumber(numberStr) {
  if (numberStr === 'Error') return 'Error';
  const number = parseFloat(numberStr);
  if (isNaN(number)) return '';
  const parts = number.toString().split('.');
  const integerPart = parseInt(parts[0], 10).toLocaleString();
  if (parts.length > 1) {
    return `${integerPart}.${parts[1]}`;
  } else {
    return integerPart;
  }
}

function updateDisplay() {
  currentOperandText.textContent = currentOperand === '' ? '0' : formatNumber(currentOperand);
  if (operation != null && previousOperand !== '') {
    previousOperandText.textContent = `${formatNumber(previousOperand)} ${operation}`;
  } else {
    previousOperandText.textContent = '';
  }
}

// Hook up buttons
numberButtons.forEach(button => {
  button.addEventListener('click', () => appendNumber(button.textContent));
});

operationButtons.forEach(button => {
  button.addEventListener('click', () => chooseOperation(button.textContent));
});

equalsButton.addEventListener('click', () => {
  compute();
});

allClearButton.addEventListener('click', () => {
  clearAll();
});

deleteButton.addEventListener('click', () => {
  deleteDigit();
});

decimalButton.addEventListener('click', () => appendNumber('.'));
plusMinusButton.addEventListener('click', () => plusMinus());

// keyboard support
window.addEventListener('keydown', (e) => {
  if ((e.key >= '0' && e.key <= '9')) {
    appendNumber(e.key);
  } else if (e.key === '.') {
    appendNumber('.');
  } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
    const map = {'*': '×', '/': '÷'};
    chooseOperation(map[e.key] || e.key);
  } else if (e.key === 'Enter' || e.key === '=') {
    e.preventDefault();
    compute();
  } else if (e.key === 'Backspace') {
    deleteDigit();
  } else if (e.key === 'Escape') {
    clearAll();
  }
});

// Initialize display
clearAll();