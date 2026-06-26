import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layouts/page-header";
import { SalesReportSection } from "../_components/sales-report-section";

export default async function SalesReportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "reports" });

  return (
    <div className="space-y-6">
      <PageHeader title={t("salesTitle")} description={t("salesDescription")} />
      <SalesReportSection />
    </div>
  );
}
