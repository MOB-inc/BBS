import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Select, { components } from 'react-select';
import Radio from '@material-ui/core/Radio';

import Box from '@material-ui/core/Box'; // eslint-disable-line import/no-extraneous-dependencies
import Card from '@material-ui/core/Card';
import { withStyles } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';
import useFetch from 'use-http';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';

// import CardActions from '@material-ui/core/CardActions';

import CardContent from '@material-ui/core/CardContent';
import { useTranslation } from 'react-i18next';

import Rating from 'react-rating';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { ReactComponent as ArrowDown } from '../../../commons/icons/arrow-down-select.svg';

import { ReactComponent as GoogleIcon } from '../../../commons/icons/google-logo.svg';
import MiniCard from '../../../commons/components/TopMiniCard';
import LineChart from '../../../commons/components/LineChart';
import HorizontalBarChart from '../../../commons/components/HorizontalBarChart';
import NoDataFound from '../../../commons/components/NoDataFound';
import commafy from '../../../commons/helpers/commaFy';
import DateRangePicker from '../../../commons/components/DateRangePicker';

// import { ReactComponent as ArrowDown } from '../../../commons/icons/arrow-down.svg';
import { ReactComponent as ArrowUp } from '../../../commons/icons/top/arrow-up.svg';
import {
  GOOGLE_DASHBOARD,
  LOCATION_FOR_GBP,
} from '../../../commons/constants/url';

import './Google.scss';
import config from '../../../OEMConfig';

const Google = () => {
  const [barChartData, setBarChartData] = useState([]);
  const [selectedTab, setSelectedTab] = useState('0');
  const [cardTabsDetails, setCardTabsDetails] = useState([]);
  const [selectedValue, setSelectedValue] = React.useState('');
  const [selectedTabnfo, setSelectedTabInfo] = useState({});
  const [locationsArr, setLocationsArr] = useState([]);
  const [labelLineChart, setLabelLineChart] = useState([]);
  const [valueYAxisLineChart, setValueYAxisLineChart] = useState([]);
  const [valueCallsYAxisLineChart, setValueCallsYAxisLineChart] = useState([]);
  const [valueDirectionYAxisLineChart, setValueDirectionYAxisLineChart] =
    useState([]);
  const [valueMapViewYAxisLineChart, setValueMapViewYAxisLineChart] = useState(
    [],
  );
  const [valueSearchYAxisLineChart, setValueSearchYAxisLineChart] = useState(
    [],
  );
  const [valueClicksYAxisLineChart, setValueClicksYAxisLineChart] = useState(
    [],
  );
  const [averageRating, setAverageRating] = useState('');
  const [reviewTotal, setReviewTotal] = useState('');
  const [reviewReplyTotal, setReviewReplyTotal] = useState('');
  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const [photoCount, setPhotoCount] = useState({
    count: 0,
    incDcrCount: 0,
  });
  const [photoViewCount, setPhotoViewCount] = useState({
    count: 0,
    incDcrCount: 0,
  });
  const [totalphotoViewCount, setTotalPhotoViewCount] = useState({
    count: 0,
    incDcrCount: 0,
  });
  const [totalPhotoCount, setTotalPhotoCount] = useState({
    count: 0,
    incDcrCount: 0,
  });
  const [selectedOptionDate, setSelectedOptionDate] = useState(6);

  const [filterStartEndDate, setFilterStartEndDate] = useState({
    startDate: moment().subtract(6, 'd').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  });
  const [isDataAvaialble, setIsDataAvaialble] = useState(true);
  const [vsReviewTotal, setVsReviewTotal] = useState('');

  const [loader, setLoader] = useState(false);

  const { get: getGoogleDashboard } = useFetch(
    GOOGLE_DASHBOARD(
      selectedValue,
      filterStartEndDate.startDate,
      filterStartEndDate.endDate,
    ),
  );
  const { get: getLocations } = useFetch(LOCATION_FOR_GBP);
  const handleChange = (event) => {
    setSelectedValue(event.value);
  };

  const { t } = useTranslation(['top']);

  const getLocationsData = async () => {
    const responseData = await getLocations();
    if (responseData?.success) {
      const locationArrLoop = responseData.result.data.map((val) => ({
        label: val.name,
        value: val.id,
      }));
      setLocationsArr(locationArrLoop);
    }
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

  useEffect(() => {
    let dataValuesArr = [];
    if (selectedTab === '0') {
      dataValuesArr = [...valueSearchYAxisLineChart];
    } else if (selectedTab === '1') {
      dataValuesArr = [...valueMapViewYAxisLineChart];
    } else if (selectedTab === '2') {
      dataValuesArr = [...valueClicksYAxisLineChart];
    } else if (selectedTab === '3') {
      dataValuesArr = [...valueDirectionYAxisLineChart];
    } else if (selectedTab === '4') {
      dataValuesArr = [...valueCallsYAxisLineChart];
    }
    setValueYAxisLineChart(dataValuesArr);
  }, [selectedTab]);

  const getGoogleData = async () => {
    console.log('get insta data called');
    setLoader(true);
    const responseData = await getGoogleDashboard();
    if (responseData?.success) {
      if (responseData.result.latest !== null) {
        setIsDataAvaialble(true);
        const cardsData = [
          {
            incDcrCount: commafy(
              responseData.result.versus?.search_total
                ? responseData.result.versus?.search_total
                : 0,
            ),
            id: '0',
            numberCount: commafy(responseData.result.latest?.search_total),
            secondHeader: t('top:GOOGLE_PAGE.GOOGLE_SEARCH_COUNT'),
            isUpCount:
              responseData.result.versus?.search_total >= 0 ? 'true' : 'false',
            lastTimeString: `${selectedOptionDate + 1} ${t(
              'top:GOOGLE_PAGE.DAYS',
            )}`,
          },
          {
            incDcrCount: commafy(
              responseData.result.versus?.map_view_total
                ? responseData.result.versus?.map_view_total
                : 0,
            ),
            id: '1',
            numberCount: commafy(responseData.result.latest?.map_view_total),
            secondHeader: t('top:GOOGLE_PAGE.GOOGLE_MAP_VIEWS'),
            isUpCount:
              responseData.result.versus?.map_view_total >= 0
                ? 'true'
                : 'false',
            lastTimeString: `${selectedOptionDate + 1} ${t(
              'top:GOOGLE_PAGE.DAYS',
            )}`,
          },
          {
            incDcrCount: commafy(
              responseData.result.versus?.click_total
                ? responseData.result.versus?.click_total
                : 0,
            ),
            id: '2',
            numberCount: commafy(responseData.result.latest?.click_total),
            secondHeader: t('top:GOOGLE_PAGE.URL_CLCKS'),
            isUpCount:
              responseData.result.versus?.click_total >= 0 ? 'true' : 'false',
            lastTimeString: `${selectedOptionDate + 1} ${t(
              'top:GOOGLE_PAGE.DAYS',
            )}`,
          },
          {
            incDcrCount: commafy(
              responseData.result.versus?.direction_total
                ? responseData.result.versus?.direction_total
                : 0,
            ),
            id: '3',
            numberCount: commafy(responseData.result.latest?.direction_total),
            secondHeader: t('top:GOOGLE_PAGE.ROUTE_SEARCHES'),
            isUpCount:
              responseData.result.versus?.direction_total >= 0
                ? 'true'
                : 'false',
            lastTimeString: `${selectedOptionDate + 1} ${t(
              'top:GOOGLE_PAGE.DAYS',
            )}`,
          },
          {
            incDcrCount:
              responseData.result.versus?.call_total > 0
                ? `${commafy(responseData.result.versus?.call_total)}%`
                : 0,
            id: '4',
            numberCount: commafy(responseData.result.latest?.call_total),
            secondHeader: t('top:GOOGLE_PAGE.PHONE_CALLS'),
            isUpCount:
              responseData.result.versus?.call_total >= 0 ? 'true' : 'false',
            lastTimeString: `${selectedOptionDate + 1} ${t(
              'top:GOOGLE_PAGE.DAYS',
            )}`,
          },
        ];
        setCardTabsDetails(cardsData);
        /*eslint-disable */
        const arrLabelLineChart = [];
        const arrValClicks = [];
        const arrValCalls = [];
        const arrValdirection = [];
        const arrValMapViews = [];
        const arrValSearch = [];

        const labelXAxisLineChart = responseData.result.daily?.map((val) => {
          arrLabelLineChart.push(val.date);
          arrValClicks.push(val.click);
          arrValCalls.push(val.call);
          arrValdirection.push(val.direction);
          arrValMapViews.push(val.map_view);
          arrValSearch.push(val.search);
        });
        console.log('arrValClicks', arrValClicks);
        setLabelLineChart(arrLabelLineChart);
        setValueYAxisLineChart(arrValSearch);
        setValueClicksYAxisLineChart(arrValClicks);
        setValueCallsYAxisLineChart(arrValCalls);
        setValueDirectionYAxisLineChart(arrValdirection);
        setValueMapViewYAxisLineChart(arrValMapViews);
        setValueSearchYAxisLineChart(arrValSearch);
        setAverageRating(responseData.result.latest?.rating.avg);
        // setAverageRating(4.5)
        setVsReviewTotal(responseData.result.versus?.review_total);
        setReviewTotal(responseData.result.latest?.review_total);
        setReviewReplyTotal(responseData.result.latest?.review_reply_total);

        const dataArrBarRatings = responseData.result.latest?.rating;
        const barChartRatingData = [];
        console.log(
          'responseData.result.latest?.rating',
          responseData.result.latest?.rating[2],
        );

        barChartRatingData.push({
          label: 5,
          data: responseData.result.latest?.rating[5],
        });

        barChartRatingData.push({
          label: 4,
          data: responseData.result.latest?.rating[4],
        });

        barChartRatingData.push({
          label: 3,
          data: responseData.result.latest?.rating[3],
        });

        barChartRatingData.push({
          label: 2,
          data: responseData.result.latest?.rating[2],
        });

        barChartRatingData.push({
          label: 1,
          data: responseData.result.latest?.rating[1],
        });

        setBarChartData(barChartRatingData);

        const photoCountObj = {};
        photoCountObj.count = responseData.result.latest.photo_total;
        photoCountObj.incDcrCount = responseData.result.versus.photo_total
          ? responseData.result.versus.photo_total
          : 0;
        setPhotoCount(photoCountObj);

        const totalPhotoCountObj = {};
        totalPhotoCountObj.count = responseData.result.latest.photo_all;
        totalPhotoCountObj.incDcrCount = responseData.result.versus
          .photo_view_total
          ? responseData.result.versus.photo_view_total
          : 0;
        setTotalPhotoCount(totalPhotoCountObj);

        const photoViewCountObj = {};
        photoViewCountObj.count = responseData.result.latest.photo_view_total;
        photoViewCountObj.incDcrCount = responseData.result.versus
          .photo_view_total
          ? responseData.result.versus.photo_view_total
          : 0;
        setPhotoViewCount(photoViewCountObj);

        const totalPhotoViewCountObj = {};
        totalPhotoViewCountObj.count =
          responseData.result.latest.photo_view_all;
        totalPhotoViewCountObj.incDcrCount = responseData.result.versus
          .photo_view_total
          ? responseData.result.versus.photo_view_total
          : 0;
        setTotalPhotoViewCount(totalPhotoViewCountObj);
        /*eslint-disable */
      } else {
        setIsDataAvaialble(false);
      }

      setLoader(false);
    }
  };

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
    if (selectedValue !== ' ' && locationsArr.length > 0) {
      console.log('this will called function');
      getGoogleData();
    }
  }, [selectedValue]);

  useEffect(() => {
    if (
      filterStartEndDate.startDate !== '' &&
      filterStartEndDate.startDate !== undefined &&
      locationsArr.length > 0
    ) {
      getGoogleData();
    }
  }, [filterStartEndDate]);

  useEffect(() => {
    getLocationsData();
  }, []);

  const options2 = [
    { value: 6, label: `${t('top:COMMON.LAST_7_dAYS')}` },
    { value: 29, label: `${t('top:COMMON.LAST_30_dAYS')}` },
    { value: 179, label: `${t('top:COMMON.LAST_180_dAYS')}` },
    { value: 364, label: `${t('top:COMMON.LAST_365_dAYS')}` },
    /* { value: 'maximum_duration', label: `${t('top:COMMON.MAXIMUM_DURATION')}` },*/
    { value: 'custom_range', label: `${t('top:COMMON.CUSTOM_RANGE')}` },
  ];

  const { Option } = components;
  const IconOption = (props) => {
    console.log('props', props);
    const { data, value } = props;
    return (
      <Option {...props}>
        <Box display="flex" alignItems="center">
          <Box>
            <GreenRadio
              checked={selectedValue === value}
              value={value}
              name="radio-buttons"
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

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <ArrowDown />
      </components.DropdownIndicator>
    );
  };

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

  useEffect(() => {
    if (cardTabsDetails && cardTabsDetails.length > 0) {
      const dataSelectedCard = cardTabsDetails.find((val) => val.id === '0');
      setSelectedTabInfo(dataSelectedCard);
    }
  }, [cardTabsDetails]);

  const changeSelectedTab = (id) => {
    const dataSelectedCard = cardTabsDetails.find((val) => val.id === id);
    setSelectedTabInfo(dataSelectedCard);
    setSelectedTab(id);
  };

  const colorFromOmniConfig = {
    color: config().side_menu_color,
  };

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
            <GoogleIcon />
          </Box>
          <Box marginLeft="20px">
            <Typography className="instagram-head-text">
              {t('top:GOOGLE_PAGE.GOOGLE_BUSINESS_PROFILE')}
            </Typography>
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
              closeMenuOnSelect
              className="select-width-tree-select-group"
              options={locationsArr}
              styles={customStyles}
              value={locationsArr.filter(
                (option) => option.value === selectedValue,
              )}
              onChange={(event) => handleChange(event, '', '')}
            />
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
              options={options2}
              value={options2.filter(
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
          <Grid container spacing={2} className="margin-top-to-header">
            <Grid item sm={12} md={6}>
              <Card style={{ borderRadius: '16px' }}>
                <CardContent className="google-chart-parent-div">
                  {loader ? (
                    <Box
                      style={{
                        position: 'relative',
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                    >
                      <CircularProgress color="secondary" />
                    </Box>
                  ) : (
                    <Grid className="rating-card-google" container spacing={2}>
                      <Grid item sm={12} md={6}>
                        <Box>
                          <Typography
                            style={colorFromOmniConfig}
                            className="header-rating-cards"
                          >
                            {commafy(averageRating)}
                          </Typography>
                          <Box className="rating-comp-parent-dv">
                            <Rating
                              placeholderRating={averageRating}
                              readonly
                              emptySymbol={
                                <img
                                  src="/images/empty-review.png"
                                  alt="empty"
                                  className="icon-star"
                                />
                              }
                              placeholderSymbol={
                                <img
                                  src="/images/full-review.png"
                                  alt="placeholder"
                                  className="icon-star"
                                />
                              }
                              fullSymbol={
                                <img
                                  src="/images/full-review.png"
                                  alt="fll"
                                  className="icon-star"
                                />
                              }
                            />
                          </Box>
                          <Typography className="header-rating-status-cards">
                            {t('top:GOOGLE_PAGE.AVERAGE_RATNG')}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item sm={12} md={6}>
                        <Box>
                          <HorizontalBarChart
                            prefixYLabels="star"
                            barChartData={barChartData}
                            barAndPieChartTitle=""
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item sm={12} md={6}>
              <Box>
                <Card style={{ borderRadius: '16px' }}>
                  <CardContent className="google-table-card-parent-div">
                    {loader ? (
                      <Box
                        style={{
                          position: 'relative',
                          top: '50%',
                          transform: 'translateY(-50%)',
                        }}
                      >
                        <CircularProgress color="secondary" />
                      </Box>
                    ) : (
                      <Grid
                        className="rating-card-google"
                        container
                        spacing={2}
                      >
                        <Grid item sm={12} md={6}>
                          <Box>
                            <Box
                              className="number-count-card-google"
                              sx={{ fontSize: 14 }}
                              style={colorFromOmniConfig}
                              color="text.secondary"
                              gutterBottom
                            >
                              {commafy(reviewTotal)}
                            </Box>
                            <Box
                              className="second-header-text"
                              sx={{ fontSize: 14 }}
                              color="text.secondary"
                              gutterBottom
                            >
                              {t('top:GOOGLE_PAGE.REVIEWS')}
                            </Box>
                            <Box sx={{ fontSize: 14 }}>
                              {vsReviewTotal >= 0 ? (
                                <ArrowUp className="arrow-up-top" />
                              ) : (
                                <ArrowDown className="arrow-down-top" />
                              )}
                              &nbsp;
                              <span className={
                                vsReviewTotal >= 0
                                ? 'up-arrow-font-color'
                                : 'down-arrow-font-color'
                              }>{vsReviewTotal}</span>&nbsp;
                              <span className="">
                                {' '}
                                {t('top:GOOGLE_PAGE.VS')}{' '}
                                {selectedOptionDate + 1}{' '}
                                {t('top:GOOGLE_PAGE.DAYS')}
                              </span>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item sm={12} md={6}>
                          <Box
                            className="number-count-card-google"
                            style={colorFromOmniConfig}
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                          >
                            {commafy(reviewReplyTotal)}
                          </Box>
                          <Box
                            className="second-header-text"
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                          >
                            {t('top:GOOGLE_PAGE.REPLIES_TO_REVEWS')}
                          </Box>
                          <Box
                            className="number-count-card-google"
                            style={colorFromOmniConfig}
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                          >
                            {reviewTotal === 0
                              ? (reviewTotal / reviewReplyTotal) * 100 + '%'
                              : 0}
                          </Box>
                          <Box
                            className="second-header-text"
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                          >
                            {t('top:GOOGLE_PAGE.REVIEW_REPLY_RATE')}
                          </Box>
                        </Grid>
                      </Grid>
                    )}
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
          <Box>
            {loader ? (
              <Box
                className="margin-top-to-header"
                display="flex"
                flexWrap="wrap"
                justifyContent="space-between"
              >
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
              </Box>
            ) : (
              <Box
                className="margin-top-to-header"
                display="flex"
                justifyContent="space-between"
              >
                {cardTabsDetails.map((val) => {
                  return (
                    <MiniCard
                      incDcrCount={val.incDcrCount}
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
          </Box>
          <Box>
            <LineChart
              loader={loader}
              labelLineChart={labelLineChart}
              valueYAxisLineChart={valueYAxisLineChart}
              selectedTabnfo={selectedTabnfo}
              lineChartTitle={t('top:GOOGLE_PAGE.GOOGLE_SEARCH')}
            />
          </Box>
          <Grid container spacing={2} className="grid-tab-parent-div">
            <Grid className="mobile-full-width" item sm={12} md={6}>
              <Card style={{ borderRadius: '16px' }}>
                <CardContent className="last-card-google-parent-div">
                  <Grid className="rating-card-google" container spacing={2}>
                    <Grid item sm={12} md={6}>
                      <Box textAlign="center">
                        <span
                          className="number-count-card-google"
                          style={colorFromOmniConfig}
                          sx={{ fontSize: 14 }}
                          color="text.secondary"
                          gutterBottom
                        >
                          {commafy(photoCount.count)}
                        </span>
                        <Box
                          className="second-header-text"
                          sx={{ fontSize: 14 }}
                          color="text.secondary"
                          gutterBottom
                        >
                          {t('top:GOOGLE_PAGE.PHOTO_COUNT')}
                        </Box>
                        <Box sx={{ fontSize: 14 }}>
                          {photoCount.incDcrCount >= 0  ? (
                            <ArrowUp className="arrow-up-top" />
                          ) : (
                            <ArrowDown className="arrow-down-top" />
                          )}
                          &nbsp;
                          <span className={
                            photoCount.incDcrCount >= 0
                            ? 'up-arrow-font-color'
                            : 'down-arrow-font-color'
                          }>
                            {commafy(photoCount.incDcrCount)}
                          </span>
                          &nbsp;
                          <span className="">
                            {' '}
                            {t('top:GOOGLE_PAGE.VS')} {selectedOptionDate + 1}{' '}
                            {t('top:GOOGLE_PAGE.DAYS')}
                          </span>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item sm={12} md={6}>
                      <Box textAlign="center">
                        <span
                          className="number-count-card-google"
                          style={colorFromOmniConfig}
                          sx={{ fontSize: 14 }}
                          color="text.secondary"
                          gutterBottom
                        >
                          {commafy(totalPhotoCount.count)}
                        </span>
                        <Box
                          className="second-header-text"
                          sx={{ fontSize: 14 }}
                          color="text.secondary"
                          gutterBottom
                        >
                          {t('top:GOOGLE_PAGE.TOTAL_PHOTO_COUNT')}
                        </Box>
                        {/* <Box sx={{ fontSize: 14 }}>
                          {true ? (
                            <ArrowUp className="arrow-up-top" />
                          ) : (
                            <ArrowDown className="arrow-down-top" />
                          )}
                          &nbsp;
                          <span className="">
                            {totalPhotoCount.incDcrCount}
                          </span>
                          &nbsp;
                          <span className=""> :vs last {selectedOptionDate} days</span>
                        </Box> */}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid className="mobile-full-width" item sm={12} md={6}>
              <Box>
                <Card style={{ borderRadius: '16px' }}>
                  <CardContent className="last-card-google-parent-div">
                    <Grid className="rating-card-google" container spacing={2}>
                      <Grid item sm={12} md={6}>
                        <Box textAlign="center">
                          <span
                            className="number-count-card-google"
                            style={colorFromOmniConfig}
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                          >
                            {commafy(photoViewCount.count)}
                          </span>
                          <Box
                            className="second-header-text"
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                          >
                            {t('top:GOOGLE_PAGE.PHOTO_VEW_COUNT')}
                          </Box>
                          <Box sx={{ fontSize: 14 }}>
                            {photoViewCount.incDcrCount >= 0 ? (
                              <ArrowUp className="arrow-up-top" />
                            ) : (
                              <ArrowDown className="arrow-down-top" />
                            )}
                            &nbsp;
                            <span className={
                              photoViewCount.incDcrCount >= 0
                              ? 'up-arrow-font-color'
                              : 'down-arrow-font-color'
                            }>
                              {commafy(photoViewCount.incDcrCount)}
                            </span>
                            &nbsp;
                            <span className="">
                              {' '}
                              {t('top:GOOGLE_PAGE.VS')} {selectedOptionDate + 1}{' '}
                              {t('top:GOOGLE_PAGE.DAYS')}
                            </span>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item sm={12} md={6}>
                        <Box textAlign="center">
                          <span
                            className="number-count-card-google"
                            style={colorFromOmniConfig}
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                          >
                            {commafy(totalphotoViewCount.count)}
                          </span>
                          <Box
                            className="second-header-text"
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                          >
                            {t('top:GOOGLE_PAGE.TOTAL_PHOTO_VIEW_COUNT')}
                          </Box>
                          {/* <Box sx={{ fontSize: 14 }}>
                            {true ? (
                              <ArrowUp className="arrow-up-top" />
                            ) : (
                              <ArrowDown className="arrow-down-top" />
                            )}
                            &nbsp;
                            <span className="">
                              {totalphotoViewCount.incDcrCount}
                            </span>
                            &nbsp;
                            <span className=""> :vs last {selectedOptionDate} days</span>
                          </Box> */}
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </>
      ) : (
        <NoDataFound />
      )}
    </>
  );
};

export default Google;
