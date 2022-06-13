/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

const Button = (props) => {
  const { children, type, onClickHandler, height, width, style, ...rest } =
    props;
  return (
    <button
      className="default"
      type={type}
      onClick={onClickHandler}
      style={{ height, width, ...style }}
      {...rest}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.any.isRequired,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClickHandler: PropTypes.func,
  style: PropTypes.any,
  height: PropTypes.number,
  width: PropTypes.number,
};

Button.defaultProps = {
  type: 'button',
  onClickHandler: () => {},
  style: {},
  height: 37,
  width: 114,
};

export default Button;
