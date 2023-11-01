import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

export default function NavItem({ to, icon, desc, count }) {
  const inactiveStyles =
    'text-neutral-800 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 block rounded-md px-4 py-2 h-10 text-sm font-semibold flex gap-3 items-center [&>svg]:stroke-2 [&>svg]:h-5 [&>svg]:w-5 select-none transition-all';
  const activeStyles =
    'bg-primary-green-100 dark:bg-primary-green-900 hover:bg-primary-green-100 dark:hover:bg-primary-green-900';
  let styles;

  return (
    <li className={styles}>
      <NavLink
        to={to}
        className={({ isActive }) => {
          if (isActive) {
            styles = twMerge(inactiveStyles, activeStyles);
          } else {
            styles = inactiveStyles;
          }
          return styles;
        }}
        end
      >
        {icon}
        <span>{desc}</span>
        {count >= 0 && (
          <span className="ml-auto flex h-6 min-w-[24px] items-center justify-center rounded-full px-2 py-1 text-[0.625rem] font-bold">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </NavLink>
    </li>
  );
}

NavItem.propTypes = {
  to: PropTypes.string,
  icon: PropTypes.node,
  desc: PropTypes.string,
  count: PropTypes.number,
};
