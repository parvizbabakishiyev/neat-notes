import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

export default function Tooltip({ text, className }) {
  const classes = twMerge(
    'invisible absolute left-0 top-9 z-[30] min-w-max rounded-sm bg-zinc-700/95 px-2 py-1 text-xs text-white sm:group-hover/tooltip:visible',
    className,
  );
  return <span className={classes}>{text}</span>;
}

Tooltip.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
};
