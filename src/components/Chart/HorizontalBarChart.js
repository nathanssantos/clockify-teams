import React from "react";
import { Bar } from "react-chartjs-2";

const HorizontalBarChart = (props) => {
  const { data = {} } = props;

  const options = {
    responsive: true,
    indexAxis: "y",
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
  return <Bar data={data} options={options} />;
};

export default HorizontalBarChart;
