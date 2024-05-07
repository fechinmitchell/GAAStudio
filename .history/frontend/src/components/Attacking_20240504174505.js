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
import 'chartjs-plugin-datalabels'; // Ensure this plugin is correctly installed and imported

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Attacking({ selectedTeam, scoringZoneEfficiency, heatMapUrl, setDataType }) {
  const [playerStats, setPlayerStats] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'PlayerName', direction: 'ascending' });
  const [isLoading, setIsLoading] = useState(true);
  const [SDPMChartUrl, setSDPMChartUrl] = useState('');
  const [ASDMapUrl, setASDMapUrl] = useState('');

  useEffect(() => {
    if (selectedTeam) {
        setSDPMChartUrl(`/sdpmchart/${encodeURIComponent(selectedTeam)}`);
        setASDMapUrl(`/asdmap/${encodeURIComponent(selectedTeam)}`);
    }
  }, [selectedTeam]);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get('/players');
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

  // Prepare the chart data and options
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
          label: context => `${context.dataset.label}: ${context.parsed.y.toFixed(2)}%`
        }
      },
      datalabels: {
        color: '#444',
        anchor: 'end',
        align: 'top',
        formatter: value => `${value.toFixed(2)}%`
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { callback: value => `${value}%` },
      },
    },
  };

  return (
    <div className="content-container">
      <div className="chart-and-heatmap-container">
        <div className="chart-container">
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div className="heatmap-container">
          <Image src={heatMapUrl} alt="Heat Map" fluid />
          <div className="button-group">
            <Button variant="primary" size="sm" onClick={() => setDataType('shots')}>Shots</Button>
            <Button variant="danger" size="sm" onClick={() => setDataType('miss')}>Misses</Button>
            <Button variant="success" size="sm" onClick={() => setDataType('score')}>Scores</Button>
          </div>
        </div>
      </div>
      <div className="additional-charts-container">
        <div className="additional-chart-container">
          {selectedTeam && SDPMChartUrl && <Image src={SDPMChartUrl} alt={`${selectedTeam} SDPM Chart`} fluid />}
        </div>
        <div className="additional-chart-container">
          {selectedTeam && ASDMapUrl && <Image src={ASDMapUrl} alt={`${selectedTeam} ASD Map`} fluid />}
        </div>
      </div>
      <div className="fixed-table-container">
        <table className="fixed-players-table">
          <thead className="fixed-players-thead">
            <tr>
              <th onClick={() => requestSort('PlayerName')}>Player Name</th>
              <th onClick={() => requestSort('TeamName')}>Team Name</th>
              <th onClick={() => requestSort('Scores')}>Scores</th>
              <th onClick={() => requestSort('Shots')}>Shots</th>
              <th onClick={() => requestSort('xP_adv_shot')}>xP Adv Shot</th>
              <th onClick={() => requestSort('xPoints')}>xPoints</th>
              <th onClick={() => requestSort('Success_UP')}>Success UP</th>
              <th onClick={() => requestSort('Scored_Right')}>Scored Right</th>
              <th onClick={() => requestSort('Scored_Left')}>Scored Left</th>
              <th onClick={() to requestSort('Scored_Hand')}>Scored Hand</th>
              <th onClick={() => requestSort('Shot_Distance')}>Average Shot Distance</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayerStats.map((player, index) => (
              <tr key={index} className={`fixed-player-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
                <td>{player.PlayerName}</td>
                <td>{player.TeamName}</td>
                <td>{formatNumber(player.Scores)}</td>
                <td>{formatNumber(player.Shots)}</td>
                <td>{formatNumber(player.xP_adv_shot)}</td>
                <td>{formatNumber(player.xPoints)}</td>
                <td>{formatNumber(player.Success_UP)}</td>
                <td>{formatNumber(player.Scored_Right)}</td>
                <td>{formatNumber(player.Scored_Left)}</td>
                <td>{formatNumber(player.Scored_Hand)}</td>
                <td>{formatNumber(player.Shot_Distance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Attacking;
