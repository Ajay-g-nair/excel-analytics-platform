import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// We wrap the component in React.forwardRef to allow it to receive a ref
const ChartComponent = React.forwardRef(({ chartData }, ref) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Data Chart',
      },
    },
  };

  // The 'ref' is passed directly to the Bar component
  return <Bar ref={ref} options={options} data={chartData} />;
});

export default ChartComponent;