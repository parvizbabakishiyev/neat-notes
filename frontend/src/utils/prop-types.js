import PropTypes from 'prop-types';

export const user = PropTypes.exact({
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
});

export const note = PropTypes.exact({
  title: PropTypes.string,
  textContent: PropTypes.string.isRequired,
  colorHex: PropTypes.string,
  user,
  sharedUsers: PropTypes.arrayOf(user),
  lastEditedBy: user,
  isArchived: PropTypes.bool,
  isTrashed: PropTypes.bool,
  tags: PropTypes.arrayOf(PropTypes.string),
  createdAt: PropTypes.number.isRequired,
  updatedAt: PropTypes.number.isRequired,
  archivedAt: PropTypes.number,
  trashedAt: PropTypes.number,
  id: PropTypes.string.isRequired,
});
