import React from "react";
import { Line } from "react-chartjs-2";

const LineChart = (props) => {
  const { data = {} } = props;

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
