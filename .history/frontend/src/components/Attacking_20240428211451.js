import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Players.css';
import { Bar } from 'react-chartjs-2';
import { Image, Button, Table } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Attacking({ scoringZoneEfficiency, heatMapUrl, setDataType, selectedTeam }) {
  const [playerStats, setPlayerStats] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/players');
        setPlayerStats(response.data);
      } catch (error) {
        console.error('Error fetching player stats:', error);
      }
    };
    fetchData();
  }, []);

  const sortedPlayerStats = React.useMemo(() => {
    let sortableItems = [...playerStats];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [playerStats, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  }

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
      <table className="players-table">
        <thead className="players-thead">
          <tr>
            <th onClick={() => requestSort('PlayerName')}>Player Name</th>
            <th onClick={() => requestSort('TeamName')}>Team Name</th>
            <th onClick={() => requestSort('Scores')}>Scores</th>
            <th onClick={() => requestSort('Shots')}>Shots</th>
            <th onClick={() => requestSort('xP_adv_shot')}>xP Adv Shot</th>
            <th onClick={() => requestSort('xPoints')}>xPoints</th>
            <th onClick={() => requestSort('Success_UP')}>Success UP</th>
            <th onClick={() => requestSort('Failed_UP')}>Failed UP</th>
            <th onClick={() => requestSort('Scored_Right')}>Scored Right</th>
            <th onClick={() => requestSort('Scored_Left')}>Scored Left</th>
            <th onClick={() => requestSort('Scored_Hand')}>Scored Hand</th>
            <th onClick={() => requestSort('Shot_Distance')}>Shot Distance</th>
            <th onClick={() => requestSort('Success_UP_Percentage')}>Success UP Percentage</th>
            <th onClick={() => requestSort('Difference')}>Difference</th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayerStats.map((player, index) => (
            <tr key={index} className={`player-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
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
      </table>
    </div>
  );
}

export default Attacking;
