import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  ArcElement,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
// import CardActions from '@material-ui/core/CardActions';
import { useTranslation } from 'react-i18next';

import CardContent from '@material-ui/core/CardContent';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box'; // eslint-disable-line import/no-extraneous-dependencies
import NoDataFound from '../NoDataFound';
import './index.scss';
import config from '../../../OEMConfig';

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const index = (props) => {
  const { t } = useTranslation(['top']);

  const {
    barGraphDataLabel,
    barGraphDataValue,
    pieGraphDataLabel,
    pieGraphDataValue,
    chartTypeDashboard,
  } = props;
  const optionsForPieChart = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        // align: 'middle',
        display: true,
        labels: {
          padding: 10,
        },
      },
      legendDistance: {
        padding: '130px', // dictates the space
      },
      title: {
        display: true,
      },
    },
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        display: false,
      },
      title: {
        display: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          lineWidth: 0.5,
          drawBorder: false,
          offset: true,
        },
      },
      y: {
        grid: {
          display: false,
          lineWidth: 0.5,
          drawBorder: false,
        },
        ticks: {
          autoSkip: true,
          stepSize: 10,
          callback: (value) => {
            return `${value}`;
          },
        },
      },
    },
  };

  // const labels = ['2/23', '2/24', '2/25', '2/26', '2/27', '2/28', '3/1'];
  console.log('barGraphDataLabel', barGraphDataLabel, chartTypeDashboard);
  let dataBarChart = {};
  if (chartTypeDashboard === 'insta') {
    dataBarChart = {
      labels: barGraphDataLabel,
      datasets: [
        {
          label: `${t('top:INSTAPAGE.MALE')}`,
          data: barGraphDataValue[0],
          backgroundColor: [config().graph_color_main],
          borderColor: [config().graph_color_main],
          borderWidth: 1,
        },
        {
          label: `${t('top:INSTAPAGE.FEMALE')}`,
          data: barGraphDataValue[1],
          backgroundColor: [config().graph_color_sub],
          borderColor: [config().graph_color_sub],
          borderWidth: 1,
        },
        {
          label: `${t('top:INSTAPAGE.UNKNOWN')}`,
          data: barGraphDataValue[2],
          backgroundColor: ['rgb(136, 136, 136)'],
          borderColor: ['rgb(136, 136, 136)'],
          borderWidth: 1,
        },
      ],
    };
  } else {
    dataBarChart = {
      labels: barGraphDataLabel,
      datasets: [
        {
          label: '値',
          data: barGraphDataValue,
          backgroundColor: [config().graph_color_main],
          borderColor: [config().graph_color_main],
          borderWidth: 1,
        },
      ],
    };
  }

  const data1 = {
    labels: pieGraphDataLabel,
    datasets: [
      {
        label: '# of Votes',
        data: pieGraphDataValue,
        backgroundColor: [
          config().graph_color_main,
          config().graph_color_sub,
          'rgb(136, 136, 136)',
        ],
        borderColor: [
          config().graph_color_main,
          config().graph_color_sub,
          'rgb(136, 136, 136)',
        ],
        borderWidth: 1,
      },
    ],
  };
  const { barAndPieChartTitle } = props;
  return (
    <Box className="card-parent-div-bar-pie-chart">
      <Card style={{ borderRadius: '16px' }}>
        <CardContent className="bar-pie-chart-parent-div">
          <Typography className="header-bar-pie-chart">
            {barAndPieChartTitle}
          </Typography>
          {pieGraphDataLabel && pieGraphDataLabel?.length > 0 ? (
            <Box textAlign="-webkit-center">
              <Box className="pie-chart-parent-div">
                <Doughnut data={data1} options={optionsForPieChart} />
              </Box>
            </Box>
          ) : (
            <Box
              textAlign="center"
              className="bar-chart-parent-div-common-comp"
            >
              <NoDataFound />
            </Box>
          )}
          {barGraphDataLabel?.length > 0 ? (
            <Box className="bar-chart-parent-div-common-comp">
              <Bar options={options} data={dataBarChart} />
            </Box>
          ) : (
            <Box
              textAlign="center"
              className="bar-chart-parent-div-common-comp"
            >
              <NoDataFound />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

index.propTypes = {
  barAndPieChartTitle: PropTypes.string,
  chartTypeDashboard: PropTypes.string,
};
export default index;
