"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSettings } from "../hooks";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function StoreSettingsForm() {
  const t = useTranslations("settings");
  const { settings, isLoading, updateSettings, isUpdating } = useSettings();

  const [storeName, setStoreName] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [taxName, setTaxName] = useState("Tax");
  const [taxRate, setTaxRate] = useState(0);
  const [currencySymbol, setCurrencySymbol] = useState("$");
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [receiptFooter, setReceiptFooter] = useState("");

  useEffect(() => {
    if (settings) {
      setStoreName(settings.storeName);
      setStorePhone(settings.storePhone);
      setStoreEmail(settings.storeEmail);
      setStoreAddress(settings.storeAddress);
      setTaxName(settings.taxName);
      setTaxRate(settings.taxRate);
      setCurrencySymbol(settings.currencySymbol);
      setCurrencyCode(settings.currencyCode);
      setReceiptFooter(settings.receiptFooter);
    }
  }, [settings]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await updateSettings({
      storeName,
      storePhone,
      storeEmail,
      storeAddress,
      taxName,
      taxRate,
      currencySymbol,
      currencyCode,
      receiptFooter,
    });
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("store")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("storeName")}</label>
              <Input
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("storePhone")}</label>
              <Input
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("storeEmail")}</label>
              <Input
                type="email"
                value={storeEmail}
                onChange={(e) => setStoreEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("currencySymbol")}</label>
              <Input
                required
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("currencyCode")}</label>
              <Input
                required
                value={currencyCode}
                onChange={(e) => setCurrencyCode(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("taxName")}</label>
              <Input
                value={taxName}
                onChange={(e) => setTaxName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("taxRate")}</label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("storeAddress")}</label>
            <Input
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("receiptFooter")}</label>
            <Input
              value={receiptFooter}
              onChange={(e) => setReceiptFooter(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("save")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
