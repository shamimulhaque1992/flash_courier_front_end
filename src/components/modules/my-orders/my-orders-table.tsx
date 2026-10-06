"use client";

import { format } from "date-fns";
import { SearchX } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { useSuspenseGetCustomerShipments } from "@/hooks/shipment.hook";
import type { ShipmentParams, ShipmentStatus } from "@/types";

interface Props extends ShipmentParams {
  handlePageChange: Dispatch<SetStateAction<number>>;
}

const STATUS_BADGE: Record<ShipmentStatus, string> = {
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

export default function MyOrdersTable({ handlePageChange, ...params }: Props) {
  const { data } = useSuspenseGetCustomerShipments(params);
  const router = useRouter();

  const shipments = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;
  const isEmpty = shipments.length === 0;

  return (
    <>
      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Tracking #</TableHead>
              <TableHead>From</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Date</TableHead>
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
                    <p className="font-medium">No orders found</p>
                    <p className="max-w-sm text-sm text-muted-foreground">
                      {params.searchTerm
                        ? `No results for "${params.searchTerm}".`
                        : "No orders addressed to you yet."}
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
                  <TableCell className="text-sm">
                    <span className="capitalize">
                      {shipment.merchant?.division?.toLowerCase() ?? "—"}
                    </span>
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
                    {format(new Date(shipment.createdAt), "PP")}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[shipment.shipmentStatus]}`}
                    >
                      {formatStatus(shipment.shipmentStatus)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const params = new URLSearchParams({ q: shipment.trackingNumber });
                        router.push(`/track?${params.toString()}`);
                      }}
                    >
                      Track
                    </Button>
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
