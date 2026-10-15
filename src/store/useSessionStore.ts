import { create } from 'zustand';
import type { CompanyId } from '../domain/types.ts';
import { readSession, writeSession } from '../storage/repository.ts';

type SavedSession = { pin: string; companyId: CompanyId; email: string };
type SessionState = {
  email: string;
  companyId: CompanyId;
  pin: string | null;
  isHydrated: boolean;
  isAuthenticated: boolean;
  message: string | null;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => boolean;
  configurePin: (pin: string) => Promise<boolean>;
  unlock: (pin: string) => boolean;
  logout: () => void;
  changeCompany: (companyId: CompanyId) => void;
  clearMessage: () => void;
};

const DEMO_EMAIL = 'operador@meetcompany.demo';
const DEMO_PASSWORD = 'planta2026';

export const useSessionStore = create<SessionState>((set, get) => ({
  email: DEMO_EMAIL,
  companyId: 'rodrigo',
  pin: null,
  isHydrated: false,
  isAuthenticated: false,
  message: null,
  hydrate: async () => {
    try {
      const saved = await readSession<SavedSession>();
      if (saved && /^\d{4}$/.test(saved.pin)) set({ email: saved.email, companyId: saved.companyId, pin: saved.pin, isHydrated: true, isAuthenticated: false });
      else set({ isHydrated: true });
    } catch {
      set({ isHydrated: true, message: 'No se pudo leer el acceso guardado. Inicia sesión para continuar.' });
    }
  },
  login: (email, password) => {
    const matches = email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD;
    set({ message: matches ? null : 'Revisa el correo y la contraseña de demostración.' });
    if (matches) set({ email: DEMO_EMAIL, isAuthenticated: !get().pin });
    return matches;
  },
  configurePin: async (pin) => {
    if (!/^\d{4}$/.test(pin)) {
      set({ message: 'El PIN debe tener cuatro dígitos.' });
      return false;
    }
    const session: SavedSession = { pin, companyId: get().companyId, email: DEMO_EMAIL };
    try {
      await writeSession(session);
      set({ pin, isAuthenticated: true, message: null });
      return true;
    } catch {
      set({ message: 'No se pudo guardar el PIN en este dispositivo.' });
      return false;
    }
  },
  unlock: (pin) => {
    const matches = pin === get().pin;
    set({ isAuthenticated: matches, message: matches ? null : 'PIN incorrecto. Inténtalo de nuevo.' });
    return matches;
  },
  logout: () => set({ isAuthenticated: false, message: null }),
  changeCompany: (companyId) => {
    set({ companyId });
    const current = get();
    if (current.pin) void writeSession({ pin: current.pin, companyId, email: current.email });
  },
  clearMessage: () => set({ message: null }),
}));

export const demoCredentials = { email: DEMO_EMAIL, password: DEMO_PASSWORD };
