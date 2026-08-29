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

  "btn-18": { type: "command", value: "."},

  "btn-19": { type: "command", value: "=" },

};

// Переменные 

const handlers = {
  digit: (config) => {
    createNumber(config.value);
  },
  
  operator: (config) => {
    handlers[config.value]?.();
  },

  command: (config) => {
    handlers[config.value]?.();
  },

  "+": add,
  "−": subtract,
  "×": multiply,
  "÷": divide,
  "=": calculate,
  "C": clear,
  "⌫": removeLastSymbol,
};

const state = {
  current: 0,
  previous: null,
  operator: null,
};

let isResult = false;

const MAX_DISPLAY_CHARS = 12;

const display = document.querySelector(".calculator__display");
const buttons = document.querySelector(".calculator__buttons");

// Функции

function render() {
  display.textContent = getDisplayText();
}
render();

function getDisplayText() {
  if (state.operator === null) {
    return formatNumber(state.current);
  }

  const spacesCount = state.current === null ? 1 : 2;
  const numbersShown = spacesCount;
  const numberMaxLength = Math.floor((MAX_DISPLAY_CHARS - state.operator.length - spacesCount) / numbersShown);

  const previousText = formatNumber(state.previous, numberMaxLength);

  if (state.current === null) {
    return `${previousText} ${state.operator}`;
  }

  const currentText = formatNumber(state.current, numberMaxLength);
  return `${previousText} ${state.operator} ${currentText}`;
}

function createNumber(digit) {
  if (isResult || !Number.isFinite(state.current)) {
    state.current = digit;
    isResult = false;
    return;
  }

  state.current = state.current === null ? digit : state.current * 10 + digit;
};

function add() {
  if (state.previous !== null && state.operator === null && state.current !== null) {
    state.current = state.previous + state.current;
    state.previous = null;
    return;
  }

  if (state.previous !== null && state.operator !== null && state.current !== null) {
    calculate();
    state.previous = state.current;
    state.current = null;
  } else if (state.current !== null) {
    state.previous = state.current;
    state.current = null;
  }

  isResult = false;
  state.operator = "+";
}

function subtract() {
  if (state.previous !== null && state.operator === null && state.current !== null) {
    state.current = state.previous - state.current;
    state.previous = null;
    return;
  }

  if (state.previous !== null && state.operator !== null && state.current !== null) {
    calculate();
    state.previous = state.current;
    state.current = null;
  } else if (state.current !== null) {
    state.previous = state.current;
    state.current = null;
  }

  isResult = false;
  state.operator = "−";
}

function multiply() {
  if (state.previous !== null && state.operator === null && state.current !== null) {
    state.current = state.previous * state.current;
    state.previous = null;
    return;
  }

  if (state.previous !== null && state.operator !== null && state.current !== null) {
    calculate();
    state.previous = state.current;
    state.current = null;
  } else if (state.current !== null) {
    state.previous = state.current;
    state.current = null;
  }

  isResult = false;
  state.operator = "×";
}

function divide() {
  if (state.previous !== null && state.operator === null && state.current !== null) {
    state.current = state.previous / state.current;
    state.previous = null;
    return;
  }

  if (state.previous !== null && state.operator !== null && state.current !== null) {
    calculate();
    state.previous = state.current;
    state.current = null;
  } else if (state.current !== null) {
    state.previous = state.current;
    state.current = null;
  }

  isResult = false;
  state.operator = "÷";
}

function calculate() {
  if (state.previous === null || state.operator === null || state.current === null) {
    return;
  }

  const operator = state.operator;
  const operation = handlers[operator];

  if (typeof operation !== "function") {
    return;
  }

  state.operator = null;
  operation();
  isResult = true;
}

function clear() {
  state.current = 0;
  state.previous = null;
  state.operator = null;
  isResult = false;
}

function removeLastSymbol() {
  if (state.current !== null && !Number.isFinite(state.current)) {
    clear();
    return;
  }

  isResult = false;

  if (state.current === null) {
    state.current = state.previous;
    state.previous = null;
    state.operator = null;
    return;
  }

  if (state.previous !== null && Math.abs(state.current) < 10) {
    state.current = null;
    return;
  }

  state.current = Math.trunc(state.current / 10);
}

function formatNumber(num, maxLength = MAX_DISPLAY_CHARS) {
  if (!Number.isFinite(num)) {
  return "Error";
  }

  const digits = num === 0
  ? 1
  : Math.floor(Math.log10(Math.abs(num))) + 1;

  if (digits <= maxLength) {
    if (String(num).length <= maxLength) {
      return num;
    }

    let decimalPlaces = Math.max(0, maxLength - digits - (num < 0 ? 2 : 1));
    let formattedNumber = num.toFixed(decimalPlaces);

    while (formattedNumber.length > maxLength && decimalPlaces > 0) {
      formattedNumber = num.toFixed(--decimalPlaces);
    }

    return formattedNumber;
  }

  const exponent = digits - 1;
  const exponentDigits = Math.floor(Math.log10(exponent)) + 1;

  const decimalPlaces = maxLength - exponentDigits - 3;

  return num.toExponential(Math.max(0, decimalPlaces));
}

// Обработчик событий 

buttons.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const dataId = button.dataset.id;
  const config = buttonsConfig[dataId];
  if (!config) return;

  if (state.current !== null && !Number.isFinite(state.current) && config.type !== "digit" && config.value !== "⌫") {
    return;
  }

  handlers[config.type]?.(config);
  render();
});
