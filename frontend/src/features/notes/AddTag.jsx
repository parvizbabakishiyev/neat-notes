import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { TbPlus, TbTag } from 'react-icons/tb';
import useUpdateNote from './useUpdateNote';
import * as propTypes from '../../utils/prop-types';
import Button from '../../ui/Button';
import Popup from '../../ui/Popup';

export default function AddTag({ note, onChangeVisibility, isDisabled }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { updateNote, isPending } = useUpdateNote();

  // react-hook-form
  const { register, handleSubmit, formState, setFocus, reset } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  // set the focus when the popup opens
  useEffect(() => {
    isPopupOpen && setFocus('newTag');
  }, [isPopupOpen, setFocus]);

  // check for error message to show it as a toast
  useEffect(() => {
    if (formState.errors?.newTag) toast.error(formState.errors.newTag.message, { id: 'add-new-tag' });
  }, [formState]);

  // create ref for popup to use it in useOutsideClick hook
  const popupRef = useRef(null);

  // handle add tag button clicks
  const togglePopup = () => {
    setIsPopupOpen(s => !s);
    onChangeVisibility(true);
  };

  // handle popup closing
  const buttonId = Math.floor(Math.random() * Date.now()).toString();
  const closePopup = async e => {
    // ignore events from the button itself, otherwise events from useOutsideClick hit it in capturing phase
    const targetElId = e.target.closest('button')?.id;
    if (targetElId === buttonId) return;

    reset();
    setIsPopupOpen(false);
    onChangeVisibility(false);
  };

  // handle submit
  const onSubmit = ({ newTag = '' }, e) => {
    // ignore if the new tag is empty or already exists
    if (newTag === '' || note.tags.includes(newTag)) {
      closePopup(e);
      return;
    }

    // build a new tags array
    const { tags: currTags } = note;

    // call the api
    updateNote({ note: { ...note, tags: [...currTags, newTag] } });

    // close the popup
    closePopup(e);
  };

  return (
    <div className="relative">
      <Button
        btnType="icon-sm"
        id={buttonId}
        tooltipText={isPopupOpen ? '' : 'Add tag'}
        onClick={togglePopup}
        disabled={isDisabled || isPending}
        className="relative"
      >
        <TbTag />
      </Button>
      <CSSTransition in={isPopupOpen} nodeRef={popupRef} appear={true} timeout={450} classNames="fade" unmountOnExit>
        <Popup ref={popupRef} isOpen={isPopupOpen} onClose={closePopup} className="top-8 rounded">
          <form
            onSubmit={handleSubmit((data, e) => onSubmit(data, e))}
            className="flex items-center justify-items-center gap-2 p-1 pl-3"
          >
            <input
              type="text"
              {...register('newTag', {
                maxLength: {
                  value: 16,
                  message: 'Tag name is too long',
                },
              })}
              id="newTag"
              placeholder="tag name"
              className="w-36 bg-white text-sm text-neutral-800 focus:outline-none focus:ring-0 dark:bg-neutral-800 dark:text-neutral-300"
              autoComplete="off"
            />
            <Button type="submit" btnType="icon-sm">
              <TbPlus />
            </Button>
          </form>
        </Popup>
      </CSSTransition>
    </div>
  );
}

AddTag.propTypes = {
  note: propTypes.note,
  onChangeVisibility: PropTypes.func,
  isDisabled: PropTypes.bool,
};
