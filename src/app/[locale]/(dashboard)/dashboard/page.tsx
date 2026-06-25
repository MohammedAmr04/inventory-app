import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layouts/page-header";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });

  return (
    <div>
      <PageHeader title={t("title")} description={t("description")} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <p className="text-sm text-muted-foreground">{t("totalSales")}</p>
          <p className="mt-2 text-3xl font-bold">$0.00</p>
        </div>
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <p className="text-sm text-muted-foreground">{t("totalProducts")}</p>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <p className="text-sm text-muted-foreground">{t("totalSuppliers")}</p>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <p className="text-sm text-muted-foreground">{t("lowStock")}</p>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
      </div>
    </div>
  );
}
