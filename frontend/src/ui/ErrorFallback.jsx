import PropTypes from 'prop-types';
import Button from './Button';

export default function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="flex h-[var(--vh)] w-[var(--vw)] flex-col items-center justify-center gap-4 bg-white dark:bg-neutral-900">
      <h1 className="text-2xl text-neutral-800 dark:text-neutral-300">Something went wrong,</h1>
      <p className="max-w-[80vw] font-mono text-sm text-neutral-800 dark:text-neutral-300">{error?.message}</p>
      <Button onClick={resetErrorBoundary} btnType="primary" className="w-fit px-8">
        Home page
      </Button>
    </div>
  );
}

ErrorFallback.propTypes = {
  error: PropTypes.object,
  resetErrorBoundary: PropTypes.func,
};
