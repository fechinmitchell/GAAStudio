import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Image } from 'react-bootstrap';
import { Button, Box } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

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
        width: '100px', // Set the width to ensure consistent button size
      }}
    >
      {label}
    </Button>
  );
}

function App() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('Galway'); // Default to 'Galway'
  const [dataType, setDataType] = useState('shots');
  const [heatMapUrl, setHeatMapUrl] = useState('');
  const [teamData, setTeamData] = useState([]);
  const [scoringZoneEfficiency, setScoringZoneEfficiency] = useState({});

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
          const successRates = {
            inside: data.inside_scoring_zone.success_rate || 0,
            outside: data.outside_scoring_zone.success_rate || 0
          };
          setScoringZoneEfficiency(successRates);
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
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, margin: 2 }}>
        <Box>
          <select onChange={(e) => setSelectedTeam(e.target.value)} value={selectedTeam}>
            <option value="">Select a team</option>
            {teams.map(team => <option key={team} value={team}>{team}</option>)}
          </select>
          <div className="chart-container">
            <Bar data={chartData} options={{ responsive: true }} />
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
