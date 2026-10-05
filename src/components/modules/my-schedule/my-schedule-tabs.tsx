"use client";

import { type ChangeEvent, Suspense, useState } from "react";
import { CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useDebounce from "@/hooks/debounce.hook";
import type { RiderScheduleParams, RiderScheduleStatus } from "@/types";
import ScheduleTableLoading from "./schedule-table-loading";
import ScheduleTable from "./schedule-table";
import ScheduleCreateEditDialog from "./schedule-create-edit-dialog";

type StatusTab = "ALL" | RiderScheduleStatus;

const STATUS_TABS: [StatusTab, string][] = [
  ["ALL", "All"],
  ["DRAFT", "Draft"],
  ["PUBLISHED", "Published"],
  ["COMPLETED", "Completed"],
  ["CANCELLED", "Cancelled"],
];

export default function MyScheduleTabs() {
  const [tab, setTab] = useState<StatusTab>("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [existingDays, setExistingDays] = useState<import("@/types").DayOfWeek[]>([]);

  const debouncedSearch = useDebounce(searchInput);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const queryParams: RiderScheduleParams = {
    limit: 100,
    sortBy: "dayOfWeek",
    sortOrder: "asc",
    ...(tab !== "ALL" ? { status: tab } : {}),
    ...(debouncedSearch ? { searchTerm: debouncedSearch } : {}),
  };

  return (
    <>
      <div className="my-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Input
            onChange={handleSearch}
            type="search"
            placeholder="Search schedules…"
            className="sm:max-w-xs"
          />
        </div>
        <div className="flex items-center gap-3">
          <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as StatusTab)}
          >
            <TabsList>
              {STATUS_TABS.map(([value, label]) => (
                <TabsTrigger key={value} value={value}>
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Button onClick={() => setCreateOpen(true)}>
            <CalendarPlus className="size-4" />
            Create Schedule
          </Button>
        </div>
      </div>

      <Suspense fallback={<ScheduleTableLoading />}>
        <ScheduleTable {...queryParams} onDaysLoaded={setExistingDays} />
      </Suspense>

      <ScheduleCreateEditDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        existingDays={existingDays}
      />
    </>
  );
}
