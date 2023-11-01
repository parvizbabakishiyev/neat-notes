import useGetArchivedNotes from '../features/notes/useGetArchivedNotes';
import NoteList from '../features/notes/NoteList';
import Spinner from '../ui/Spinner';

export default function ArchivedNotes() {
  const { notes, isPending, isError, isSuccess } = useGetArchivedNotes();

  return (
    <div className="grid h-full w-full items-start justify-items-center px-0 py-10 xs:p-10">
      {isSuccess && notes.length === 0 && (
        <p className="text-neutral-800 dark:text-neutral-300">Your archived notes will be shown here</p>
      )}
      {isSuccess && notes.length > 0 && <NoteList notes={notes} />}
      {isPending && (
        <div className="flex h-full w-full items-center justify-center">
          <Spinner className="h-10 w-10 border-[4px]" />
        </div>
      )}
      {isError && (
        <div className="grid h-full w-full items-center justify-center">
          <p className="text-neutral-800 dark:text-neutral-300">
            Something went wrong while getting your archived notes
          </p>
        </div>
      )}
    </div>
  );
}
