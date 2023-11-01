import { useState } from 'react';
import { TbSunHigh, TbMoonStars, TbDeviceDesktop } from 'react-icons/tb';
import { twMerge } from 'tailwind-merge';
import { useDarkModeContext } from '../context/DarkModeContextProvider';
import Button from './Button';
import Popup from './Popup';

export default function ColorThemes() {
  const { selectedTheme, derivedTheme, setSelectedTheme } = useDarkModeContext();
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const inactiveStyles =
    'dark:bg-neutral-800 flex select-none items-center gap-3 px-4 py-2 text-sm font-semibold text-neutral-800 dark:text-neutral-300 hover:bg-primary-green-50 dark:hover:bg-neutral-700';
  const activeStyles =
    'bg-primary-green-100 hover:bg-primary-green-100 text-primary-green-700 dark:bg-primary-green-300 dark:hover:bg-primary-green-300 dark:text-neutral-800 ';

  const showOptions = () => {
    setIsOptionsOpen(s => !s);
  };

  const closeOptions = e => {
    // ignore events from the button itself, otherwise events from useOutsideClick hit it in capturing phase
    if (e.target.closest('button')?.id === 'theme') return;
    setIsOptionsOpen(false);
  };

  const selectOption = e => {
    const selected = e.target.closest('li')?.id;
    setSelectedTheme(selected);
    closeOptions(e);
  };

  return (
    <>
      <div className="relative">
        <Button btnType="icon" onClick={showOptions} id="theme">
          {derivedTheme === 'light' && (
            <TbSunHigh className={selectedTheme === 'system' ? 'stroke-neutral-800' : 'stroke-[#4ac34a]'} />
          )}
          {derivedTheme === 'dark' && (
            <TbMoonStars className={selectedTheme === 'system' ? 'dark:stroke-neutral-400' : 'dark:stroke-[#41b145]'} />
          )}
        </Button>
        <Popup isOpen={isOptionsOpen} onClose={closeOptions} className="left-[-6rem] top-11">
          <ul className="flex w-36 flex-col py-2">
            <li
              onClick={selectOption}
              id="light"
              className={`${selectedTheme === 'light' ? twMerge(inactiveStyles, activeStyles) : inactiveStyles} `}
            >
              <TbSunHigh className="h-5 w-5 stroke-2" />
              <span>Light</span>
            </li>
            <li
              onClick={selectOption}
              id="dark"
              className={`${selectedTheme === 'dark' ? twMerge(inactiveStyles, activeStyles) : inactiveStyles} `}
            >
              <TbMoonStars className="h-5 w-5 stroke-2" />
              <span>Dark</span>
            </li>
            <li
              onClick={selectOption}
              id="system"
              className={`${selectedTheme === 'system' ? twMerge(inactiveStyles, activeStyles) : inactiveStyles} `}
            >
              <TbDeviceDesktop className="h-5 w-5 stroke-2" />
              <span>System</span>
            </li>
          </ul>
        </Popup>
      </div>
    </>
  );
}
