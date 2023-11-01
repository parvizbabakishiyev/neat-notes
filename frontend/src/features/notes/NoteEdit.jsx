import { useState, useEffect, useCallback } from 'react';
import { TbUsers } from 'react-icons/tb';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import useCreateNote from './useCreateNote';
import useUpdateNote from './useUpdateNote';
import * as propTypes from '../../utils/prop-types';
import TagList from './TagList';
import NoteActions from './NoteActions';
import Button from '../../ui/Button';
import useGetAllNotes from './useGetAllNotes';
import Spinner from '../../ui/Spinner';
import colors from '../../utils/colors';

export default function NoteEdit({ note: noteToUpdate, onClick, disableClosing, styleModal }) {
  // React Query mutations
  const { createNote, isPending: isPendingCreate } = useCreateNote();
  const { updateNote, isPending: isPendingUpdate } = useUpdateNote();

  // a query for all notes
  const { notes = [], isPending: isPendingGet, isError: isErrorGet, isSuccess: isSuccessGet } = useGetAllNotes();

  // store title and textContent in states, initiate them if the mode is update
  const [title, setTitle] = useState(() => noteToUpdate?.title || '');
  const [textContent, setTextContent] = useState(() => noteToUpdate?.textContent || '');

  // keep a new note in  a state, it will be null if the mode is update
  const [noteToCreate, setNoteToCreate] = useState(null);

  // all notes query is a single place to get created or updated note data, create/update mutations set all notes query
  // after successful mutation a created/updated note can be found in all notes query
  const [newNote = null] = notes.filter(note => note.id === noteToCreate?.id);

  // a final state of the editing note, it can be already existing note or a new note
  const noteToEdit = noteToUpdate || newNote;

  // in create mode, the first request is always create, keep state of it
  const isCreatingFinished = noteToCreate ? true : false;

  // derive the modes
  const isUpdatingMode = noteToUpdate ? true : false;
  const isCreatingMode = !isUpdatingMode;

  // close modal if the newly created note is not in query cache anymore after archiving or trashing
  useEffect(() => {
    if (isCreatingMode && isCreatingFinished && !newNote) {
      onClick();
    }
    //eslint-disable-next-line
  }, [isCreatingMode, isCreatingFinished, newNote]);

  const titleRef = useCallback(node => {
    if (node) node.innerText = noteToUpdate?.title || '';
    // eslint-disable-next-line
  }, []);

  const textContentRef = useCallback(node => {
    noteToUpdate || node?.focus();
    if (node) node.innerHTML = noteToUpdate?.textContent.replace(/\n/g, '<br>') || '';
    textContentRef.current = node;
    // eslint-disable-next-line
  }, []);

  // logic of whether to use create or update mutation
  useEffect(() => {
    // no input then do nothing
    if (!textContent || textContent.trim().length === 0) return;

    const timeout = setTimeout(() => {
      if (isCreatingMode && !isCreatingFinished && !isPendingCreate) {
        createNote(
          { note: { title, textContent } },
          {
            onSuccess: ({ note }) => {
              setNoteToCreate(note);
            },
          },
        );
      }

      if (
        (isUpdatingMode || isCreatingFinished) &&
        (noteToEdit?.title !== title || noteToEdit?.textContent !== textContent)
      ) {
        // do not allow to update in the Trash
        if (noteToEdit?.isTrashed) {
          // give an ID to toast to achive only a single toast of the same kind
          toast.error('Cannot edit a note in trash', { id: 'updating-in-trash' });
          return;
        }
        updateNote({ note: { ...noteToEdit, title, textContent } });
      }
    }, 1000);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line
  }, [title, textContent]);

  // prevent the closing of modal while creating or updating
  useEffect(() => {
    disableClosing(isPendingCreate || isPendingUpdate);
    // eslint-disable-next-line
  }, [isPendingCreate, isPendingUpdate]);

  // paste as plain text and trigger input event
  const onPasteTitle = e => {
    e.preventDefault();
    const plainText = e.clipboardData.getData('text/plain');

    const selection = document.getSelection();
    const range = selection.getRangeAt(0);

    range.deleteContents();
    range.insertNode(new Text(plainText));
    range.collapse();

    selection.removeAllRanges();
    selection.addRange(range);

    const inputEvent = new Event('input', { bubbles: true });
    const el = document.getElementById('title');
    el.dispatchEvent(inputEvent);
  };

  const onPasteTextContent = e => {
    e.preventDefault();
    const plainText = e.clipboardData.getData('text/plain');

    const selection = document.getSelection();
    const range = selection.getRangeAt(0);

    range.deleteContents();
    range.insertNode(new Text(plainText));
    range.collapse();

    selection.removeAllRanges();
    selection.addRange(range);

    const inputEvent = new Event('input', { bubbles: true });
    const el = document.getElementById('textContent');
    el.dispatchEvent(inputEvent);
  };

  // style note
  const selectedStyle = colors.find(({ colorHex }) => colorHex === noteToEdit?.colorHex)?.twClasses;
  useEffect(() => {
    styleModal && styleModal(selectedStyle);
    //eslint-disable-next-line
  }, [selectedStyle]);

  return (
    <>
      {isErrorGet && (
        <div className="px-20 py-10 text-center text-neutral-800 dark:text-neutral-300">
          Cannot add or update, something went wrong
        </div>
      )}
      {isPendingGet && (
        <div className="flex h-[15vh] w-[30vw] items-center justify-center text-neutral-800 dark:text-neutral-300">
          <Spinner />
        </div>
      )}
      {isSuccessGet && (
        <>
          <div className={`flex w-full flex-col overflow-hidden rounded-t-lg`}>
            <div className="flex w-full flex-col gap-4 overflow-y-auto overflow-x-hidden rounded-lg p-4">
              <div
                className="text-md font-semibold leading-[1.375rem] text-neutral-800 outline-none before:text-black/50 empty:before:content-[attr(placeholder)] dark:text-neutral-100 before:dark:text-white/50"
                contentEditable
                placeholder="An optional title"
                onInput={e => setTitle(e.target.innerText)}
                onPaste={onPasteTitle}
                ref={titleRef}
                spellCheck={false}
                suppressContentEditableWarning={true}
                id="title"
              />
              <div
                className="whitespace-pre-line text-sm text-neutral-800 outline-none before:text-black/50 empty:before:content-[attr(placeholder)] dark:text-neutral-100 before:dark:text-white/50"
                contentEditable
                placeholder="Start typing to save a note"
                onInput={e => setTextContent(e.target.innerText)}
                onPaste={onPasteTextContent}
                ref={textContentRef}
                spellCheck={false}
                suppressContentEditableWarning={true}
                id="textContent"
              />
              {(isCreatingMode && !isCreatingFinished && !newNote) || <TagList note={noteToEdit} />}
              {(isCreatingMode && !isCreatingFinished && !newNote) ||
                (noteToEdit?.sharedUsers.length > 0 && (
                  <div className="flex items-center justify-start gap-1">
                    <TbUsers className="h-3 w-3" />
                    <span className="flex h-[1.25rem] items-center text-xs italic text-neutral-800 dark:text-neutral-300">{`Last edited by ${
                      noteToEdit?.user.email === noteToEdit?.lastEditedBy.email
                        ? 'you'
                        : noteToEdit?.lastEditedBy.firstname
                    }`}</span>
                  </div>
                ))}
            </div>
          </div>
          <div
            className={`bottom-5 flex items-center rounded-b-lg border-t border-black/10 px-4 py-1 dark:border-white/20`}
          >
            <NoteActions
              note={noteToEdit}
              className="items-center gap-3 md:visible [&_svg]:dark:stroke-neutral-300"
              isDisabled={isCreatingMode && !isCreatingFinished}
            />
            <div className="ml-auto">
              <Button
                btnType="secondary-sm"
                onClick={onClick}
                className="border-0"
                disabled={isPendingCreate || isPendingUpdate}
              >
                Close
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

NoteEdit.propTypes = {
  note: propTypes.note,
  onClick: PropTypes.func,
  disableClosing: PropTypes.func,
  styleModal: PropTypes.func,
};
