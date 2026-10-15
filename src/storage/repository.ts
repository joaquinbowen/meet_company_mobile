import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppSnapshot } from '../domain/types.ts';

const SNAPSHOT_KEY = 'meetcompany.demo.snapshot.v1';
const SESSION_KEY = 'meetcompany.demo.session.v1';

export async function readSnapshot(): Promise<AppSnapshot | null> {
  const raw = await AsyncStorage.getItem(SNAPSHOT_KEY);
  if (!raw) return null;
  const parsed: unknown = JSON.parse(raw);
  if (!parsed || typeof parsed !== 'object' || (parsed as { version?: number }).version !== 1) {
    throw new Error('Los datos guardados no son compatibles. Reinicia la demo para continuar.');
  }
  const snapshot = parsed as AppSnapshot;
  if (!Array.isArray(snapshot.lots) || !Array.isArray(snapshot.movements) || !Array.isArray(snapshot.pendingOperationIds)) {
    throw new Error('Los datos guardados están dañados. Reinicia la demo para continuar.');
  }
  return snapshot;
}

export async function writeSnapshot(snapshot: AppSnapshot): Promise<void> {
  await AsyncStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshot));
}

export async function readSession<T>(): Promise<T | null> {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) as T : null;
}

export async function writeSession<T>(session: T): Promise<void> {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export async function clearSnapshot(): Promise<void> {
  await AsyncStorage.removeItem(SNAPSHOT_KEY);
}
