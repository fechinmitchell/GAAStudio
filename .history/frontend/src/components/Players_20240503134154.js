import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Players.css';

function Players() {
  const [playerStats, setPlayerStats] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

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

  const sortedPlayerStats = React.useMemo(() => {
    let sortableItems = [...playerStats];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [playerStats, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  }
  
  return (
    <div className="players-container">
    <h1 className="players-header">Players Stats</h1>
    <div className="table-scroll-container">
      <table className="players-table">
        <thead className="players-thead">
          <tr>
            <th onClick={() => requestSort('PlayerName')}>Player Name</th>
            <th onClick={() => requestSort('TeamName')}>Team Name</th>
            <th onClick={() => requestSort('Scores')}>Scores</th>
            <th onClick={() => requestSort('Shots')}>Shots</th>
            <th onClick={() => requestSort('xP_adv_shot')}>xP Adv Shot</th>
            <th onClick={() => requestSort('xPoints')}>xPoints</th>
            <th onClick={() => requestSort('Success_UP')}>Success UP</th>
            <th onClick={() => requestSort('Failed_UP')}>Failed UP</th>
            <th onClick={() => requestSort('Scored_Right')}>Scored Right</th>
            <th onClick={() => requestSort('Scored_Left')}>Scored Left</th>
            <th onClick={() => requestSort('Scored_Hand')}>Scored Hand</th>
            <th onClick={() => requestSort('Shot_Distance')}>Shot Distance</th>
            <th onClick={() => requestSort('Difference')}>Difference</th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayerStats.map((player, index) => (
            <tr key={index} className={`player-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
              <td>{player.PlayerName}</td>
              <td>{player.TeamName}</td>
              <td>{player.Scores}</td>
              <td>{player.Shots}</td>
              <td>{Number(player.xP_adv_shot).toFixed(2)}</td>
              <td>{Number(player.xPoints).toFixed(2)}</td>
              <td>{player.Success_UP}</td>
              <td>{player.Failed_UP}</td>
              <td>{player.Scored_Right}</td>
              <td>{player.Scored_Left}</td>
              <td>{player.Scored_Hand}</td>
              <td>{Number(player.Shot_Distance).toFixed(2)}</td>
              <td>{Number(player.Difference).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
}

export default Players;
