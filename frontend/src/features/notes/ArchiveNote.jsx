import { TbArchive } from 'react-icons/tb';
import PropTypes from 'prop-types';
import * as propTypes from '../../utils/prop-types';
import useArchiveNote from './useArchiveNote';
import Button from '../../ui/Button';

export default function ArchiveNote({ note, isDisabled }) {
  const { archiveNote, isPending } = useArchiveNote();

  return (
    <Button
      btnType="icon-sm"
      tooltipText="Archive"
      id="archive"
      onClick={() => archiveNote({ note })}
      disabled={isPending || isDisabled}
    >
      <TbArchive />
    </Button>
  );
}

ArchiveNote.propTypes = {
  note: propTypes.note,
  isDisabled: PropTypes.bool,
};
