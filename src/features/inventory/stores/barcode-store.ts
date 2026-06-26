import { create } from "zustand";

interface BarcodeState {
  scanning: boolean;
  lastScanned: string | null;
  setScanning: (scanning: boolean) => void;
  setLastScanned: (barcode: string | null) => void;
}

export const useBarcodeStore = create<BarcodeState>()((set) => ({
  scanning: false,
  lastScanned: null,
  setScanning: (scanning) => set({ scanning }),
  setLastScanned: (barcode) => set({ lastScanned: barcode }),
}));
