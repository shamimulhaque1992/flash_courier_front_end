"use client";

import { type ChangeEvent, Suspense, useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useDebounce from "@/hooks/debounce.hook";
import type { Shipment, ShipmentParams, ShipmentStatus } from "@/types";
import AdminShipmentTableLoading from "./admin-shipment-table-loading";
import AdminShipmentsTable from "./admin-shipments-table";
import AssignShipmentDialog from "./assign-shipment-dialog";

type StatusTab = "ALL" | ShipmentStatus;

const STATUS_TABS: [StatusTab, string][] = [
  ["ALL", "All"],
  ["PAID", "Paid"],
  ["IN_TRANSIT", "In Transit"],
  ["READY_FOR_ASSIGNMENT", "Ready"],
  ["ASSIGNED", "Assigned"],
  ["ACCEPTED_BY_RIDER", "Accepted"],
  ["REJECTED_BY_RIDER", "Rejected"],
  ["PICKED_UP", "Picked Up"],
  ["OUT_FOR_DELIVERY", "Out for Delivery"],
  ["DELIVERED", "Delivered"],
];

export default function AdminShipmentsTabs() {
  const [tab, setTab] = useState<StatusTab>("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [assignShipment, setAssignShipment] = useState<Shipment | null>(null);

  const debouncedSearch = useDebounce(searchInput);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setPage(1);
  };

  const queryParams: ShipmentParams = {
    page,
    limit: 10,
    ...(tab !== "ALL" ? { shipmentStatus: tab } : {}),
    ...(debouncedSearch ? { searchTerm: debouncedSearch } : {}),
  };

  return (
    <>
      <div className="flex flex-col gap-4 my-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            onChange={handleSearch}
            type="search"
            placeholder="Search by tracking #, receiver name or district…"
            className="sm:max-w-sm"
          />
        </div>
        <div className="overflow-x-auto">
          <Tabs
            value={tab}
            onValueChange={(v) => {
              setTab(v as StatusTab);
              setPage(1);
            }}
          >
            <TabsList>
              {STATUS_TABS.map(([value, label]) => (
                <TabsTrigger key={value} value={value}>
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <Suspense fallback={<AdminShipmentTableLoading />}>
        <AdminShipmentsTable
          {...queryParams}
          handlePageChange={setPage}
          onAssign={setAssignShipment}
        />
      </Suspense>

      <AssignShipmentDialog
        shipment={assignShipment}
        open={!!assignShipment}
        onClose={() => setAssignShipment(null)}
      />
    </>
  );
}
