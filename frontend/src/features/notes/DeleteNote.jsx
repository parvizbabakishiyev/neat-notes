import { TbTrashX } from 'react-icons/tb';
import * as propTypes from '../../utils/prop-types';
import useDeleteNote from './useDeleteNote';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import Confirmation from '../../ui/Confirmation';
import { useState } from 'react';

export default function DeleteNote({ note }) {
  const { deleteNote: deleteNoteMutate, isPending } = useDeleteNote();
  const [isConfirming, setIsConfirming] = useState(false);

  const openConfirmation = () => {
    setIsConfirming(true);
  };

  const deleteNote = async () => {
    deleteNoteMutate({ note });
    setIsConfirming(false);
  };

  const handleCancel = () => {
    setIsConfirming(false);
  };

  return (
    <>
      <Button btnType="icon-sm" tooltipText="Delete forever" onClick={openConfirmation} disabled={isPending}>
        <TbTrashX />
      </Button>
      <Modal isOpen={isConfirming} onClose={handleCancel}>
        <Confirmation
          onCancel={handleCancel}
          onConfirm={deleteNote}
          textConfirm="Delete the note permanently?"
          textBtnCancel="Cancel"
          textBtnConfirm="Delete"
          cancelBtnDisabled={isPending}
          confirmBtnDisabled={isPending}
          confirmBtnType="primary-sm-delete"
        />
      </Modal>
    </>
  );
}

DeleteNote.propTypes = {
  note: propTypes.note,
};
