"use client";

import { setupIonicReact } from "@ionic/react";

setupIonicReact();

export function IonicProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
