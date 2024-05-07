import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Image, Button, Table } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Attacking({ scoringZoneEfficiency, heatMapUrl, setDataType, selectedTeam }) {
  const [playerStats, setPlayerStats] = useState([]);

  useEffect(() => {
    if (selectedTeam) {
      axios.get(`/players?team=${encodeURIComponent(selectedTeam)}`)
        .then(response => {
          setPlayerStats(response.data);
        })
        .catch(error => {
          console.error('Error fetching player stats:', error);
        });
    }
  }, [selectedTeam]);  // Depend on selectedTeam to refetch when it changes

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
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}%`;
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
            return `${value}%`;
          },
        },
      },
    },
  };

  return (
    <div className="content-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <div className="chart-and-heatmap-container" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: '20px' }}>
        <div className="chart-container" style={{ minWidth: '400px', maxWidth: '55%' }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div className="heatmap-container" style={{ minWidth: '400px', maxWidth: '45%' }}>
          <Image src={heatMapUrl} alt="Heat Map" fluid />
          <div className="button-group" style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <Button variant="primary" size="sm" onClick={() => setDataType('shots')}>Shots</Button>
            <Button variant="danger" size="sm" onClick={() => setDataType('miss')}>Misses</Button>
            <Button variant="success" size="sm" onClick={() => setDataType('score')}>Scores</Button>
          </div>
        </div>
      </div>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Player Name</th>
            <th>Team Name</th>
            <th>Scores</th>
            <th>Shots</th>
            <th>xP Adv Shot</th>
            <th>xPoints</th>
            <th>Success UP</th>
            <th>Failed UP</th>
            <th>Scored Right</th>
            <th>Scored Left</th>
            <th>Scored Hand</th>
            <th>Shot Distance</th>
            <th>Success UP Percentage</th>
            <th>Difference</th>
          </tr>
        </thead>
        <tbody>
          {playerStats.map((player, index) => (
            <tr key={index}>
              <td>{player.PlayerName}</td>
              <td>{player.TeamName}</td>
              <td>{player.Scores}</td>
              <td>{player.Shots}</td>
              <td>{player.xP_adv_shot}</td>
              <td>{player.xPoints}</td>
              <td>{player.Success_UP}</td>
              <td>{player.Failed_UP}</td>
              <td>{player.Scored_Right}</td>
              <td>{player.Scored_Left}</td>
              <td>{player.Scored_Hand}</td>
              <td>{player.Shot_Distance}</td>
              <td>{player.Success_UP_Percentage}</td>
              <td>{player.Difference}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Attacking;





