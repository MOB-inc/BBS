import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { Skeleton } from '@material-ui/lab';

// import CardActions from '@material-ui/core/CardActions';

import CardContent from '@material-ui/core/CardContent';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box'; // eslint-disable-line import/no-extraneous-dependencies
import './index.scss';
import config from '../../../OEMConfig';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const index = (props) => {
  const { selectedTabnfo, labelLineChart, valueYAxisLineChart, loader } = props;
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
          stepSize: 200,
        },
      },
    },
  };

  const label = labelLineChart;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [loading]);

  // const dataChartStcak = (canvas) => {
  //   console.log('canvas',canvas)
  //   const ctx = document.getElementById('canvas').getContext("2d")
  //   const gradient = ctx.createLinearGradient(0,0,100,0);
  //   gradient.addColorStop(0, 'rgba(229, 239, 255, 1)')
  //   gradient.addColorStop(1, '#FFFFFF')
  //     return {
  //       labels:label,
  //       datasets: [
  //         {
  //           label: 'Dataset 1',
  //           pointBackgroundColor: "#fff",
  //           backgroundColor: gradient,
  //           data: [2400, 2200, 2500, 2450, 2510, 2600, 2700],
  //           fill: true,
  //         },
  //       ],
  //     }
  //   }

  // const sampleData = (canvas) => {
  //   const ctx = canvas.getContext("2d");
  //   const gradient = ctx.createLinearGradient(0, 0, 0, 150);
  //   gradient.addColorStop(0, "rgba(0, 124, 194, 0.1)");
  //   gradient.addColorStop(0.5, "rgba(0, 124, 194, 0.3)");
  //   gradient.addColorStop(1, "rgba(0, 124, 194, 0.7)");

  //   const result = {
  //     labels:label,
  //     datasets: [
  //       {
  //         label: 'Dataset 1',
  //         backgroundColor: gradient,
  //         pointBackgroundColor: "#fff",
  //         data: [2400, 2200, 2500, 2450, 2510, 2600, 2700],
  //         fill: true,
  //       },
  //     ],
  //   };
  //   return result;
  // };

  function spliceSplit(str, indexStr, count, add) {
    const ar = str.split('');
    ar.splice(indexStr, count, add);
    return ar.join('');
  }
  const strColor = spliceSplit(
    config().graph_color_main,
    config().graph_color_main.length - 1,
    1,
    ', 0.5)',
  );
  const ctx = document.getElementById('canvas')?.getContext('2d');
  const gradient = ctx?.createLinearGradient(0, 0, 0, 150);
  gradient?.addColorStop(0, strColor);
  gradient?.addColorStop(1, 'rgba(196, 196, 196, 0)');
  const data = {
    labels: label,
    datasets: [
      {
        label: '値',
        data: valueYAxisLineChart,
        borderColor: 'rgba(128, 128, 128, 0.5)',
        // backgroundColor: 'pink',
        backgroundColor: gradient,
        fill: true,
      },
    ],
  };
  return (
    <Box className="card-parent-div-line-chart">
      <Card style={{ borderRadius: '16px' }}>
        <CardContent className="line-chart-parent-div">
          <Typography className="header-line-chart">
            {loader ? (
              <Skeleton height={40} width={150} />
            ) : (
              selectedTabnfo?.secondHeader
            )}
          </Typography>
          {loading && loader ? (
            <Box style={{ textAlign: 'center', marginTop: '30px' }}>
              <CircularProgress color="secondary" />
            </Box>
          ) : (
            <Box className="line-chart-parent-div-line-comp">
              <Line id="canvas" options={options} data={data} />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

index.propTypes = {
  lineChartTitle: PropTypes.string,
  selectedTabnfo: PropTypes.string,
  /*eslint-disable */
  labelLineChart: PropTypes.array,
  valueYAxisLineChart: PropTypes.array,
  /*eslint-disable */
};
export default index;
