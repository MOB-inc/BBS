import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Select, { components } from 'react-select';
import Box from '@material-ui/core/Box'; // eslint-disable-line import/no-extraneous-dependencies
import Card from '@material-ui/core/Card';
import Radio from '@material-ui/core/Radio';
import useFetch from 'use-http';
import { Skeleton } from '@material-ui/lab';
import moment from 'moment';

import { withStyles, createStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import { ReactComponent as ArrowDown } from '../../../commons/icons/arrow-down-select.svg';
import { ReactComponent as ArrowUp } from '../../../commons/icons/top/arrow-up.svg';
import { ReactComponent as DashboardIcon } from '../../../commons/icons/LINE_New_App_Icon_(2020-12).svg';
import LineChart from '../../../commons/components/LineChart';
import BarAndPieChart from '../../../commons/components/BarAndPieChart';
import NoDataFound from '../../../commons/components/NoDataFound';
import commafy from '../../../commons/helpers/commaFy';
import DateRangePicker from '../../../commons/components/DateRangePicker';
import {
  LINE_DASHBOARD,
  LOCATION_FOR_LINE,
} from '../../../commons/constants/url';

import './Line.scss';
import config from '../../../OEMConfig';

const Line = () => {
  const [selectedTab, setSelectedTab] = useState('0');
  const [cardTabsDetails, setCardTabsDetails] = useState([]);
  const [progress, setProgress] = React.useState(0);
  const [selectedValue, setSelectedValue] = React.useState('');
  const [selectedTabnfo, setSelectedTabInfo] = useState({});
  const [locationsArr, setLocationsArr] = useState([]);
  const [labelLineChart, setLabelLineChart] = useState([]);
  const [valueMessagesYAxisLineChart, setValueMessagesYAxisLineChart] =
    useState([]);
  const [valueFollowersYAxisLineChart, setValueFollowersYAxisLineChart] =
    useState([]);
  const [valueYAxisLineChart, setValueYAxisLineChart] = useState([]);
  const [messageCount, setMessageCount] = useState(0);
  const [messageLimt, setMessageLimit] = useState(0);
  const [messageOpenRate, setMessageOpenRate] = useState(0);
  const [barGraphDataLabel, setBarGraphDataLabel] = useState();
  const [barGraphDataValue, setBarGraphDataValue] = useState();
  const [pieGraphDataValue, setPieGraphDataValue] = useState();
  const [pieGraphDataLabel, setPieGraphDataLabel] = useState();
  const [loader, setLoader] = useState(false);
  const [selectedOptionDate, setSelectedOptionDate] = useState(6);
  const [isDataAvaialble, setIsDataAvaialble] = useState(true);
  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [filterStartEndDate, setFilterStartEndDate] = useState({
    startDate: moment().subtract(6, 'd').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  });
  const { get: getLineDashboard } = useFetch(
    LINE_DASHBOARD(
      selectedValue,
      filterStartEndDate.startDate,
      filterStartEndDate.endDate,
    ),
  );
  const { t } = useTranslation(['top']);

  const { get: getLocations } = useFetch(LOCATION_FOR_LINE);

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

  useEffect(() => {
    let dataValuesArr = [];
    if (selectedTab === '0') {
      dataValuesArr = [...valueFollowersYAxisLineChart];
    } else if (selectedTab === '1') {
      dataValuesArr = [...valueMessagesYAxisLineChart];
    }
    setValueYAxisLineChart(dataValuesArr);
  }, [selectedTab]);

  const getInstaData = async () => {
    console.log('get insta data called');
    setLoader(true);
    const responseData = await getLineDashboard();
    if (responseData?.success) {
      if (responseData.result.latest.followers !== null) {
        setIsDataAvaialble(true);
        const cardsData = [
          {
            incDcrCount: commafy(
              responseData.result.versus?.followers
                ? responseData.result.versus?.followers
                : 0,
            ),
            id: '0',
            numberCount: commafy(
              responseData.result.latest?.followers !== null
                ? responseData.result.latest?.followers
                : 0,
            ),
            secondHeader: `${t('top:LINE_PAGE.FRIENDS')}`,
            isUpCount:
              responseData.result.versus?.followers >= 0 ? 'true' : 'false',
            lastTimeString: `${selectedOptionDate + 1} ${t(
              'top:LINE_PAGE.DAYS',
            )}`,
          },
          {
            incDcrCount: commafy(
              responseData.result.versus?.post
                ? responseData.result.versus?.post
                : 0,
            ),
            id: '1',
            numberCount: commafy(
              responseData.result.latest?.post !== null
                ? responseData.result.latest?.post
                : 0,
            ),
            secondHeader: `${t('top:LINE_PAGE.MESSAGES_SENT')}`,
            isUpCount: responseData.result.versus?.post >= 0 ? 'true' : 'false',
            lastTimeString: `${selectedOptionDate + 1} ${t(
              'top:LINE_PAGE.DAYS',
            )}`,
          },
        ];
        setCardTabsDetails(cardsData);
        /*eslint-disable */
        const arrLabelLineChart = [];
        const arrValFollowers = [];
        const arrValMessages = [];

        const labelXAxisLineChart = responseData.result.daily?.map((val) => {
          arrLabelLineChart.push(val.date);
          arrValFollowers.push(val.followers);
          arrValMessages.push(val.post);
        });
        console.log('arrValFollowers', arrValFollowers);
        setLabelLineChart(arrLabelLineChart);
        setValueYAxisLineChart(arrValFollowers);
        setValueFollowersYAxisLineChart(arrValFollowers);
        setValueMessagesYAxisLineChart(arrValMessages);
        setMessageCount(
          responseData.result.latest?.message_count !== null
            ? responseData.result.latest?.message_count
            : 0,
        );

        const percProgress =
          (responseData.result.latest?.message_count * 100) /
          responseData.result.latest?.message_limit;

        setProgress(percProgress !== 0 && percProgress ? percProgress : 0);
        setMessageLimit(
          responseData.result.latest?.message_limit !== null
            ? responseData.result.latest?.message_limit
            : 0,
        );
        setMessageOpenRate(
          responseData.result.latest?.message_open_rate !== null
            ? responseData.result.latest?.message_open_rate
            : 0,
        );

        const dataArrBarAndPie = responseData.result.gender_age;
        const objKeyFirstDataSet = Object.keys(
          dataArrBarAndPie ? dataArrBarAndPie : [],
        );

        const barChartLabelArr = [];
        const barChartValueArr = [];
        const pieChartValueArr = [];
        const pieChartLabelArr = [];
        responseData.result.gender_age?.ages?.map((val) => {
          barChartLabelArr.push(val.age);
          barChartValueArr.push(val.percentage);
        });

        responseData.result.gender_age?.genders?.map((val) => {
          pieChartLabelArr.push(val.gender);
          pieChartValueArr.push(val.percentage);
        });
        setBarGraphDataLabel(barChartLabelArr);
        setBarGraphDataValue(barChartValueArr);
        setPieGraphDataValue(pieChartValueArr);
        setPieGraphDataLabel(pieChartLabelArr);

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
      getInstaData();
    }
  }, [selectedValue]);

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

  useEffect(() => {
    getLocationsData();
  }, []);

  useEffect(() => {
    if (
      filterStartEndDate.startDate !== '' &&
      filterStartEndDate.startDate !== undefined &&
      locationsArr.length > 0
    ) {
      getInstaData();
    }
  }, [filterStartEndDate]);

  const options2 = [
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

  const changeSelectedTab = (id) => {
    const dataSelectedCard = cardTabsDetails.find((val) => val.id === id);
    setSelectedTabInfo(dataSelectedCard);
    setSelectedTab(id);
  };

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
      color: config().side_menu_color,
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

  const onClickCard = (id) => {
    changeSelectedTab(id);
  };

  const colorFromOmniConfig = {
    color: config().side_menu_color,
  };

  const activeCardFontColor = {
    color: '#ffffff',
  };

  const selectedTilesBackgroundColor = {
    borderRadius: '16px',
    backgroundColor: config().side_menu_color,
  };

  const withoutSelectedTilesBackgroundColor = {
    borderRadius: '16px',
  };

  const notActiveCardFontColor = {
    color: config().side_menu_color,
  };

  function LinearProgressWithLabel(props) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
      </Box>
    );
  }

  LinearProgressWithLabel.propTypes = {
    value: PropTypes.number.isRequired,
  };

  const BorderLinearProgress = withStyles(() =>
    createStyles({
      root: {
        width: '95%',
        borderRadius: 1,
        marginTop: 8,
        marginBottom: 10,
        height: '8px',
      },
      colorPrimary: {
        backgroundColor: '#E0E0E0',
      },
      bar: {
        borderRadius: 1,
        backgroundColor: config().side_menu_color,
      },
    }),
  )(LinearProgressWithLabel);
  console.log(loader);
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
            <DashboardIcon />
          </Box>
          <Box marginLeft="20px">
            <Typography className="line-head-text">
              {t('top:LINE_PAGE.LINE_PAGE_TITLE')}
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
          <Box>
            {loader ? (
              <Box
                className="margin-top-to-header-line"
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
                  className="last-card-line-parent-div"
                >
                  <CardContent>
                    <Grid className="rating-card-line" container spacing={2}>
                      <Grid item sm={12} md={6}>
                        <Skeleton height={40} width="100%" />
                        <Skeleton height={40} width="100%" />
                        <Skeleton height={40} width="100%" />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Box>
            ) : (
              <Box
                className="margin-top-to-header-line"
                display="flex"
                flexWrap="wrap"
                justifyContent="space-between"
              >
                {cardTabsDetails.map((val) => {
                  return (
                    <Box
                      className="line-card-parent-div"
                      onClick={() => {
                        onClickCard(val.id);
                      }}
                    >
                      <Card
                        style={
                          val.id === selectedTab
                            ? selectedTilesBackgroundColor
                            : withoutSelectedTilesBackgroundColor
                        }
                        sx={{ minWidth: 275 }}
                      >
                        <CardContent>
                          <Box
                            className="number-count-card"
                            style={
                              val.id === selectedTab
                                ? activeCardFontColor
                                : notActiveCardFontColor
                            }
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                          >
                            {val.numberCount}
                          </Box>
                          <Box
                            className="second-header-text not-active-class-font-color"
                            style={
                              val.id === selectedTab
                                ? activeCardFontColor
                                : notActiveCardFontColor
                            }
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                          >
                            {val.secondHeader}
                          </Box>
                          <Box sx={{ fontSize: 14 }}>
                            {val.isUpCount === 'true' ? (
                              <ArrowUp
                                className={
                                  val.id === selectedTab
                                    ? 'arrow-up-top selected-arrow-color'
                                    : 'arrow-up-top'
                                }
                              />
                            ) : (
                              <ArrowDown
                                className={
                                  val.id === selectedTab
                                    ? 'arrow-down-top selected-arrow-color'
                                    : 'arrow-down-top'
                                }
                              />
                            )}
                            &nbsp;
                            <span
                              className={
                                val.id === selectedTab
                                  ? 'active-card-font-color'
                                  : 'not-active-class-font-color-small-title'
                              }
                            >
                              {val.incDcrCount}
                            </span>
                            &nbsp;
                            <span
                              className={
                                val.id === selectedTab
                                  ? 'active-card-font-color'
                                  : 'not-active-class-font-color-small-title'
                              }
                            >
                              {' '}
                              {t('top:INSTAPAGE.VS')} {val.lastTimeString}
                            </span>
                          </Box>
                        </CardContent>
                      </Card>
                    </Box>
                  );
                })}

                <Card
                  style={{ borderRadius: '16px' }}
                  className="last-card-line-parent-div"
                >
                  <CardContent>
                    <Grid className="rating-card-line" container spacing={2}>
                      <Grid item sm={12} md={6}>
                        <Box textAlign="center">
                          <span
                            className="number-count-card-line"
                            sx={{ fontSize: 14 }}
                            style={colorFromOmniConfig}
                            color="text.secondary"
                            gutterBottom
                          >
                            {messageCount}
                          </span>
                          <span
                            className="number-count-card-line-linear-progress"
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                          >
                            / {messageLimt}
                          </span>
                          <Box
                            className="line-cardsecond-header-text"
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                          >
                            <BorderLinearProgress value={progress} />
                          </Box>
                          <Box sx={{ fontSize: 14 }}>
                            <span className="open-rate-second-header-fonts">
                              {t('top:LINE_PAGE.MESSAGES_DELEVERD_THIS_MONTH')}
                            </span>
                            &nbsp;
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
                            { messageOpenRate !== 0 ? messageOpenRate : '-' }%
                          </span>
                          <Box sx={{ fontSize: 14 }}>
                            <span className="open-rate-second-header-fonts">
                              {t('top:LINE_PAGE.OPEN_RATE_THIS_MONTH')}
                            </span>
                            &nbsp;
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Box>
            )}
          </Box>

          <Box>
            <LineChart
              loader={loader}
              labelLineChart={labelLineChart}
              valueYAxisLineChart={valueYAxisLineChart}
              selectedTabnfo={selectedTabnfo}
              lineChartTitle={t('top:LINE_PAGE.LINE_CHART_TITLE')}
            />
          </Box>
          <Box>
            <BarAndPieChart
              chartTypeDashboard="line"
              barGraphDataLabel={barGraphDataLabel}
              barGraphDataValue={barGraphDataValue}
              pieGraphDataLabel={pieGraphDataLabel}
              pieGraphDataValue={pieGraphDataValue}
              barAndPieChartTitle={t('top:LINE_PAGE.FREND_AGE_GENDER')}
            />
          </Box>
        </>
      ) : (
        <NoDataFound />
      )}
    </>
  );
};

export default Line;
