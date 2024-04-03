import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [teamData, setTeamData] = useState([]);

  useEffect(() => {
    fetch('/teams') // This path should match your Flask route.
      .then(response => response.json())
      .then(data => setTeams(data))
      .catch(error => console.error('Error fetching team data:', error));
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      fetch(`/team-data?team=${encodeURIComponent(selectedTeam)}`) // Use relative path directly
        .then(response => response.json())
        .then(setTeamData)
        .catch(error => console.error('Error fetching team details:', error));
    } else {
      // Optionally clear previous team data when no team is selected
      setTeamData([]);
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


