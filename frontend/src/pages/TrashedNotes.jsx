import useGetTrashedNotes from '../features/notes/useGetTrashedNotes';
import NoteList from '../features/notes/NoteList';
import Spinner from '../ui/Spinner';
import EmptyTrash from '../features/notes/EmptyTrash';

export default function TrashedNotes() {
  const { notes, isSuccess, isPending, isError } = useGetTrashedNotes();

  return (
    <div className="grid h-full grid-cols-1 grid-rows-[auto_1fr] items-start justify-items-center gap-10 px-0 py-10 xs:p-10">
      <EmptyTrash showEmptyTrash={isSuccess && notes.length > 0} />
      {isSuccess && notes.length > 0 && <NoteList notes={notes} />}
      {isSuccess && notes.length === 0 && <p className="text-neutral-800 dark:text-neutral-300">No trashed notes</p>}
      {isPending && (
        <div className="flex h-full w-full items-center justify-center">
          <Spinner className="h-10 w-10 border-[4px]" />
        </div>
      )}
      {isError && (
        <p className="text-neutral-800 dark:text-neutral-300">Something went wrong while getting the trashed notes</p>
      )}
    </div>
  );
}
