import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Supplier } from "../types";

interface SupplierDetailsCardProps {
  supplier: Supplier;
}

export function SupplierDetailsCard({ supplier }: SupplierDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{supplier.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="text-sm font-medium">{supplier.phone ?? "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-sm font-medium">{supplier.email ?? "—"}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Address</p>
          <p className="text-sm font-medium">{supplier.address ?? "—"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Notes</p>
          <p className="text-sm font-medium">{supplier.notes ?? "—"}</p>
        </div>
      </CardContent>
    </Card>
  );
}
