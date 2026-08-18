import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ProcedureId } from '../data/procedures';
import { storage, type PatientRecord } from './storage';

export type PatientProfile = PatientRecord;

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
  /**
   * Os procedimentos da paciente, sempre com ao menos um. É por aqui que as
   * telas filtram conteúdo: assim a cirurgia combinada não vira um caso
   * especial espalhado por toda parte.
   */
  procedureIds: ProcedureId[];
  /** Mais de um procedimento no mesmo tempo cirúrgico. */
  combined: boolean;
  /** Dias completos desde a cirurgia. Negativo quando a cirurgia é futura. */
  postOpDay: number;
  save: (patch: Partial<PatientProfile>) => Promise<void>;
  toggleTask: (key: string) => void;
  isTaskDone: (key: string) => boolean;
  reset: () => Promise<void>;
}

const PatientContext = createContext<PatientContextValue | null>(null);

/** Diferença em dias inteiros entre a data do procedimento e hoje. */
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
      const record = await storage.load();
      if (record) setProfile({ ...emptyProfile, ...record });
      setLoading(false);
    })();
  }, []);

  const persist = useCallback(async (next: PatientProfile) => {
    setProfile(next);
    await storage.save(next);
  }, []);

  const save = useCallback(
    async (patch: Partial<PatientProfile>) => {
      await persist({ ...profile, ...patch });
    },
    [profile, persist],
  );

  const toggleTask = useCallback((key: string) => {
    setProfile((prev) => {
      const doneTasks = prev.doneTasks.includes(key)
        ? prev.doneTasks.filter((k) => k !== key)
        : [...prev.doneTasks, key];
      const next = { ...prev, doneTasks };
      void storage.save(next);
      return next;
    });
  }, []);

  const reset = useCallback(async () => {
    await storage.clear();
    setProfile(emptyProfile);
  }, []);

  const postOpDay = daysSince(profile.surgeryDate);

  /* Registros antigos guardam só `procedure`; um registro novo com lista vazia
     seria um cadastro corrompido. Nos dois casos vale o procedimento
     principal, e nenhuma tela precisa tratar a ausência. */
  const procedureIds = useMemo<ProcedureId[]>(
    () => (profile.procedures?.length ? profile.procedures : [profile.procedure]),
    [profile.procedures, profile.procedure],
  );

  const value = useMemo<PatientContextValue>(
    () => ({
      profile,
      loading,
      procedureIds,
      combined: procedureIds.length > 1,
      postOpDay,
      save,
      toggleTask,
      isTaskDone: (key: string) => profile.doneTasks.includes(key),
      reset,
    }),
    [profile, loading, procedureIds, postOpDay, save, toggleTask, reset],
  );

  return <PatientContext.Provider value={value}>{children}</PatientContext.Provider>;
}

export function usePatient(): PatientContextValue {
  const ctx = useContext(PatientContext);
  if (!ctx) throw new Error('usePatient precisa estar dentro de PatientProvider');
  return ctx;
}
