import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Image } from 'react-bootstrap';
import { Button, Box } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Register the Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function HeatMapButton({ color, label, active, onClick }) {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      sx={{
        backgroundColor: active ? color : 'grey',
        '&:hover': {
          backgroundColor: color,
          opacity: 0.9
        },
      }}
    >
      {label}
    </Button>
  );
}

function HeatMapControls({ selectedTeam, setDataType }) {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <HeatMapButton color="blue" label="Shots" active={selectedTeam === 'shots'} onClick={() => setDataType('shots')} />
      <HeatMapButton color="red" label="Misses" active={selectedTeam === 'miss'} onClick={() => setDataType('miss')} />
      <HeatMapButton color="green" label="Scores" active={selectedTeam === 'score'} onClick={() => setDataType('score')} />
    </Box>
  );
}

function App() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [teamData, setTeamData] = useState([]);
  const [scoringZoneEfficiency, setScoringZoneEfficiency] = useState({});

  useEffect(() => {
    // Replace '/teams' with the actual endpoint from your Flask app
    fetch('/teams')
      .then(response => response.json())
      .then(data => setTeams(data))
      .catch(error => console.error('Error fetching team data:', error));
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      // Replace with your actual Flask endpoints
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
      // Replace with your actual Flask endpoints
      fetch(`/scoring-zone-efficiency?team=${encodeURIComponent(selectedTeam)}`)
        .then(response => response.json())
        .then(data => {
          const chartData = {
            inside: data.inside_scoring_zone.success_rate || 0,
            outside: data.outside_scoring_zone.success_rate || 0
          };
          setScoringZoneEfficiency(chartData);
        })
        .catch(error => console.error('Error fetching scoring zone efficiency:', error));
    }
  }, [selectedTeam]);

  const chartData = {
    labels: ['Inside Scoring Zone', 'Outside Scoring Zone'],
    datasets: [
      {
        label: 'Success Rate',
        data: [scoringZoneEfficiency.inside, scoringZoneEfficiency.outside],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="App">
      <header className="App-header">GAA Studio - Analytics Dashboard</header>
      <div className="grid-container">
        <div className="chart-container">
          <Bar data={chartData} options={{ responsive: true }} />
        </div>
        <div className="heatmap-container">
          <Image src={heatMapUrl} alt={`${dataType} heat map`} fluid className="heatmap-image" />
          <HeatMapControls selectedTeam={selectedTeam} setDataType={setDataType} />
        </div>
        <div className="team-selector">
          <select onChange={(e) => setSelectedTeam(e.target.value)} value={selectedTeam}>
            <option value="">Select a team</option>
            {teams.map(team => <option key={team} value={team}>{team}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

export default App;

