import React, { useEffect, useState } from 'react';
import { Image } from 'react-bootstrap';

function Defending({ selectedTeam }) {
    const [pressureMapUrl, setPressureMapUrl] = useState('');

    useEffect(() => {
        if (selectedTeam) {
            const url = `/pressuremaps/${encodeURIComponent(selectedTeam)}`;
            console.log("Fetching pressure map from:", url); // This will show the exact URL being requested
            setPressureMapUrl(url);
        } else {
            setPressureMapUrl('');
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

