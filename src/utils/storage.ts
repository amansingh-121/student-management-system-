import { useState, useEffect, Dispatch, SetStateAction } from 'react';

export const STORAGE_KEYS = {
  CURRENT_USER: 'sap_erp_current_user',
  ACTIVE_TAB: 'sap_erp_active_tab',
  NOTIFICATIONS: 'sap_erp_notifications',
  RESULTS: 'sap_erp_results',
  ATTENDANCE: 'sap_erp_subject_attendance',
  DAILY_LOGS: 'sap_erp_daily_logs',
  FEES: 'sap_erp_fee_invoices',
  DOCUMENTS: 'sap_erp_documents',
  ALL_STUDENTS: 'sap_erp_all_students',
  FACULTY_COURSES: 'sap_erp_faculty_courses',
  TIMETABLE: 'sap_erp_timetable_slots',
  GRADES_MAP: 'sap_erp_grades_map',
} as const;

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw !== null) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn(`[SAP ERP Persistence] Error loading ${key}:`, err);
  }
  return defaultValue;
}

export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[SAP ERP Persistence] Error saving ${key}:`, err);
  }
}

export function usePersistentState<T>(
  key: string,
  defaultValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => loadFromStorage<T>(key, defaultValue));

  useEffect(() => {
    saveToStorage<T>(key, state);
  }, [key, state]);

  return [state, setState];
}

export function resetAllStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    Object.values(STORAGE_KEYS).forEach((k) => {
      window.localStorage.removeItem(k);
    });
  } catch (err) {
    console.warn('[SAP ERP Persistence] Failed to clear storage:', err);
  }
}
