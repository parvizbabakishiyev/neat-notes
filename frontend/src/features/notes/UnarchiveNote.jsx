import { TbArchiveOff } from 'react-icons/tb';
import PropTypes from 'prop-types';
import * as propTypes from '../../utils/prop-types';
import useUnarchiveNote from './useUnarchiveNote';
import Button from '../../ui/Button';

export default function UnarchiveNote({ note, isDisabled }) {
  const { unarchiveNote, isPending } = useUnarchiveNote();

  return (
    <Button
      btnType="icon-sm"
      tooltipText="Unarchive"
      onClick={() => unarchiveNote({ note })}
      disabled={isPending || isDisabled}
    >
      <TbArchiveOff />
    </Button>
  );
}

UnarchiveNote.propTypes = {
  note: propTypes.note,
  isDisabled: PropTypes.bool,
};
