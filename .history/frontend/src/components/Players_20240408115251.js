import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Players() {
  const [playerStats, setPlayerStats] = useState([]);

  useEffect(() => {
    // Fetch player stats data from backend when the component mounts
    axios.get('/players')
      .then(response => {
        setPlayerStats(response.data);
      })
      .catch(error => {
        console.error('Error fetching player stats:', error);
      });
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  return (
    <div className="player-stats">
      <h2>Players Stats</h2>
      <table>
        <thead>
          <tr>
            <th>Player Name</th>
            <th>Team Name</th>
            <th>Scores</th>
            <th>Shots</th>
            {/* Add more table headers as needed */}
          </tr>
        </thead>
        <tbody>
          {playerStats.map(player => (
            <tr key={player.PlayerName}>
              <td>{player.PlayerName}</td>
              <td>{player.TeamName}</td>
              <td>{player.Scores}</td>
              <td>{player.Shots}</td>
              {/* Add more table cells for other data fields */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Players;
