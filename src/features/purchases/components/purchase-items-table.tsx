import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import type { PurchaseItem, CartItem } from "../types";

interface Props {
  items: (PurchaseItem | CartItem)[];
}

export function PurchaseItemsTable({ items }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead className="text-right">Quantity</TableHead>
          <TableHead className="text-right">Purchase Price</TableHead>
          <TableHead className="text-right">Line Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item, idx) => (
          <TableRow key={"productId" in item ? item.productId : idx}>
            <TableCell className="font-medium">
              {"productName" in item ? item.productName : "productName" in item ? item.productName : "—"}
            </TableCell>
            <TableCell className="text-right">{item.quantity}</TableCell>
            <TableCell className="text-right">{item.purchasePrice.toFixed(2)}</TableCell>
            <TableCell className="text-right">{item.lineTotal.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
