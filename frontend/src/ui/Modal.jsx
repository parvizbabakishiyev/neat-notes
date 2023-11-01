import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';
import { useRef } from 'react';
import Overlay from './Overlay';

export default function Modal({ isOpen = false, onClose, className, children }) {
  const modalRef = useRef(null);
  const defaultClasses = `fixed flex flex-col left-1/2 top-1/2 sm:top-[45%] z-10 max-h-[70vh] sm:max-h-[80vh] max-w-[calc(var(--vw)-2rem)] w-[36rem] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 shadow-xl`;
  const classes = twMerge(defaultClasses, className);

  const modalRoot = document.getElementById('modal-root');
  const modalElement = (
    <>
      <Overlay isOpen={isOpen} onClick={onClose} />
      <CSSTransition
        in={isOpen}
        appear={true}
        nodeRef={modalRef}
        timeout={150}
        classNames="fade"
        mountOnEnter
        unmountOnExit
      >
        <div className={classes} onClick={e => e.stopPropagation()} ref={modalRef}>
          {children}
        </div>
      </CSSTransition>
    </>
  );

  return createPortal(modalElement, modalRoot);
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
};
