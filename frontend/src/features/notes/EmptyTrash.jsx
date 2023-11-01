import { useState } from 'react';
import PropTypes from 'prop-types';
import { useIsMutating } from '@tanstack/react-query';
import { TbInfoSquareRounded } from 'react-icons/tb';
import useEmptyTrash from './useEmptyTrash';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import Confirmation from '../../ui/Confirmation';

export default function EmptyTrash({ showEmptyTrash }) {
  const [isConfirming, setIsConfirming] = useState(false);
  const isMutating = useIsMutating();
  const { emptyTrash: emptyTrashMutate, isPending } = useEmptyTrash();

  const emptyTrash = () => {
    emptyTrashMutate();
    setIsConfirming(false);
  };

  const openConfirmation = () => setIsConfirming(true);

  const cancelEmptying = () => setIsConfirming(false);

  return (
    <div className="flex flex-col items-start gap-3 md:flex-row md:gap-10">
      <div className="flex h-min items-start justify-center gap-1 px-5">
        <TbInfoSquareRounded className="h-5 w-5 stroke-neutral-800 dark:stroke-neutral-400" />
        <span className="text-sm text-neutral-800 dark:text-neutral-300">
          Notes in trash will be deleted permanently after 10 days
        </span>
      </div>
      {showEmptyTrash && (
        <Button
          btnType="link"
          className="whitespace-nowrap pl-5 md:pl-0"
          disabled={isPending || isMutating > 0}
          onClick={openConfirmation}
        >
          Empty trash
        </Button>
      )}
      <Modal onClose={cancelEmptying} isOpen={isConfirming}>
        <Confirmation
          textConfirm="Do you want to empty trash?"
          textBtnCancel="Cancel"
          textBtnConfirm="Empty"
          onCancel={cancelEmptying}
          onConfirm={emptyTrash}
          cancelBtnDisabled={isPending}
          confirmBtnDisabled={isPending}
        />
      </Modal>
    </div>
  );
}

EmptyTrash.propTypes = {
  showEmptyTrash: PropTypes.bool,
};
