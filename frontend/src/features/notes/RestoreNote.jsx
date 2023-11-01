import { TbArrowBackUp } from 'react-icons/tb';
import * as propTypes from '../../utils/prop-types';
import useRestoreNote from './useRestoreNote';
import Button from '../../ui/Button';

export default function RestoreNote({ note }) {
  const { restoreNote, isPending } = useRestoreNote();

  return (
    <Button btnType="icon-sm" tooltipText="Restore" onClick={() => restoreNote({ note })} disabled={isPending}>
      <TbArrowBackUp />
    </Button>
  );
}

RestoreNote.propTypes = {
  note: propTypes.note,
};
