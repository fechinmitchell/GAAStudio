import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Image } from 'react-bootstrap';
import { Button, Grid } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Sidebar from './Sidebar';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function HeatMapButton({ color, label, active, onClick }) {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      style={{
        backgroundColor: active ? color : '#c0c0c0',
        color: 'white',
        width: '100px',
      }}
    >
      {label}
    </Button>
  );
}

const handleNavigate = (page) => {
  // Implement navigation logic based on the 'page' argument
  console.log(page); // Placeholder for navigation logic
};

function App() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('Galway');
  const [dataType, setDataType] = useState('shots');
  const [heatMapUrl, setHeatMapUrl] = useState('');
  const [teamData, setTeamData] = useState([]);
  const [scoringZoneEfficiency, setScoringZoneEfficiency] = useState({ inside: 0, outside: 0 });

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
          setScoringZoneEfficiency({
            inside: data.inside_scoring_zone.success_rate || 0,
            outside: data.outside_scoring_zone.success_rate || 0
          });
        })
        .catch(error => console.error('Error fetching scoring zone efficiency:', error));
    }
  }, [selectedTeam]);

  useEffect(() => {
    if (selectedTeam && dataType) {
      const url = `/heatmaps/${selectedTeam}/${dataType}`;
      setHeatMapUrl(url);
    }
  }, [selectedTeam, dataType]);

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
    animation: {
      onComplete: function() {
        var ctx = this.ctx;
        ctx.font = '12px sans-serif';
        ctx.fillStyle = '#444';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        this.data.datasets.forEach((dataset, datasetIndex) => {
          const meta = this.getDatasetMeta(datasetIndex);
          meta.data.forEach((bar, index) => {
            const label = parseFloat(dataset.data[index]).toFixed(1); // Rounds to one decimal place
            ctx.fillText(label + '%', bar.x, bar.y - 5);
          });
        });
      }
    },
  }

  const chartData = {
    labels: ['Inside Scoring Zone', 'Outside Scoring Zone'],
    datasets: [
      {
        label: 'Success Rate',
        data: [scoringZoneEfficiency.inside * 100, scoringZoneEfficiency.outside * 100],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
        borderWidth: 1
      }
    ],
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div className="App">
      <header className="App-header">
        GAA Studio - Analytics Dashboard
      </header>
      <Grid container spacing={2}>
        {!isMobile && (
          <Grid item xs={12} sm={3} md={2}>
            <Sidebar onNavigate={handleNavigate} />
          </Grid>
        )}
        <Grid item xs={12} sm={9} md={10}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <select onChange={(e) => setSelectedTeam(e.target.value)} value={selectedTeam}>
                <option value="">Select a team</option>
                {teams.map(team => <option key={team} value={team}>{team}</option>)}
              </select>
              <div className="chart-container">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <Image src={heatMapUrl} alt={`${dataType} heat map`} fluid />
              <Grid container justifyContent="center" spacing={2}>
                <Grid item>
                  <HeatMapButton color="blue" label="Shots" active={dataType === 'shots'} onClick={() => setDataType('shots')} />
                </Grid>
                <Grid item>
                  <HeatMapButton color="red" label="Misses" active={dataType === 'miss'} onClick={() => setDataType('miss')} />
                </Grid>
                <Grid item>
                  <HeatMapButton color="green" label="Scores" active={dataType === 'score'} onClick={() => setDataType('score')} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
