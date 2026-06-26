import { PageHeader } from "@/components/layouts/page-header";
import { SaleHistorySection } from "../_components/sale-history-section";

export default function PosHistoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales History"
        description="View past sales and invoices"
      />
      <SaleHistorySection />
    </div>
  );
}
