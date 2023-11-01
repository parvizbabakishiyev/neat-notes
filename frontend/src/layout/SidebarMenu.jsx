import PropTypes from 'prop-types';
import Overlay from '../ui/Overlay';
import NavBar from './NavBar';
import { createPortal } from 'react-dom';

export default function SidebarMenu({ onClose, isOpen }) {
  const sidebar = (
    <>
      <Overlay onClick={onClose} isOpen={isOpen} />
      <aside
        className={`fixed left-0 top-0 z-[20] h-[var(--vh)] w-[17rem] transform bg-white px-4 py-8 transition-all duration-300 ease-in-out dark:bg-neutral-900 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <NavBar onClose={onClose} />
      </aside>
    </>
  );

  return createPortal(sidebar, document.getElementById('sidebar-root'));
}

SidebarMenu.propTypes = {
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
};
