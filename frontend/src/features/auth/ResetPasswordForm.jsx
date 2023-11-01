import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import useResetPassword from './useResetPassword';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Spinner from '../../ui/Spinner';
import errorParser from '../../utils/error-parser';
import formValidations from '../../utils/form-validations';

export default function ForgotPasswordForm() {
  const { resetToken } = useParams();
  const { resetPassword: resetPasswordMutate, isPending, isSuccess, error } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const resetPassword = data =>
    resetPasswordMutate({
      ...data,
      passwordResetToken: resetToken,
    });

  const { genericError, fieldErrorFinder } = errorParser(errors, error);

  return (
    <div className="flex h-2/3 w-64 flex-col items-start justify-center justify-self-center xxs:w-72 xs:w-80 lg:w-96">
      <h1 className="text-lg font-medium text-neutral-800 dark:text-neutral-300 lg:text-xl">Reset your password</h1>
      <p className="mb-4 text-sm text-neutral-700 dark:text-neutral-400 lg:text-base">
        Choose a strong password for your account
      </p>
      <p
        className={`mb-4 min-h-[1.25rem] min-w-[24rem] text-sm ${
          isSuccess
            ? 'text-primary-green-600 dark:text-primary-green-500'
            : 'text-cerise-red-600 dark:text-cerise-red-500'
        }`}
      >
        {isSuccess && 'Password is reset successfully'}
        {genericError}
      </p>
      <form onSubmit={handleSubmit(resetPassword)} className="flex w-full flex-col gap-3">
        <Input
          label="New password"
          type="password"
          name="newPassword"
          register={register}
          error={fieldErrorFinder('newPassword')}
          validationSchema={formValidations.password}
        />
        <Input
          label="Confirm new password"
          type="password"
          name="newPasswordConfirm"
          register={register}
          error={fieldErrorFinder('newPasswordConfirm')}
          validationSchema={{
            validate: value => watch('newPassword') === value || 'Password confirmation should match the password',
          }}
        />
        <div className="mt-6">
          <Button btnType="primary" type="submit" disabled={isPending}>
            {isPending ? <Spinner /> : 'Reset'}
          </Button>
        </div>
        {isSuccess && (
          <p className="mt-3 text-center text-sm text-neutral-800 dark:text-neutral-300">
            <Button isLink btnType="link" to="../login">
              Log in
            </Button>
            &nbsp; with your new password
          </p>
        )}
      </form>
    </div>
  );
}
