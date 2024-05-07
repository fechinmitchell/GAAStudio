import React, { useEffect, useState } from 'react';
import { Image } from 'react-bootstrap';

function Defending({ selectedTeam }) {
    const [pressureMapUrl, setPressureMapUrl] = useState('');

    useEffect(() => {
        // Update the URL to the pressure map for the selected team whenever the selected team changes
        if (selectedTeam) {
            const url = `/pressuremaps/${encodeURIComponent(selectedTeam)}`;
            setPressureMapUrl(url);
        } else {
            setPressureMapUrl(''); // Reset the URL if no team is selected
        }
    }, [selectedTeam]);

    return (
        <div className="defensive-container" style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {selectedTeam && pressureMapUrl ? (
                <Image src={pressureMapUrl} alt={`${selectedTeam} Pressure Map`} fluid />
            ) : (
                <p>Please select a team to view the pressure map.</p>
            )}
        </div>
    );
}

export default Defending;

