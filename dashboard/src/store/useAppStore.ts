// src/store/useAppStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { subscribeWithSelector } from 'zustand/middleware';
import type { FiltersValuesMap } from '@/types/filters';
import type { AlertFilters } from '@/constants/alertOptions';
import { Dispatch, SetStateAction } from 'react';

type UIState = { darkMode: boolean; sidebarOpen: boolean };

type AlertsState = {
  displayed: AlertFilters[];
  selected: FiltersValuesMap;
  onlyMySubs: boolean;
};

type State = {
  ui: UIState;
  filters: Record<string, never>;
  alerts: AlertsState;
};

type Actions = {
  toggleTheme: () => void;
  setSidebar: (open: boolean) => void;
  setAlertsFiltersDisplayed: Dispatch<SetStateAction<AlertFilters[]>>;
  setAlertSelected: <K extends AlertFilters>(key: K, value: FiltersValuesMap[K]) => void;
  bulkSetAlertSelected: (next: FiltersValuesMap) => void;
  setOnlyMySubs: (v: boolean) => void;
};

const initial: State = {
  ui: { darkMode: false, sidebarOpen: true },
  filters: {},
  alerts: { displayed: [ "event","severity","status","resource", "alert_category", "Country"], selected: {status:["open","ack"]}, onlyMySubs: true },
};

export const useAppStore = create<State & Actions>()(
  persist(
    subscribeWithSelector<State & Actions>((set) => ({
      ...initial,

      // ui
      toggleTheme: () => set((s) => ({ ui: { ...s.ui, darkMode: !s.ui.darkMode } })),
      setSidebar: (open) => set((s) => ({ ui: { ...s.ui, sidebarOpen: open } })),

      // alerts
      setAlertsFiltersDisplayed: (value) =>
        set((s) => {
          const next =
            typeof value === 'function'
              ? (value as (prev: AlertFilters[]) => AlertFilters[])(s.alerts.displayed)
              : value;
          return { alerts: { ...s.alerts, displayed: next } };
        }),
      setAlertSelected: (key, value) =>
        set((s) => ({
          alerts: { ...s.alerts, selected: { ...s.alerts.selected, [key]: value } },
        })),
      bulkSetAlertSelected: (next) =>
        set((s) => ({ alerts: { ...s.alerts, selected: next } })),
      setOnlyMySubs: (v) =>
        set((s) => ({ alerts: { ...s.alerts, onlyMySubs: v } })),
    })),
    {
      name: 'dashboard-state-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ ui: s.ui, alerts: s.alerts }),
    }
  )
);
