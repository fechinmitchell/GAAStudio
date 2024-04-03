import React, { useState, useEffect } from 'react';
import { Grid, useTheme, useMediaQuery } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Sidebar from './Sidebar';
import Attacking from './components/Attacking'; // Ensure the path matches your project structure

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('Galway');
  const [dataType, setDataType] = useState('shots');
  const [heatMapUrl, setHeatMapUrl] = useState('');
  const [currentPage, setCurrentPage] = useState('attacking');

  useEffect(() => {
    fetch('/teams')
      .then(response => response.json())
      .then(data => setTeams(data))
      .catch(error => console.error('Error fetching team data:', error));
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      const url = `/heatmaps/${selectedTeam}/${dataType}`;
      setHeatMapUrl(url);
    }
  }, [selectedTeam, dataType]);

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="App">
      <header className="App-header">GAA Studio - Analytics Dashboard</header>
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
            dataType={dataType}
          />
          )}
          {/* Placeholder for other pages like "Defending" */}
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
