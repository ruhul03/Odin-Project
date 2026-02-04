const display = document.getElementById("display");

function appendOperator(operator) {
  const lastChar = display.value.slice(-1);
  const operators = ['+', '-', '*', '/', '%'];

  // If display is empty and operator is not '-', don't append
  if (display.value === "" && operator !== '-') return;

  // If last character is an operator, replace it with the new one
  if (operators.includes(lastChar)) {
    display.value = display.value.slice(0, -1) + operator;
  } else {
    display.value += operator;
  }
}

function appendNumber(number) {
  // If we just had an error, clear it
  if (display.value === "Error") display.value = "";

  // Basic decimal point validation
  if (number === '.') {
    const parts = display.value.split(/[\+\-\*\/\%]/);
    const lastPart = parts[parts.length - 1];
    if (lastPart.includes('.')) return;
  }

  display.value += number;
}

function calculate() {
  try {
    // Replace % with /100 for evaluation if needed, 
    // but eval handles basic expressions usually. 
    // For a real calculator, we'd want a safer parser.
    let result = eval(display.value);
    if (result === Infinity || isNaN(result)) {
      display.value = "Error";
    } else {
      // Round to 8 decimal places to avoid floating point weirdness
      display.value = Number(Math.round(result + 'e8') + 'e-8');
    }
  } catch (e) {
    display.value = "Error";
  }
}

function deleteLast() {
  display.value = display.value.slice(0, -1);
}

function clearDisplay() {
  display.value = "";
}

