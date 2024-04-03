import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Sidebar from './components/Sidebar';
import Attacking from './components/Attacking';
import SignIn from './components/SignIn'; // Your sign-in component
import SignUp from './components/SignUp'; // Corrected import
import { auth } from './components/firebase'; // Update the path as necessary

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [user, setUser] = useState(null); // State to keep track of user auth status
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('Galway');
  const [currentPage, setCurrentPage] = useState('attacking');
  const [dataType, setDataType] = useState('shots');
  const [heatMapUrl, setHeatMapUrl] = useState('');
  const [scoringZoneEfficiency, setScoringZoneEfficiency] = useState({ inside: 0, outside: 0 });

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Only fetch data if the user is authenticated
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

  // Conditionally render content based on user authentication
  if (!user) {
    return <div>Please sign in to view the content.</div>;
  }

  rreturn (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          GAA Studio - Analytics Dashboard
        </header>
        {user ? (
          // Authenticated user layout
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
        ) : (
          // Unauthenticated user layout
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<Navigate replace to="/signin" />} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;