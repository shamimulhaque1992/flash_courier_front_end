"use client";

import { SearchX, RotateCcw, XCircle } from "lucide-react";
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
import { useSuspenseGetMyShipments, useRepayShipment, useCancelShipment } from "@/hooks";
import type { ShipmentParams, ShipmentStatus } from "@/types";
import { toast } from "@/components/ui/toast";

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

const formatStatus = (status: ShipmentStatus) =>
  status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

const CANCELLABLE_STATUSES: ShipmentStatus[] = [
  "PENDING_PAYMENT",
  "PAID",
  "READY_FOR_ASSIGNMENT",
  "REJECTED_BY_RIDER",
];

export default function MyShipmentsTable({ handlePageChange, ...params }: Props) {
  const { data } = useSuspenseGetMyShipments(params);
  const { mutate: repay, isPending: isRepaying } = useRepayShipment();
  const { mutate: cancel, isPending: isCancelling } = useCancelShipment();

  const shipments = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;
  const isEmpty = shipments.length === 0;

  const handleRepay = (shipmentId: string) => {
    repay(shipmentId, {
      onSuccess: (res) => {
        if (res.data?.bkashURL) {
          window.location.href = res.data.bkashURL;
        }
      },
      onError: (err) => {
        toast.add({ title: "Repay Failed", description: err.message, type: "error" });
      },
    });
  };

  const handleCancel = (shipmentId: string) => {
    cancel(shipmentId, {
      onSuccess: () => {
        toast.add({ title: "Shipment Cancelled", description: "Your shipment has been cancelled.", type: "success" });
      },
      onError: (err) => {
        toast.add({ title: "Cancel Failed", description: err.message, type: "error" });
      },
    });
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
              <TableHead>Weight</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isEmpty ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={8}>
                  <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
                    <span className="rounded-full bg-muted p-3">
                      <SearchX className="size-5 text-muted-foreground" />
                    </span>
                    <p className="font-medium">No shipments found</p>
                    <p className="max-w-sm text-sm text-muted-foreground">
                      {params.searchTerm
                        ? `No results for "${params.searchTerm}".`
                        : "You haven't created any shipments yet."}
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
                      <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                        {shipment.receiverEmail}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {shipment.receiverDistrict},{" "}
                    <span className="capitalize">
                      {shipment.receiverDivision.toLowerCase()}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {shipment.packageWeight} kg
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
                            : shipment.paymentStatus === "FAILED"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {shipment.paymentStatus}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {shipment.shipmentStatus === "PENDING_PAYMENT" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRepay(shipment.id)}
                          disabled={isRepaying}
                        >
                          <RotateCcw className="size-3" />
                          Pay
                        </Button>
                      )}
                      {CANCELLABLE_STATUSES.includes(shipment.shipmentStatus) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancel(shipment.id)}
                          disabled={isCancelling}
                          className="text-destructive hover:text-destructive"
                        >
                          <XCircle className="size-3" />
                          Cancel
                        </Button>
                      )}
                    </div>
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
