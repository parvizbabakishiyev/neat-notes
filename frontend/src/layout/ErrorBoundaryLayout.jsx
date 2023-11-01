import { ErrorBoundary } from 'react-error-boundary';
import { Outlet } from 'react-router-dom';
import ErrorFallback from '../ui/ErrorFallback';

export default function ErrorBoundaryLayout() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.replace('/')}>
      <Outlet />
    </ErrorBoundary>
  );
}
