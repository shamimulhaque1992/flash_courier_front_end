"use client";

import { type ChangeEvent, Suspense, useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useDebounce from "@/hooks/debounce.hook";
import type { RiderParams, RiderVerificationStatus } from "@/types";
import RiderTableLoading from "./rider-table-loading";
import RiderRequestsTable from "./rider-requests-table";
import RiderReviewSheet from "./rider-review-sheet";

const STATUS_TABS: ["ALL" | RiderVerificationStatus, string][] = [
  ["PENDING", "Pending"],
  ["VERIFIED", "Verified"],
  ["REJECTED", "Rejected"],
  ["ALL", "All"],
];

export default function RiderRequestsTabs() {
  const [tab, setTab] = useState<"ALL" | RiderVerificationStatus>("PENDING");
  const [selectedId, setSelectedId] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(searchInput);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setPage(1);
  };

  const queryParams: RiderParams = {
    page,
    limit: 10,
    ...(tab !== "ALL" ? { verificationStatus: tab } : {}),
    ...(debouncedSearch ? { searchTerm: debouncedSearch } : {}),
  };

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between my-5">
        <Input
          onChange={handleSearch}
          type="search"
          placeholder="Search by name, email or vehicle type…"
          className="sm:max-w-xs"
        />
        <Tabs value={tab} onValueChange={(v) => { setTab(v as typeof tab); setPage(1); }}>
          <TabsList>
            {STATUS_TABS.map(([value, label]) => (
              <TabsTrigger key={value} value={value}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <Suspense fallback={<RiderTableLoading />}>
        <RiderRequestsTable
          {...queryParams}
          handleReview={setSelectedId}
          handlePageChange={setPage}
        />
      </Suspense>

      <RiderReviewSheet
        selectedId={selectedId}
        onClose={() => setSelectedId("")}
      />
    </>
  );
}
