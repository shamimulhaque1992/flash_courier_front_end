import {
  createRiderSchedule,
  deleteRiderSchedule,
  getMyRiderSchedules,
  publishRiderSchedule,
  updateRiderSchedule,
} from "@/api";
import type { RiderScheduleParams } from "@/types";
import {
  useMutation,
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
