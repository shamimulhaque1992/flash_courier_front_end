"use client";

import { type ChangeEvent, Suspense, useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useDebounce from "@/hooks/debounce.hook";
import type { PaymentParams } from "@/api/payment.api";
import PaymentsTableLoading from "./payments-table-loading";
import PaymentsTable from "./payments-table";

type StatusTab = "ALL" | "PENDING" | "PAID" | "FAILED" | "REFUNDED";

const STATUS_TABS: [StatusTab, string][] = [
  ["ALL", "All"],
  ["PENDING", "Pending"],
  ["PAID", "Paid"],
  ["FAILED", "Failed"],
  ["REFUNDED", "Refunded"],
];

export default function PaymentsTabs({ role }: { role: "admin" | "merchant" }) {
  const [tab, setTab] = useState<StatusTab>("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(searchInput);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setPage(1);
  };

  const queryParams: PaymentParams = {
    page,
    limit: 10,
    ...(tab !== "ALL" ? { status: tab } : {}),
    ...(debouncedSearch ? { searchTerm: debouncedSearch } : {}),
  };

  return (
    <>
      <div className="flex flex-col gap-4 my-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            onChange={handleSearch}
            type="search"
            placeholder="Search by tracking # or Trx ID…"
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

      <Suspense fallback={<PaymentsTableLoading role={role} />}>
        <PaymentsTable {...queryParams} role={role} handlePageChange={setPage} />
      </Suspense>
    </>
  );
}
