import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [teamData, setTeamData] = useState([]);

  useEffect(() => {
    // Replace `YOUR_BACKEND_API_ENDPOINT` with your actual backend API endpoint
    fetch('YOUR_BACKEND_API_ENDPOINT/teams')
      .then((response) => response.json())
      .then(setTeams);
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      fetch(`YOUR_BACKEND_API_ENDPOINT/team-data?team=${encodeURIComponent(selectedTeam)}`)
        .then((response) => response.json())
        .then(setTeamData);
    }
  }, [selectedTeam]);

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
            {/* Customize based on your actual data structure */}
            <p>Player: {data.PlayerName}</p>
            <p>Action: {data.Action}</p>
            <p>Score: {data.Score}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;


