import PropTypes from 'prop-types';
import { useIsMutating } from '@tanstack/react-query';
import { TbX } from 'react-icons/tb';
import Button from '../../ui/Button';

export default function Tag({ tag, onClick, isRemovable }) {
  const isMutating = useIsMutating();

  return (
    <li
      className={`group/tag flex h-5 w-fit items-center justify-between rounded-full bg-black/5 px-3 py-3 text-xs font-normal lowercase text-neutral-800 transition-all ease-linear dark:bg-white/10 dark:text-neutral-300 ${
        isRemovable || 'hover:gap-1 hover:pr-[0.125rem]'
      }`}
      onClick={e => e.stopPropagation()}
    >
      <span className="pb-0.5">{tag}</span>
      {isRemovable || (
        <Button
          btnType="icon-xs"
          className="h-0 w-0 p-0 group-hover/tag:h-4 group-hover/tag:w-4 group-hover/tag:p-0.5"
          onClick={onClick}
          id={tag}
          disabled={isMutating > 0}
        >
          <TbX />
        </Button>
      )}
    </li>
  );
}

Tag.propTypes = {
  tag: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  isRemovable: PropTypes.bool,
};
