import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ProcedureId } from '../data/procedures';

const STORAGE_KEY = '@plasticahenrique/patient-v1';

export interface PatientProfile {
  name: string;
  procedure: ProcedureId;
  /** Data da cirurgia em ISO (YYYY-MM-DD). */
  surgeryDate: string;
  /** Itens de checklist concluídos, no formato `${dayKey}:${index}`. */
  doneTasks: string[];
  onboarded: boolean;
  /** Convite de avaliação dispensado na tela inicial. */
  reviewDismissed: boolean;
}

const emptyProfile: PatientProfile = {
  name: '',
  procedure: 'outro',
  surgeryDate: new Date().toISOString().slice(0, 10),
  doneTasks: [],
  onboarded: false,
  reviewDismissed: false,
};

interface PatientContextValue {
  profile: PatientProfile;
  loading: boolean;
  /** Dias completos desde a cirurgia. Negativo quando a cirurgia é futura. */
  postOpDay: number;
  save: (patch: Partial<PatientProfile>) => Promise<void>;
  toggleTask: (key: string) => void;
  isTaskDone: (key: string) => boolean;
  reset: () => Promise<void>;
}

const PatientContext = createContext<PatientContextValue | null>(null);

/** Diferença em dias inteiros entre a data da cirurgia e hoje, ignorando horas. */
export function daysSince(isoDate: string): number {
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return 0;
  const surgery = Date.UTC(y, m - 1, d);
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((today - surgery) / 86_400_000);
}

export function PatientProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<PatientProfile>(emptyProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setProfile({ ...emptyProfile, ...JSON.parse(raw) });
      } catch {
        // Perfil corrompido ou indisponível: segue com o padrão e o onboarding.
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = useCallback(async (next: PatientProfile) => {
    setProfile(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Falha de escrita não deve interromper o uso do app.
    }
  }, []);

  const save = useCallback(
    async (patch: Partial<PatientProfile>) => {
      await persist({ ...profile, ...patch });
    },
    [profile, persist],
  );

  const toggleTask = useCallback(
    (key: string) => {
      setProfile((prev) => {
        const doneTasks = prev.doneTasks.includes(key)
          ? prev.doneTasks.filter((k) => k !== key)
          : [...prev.doneTasks, key];
        const next = { ...prev, doneTasks };
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
        return next;
      });
    },
    [],
  );

  const reset = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
    setProfile(emptyProfile);
  }, []);

  const value = useMemo<PatientContextValue>(
    () => ({
      profile,
      loading,
      postOpDay: daysSince(profile.surgeryDate),
      save,
      toggleTask,
      isTaskDone: (key: string) => profile.doneTasks.includes(key),
      reset,
    }),
    [profile, loading, save, toggleTask, reset],
  );

  return <PatientContext.Provider value={value}>{children}</PatientContext.Provider>;
}

export function usePatient(): PatientContextValue {
  const ctx = useContext(PatientContext);
  if (!ctx) throw new Error('usePatient precisa estar dentro de PatientProvider');
  return ctx;
}
