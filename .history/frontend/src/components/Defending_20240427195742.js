import React, { useEffect, useState } from 'react';
import { Image } from 'react-bootstrap';

function Defensive({ selectedTeam }) {
    const [pressureMapUrl, setPressureMapUrl] = useState('');

    useEffect(() => {
        if (selectedTeam) {
            // Update the URL to the pressure map for the selected team
            const url = `/heatmaps/${selectedTeam}/pressure`;
            setPressureMapUrl(url);
        }
    }, [selectedTeam]);

    return (
        <div className="defensive-container" style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {selectedTeam ? (
                <Image src={pressureMapUrl} alt={`${selectedTeam} Pressure Map`} fluid />
            ) : (
                <p>Please select a team to view the pressure map.</p>
            )}
        </div>
    );
}

export default Defensive;
