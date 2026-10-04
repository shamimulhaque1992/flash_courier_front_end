"use client";

import { type ChangeEvent, Suspense, useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useDebounce from "@/hooks/debounce.hook";
import type { MerchantParams, MerchantVerificationStatus } from "@/types";
import ApplicationTableLoading from "../merchant-requests/merchant-table-loading";
import MerchantRequestsTable from "./merchant-requests-table";
import MerchantReviewSheet from "./merchant-review-sheet";

const STATUS_TABS: ["ALL" | MerchantVerificationStatus, string][] = [
  ["PENDING", "Pending"],
  ["VERIFIED", "Verified"],
  ["REJECTED", "Rejected"],
  ["ALL", "All"],
];

export default function MerchantRequestsTabs() {
  const [tab, setTab] = useState<"ALL" | MerchantVerificationStatus>("PENDING");
  const [selectedId, setSelectedId] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(searchInput);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setPage(1);
  };

  const queryParams: MerchantParams = {
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
          placeholder="Search by name, email or business type…"
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

      <Suspense fallback={<ApplicationTableLoading />}>
        <MerchantRequestsTable
          {...queryParams}
          handleReview={setSelectedId}
          handlePageChange={setPage}
        />
      </Suspense>

      <MerchantReviewSheet
        selectedId={selectedId}
        onClose={() => setSelectedId("")}
      />
    </>
  );
}
