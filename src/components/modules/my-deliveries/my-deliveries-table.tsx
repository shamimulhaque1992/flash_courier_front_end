"use client";

import { useState } from "react";
import { format } from "date-fns";
import { SearchX } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "@/components/ui/table-pagination";
import {
  useSuspenseGetMyRiderShipments,
  useRespondToShipment,
} from "@/hooks/shipment.hook";
import type { Shipment, ShipmentParams, ShipmentStatus } from "@/types";
import { toast } from "@/components/ui/toast";
import DeliverOtpDialog from "./deliver-otp-dialog";

interface Props extends ShipmentParams {
  handlePageChange: Dispatch<SetStateAction<number>>;
}

const shipmentStatusBadge: Record<ShipmentStatus, string> = {
  PENDING_PAYMENT: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  READY_FOR_ASSIGNMENT: "bg-purple-100 text-purple-800",
  ASSIGNED: "bg-indigo-100 text-indigo-800",
  ACCEPTED_BY_RIDER: "bg-cyan-100 text-cyan-800",
  REJECTED_BY_RIDER: "bg-red-100 text-red-800",
  PICKED_UP: "bg-orange-100 text-orange-800",
  IN_TRANSIT: "bg-sky-100 text-sky-800",
  OUT_FOR_DELIVERY: "bg-teal-100 text-teal-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED_BY_MERCHANT: "bg-gray-100 text-gray-600",
};

const formatStatus = (s: string) =>
  s.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

function ActionCell({
  shipment,
  onDeliver,
  isPending,
  onRespond,
}: {
  shipment: Shipment;
  onDeliver: (s: Shipment) => void;
  isPending: boolean;
  onRespond: (id: string, status: "ACCEPTED_BY_RIDER" | "REJECTED_BY_RIDER") => void;
}) {
  const { shipmentStatus } = shipment;

  if (shipmentStatus === "ASSIGNED") {
    return (
      <div className="flex items-center justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={isPending}
          onClick={() => onRespond(shipment.id, "REJECTED_BY_RIDER")}
        >
          Reject
        </Button>
        <Button
          size="sm"
          disabled={isPending}
          onClick={() => onRespond(shipment.id, "ACCEPTED_BY_RIDER")}
        >
          Accept
        </Button>
      </div>
    );
  }

  if (shipmentStatus === "OUT_FOR_DELIVERY") {
    return (
      <div className="flex justify-end">
        <Button size="sm" onClick={() => onDeliver(shipment)}>
          Mark as Delivered
        </Button>
      </div>
    );
  }

  return <span className="text-xs text-muted-foreground">—</span>;
}

export default function MyDeliveriesTable({ handlePageChange, ...params }: Props) {
  const { data } = useSuspenseGetMyRiderShipments(params);
  const { mutate: respond, isPending } = useRespondToShipment();
  const [deliverShipment, setDeliverShipment] = useState<Shipment | null>(null);

  const shipments = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;
  const isEmpty = shipments.length === 0;

  const handleRespond = (
    shipmentId: string,
    status: "ACCEPTED_BY_RIDER" | "REJECTED_BY_RIDER",
  ) => {
    respond(
      { shipmentId, status },
      {
        onSuccess: () =>
          toast.add({
            title: status === "ACCEPTED_BY_RIDER" ? "Accepted" : "Rejected",
            description: `Shipment ${status === "ACCEPTED_BY_RIDER" ? "accepted" : "rejected"} successfully.`,
            type: "success",
          }),
        onError: (err) =>
          toast.add({ title: "Failed", description: err.message, type: "error" }),
      },
    );
  };

  return (
    <>
      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Tracking #</TableHead>
              <TableHead>Receiver</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Probable Delivery</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isEmpty ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={7}>
                  <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
                    <span className="rounded-full bg-muted p-3">
                      <SearchX className="size-5 text-muted-foreground" />
                    </span>
                    <p className="font-medium">No deliveries found</p>
                    <p className="max-w-sm text-sm text-muted-foreground">
                      {params.searchTerm
                        ? `No results for "${params.searchTerm}".`
                        : "No deliveries assigned to you yet."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              shipments.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell className="font-mono text-xs font-medium">
                    {shipment.trackingNumber}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{shipment.receiverName}</span>
                      <span className="text-xs text-muted-foreground">
                        {shipment.receiverContactNumber}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="flex flex-col">
                      <span>{shipment.receiverDistrict}</span>
                      <span className="capitalize text-xs">
                        {shipment.receiverDivision.toLowerCase()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {shipment.deliveryFee} BDT
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {shipment.probableDeliveryTime
                      ? format(new Date(shipment.probableDeliveryTime), "PPp")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${shipmentStatusBadge[shipment.shipmentStatus] ?? ""}`}
                    >
                      {formatStatus(shipment.shipmentStatus)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <ActionCell
                      shipment={shipment}
                      onDeliver={setDeliverShipment}
                      isPending={isPending}
                      onRespond={handleRespond}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="my-5">
          <TablePagination
            page={params.page ?? 1}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </div>
      )}

      <DeliverOtpDialog
        shipmentId={deliverShipment?.id ?? null}
        trackingNumber={deliverShipment?.trackingNumber ?? ""}
        onClose={() => setDeliverShipment(null)}
      />
    </>
  );
}
