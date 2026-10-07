"use client";

import { useForm } from "@tanstack/react-form";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import TimePicker from "@/components/ui/time-picker";
import { toast } from "@/components/ui/toast";
import {
  useCreateRiderSchedule,
  useUpdateRiderSchedule,
} from "@/hooks/schedule.hook";
import { riderScheduleSchema, updateRiderScheduleSchema } from "@/validation";
import type { DayOfWeek, RiderSchedule } from "@/types";

const DAYS_OF_WEEK: DayOfWeek[] = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editSchedule?: RiderSchedule;
  existingDays?: DayOfWeek[];
  trigger?: React.ReactNode;
}

export default function ScheduleCreateEditDialog({
  open,
  onOpenChange,
  editSchedule,
  existingDays = [],
  trigger,
}: Props) {
  const isEdit = !!editSchedule;

  const { mutate: create, isPending: isCreating } = useCreateRiderSchedule();
  const { mutate: update, isPending: isUpdating } = useUpdateRiderSchedule();

  const isPending = isCreating || isUpdating;

  const form = useForm({
    defaultValues: {
      dayOfWeek: (editSchedule?.dayOfWeek ?? "") as string,
      startTime: editSchedule?.startTime ?? "",
      endTime: editSchedule?.endTime ?? "",
    },
    validators: {
      onSubmit: isEdit ? updateRiderScheduleSchema : riderScheduleSchema,
    },
    onSubmit: ({ value }) => {
      if (isEdit) {
        update(
          {
            scheduleId: editSchedule.id,
            payload: { startTime: value.startTime, endTime: value.endTime },
          },
          {
            onSuccess: (res) => {
              if (!res.success) {
                toast.add({ title: "Failed", description: "Something went wrong.", type: "error" });
                return;
              }
              toast.add({ title: "Schedule Updated", description: "Your schedule has been updated.", type: "success" });
              onOpenChange(false);
            },
            onError: (err) => {
              toast.add({ title: "Update Failed", description: err.message || "Something went wrong.", type: "error" });
            },
          },
        );
      } else {
        create(
          { dayOfWeek: value.dayOfWeek as DayOfWeek, startTime: value.startTime, endTime: value.endTime },
          {
            onSuccess: (res) => {
              if (!res.success) {
                toast.add({ title: "Failed", description: "Something went wrong.", type: "error" });
                return;
              }
              toast.add({ title: "Schedule Created", description: "Schedule saved as draft.", type: "success" });
              onOpenChange(false);
            },
            onError: (err) => {
              toast.add({ title: "Create Failed", description: err.message || "Something went wrong.", type: "error" });
            },
          },
        );
      }
    },
  });

  const handleOpenChange = (val: boolean) => {
    onOpenChange(val);
    if (!val) form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger render={<span />}>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Schedule" : "Create Schedule"}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          noValidate
        >
          <FieldGroup>
            {!isEdit && (
              <form.Field name="dayOfWeek">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Day of Week</FieldLabel>
                      <div className="grid grid-cols-4 gap-2">
                        {DAYS_OF_WEEK.map((day) => {
                          const isDisabled = existingDays.includes(day);
                          const isSelected = field.state.value === day;
                          return (
                            <button
                              key={day}
                              type="button"
                              disabled={isDisabled}
                              onClick={() => {
                                field.handleChange(day);
                                field.handleBlur();
                              }}
                              className={`rounded-md border px-2 py-1.5 text-xs font-medium transition-colors ${
                                isSelected
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : isDisabled
                                    ? "cursor-not-allowed border-muted bg-muted text-muted-foreground opacity-50"
                                    : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
                              }`}
                            >
                              {day.slice(0, 3)}
                            </button>
                          );
                        })}
                      </div>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              </form.Field>
            )}

            {isEdit && (
              <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm">
                <CalendarDays className="size-4 text-muted-foreground" />
                <span className="font-medium">{editSchedule.dayOfWeek}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <form.Field name="startTime">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Start Time</FieldLabel>
                      <TimePicker
                        id={field.name}
                        value={field.state.value}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        isInvalid={isInvalid}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="endTime">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>End Time</FieldLabel>
                      <TimePicker
                        id={field.name}
                        value={field.state.value}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        isInvalid={isInvalid}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              </form.Field>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Spinner /> {isEdit ? "Saving…" : "Creating…"}
                  </>
                ) : isEdit ? (
                  "Save Changes"
                ) : (
                  "Create Schedule"
                )}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
