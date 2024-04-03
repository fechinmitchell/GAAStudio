import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Image } from 'react-bootstrap';
import { Grid, Button } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Attacking({ scoringZoneEfficiency, basePath }) {
  const [dataType, setDataType] = useState('shots');

  const chartData = { /* Your chart data based on scoringZoneEfficiency */ };
  const chartOptions = { /* Your chart options */ };
  
  const heatMapUrl = `${basePath}/${selectedTeam}/${dataType}_heat_map.jpg`;

  return (
    <Grid container spacing={2}>
      {/* Chart and Heatmap rendering */}
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
      {/* Buttons to change dataType */}
      <Grid item xs={12}>
        <Button onClick={() => setDataType('shots')}>Shots</Button>
        <Button onClick={() => setDataType('misses')}>Misses</Button>
        <Button onClick={() => setDataType('scores')}>Scores</Button>
      </Grid>
    </Grid>
  );
}

export default Attacking;


