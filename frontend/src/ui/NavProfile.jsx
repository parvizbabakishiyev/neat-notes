import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TbChevronRight } from 'react-icons/tb';
import { twMerge } from 'tailwind-merge';
import UserInfo from '../features/user/UserInfo';
import useGetOwnUser from '../features/user/useGetOwnUser';

export default function NavProfile({ to }) {
  const { user, isSuccess } = useGetOwnUser();
  const inactiveStyles =
    'block rounded-md text-neutral-800 dark:text-neutral-300 px-2 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm font-semibold flex gap-3 items-center select-none';
  const activeStyles =
    'bg-primary-green-100 dark:bg-primary-green-900 hover:bg-primary-green-100 dark:hover:bg-primary-green-900';
  let styles;

  if (!isSuccess) return null;

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
        <div className="mt-auto flex w-full items-center justify-between gap-2 text-neutral-800 dark:text-neutral-300 [&>svg]:h-5 [&>svg]:w-5 [&>svg]:stroke-2">
          <UserInfo firstname={user.firstname} lastname={user.lastname} email={user.email} />
          <TbChevronRight />
        </div>
      </NavLink>
    </li>
  );
}

NavProfile.propTypes = {
  to: PropTypes.string,
};
