import test from 'node:test';
import assert from 'node:assert/strict';
import { kgToGrams, usdToCents, sumGrams } from '../src/domain/weights.ts';

test('converts decimal kilograms to exact integer grams', () => {
  assert.equal(kgToGrams('0.001'), 1);
  assert.equal(kgToGrams('400,125'), 400_125);
});

test('rejects negative values and unsupported precision', () => {
  assert.throws(() => kgToGrams('-1'));
  assert.throws(() => kgToGrams('1.0001'));
});

test('converts dollars to cents without floating point rounding', () => {
  assert.equal(usdToCents('1200.00'), 120_000);
  assert.equal(usdToCents('2,50'), 250);
});

test('adds gram values exactly', () => {
  assert.equal(sumGrams([100, 200]), 300);
});
