import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import useRefresh from '../features/auth/useRefresh';
import { useIsMutating } from '@tanstack/react-query';
import { useAuthContext } from '../features/auth/AuthContextProvider';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';
import Main from './Main';
import useApiNotes from '../services/useApiNotes';
import Spinner from '../ui/Spinner';

export default function AppLayout() {
  const [isPending, setisPending] = useState(true);
  const queryClient = useQueryClient();
  const { accessToken } = useAuthContext();
  const { getAllNotes, getArchivedNotes, getTrashedNotes } = useApiNotes();
  const { refreshToken } = useRefresh();
  const isMutating = useIsMutating();

  // prevent user leaving if there is ongoing mutation
  useEffect(() => {
    const preventLeaving = e => {
      e.preventDefault();
      e.returnValue = '';
    };

    if (isMutating > 0) {
      window.addEventListener('beforeunload', preventLeaving);

      return () => window.removeEventListener('beforeunload', preventLeaving);
    }
  }, [isMutating]);

  // refresh access token which was in memory
  useEffect(() => {
    accessToken.current || refreshToken({ userInfo: true });
    // eslint-disable-next-line
  }, [accessToken.current]);

  // prefetch queries
  useEffect(() => {
    const prefetch = async () => {
      await Promise.all([
        queryClient.prefetchQuery({
          queryKey: ['notes', 'all'],
          queryFn: async () => {
            const data = await getAllNotes();
            return data?.notes;
          },
        }),
        queryClient.prefetchQuery({
          queryKey: ['notes', 'trashed'],
          queryFn: async () => {
            const data = await getTrashedNotes();
            return data?.notes;
          },
        }),
        queryClient.prefetchQuery({
          queryKey: ['notes', 'archived'],
          queryFn: async () => {
            const data = await getArchivedNotes();
            return data?.notes;
          },
        }),
      ]);
      setisPending(false);
    };
    accessToken.current && prefetch();

    // eslint-disable-next-line
  }, [accessToken.current]);

  return isPending ? (
    <div className="flex h-[var(--vh)] w-[var(--vw)] items-center justify-center bg-white dark:bg-neutral-900">
      <Spinner className="h-12 w-12" />
    </div>
  ) : (
    <div className="grid h-[var(--vh)] grid-cols-1 grid-rows-[3rem_1fr_2rem] bg-white dark:bg-neutral-900 sm:grid-rows-[4rem_1fr_2rem] sm:max-md:grid-cols-[17rem_1fr] md:grid-cols-[20rem_1fr]">
      <Header className="col-span-2" />
      <Sidebar />
      <Main>
        <Outlet />
      </Main>
      <Footer className="col-span-2" />
    </div>
  );
}
