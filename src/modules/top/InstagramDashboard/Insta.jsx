import React, { useState, useEffect } from 'react';
import useFetch from 'use-http';
import Typography from '@material-ui/core/Typography';
import Select, { components } from 'react-select';
import Radio from '@material-ui/core/Radio';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles, styled } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box'; // eslint-disable-line import/no-extraneous-dependencies
import Card from '@material-ui/core/Card';
import PropTypes from 'prop-types';
import { Skeleton } from '@material-ui/lab';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';

import { ReactComponent as ArrowDown } from '../../../commons/icons/arrow-down-select.svg';

import { ReactComponent as InstaGramIcon } from '../../../commons/icons/instagram-logo.svg';
import MiniCard from '../../../commons/components/TopMiniCard';
import LineChart from '../../../commons/components/LineChart';
import BarAndPieChart from '../../../commons/components/BarAndPieChart';
import HorizontalBarChart from '../../../commons/components/HorizontalBarChart';
import NoDataFound from '../../../commons/components/NoDataFound';
import commafy from '../../../commons/helpers/commaFy';
import DateRangePicker from '../../../commons/components/DateRangePicker';
import {
  INSTAGRAM_DASHBOARD,
  LOCATION_FOR_INSTAGRAM,
} from '../../../commons/constants/url';

import './insta.scss';
import config from '../../../OEMConfig';

const Insta = () => {
  const [selectedOptionDate, setSelectedOptionDate] = useState(6);
  const [selectedTab, setSelectedTab] = useState('0');
  const [cardTabsDetails, setCardTabsDetails] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [selectedTabnfo, setSelectedTabInfo] = useState({});
  const [selectedValue, setSelectedValue] = useState('');
  const [locationsArr, setLocationsArr] = useState([]);
  const [labelLineChart, setLabelLineChart] = useState([]);
  const [valueFollowersYAxisLineChart, setValueFollowersYAxisLineChart] =
    useState([]);
  const [valueFollowsYAxisLineChart, setValueFollowsYAxisLineChart] = useState(
    [],
  );
  const [valuePostYAxisLineChart, setValuePostYAxisLineChart] = useState([]);
  const [valueProfileYAxisLineChart, setValueProfileYAxisLineChart] = useState(
    [],
  );
  const [valueReachYAxisLineChart, setValueReachYAxisLineChart] = useState([]);

  const [barChartLabels, setBarChartLabels] = useState([]);
  const [barChartValuesArr, setBarChartValuesArr] = useState([]);
  const [pieChartLabels, setPieChartLabels] = useState([]);
  const [pieChartValues, setPieChartValues] = useState([]);

  const [valueYAxisLineChart, setValueYAxisLineChart] = useState([]);
  const [isDataAvaialble, setIsDataAvaialble] = useState(true);
  const [filterStartEndDate, setFilterStartEndDate] = useState({
    startDate: moment().subtract(6, 'd').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  });
  // const [barChartDataLabel,setBarChartDataLabel] = useState([])

  const [valueTabs, setValueTabs] = React.useState(0);

  const [loader, setLoader] = useState(false);
  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const { get: getInstaDashboard } = useFetch(
    INSTAGRAM_DASHBOARD(
      selectedValue,
      filterStartEndDate.startDate,
      filterStartEndDate.endDate,
    ),
  );

  const { get: getLocations } = useFetch(LOCATION_FOR_INSTAGRAM);
  // const [token] = useLocalStorageState(AUTH_KEY, () => null);

  // this is for table data in Card
  const [rowData, setRowData] = useState([]);
  const [likeRowData, setLikeRowData] = useState([]);
  const [impressionRowData, setImpressionRowData] = useState([]);

  const { t } = useTranslation(['top']);

  const getLocationsData = async () => {
    const responseData = await getLocations();
    if (responseData?.success) {
      const locationArrLoop = responseData.result.data.map((val) => ({
        label: val.name,
        value: val.id,
      }));
      console.log('locationArrLoop', locationArrLoop);

      setLocationsArr(locationArrLoop);
    }
  };

  const getInstaData = async () => {
    console.log('get insta data called');
    setLoader(true);
    const responseData = await getInstaDashboard();
    if (responseData?.success) {
      if (responseData.result.latest !== null) {
        setIsDataAvaialble(true);
        setRowData(responseData.result.top_posts?.like);
        setLikeRowData(responseData.result.top_posts?.like);
        setImpressionRowData(responseData.result.top_posts?.impressions);
        const cardsData = [
          {
            incDcrCount: commafy(
              responseData.result.versus?.ig_followers
                ? responseData.result.versus?.ig_followers
                : 0,
            ),
            id: '0',
            numberCount: commafy(responseData.result.latest?.ig_followers),
            secondHeader: `${t('top:INSTAPAGE.FOLLOWERS')}`,
            isUpCount:
              responseData.result.versus?.ig_followers >= 0 ? 'true' : 'false',
            lastTimeString: `${selectedOptionDate + 1} ${t(
              'top:INSTAPAGE.DAYS',
            )}`,
          },
          {
            incDcrCount: commafy(
              responseData.result.versus?.ig_follows
                ? responseData.result.versus?.ig_follows
                : 0,
            ),
            id: '1',
            numberCount: commafy(responseData.result.latest?.ig_follows),
            secondHeader: `${t('top:INSTAPAGE.FOLLOWING')}`,
            isUpCount:
              responseData.result.versus?.ig_follows >= 0 ? 'true' : 'false',
            lastTimeString: `${selectedOptionDate + 1} ${t(
              'top:INSTAPAGE.DAYS',
            )}`,
          },
          {
            incDcrCount: commafy(
              responseData.result.versus?.post_total
                ? responseData.result.versus?.post_total
                : 0,
            ),
            id: '2',
            numberCount: commafy(responseData.result.latest?.post_total),
            secondHeader: `${t('top:INSTAPAGE.POSTS')}`,
            isUpCount:
              responseData.result.versus?.post_total >= 0 ? 'true' : 'false',
            lastTimeString: `${selectedOptionDate + 1} ${t(
              'top:INSTAPAGE.DAYS',
            )}`,
          },
          {
            incDcrCount: commafy(
              responseData.result.versus?.profile_total
                ? responseData.result.versus?.profile_total
                : 0,
            ),
            id: '3',
            numberCount: commafy(responseData.result.latest?.profile_total),
            secondHeader: `${t('top:INSTAPAGE.PROFILE_VIEWS')}`,
            isUpCount:
              responseData.result.versus?.profile_total >= 0 ? 'true' : 'false',
            lastTimeString: `${selectedOptionDate + 1} ${t(
              'top:INSTAPAGE.DAYS',
            )}`,
          },
          {
            incDcrCount: commafy(
              responseData.result.versus?.reach_total
                ? responseData.result.versus?.reach_total
                : 0,
            ),
            id: '4',
            numberCount: commafy(responseData.result.latest?.reach_total),
            secondHeader: `${t('top:INSTAPAGE.TOTAL_REACH')}`,
            isUpCount:
              responseData.result.versus?.reach_total >= 0 ? 'true' : 'false',
            lastTimeString: `${selectedOptionDate + 1} ${t(
              'top:INSTAPAGE.DAYS',
            )}`,
          },
        ];
        setCardTabsDetails(cardsData);
        const dataArrTopCites = [];
        const labelsArrCities = Object.keys(
          responseData.result.top_cities ? responseData.result.top_cities : [],
        );
        const valuesArrCites = Object.values(
          responseData.result.top_cities ? responseData.result.top_cities : [],
        );
        valuesArrCites.map((data, ind) =>
          dataArrTopCites.push({
            data,
            label: labelsArrCities[ind],
          }),
        );
        const descendingArr = dataArrTopCites.sort(
          (val1, val2) => val2.data - val1.data,
        );
        setBarChartData(descendingArr);

        /*eslint-disable */
        const arrLabelLineChart = [];
        const arrValFollowers = [];
        const arrValFollows = [];
        const arrValPost = [];
        const arrValProfile = [];
        const arrValReach = [];
        const labelXAxisLineChart = responseData.result.daily?.map((val) => {
          arrLabelLineChart.push(val.date);
          arrValFollowers.push(val.followers);
          arrValFollows.push(val.follows);
          arrValPost.push(val.post);
          arrValProfile.push(val.profile);
          arrValReach.push(val.reach);
          console.log('val', val);
        });
        setLabelLineChart(arrLabelLineChart);
        setValueYAxisLineChart(arrValFollowers);
        setValueFollowersYAxisLineChart(arrValFollowers);
        setValueFollowsYAxisLineChart(arrValFollows);
        setValuePostYAxisLineChart(arrValPost);
        setValueProfileYAxisLineChart(arrValProfile);
        setValueReachYAxisLineChart(arrValReach);

        if (
          responseData.result.genders &&
          responseData.result.genders !== null
        ) {
          setPieChartLabels(responseData.result.genders?.labels);
          setPieChartValues(responseData.result.genders?.value);
        }

        const multiDimArr = [];
        if (
          responseData.result.gender_age &&
          responseData.result.gender_age !== null
        ) {
          multiDimArr[0] = responseData.result.gender_age.male;
          multiDimArr[1] = responseData.result.gender_age.female;
          multiDimArr[2] = responseData.result.gender_age.unknown;
          setBarChartValuesArr(multiDimArr);
          setBarChartLabels(responseData.result.gender_age.labelsYAxis);
        }

        const dataArrBarAndPie = responseData.result.gender_age
          ? responseData.result.gender_age
          : {};
        const objKeyFirstDataSet = Object.keys(dataArrBarAndPie);

        /*eslint-disable */
        console.log(
          'valueFollowersYAxisLineChart',
          dataArrBarAndPie,
          objKeyFirstDataSet,
        );
      } else {
        setIsDataAvaialble(false);
      }
      setLoader(false);
    }
  };

  useEffect(() => {
    console.log('selectedValue', selectedValue);
    if (
      selectedValue !== ' ' &&
      selectedValue !== null &&
      locationsArr.length > 0
    ) {
      getInstaData();
    }
  }, [selectedValue]);

  useEffect(() => {
    if (
      locationsArr &&
      locationsArr.length > 0 &&
      locationsArr[0].value !== undefined
    ) {
      console.log('locationsArr[0].value', locationsArr[0]?.value);
      setSelectedValue(locationsArr[0].value);
    }
  }, [locationsArr]);

  useEffect(() => {
    console.log('filterStartEndDate.startDate', filterStartEndDate.startDate);
    if (
      filterStartEndDate.startDate !== '' &&
      filterStartEndDate.startDate !== undefined &&
      locationsArr.length > 0
    ) {
      console.log('nsta data is called from here');
      getInstaData();
    }
  }, [filterStartEndDate]);

  const handleChange = (event) => {
    setSelectedValue(event.value);
  };

  const handleChangeDate = (event) => {
    console.log('event', event);
    if (event.value === 'custom_range') {
      setIsOpenDatePicker(true);
      setSelectedOptionDate(event.value);
      return;
    }
    setDateRange([null, null]);
    setIsOpenDatePicker(false);

    const dateTo = moment().subtract(event.value, 'd').format('YYYY-MM-DD');
    const dateFrom = moment().format('YYYY-MM-DD');
    setFilterStartEndDate({
      startDate: dateTo,
      endDate: dateFrom,
    });
    console.log('date start and end', dateTo, dateFrom);
    setSelectedOptionDate(event.value);
  };

  const handleChangeDatepicker = async (update) => {
    const [localStartDate, localEndDate] = update;
    setDateRange(update);
    if (localStartDate && localEndDate) {
      const dateTo = moment(localStartDate).format('YYYY-MM-DD');
      const dateFrom = moment(localEndDate).format('YYYY-MM-DD');
      setFilterStartEndDate({
        startDate: dateTo,
        endDate: dateFrom,
      });
    }
  };

  const handleChangeTabs = async (event, newValue) => {
    setValueTabs(newValue);

    if (newValue === 0) {
      setRowData(likeRowData);
    } else {
      setRowData(impressionRowData);
    }
  };

  useEffect(() => {
    getLocationsData();
  }, []);

  const options = [
    { value: 6, label: `${t('top:COMMON.LAST_7_dAYS')}` },
    { value: 29, label: `${t('top:COMMON.LAST_30_dAYS')}` },
    { value: 179, label: `${t('top:COMMON.LAST_180_dAYS')}` },
    { value: 364, label: `${t('top:COMMON.LAST_365_dAYS')}` },
    /* { value: 'maximum_duration', label: `${t('top:COMMON.MAXIMUM_DURATION')}` },*/
    { value: 'custom_range', label: `${t('top:COMMON.CUSTOM_RANGE')}` },
  ];

  useEffect(() => {
    if (cardTabsDetails && cardTabsDetails.length > 0) {
      const dataSelectedCard = cardTabsDetails.find((val) => val.id === '0');
      setSelectedTabInfo(dataSelectedCard);
    }
  }, [cardTabsDetails]);

  const GreenRadio = withStyles({
    root: {
      color: '#000000',
      '&$checked': {
        color: config().side_menu_color,
      },
    },
    checked: {},
  })((props) => {
    return <Radio color="default" {...props} />;
  });

  const { Option } = components;
  const IconOption = (props) => {
    const { data, value } = props;
    console.log('value in select option', value, selectedValue);
    return (
      <Option {...props}>
        <Box display="flex" alignItems="center">
          <Box>
            <GreenRadio
              checked={selectedValue === value}
              // onChange={(event) => handleChange(event,value,"r")}
              value={value}
              name="radio-buttons"
              label={data.label}
              size="small"
              color={config().side_menu_color}
              inputProps={{ 'aria-label': 'A' }}
            />
          </Box>
          <Box>{data.label}</Box>
        </Box>
      </Option>
    );
  };
  IconOption.defaultProps = {
    data: '',
    value: '',
  };
  IconOption.propTypes = {
    data: PropTypes.string,
    value: PropTypes.string,
  };

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <ArrowDown />
      </components.DropdownIndicator>
    );
  };

  const changeSelectedTab = (id) => {
    const dataSelectedCard = cardTabsDetails.find((val) => val.id === id);
    setSelectedTabInfo(dataSelectedCard);
    setSelectedTab(id);
  };

  useEffect(() => {
    let dataValuesArr = [];
    if (selectedTabnfo.id === '0') {
      dataValuesArr = [...valueFollowersYAxisLineChart];
    } else if (selectedTabnfo.id === '1') {
      dataValuesArr = [...valueFollowsYAxisLineChart];
    } else if (selectedTabnfo.id === '2') {
      dataValuesArr = [...valuePostYAxisLineChart];
    } else if (selectedTabnfo.id === '3') {
      dataValuesArr = [...valueProfileYAxisLineChart];
    } else if (selectedTabnfo.id === '4') {
      dataValuesArr = [...valueReachYAxisLineChart];
    }
    setValueYAxisLineChart(dataValuesArr);
  }, [selectedTabnfo]);

  const customStylesDateSelect = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? config().side_menu_selected_color
        : 'white',
      color: '#666666',
    }),
  };

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? 'white' : 'white',
      color: '#666666',
    }),
    menu: (styles) => ({
      ...styles,
      width: '330px',
      flexDirection: 'reverse-row',
    }),
  };

  const AntTabs = styled(Tabs)({
    // borderBottom: '1px solid #e8e8e8',
    '& .MuiTabs-indicator': {
      backgroundColor: config().side_menu_color,
      height: '0px',
      // border:"1px solid black"1
    },
  });

  const convertDateTime = (stringDate) => {
    const format = 'YYYY-MM-DD HH:mm';
    const date = moment(stringDate);
    return moment(date).add(9, 'hours').format(format);
  };

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
      minHeight: '38px',
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
        // border: '1px solid rgb(204, 0, 153)',
        padding: '10px',
        borderRadius: '10px',
        // backgroundColor: 'rgb(204 0 153)',
        color: config().side_menu_color,
        minHeight: '38px',
        textDecoration: 'underline',
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
        className="mobile-display-block mobile-margin-top-0-from-header"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box display="flex" alignItems="center">
          <Box>
            <InstaGramIcon />
          </Box>
          <Box marginLeft="20px">
            <Typography className="instagram-head-text">Instagram</Typography>
          </Box>
        </Box>
        <Box
          className="mobile-display-block mobile-margin-top-10"
          alignItems="center"
          display="flex"
        >
          <Box>
            <Select
              components={{
                DropdownIndicator,
                Option: IconOption,
                IndicatorSeparator: () => null,
              }}
              // styles={customStyles}
              // isMulti
              // closeMenuOnSelect
              className="select-width-tree-select-group"
              styles={customStyles}
              options={locationsArr}
              value={locationsArr.filter(
                (option) => option.value === selectedValue,
              )}
              onChange={(event) => handleChange(event, '', '')}
            />
            {/* <Select components={{ Option: IconOption }} isMulti name="hvhgvghvghvghvh" options={options} /> */}
          </Box>






          <Box
            className="mobile-margin-top-10 desktop-margn-left-10"
            style={{ position: 'relative' }}
            flex="1"
          >
            <Select
              components={{
                DropdownIndicator,
                IndicatorSeparator: () => null,
              }}
              styles={customStylesDateSelect}
              className="select-width-select-days"
              closeMenuOnSelect
              options={options}
              defaultValue={selectedOptionDate}
              value={options.filter(
                (option) => option.value === selectedOptionDate,
              )}
              onChange={(event) => handleChangeDate(event, '', '')}
            />
            {isOpenDatePicker && (
              <DateRangePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                handlerOnChange={handleChangeDatepicker}
                dateFormat="yyyy/MM/dd"
                placeholderText={t('top:COMMON.DATA_RANGE_PLACEHOLDER')}
              />
            )}
          </Box>



          
        </Box>
      </Box>
      {isDataAvaialble && locationsArr.length > 0 ? (
        <>
          {loader ? (
            <Box style={{ display: 'flex', paddingTop: '40px' }}>
              <Card style={{ borderRadius: '16px' }} sx={{ minWidth: 120 }}>
                <CardContent>
                  <Skeleton height={40} width={150} />
                  <Skeleton height={40} width={150} />
                  <Skeleton height={40} width={150} />
                </CardContent>
              </Card>
              <Card
                style={{ borderRadius: '16px', marginLeft: '10px' }}
                sx={{ minWidth: 168, marginLeft: '10px' }}
              >
                <CardContent>
                  <Skeleton height={40} width={150} />
                  <Skeleton height={40} width={150} />
                  <Skeleton height={40} width={150} />
                </CardContent>
              </Card>
              <Card
                style={{ borderRadius: '16px', marginLeft: '10px' }}
                sx={{ minWidth: 168, marginLeft: '10px' }}
              >
                <CardContent>
                  <Skeleton height={40} width={150} />
                  <Skeleton height={40} width={150} />
                  <Skeleton height={40} width={150} />
                </CardContent>
              </Card>
              <Card
                style={{ borderRadius: '16px', marginLeft: '10px' }}
                sx={{ minWidth: 168 }}
              >
                <CardContent>
                  <Skeleton height={40} width={150} />
                  <Skeleton height={40} width={150} />
                  <Skeleton height={40} width={150} />
                </CardContent>
              </Card>
              <Card
                style={{ borderRadius: '16px', marginLeft: '10px' }}
                sx={{ minWidth: 168, marginLeft: '10px' }}
              >
                <CardContent>
                  <Skeleton height={40} width={150} />
                  <Skeleton height={40} width={150} />
                  <Skeleton height={40} width={150} />
                </CardContent>
              </Card>
            </Box>
          ) : (
            <Box
              style={{ display: 'flex', justifyContent: 'space-between', overflowX: 'auto', paddingTop: '40px' }}
              // className="margin-top-to-header"
              // display="flex"
              // flexWrap="wrap"
              // justifyContent="space-between"
            >
              {cardTabsDetails.map((val) => {
                return (
                  <MiniCard
                    incDcrCount={val.incDcrCount}
                    isLoader={loader}
                    selectedTab={selectedTab}
                    changeSelectedTab={changeSelectedTab}
                    id={val.id}
                    numberCount={val.numberCount}
                    secondHeader={val.secondHeader}
                    isUpCount={val.isUpCount}
                    lastTimeString={val.lastTimeString}
                  />
                );
              })}
            </Box>
          )}

          <Box>
            <LineChart
              labelLineChart={labelLineChart}
              loader={loader}
              valueYAxisLineChart={valueYAxisLineChart}
              selectedTabnfo={selectedTabnfo}
              lineChartTitle={t('top:INSTAPAGE.FOLLOWERS')}
            />
          </Box>
          <Grid container spacing={2} className="grid-tab-parent-div">
            <Grid item sm={12} md={6}>
              <Card style={{ borderRadius: '16px', width: '100%' }}>
                <CardContent className="insta-table-card-parent-div">
                  <Typography className="header-table-cards">
                    {t('top:INSTAPAGE.TOP_3_LKES_&_VIEWS')}
                  </Typography>
                  <Box display="flex" flexDirection="row-reverse">
                    <AntTabs
                      value={valueTabs}
                      onChange={handleChangeTabs}
                      className="padding-all-tabs"
                      textAlign="end"
                      aria-label="ant example"
                    >
                      <AntTab
                        className="tabs-icon-background"
                        label={t('top:INSTAPAGE.LIKE')}
                      />
                      <AntTab
                        className="tabs-icon-background"
                        label={t('top:INSTAPAGE.VIEWS')}
                      />
                    </AntTabs>
                  </Box>
                  <TableContainer>
                    <Table
                      sm={{ minWidth: 650, minHeight: 200 }}
                      sx={{ minWidth: 650, minHeight: 200 }}
                      size="small"
                      aria-label="simple table"
                    >
                      <TableHead>
                        <TableRow
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                        >
                          <TableCell />
                          <TableCell align="right" />
                          <TableCell
                            className="table-header-tab"
                            align="right"
                          />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {!loader ? (
                          rowData && rowData.length > 0 ? (
                            rowData?.map((row) => (
                              <React.Fragment key={row[0].id}>
                                <TableRow
                                  key={row.temp_image_url}
                                  sx={{
                                    '&:last-child td, &:last-child th': {
                                      border: 0,
                                    },
                                  }}
                                >
                                  <TableCell component="th" scope="row">
                                    <a
                                      href={row[0].permalink}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <Box
                                        style={{
                                          width: 69,
                                          height: 39,
                                          backgroundImage: `url(${
                                            row[1].temp_image_url || ''
                                          })`,
                                          objectFit: 'cover',
                                          backgroundSize: 'cover',
                                          backgroundRepeat: 'no-repeat',
                                          backgroundPosition: 'center',
                                        }}
                                      >
                                        {/* <img className="image-table-likes" src={`${row[1].temp_image_url}`} alt={row[1].temp_image_url} /> */}
                                      </Box>
                                    </a>
                                  </TableCell>
                                  <TableCell width="40%" align="right">
                                    {convertDateTime(row[0].timestamp)}
                                  </TableCell>
                                  {valueTabs === 0 ? (
                                    <TableCell align="right">
                                      {row[0].like_count}
                                    </TableCell>
                                  ) : (
                                    <TableCell align="right">
                                      {row[0].impressions}
                                    </TableCell>
                                  )}
                                </TableRow>
                              </React.Fragment>
                            ))
                          ) : (
                            <TableRow
                              key="0"
                              sx={{
                                '&:last-child td, &:last-child th': {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                <Box>No Data Found</Box>
                              </TableCell>
                            </TableRow>
                          )
                        ) : (
                          <>
                            <Skeleton height={40} width={550} />
                            <Skeleton height={40} width={550} />
                            <Skeleton height={40} width={550} />
                          </>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item sm={12} md={6}>
              <Card style={{ borderRadius: '16px' }}>
                <CardContent className="insta-chart-parent-div">
                  {barChartData && Object.keys(barChartData).length !== 0 ? (
                    <HorizontalBarChart
                      barChartData={barChartData}
                      barAndPieChartTitle={t(
                        'top:INSTAPAGE.TOP_3_FOLLOWERS_BY_REGION',
                      )}
                    />
                  ) : (
                    <Box>
                      <Box className="header-bar-pie-chart">
                        {t('top:INSTAPAGE.TOP_3_FOLLOWERS_BY_REGION')}
                      </Box>
                      <Box
                        className="no-data-found-margin-top-horizontal-bar-chart"
                        textAlign="center"
                      >
                        {'No Data Found'}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Box>
            <BarAndPieChart
              chartTypeDashboard="insta"
              barGraphDataLabel={barChartLabels}
              barGraphDataValue={barChartValuesArr}
              pieGraphDataLabel={pieChartLabels}
              pieGraphDataValue={pieChartValues}
              barAndPieChartTitle={t('top:INSTAPAGE.FOLLOWER_AGE_GENDER')}
            />
          </Box>
        </>
      ) : (
        <>
          <NoDataFound />
        </>
      )}
    </>
  );
};

export default Insta;
