import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Image } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Attacking({ scoringZoneEfficiency, heatMapUrl }) {
  const chartData = {
    labels: ['Inside Scoring Zone', 'Outside Scoring Zone'],
    datasets: [
      {
        label: 'Success Rate',
        data: [scoringZoneEfficiency.inside * 100, scoringZoneEfficiency.outside * 100],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          },
        },
      },
    },
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

export default Attacking;





