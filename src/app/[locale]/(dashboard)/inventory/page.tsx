import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layouts/page-header";
import { ROUTES } from "@/constants";

export default async function InventoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "inventory" });

  const links = [
    { href: `${ROUTES.INVENTORY}/products`, label: t("products") },
    { href: `${ROUTES.INVENTORY}/categories`, label: t("categories") },
    { href: `${ROUTES.INVENTORY}/units`, label: t("units") },
    { href: `${ROUTES.INVENTORY}/stock-adjustments`, label: t("stockAdjustment") },
    { href: `${ROUTES.INVENTORY}/low-stock`, label: t("lowStock") },
  ];

  return (
    <div>
      <PageHeader title={t("title")} description={t("description")} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg border p-6 transition-colors hover:bg-accent"
          >
            <h3 className="font-semibold">{link.label}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
