import { getDb } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { inArray } from "drizzle-orm";
import type { ReceiptData } from "../types";
import { STORE_SETTINGS_KEYS, DEFAULT_STORE_SETTINGS } from "@/features/settings/types";

export class PrintService {
  static async storeSettings(): Promise<Map<string, string>> {
    const db = await getDb();
    const rows = await db
      .select()
      .from(settings)
      .where(inArray(settings.key, STORE_SETTINGS_KEYS));
    return new Map(rows.map((r) => [r.key, r.value]));
  }

  static async generateReceiptHtml(data: ReceiptData): Promise<string> {
    const itemsHtml = data.items
      .map(
        (item) => `
        <tr>
          <td style="text-align:left">${item.name}</td>
          <td style="text-align:center">${item.quantity}</td>
          <td style="text-align:right">${item.price.toFixed(2)}</td>
          <td style="text-align:right">${item.total.toFixed(2)}</td>
        </tr>`
      )
      .join("");

    const paymentLine =
      data.paymentMethod === "cash" && data.cashReceived != null
        ? `
        <tr><td style="text-align:left">Cash Received</td><td style="text-align:right">${data.cashReceived.toFixed(2)}</td></tr>
        <tr><td style="text-align:left">Change</td><td style="text-align:right">${(data.changeAmount ?? 0).toFixed(2)}</td></tr>`
        : "";

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${data.invoiceNumber}</title>
<style>
  @page { margin: 0; size: 80mm auto; }
  body { font-family: 'Courier New', monospace; font-size: 12px; width: 72mm; margin: 0 auto; padding: 5mm 2mm; }
  .header { text-align: center; margin-bottom: 8px; }
  .header h2 { margin: 0; font-size: 16px; }
  .header p { margin: 2px 0; font-size: 11px; }
  .divider { border-top: 1px dashed #000; margin: 6px 0; }
  table { width: 100%; border-collapse: collapse; font-size: 11px; }
  th { border-bottom: 1px solid #000; padding: 3px 0; text-align: left; }
  th:nth-child(2), th:nth-child(3), th:nth-child(4) { text-align: right; }
  td { padding: 2px 0; }
  td:nth-child(2), td:nth-child(3), td:nth-child(4) { text-align: right; }
  .totals td { font-weight: bold; }
  .totals td:last-child { text-align: right; }
  .grand-total { font-size: 14px; font-weight: bold; }
  .footer { text-align: center; margin-top: 8px; font-size: 10px; }
</style>
</head>
<body>
  <div class="header">
    <h2>${data.storeName}</h2>
    ${data.storePhone ? `<p>Tel: ${data.storePhone}</p>` : ""}
    ${data.storeAddress ? `<p>${data.storeAddress}</p>` : ""}
  </div>
  <div class="divider"></div>
  <table>
    <tr><td>Invoice:</td><td style="text-align:right">${data.invoiceNumber}</td></tr>
    <tr><td>Date:</td><td style="text-align:right">${data.date}</td></tr>
    ${data.customerName ? `<tr><td>Customer:</td><td style="text-align:right">${data.customerName}</td></tr>` : ""}
  </table>
  <div class="divider"></div>
  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th style="text-align:center">Qty</th>
        <th style="text-align:right">Price</th>
        <th style="text-align:right">Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHtml}
    </tbody>
  </table>
  <div class="divider"></div>
  <table class="totals">
    <tr><td>Subtotal</td><td style="text-align:right">${data.subtotal.toFixed(2)}</td></tr>
    ${data.discount > 0 ? `<tr><td>Discount</td><td style="text-align:right">-${data.discount.toFixed(2)}</td></tr>` : ""}
    ${data.tax > 0 ? `<tr><td>${data.taxName} (${data.taxRate}%)</td><td style="text-align:right">${data.tax.toFixed(2)}</td></tr>` : ""}
    <tr class="grand-total"><td>Total</td><td style="text-align:right">${data.netTotal.toFixed(2)}</td></tr>
    ${paymentLine}
  </table>
  <div class="divider"></div>
  <table>
    <tr><td>Payment</td><td style="text-align:right">${data.paymentMethod.toUpperCase()}</td></tr>
  </table>
  ${data.receiptFooter ? `<div class="footer">${data.receiptFooter}</div>` : ""}
  <script>window.print();</script>
</body>
</html>`;
  }

  static async generateEscPos(data: ReceiptData): Promise<Uint8Array> {
    const lines: string[] = [];

    lines.push("\x1B\x40"); // Initialize printer
    lines.push("\x1B\x61\x01"); // Center align

    // Store name
    lines.push("\x1B\x21\x10"); // Double height + double width
    lines.push(`${data.storeName}\n`);
    lines.push("\x1B\x21\x00"); // Normal

    if (data.storePhone) lines.push(`Tel: ${data.storePhone}\n`);
    if (data.storeAddress) lines.push(`${data.storeAddress}\n`);

    lines.push("-".repeat(32) + "\n");

    lines.push("\x1B\x61\x00"); // Left align
    lines.push(`Invoice: ${data.invoiceNumber}\n`);
    lines.push(`Date: ${data.date}\n`);
    if (data.customerName) lines.push(`Customer: ${data.customerName}\n`);

    lines.push("-".repeat(32) + "\n");

    // Header
    lines.push(`${"Item".padEnd(16)} ${"Qty".padStart(4)} ${"Price".padStart(6)} ${"Total".padStart(6)}\n`);

    for (const item of data.items) {
      const name = item.name.substring(0, 16).padEnd(16);
      const qty = String(item.quantity).padStart(4);
      const price = item.price.toFixed(2).padStart(6);
      const total = item.total.toFixed(2).padStart(6);
      lines.push(`${name} ${qty} ${price} ${total}\n`);
    }

    lines.push("-".repeat(32) + "\n");

    lines.push(`Subtotal`.padEnd(22) + `${data.subtotal.toFixed(2).padStart(10)}\n`);
    if (data.discount > 0) {
      lines.push(`Discount`.padEnd(22) + `-${data.discount.toFixed(2).padStart(9)}\n`);
    }
    if (data.tax > 0) {
      lines.push(`${data.taxName} (${data.taxRate}%)`.padEnd(22) + `${data.tax.toFixed(2).padStart(10)}\n`);
    }

    lines.push("\x1B\x21\x08"); // Bold
    lines.push(`TOTAL`.padEnd(22) + `${data.netTotal.toFixed(2).padStart(10)}\n`);
    lines.push("\x1B\x21\x00"); // Normal

    if (data.paymentMethod === "cash" && data.cashReceived != null) {
      lines.push(`Cash`.padEnd(22) + `${data.cashReceived.toFixed(2).padStart(10)}\n`);
      lines.push(`Change`.padEnd(22) + `${(data.changeAmount ?? 0).toFixed(2).padStart(10)}\n`);
    }

    lines.push(`Payment: ${data.paymentMethod.toUpperCase()}\n`);

    if (data.receiptFooter) {
      lines.push("\n");
      lines.push("\x1B\x61\x01"); // Center
      lines.push(`${data.receiptFooter}\n`);
    }

    lines.push("\n\n\n");
    lines.push("\x1B\x6D"); // Cut paper (GS V m)

    return Buffer.from(lines.join(""), "utf-8");
  }
}
