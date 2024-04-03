import React, { useState, useEffect } from 'react';

function App() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [teamData, setTeamData] = useState([]);

  useEffect(() => {
    fetch('/teams')
      .then((response) => response.json())
      .then(setTeams);
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      fetch(`/team-data?team=${selectedTeam}`)
        .then((response) => response.json())
        .then(setTeamData);
    }
  }, [selectedTeam]);

  return (
    <div>
      <select onChange={(e) => setSelectedTeam(e.target.value)} value={selectedTeam}>
        <option value="">Select a team</option>
        {teams.map((team) => (
          <option key={team} value={team}>{team}</option>
        ))}
      </select>
      <div>
        {teamData.map((data, index) => (
          <div key={index}>
            {/* Display your data here */}
            <p>{data.PlayerName}: {data.Action}, {data.Score}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

