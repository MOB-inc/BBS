import React, { useEffect, useContext } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box'; // eslint-disable-line import/no-extraneous-dependencies
import { styled } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
// import axios from 'axios';
// import { useLocalStorageState } from 'ahooks';
// import { AUTH_KEY } from '../../commons/constants/key';
import Insta from './InstagramDashboard/Insta';
import Google from './GoogleDashboard/Google';
import Line from './LineDashboard/Line';
// import PhoneIcon from '@material-ui/icons-material/Phone';
// import FavoriteIcon from '@material-ui/icons-material/Favorite';
// import PersonPinIcon from '@material-ui/icons-material/PersonPin';
// import PropTypes from 'prop-types';
// import * as dayjs from 'dayjs';
// import { useDebounce } from 'ahooks';
// import useFetch from 'use-http';
// import DatePicker from 'react-datepicker';
// import { useTranslation } from 'react-i18next';
// import { parameterizeArray } from '../../commons/helpers/util';
// import Pagination from '../../commons/components/Pagination';
// import { AppContext } from '../../commons/helpers/appContext';
// import { ReactComponent as FilterIcon } from '../../commons/icons/filter.svg';
// import { ReactComponent as ArrowUp } from '../../commons/icons/arrow-up.svg';
// import { ReactComponent as ArrowDown } from '../../commons/icons/arrow-down.svg';
// import { ReactComponent as LinkIcon } from '../../commons/icons/external-link.svg';
// import { ReactComponent as DeleteIcon } from '../../commons/icons/delete.svg';
// import { ReactComponent as CalendarIcon } from '../../commons/icons/calendar.svg';
// import { ReactComponent as InstaIcon } from '../../commons/icons/top/insta-tab.svg';
import { ReactComponent as InstaIcon } from '../../commons/icons/sidebar/instagram.svg';
import { ReactComponent as GoogleIcon } from '../../commons/icons/sidebar/google.svg';
import { ReactComponent as LineTopIcon } from '../../commons/icons/sidebar/line-top.svg';
import config from '../../OEMConfig';
import { AppContext } from '../../commons/helpers/appContext';
import { BRIDGE_ID, BRIDGE_BOOK_ID } from '../../commons/constants/key';

import './top.scss';

const Top = () => {
  const { services } = useContext(AppContext);
  // const { t } = useTranslation(['dashboard']);
  const [value, setValue] = React.useState(
    services.has(BRIDGE_ID) || services.has(BRIDGE_BOOK_ID) ? 0 : 1,
  );
  // const [token] = useLocalStorageState(AUTH_KEY, () => null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(async () => {
    // axios.defaults.headers.common.authorization = `Bearer ${token}`;
    // const resultResponse = await axios.get(
    //   `https://dev-api.optimize-business.com/api/v1/top/instagram?location_id[]=1&start_date=2022-02-01&end_date=2022-03-01`,
    // );
    // console.log('resultResponse', resultResponse);
    // console.log('valye', value);
  }, [value]);

  const AntTabs = styled(Tabs)({
    // borderBottom: '1px solid #e8e8e8',
    '& .MuiTabs-indicator': {
      backgroundColor: config().side_menu_color,
      height: '0px',
      // border:"1px solid black"1
    },
  });

  const AntTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
      textTransform: 'none',
      minWidth: 0,
      [theme.breakpoints.up('sm')]: {
        minWidth: 0,
      },
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: theme.spacing(1),
      fill: 'rgba(0, 0, 0, 0.85)',
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:hover': {
        color: '#40a9ff',
        opacity: 1,
      },
      '&.Mui-selected': {
        color: '#1890ff',
        '& span svg': {
          fill: '#FFFFFF',
        },
        fontWeight: theme.typography.fontWeightMedium,
      },
      '&.PrivateTabIndicator-colorSecondary': {
        backgroundColor: config().side_menu_color,
        height: '0px',
      },

      '&.MuiTab-textColorInherit.Mui-selected': {
        height: '38px',
        padding: '10px',
        borderRadius: '25px',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
      },
      '&.Mui-focusVisible': {
        backgroundColor: '#d1eaff',
      },
      '& .MuiTabs-indicatorSpan': {
        backgroundColor: 'green',
      },
    }),
  );

  return (
    <>
      <Box
        display="flex"
        className="background-tabs"
        justifyContent="space-evenly"
      >
        <Box />
        <Box>
          <AntTabs
            value={value}
            onChange={handleChange}
            className="padding-all-tabs"
            aria-label="ant example"
          >
            {(services.has(BRIDGE_ID) || services.has(BRIDGE_BOOK_ID)) && (
              <AntTab
                className="tabs-icon-background"
                icon={<InstaIcon className="tab-icons-fill" />}
                aria-label="Tab 1"
                value={0}
              />
            )}
            <AntTab
              className="tabs-icon-background"
              icon={<GoogleIcon className="tab-icons-fill" />}
              aria-label="Tab 2"
              value={1}
            />
            {(services.has(BRIDGE_ID) || services.has(BRIDGE_BOOK_ID)) && (
              <AntTab
                className="tabs-icon-background"
                icon={<LineTopIcon className="tab-icons-fill" />}
                aria-label="Tab 3"
                value={2}
              />
            )}
          </AntTabs>
        </Box>
        <Box />
      </Box>
      <Box className="container">
        {value === 0 && (
          <Typography
            component="div"
            style={{ paddingTop: 24, paddingBottom: 24 }}
          >
            <Insta />
          </Typography>
        )}
        {value === 1 && (
          <Typography
            component="div"
            style={{ paddingTop: 24, paddingBottom: 24 }}
          >
            <Google />
          </Typography>
        )}
        {value === 2 && (
          <Typography
            component="div"
            style={{ paddingTop: 24, paddingBottom: 24 }}
          >
            <Line />
          </Typography>
        )}
      </Box>
    </>
  );
};

// Top.propTypes = {

// };

export default Top;
