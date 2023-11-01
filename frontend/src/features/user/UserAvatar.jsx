import PropTypes from 'prop-types';

export default function UserAvatar({ firstname, lastname }) {
  const userInitials = `${firstname?.slice(0, 1)}${lastname?.slice(0, 1)}`;

  return (
    <>
      <div className="relative">
        <div className="xxs:h-9 xxs:w-9 xxs:p-5 xxs:text-base flex h-5 w-5 select-none items-center justify-center rounded-full bg-primary-green-500 p-4 text-[10px] font-normal text-white dark:bg-primary-green-600">
          {userInitials}
        </div>
      </div>
    </>
  );
}

UserAvatar.propTypes = {
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
};
