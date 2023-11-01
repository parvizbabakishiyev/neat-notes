import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import useLogin from './useLogin';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Spinner from '../../ui/Spinner';
import errorParser from '../../utils/error-parser';
import formValidations from '../../utils/form-validations';

export default function LoginForm({ loginMessage }) {
  // clear history state, to reset loginMessage
  useEffect(() => {
    window.history.replaceState({}, '');
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // default values for testing
    defaultValues: {
      email: 'mike@example.com',
      password: '1234Qwer$',
    },
  });

  const { login: loginMutate, isPending, error } = useLogin();

  const login = data => loginMutate(data);

  const { genericError, fieldErrorFinder } = errorParser(errors, error);

  return (
    <div className="flex w-64 flex-col items-start justify-center justify-self-center xxs:w-72 xs:w-80 lg:w-96">
      <h1 className="text-lg font-medium text-neutral-800 dark:text-neutral-300 lg:text-xl">
        {loginMessage || 'Welcome back!'}
      </h1>
      <p className="mb-4 text-sm text-neutral-700 dark:text-neutral-400 lg:text-base">
        Please enter your credentials to login
      </p>
      <p className="mb-4 min-h-[1.25rem] text-sm text-cerise-red-600 dark:text-cerise-red-500">{genericError}</p>
      <form onSubmit={handleSubmit(login)} className="flex w-full flex-col gap-3">
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
        />
        <div className="mt-[-4px] self-end">
          <Button isLink to="../forgot-password" btnType="link">
            Forgot password?
          </Button>
        </div>
        <div className="mt-6">
          <Button btnType="primary" type="submit" disabled={isPending}>
            {isPending ? <Spinner /> : 'Log in'}
          </Button>
        </div>
        <p className="mt-3 text-center text-sm text-neutral-800 dark:text-neutral-300">
          Don&apos;t have an account?{' '}
          <Button isLink btnType="link" to="../signup">
            Sign up
          </Button>
        </p>
      </form>
    </div>
  );
}

LoginForm.propTypes = {
  loginMessage: PropTypes.string,
};
