import PropTypes from 'prop-types';
import Button from './Button';

export default function Confirmation({
  textHeading = '',
  textConfirm,
  textBtnCancel,
  textBtnConfirm,
  cancelBtnType = 'secondary-sm',
  cancelBtnDisabled,
  confirmBtnType = 'primary-sm',
  confirmBtnDisabled,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="flex flex-col gap-3 p-5">
      {textHeading && <h1 className="text-base font-bold sm:text-lg">{textHeading}</h1>}
      <div className="flex flex-col gap-10">
        <p className="text-sm sm:text-base">{textConfirm}</p>
        <div className={`flex items-center gap-2 self-end ${textBtnCancel || 'w-full'}`}>
          {textBtnCancel && (
            <Button btnType={cancelBtnType} onClick={onCancel} disabled={cancelBtnDisabled} className="min-w-[7rem]">
              {textBtnCancel}
            </Button>
          )}
          <Button
            btnType={confirmBtnType}
            onClick={onConfirm}
            disabled={confirmBtnDisabled}
            className={textBtnCancel && 'min-w-[7rem]'}
          >
            {textBtnConfirm}
          </Button>
        </div>
      </div>
    </div>
  );
}

Confirmation.propTypes = {
  textHeading: PropTypes.string,
  textConfirm: PropTypes.string,
  textBtnCancel: PropTypes.string,
  textBtnConfirm: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  cancelBtnType: PropTypes.string,
  cancelBtnDisabled: PropTypes.bool,
  confirmBtnType: PropTypes.string,
  confirmBtnDisabled: PropTypes.bool,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};
