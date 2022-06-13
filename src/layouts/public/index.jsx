import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

function Public(props) {
  const { children } = props;
  return (
    <div className="public-page">
      <div className="content">{children}</div>
    </div>
  );
}

Public.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Public;
