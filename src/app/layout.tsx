import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RetailX",
  description: "Smart Inventory, POS & Mini-ERP Desktop System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
