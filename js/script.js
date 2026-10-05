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

  "btn-12": { type: "operator", value: "-" },

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

const MAX_DISPLAY_CHARS = 12;

const display = document.querySelector(".calculator__display");
const buttons = document.querySelector(".calculator__buttons");

// ФУНКЦИИ

// функции handleCommand

function handleEquals() {
  calculate();

  render();
}

function decimal() {
  if (state.decimalPlaces === null) {
    state.decimalPlaces = 1;
  };
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

// Функция вычисления результата

function calculate() {
  if (state.previous === null || 
      state.operator === null || 
      !Number.isFinite(state.current)) return;

  switch (state.operator) {
    case "+":
      state.current = state.previous + state.current;
      break;
    case "-":
      state.current = state.previous - state.current;
      break;
    case "×":
      state.current = state.previous * state.current;
      break;
    case "÷":
      state.current = state.previous / state.current;
      break;
  };

  state.previous = null;
  state.operator = null;
  state.expression = null;
  state.decimalPlaces = null;

  return state.current;
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
  
  if (state.expression && state.previous === 0 && state.operator === "-") {
    calculate();
  }

  render();
};

function createNumber(current, digit, decimalPlaces) {
  if (decimalPlaces !== null) {
   const result = current + digit / (10 ** decimalPlaces);
   return Number(result.toFixed(decimalPlaces));
  }

  if (current < 0) {
  return current * 10 - digit;
  }

  return current * 10 + digit;
};

function formatNumber(num, maxLength = MAX_DISPLAY_CHARS) {
  if (!Number.isFinite(num)) return "Error";
  if (num === 0) return "0"; // Чтобы не прогонять через фунцию 0, которая может вернуть "0.0000000000" при maxLength = 12

  const sign = num < 0 ? "-" : ""; // Определяем знак числа, чтобы добавить его в результат
  const absNum = Math.abs(num); // Отбрасываем знак числа, чтобы работать с положительным значением

  // countIntegerDigits Считает, сколько цифр у числа в целой части (до запятой/точки). Math.trunc(n) отбрасывает дробную часть 
  const countIntegerDigits = (n) => n < 1 ? 1 : Math.trunc(n).toString().length;
  

  // убирает лишние нули в научном формате
  const trimExponential = (str) => { // принимает строку в экспоненте
    const [mantissa, exp] = str.split("e");  // разрезает строку на две части в том месте, где стоит буква e, на левую часть (мантисса) и правую часть (экспонента)
    const trimmed = mantissa.includes(".") // проверяет, есть ли в мантиссе точка
      ? mantissa.replace(/0+$/, "").replace(/\.$/, "") // удаляет лишние нули и висячую точку в конце десятичного числа 100.00 -> 100, 100.50 -> 100.5 
      : mantissa;
    return `${trimmed}e${exp}`; //Склеивает чистую левую часть и правую часть обратно через букву e
  };

  // Если число не влезает в экран, и нам нужно сжать его до вида 1.23e+5 или 1.23e-5. нужно узнать сколько цифр после точки у нас поместится?

  const toExpFormat = () => {
    const exponent = Math.floor(Math.log10(absNum)); // вычисляем степень десяти для числа чтобы узнать какую цифру пишем после е
    const exponentDigits = Math.abs(exponent).toString().length; //сколько цифр после е
    const expSign = exponent < 0 ? 1 : 0; // узнаем есть минус или нет
    const reserved = 1 + expSign + exponentDigits + sign.length + 1; // резервируем все что насчитали
    const decimalPlaces = Math.max(0, maxLength - reserved); // вычитаем зарезервированные символы из ширины экрана и все что осталось это колл цифр после точки
    return trimExponential(num.toExponential(decimalPlaces)); // перевдим в экспоненту и отдаем на чистку нулей с колл цифр после точки
  };

  const integerDigits = countIntegerDigits(absNum); //Смотрю целое число
  const needsExponent = integerDigits + sign.length > maxLength || absNum < 1e-6; //Проверяю а не большое или маленькое число

  if (needsExponent) {
    return toExpFormat(); // если сработало то отправляю на подгонку экспоненты, если нет то иду дальше обрабатывать дробную часть
  }

  const availableForDecimals = Math.max(0, maxLength - integerDigits - sign.length - 1); //считаю свободное место под дробную часть, -1 это под точку
  let result = num.toFixed(availableForDecimals); // округляем

  if (result.includes(".")) {
    result = result.replace(/0+$/, "").replace(/\.$/, ""); // подчищаю лишние нули и плавающую точку
  }
  
  // Не увеличилась ли целая часть после округления так, что перестала влезать?». Если переполнила — отправляем в toExpFormat() 
  // чтобы числа типо 99.9 не округлялись до 100 и не имели вместо 2 уже 3 цифры в целой части
  if (countIntegerDigits(Math.abs(Number(result))) + sign.length > maxLength) {
    return toExpFormat();
  }

  return result;
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

/*function formatNumber(num, maxLength = MAX_DISPLAY_CHARS) {
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
}; */

