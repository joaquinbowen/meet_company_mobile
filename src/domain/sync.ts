import type { AppSnapshot } from './types.ts';

export function confirmSync(snapshot: AppSnapshot, operationIds: string[]): AppSnapshot {
  const confirmed = new Set(operationIds);
  return {
    ...snapshot,
    pendingOperationIds: snapshot.pendingOperationIds.filter((id) => !confirmed.has(id)),
    movements: snapshot.movements.map((movement) => confirmed.has(movement.operationId)
      ? { ...movement, syncStatus: 'synced' }
      : movement),
  };
}
