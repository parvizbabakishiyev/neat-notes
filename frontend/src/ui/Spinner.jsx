import { twMerge } from 'tailwind-merge';
import PropTypes from 'prop-types';

export default function Spinner({ className }) {
  const classes = twMerge(
    'inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-current border-t-transparent text-primary-green-500 dark:text-primary-green-400',
    className,
  );
  return (
    <div className={classes} role="status" aria-label="loading">
      <span className="sr-only">Loading...</span>
    </div>
  );
}

Spinner.propTypes = {
  className: PropTypes.node,
};
