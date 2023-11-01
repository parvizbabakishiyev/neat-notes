import { useMutation } from '@tanstack/react-query';
import useApiUsers from '../../services/useApiUsers';

export default function useChangePassword() {
  const { changePassword: changePasswordApi } = useApiUsers();
  const {
    mutate: changePassword,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ currentPassword, newPassword, newPasswordConfirm }) =>
      await changePasswordApi(currentPassword, newPassword, newPasswordConfirm),
  });

  return { changePassword, isPending, isSuccess, isError, error };
}
