import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from './firebase'; // Ensure these are correctly imported
import { doc, getDoc } from 'firebase/firestore';
import './Sidebar.css';

function Sidebar({ onNavigate, teams, selectedTeam, setSelectedTeam, sidebarOpen }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [selectedYear, setSelectedYear] = useState('2023'); // New state for selected year
  const years = ['2023', '2024 - Coming Soon']; // List of years

  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(firestore, "users", user.uid); // Corrected from db to firestore
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserName(userSnap.data().fullName); // Assuming fullName is the field name in Firestore
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchUserName();
  }, []); // Dependency array left empty to run only once after initial render

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <div className={`sidebar ${sidebarOpen ? '' : 'closed'}`}>
      <div className="sidebar-header">
        {sidebarOpen && (
          <>
            <div className="sidebar-header">
              {/* Placeholder for team logo or user avatar */}
              <h3>{userName || "User's Name"}</h3> {/* Display the fetched user's name or a placeholder */}
            </div>
          </>
        )}
      </div>
      <div className="year-selector">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="year-dropdown"
        >
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
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
      <button onClick={() => onNavigate('attacking')}>Attacking</button>
      <button onClick={() => onNavigate('defending')}>Defending</button>
      <button onClick={() => onNavigate('players')}>Players</button>
      <button onClick={() => onNavigate('fixtures')}>Fixtures</button>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}

export default Sidebar;

