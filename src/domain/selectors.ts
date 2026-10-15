import type { AppSnapshot, CompanyId, ProductKind } from './types.ts';
import { productById } from '../mocks/catalog.ts';

export function availableLots(snapshot: AppSnapshot, companyId: CompanyId) {
  return snapshot.lots.filter((lot) => lot.companyId === companyId && lot.status === 'available' && lot.availableGrams > 0);
}

export function availableLotsByKind(snapshot: AppSnapshot, companyId: CompanyId, kinds: ProductKind[]) {
  return availableLots(snapshot, companyId).filter((lot) => {
    const kind = productById(lot.productId)?.kind;
    return kind !== undefined && kinds.includes(kind);
  });
}

export function totalAvailableGrams(snapshot: AppSnapshot, companyId: CompanyId): number {
  return availableLots(snapshot, companyId).reduce((total, lot) => total + lot.availableGrams, 0);
}
