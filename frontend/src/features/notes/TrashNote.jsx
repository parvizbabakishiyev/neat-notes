import { TbTrash } from 'react-icons/tb';
import PropTypes from 'prop-types';
import * as propTypes from '../../utils/prop-types';
import useTrashNote from './useTrashNote';
import Button from '../../ui/Button';

export default function TrashNote({ note, isDisabled }) {
  const { trashNote, isPending } = useTrashNote();

  return (
    <Button
      btnType="icon-sm"
      tooltipText="Trash"
      onClick={() => trashNote({ note })}
      disabled={isPending || isDisabled}
    >
      <TbTrash />
    </Button>
  );
}

TrashNote.propTypes = {
  note: propTypes.note,
  isDisabled: PropTypes.bool,
};
