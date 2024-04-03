import React, { useState, useEffect } from 'react';
import { Grid, useTheme, useMediaQuery } from '@mui/material';
import './App.css';
import Sidebar from './components/Sidebar'; // Adjust path if necessary
import Attacking from './components/Attacking'; // Adjust path if necessary
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('Galway');
  const [currentPage, setCurrentPage] = useState('attacking');
  const [dataType, setDataType] = useState('shots');
  const [heatMapUrl, setHeatMapUrl] = useState('');
  const [scoringZoneEfficiency, setScoringZoneEfficiency] = useState({ inside: 0, outside: 0 });

  useEffect(() => {
    // Constructing the URL based on selectedTeam and dataType to match the server's expected endpoint.
    // This example assumes your server exposes the images at a URL pattern like /heatmaps/Shots/Galway_shots.jpg
    // Adjust the path as necessary to match your backend server's routing logic.
    if (selectedTeam && dataType) {
      const url = `/api/heatmaps/${selectedTeam}/${dataType}`;
      setHeatMapUrl(url);
    }
  }, [selectedTeam, dataType]);

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

    // Ensure this URL pattern matches how your server expects to receive requests for heatmaps.
    if (selectedTeam && dataType) {
      const formattedDataType = dataType.charAt(0).toUpperCase() + dataType.slice(1); // Capitalize first letter
      setHeatMapUrl(`/Users/fechinmitchell/Projects/GAAStudio/datasets/${formattedDataType}/${selectedTeam}_${dataType}_heat_map.jpg`);
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
            setDataType={setDataType} // Pass setDataType as a prop
          />
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default App;