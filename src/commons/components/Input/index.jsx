/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

const Input = (props) => {
  const { height, placeholder, style, ...rest } = props;
  return (
    <input
      className="input"
      style={{ ...style, height }}
      placeholder={placeholder}
      {...rest}
    />
  );
};

Input.propTypes = {
  height: PropTypes.number,
  placeholder: PropTypes.string,
  style: PropTypes.object,
};

Input.defaultProps = {
  height: 38,
  placeholder: '',
  style: {},
};
export default Input;
