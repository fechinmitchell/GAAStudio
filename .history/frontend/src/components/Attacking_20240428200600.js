import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Image, Button } from 'react-bootstrap'; // Import Button here
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Attacking({ scoringZoneEfficiency, heatMapUrl, setDataType, selectedTeam }) {
  const [teamPlayerStats, setTeamPlayerStats] = useState([]);

  useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await axios.get('/players');
              const filteredData = response.data.filter(player => player.TeamName === selectedTeam);
              setTeamPlayerStats(filteredData);
          } catch (error) {
              console.error('Error fetching player stats:', error);
          }
      };
      fetchData();
  }, [selectedTeam]); // Refetch whenever selectedTeam changes

  // Existing chart setup remains unchanged
  const chartData = {
      labels: ['Inside Scoring Zone', 'Outside Scoring Zone'],
      datasets: [
          {
              label: 'Success Rate',
              data: [scoringZoneEfficiency.inside * 100, scoringZoneEfficiency.outside * 100],
              backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)'],
              borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
              borderWidth: 1,
          },
      ],
  };

  const chartOptions = {
      responsive: true,
      plugins: {
          legend: {
              display: true,
              position: 'top',
          },
          tooltip: {
              callbacks: {
                  label: function(context) {
                      return `${context.dataset.label}: ${context.parsed.y}%`;
                  },
              },
          },
      },
      scales: {
          y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                  callback: function(value) {
                      return value + '%';
                  },
              },
          },
      },
  };

  return (
      <div className="content-container" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', padding: '20px' }}>
          <div className="chart-container" style={{ flex: 1.5, minWidth: '400px', maxWidth: '55%', margin: '10px' }}>
              <Bar data={chartData} options={chartOptions} />
          </div>
          <div className="heatmap-container" style={{ flex: 1, minWidth: '400px', maxWidth: '60%', margin: '10px', textAlign: 'center' }}>
              <Image src={heatMapUrl} alt="Heat Map" fluid />
              <div className="button-group" style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <Button variant="primary" size="sm" onClick={() => setDataType('shots')}>Shots</Button>
                  <Button variant="danger" size="sm" onClick={() => setDataType('miss')}>Misses</Button>
                  <Button variant="success" size="sm" onClick={() => setDataType('score')}>Scores</Button>
              </div>
              <Table striped bordered hover size="sm" style={{ marginTop: '20px' }}>
                  <thead>
                      <tr>
                          <th>Player Name</th>
                          <th>Scores</th>
                          <th>Shots</th>
                          <th>xP Adv Shot</th>
                          <th>xPoints</th>
                      </tr>
                  </thead>
                  <tbody>
                      {teamPlayerStats.map((player, index) => (
                          <tr key={index}>
                              <td>{player.PlayerName}</td>
                              <td>{player.Scores}</td>
                              <td>{player.Shots}</td>
                              <td>{player.xP_adv_shot}</td>
                              <td>{player.xPoints}</td>
                          </tr>
                      ))}
                  </tbody>
              </Table>
          </div>
      </div>
  );
}

export default Attacking;






