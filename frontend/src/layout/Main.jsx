import PropTypes from 'prop-types';

export default function Main({ children }) {
  return <main className="no-scrollbar h-full overflow-y-scroll">{children}</main>;
}

Main.propTypes = {
  children: PropTypes.node,
};
