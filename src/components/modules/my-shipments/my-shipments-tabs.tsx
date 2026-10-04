"use client";

import { type ChangeEvent, Suspense, useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useDebounce from "@/hooks/debounce.hook";
import type { ShipmentParams, ShipmentStatus } from "@/types";
import ShipmentTableLoading from "./shipment-table-loading";
import MyShipmentsTable from "./my-shipments-table";
import CreateShipmentDialog from "./create-shipment-dialog";

type StatusTab = "ALL" | ShipmentStatus;

const STATUS_TABS: [StatusTab, string][] = [
  ["ALL", "All"],
  ["PENDING_PAYMENT", "Pending Payment"],
  ["PAID", "Paid"],
  ["ASSIGNED", "Assigned"],
  ["DELIVERED", "Delivered"],
  ["CANCELLED_BY_MERCHANT", "Cancelled"],
];

export default function MyShipmentsTabs() {
  const [tab, setTab] = useState<StatusTab>("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between my-5">
        <div className="flex items-center gap-3">
          <Input
            onChange={handleSearch}
            type="search"
            placeholder="Search by tracking number or receiver…"
            className="sm:max-w-xs"
          />
        </div>
        <div className="flex items-center gap-3">
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
          <CreateShipmentDialog />
        </div>
      </div>

      <Suspense fallback={<ShipmentTableLoading />}>
        <MyShipmentsTable {...queryParams} handlePageChange={setPage} />
      </Suspense>
    </>
  );
}
