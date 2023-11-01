import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';
import Tooltip from './Tooltip';
import { Link } from 'react-router-dom';

export default function Button({
  btnType,
  isLink = false,
  to,
  target = null,
  id,
  onClick,
  onSubmit,
  disabled,
  type = 'button',
  tooltipText,
  className,
  children,
}) {
  const all = `transition-all disabled:cursor-not-allowed`;
  const primaryColors = `disabled:bg-primary-green-200 dark:disabled:bg-primary-green-800 
  dark:disabled:text-primary-green-100 disabled:text-primary-green-700 text-white dark:text-primary-green-950 
  dark:bg-primary-green-400 bg-primary-green-500 hover:bg-primary-green-600 dark:hover:bg-primary-green-300 
  active:bg-primary-green-700 dark:active:bg-primary-green-500`;
  const secondaryColors = `text-neutral-800 dark:text-neutral-300 border-neutral-200 dark:border-neutral-600
  disabled:border-neutral-100 dark:disabled:border-neutral-300 disabled:text-neutral-600`;

  const btnClasses = {
    primary: `${all} ${primaryColors} select-none rounded px-4 py-1 w-full font-medium flex items-center 
      justify-center h-10 text-[15px]`,
    secondary: `${all} ${secondaryColors} select-none rounded px-4 py-1 flex w-full border items-center 
    h-10 justify-center text-[15px] font-medium hover:bg-neutral-100 active:bg-neutral-200 dark:hover:bg-neutral-800 dark:active:bg-neutral-700`,
    'secondary-sm': `${all} ${secondaryColors} select-none rounded px-4 py-1 flex border items-center h-8 justify-center text-sm font-medium 
      enabled:hover:bg-black/5 active:bg-black/10 dark:hover:bg-white/5 dark:active:bg-white/10`,
    'primary-sm': `${all} ${primaryColors} select-none rounded px-4 py-1 w-full flex items-center justify-center h-8 text-sm font-medium`,
    'primary-sm-delete': `${all} select-none disabled:bg-cerise-red-200 dark:disabled:bg-cerise-red-800 disabled:text-cerise-red-700 
    dark:disabled:text-cerise-red-100 block 
      rounded px-4 py-1 flex items-center h-8 justify-center text-sm text-white dark:text-cerise-red-950 font-medium bg-cerise-red-500 dark:bg-cerise-red-400
      hover:bg-cerise-red-600 dark:hover:bg-cerise-red-300 active:bg-cerise-red-700 dark:active:bg-cerise-red-500`,
    icon: `${all} relative rounded-full group/tooltip p-1 hover:bg-black/10 active:bg-black/20 dark:hover:bg-white/10 dark:active:bg-white/20
    [&>svg]:stroke-[2px] [&>svg]:h-[1.25rem] [&>svg]:w-[1.25rem] w-8 h-8 flex items-center justify-center transition-all`,
    'icon-sm': `${all} relative rounded-full group/tooltip p-1 hover:bg-black/10 dark:hover:bg-white/10 active:bg-black/20 dark:active:bg-white/20 
      [&>svg]:stroke-black/60 [&>svg]:dark:stroke-white/60 [&>svg]:stroke-[2px] [&>svg]:h-[1.125rem] [&>svg]:w-[1.125rem] w-7 h-7 flex 
      items-center justify-center`,
    'icon-xs': `${all} relative rounded-full group/tooltip p-0.5 hover:bg-black/10 dark:hover:bg-white/10 active:bg-black/20 dark:active:bg-white/20 
      [&>svg]:stroke-black/60 [&>svg]:dark:stroke-white/60 w-4 h-4 flex items-center justify-center`,
    input: `${all} select-none block text-md h-10 w-1/2 xxs:max-sm:w-[20rem] min-w-[16rem] xxs:min-w-[20rem] cursor-text rounded-md border 
      border-neutral-200 dark:border-neutral-600 px-4 text-left font-normal text-neutral-500 dark:text-neutral-500`,
    link: `${all} text-primary-green-500 dark:text-primary-green-400 dark:hover:text-primary-green-300 w-min 
    dark:active:text-primary-green-200 hover:text-primary-green-600 active:text-primary-green-700 font-semibold text-sm`,
    'text-icon-secondary': `${all} text-neutral-800 dark:text-neutral-300 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-600 
      dark:hover:bg-neutral-700 hover:bg-neutral-100 dark:active:bg-neutral-600 active:bg-neutral-200 select-none 
      rounded-md px-3 sm:px-4 py-1 sm:py-2 font-semibold border inline-flex items-center gap-2 [&>svg]:h-4 [&>svg]:w-4 text-sm`,
  };

  const classes = twMerge(btnClasses[btnType], className);

  if (isLink) {
    return (
      <>
        <Link
          className={classes}
          to={to}
          id={id}
          target={target}
          onClick={onClick}
          rel={target ? 'noopener noreferrer' : null}
        >
          {children}
          {tooltipText && <Tooltip text={tooltipText} />}
        </Link>
      </>
    );
  } else {
    return (
      <>
        <button className={classes} onClick={onClick} onSubmit={onSubmit} disabled={disabled} id={id} type={type}>
          {children}
          {tooltipText && <Tooltip text={tooltipText} />}
        </button>
      </>
    );
  }
}

Button.propTypes = {
  btnType: PropTypes.oneOf([
    'primary',
    'secondary',
    'primary-sm',
    'secondary-sm',
    'primary-sm-delete',
    'icon',
    'icon-sm',
    'icon-xs',
    'input',
    'link',
    'text-icon-secondary',
  ]),
  isLink: PropTypes.bool,
  to: PropTypes.string,
  id: PropTypes.string,
  target: PropTypes.oneOf(['_blank']),
  onClick: PropTypes.func,
  onSubmit: PropTypes.func,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['submit', 'button']),
  tooltipText: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};
