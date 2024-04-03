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
    <div className="content-container" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', padding: '20px' }}>
      <div className="chart-container" style={{ flex: 1, minWidth: '300px', maxWidth: '70%', margin: '10px' }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
      <div className="heatmap-container" style={{ flex: 1, minWidth: '300px', maxWidth: '50%', margin: '10px', textAlign: 'center' }}>
        <Image src={heatMapUrl} alt="Heat Map" fluid />
        <div className="button-group" style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          {/* Using 'sm' prop to make buttons smaller */}
          <Button variant="primary" size="sm" onClick={() => setDataType('shots')}>Shots</Button>
          <Button variant="secondary" size="sm" onClick={() => setDataType('miss')}>Misses</Button>
          <Button variant="success" size="sm" onClick={() => setDataType('score')}>Scores</Button>
        </div>
      </div>
    </div>
  );
}

export default Attacking;





