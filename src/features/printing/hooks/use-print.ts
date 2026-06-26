"use client";

import { useState } from "react";
import type { ReceiptData, PaperSize } from "../types";

export function usePrint() {
  const [isPrinting, setIsPrinting] = useState(false);
  const [printError, setPrintError] = useState<string | null>(null);

  const printReceipt = async (receiptData: ReceiptData) => {
    setIsPrinting(true);
    setPrintError(null);

    try {
      const res = await fetch("/api/print", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: receiptData, format: "html" }),
      });

      if (!res.ok) throw new Error("Failed to generate receipt");

      const html = await res.text();
      const printWindow = window.open("", "_blank", "width=400,height=600");

      if (!printWindow) {
        throw new Error("Pop-up blocked. Please allow pop-ups for printing.");
      }

      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
    } catch (error) {
      setPrintError(error instanceof Error ? error.message : "Print failed");
    } finally {
      setIsPrinting(false);
    }
  };

  return {
    printReceipt,
    isPrinting,
    printError,
  };
}

export function usePrintPreview() {
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generatePreview = async (
    receiptData: ReceiptData,
    paperSize: PaperSize = "80mm"
  ) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/print", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: receiptData, format: "html", paperSize }),
      });

      if (!res.ok) throw new Error("Failed to generate preview");
      const html = await res.text();
      setPreviewHtml(html);
    } catch (error) {
      console.error("Preview generation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    previewHtml,
    isLoading,
    generatePreview,
    clearPreview: () => setPreviewHtml(null),
  };
}
