import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';
import AddTag from './AddTag';
import TrashNote from './TrashNote';
import RestoreNote from './RestoreNote';
import ArchiveNote from './ArchiveNote';
import UnarchiveNote from './UnarchiveNote';
import DeleteNote from './DeleteNote';
import * as propTypes from '../../utils/prop-types';
import { useState } from 'react';
import ChangeColor from './ChangeColor';
import ManageSharing from './ManageSharing';

export default function NoteActions({ note, className, isDisabled = false }) {
  const [isVisible, setIsVisible] = useState(false);
  const isArchived = note?.isArchived;
  const isTrashed = note?.isTrashed;

  const onChangeVisibility = s => {
    setIsVisible(s);
  };

  const classes = twMerge(
    `${
      isVisible ? 'visible' : 'visible md:invisible'
    } mt-auto flex h-7 justify-evenly md:justify-start items-end gap-2 group-hover/note:visible`,
    className,
  );

  let actionButtons;
  if (isTrashed) {
    actionButtons = (
      <>
        <DeleteNote note={note} />
        <RestoreNote note={note} />
      </>
    );
  } else {
    actionButtons = (
      <>
        <ManageSharing note={note} isDisabled={isDisabled} />
        <AddTag note={note} onChangeVisibility={onChangeVisibility} isDisabled={isDisabled} />
        <ChangeColor note={note} onChangeVisibility={onChangeVisibility} isDisabled={isDisabled} />
        {isArchived ? <UnarchiveNote note={note} /> : <ArchiveNote note={note} isDisabled={isDisabled} />}
        <TrashNote note={note} isDisabled={isDisabled} />
      </>
    );
  }

  return (
    <div className={classes} onClick={e => e.stopPropagation()}>
      {actionButtons}
    </div>
  );
}

NoteActions.propTypes = {
  note: propTypes.note,
  className: PropTypes.string,
  isDisabled: PropTypes.bool,
};
