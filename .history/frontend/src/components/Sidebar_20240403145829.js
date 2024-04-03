// Sidebar.js
import React from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory from react-router-dom
import { auth } from './firebase';
import './Sidebar.css'; // Make sure to import Sidebar.css if needed
import { useNavigate } from 'react-router-dom';


  const handleLogout = async () => {
    try {
      await auth.signOut();
      history.push('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="team-logo-url" alt="Team Logo" className="team-logo" />
        <h3>User's Name</h3>
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
      <button onClick={() => onNavigate('team')}>Team</button>
      <button onClick={() => onNavigate('fixtures')}>Fixtures</button>
      <button onClick={handleLogout}>Log Out</button> {/* Added onClick handler for logout */}
    </div>
  );
}

export default Sidebar;
