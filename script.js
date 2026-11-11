(() => {
  const screen = document.getElementById("screen");
  const historyEl = document.getElementById("history");

  let current = "0";
  let previous = null;
  let operator = null;
  let overwrite = false;

  const compute = (a, b, op) => {
    switch (op) {
      case "+": return a + b;
      case "−": return a - b;
      case "×": return a * b;
      case "÷": return b === 0 ? NaN : a / b;
      default: return b;
    }
  };

  const format = (n) => {
    if (!Number.isFinite(n)) return "Error";
    return String(parseFloat(n.toPrecision(12)));
  };

  const render = () => {
    screen.textContent = current;
    historyEl.textContent = operator ? `${previous} ${operator}` : "";
  };

  const inputNumber = (d) => {
    if (current === "Error") current = "0";
    if (overwrite || current === "0") {
      current = d;
      overwrite = false;
    } else if (current.length < 15) {
      current += d;
    }
  };

  const inputDecimal = () => {
    if (current === "Error" || overwrite) { current = "0"; overwrite = false; }
    if (!current.includes(".")) current += ".";
  };

  const chooseOperator = (op) => {
    if (current === "Error") return;
    if (operator && !overwrite) {
      current = format(compute(parseFloat(previous), parseFloat(current), operator));
      if (current === "Error") { operator = null; previous = null; return; }
    }
    previous = current;
    operator = op;
    overwrite = true;
  };

  const equals = () => {
    if (!operator || current === "Error") return;
    const result = format(compute(parseFloat(previous), parseFloat(current), operator));
    historyEl.textContent = `${previous} ${operator} ${current} =`;
    current = result;
    operator = null;
    previous = null;
    overwrite = true;
    screen.textContent = current;
  };

  const clearAll = () => {
    current = "0"; previous = null; operator = null; overwrite = false;
  };

  const del = () => {
    if (overwrite || current === "Error") { current = "0"; overwrite = false; return; }
    current = current.length > 1 ? current.slice(0, -1) : "0";
    if (current === "-") current = "0";
  };

  const negate = () => {
    if (current === "0" || current === "Error") return;
    current = current.startsWith("-") ? current.slice(1) : "-" + current;
  };

  const percent = () => {
    if (current === "Error") return;
    current = format(parseFloat(current) / 100);
  };

  document.querySelector(".keys").addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const { num, op, action } = btn.dataset;

    if (num !== undefined) inputNumber(num);
    else if (op) chooseOperator(op);
    else if (action === "decimal") inputDecimal();
    else if (action === "equals") { equals(); return; }
    else if (action === "clear") clearAll();
    else if (action === "delete") del();
    else if (action === "negate") negate();
    else if (action === "percent") percent();
    render();
  });

  // Keyboard support
  const keyMap = { "/": "÷", "*": "×", "-": "−", "+": "+" };
  document.addEventListener("keydown", (e) => {
    if (/^[0-9]$/.test(e.key)) inputNumber(e.key);
    else if (keyMap[e.key]) chooseOperator(keyMap[e.key]);
    else if (e.key === ".") inputDecimal();
    else if (e.key === "Enter" || e.key === "=") { e.preventDefault(); equals(); return; }
    else if (e.key === "Backspace") del();
    else if (e.key === "Escape") clearAll();
    else if (e.key === "%") percent();
    else return;
    render();
  });

  render();
})();
