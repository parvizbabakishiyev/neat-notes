// import PropTypes from 'prop-types';
import Button from '../../ui/Button';
import { useState } from 'react';
import Modal from '../../ui/Modal';
import NoteEdit from './NoteEdit';

export default function CreateNote() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosingDisabled, setIsClosingDisabled] = useState(false);
  const [modalStyle, setModalStyle] = useState('border-neutral-200 dark:border-neutral-600');

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => isClosingDisabled || setIsModalOpen(false);

  return (
    <>
      <Button btnType="input" onClick={handleOpenModal}>
        Take a note
      </Button>
      <Modal onClose={handleCloseModal} isOpen={isModalOpen} className={modalStyle}>
        <NoteEdit
          onClick={handleCloseModal}
          disableClosing={isDisabled => setIsClosingDisabled(isDisabled)}
          styleModal={style => setModalStyle(style)}
        />
      </Modal>
    </>
  );
}

// CreateNote.propTypes = {
//   children: PropTypes.node,
// };
