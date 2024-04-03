import React, { useState, useEffect } from 'react';
import { Grid, useTheme, useMediaQuery } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Sidebar from './components/Sidebar';
import Attacking from './components/Attacking';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('Galway');
  const [currentPage, setCurrentPage] = useState('attacking');
  const [dataType, setDataType] = useState('shots');
  const [scoringZoneEfficiency, setScoringZoneEfficiency] = useState({ inside: 0, outside: 0 });

  useEffect(() => {
    fetch('/teams')
      .then(response => response.json())
      .then(data => setTeams(data))
      .catch(error => console.error('Error fetching team data:', error));
    
    fetch(`/scoring-zone-efficiency?team=${encodeURIComponent(selectedTeam)}`)
      .then(response => response.json())
      .then(data => {
        setScoringZoneEfficiency({
          inside: data.inside_scoring_zone.success_rate || 0,
          outside: data.outside_scoring_zone.success_rate || 0
        });
      })
      .catch(error => console.error('Error fetching scoring zone efficiency:', error));

    if (selectedTeam && dataType) {
      setHeatMapUrl(`/heatmaps/${selectedTeam}/${dataType}_heat_map.jpg`);
    }
  }, [selectedTeam, dataType]);

  function handleNavigate(page) {
    setCurrentPage(page);
  }

  return (
    <div className="App">
      <header className="App-header">
        GAA Studio - Analytics Dashboard
      </header>
      <Grid container spacing={2}>
        {!isMobile && (
          <Grid item xs={12} sm={3}>
            <Sidebar
              onNavigate={handleNavigate}
              teams={teams}
              selectedTeam={selectedTeam}
              setSelectedTeam={setSelectedTeam}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={9}>
          {currentPage === 'attacking' && (
            <Attacking
              scoringZoneEfficiency={scoringZoneEfficiency}
              heatMapUrl={heatMapUrl}
              selectedTeam={selectedTeam}
              dataType={dataType}
            />
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
