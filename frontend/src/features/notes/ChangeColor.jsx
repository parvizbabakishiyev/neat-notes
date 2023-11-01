import { useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';
import { TbPalette } from 'react-icons/tb';
import * as propTypes from '../../utils/prop-types';
import Button from '../../ui/Button';
import Popup from '../../ui/Popup';
import ColorOptions from './ColorOptions';

export default function ChangeColor({ note, onChangeVisibility, isDisabled }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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

    setIsPopupOpen(false);
    onChangeVisibility(false);
  };

  return (
    <div className="relative">
      <Button
        btnType="icon-sm"
        id={buttonId}
        tooltipText={isPopupOpen ? '' : 'Change color'}
        onClick={togglePopup}
        disabled={isDisabled}
        className="relative"
      >
        <TbPalette />
      </Button>
      <CSSTransition in={isPopupOpen} nodeRef={popupRef} appear={true} timeout={400} classNames="fade" unmountOnExit>
        <Popup
          ref={popupRef}
          isOpen={isPopupOpen}
          onClose={closePopup}
          className="top-8 translate-x-[-45%] rounded-lg px-3 py-2 shadow-s1"
        >
          <ColorOptions note={note} />
        </Popup>
      </CSSTransition>
    </div>
  );
}

ChangeColor.propTypes = {
  note: propTypes.note,
  onChangeVisibility: PropTypes.func,
  isDisabled: PropTypes.bool,
};
