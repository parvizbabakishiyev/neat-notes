import { TbPaletteOff, TbCheck } from 'react-icons/tb';
import { twMerge } from 'tailwind-merge';
import { useIsMutating } from '@tanstack/react-query';
import useUpdateNote from './useUpdateNote';
import Tooltip from '../../ui/Tooltip';
import colors from '../../utils/colors';
import { note as propNote } from '../../utils/prop-types';
import capitalizeFirstLetter from '../../utils/capitalize-first-letter';

export default function ColorOptions({ note }) {
  const { updateNote } = useUpdateNote();
  const isMutating = useIsMutating();

  const changeColor = e => {
    // ignore the click if there is an ongoing mutation
    if (isMutating > 0) return;

    const selected = e.target.closest('li').id;
    if (!selected) return;
    updateNote({ note: { ...note, colorHex: selected } });
  };

  return (
    <ul className="flex w-[13.25rem] flex-wrap gap-1" onClick={changeColor}>
      {colors.map(({ name, colorHex, twClasses }) => {
        const isSelected = colorHex === note.colorHex;
        const optionStyle = twMerge(
          twClasses,
          isSelected
            ? 'border-primary-green-600 hover:border-primary-green-600 dark:border-primary-green-500 dark:hover:border-primary-green-500'
            : 'hover:border-neutral-600 dark:hover:border-neutral-300',
        );
        return (
          <li
            id={colorHex}
            key={name}
            className={`group/tooltip border-inset relative flex h-8 w-8 items-center justify-center rounded-full border-2 hover:border-2 ${optionStyle} ${
              isMutating > 0 ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            {name === 'default' && <TbPaletteOff className="stroke-neutral-800 dark:stroke-neutral-300" />}
            <Tooltip
              text={capitalizeFirstLetter(name)}
              className="group-hover/tooltip:invisible sm:group-hover/tooltip:visible"
            />
            {isSelected && (
              <TbCheck className="absolute right-[-3px] top-[-3px] rounded-full bg-primary-green-600 stroke-white dark:bg-primary-green-500" />
            )}
          </li>
        );
      })}
    </ul>
  );
}

ColorOptions.propTypes = {
  note: propNote,
};
