import test from 'node:test';
import assert from 'node:assert/strict';
import { createEmptySnapshot, receive, split, dispatch } from '../src/domain/commands.ts';
import { preloadedSnapshot } from '../src/mocks/seedData.ts';

const online = true;

test('receipt adds a lot owned by the active company', () => {
  const result = receive(createEmptySnapshot(), {
    operationId: 'receipt-1', companyId: 'rodrigo', productId: 'res-entera', grams: 400_000, costCents: 120_000,
  }, 'rodrigo', online);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.value.snapshot.lots[0]?.availableGrams, 400_000);
  assert.equal(result.value.snapshot.lots[0]?.companyId, 'rodrigo');
});

test('split creates useful lots only when cuts plus waste balance the parent', () => {
  const result = split(preloadedSnapshot(), {
    operationId: 'split-rodrigo', companyId: 'rodrigo', lotId: 'seed-rodrigo-raw',
    outputs: [
      { productId: 'lomo-fino', grams: 100_000 },
      { productId: 'churrasco', grams: 150_000 },
      { productId: 'carne-guiso', grams: 100_000 },
    ], wasteGrams: 50_000,
  }, 'rodrigo', online);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.value.snapshot.lots.find((lot) => lot.id === 'seed-rodrigo-raw')?.status, 'consumed');
  assert.equal(result.value.snapshot.lots.filter((lot) => lot.parentLotId === 'seed-rodrigo-raw').length, 3);
  assert.equal(result.value.snapshot.movements.at(-1)?.wasteGrams, 50_000);
});

test('rejects an unbalanced split and preserves inventory', () => {
  const before = preloadedSnapshot();
  const result = split(before, {
    operationId: 'split-bad', companyId: 'rodrigo', lotId: 'seed-rodrigo-raw',
    outputs: [{ productId: 'lomo-fino', grams: 100_000 }], wasteGrams: 50_000,
  }, 'rodrigo', online);
  assert.equal(result.ok, false);
  assert.equal(before.lots.find((lot) => lot.id === 'seed-rodrigo-raw')?.availableGrams, 400_000);
});

test('rejects cross-company lot access even when caller supplies another company id', () => {
  const result = dispatch(preloadedSnapshot(), {
    operationId: 'steal-quality', companyId: 'rodrigo', lotId: 'seed-quality-raw', grams: 1,
  }, 'rodrigo', online);
  assert.equal(result.ok, false);
});

test('dispatch subtracts stock once for a repeated operation id', () => {
  const first = dispatch(preloadedSnapshot(), {
    operationId: 'dispatch-finilong', companyId: 'finilong', lotId: 'seed-finilong-finished', grams: 50_000,
  }, 'finilong', online);
  assert.equal(first.ok, true);
  if (!first.ok) return;
  const second = dispatch(first.value.snapshot, {
    operationId: 'dispatch-finilong', companyId: 'finilong', lotId: 'seed-finilong-finished', grams: 50_000,
  }, 'finilong', online);
  assert.equal(second.ok, true);
  if (!second.ok) return;
  assert.equal(second.value.snapshot.lots.find((lot) => lot.id === 'seed-finilong-finished')?.availableGrams, 100_000);
  assert.equal(second.value.snapshot.movements.filter((movement) => movement.operationId === 'dispatch-finilong').length, 1);
});
