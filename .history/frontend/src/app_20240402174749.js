import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Image } from 'react-bootstrap';
import { Button, Box } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Sidebar from './Sidebar'; // Ensure you have imported the Sidebar component


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function HeatMapButton({ color, label, active, onClick }) {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      style={{
        backgroundColor: active ? color : '#c0c0c0',
        margin: '0 10px',
        color: 'white',
        width: '100px',
      }}
    >
      {label}
    </Button>
  );
}

function App() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('Galway');
  const [dataType, setDataType] = useState('shots');
  const [heatMapUrl, setHeatMapUrl] = useState('');
  const [teamData, setTeamData] = useState([]);
  const [scoringZoneEfficiency, setScoringZoneEfficiency] = useState({ inside: 0, outside: 0 });

  useEffect(() => {
    fetch('/teams')
      .then(response => response.json())
      .then(data => setTeams(data))
      .catch(error => console.error('Error fetching team data:', error));
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      fetch(`/team-data?team=${encodeURIComponent(selectedTeam)}`)
        .then(response => response.json())
        .then(data => setTeamData(data))
        .catch(error => console.error('Error fetching team details:', error));
    } else {
      setTeamData([]);
    }
  }, [selectedTeam]);

  useEffect(() => {
    if (selectedTeam) {
      fetch(`/scoring-zone-efficiency?team=${encodeURIComponent(selectedTeam)}`)
        .then(response => response.json())
        .then(data => {
          setScoringZoneEfficiency({
            inside: data.inside_scoring_zone.success_rate || 0,
            outside: data.outside_scoring_zone.success_rate || 0
          });
        })
        .catch(error => console.error('Error fetching scoring zone efficiency:', error));
    }
  }, [selectedTeam]);

  useEffect(() => {
    if (selectedTeam && dataType) {
      const url = `/heatmaps/${selectedTeam}/${dataType}`;
      setHeatMapUrl(url);
    }
  }, [selectedTeam, dataType]);

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
            const label = parseFloat(dataset.data[index]).toFixed(1); // Rounds to one decimal place
            ctx.fillText(label + '%', bar.x, bar.y - 5);
          });
        });
      }
    },
  }

  const chartData = {
    labels: ['Inside Scoring Zone', 'Outside Scoring Zone'],
    datasets: [
      {
        label: 'Success Rate',
        data: [scoringZoneEfficiency.inside * 100, scoringZoneEfficiency.outside * 100],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
        borderWidth: 1
      }
    ],
  };

  return (
    <div className="App">
      <header className="App-header">
        GAA Studio - Analytics Dashboard
      </header>
      <Box sx={{ display: 'flex' }}>
        <Sidebar onNavigate={handleNavigate} />
        <Box sx={{ flexGrow: 1, p: 3 }}></Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, margin: 2 }}>
        <Box>
          <select onChange={(e) => setSelectedTeam(e.target.value)} value={selectedTeam}>
            <option value="">Select a team</option>
            {teams.map(team => <option key={team} value={team}>{team}</option>)}
          </select>
          <div className="chart-container">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </Box>
        <Box>
          <Image src={heatMapUrl} alt={`${dataType} heat map`} fluid />
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <HeatMapButton color="blue" label="Shots" active={dataType === 'shots'} onClick={() => setDataType('shots')} />
            <HeatMapButton color="red" label="Misses" active={dataType === 'miss'} onClick={() => setDataType('miss')} />
            <HeatMapButton color="green" label="Scores" active={dataType === 'score'} onClick={() => setDataType('score')} />
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default App;
