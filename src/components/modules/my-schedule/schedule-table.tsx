import { useEffect } from "react";
import { SearchX } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSuspenseGetMyRiderSchedules } from "@/hooks/schedule.hook";
import type { DayOfWeek, RiderScheduleParams, RiderScheduleStatus } from "@/types";
import ScheduleActions from "./schedule-actions";

const statusBadge: Record<RiderScheduleStatus, string> = {
  DRAFT: "bg-yellow-100 text-yellow-800",
  PUBLISHED: "bg-green-100 text-green-800",
  COMPLETED: "bg-blue-100 text-blue-800",
  CANCELLED: "bg-gray-100 text-gray-600",
};

function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

interface Props extends RiderScheduleParams {
  onDaysLoaded?: (days: DayOfWeek[]) => void;
}

export default function ScheduleTable({ onDaysLoaded, ...params }: Props) {
  const { data } = useSuspenseGetMyRiderSchedules(params);

  const schedules = data?.data ?? [];
  const existingDays = schedules.map((s) => s.dayOfWeek as DayOfWeek);

  useEffect(() => {
    if (onDaysLoaded) onDaysLoaded(existingDays);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (schedules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border px-6 py-16 text-center">
        <span className="rounded-full bg-muted p-3">
          <SearchX className="size-5 text-muted-foreground" />
        </span>
        <p className="font-medium">No schedules found</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Create a schedule to start receiving shipment assignments.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Day</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Slots</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.map((schedule) => (
            <TableRow key={schedule.id}>
              <TableCell className="font-medium capitalize">
                {schedule.dayOfWeek.charAt(0) + schedule.dayOfWeek.slice(1).toLowerCase()}
              </TableCell>
              <TableCell>{formatTime(schedule.startTime)}</TableCell>
              <TableCell>{formatTime(schedule.endTime)}</TableCell>
              <TableCell>
                {schedule.totalSlots - schedule.availableSlots}/{schedule.totalSlots} assigned
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[schedule.status]}`}
                >
                  {schedule.status}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <ScheduleActions schedule={schedule} existingDays={existingDays} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
