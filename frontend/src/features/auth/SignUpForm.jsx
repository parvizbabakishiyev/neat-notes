import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import useSignup from './useSignup';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Spinner from '../../ui/Spinner';
import errorParser from '../../utils/error-parser';
import formValidations from '../../utils/form-validations';

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    // default values for testing
    defaultValues: {
      firstname: 'andy',
      lastname: 'joe',
      email: 'mike@example.com',
      password: '1234Qwer$',
      passwordConfirm: '1234Qwer$',
    },
  });

  const password = watch('password');
  useEffect(() => {
    trigger('passwordConfirm');
  }, [password, trigger]);

  const { signup: signupMutate, isPending, error: apiErrors } = useSignup();

  const signup = data => {
    signupMutate(data);
  };

  const { genericError, fieldErrorFinder } = errorParser(errors, apiErrors);

  return (
    <div className="flex min-h-[66%] w-64 flex-col items-start justify-center justify-self-center xxs:w-72 xs:w-80 lg:w-96">
      <h1 className="text-lg font-medium text-neutral-800 dark:text-neutral-300 lg:text-xl">Create an account</h1>
      <p className="mb-4 text-sm text-neutral-700 dark:text-neutral-400 lg:text-base">Notes made easy. Join now!</p>
      <p className="mb-4 min-h-[1.25rem] text-sm text-cerise-red-600 dark:text-cerise-red-500">{genericError}</p>
      <form onSubmit={handleSubmit(signup)} className="flex w-full flex-col gap-3">
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
        <Input
          label="Password"
          type="password"
          name="password"
          register={register}
          error={fieldErrorFinder('password')}
          validationSchema={formValidations.password}
        />
        <Input
          label="Confirm password"
          type="password"
          name="passwordConfirm"
          register={register}
          error={fieldErrorFinder('passwordConfirm')}
          validationSchema={{
            validate: value => watch('password') === value || 'Password confirmation should match the password',
          }}
        />

        <div className="mt-6">
          <Button btnType="primary" type="submit" disabled={isPending}>
            {isPending ? <Spinner /> : 'Sign up'}
          </Button>
        </div>
        <p className="mt-3 text-center text-sm text-neutral-800 dark:text-neutral-300">
          Already have an account?{' '}
          <Button isLink btnType="link" to="../login">
            Log in
          </Button>
        </p>
      </form>
    </div>
  );
}
