import { getTranslations } from "next-intl/server";
import { SaleInvoiceDetail } from "../../_components/sale-invoice-detail";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function PosInvoiceDetailPage({ params }: Props) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "pos" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("invoiceDetails")}</h1>
        <p className="text-muted-foreground">
          {t("invoiceDetailsDescription")}
        </p>
      </div>
      <SaleInvoiceDetail id={Number(id)} />
    </div>
  );
}
