import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layouts/page-header";
import { CategoriesSection } from "../_components/categories-section";

export default async function ExpenseCategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "expenses" });

  return (
    <div className="space-y-6">
      <PageHeader title={t("categories")} description={t("categoriesDescription")} />
      <CategoriesSection />
    </div>
  );
}
