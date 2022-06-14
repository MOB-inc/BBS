/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import SwitchMui from '@material-ui/core/Switch';

function Switch(props) {
  const { id, ...rest } = props;
  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
    console.log("bbb");

  };
  return (
    <>
      {/* <span className="c-switch">
        <input type="checkbox" id={id} {...rest} />
        <label htmlFor={id} /> */}
      <SwitchMui
        id={id} {...rest}
        checked={state.checkedA}
        inputProps={{ 'aria-label': 'secondary checkbox' }}
        name="checkedA"
        onChange={handleChange}
      />
      {/* </span> */}
    {console.log("aaa")}
    </>
  );
}

Switch.propTypes = {
  id: PropTypes.string.isRequired,
};
Switch.defaultProps = {};

export default Switch;
