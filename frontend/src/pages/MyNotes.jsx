import useGetAllNotes from '../features/notes/useGetAllNotes';
import NoteList from '../features/notes/NoteList';
import CreateNote from '../features/notes/CreateNote';
import Spinner from '../ui/Spinner';

export default function MyNotes() {
  const { notes, isPending, isError, isSuccess } = useGetAllNotes();

  return (
    <div className="grid h-full w-full grid-cols-1 grid-rows-[2.5rem_1fr] items-start justify-items-center gap-5 px-0 py-3 xs:p-10">
      <CreateNote />

      {isSuccess && notes.length === 0 && (
        <p className="text-neutral-800 dark:text-neutral-300">No notes found, try to add one</p>
      )}
      {isSuccess && notes.length > 0 && <NoteList notes={notes} />}
      {isPending && (
        <div className="flex h-full w-full items-center justify-center">
          <Spinner className="h-10 w-10 border-[4px]" />
        </div>
      )}
      {isError && (
        <div className="grid h-full w-full items-center justify-center">
          <p className="text-neutral-800 dark:text-neutral-300">Something went wrong while getting your notes</p>
        </div>
      )}
    </div>
  );
}
