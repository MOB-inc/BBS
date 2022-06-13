import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import ReactLoading from 'react-loading';

const Loading = (props) => {
  const { loading } = props;
  return (
    <>
      {loading && (
        <div className="loading">
          <ReactLoading
            className="spinner"
            type="bubbles"
            width="150px"
            height="150px"
          />
        </div>
      )}
    </>
  );
};

Loading.propTypes = {
  loading: PropTypes.bool,
};

Loading.defaultProps = {
  loading: false,
};
export default Loading;
