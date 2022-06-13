import React from 'react';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import './index.scss';
import { Box } from '@material-ui/core';

const index = () => {
  const styleIconFill = {
    path: {
      fill: '#CC0099',
    },
  };

  return (
    <Box className="no-data-found-parent">
      <FindInPageIcon style={styleIconFill} className="no-data-found-icon" />
      <Box className="no-data-found-text">No Data Found</Box>
    </Box>
  );
};

export default index;
