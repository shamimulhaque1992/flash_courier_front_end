import z from "zod";

const SLOT_DURATION_MINUTES = 40;

function diffMinutes(startTime: string, endTime: string) {
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  return eh * 60 + em - (sh * 60 + sm);
}

export const riderScheduleSchema = z
  .object({
    dayOfWeek: z.string().min(1, "Day of week is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
  })
  .refine((v) => v.startTime < v.endTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  })
  .refine((v) => diffMinutes(v.startTime, v.endTime) >= SLOT_DURATION_MINUTES, {
    message: `Schedule must be at least ${SLOT_DURATION_MINUTES} minutes long`,
    path: ["endTime"],
  })
  .refine((v) => diffMinutes(v.startTime, v.endTime) <= 12 * 60, {
    message: "Schedule duration cannot exceed 12 hours",
    path: ["endTime"],
  });

export const updateRiderScheduleSchema = z
  .object({
    dayOfWeek: z.string(),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
  })
  .refine((v) => v.startTime < v.endTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  })
  .refine((v) => diffMinutes(v.startTime, v.endTime) >= SLOT_DURATION_MINUTES, {
    message: `Schedule must be at least ${SLOT_DURATION_MINUTES} minutes long`,
    path: ["endTime"],
  });
