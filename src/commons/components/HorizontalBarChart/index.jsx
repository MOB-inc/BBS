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
import { Bar } from 'react-chartjs-2';
import Typography from '@material-ui/core/Typography';
// import StarIcon from '@material-ui/icons/Star';
// import CardActions from '@material-ui/core/CardActions';

import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box'; // eslint-disable-line import/no-extraneous-dependencies
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
  const options = {
    maintainAspectRatio: false,
    indexAxis: 'y',
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
        ticks: {
          display: false,
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
        },
      },
    },
  };
  // if (props.prefixYLabels && props.prefixYLabels !== '') {
  //   options.scales.y.ticks = {
  //     autoSkip: true,
  //     stepSize: 10,
  //     callback: (value) => {
  //       return `${value}`;
  //     },
  //   };
  // }

  const dataLabells = props.barChartData.map((val) => {
    return val.label;
  });
  const dataValue = props.barChartData.map((val) => {
    return val.data;
  });

  // const labels = ['2/23', '2/24', '2/25', '2/26', '2/27', '2/28', '3/1'];
  const dataBarChart = {
    labels: dataLabells,
    datasets: [
      {
        label: '値',
        data: dataValue,
        backgroundColor: [config().graph_color_main],
        borderColor: [config().graph_color_main],
        borderWidth: 1,
      },
    ],
  };
  // const data = {
  //   labels,
  //   datasets: [
  //     {
  //       label: 'Dataset 1',
  //       data: [2400,2200,2500,2450,2510,2600,2700],
  //       borderColor: 'rgba(204, 0, 153, 0.46)',
  //       backgroundColor: 'pink',
  //       fill: true,
  //     },
  //   ],
  // };

  const { barAndPieChartTitle } = props;
  return (
    <Box>
      <Typography className="header-bar-pie-chart">
        {barAndPieChartTitle}
      </Typography>
      <Box className="horizontal-chart-parent-div">
        <Bar options={options} data={dataBarChart} />
      </Box>
    </Box>
  );
};

index.propTypes = {
  barAndPieChartTitle: PropTypes.string,
  barChartData: PropTypes.arrayOf(PropTypes.string),
  prefixYLabels: PropTypes.string,
};
export default index;
