export { preloadedSnapshot, emptySnapshot } from '../../../packages/demo-domain/src/snapshots.ts';
import { preloadedSnapshot, emptySnapshot } from '../../../packages/demo-domain/src/snapshots.ts';
import type { AppSnapshot, ScenarioId } from '../domain/types.ts';
export const initialSnapshot = (mode: 'preloaded' | 'empty', _scenario?: ScenarioId): AppSnapshot => mode === 'preloaded' ? preloadedSnapshot() : emptySnapshot();
