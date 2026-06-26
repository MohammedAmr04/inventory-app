import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layouts/page-header";
import { ROUTES } from "@/constants";
import Link from "next/link";
import { DashboardCards } from "@/features/reports/components";

export default async function ReportsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "reports" });

  const links = [
    { href: `${ROUTES.REPORTS}/sales`, label: "Sales Reports", desc: "Daily, monthly sales & trends" },
    { href: `${ROUTES.REPORTS}/products`, label: "Product Reports", desc: "Top sellers, profits, dead stock" },
    { href: `${ROUTES.REPORTS}/profit-loss`, label: "Profit & Loss", desc: "Revenue, COGS, net profit" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} />
      <DashboardCards />
      <div className="grid gap-4 sm:grid-cols-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg border p-6 transition-colors hover:bg-accent"
          >
            <h3 className="font-semibold">{link.label}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{link.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
