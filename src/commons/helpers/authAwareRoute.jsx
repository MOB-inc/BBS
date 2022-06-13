/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AppContext } from './appContext';
import { LOGIN } from '../constants/url';

export const AuthAwareRoute = ({
  component: Component,
  isPrivate,
  ...rest
}) => {
  const { token } = useContext(AppContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        return isPrivate && !token ? (
          <Redirect to={LOGIN} />
        ) : (
          <Component {...props} />
        );
      }}
    />
  );
};
AuthAwareRoute.propTypes = {
  component: PropTypes.object.isRequired,
  isPrivate: PropTypes.bool,
};
AuthAwareRoute.defaultProps = {
  isPrivate: false,
};

export default AuthAwareRoute;
