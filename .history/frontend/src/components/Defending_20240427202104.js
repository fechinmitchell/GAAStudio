import React, { useEffect, useState } from 'react';
import { Image } from 'react-bootstrap';

function Defending({ selectedTeam }) {
    const [pressureMapUrl, setPressureMapUrl] = useState('');

    useEffect(() => {
        if (selectedTeam) {
            const url = `/pressuremaps/${encodeURIComponent(selectedTeam)}`;
            console.log("Fetching URL:", url);  // This will show you what URL is being accessed
            setPressureMapUrl(url);
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

