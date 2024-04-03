import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/data')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        Football Data
      </header>
      <div>
        {data.map((item, index) => (
          <div key={index}>
            {/* Render your data here */}
            <p>{item.TeamName}: {item.Score}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
