import { useMutation } from '@tanstack/react-query';
import useApiAuth from '../../services/useApiAuth';

export default function useResetPassword() {
  const { resetPassword: resetPasswordApi } = useApiAuth();
  const {
    mutate: resetPassword,
    isPending,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: async ({ passwordResetToken, newPassword, newPasswordConfirm }) =>
      await resetPasswordApi(passwordResetToken, newPassword, newPasswordConfirm),
  });

  return { resetPassword, isPending, isSuccess, error };
}
