import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layouts/page-header";
import { ProfitLossView } from "@/features/reports/components";

export default async function ProfitLossPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "reports" });

  return (
    <div className="space-y-6">
      <PageHeader title={t("profitLossTitle")} description={t("profitLossDescription")} />
      <ProfitLossView />
    </div>
  );
}
