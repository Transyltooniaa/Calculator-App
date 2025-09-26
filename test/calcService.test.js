import { compute } from '../src/services/calcService.js';

describe('compute()', () => {
  test('pow: 2^8 = 256', () => {
    expect(compute('pow', 2, 8)).toBe(256);
  });

  test('sqrt: sqrt(9) = 3', () => {
    expect(compute('sqrt', 9)).toBe(3);
  });

  test('sqrt: negative input throws', () => {
    expect(() => compute('sqrt', -1)).toThrow('Square root of negative number is undefined');
  });

  test('ln: ln(e) ≈ 1', () => {
    const e = Math.E;
    expect(compute('ln', e)).toBeCloseTo(1, 10);
  });

  test('ln: negative input throws', () => {
    expect(() => compute('ln', -5)).toThrow('Logarithm of negative number is undefined');
  });

  test('fact: 0! = 1', () => {
    expect(compute('fact', 0)).toBe(1);
  });

  test('fact: 5! = 120', () => {
    expect(compute('fact', 5)).toBe(120);
  });

  test('unsupported op throws', () => {
    expect(() => compute('nope', 1, 2)).toThrow('Unsupported operation');
  });

  test('non-numeric input throws', () => {
    expect(() => compute('pow', 'abc', 2)).toThrow('Inputs must be valid numbers');
  });
});
