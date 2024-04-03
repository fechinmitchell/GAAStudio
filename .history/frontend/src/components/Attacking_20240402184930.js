import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Image } from 'react-bootstrap';
import { Grid } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Attacking({ scoringZoneEfficiency, heatMapUrl }) {
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
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <div className="chart-container">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </Grid>
      <Grid item xs={12} md={6}>
              <Image src={heatMapUrl} alt={`${dataType} heat map`} fluid />
              <Grid container justifyContent="center" spacing={2}>
                <Grid item>
                  <HeatMapButton color="blue" label="Shots" active={dataType === 'shots'} onClick={() => setDataType('shots')} />
                </Grid>
                <Grid item>
                  <HeatMapButton color="red" label="Misses" active={dataType === 'miss'} onClick={() => setDataType('miss')} />
                </Grid>
                <Grid item>
                  <HeatMapButton color="green" label="Scores" active={dataType === 'score'} onClick={() => setDataType('score')} />
                </Grid>
              </Grid>
    </Grid>
  );
}

export default Attacking;
