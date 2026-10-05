"use client";

import { useState } from "react";
import { CheckCircle2, Clock, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useGetAllRiderSchedules, useGetScheduleSlots } from "@/hooks/schedule.hook";
import { useAssignShipment } from "@/hooks/shipment.hook";
import { getAllRiders } from "@/api";
import type { Division, Shipment } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface Props {
  shipment: Shipment | null;
  open: boolean;
  onClose: () => void;
}

function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-BD", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const SLOT_DURATION = 40;

function computeSlots(startTime: string, totalSlots: number, assignmentDate: Date) {
  return Array.from({ length: totalSlots }, (_, i) => {
    const [h, m] = startTime.split(":").map(Number);
    const slotStart = new Date(assignmentDate);
    slotStart.setHours(h, m + i * SLOT_DURATION, 0, 0);
    const slotEnd = new Date(slotStart.getTime() + SLOT_DURATION * 60000);
    return { slotIndex: i, slotStart, slotEnd };
  });
}

function getNextOccurrence(dayOfWeek: string): Date {
  const days = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
  const target = days.indexOf(dayOfWeek);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const current = today.getDay();
  const diff = (target - current + 7) % 7;
  const result = new Date(today);
  result.setDate(today.getDate() + diff);
  return result;
}

export default function AssignShipmentDialog({ shipment, open, onClose }: Props) {
  const [selectedRiderId, setSelectedRiderId] = useState("");
  const [selectedScheduleId, setSelectedScheduleId] = useState("");

  const division = shipment?.receiverDivision as Division | undefined;

  // Step 1: fetch VERIFIED riders in the destination division
  const { data: ridersData, isLoading: ridersLoading } = useQuery({
    queryKey: ["riders-by-division", division],
    queryFn: () =>
      getAllRiders({ division, verificationStatus: "VERIFIED", limit: 50 }),
    enabled: open && !!division,
  });

  // Step 2: fetch PUBLISHED schedules for selected rider
  const { data: schedulesData, isLoading: schedulesLoading } =
    useGetAllRiderSchedules({
      riderId: selectedRiderId,
      status: "PUBLISHED",
      limit: 50,
    });

  // Step 3: fetch slots for selected schedule
  const { data: slotsData, isLoading: slotsLoading } =
    useGetScheduleSlots(selectedScheduleId);

  const { mutate: assign, isPending: isAssigning } = useAssignShipment();

  const riders = ridersData?.data ?? [];
  const schedules = schedulesData?.data ?? [];
  const slotsInfo = slotsData?.data;

  const selectedRider = riders.find((r) => r.id === selectedRiderId);
  const selectedSchedule = schedules.find((s) => s.id === selectedScheduleId);

  const handleAssign = () => {
    if (!shipment || !selectedScheduleId) return;
    assign(
      { shipmentId: shipment.id, scheduleId: selectedScheduleId },
      {
        onSuccess: () => {
          toast.add({
            title: "Shipment Assigned",
            description: `Assigned to ${selectedRider?.name ?? "rider"} successfully.`,
            type: "success",
          });
          handleClose();
        },
        onError: (err) => {
          toast.add({
            title: "Assignment Failed",
            description: err.message || "Something went wrong.",
            type: "error",
          });
        },
      },
    );
  };

  const handleClose = () => {
    setSelectedRiderId("");
    setSelectedScheduleId("");
    onClose();
  };

  if (!shipment) return null;

  const assignmentDate = selectedSchedule
    ? getNextOccurrence(selectedSchedule.dayOfWeek)
    : null;

  const computedSlots =
    selectedSchedule && assignmentDate
      ? computeSlots(
          selectedSchedule.startTime,
          selectedSchedule.totalSlots,
          assignmentDate,
        )
      : [];

  const occupiedSlotIndices = new Set(
    (slotsInfo?.slots ?? [])
      .filter((s) => s.shipment !== null)
      .map((s) => s.slotIndex),
  );

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Shipment to Rider</DialogTitle>
        </DialogHeader>

        {/* Shipment summary */}
        <div className="rounded-lg border bg-muted/40 p-3 text-sm flex flex-col gap-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tracking #</span>
            <span className="font-mono font-medium">{shipment.trackingNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Receiver</span>
            <span>{shipment.receiverName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Destination</span>
            <span>
              {shipment.receiverDistrict},{" "}
              <span className="capitalize">
                {shipment.receiverDivision.toLowerCase()}
              </span>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fee</span>
            <span className="font-medium">{shipment.deliveryFee} BDT</span>
          </div>
        </div>

        {/* Step 1: Select Rider */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-1">
            <Users className="size-3" />
            Step 1 — Select a Rider ({division})
          </p>
          {ridersLoading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : riders.length === 0 ? (
            <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
              No verified riders found in{" "}
              <span className="capitalize font-medium">
                {division?.toLowerCase()}
              </span>{" "}
              division.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {riders.map((rider) => (
                <button
                  key={rider.id}
                  type="button"
                  onClick={() => {
                    setSelectedRiderId(rider.id);
                    setSelectedScheduleId("");
                  }}
                  className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-colors hover:bg-muted/60 ${
                    selectedRiderId === rider.id
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{rider.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {rider.vehicleType} · {rider.district},{" "}
                      <span className="capitalize">
                        {rider.division.toLowerCase()}
                      </span>
                    </span>
                  </div>
                  {selectedRiderId === rider.id && (
                    <CheckCircle2 className="size-4 text-primary shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Step 2: Select Schedule */}
        {selectedRiderId && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-1">
              <Clock className="size-3" />
              Step 2 — Select a Published Schedule
            </p>
            {schedulesLoading ? (
              <div className="flex flex-col gap-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-lg" />
                ))}
              </div>
            ) : schedules.length === 0 ? (
              <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                {selectedRider?.name} has no published schedules.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {schedules.map((schedule) => {
                  const hasSlots = schedule.availableSlots > 0;
                  return (
                    <button
                      key={schedule.id}
                      type="button"
                      disabled={!hasSlots}
                      onClick={() => setSelectedScheduleId(schedule.id)}
                      className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                        !hasSlots
                          ? "cursor-not-allowed opacity-50"
                          : "hover:bg-muted/60"
                      } ${
                        selectedScheduleId === schedule.id
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium capitalize">
                          {schedule.dayOfWeek.charAt(0) +
                            schedule.dayOfWeek.slice(1).toLowerCase()}
                          {" · "}
                          {formatTime(schedule.startTime)} –{" "}
                          {formatTime(schedule.endTime)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {schedule.availableSlots}/{schedule.totalSlots} slots
                          available · {SLOT_DURATION} min/slot
                        </span>
                      </div>
                      {selectedScheduleId === schedule.id && (
                        <CheckCircle2 className="size-4 text-primary shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Show slots */}
        {selectedScheduleId && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Step 3 — Slot Preview
            </p>
            {slotsLoading ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {computedSlots.map(({ slotIndex, slotStart, slotEnd }) => {
                  const isOccupied = occupiedSlotIndices.has(slotIndex);
                  const isNext =
                    !isOccupied &&
                    slotIndex ===
                      (selectedSchedule!.totalSlots -
                        selectedSchedule!.availableSlots);
                  return (
                    <div
                      key={slotIndex}
                      className={`rounded-lg border p-2 text-xs flex flex-col gap-0.5 ${
                        isOccupied
                          ? "border-red-200 bg-red-50 text-red-700"
                          : isNext
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border bg-muted/30 text-muted-foreground"
                      }`}
                    >
                      <span className="font-medium">
                        Slot {slotIndex + 1}
                        {isNext && " ← next"}
                      </span>
                      <span>
                        {slotStart.toLocaleTimeString("en-BD", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        –{" "}
                        {slotEnd.toLocaleTimeString("en-BD", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="font-medium">
                        {isOccupied ? "Occupied" : isNext ? "Will assign" : "Free"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
            {assignmentDate && selectedSchedule && (
              <p className="text-xs text-muted-foreground">
                Next occurrence:{" "}
                <span className="font-medium">
                  {assignmentDate.toLocaleDateString("en-BD", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedScheduleId || isAssigning}
          >
            {isAssigning ? (
              <>
                <Spinner /> Assigning…
              </>
            ) : (
              "Assign Shipment"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
