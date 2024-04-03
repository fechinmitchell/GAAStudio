import React from 'react';
import { Button } from '@mui/material';
import './Sidebar.css'; // Assume you create a corresponding CSS file for styling

function Sidebar({ onNavigate }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="team-logo-url-here" alt="Team Logo" className="team-logo" />
        <h3>User's Name</h3>
      </div>
      <Button variant="contained" onClick={() => onNavigate('attacking')}>Attacking</Button>
      <Button variant="contained" onClick={() => onNavigate('defending')}>Defending</Button>
      <Button variant="contained" onClick={() => onNavigate('team')}>Team</Button>
      <Button variant="contained" onClick={() => onNavigate('fixtures')}>Fixtures</Button>
      <Button variant="contained" onClick={() => onNavigate('logout')}>Log Out</Button>
    </div>
  );
}

export default Sidebar;
