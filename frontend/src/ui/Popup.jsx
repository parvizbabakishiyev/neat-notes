import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';
import useOutsideClick from '../hooks/useOutsideClick';

const Popup = forwardRef(function Popup({ isOpen, onClose, className, children }, ref) {
  const refClick = useOutsideClick(onClose);
  const classes = twMerge(
    'absolute max-w-xl rounded-lg bg-white dark:bg-neutral-800 dark:shadow-s1d shadow-s1 z-[20]',
    className,
  );
  if (!isOpen) return null;
  return (
    <div ref={refClick} className={classes}>
      <div ref={ref}>{children}</div>
    </div>
  );
});

Popup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
};

Popup.displayName = 'Popup';

export default Popup;
