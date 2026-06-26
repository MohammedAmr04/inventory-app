import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layouts/page-header";
import { ProductReportView } from "@/features/reports/components";

export default async function ProductReportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "reports" });

  return (
    <div className="space-y-6">
      <PageHeader title={t("productsTitle")} description={t("productsDescription")} />
      <ProductReportView />
    </div>
  );
}
