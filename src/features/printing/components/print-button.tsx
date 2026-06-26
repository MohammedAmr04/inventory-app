"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { usePrint } from "../hooks";
import type { ReceiptData } from "../types";

interface PrintButtonProps {
  receiptData: ReceiptData;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "icon";
  className?: string;
}

export function PrintButton({
  receiptData,
  variant = "outline",
  size = "sm",
  className,
}: PrintButtonProps) {
  const t = useTranslations("printing");
  const { printReceipt, isPrinting, printError } = usePrint();

  return (
    <div>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => printReceipt(receiptData)}
        disabled={isPrinting}
      >
        <Printer className="h-4 w-4" />
        {isPrinting ? t("printing") : t("print")}
      </Button>
      {printError && (
        <p className="mt-1 text-xs text-destructive">{printError}</p>
      )}
    </div>
  );
}
