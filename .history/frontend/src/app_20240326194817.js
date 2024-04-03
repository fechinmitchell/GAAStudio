import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Slider } from '@mui/material';
import { Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is installed
import './App.css';

// Register the Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function HeatMapSlider({ selectedTeam }) {
  const [dataType, setDataType] = useState('shots');
  const [heatMapUrl, setHeatMapUrl] = useState('');

  useEffect(() => {
    if (selectedTeam && dataType) {
      const url = `/heatmaps/${selectedTeam}/${dataType}`;
      setHeatMapUrl(url);
      console.log(url); // Log the URL to the console
    }
}, [selectedTeam, dataType]);

  const handleSliderChange = (event, newValue) => {
    const types = ['shots', 'scores', 'misses'];
    setDataType(types[newValue]);
  };

  return (
    <div>
      <Image src={heatMapUrl} alt={`${dataType} heat map`} fluid className="heatmap-image" />
      <Slider
        defaultValue={0}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={1}
        marks
        min={0}
        max={2}
        onChange={handleSliderChange}
        valueLabelFormat={(value) => ['Shots', 'Scores', 'Misses'][value]}
      />
    </div>
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
      <select onChange={(e) => setSelectedTeam(e.target.value)} value={selectedTeam}>
        <option value="">Select a team</option>
        {teams.map(team => <option key={team} value={team}>{team}</option>)}
      </select>
      <div>
        {teamData.map((data, index) => (
          <div key={index} className="team-data">
            <p>Player: {data.PlayerName}</p>
            <p>Action: {data.Action}</p>
            <p>Score: {data.Score}</p>
          </div>
        ))}
      </div>
      {selectedTeam && (
        <>
          <div className="chart-container">
          <Bar data={chartData} options={{ responsive: true }} />
          </div>
          <HeatMapSlider selectedTeam={selectedTeam} />
        </>
      )}
    </div>
  );
}

export default App;

