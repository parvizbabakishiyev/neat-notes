import PropTypes from 'prop-types';
import { TbEye, TbEyeOff } from 'react-icons/tb';
import Button from './Button';
import { useState } from 'react';

export default function Input({ label, type, name, register, error = '', validationSchema = {} }) {
  const [showPassword, setShowPassword] = useState(false);

  const inputClasses = `${type === 'password' && 'pr-[3rem]'} ${
    error
      ? 'border-cerise-red-600 focus:border-cerise-red-600 dark:border-cerise-red-500 dark:focus:border-cerise-red-500'
      : 'border-neutral-200 dark:border-neutral-600 focus:border-primary-green-400 dark:focus:border-primary-green-400'
  }  block font-light h-10 px-2.5 pb-2.5 pt-4 w-full text-[15px] text-neutral-800 dark:text-neutral-300 bg-transparent rounded-md border appearance-none focus:outline-none focus:ring-0 peer`;

  const labelClasses = `${
    error
      ? 'text-cerise-red-600 dark:text-cerise-red-500'
      : 'text-neutral-500 peer-focus:text-primary-green-400 dark:peer-focus:text-primary-green-400'
  } dark:bg-neutral-900 absolute text-sm duration-300 transform -translate-y-[18px] scale-[0.95] top-2 z-[1] origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[0.95] peer-focus:-translate-y-[18px] left-1`;

  return (
    <div className="flex flex-wrap items-center gap-1">
      <div className="relative w-full">
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          {...register(name, validationSchema)}
          id={name}
          placeholder=" "
          className={inputClasses}
          autoComplete="off"
        />
        <label htmlFor={name} className={labelClasses}>
          {label}
        </label>
      </div>
      {type === 'password' && (
        <Button btnType="icon-sm" className="ml-[-2.5rem]" onClick={() => setShowPassword(s => !s)}>
          {showPassword ? (
            <TbEyeOff className="stroke-neutral-800 dark:stroke-neutral-400" />
          ) : (
            <TbEye className="stroke-neutral-800 dark:stroke-neutral-400" />
          )}
        </Button>
      )}
      <p className="text-xs text-cerise-red-600 dark:text-cerise-red-500">{error}</p>
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.oneOf(['text', 'password']).isRequired,
  name: PropTypes.string.isRequired,
  register: PropTypes.func,
  error: PropTypes.string,
  validationSchema: PropTypes.object,
};
