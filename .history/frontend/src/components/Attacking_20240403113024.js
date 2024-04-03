import React from 'react';
// Add Button import from react-bootstrap
import { Bar } from 'react-chartjs-2';
import { Image, Button } from 'react-bootstrap'; // Import Button here
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Attacking({ scoringZoneEfficiency, heatMapUrl, setDataType }) { // Ensure setDataType is received here
  const chartData = {
    labels: ['Inside Scoring Zone', 'Outside Scoring Zone'],
    datasets: [
      {
        label: 'Success Rate',
        data: [scoringZoneEfficiency.inside * 100, scoringZoneEfficiency.outside * 100],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          },
        },
      },
    },
  };

  return (
    <>
      <div className="chart-container">
        <Bar data={chartData} options={chartOptions} />
      </div>
      <div className="heatmap-container">
        <Image src={heatMapUrl} alt="Heat Map" fluid />
        {/* Button group for selecting heatmap type */}
        <div className="button-group">
          <Button variant="primary" onClick={() => setDataType('shots')}>Shots</Button>
          <Button variant="secondary" onClick={() => setDataType('miss')}>Misses</Button>
          <Button variant="success" onClick={() => setDataType('score')}>Scores</Button>
        </div>
      </div>
    </>
  );
}

export default Attacking;





