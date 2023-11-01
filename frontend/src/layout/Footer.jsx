import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';
import Button from '../ui/Button';

export default function Footer({ className }) {
  const classes = twMerge(
    'flex items-center h-full justify-center border-t border-neutral-200 dark:border-neutral-600 text-sm text-neutral-800 dark:text-neutral-300',
    className,
  );
  return (
    <footer className={classes}>
      <p className="text-center text-xs text-neutral-800 dark:text-neutral-300 lg:text-sm">
        Copyright &#169; {new Date().getFullYear()}. Developed by &nbsp;
        <Button
          isLink
          btnType="link"
          to="https://github.com/parvizbabakishiyev"
          target="_blank"
          className="text-xs lg:text-sm"
        >
          Parviz Babakishiyev
        </Button>
      </p>
    </footer>
  );
}

Footer.propTypes = {
  className: PropTypes.string,
};
