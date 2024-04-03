import React, { useState, useEffect } from 'react';
import { Grid, useTheme, useMediaQuery } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Sidebar from './Sidebar';
import Attacking from './components/Attacking';

function App() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [currentPage, setCurrentPage] = useState('attacking');
  const [scoringZoneEfficiency, setScoringZoneEfficiency] = useState({ inside: 0, outside: 0 });
  const heatMapUrl = '/path/to/your/heatmap/image.jpg'; // Assuming a static image for demonstration

  useEffect(() => {
    // Example fetch call for teams
    fetch('/api/teams')
      .then(response => response.json())
      .then(data => setTeams(data))
      .catch(error => console.log('Error fetching teams:', error));

    // Fetching scoring zone efficiency could be similar
    // This is an example; your API/endpoints might differ
    if (selectedTeam) {
      fetch(`/api/scoring-zone-efficiency?team=${encodeURIComponent(selectedTeam)}`)
        .then(response => response.json())
        .then(data => setScoringZoneEfficiency(data))
        .catch(error => console.log('Error:', error));
    }
  }, [selectedTeam]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
            />
          )}
          {/* Add conditional rendering for "defending" or other pages as needed */}
        </Grid>
      </Grid>
    </div>
  );
}

export default App;

