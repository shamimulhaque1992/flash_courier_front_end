export type RiderScheduleStatus = "DRAFT" | "PUBLISHED" | "COMPLETED" | "CANCELLED";

export type DayOfWeek =
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";

export interface RiderSchedule {
  id: string;
  riderId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  totalSlots: number;
  availableSlots: number;
  status: RiderScheduleStatus;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  rider?: {
    name: string;
    email: string;
    division?: string;
  };
}

export interface CreateRiderSchedulePayload {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}

export interface UpdateRiderSchedulePayload {
  startTime?: string;
  endTime?: string;
}

export interface RiderScheduleParams {
  status?: RiderScheduleStatus;
  dayOfWeek?: DayOfWeek;
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
