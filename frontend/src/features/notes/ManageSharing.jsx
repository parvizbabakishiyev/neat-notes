import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { TbUserPlus, TbX } from 'react-icons/tb';
import useShareNote from './useShareNote';
import errorParser from '../../utils/error-parser';
import formValidations from '../../utils/form-validations';
import * as propTypes from '../../utils/prop-types';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Modal from '../../ui/Modal';
import Spinner from '../../ui/Spinner';
import useUnshareNote from './useUnsharenote';

export default function ManageSharing({ note, isDisabled }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    shareNote: shareNoteMutate,
    isPending: isPendingShare,
    error: errorsShare,
    reset: resetShare,
  } = useShareNote();

  const { unshareNote: unshareNoteMutate, isPending: isPendingUnshare } = useUnshareNote();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  // reset mutation if input changes to reset errors
  useEffect(() => {
    resetShare();
    //eslint-disable-next-line
  }, [watch('email')]);

  const { genericError, fieldErrorFinder } = errorParser(errors, errorsShare);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    if (isPendingShare) return;

    reset();
    resetShare();
    setIsModalOpen(false);
  };

  const shareNote = data => {
    shareNoteMutate(
      { note, email: data.email },
      {
        onSuccess: () => {
          reset();
          resetShare();
        },
      },
    );
  };

  const unshareNote = e => {
    const emailToUnshare = e.target.closest('button')?.id;
    if (!emailToUnshare) return;

    unshareNoteMutate({ note, email: emailToUnshare });
  };

  return (
    <>
      <Button type="submit" btnType="icon-sm" onClick={openModal} tooltipText="Sharing" disabled={isDisabled}>
        <TbUserPlus />
      </Button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="divide:neutral-200 flex flex-col gap-4 divide-y p-5 dark:divide-neutral-600">
          <div className="flex flex-col gap-4 pb-4">
            <h3 className="text-md font-semibold">Share with</h3>
            <form
              onSubmit={handleSubmit(shareNote)}
              className="flex w-full flex-col items-start justify-items-center gap-2 xxs:flex-row"
            >
              <span className="w-full grow">
                <Input
                  label="Email to share with"
                  type="text"
                  name="email"
                  register={register}
                  error={fieldErrorFinder('email') || genericError}
                  validationSchema={formValidations.email}
                />
              </span>
              <Button type="submit" btnType="primary" disabled={isPendingShare} className="w-full xxs:w-24 sm:w-32">
                {isPendingShare ? <Spinner /> : 'Share'}
              </Button>
            </form>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center justify-items-center gap-1">
              <h3 className="text-md font-semibold text-neutral-800 dark:text-neutral-300">Already shared with</h3>
              {isPendingUnshare && <Spinner className="h-3 w-3 border-[1px] text-neutral-800 dark:text-neutral-300" />}
            </div>
            <ul className="flex flex-wrap gap-1">
              {note?.id && note?.sharedUsers.length === 0 ? (
                <span className="h-7 text-sm text-neutral-800 dark:text-neutral-300">
                  The note is shared with no one
                </span>
              ) : (
                note?.sharedUsers.map(user => (
                  <li
                    key={user.email}
                    className="group/tag flex h-7 w-fit items-center justify-between gap-1 rounded-full bg-neutral-200 px-3 py-[0.5rem] pr-[0.25rem] text-sm font-normal transition-all ease-linear dark:bg-neutral-600 sm:pr-3 sm:hover:gap-1 sm:hover:pr-[0.25rem]"
                  >
                    <span className="pb-0.5 italic text-neutral-800 dark:text-neutral-300">{`${
                      user.firstname
                    } ${user.lastname.slice(0, 1)}. <${user.email}>`}</span>
                    <Button
                      btnType="icon-sm"
                      tooltipText="Unshare"
                      id={user.email}
                      onClick={unshareNote}
                      disabled={isPendingShare || isPendingUnshare}
                      className="h-5 w-5 p-0.5 sm:h-0 sm:w-0 sm:p-0 sm:group-hover/tag:h-5 sm:group-hover/tag:w-5 sm:group-hover/tag:p-0.5"
                    >
                      <TbX />
                    </Button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </Modal>
    </>
  );
}

ManageSharing.propTypes = {
  note: propTypes.note,
  isDisabled: PropTypes.bool,
};
