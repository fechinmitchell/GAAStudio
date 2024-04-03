import React, { useState, useEffect } from 'react';
import { Grid, useTheme, useMediaQuery } from '@mui/material';
import './App.css';
import Sidebar from './components/Sidebar'; // Ensure the path is correct based on your project structure
import Attacking from './components/Attacking'; // Ensure the path is correct based on your project structure
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
    fetch('/teams')
      .then(response => response.json())
      .then(data => setTeams(data))
      .catch(error => console.error('Error fetching team data:', error));

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

    if (selectedTeam && dataType) {
      const formattedDataType = dataType.charAt(0).toUpperCase() + dataType.slice(1); // Capitalize the first letter of dataType
      // Update the URL path to match your actual server setup
      const newHeatMapUrl = `/heatmaps/${formattedDataType}/${selectedTeam}_${dataType}_heat_map.jpg`;
      setHeatMapUrl(newHeatMapUrl);
    }
  }, [selectedTeam, dataType]);

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

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
              setDataType={setDataType}
            />
          )}
          {/* Here you can add additional pages/components like "Defending" as needed */}
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
