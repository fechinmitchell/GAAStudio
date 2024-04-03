// In src/components/Attacking.js

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Image } from 'react-bootstrap';

function Attacking({ chartData, chartOptions, heatMapUrl, dataType }) {
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
