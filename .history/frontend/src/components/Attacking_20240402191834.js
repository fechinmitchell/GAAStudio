import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Image } from 'react-bootstrap';
import { Grid, Button } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Attacking({ scoringZoneEfficiency, basePath, selectedTeam }) {
  const [dataType, setDataType] = useState('shots');

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

  const heatMapUrl = `${basePath}/${selectedTeam}/${dataType}_heat_map.jpg`;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <div className="chart-container">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </Grid>
      <Grid item xs={12} md={6}>
        <div className="heatmap-container">
          <Image src={heatMapUrl} alt={`${dataType} heatmap`} fluid />
        </div>
      </Grid>
      <Grid item xs={12} style={{ textAlign: 'center' }}>
        <Button variant="contained" onClick={() => setDataType('shots')} color={dataType === 'shots' ? "primary" : "inherit"} style={{ margin: '0 10px' }}>Shots</Button>
        <Button variant="contained" onClick={() => setDataType('misses')} color={dataType === 'misses' ? "primary" : "inherit"} style={{ margin: '0 10px' }}>Misses</Button>
        <Button variant="contained" onClick={() => setDataType('scores')} color={dataType === 'scores' ? "primary" : "inherit"} style={{ margin: '0 10px' }}>Scores</Button>
      </Grid>
    </Grid>
  );
}

export default Attacking;



