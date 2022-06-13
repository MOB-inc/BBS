/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './index.scss';

function DateRangePicker(props) {
  const { startDate, endDate, handlerOnChange, dateFormat, placeholderText } =
    props;
  return (
    <div className="date-range-picker-wrapper">
      <DatePicker
        className="date-range-picker"
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          handlerOnChange(update);
        }}
        dateFormat={dateFormat}
        placeholderText={placeholderText}
      />
    </div>
  );
}

DateRangePicker.propTypes = {
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  handlerOnChange: PropTypes.func.isRequired,
  dateFormat: PropTypes.string,
  placeholderText: PropTypes.string,
};
DateRangePicker.defaultProps = {};

export default DateRangePicker;
