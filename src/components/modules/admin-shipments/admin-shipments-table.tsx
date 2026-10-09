"use client";

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
  useSuspenseGetAllShipments,
  useUpdateShipmentStatus,
} from "@/hooks/shipment.hook";
import type { Shipment, ShipmentParams, ShipmentStatus } from "@/types";
import { toast } from "@/components/ui/toast";

interface Props extends ShipmentParams {
  handlePageChange: Dispatch<SetStateAction<number>>;
  onAssign: (shipment: Shipment) => void;
}

const shipmentStatusBadge: Record<ShipmentStatus, string> = {
  PENDING_PAYMENT: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  READY_FOR_ASSIGNMENT: "bg-purple-100 text-purple-800",
  ASSIGNED: "bg-indigo-100 text-indigo-800",
  ACCEPTED_BY_RIDER: "bg-cyan-100 text-cyan-800",
  REJECTED_BY_RIDER: "bg-red-100 text-red-800",
  PICKED_UP: "bg-[#007595]/10 text-[#007595]",
  IN_TRANSIT: "bg-sky-100 text-sky-800",
  OUT_FOR_DELIVERY: "bg-teal-100 text-teal-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED_BY_MERCHANT: "bg-gray-100 text-gray-600",
};

const formatStatus = (s: string) =>
  s
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

function ShipmentActionCell({
  shipment,
  onAssign,
  onStatusUpdate,
  isPending,
}: {
  shipment: Shipment;
  onAssign: (s: Shipment) => void;
  onStatusUpdate: (id: string, status: ShipmentStatus) => void;
  isPending: boolean;
}) {
  const isInterDivision =
    shipment.merchant?.division &&
    shipment.merchant.division !== shipment.receiverDivision;

  const { shipmentStatus: status } = shipment;

  // Inter-division: PAID → Mark In Transit button
  if (status === "PAID" && isInterDivision) {
    return (
      <Button
        size="sm"
        variant="outline"
        disabled={isPending}
        onClick={() => onStatusUpdate(shipment.id, "IN_TRANSIT")}
      >
        Mark In Transit
      </Button>
    );
  }

  // Intra-division: PAID → Assign Rider button
  if (status === "PAID" && !isInterDivision) {
    return (
      <Button size="sm" disabled={isPending} onClick={() => onAssign(shipment)}>
        Assign Rider
      </Button>
    );
  }

  // Inter-division: IN_TRANSIT → Ready for Assignment button
  if (status === "IN_TRANSIT") {
    return (
      <Button
        size="sm"
        variant="outline"
        disabled={isPending}
        onClick={() => onStatusUpdate(shipment.id, "READY_FOR_ASSIGNMENT")}
      >
        Ready for Assignment
      </Button>
    );
  }

  // READY_FOR_ASSIGNMENT → Assign Rider button
  if (status === "READY_FOR_ASSIGNMENT") {
    return (
      <Button size="sm" disabled={isPending} onClick={() => onAssign(shipment)}>
        Assign Rider
      </Button>
    );
  }

  // REJECTED_BY_RIDER → Re-assign button
  if (status === "REJECTED_BY_RIDER") {
    return (
      <Button size="sm" disabled={isPending} onClick={() => onAssign(shipment)}>
        Re-assign
      </Button>
    );
  }

  // ACCEPTED_BY_RIDER → Mark Picked Up
  if (status === "ACCEPTED_BY_RIDER") {
    return (
      <Button
        size="sm"
        variant="outline"
        disabled={isPending}
        onClick={() => onStatusUpdate(shipment.id, "PICKED_UP")}
      >
        Mark Picked Up
      </Button>
    );
  }

  // PICKED_UP → Mark Out for Delivery
  if (status === "PICKED_UP") {
    return (
      <Button
        size="sm"
        variant="outline"
        disabled={isPending}
        onClick={() => onStatusUpdate(shipment.id, "OUT_FOR_DELIVERY")}
      >
        Out for Delivery
      </Button>
    );
  }

  return <span className="text-xs text-muted-foreground">—</span>;
}

export default function AdminShipmentsTable({
  handlePageChange,
  onAssign,
  ...params
}: Props) {
  const { data } = useSuspenseGetAllShipments(params);
  const { mutate: updateStatus, isPending } = useUpdateShipmentStatus();

  const shipments = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;
  const isEmpty = shipments.length === 0;

  const handleStatusUpdate = (shipmentId: string, status: ShipmentStatus) => {
    updateStatus(
      { shipmentId, status },
      {
        onSuccess: () =>
          toast.add({
            title: "Status Updated",
            description: `Shipment moved to ${formatStatus(status)}.`,
            type: "success",
          }),
        onError: (err) =>
          toast.add({
            title: "Update Failed",
            description: err.message,
            type: "error",
          }),
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
              <TableHead>Merchant</TableHead>
              <TableHead>Receiver</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isEmpty ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={9}>
                  <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
                    <span className="rounded-full bg-muted p-3">
                      <SearchX className="size-5 text-muted-foreground" />
                    </span>
                    <p className="font-medium">No shipments found</p>
                    <p className="max-w-sm text-sm text-muted-foreground">
                      {params.searchTerm
                        ? `No results for "${params.searchTerm}".`
                        : "No shipments in this view yet."}
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
                      <span className="font-medium">
                        {shipment.merchant?.name ?? "—"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {shipment.merchant?.email ?? ""}
                      </span>
                      {shipment.merchant?.division && (
                        <span className="text-xs text-muted-foreground capitalize">
                          {shipment.merchant.division.toLowerCase()}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {shipment.receiverName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {shipment.receiverEmail}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {shipment.receiverDistrict},{" "}
                        {shipment.receiverDivision.toLowerCase()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    <span className="capitalize">
                      {shipment.merchant?.division?.toLowerCase()}
                    </span>
                    <span className="mx-1">→</span>
                    <span className="capitalize">
                      {shipment.receiverDivision.toLowerCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    {shipment.merchant?.division ? (
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          shipment.merchant.division !==
                          shipment.receiverDivision
                            ? "bg-[#007595]/10 text-[#007595]"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {shipment.merchant.division !==
                        shipment.receiverDivision
                          ? "Inter Division"
                          : "Intra Division"}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {shipment.deliveryFee} BDT
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${shipmentStatusBadge[shipment.shipmentStatus] ?? ""}`}
                    >
                      {formatStatus(shipment.shipmentStatus)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        shipment.paymentStatus === "PAID"
                          ? "bg-green-100 text-green-800"
                          : shipment.paymentStatus === "REFUNDED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {shipment.paymentStatus}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <ShipmentActionCell
                      shipment={shipment}
                      onAssign={onAssign}
                      onStatusUpdate={handleStatusUpdate}
                      isPending={isPending}
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
    </>
  );
}
