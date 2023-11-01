import { useForm } from 'react-hook-form';
import useChangePassword from '../auth/useChangePassword';
import useLogout from './useLogout';
import errorParser from '../../utils/error-parser';
import formValidations from '../../utils/form-validations';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Spinner from '../../ui/Spinner';

export default function ChangePassword() {
  const { logout } = useLogout();
  const { changePassword: changePasswordMutate, isSuccess, isPending, isError, error: error } = useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const changePassword = data => {
    changePasswordMutate(data, {
      onSuccess: async () => {
        await new Promise(r => setTimeout(r, 3000));

        logout({
          navOptions: { replace: true, state: { loginMessage: 'Please login with your new password' } },
        });
      },
    });
  };

  const onCancel = () => {
    reset();
  };

  const { genericError, fieldErrorFinder } = errorParser(errors, error);

  return (
    <div className="flex flex-col gap-2">
      <div>
        <h2 className="text-base text-neutral-800 dark:text-neutral-300">Change password</h2>
        <p className="text-sm text-neutral-700 dark:text-neutral-500">Requires re-login with a new password</p>
      </div>
      <form onSubmit={handleSubmit(changePassword)} className="flex flex-col gap-3 pb-0 pt-4 md:py-4">
        <Input
          label="Current password"
          type="password"
          name="currentPassword"
          register={register}
          error={fieldErrorFinder('currentPassword')}
          validationSchema={{ required: 'Current password is required' }}
        />
        <Input
          label="New password"
          type="password"
          name="newPassword"
          register={register}
          error={fieldErrorFinder('newPassword')}
          validationSchema={formValidations.newPassword}
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
        <div className="mt-1 flex flex-col gap-4 md:flex-row">
          <Button btnType="secondary" onClick={onCancel} type="button" className="w-full" disabled={isPending}>
            Cancel
          </Button>
          <Button btnType="primary" type="submit" disabled={isPending} className="w-full">
            {isPending ? <Spinner /> : 'Change'}
          </Button>
        </div>
      </form>
      <p
        className={`min-h-[1.25rem] text-sm ${
          isSuccess
            ? 'text-primary-green-600 dark:text-primary-green-500'
            : 'text-cerise-red-600 dark:text-cerise-red-500'
        }`}
      >
        {isSuccess && 'Password changed successfully, you will be logged out...'}
        {(!!isError || genericError) && genericError}
      </p>
    </div>
  );
}
