import PropTypes from 'prop-types';
import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import { twMerge } from 'tailwind-merge';

export default function Overlay({ onClick, isOpen, className }) {
  const overlayRef = useRef(null);
  const classes = twMerge('fixed left-0 top-0 z-10 h-[var(--vh)] w-[var(--vw)] bg-black/40', className);
  const overlay = (
    <CSSTransition
      in={isOpen}
      appear={true}
      nodeRef={overlayRef}
      timeout={150}
      classNames="fade"
      mountOnEnter
      unmountOnExit
    >
      <div
        ref={overlayRef}
        className={classes}
        onClick={e => {
          e.stopPropagation();
          onClick(e);
        }}
      />
    </CSSTransition>
  );
  return createPortal(overlay, document.getElementById('overlay-root'));
}

Overlay.propTypes = {
  onClick: PropTypes.func,
  isOpen: PropTypes.bool,
  className: PropTypes.string,
};
