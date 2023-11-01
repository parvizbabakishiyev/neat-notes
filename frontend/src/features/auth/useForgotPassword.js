import { useMutation } from '@tanstack/react-query';
import useApiAuth from '../../services/useApiAuth';

export default function useForgotPassword() {
  const { forgotPassword: forgotPasswordApi } = useApiAuth();
  const {
    mutate: forgotPassword,
    isPending,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: async ({ email, resetUrl }) => await forgotPasswordApi(email, resetUrl),
    onSuccess: () => {},
  });

  return { forgotPassword, isPending, isSuccess, error };
}
