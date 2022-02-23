/* eslint-disable react/prop-types */
import React from 'react';
import { Bar } from 'react-chartjs-2';

const HorizontalBarChart = (props) => {
  const { data = {} } = props;

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default HorizontalBarChart;
