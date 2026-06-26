"use client";

import { useEffect, useRef } from "react";
import type { ReceiptData, PaperSize } from "../types";

interface ReceiptPreviewProps {
  receiptData: ReceiptData;
  paperSize?: PaperSize;
  onClose?: () => void;
}

export function ReceiptPreview({
  receiptData,
  paperSize = "80mm",
  onClose,
}: ReceiptPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    fetch("/api/print", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: receiptData,
        format: "html",
        paperSize,
      }),
    })
      .then((res) => res.text())
      .then((html) => {
        if (iframe.contentWindow) {
          iframe.contentWindow.document.open();
          iframe.contentWindow.document.write(html);
          iframe.contentWindow.document.close();
        }
      });
  }, [receiptData, paperSize]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative h-[90vh] w-[90vw] max-w-[500px] rounded-lg bg-white shadow-xl">
        <div className="absolute right-2 top-2 z-10 flex gap-2">
          <button
            onClick={() => iframeRef.current?.contentWindow?.print()}
            className="rounded bg-primary px-3 py-1 text-sm text-primary-foreground"
          >
            Print
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded bg-muted px-3 py-1 text-sm"
            >
              Close
            </button>
          )}
        </div>
        <iframe
          ref={iframeRef}
          className="h-full w-full rounded-lg"
          title="Receipt Preview"
        />
      </div>
    </div>
  );
}
