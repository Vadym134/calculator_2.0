const buttonsConfig = {
  "btn-17": {
    type: "digit",
    value: 0,
  },
  "btn-13": {
    type: "digit",
    value: 1,
  },
  "btn-14": {
    type: "digit",
    value: 2,
  },
  "btn-15": {
    type: "digit",
    value: 3,
  },
  "btn-9": {
    type: "digit",
    value: 4,
  },
  "btn-10": {
    type: "digit",
    value: 5,
  },
  "btn-11": {
    type: "digit",
    value: 6,
  },
  "btn-5": {
    type: "digit",
    value: 7,
  },
  "btn-6": {
    type: "digit",
    value: 8,
  },
  "btn-7": {
    type: "digit",
    value: 9,
  },
};

const state = {
  current: 0,
  previous: null,
  operator: null,
};

const handlers = {
  digit: (config) => {
    createNumber(config.value);
    render();
  }
}

const display = document.querySelector(".calculator__display");
const buttons = document.querySelector(".calculator__buttons");

function render() {
  display.textContent = state.current;
}
render();

function createNumber(digit) {
  state.current = state.current * 10 + digit;
}

buttons.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const dataId = button.dataset.id;
  const config = buttonsConfig[dataId];
  if (!config) return;

  handlers[config.type]?.(config);

  console.log(state);
});
