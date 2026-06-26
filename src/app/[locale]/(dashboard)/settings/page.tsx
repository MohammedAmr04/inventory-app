import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layouts/page-header";
import { SettingsSection } from "./_components/settings-section";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "settings" });

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} />
      <SettingsSection />
    </div>
  );
}
