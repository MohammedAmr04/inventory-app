import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layouts/page-header";
import { MonthlyExpensesSection } from "../_components/monthly-expenses-section";

export default async function MonthlyExpensesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "expenses" });

  return (
    <div className="space-y-6">
      <PageHeader title={t("monthlyTitle")} description={t("monthlyDescription")} />
      <MonthlyExpensesSection />
    </div>
  );
}
