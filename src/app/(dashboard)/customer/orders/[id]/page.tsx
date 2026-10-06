import ShipmentDetailView from "@/components/modules/my-orders/shipment-detail-view";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export default async function ShipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ShipmentDetailView shipmentId={id} />;
}
