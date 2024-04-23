import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTheme, useMediaQuery, Grid } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Sidebar from './components/Sidebar';
import Attacking from './components/Attacking';
import Players from './components/Players';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { auth } from './components/firebase';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('Galway');
  const [currentPage, setCurrentPage] = useState('attacking');
  const [dataType, setDataType] = useState('shots');
  const [heatMapUrl, setHeatMapUrl] = useState('');
  const [scoringZoneEfficiency, setScoringZoneEfficiency] = useState({ inside: 0, outside: 0 });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetch('/teams')
        .then(response => response.json())
        .then(data => setTeams(data))
        .catch(error => console.error('Error fetching team data:', error));
      
      fetch(`/scoring-zone-efficiency?team=${encodeURIComponent(selectedTeam)}`)
        .then(response => response.json())
        .then(data => setScoringZoneEfficiency({
          inside: data.inside_scoring_zone.success_rate || 0,
          outside: data.outside_scoring_zone.success_rate || 0
        }))
        .catch(error => console.error('Error fetching scoring zone efficiency:', error));

      if (selectedTeam && dataType) {
        const url = `/heatmaps/${selectedTeam}/${dataType}`;
        setHeatMapUrl(url);
      }
    }
  }, [selectedTeam, dataType, user]);

  function handleNavigate(page) {
    setCurrentPage(page);
  }

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/players" element={<Players />} />
          <Route path="*" element={<Navigate replace to="/signin" />} />
        </Routes>
      </BrowserRouter>
    );
  }
  
  return (
    <BrowserRouter>
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
            {currentPage === 'players' && (
              <Players
                scoringZoneEfficiency={scoringZoneEfficiency}
                heatMapUrl={heatMapUrl}
                setDataType={setDataType}
              />
            )}
          </Grid>
        </Grid>
      </div>
    </BrowserRouter>
  );
            }  

export default App;
