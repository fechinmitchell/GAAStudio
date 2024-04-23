import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap'; // Import Table component from react-bootstrap

function Players({ setDataType }) {
  const [playerStats, setPlayerStats] = useState([]);

  useEffect(() => {
    // Fetch player stats data from the backend
    fetch('/player-stats')
      .then(response => response.json())
      .then(data => setPlayerStats(data))
      .catch(error => console.error('Error fetching player stats:', error));
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  return (
    <div className="content-container">
      <h2>Players Stats</h2>
      <Table striped bordered hover> {/* Use react-bootstrap Table component */}
        <thead>
          <tr>
            <th>Player Name</th>
            <th>Stat 1</th>
            <th>Stat 2</th>
            {/* Add more headers for additional stats */}
          </tr>
        </thead>
        <tbody>
          {playerStats.map(player => (
            <tr key={player.id}>
              <td>{player.name}</td>
              <td>{player.stat1}</td>
              <td>{player.stat2}</td>
              {/* Render additional stats */}
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="button-group" style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
        <Button variant="primary" size="sm" onClick={() => setDataType('shots')}>Shots</Button>
        <Button variant="danger" size="sm" onClick={() => setDataType('miss')}>Misses</Button>
        <Button variant="success" size="sm" onClick={() => setDataType('score')}>Scores</Button>
      </div>
    </div>
  );
}

export default Players;
