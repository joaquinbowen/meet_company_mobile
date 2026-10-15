import test from 'node:test';
import assert from 'node:assert/strict';
import { createEmptySnapshot, dispatch, receive, split } from '../src/domain/commands.ts';
import { availableLots, totalAvailableGrams } from '../src/domain/selectors.ts';
import { confirmSync } from '../src/domain/sync.ts';
import { scenarios } from '../src/mocks/scenarios.ts';

test('three demonstration flows end with the documented stock and waste totals', () => {
  let snapshot = createEmptySnapshot();
  const expected = { rodrigo: 70_000 + 150_000 + 100_000, quality: 80_000 + 30_000 + 30_000, finilong: 100_000 };
  for (const scenario of scenarios) {
    const receipt = receive(snapshot, {
      operationId: `receipt-${scenario.id}`, companyId: scenario.companyId,
      productId: scenario.rawProductId ?? scenario.finishedProductId!, grams: scenario.receiptGrams, costCents: scenario.costCents,
    }, scenario.companyId, true);
    assert.equal(receipt.ok, true);
    if (!receipt.ok) return;
    snapshot = receipt.value.snapshot;
    let dispatchLotId = receipt.value.value;
    if (scenario.rawProductId) {
      const cutting = split(snapshot, {
        operationId: `split-${scenario.id}`, companyId: scenario.companyId, lotId: dispatchLotId,
        outputs: scenario.outputs, wasteGrams: scenario.wasteGrams,
      }, scenario.companyId, true);
      assert.equal(cutting.ok, true);
      if (!cutting.ok) return;
      snapshot = cutting.value.snapshot;
      dispatchLotId = snapshot.lots.find((lot) => lot.productId === scenario.dispatchProductId && lot.parentLotId === receipt.value.value)!.id;
    }
    const out = dispatch(snapshot, {
      operationId: `dispatch-${scenario.id}`, companyId: scenario.companyId,
      lotId: dispatchLotId, grams: scenario.dispatchGrams,
    }, scenario.companyId, true);
    assert.equal(out.ok, true);
    if (!out.ok) return;
    snapshot = out.value.snapshot;
  }
  assert.equal(totalAvailableGrams(snapshot, 'rodrigo'), expected.rodrigo);
  assert.equal(totalAvailableGrams(snapshot, 'quality'), expected.quality);
  assert.equal(totalAvailableGrams(snapshot, 'finilong'), expected.finilong);
  assert.equal(Object.values(expected).reduce((sum, value) => sum + value, 0), 560_000);
  assert.equal(snapshot.movements.filter((movement) => movement.type === 'split').reduce((sum, movement) => sum + (movement.wasteGrams ?? 0), 0), 70_000);
});

test('available inventory never exposes another company lots', () => {
  const snapshot = createEmptySnapshot();
  const qualityReceipt = receive(snapshot, {
    operationId: 'quality-private', companyId: 'quality', productId: 'cerdo-canal', grams: 200_000, costCents: 50_000,
  }, 'quality', true);
  assert.equal(qualityReceipt.ok, true);
  if (!qualityReceipt.ok) return;
  assert.deepEqual(availableLots(qualityReceipt.value.snapshot, 'rodrigo'), []);
});

test('offline receipt waits in the queue and simulated sync confirms without changing stock', () => {
  const receipt = receive(createEmptySnapshot(), {
    operationId: 'offline-receipt', companyId: 'finilong', productId: 'lomo-importado', grams: 150_000, costCents: 150_000,
  }, 'finilong', false);
  assert.equal(receipt.ok, true);
  if (!receipt.ok) return;
  const before = totalAvailableGrams(receipt.value.snapshot, 'finilong');
  assert.deepEqual(receipt.value.snapshot.pendingOperationIds, ['offline-receipt']);
  const synced = confirmSync(receipt.value.snapshot, ['offline-receipt']);
  assert.equal(synced.pendingOperationIds.length, 0);
  assert.equal(synced.movements[0]?.syncStatus, 'synced');
  assert.equal(totalAvailableGrams(synced, 'finilong'), before);
});
