"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { usePublishRiderSchedule, useDeleteRiderSchedule } from "@/hooks/schedule.hook";
import type { RiderSchedule } from "@/types";
import ScheduleCreateEditDialog from "./schedule-create-edit-dialog";

interface Props {
  schedule: RiderSchedule;
  existingDays: import("@/types").DayOfWeek[];
}

export default function ScheduleActions({ schedule, existingDays }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { mutate: publish, isPending: isPublishing } = usePublishRiderSchedule();
  const { mutate: remove, isPending: isDeleting } = useDeleteRiderSchedule();

  const hasAssignedShipments = schedule.totalSlots !== schedule.availableSlots;
  const isCompleted = schedule.status === "COMPLETED";
  const isCancelled = schedule.status === "CANCELLED";
  const isPublished = schedule.status === "PUBLISHED";
  const isDraft = schedule.status === "DRAFT";

  const canEdit = !isCompleted && !isCancelled && !(isPublished && hasAssignedShipments);
  const canDelete = !isCompleted && !(isPublished && hasAssignedShipments);
  const canPublish = isDraft;

  const handlePublish = () => {
    publish(schedule.id, {
      onSuccess: (res) => {
        if (!res.success) {
          toast.add({ title: "Failed", description: "Something went wrong.", type: "error" });
          return;
        }
        toast.add({ title: "Schedule Published", description: "Shipments can now be assigned to this schedule.", type: "success" });
      },
      onError: (err) => {
        toast.add({ title: "Publish Failed", description: err.message || "Something went wrong.", type: "error" });
      },
    });
  };

  const handleDelete = () => {
    remove(schedule.id, {
      onSuccess: (res) => {
        if (!res.success) {
          toast.add({ title: "Failed", description: "Something went wrong.", type: "error" });
          return;
        }
        toast.add({ title: "Schedule Deleted", description: "Schedule removed successfully.", type: "success" });
        setConfirmDelete(false);
      },
      onError: (err) => {
        toast.add({ title: "Delete Failed", description: err.message || "Something went wrong.", type: "error" });
        setConfirmDelete(false);
      },
    });
  };

  if (confirmDelete) {
    return (
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => setConfirmDelete(false)}>
          Cancel
        </Button>
        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? "Deleting…" : "Confirm Delete"}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end gap-2">
        {canPublish && (
          <Button size="sm" onClick={handlePublish} disabled={isPublishing}>
            {isPublishing ? "Publishing…" : "Publish"}
          </Button>
        )}
        {canEdit && (
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            Edit
          </Button>
        )}
        {canDelete && (
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setConfirmDelete(true)}
          >
            Delete
          </Button>
        )}
      </div>

      <ScheduleCreateEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        editSchedule={schedule}
        existingDays={existingDays}
      />
    </>
  );
}
