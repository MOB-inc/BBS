/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import { ReactComponent as CalendarIcon } from '../../../../commons/icons/calendar.svg';
import './navigation.scss';

const DatePickerIcon = React.forwardRef(({ onClick }, ref) => (
  <CalendarIcon height={30} width={30} onClick={onClick} ref={ref} />
));

function RecognitionNavigation({
  summary,
  dateChangeHandler,
  startDate,
  endDate,
}) {
  const { t } = useTranslation(['recognition']);
  const url = '/recognition';
  return (
    <div className="recognition-navigation">
      <div className="tab">
        <NavLink to={`${url}/approval`} activeClassName="navigation-active">
          {t('recognition:APPROVAL.TAB_NAME')} (
          {summary?.listCount ? summary.listCount : 0})
        </NavLink>
      </div>
      <div className="tab">
        <NavLink to={`${url}/remand`} activeClassName="navigation-active">
          {t('recognition:REMAND.TAB_NAME')} (
          {summary?.remandCount ? summary.remandCount : 0})
        </NavLink>
      </div>
      <div className="calendar-filter">
        <DatePicker
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={dateChangeHandler}
          customInput={<DatePickerIcon />}
          shouldCloseOnSelect={false}
        />
      </div>
    </div>
  );
}
RecognitionNavigation.propTypes = {
  summary: PropTypes.object.isRequired,
  dateChangeHandler: PropTypes.func.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
};
DatePickerIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default RecognitionNavigation;
