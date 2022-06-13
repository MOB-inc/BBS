/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

function Switch(props) {
  const { id, ...rest } = props;
  return (
    <span className="c-switch">
      <input type="checkbox" id={id} {...rest} />
      <label htmlFor={id} />
    </span>
  );
}

Switch.propTypes = {
  id: PropTypes.string.isRequired,
};
Switch.defaultProps = {};

export default Switch;
