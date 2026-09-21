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

  "btn-2": { type: "command", value: "back" },

  "btn-1": { type: "command", value: "clear" },

  "btn-18": { type: "command", value: "decimal" },

  "btn-19": { type: "command", value: "=" },
};

// Переменные

const handleCommand = {
  "clear": () => { clear(); },
  "back": () => { },
  "decimal": () => { decimal(); },
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
  decimalPlaces: null,
};

const MAX_DISPLAY_CHARS = 14;

const display = document.querySelector(".calculator__display");
const buttons = document.querySelector(".calculator__buttons");

// ФУНКЦИИ

// функции handleCommand

function decimal() {
  if (state.decimalPlaces === null) {
    state.decimalPlaces = 1;
  }

  render();
}

function clear() {
  state.current = 0;
  state.previous = null;
  state.operator = null;
  state.expression = null;
  state.decimalPlaces = null;

  render();
}

// Функция добавления операторов

function handleOperator(operator) {
  if (state.current === 0 && state.expression) return;

  state.previous = state.current;
  state.operator = operator;
  state.current = 0;
  state.decimalPlaces = null;

  state.expression = `${formatNumber(state.previous, MAX_DISPLAY_CHARS - 2)} ${state.operator}`;

  render();
}

// Функции добавления цифр

function handleDigit(digit) {
  state.current = createNumber(state.current, digit, state.decimalPlaces);

  if (state.decimalPlaces !== null) {
    state.decimalPlaces++;
  };
  
  render();
};

function createNumber(current, digit, decimalPlaces) {
  if (decimalPlaces !== null) {
    return current + digit / (10 ** decimalPlaces);
  }

  return current * 10 + digit;
};

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

function render() {
  if (!display) return;

  if (state.expression) {
    display.textContent = state.expression;
  } else {
   const formattedValue = formatNumber(state.current);

    display.textContent = state.decimalPlaces === 1 
      ? `${formattedValue}.` 
      : formattedValue;
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