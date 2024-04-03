import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import './App.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


function App() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
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
          // Process the data into a format suitable for Chart.js
          const chartData = {
            inside: data.true?.success_rate || 0,
            outside: data.false?.success_rate || 0
          };
          setScoringZoneEfficiency(chartData);
        })
        .catch(error => console.error('Error fetching scoring zone efficiency:', error));
    }
  }, [selectedTeam]);

  // Chart data and options
  const chartData = {
    labels: ['Inside Scoring Zone', 'Outside Scoring Zone'],
    datasets: [
      {
        label: 'Success Rate',
        data: [scoringZoneEfficiency.inside, scoringZoneEfficiency.outside],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1
      },
    ],
  };

  return (
    <div className="App">
      <header className="App-header">
        Football Analytics
      </header>
      <select onChange={(e) => setSelectedTeam(e.target.value)} value={selectedTeam}>
        <option value="">Select a team</option>
        {teams.map((team) => (
          <option key={team} value={team}>{team}</option>
        ))}
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
        <div className="chart-container">
          <Bar data={chartData} />
        </div>
      )}
    </div>
  );
}

export default App;
