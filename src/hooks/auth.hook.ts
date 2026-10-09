import {
  type QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getMe,
  googleOAuth,
  userLogin,
  userLogout,
  userRegistration,
  verifyAccount,
} from "@/api";

async function refreshUserQuery(queryClient: QueryClient) {
  await queryClient.cancelQueries({ queryKey: ["user"] });
  await queryClient.invalidateQueries({ queryKey: ["user"] });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userLogin,
    onSuccess: () => refreshUserQuery(queryClient),
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: userLogout,
  });
}

export function useRegistration() {
  return useMutation({
    mutationFn: userRegistration,
  });
}

export function useVerifyAccount() {
  return useMutation({
    mutationFn: verifyAccount,
  });
}

export function useGoogleOAuth() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: googleOAuth,
    onSuccess: () => refreshUserQuery(queryClient),
  });
}

export function useGetMe() {
  return useQuery({
    queryKey: ["user"],
    queryFn: ({ signal }) => getMe(signal),
    retry: false,
  });
}
