import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Image, Button, Table } from 'react-bootstrap'; // Import Table from react-bootstrap
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Attacking({ scoringZoneEfficiency, heatMapUrl, setDataType, selectedTeam }) { // Ensure setDataType is received here
  const [playerStats, setPlayerStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/players?team=${encodeURIComponent(selectedTeam)}`);
        setPlayerStats(response.data);
      } catch (error) {
        console.error('Error fetching team player stats:', error);
      }
    };

    if (selectedTeam) {
      fetchData();
    }
  }, [selectedTeam]);

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
    <div className="content-container" style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
      <div className="chart-container" style={{ marginBottom: '20px' }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
      <div className="table-container">
        <Table striped bordered hover>
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
    </div>
  );
}

export default Attacking;
