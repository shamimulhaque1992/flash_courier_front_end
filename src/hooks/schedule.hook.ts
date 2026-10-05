import {
  createRiderSchedule,
  deleteRiderSchedule,
  getAllRiderSchedules,
  getMyRiderSchedules,
  getScheduleSlots,
  publishRiderSchedule,
  updateRiderSchedule,
} from "@/api";
import type { RiderScheduleParams } from "@/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

export function useCreateRiderSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRiderSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-rider-schedules"] });
    },
  });
}

export function useSuspenseGetMyRiderSchedules(params: RiderScheduleParams) {
  return useSuspenseQuery({
    queryKey: ["my-rider-schedules", params],
    queryFn: () => getMyRiderSchedules(params),
  });
}

export function useGetAllRiderSchedules(params: RiderScheduleParams & { riderId?: string }) {
  return useQuery({
    queryKey: ["all-rider-schedules", params],
    queryFn: () => getAllRiderSchedules(params),
    enabled: !!params.riderId,
  });
}

export function useGetScheduleSlots(scheduleId: string) {
  return useQuery({
    queryKey: ["schedule-slots", scheduleId],
    queryFn: () => getScheduleSlots(scheduleId),
    enabled: !!scheduleId,
  });
}

export function useUpdateRiderSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRiderSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-rider-schedules"] });
    },
  });
}

export function usePublishRiderSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publishRiderSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-rider-schedules"] });
    },
  });
}

export function useDeleteRiderSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRiderSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-rider-schedules"] });
    },
  });
}
