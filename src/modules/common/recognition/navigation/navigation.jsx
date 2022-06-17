/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
// import DatePicker from 'react-datepicker';
import ToggleButton from '@material-ui/lab/ToggleButton';
import Button from '@material-ui/core/Button';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { ReactComponent as CalendarIcon } from '../../../../commons/icons/calendar.svg';
import './navigation.scss';

const DatePickerIcon = React.forwardRef(({ onClick }, ref) => (
  <CalendarIcon height={30} width={30} onClick={onClick} ref={ref} />
));

function RecognitionNavigation(
  // {
  // summary
  // dateChangeHandler,
  // startDate,
  // endDate,
// }
) {
  const { t } = useTranslation(['recognition']);
  const url = '/recognition';
  const [alignment, setAlignment] = React.useState('first');
  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  
  return (
    <>
      <ToggleButtonGroup
      className="recognition-navigation"
      value={alignment}
      exclusive
      onChange={handleAlignment}
      aria-label="text alignment"
      >
        <ToggleButton value="first" aria-label="left aligned">
          <NavLink to={`${url}/approval`} activeClassName="active">
            {t('recognition:APPROVAL.TAB_NAME')} 
            {/* ({summary?.listCount ? summary.listCount : 0}) */}
          </NavLink>
        </ToggleButton>
        <ToggleButton value="center" aria-label="centered">
          <NavLink to={`${url}/remand`} activeClassName="active">
            {t('recognition:REMAND.TAB_NAME')}
            {/* ({summary?.remandCount ? summary.remandCount : 0}) */}
          </NavLink>
        </ToggleButton>
      </ToggleButtonGroup>
      <Button
          // onClick={bulkState ? toggleBulkApprovalModal : () => setBulkState(true)}
          // disabled={bulkState && bulkIds.size === 0}
          variant="contained"
          className="submit button"
          size="large"
      >
        {t('recognition:APPROVAL.APPROVAL_CONFIRMED')}
      </Button> 
    </>
    // <div className="recognition-navigation">
    //   <div className="calendar-filter">
    //     <DatePicker
    //       selectsRange
    //       startDate={startDate}
    //       endDate={endDate}
    //       onChange={dateChangeHandler}
    //       customInput={<DatePickerIcon />}
    //       shouldCloseOnSelect={false} />
    //   </div>
    // </div>
  )
}
// RecognitionNavigation.propTypes = {
  // summary: PropTypes.object.isRequired,
  // dateChangeHandler: PropTypes.func.isRequired,
  // startDate: PropTypes.string.isRequired,
  // endDate: PropTypes.string.isRequired,
// };
DatePickerIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default RecognitionNavigation;
