import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { authApi } from '@/features/auth/api/auth-api';
import { queryKeys } from '@/lib/api/query-keys';

export function useSession() {
  return useQuery({
    queryKey: queryKeys.auth.session(),
    queryFn: ({ signal }) => authApi.getSession(signal),
    staleTime: 60_000,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (session) => {
      queryClient.setQueryData(queryKeys.auth.session(), session);
    },
  });
}

export function useSignup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: (session) => {
      queryClient.setQueryData(queryKeys.auth.session(), session);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSettled: async () => {
      queryClient.setQueryData(queryKeys.auth.session(), null);
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
  });
}

export function useVerifyPhone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.verifyPhone,
    onSuccess: (session) => {
      queryClient.setQueryData(queryKeys.auth.session(), session);
    },
  });
}

export function useVerifyEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: (session) => {
      queryClient.setQueryData(queryKeys.auth.session(), session);
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: authApi.forgotPassword,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: authApi.resetPassword,
  });
}
