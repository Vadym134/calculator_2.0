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
  "C": () => { },
  "⌫": () => { },
  ".": () => { },
  "=": () => { },
};

const handleOperator = {
  "+": () => { add(); },
  "−": () => {},
  "×": () => { },
  "÷": () => { },
  "%": () => { },
};

const handlers = {
  digit: (config) => {
    createNumber(config.value);
  },

  operator: (config) => {
    handleOperator[config.value]?.();
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
};

const MAX_DISPLAY_CHARS = 12;

const display = document.querySelector(".calculator__display");
const buttons = document.querySelector(".calculator__buttons");

// Функции

function add() {
  if (state.previous !== null && state.operator !== null) {
    return;
  }
  state.previous = state.current;
  state.operator = "+";
  state.current = 0;
  state.expression = `${state.previous} ${state.operator}`;
  
  render();
};

function createNumber(digit) {
  state.current = state.current * 10 + digit;

  if (state.previous !== null && state.operator !== null) {
    state.expression = `${state.previous} ${state.operator} ${state.current}`;
  }

  render();
};

function formatNumber(num, maxLength = MAX_DISPLAY_CHARS) {
if (!Number.isFinite(num)) {
return "Error";
}

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
});