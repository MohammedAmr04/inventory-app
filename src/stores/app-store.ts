import { create } from "zustand";

interface AppState {
  sidebarOpen: boolean;
  isOnline: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setOnline: (online: boolean) => void;
}

export const useAppStore = create<AppState>()((set) => ({
  sidebarOpen: true,
  isOnline: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setOnline: (online) => set({ isOnline: online }),
}));
