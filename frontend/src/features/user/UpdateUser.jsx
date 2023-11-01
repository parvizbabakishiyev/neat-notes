import { useForm } from 'react-hook-form';
import useGetOwnUser from './useGetOwnUser';
import useUpdateOwnUser from './useUpdateOwnUser';
import errorParser from '../../utils/error-parser';
import formValidations from '../../utils/form-validations';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import formatDate from '../../utils/format-date';
import Spinner from '../../ui/Spinner';

export default function ProfileEditForm() {
  const {
    user,
    isSuccess: isSuccessGet,
    isPending: isPendingGet,
    isError: isErrorGet,
    isFetching: isFetchingGet,
    refetch,
  } = useGetOwnUser();

  const {
    updateOwnUser: updateOwnUserMutate,
    isSuccess: isSuccessUpdate,
    isPending: isPendingUpdate,
    error: errorUpdate,
  } = useUpdateOwnUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      firstname: user?.firstname || '',
      lastname: user?.lastname || '',
      email: user?.email || '',
    },
  });

  const updateOwnUser = data => {
    updateOwnUserMutate(data);
  };

  const cancelUpdate = () => {
    reset();
    refetch();
  };

  const { genericError, fieldErrorFinder } = errorParser(errors, errorUpdate);

  const form = (
    <form onSubmit={handleSubmit(updateOwnUser)} className="flex flex-col justify-items-center gap-3 pb-0 pt-4 md:py-4">
      <Input
        label="First name"
        type="text"
        name="firstname"
        register={register}
        error={fieldErrorFinder('firstname')}
        validationSchema={formValidations.firstname}
      />
      <Input
        label="Last name"
        type="text"
        name="lastname"
        register={register}
        error={fieldErrorFinder('lastname')}
        validationSchema={formValidations.lastname}
      />
      <Input
        label="Email"
        type="text"
        name="email"
        register={register}
        error={fieldErrorFinder('email')}
        validationSchema={formValidations.email}
      />

      <div className="mt-1 flex flex-col gap-4 md:flex-row">
        <Button btnType="secondary" onClick={cancelUpdate} type="button" className="w-full" disabled={isPendingGet}>
          Cancel
        </Button>
        <Button
          btnType="primary"
          onSubmit={handleSubmit(updateOwnUser)}
          type="submit"
          disabled={isPendingUpdate}
          className="w-full"
        >
          {isPendingUpdate ? <Spinner /> : 'Update'}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <h2 className="inline-block text-neutral-800 dark:text-neutral-300">Update personal information</h2>
        {/* show spinner if there is a active fetch */}
        {isFetchingGet && <Spinner className="h-3 w-3 border-[1px] text-neutral-800 dark:text-neutral-300" />}
      </div>
      {/* check if there is an error while getting profile info */}
      {isErrorGet && (
        <p className="mb-6 text-sm text-cerise-red-600 dark:text-cerise-red-500">
          Cannot retrieve profile info, please try again later
        </p>
      )}
      {isSuccessGet && form}
      {/* if the update is successful show success message or 
      if there is no error for get user then check for a generic error to show error message*/}
      <p
        className={`min-h-[1.25rem] text-sm ${
          isSuccessUpdate
            ? 'text-primary-green-600 dark:text-primary-green-500'
            : 'text-cerise-red-600 dark:text-cerise-red-500'
        }`}
      >
        {isSuccessUpdate && 'Profile updated successfully'}
        {(!!isErrorGet || genericError) && genericError}
      </p>
      {/* show account creation info if profile retrieval successful */}
      {isSuccessGet && (
        <p className="text-xs font-extralight italic text-neutral-800 dark:text-neutral-300 md:text-sm">{`Account is created on ${formatDate(
          user?.createdAt,
        )}`}</p>
      )}
    </div>
  );
}
