import PropTypes from 'prop-types';
import UserAvatar from './UserAvatar';
import Tooltip from '../../ui/Tooltip';

export default function UserInfo({ firstname, lastname, email }) {
  return (
    <div className="flex items-center justify-start gap-2">
      <UserAvatar firstname={firstname} lastname={lastname} className="p-1" />
      <div>
        <div className="flex text-xs font-semibold md:text-sm">
          <span className="w-32 truncate md:w-44">{`${firstname} ${lastname}`}</span>
        </div>
        <div className="group/tooltip relative flex text-[10px] md:text-xs">
          <span className="w-32 truncate md:w-44">{email}</span>
          <Tooltip text={email} />
        </div>
      </div>
    </div>
  );
}

UserInfo.propTypes = {
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
};
