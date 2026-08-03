import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { procedureById, type ProcedureId } from '../data/procedures';
import { todayIso, type CheckIn } from '../domain/checkin';
import { triage, type TriageResult } from '../domain/triage';
import { storage, type PatientRecord } from './storage';

export type PatientProfile = PatientRecord;

const emptyProfile: PatientProfile = {
  name: '',
  procedure: 'outro',
  surgeryDate: todayIso(),
  doneTasks: [],
  onboarded: false,
  reviewDismissed: false,
  checkIns: [],
};

interface PatientContextValue {
  profile: PatientProfile;
  loading: boolean;
  /** Dias completos desde a cirurgia. Negativo quando a cirurgia é futura. */
  postOpDay: number;
  /** Situação da paciente pela mesma regra que o painel da equipe usa. */
  status: TriageResult;
  save: (patch: Partial<PatientProfile>) => Promise<void>;
  toggleTask: (key: string) => void;
  isTaskDone: (key: string) => boolean;
  /** Grava o registro do dia, substituindo o anterior se já houver um hoje. */
  saveCheckIn: (checkIn: CheckIn) => Promise<void>;
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

  const saveCheckIn = useCallback(async (checkIn: CheckIn) => {
    setProfile((prev) => {
      const checkIns = [...prev.checkIns.filter((c) => c.date !== checkIn.date), checkIn];
      const next = { ...prev, checkIns };
      void storage.save(next);
      return next;
    });
  }, []);

  const reset = useCallback(async () => {
    await storage.clear();
    setProfile(emptyProfile);
  }, []);

  const postOpDay = daysSince(profile.surgeryDate);

  const status = useMemo(
    () =>
      triage({
        procedureKind: procedureById(profile.procedure).kind,
        day: postOpDay,
        checkIns: profile.checkIns,
      }),
    [profile.procedure, profile.checkIns, postOpDay],
  );

  const value = useMemo<PatientContextValue>(
    () => ({
      profile,
      loading,
      postOpDay,
      status,
      save,
      toggleTask,
      isTaskDone: (key: string) => profile.doneTasks.includes(key),
      saveCheckIn,
      reset,
    }),
    [profile, loading, postOpDay, status, save, toggleTask, saveCheckIn, reset],
  );

  return <PatientContext.Provider value={value}>{children}</PatientContext.Provider>;
}

export function usePatient(): PatientContextValue {
  const ctx = useContext(PatientContext);
  if (!ctx) throw new Error('usePatient precisa estar dentro de PatientProvider');
  return ctx;
}
