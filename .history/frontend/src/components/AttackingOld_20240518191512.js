import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Attacking.css';
import { Bar } from 'react-chartjs-2';
import { Image, Button } from 'react-bootstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Attacking({ selectedTeam, scoringZoneEfficiency, heatMapUrl, setDataType }) {
  const [playerStats, setPlayerStats] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'PlayerName', direction: 'ascending' });
  const [isLoading, setIsLoading] = useState(true);
  const [SDPMChartUrl, setSDPMChartUrl] = useState('');
  const [ASDMapUrl, setASDMapUrl] = useState('');

  useEffect(() => {
    if (selectedTeam) {
      axios.get(`/sdpmchart/${encodeURIComponent(selectedTeam)}`)
        .then(response => {
          setSDPMChartUrl(response.data.url);
        })
        .catch(error => {
          console.error('Error fetching SDPM chart URL:', error);
        });

      axios.get(`/asdmap/${encodeURIComponent(selectedTeam)}`)
        .then(response => {
          setASDMapUrl(response.data.url);
        })
        .catch(error => {
          console.error('Error fetching ASD map URL:', error);
        });
    }
  }, [selectedTeam]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/players');
        console.log("Fetched data:", response.data);  // Log the data received from the backend
        if (response.data && response.data.length) {
          setPlayerStats(response.data);
        } else {
          console.log('No data returned from API');
        }
      } catch (error) {
        console.error('Error fetching player stats:', error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const sortedPlayerStats = React.useMemo(() => {
    if (!playerStats.length) return [];
    
    return playerStats.filter(player => player.TeamName === selectedTeam).sort((a, b) => {
      const isAsc = sortConfig.direction === 'ascending';
      return (a[sortConfig.key] < b[sortConfig.key]) ? (isAsc ? -1 : 1) : (a[sortConfig.key] > b[sortConfig.key] ? (isAsc ? 1 : -1) : 0);
    });
  }, [playerStats, sortConfig, selectedTeam]);

  const requestSort = key => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending'
    }));
  };

  const formatNumber = num => parseFloat(num).toFixed(2);

  if (isLoading) {
    return <div>Loading data, please wait...</div>;
  }

  if (!sortedPlayerStats.length) {
    return <div>No players found for the selected team or data is still loading.</div>;
  }

  const chartData = {
    labels: ['Inside Scoring Zone', 'Outside Scoring Zone'],
    datasets: [{
      label: 'Success Rate',
      data: [scoringZoneEfficiency.inside * 100, scoringZoneEfficiency.outside * 100],
      backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)'],
      borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
      borderWidth: 1,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: {
        callbacks: {
          label: context => `${context.dataset.label}: ${context.raw.toFixed(2)}%`,
        },
      },
      datalabels: {
        display: true,
        align: 'end',
        anchor: 'end',
        formatter: (value) => `${value.toFixed(2)}%`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => `${value}%`,
        },
      },
    },
  };

  return (
    <div className="attacking-container">
      <h1>Attacking Stats</h1>
      <div className="additional-charts-container">
        <div className="additional-chart-container">
          {selectedTeam && SDPMChartUrl && <Image src={SDPMChartUrl} alt={`${selectedTeam} SDPM Chart`} fluid />}
        </div>
        <div className="additional-chart-container">
          {selectedTeam && ASDMapUrl && <Image src={ASDMapUrl} alt={`${selectedTeam} ASD Map`} fluid />}
        </div>
      </div>
      <table className="player-stats-table">
        <thead>
          <tr>
            {['PlayerName', 'PointsDifference', 'xPoints', 'Points', 'Goals'].map(header => (
              <th key={header} onClick={() => requestSort(header)}>
                {header} {sortConfig.key === header && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedPlayerStats.map(player => (
            <tr key={player.PlayerName}>
              <td>{player.PlayerName}</td>
              <td>{formatNumber(player.PointsDifference)}</td>
              <td>{formatNumber(player.xPoints)}</td>
              <td>{formatNumber(player.Points)}</td>
              <td>{formatNumber(player.Goals)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button onClick={() => setDataType('heatmap')}>Back to Heatmaps</Button>
    </div>
  );
}

export default Attacking;
