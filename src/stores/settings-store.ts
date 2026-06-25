import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  currency: string;
  taxRate: number;
  language: string;
  setCurrency: (currency: string) => void;
  setTaxRate: (rate: number) => void;
  setLanguage: (language: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      currency: "USD",
      taxRate: 0,
      language: "en",
      setCurrency: (currency) => set({ currency }),
      setTaxRate: (rate) => set({ taxRate: rate }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "retailx-settings",
    }
  )
);
