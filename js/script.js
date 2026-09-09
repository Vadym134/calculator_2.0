const buttonsConfig = {

  "btn-17": { type: "digit", value: 0 },

  "btn-13": { type: "digit", value: 1 },

  "btn-14": { type: "digit", value: 2 },

  "btn-15": { type: "digit", value: 3 },

  "btn-9": { type: "digit", value: 4 },

  "btn-10": { type: "digit", value: 5 },

  "btn-11": { type: "digit", value: 6 },

  "btn-5": { type: "digit", value: 7 },

  "btn-6": { type: "digit", value: 8 },

  "btn-7": { type: "digit", value: 9 },

  "btn-16": { type: "operator", value: "+" },

  "btn-12": { type: "operator", value: "−" },

  "btn-8": { type: "operator", value: "×" },

  "btn-4": { type: "operator", value: "÷" },

  "btn-3": { type: "operator", value: "%" },

  "btn-2": { type: "command", value: "⌫" },

  "btn-1": { type: "command", value: "C" },

  "btn-18": { type: "command", value: "." },

  "btn-19": { type: "command", value: "=" },
};

// Переменные

const handleCommand = {
  "C": () => { clear(); },
  "⌫": () => { },
  ".": () => { },
  "=": () => { },
};


const handlers = {
  digit: (config) => {
    handleDigit(config.value);
  },

  operator: (config) => {
    handleOperator(config.value);
  },

  command: (config) => {
    handleCommand[config.value]?.();
  },
};

const state = {
  current: 0,
  previous: null,
  operator: null,
  expression: null,
  isNewOperand: true, 
};

const MAX_DISPLAY_CHARS = 12;
const OPERATOR_PERT_LENGTH = 3;

const display = document.querySelector(".calculator__display");
const buttons = document.querySelector(".calculator__buttons");

// Функции

function clear() {
  state.current = 0;
  state.previous = null;
  state.operator = null;
  state.expression = null;
  state.isNewOperand = true;

  render();
}

function handleOperator(operator) {
  if (state.operator && state.isNewOperand) {
    state.operator = operator;
  } else {
    state.previous = state.current;
    state.operator = operator;
    state.current = 0;
    state.isNewOperand = true;
  }

  state.expression = buildExpression();

  render();
}

function handleDigit(digit) {
  state.isNewOperand = false;
  state.current = createNumber(state.current, digit);

  if (state.operator) {
    state.expression = buildExpression();
  }
  
  render();
};

function buildExpression() {
  if (!state.operator) return null;

  const remaining = MAX_DISPLAY_CHARS - OPERATOR_PERT_LENGTH;
  const previousBudget = Math.floor(remaining / 2);
  const currentBudget = remaining - previousBudget;

  const previousStr = formatNumber(state.previous, previousBudget);
  
  if (state.isNewOperand) {
    return `${previousStr} ${state.operator}`;
  }

  const currentStr = formatNumber(state.current, currentBudget);    

  return `${previousStr} ${state.operator} ${currentStr}`;
}

function createNumber(current, digit) {
  return current * 10 + digit;
};

function formatNumber(num, maxLength = MAX_DISPLAY_CHARS) {
  if (!Number.isFinite(num)) {
    return "Error";
  }

  const isNegative = num < 0;
  const signLength = isNegative ? 1 : 0;
  const absNum = Math.abs(num);

  // Проблема 3: защита от погрешности плавающей точки в log10
  const EPSILON = 1e-10;

  // Проблема 2: считаем целую и дробную длину раздельно
  const integerDigits = absNum === 0
    ? 1
    : absNum >= 1
      ? Math.floor(Math.log10(absNum) + EPSILON) + 1
      : 1; // для чисел < 1 целая часть — это просто "0"

  const totalIntegerLength = integerDigits + signLength;

  // Число целиком влезает — форматируем как обычную десятичную дробь
  if (totalIntegerLength < maxLength) {
    const isInteger = Number.isInteger(num);
    if (isInteger) return num.toFixed(0);

    const availableDecimals = Math.max(0, maxLength - totalIntegerLength - 1); // -1 под точку
    return num.toFixed(availableDecimals);
  }

  // Не влезает даже целая часть — переходим на экспоненциальную форму
  const exponent = absNum >= 1
    ? integerDigits - 1
    : -Math.floor(Math.log10(absNum) + EPSILON); // Проблема 2: степень для дробей < 1

  const exponentDigits = Math.floor(Math.log10(Math.max(1, Math.abs(exponent))) + EPSILON) + 1;

  // "e", возможный "-" у степени, "+" не считаем (JS сам не пишет "+" в некоторых случаях, но toExponential пишет)
  const exponentSignLength = 1; // под "+" или "-" перед степенью
  const overhead = 2 + exponentSignLength + exponentDigits + signLength; // 2 = "e" + точка мантиссы

  // Проблема 4: не даём decimalPlaces уйти в минус
  const decimalPlaces = Math.max(0, maxLength - overhead);

  return num.toExponential(decimalPlaces);
}

function render() {
  if (!display) return;

  if (state.expression) {
    display.textContent = state.expression;
  } else {
    display.textContent = formatNumber(state.current);
  }
};

render();

// Обработчик событий 

buttons.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const dataId = button.dataset.id;
  const config = buttonsConfig[dataId];
  if (!config) return;

  handlers?.[config.type]?.(config);
  console.log(state);
});


/* 
function formatNumber(num, maxLength = MAX_DISPLAY_CHARS) {
if (!Number.isFinite(num)) {
return "Error";
};

const digits = num === 0
? 1
: Math.floor(Math.log10(Math.abs(num))) + 1;

if (digits <= maxLength) {
return num;
}

const exponent = digits - 1;
const exponentDigits = Math.floor(Math.log10(exponent)) + 1;

const decimalPlaces = maxLength - exponentDigits - 3;

return num.toExponential(Math.max(0, decimalPlaces));
};
*/