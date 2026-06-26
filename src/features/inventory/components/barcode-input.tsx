"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BarcodeInputProps {
  onBarcodeScanned: (barcode: string) => void;
  placeholder?: string;
}

export function BarcodeInput({ onBarcodeScanned, placeholder = "Scan or type barcode..." }: BarcodeInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (value.trim()) {
        onBarcodeScanned(value.trim());
        setValue("");
      }
    },
    [value, onBarcodeScanned],
  );

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        autoFocus
      />
      <Button type="submit">Search</Button>
    </form>
  );
}
