"use client";

import { useState, useCallback } from "react";
import { usePurchaseCartStore } from "../stores/purchase-cart-store";
import { usePurchaseCalculations } from "../hooks/use-purchase-calculations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import type { Supplier } from "@/features/suppliers/types";
import type { Product } from "@/features/inventory/types";
import type { CreatePurchaseInvoiceInput } from "../types";

interface Props {
  suppliers: Supplier[];
  products: Product[];
  onSubmit: (input: CreatePurchaseInvoiceInput) => Promise<void>;
  onCancel: () => void;
}

export function PurchaseForm({ suppliers, products, onSubmit, onCancel }: Props) {
  const { items, addItem, removeItem, updateQuantity, updatePrice, clearCart } =
    usePurchaseCartStore();

  const [supplierId, setSupplierId] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [productSearch, setProductSearch] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  const { subtotal, totalAmount, dueAmount } = usePurchaseCalculations(
    items,
    discount,
    paidAmount
  );

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleAddProduct = useCallback(
    (product: Product) => {
      addItem({
        productId: product.id,
        productName: product.name,
        quantity: 1,
        purchasePrice: product.costPrice,
        lineTotal: product.costPrice,
        stock: product.stock,
      });
      setProductSearch("");
      setShowProductDropdown(false);
    },
    [addItem]
  );

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit({
        supplierId: Number(supplierId),
        invoiceNumber,
        subtotal,
        discount,
        paidAmount,
        notes: notes || undefined,
        purchaseDate: purchaseDate || undefined,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          purchasePrice: item.purchasePrice,
          lineTotal: item.lineTotal,
        })),
      });
      clearCart();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Supplier</label>
          <Select value={supplierId} onValueChange={(value) => setSupplierId(value ?? "")}>
            <SelectTrigger>
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Invoice Number</label>
          <Input
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            placeholder="INV-001"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Purchase Date</label>
          <Input
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Products</label>
        <div className="relative">
          <Input
            placeholder="Search products..."
            value={productSearch}
            onChange={(e) => {
              setProductSearch(e.target.value);
              setShowProductDropdown(true);
            }}
            onFocus={() => setShowProductDropdown(true)}
          />
          {showProductDropdown && productSearch && (
            <div className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md border bg-popover shadow-md">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-accent"
                  onClick={() => handleAddProduct(product)}
                >
                  <span>{product.name}</span>
                  <span className="text-muted-foreground">
                    {product.costPrice.toFixed(2)}
                  </span>
                </button>
              ))}
              {filteredProducts.length === 0 && (
                <p className="px-3 py-2 text-sm text-muted-foreground">
                  No products found
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {items.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Line Total</TableHead>
              <TableHead className="text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.productId}>
                <TableCell className="font-medium">{item.productName}</TableCell>
                <TableCell className="text-right">
                  <Input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.productId, Number(e.target.value))
                    }
                    className="ml-auto h-8 w-20 text-right"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    value={item.purchasePrice}
                    onChange={(e) =>
                      updatePrice(item.productId, Number(e.target.value))
                    }
                    className="ml-auto h-8 w-24 text-right"
                  />
                </TableCell>
                <TableCell className="text-right">
                  {item.lineTotal.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem(item.productId)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="flex justify-end">
        <div className="w-72 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-muted-foreground">Discount</span>
            <Input
              type="number"
              min={0}
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="h-8 w-28 text-right"
            />
          </div>
          <div className="flex justify-between border-t pt-2 text-sm font-semibold">
            <span>Total</span>
            <span>{totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-muted-foreground">Paid Amount</span>
            <Input
              type="number"
              min={0}
              value={paidAmount}
              onChange={(e) => setPaidAmount(Number(e.target.value))}
              className="h-8 w-28 text-right"
            />
          </div>
          <div className="flex justify-between border-t pt-2 text-sm font-semibold text-destructive">
            <span>Due</span>
            <span>{dueAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Notes</label>
        <Input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes..."
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={submitting || !supplierId || !invoiceNumber || items.length === 0}
        >
          {submitting ? "Saving..." : "Create Invoice"}
        </Button>
      </div>
    </div>
  );
}
