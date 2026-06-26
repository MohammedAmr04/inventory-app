import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layouts/page-header";
import { ExpenseSummaryCard } from "@/features/expenses/components";
import { CategoryBreakdownSection } from "../_components/category-breakdown-section";

export default async function ExpenseStatisticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "expenses" });

  return (
    <div className="space-y-6">
      <PageHeader title={t("statisticsTitle")} description={t("statisticsDescription")} />
      <ExpenseSummaryCard />
      <CategoryBreakdownSection />
    </div>
  );
}
