
The error you're encountering indicates that the import statement for MUI CSS is incorrect. In recent versions of MUI (formerly Material-UI), the CSS import might not be necessary as it was in earlier versions. Starting from version 5, MUI switched to using the Emotion library for styling components, which means you don't need to import CSS the same way you did with older versions.

Here's how you can adjust your App.js to ensure it aligns with the current standards of MUI and does not throw import errors:

Remove the MUI CSS Import: Since MUI v5 and beyond use Emotion for styling, importing CSS directly like this isn't the typical approach.

Ensure Correct Bootstrap Import: The bootstrap/dist/css/bootstrap.min.css import statement is correct, assuming you have Bootstrap installed in your project.

Given this, let's correct your App.js by removing the unnecessary MUI CSS import and ensuring everything else is in place:

jsx
Copy code
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

