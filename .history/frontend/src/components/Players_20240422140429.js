import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Players.css'; // Make sure the path to your CSS file is correct

function Players() {
  const [playerStats, setPlayerStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/players');
        setPlayerStats(response.data);
      } catch (error) {
        console.error('Error fetching player stats:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="players-container">
      <h1 className="players-header">Players Stats</h1>
      <div className="table-container">
        <table className="players-table">
          <thead className="players-thead">
          <tr>
            <th>Player Name</th>
            <th>Team Name</th>
            <th>Scores</th>
            <th>Shots</th>
            <th>xP Adv Shot</th>
            <th>xPoints</th>
            <th>Success UP</th>
            <th>Failed UP</th>
            <th>Scored Right</th>
            <th>Scored Left</th>
            <th>Scored Hand</th>
            <th>Shot Distance</th>
            <th>Success UP Percentage</th>
            <th>Difference</th>
          </tr>
          </thead>
          <tbody>
            {playerStats.map((player, index) => (
              <tr key={index} className={`player-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
              <td>{player.PlayerName}</td>
              <td>{player.TeamName}</td>
              <td>{player.Scores}</td>
              <td>{player.Shots}</td>
              <td>{player.xP_adv_shot}</td>
              <td>{player.xPoints}</td>
              <td>{player.Success_UP}</td>
              <td>{player.Failed_UP}</td>
              <td>{player.Scored_Right}</td>
              <td>{player.Scored_Left}</td>
              <td>{player.Scored_Hand}</td>
              <td>{player.Shot_Distance}</td>
              <td>{player.Success_UP_Percentage}</td>
              <td>{player.Difference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Players;