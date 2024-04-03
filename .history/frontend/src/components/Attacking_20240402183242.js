import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Image } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Attacking({ scoringZoneEfficiency, heatMapUrl, dataType }) {
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
    animation: {
      onComplete: function() {
        var ctx = this.ctx;
        ctx.font = '12px sans-serif';
        ctx.fillStyle = '#444';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        this.data.datasets.forEach((dataset, datasetIndex) => {
          const meta = this.getDatasetMeta(datasetIndex);
          meta.data.forEach((bar, index) => {
            const label = parseFloat(dataset.data[index]).toFixed(1);
            ctx.fillText(label + '%', bar.x, bar.y - 5);
          });
        });
      },
    },
  };

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

  return (
    <>
      <div className="chart-container">
        <Bar data={chartData} options={chartOptions} />
      </div>
      <div className="heatmap-container">
        <Image src={heatMapUrl} alt={`${dataType} heat map`} fluid />
      </div>
    </>
  );
}

export default Attacking;
