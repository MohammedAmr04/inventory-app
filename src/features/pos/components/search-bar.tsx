"use client";

import { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useBarcodeSearch, useProductSearch } from "../hooks";
import { usePosStore } from "../stores";
import { useCartStore } from "../stores";
import type { Product } from "@/features/inventory/types";

interface SearchBarProps {
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export function SearchBar({ inputRef: externalRef }: SearchBarProps) {
  const internalRef = useRef<HTMLInputElement>(null);
  const inputRef = externalRef ?? internalRef;
  const searchQuery = usePosStore((s) => s.searchQuery);
  const setSearchQuery = usePosStore((s) => s.setSearchQuery);
  const addItem = useCartStore((s) => s.addItem);

  const { data: barcodeProduct } = useBarcodeSearch(
    searchQuery.length > 0 ? searchQuery : null
  );

  const { data: searchResults } = useProductSearch(searchQuery);

  useEffect(() => {
    if (barcodeProduct) {
      addItem({
        productId: barcodeProduct.id,
        productName: barcodeProduct.name,
        barcode: barcodeProduct.barcode,
        quantity: 1,
        salePrice: barcodeProduct.salePrice,
        lineTotal: barcodeProduct.salePrice,
      });
      setSearchQuery("");
    }
  }, [barcodeProduct, addItem, setSearchQuery]);

  function handleSelect(product: Product) {
    addItem({
      productId: product.id,
      productName: product.name,
      barcode: product.barcode,
      quantity: 1,
      salePrice: product.salePrice,
      lineTotal: product.salePrice,
    });
    setSearchQuery("");
    inputRef.current?.focus();
  }

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by barcode or name... (F1)"
        className="h-12 text-lg"
        autoFocus
      />
      {searchQuery.length > 0 && searchResults && searchResults.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-background shadow-lg">
          {searchResults.slice(0, 10).map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => handleSelect(product)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-accent"
            >
              <span className="flex-1 font-medium">{product.name}</span>
              <span className="text-sm text-muted-foreground">
                ${product.salePrice.toFixed(2)}
              </span>
              {product.barcode && (
                <span className="text-xs text-muted-foreground">
                  {product.barcode}
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                Stock: {product.stock}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
