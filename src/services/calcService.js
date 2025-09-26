function toNumber (v) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw exposedError('Inputs must be valid numbers', 400);
  return n;
}

function exposedError (msg, status = 400) {
  const e = new Error(msg);
  e.status = status;
  e.expose = true;
  return e;
}

function factorial (a) {
  if (a === 0) return 1;
  return a * factorial(a - 1);
}

export function compute (op, a, b) {
  const x = toNumber(a);


  switch (op) {
    case 'sqrt': {
      if (x < 0) throw exposedError('Square root of negative number is undefined', 400);
      return Math.sqrt(x);
    }

    case 'fact': {
      if (x < 0) throw exposedError('Factorial of negative number is undefined', 400);
      if (!Number.isInteger(x)) throw exposedError('Factorial is defined for integers only', 400);
      return factorial(x);
    }

    case 'ln': {
      if (x < 0) throw exposedError('Logarithm of negative number is undefined', 400);
      return Math.log(x);
    }

    case 'pow': {
      const y = toNumber(b);        // only parse b for binary op
      return Math.pow(x, y);
    }

    default:
      throw exposedError('Unsupported operation: ' + op + '. Use one of sqrt|fact|ln|pow', 400);
  }
}
