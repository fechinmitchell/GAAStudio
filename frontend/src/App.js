import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Sidebar from './components/Sidebar';
import Attacking from './components/Attacking';
import Players from './components/Players';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Defending from './components/Defending';
import { auth } from './components/firebase';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      axios.get(`${API_BASE_URL}/teams`)
        .then(response => setTeams(response.data))
        .catch(error => {
          console.error('Error fetching team data:', error);
          setError(error.toString());
        });

      axios.get(`${API_BASE_URL}/scoring-zone-efficiency?team=${encodeURIComponent(selectedTeam)}`)
        .then(response => setScoringZoneEfficiency({
          inside: response.data.inside_scoring_zone.success_rate || 0,
          outside: response.data.outside_scoring_zone.success_rate || 0
        }))
        .catch(error => {
          console.error('Error fetching scoring zone efficiency:', error);
          setError(error.toString());
        });


        if (selectedTeam && dataType) {
          axios.get(`${API_BASE_URL}/heatmaps/${encodeURIComponent(selectedTeam)}/${encodeURIComponent(dataType)}`)
            .then(response => setHeatMapUrl(response.data.url))
            .catch(error => {
              console.error('Error fetching heatmap URL:', error);
              setError(error.toString());
            });
        }
      }
    }, [selectedTeam, dataType, user]);
  
    function handleNavigate(page) {
      setCurrentPage(page);
    }
  
    if (error) {
      return <div>An error occurred: {error}</div>;
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
        <div className="main-container">
          {!isMobile && (
            <div className="App-sidebar">
              <Sidebar
                onNavigate={handleNavigate}
                teams={teams}
                selectedTeam={selectedTeam}
                setSelectedTeam={setSelectedTeam}
              />
            </div>
          )}
          <div className="content-area">
            {currentPage === 'attacking' && (
              <Attacking
                selectedTeam={selectedTeam}
                setSelectedTeam={setSelectedTeam}
                scoringZoneEfficiency={scoringZoneEfficiency}
                heatMapUrl={heatMapUrl}
                setDataType={setDataType}
              />
            )}
            {currentPage === 'players' && (
              <Players />
            )}
            {currentPage === 'defending' && (
              <Defending selectedTeam={selectedTeam} />
            )}
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
