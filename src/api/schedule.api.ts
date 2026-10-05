import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  CreateRiderSchedulePayload,
  RiderSchedule,
  RiderScheduleParams,
  UpdateRiderSchedulePayload,
} from "@/types";

export function createRiderSchedule(payload: CreateRiderSchedulePayload) {
  return apiClient<ApiResponse<RiderSchedule>>(
    "/rider-schedules/create-schedule",
    { method: "POST", body: payload },
  );
}

export function getMyRiderSchedules(params: RiderScheduleParams) {
  return apiClient<ApiResponse<RiderSchedule[]>>(
    "/rider-schedules/my-schedules",
    { params },
  );
}

export function updateRiderSchedule({
  scheduleId,
  payload,
}: {
  scheduleId: string;
  payload: UpdateRiderSchedulePayload;
}) {
  return apiClient<ApiResponse<RiderSchedule>>(
    `/rider-schedules/update-schedule/${scheduleId}`,
    { method: "PATCH", body: payload },
  );
}

export function publishRiderSchedule(scheduleId: string) {
  return apiClient<ApiResponse<RiderSchedule>>(
    `/rider-schedules/publish-schedule/${scheduleId}`,
    { method: "PATCH" },
  );
}

export function deleteRiderSchedule(scheduleId: string) {
  return apiClient<ApiResponse<RiderSchedule>>(
    `/rider-schedules/${scheduleId}`,
    { method: "DELETE" },
  );
}
