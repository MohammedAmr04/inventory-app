import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layouts/page-header";

export default async function InventoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "inventory" });

  return (
    <div>
      <PageHeader title={t("title")} description={t("description")} />
    </div>
  );
}
