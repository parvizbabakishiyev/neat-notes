import { useForm } from 'react-hook-form';
import useForgotPassword from './useForgotPassword';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Spinner from '../../ui/Spinner';
import errorParser from '../../utils/error-parser';
import formValidations from '../../utils/form-validations';

export default function ForgotPasswordForm() {
  const { forgotPassword: forgotPasswordMutate, isPending, isSuccess, error } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const forgotPassword = data =>
    forgotPasswordMutate({
      ...data,
      resetUrl: `${import.meta.env.VITE_APP_BASE_URL}/reset-password`,
    });

  const { genericError, fieldErrorFinder } = errorParser(errors, error);

  return (
    <div className="flex h-2/3 w-64 flex-col items-start justify-center justify-self-center xxs:w-72 xs:w-80 lg:w-96">
      <h1 className="text-lg font-medium text-neutral-800 dark:text-neutral-300 lg:text-xl">Forgot your password?</h1>
      <p className="mb-4 text-sm text-neutral-700 dark:text-neutral-400 lg:text-base">
        Please enter your email to get a password reset link
      </p>
      <p
        className={`mb-4 min-h-[1.25rem] text-sm ${
          isSuccess
            ? 'text-primary-green-600 dark:text-primary-green-500'
            : 'text-cerise-red-600 dark:text-cerise-red-500'
        }`}
      >
        {isSuccess && 'Link is sent successfully, please check your inbox'}
        {genericError}
      </p>
      <form onSubmit={handleSubmit(forgotPassword)} className="flex w-full flex-col gap-3">
        <Input
          label="Email"
          type="text"
          name="email"
          register={register}
          error={fieldErrorFinder('email')}
          validationSchema={formValidations.email}
        />
        <div className="mt-6">
          <Button btnType="primary" type="submit" disabled={isPending}>
            {isPending ? <Spinner /> : 'Send email'}
          </Button>
        </div>
        <p className="mt-3 text-center text-sm text-neutral-800 dark:text-neutral-300">
          Or&nbsp;
          <Button isLink btnType="link" to="../login">
            Log in
          </Button>
        </p>
      </form>
    </div>
  );
}
