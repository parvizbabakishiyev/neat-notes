import { forwardRef, useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import PropTypes from 'prop-types';
import { useIsMutating } from '@tanstack/react-query';
import { TbUsers } from 'react-icons/tb';
import NoteActions from './NoteActions';
import TagList from './TagList';
import NoteEdit from './NoteEdit';
import Modal from '../../ui/Modal';
import colors from '../../utils/colors';
import * as propTypes from '../../utils/prop-types';

const NoteItem = forwardRef(function ({ note, className, style }, ref) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosingDisabled, setIsClosingDisabled] = useState(false);
  const textContentRef = useRef(null);
  const isMutating = useIsMutating();

  // set height of text content to prevent cut lines
  useEffect(() => {
    if (!textContentRef?.current) return;
    const oldHeight = textContentRef.current.offsetHeight;
    const newHeight = Math.floor(oldHeight / 20) * 20;
    textContentRef.current.setAttribute('style', `height:${newHeight}px`);
  }, [note.textContent]);

  const selectedStyle = colors.find(({ colorHex }) => colorHex === note.colorHex)?.twClasses;

  const classes = twMerge(
    `${selectedStyle} group/note overflow-visible border flex select-none flex-col gap-3 rounded-lg p-5 transition hover:shadow-s1`,
    className,
  );

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={() => isClosingDisabled || setIsModalOpen(false)} className={selectedStyle}>
        <NoteEdit
          note={note}
          onClick={() => isClosingDisabled || setIsModalOpen(false)}
          disableClosing={isDisabled => setIsClosingDisabled(isDisabled)}
        />
      </Modal>
      <li className={classes} onClick={() => setIsModalOpen(true)} style={style} ref={ref}>
        {note?.title && (
          <h1 className="text-md line-clamp-1 flex-[0_0_auto] truncate font-medium leading-5 text-neutral-800 dark:text-neutral-100">
            {note.title}
          </h1>
        )}
        <p
          ref={textContentRef}
          className="line-clamp-6 max-h-[7.5rem] overflow-hidden truncate whitespace-pre-line text-sm text-neutral-800 dark:text-neutral-100"
        >
          {note.textContent}
        </p>
        <TagList note={note} />
        {note.sharedUsers.length > 0 && (
          <div className="flex items-center justify-start gap-1 [&>svg]:h-3 [&>svg]:w-3">
            <TbUsers className="stroke-neutral-700 dark:stroke-neutral-300" />
            <span className="flex h-6 items-center text-xs italic text-neutral-700 dark:text-neutral-300">{`Last edited by ${
              note.user.email === note.lastEditedBy.email ? 'you' : note.lastEditedBy.firstname
            }`}</span>
          </div>
        )}

        <NoteActions note={note} className={'[&_svg]:dark:stroke-neutral-300'} isDisabled={isMutating > 0} />
      </li>
    </>
  );
});

NoteItem.propTypes = {
  note: propTypes.note,
  className: PropTypes.string,
  style: PropTypes.object,
};

NoteItem.displayName = 'NoteItem';

export default NoteItem;
