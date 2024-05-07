import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import './Sidebar.css';

function Sidebar({ onNavigate, teams, selectedTeam, setSelectedTeam }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserName(userSnap.data().fullName);
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchUserName();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  const handleNavigate = (route) => {
    // If the route is "attacking", set the selected team to an empty string
    if (route === 'attacking') {
      setSelectedTeam('');
    }
    onNavigate(route);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        {/* Placeholder for team logo or user avatar */}
        <h3>{userName || "User's Name"}</h3> {/* Display the fetched user's name or a placeholder */}
      </div>
      <div className="team-selector">
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="team-dropdown"
        >
          <option value="">Select a team</option>
          {teams.map((team) => (
            <option key={team} value={team}>{team}</option>
          ))}
        </select>
      </div>
      <button onClick={() => handleNavigate('attacking')}>Attacking</button>
      <button onClick={() => handleNavigate('defending')}>Defending</button>
      <button onClick={() => handleNavigate('players')}>Players</button>
      <button onClick={() => handleNavigate('fixtures')}>Fixtures</button>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}

export default Sidebar;
