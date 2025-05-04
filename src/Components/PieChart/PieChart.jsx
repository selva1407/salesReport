import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register required components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const data = {
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
      {
        data: [30, 50, 20],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF4365", "#2F95D8", "#FFB233"],
      },
    ],
  };

  return <Pie data={data} />;
};

export default PieChart;
