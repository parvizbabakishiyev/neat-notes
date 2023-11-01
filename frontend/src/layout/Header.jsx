import { useIsMutating } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';
import { TbLogout, TbCloudCheck, TbMenu2 } from 'react-icons/tb';
import Button from '../ui/Button';
import Logo from '../ui/Logo';
import useLogout from '../features/auth/useLogout';
import Spinner from '../ui/Spinner';
import ColorThemes from '../ui/ColorThemes';
import { useState } from 'react';
import SidebarMenu from './SidebarMenu';
import Modal from '../ui/Modal';
import Confirmation from '../ui/Confirmation';
import Tooltip from '../ui/Tooltip';

export default function Header({ isAuth = true, className }) {
  const isMutatingNotes = useIsMutating({ mutationKey: ['notes'] });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isConfirmingLogout, setIsConfirmingLogout] = useState(false);

  const { logout, isPending } = useLogout();
  const classes = twMerge(
    'flex items-center h-full w-full justify-items-end justify-between gap-2 border-b border-neutral-200 pr-6 pl-4 sm:px-10 dark:border-neutral-600',
    className,
  );

  return (
    <header className={classes}>
      <div className="flex w-min items-center gap-4">
        <Button
          className={`${isAuth || 'hidden'} dark:text-neutral-300 sm:hidden`}
          onClick={() => setIsSidebarOpen(s => !s)}
        >
          <TbMenu2 className="h-6 w-6" />
        </Button>
        {isAuth && <SidebarMenu onClose={() => setIsSidebarOpen(false)} isOpen={isSidebarOpen} />}
        <span className="hidden xxs:block">
          <Logo />
        </span>
      </div>
      <div className="flex items-center gap-2 sm:gap-6">
        {isAuth && (
          <span className="group/tooltip relative">
            {isMutatingNotes > 0 && (
              <Spinner className={'h-[18px] w-[18px] border-[2px] text-neutral-800 dark:text-neutral-400'} />
            )}
            {isMutatingNotes === 0 && <TbCloudCheck className={'h-5 w-5 stroke-neutral-800 dark:stroke-neutral-400'} />}
            <Tooltip text={isMutatingNotes > 0 ? 'Syncing' : 'Synched'} className="left-[-1rem]" />
          </span>
        )}
        <ColorThemes />
        {isAuth && (
          <Button btnType="text-icon-secondary" onClick={() => setIsConfirmingLogout(true)} disabled={isPending}>
            <TbLogout />
            <span className="hidden sm:block">Log out</span>
          </Button>
        )}
        <Modal isOpen={isConfirmingLogout} onClose={() => isPending || setIsConfirmingLogout(false)}>
          <Confirmation
            textConfirm="Are you sure you want to log out?"
            textBtnCancel="Cancel"
            textBtnConfirm={isPending ? <Spinner /> : 'Log out'}
            onCancel={() => isPending || setIsConfirmingLogout(false)}
            onConfirm={() =>
              logout({
                navOptions: { replace: true, state: { loginMessage: 'Logged out, login again' } },
              })
            }
            cancelBtnDisabled={isPending}
            confirmBtnDisabled={isPending}
          />
        </Modal>
      </div>
    </header>
  );
}

Header.propTypes = {
  isAuth: PropTypes.bool,
  className: PropTypes.string,
};
