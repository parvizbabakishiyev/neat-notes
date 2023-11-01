import { useNavigate } from 'react-router-dom';
import Button from '../../ui/Button';
import Confirmation from '../../ui/Confirmation';
import Modal from '../../ui/Modal';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '../auth/AuthContextProvider';
import useDeleteOwnUser from './useDeleteOwnUser';

export default function DeleteAccount() {
  const [isConfirming, setIsConfirming] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logoutCtx } = useAuthContext();

  const { deleteOwnUser: deleteOwnUserMutate, isError, isPending, isSuccess, reset } = useDeleteOwnUser();

  const cancelDeletion = async () => {
    // prevent closing of the modal while the request is loading
    if (!isPending) {
      // prevent closing of the modal while redirecting the user
      if (isError || isSuccess) await new Promise(r => setTimeout(r, 3000));
      // allow to close the modal
      setIsConfirming(false);
    }
  };

  const openConfirmation = () => {
    setIsConfirming(true);
  };

  const deleteOwnUser = () => {
    deleteOwnUserMutate(
      {},
      {
        onError: async () => {
          await new Promise(r => setTimeout(r, 3000));
          reset();
          setIsConfirming(false);
        },
        onSuccess: async (data, variables) => {
          await new Promise(r => setTimeout(r, 3000));
          localStorage.clear();
          logoutCtx(); // sync context
          queryClient.clear(); // clear query cache
          navigate('/signup', variables?.navOptions); // navigate to login page
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <div>
        <h2 className="text-neutral-800 dark:text-neutral-300">Delete my account</h2>
        <h3 className="mb-10 text-sm text-neutral-700 dark:text-neutral-500">
          Once you have deleted your account you cannot restore it
        </h3>
      </div>
      <Button
        btnType="primary-sm-delete"
        className="h-10 w-full min-w-[10rem] self-end md:w-1/2"
        onClick={openConfirmation}
        disabled={isPending}
      >
        Delete my account
      </Button>
      <Modal isOpen={isConfirming} onClose={cancelDeletion} className={`w-[30rem]`}>
        {!isSuccess && !isError && (
          <Confirmation
            textConfirm="Delete your account permanently?"
            textBtnCancel="Cancel"
            textBtnConfirm="Delete"
            confirmBtnType="primary-sm-delete"
            onCancel={cancelDeletion}
            onConfirm={deleteOwnUser}
            cancelBtnDisabled={isPending}
            confirmBtnDisabled={isPending}
          />
        )}
        {isSuccess && (
          <p className="text-md px-12 py-6 text-neutral-800 dark:text-neutral-300">Account deleted successfully</p>
        )}
        {isError && (
          <p className="text-md px-12 py-6 text-neutral-800 dark:text-neutral-300">
            Something went wrong, please try again later
          </p>
        )}
      </Modal>
    </div>
  );
}
