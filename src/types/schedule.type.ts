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
    district?: string;
    vehicleType?: string;
  };
}

export interface ScheduleSlot {
  slotIndex: number;
  probableDeliveryTime: string;
  shipment: {
    id: string;
    trackingNumber: string;
    receiverName: string;
    receiverDistrict: string;
    receiverDivision: string;
    shipmentStatus: string;
    probableDeliveryTime: string | null;
  } | null;
}

export interface RiderScheduleWithSlots extends RiderSchedule {
  scheduleId: string;
  slots: ScheduleSlot[];
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
