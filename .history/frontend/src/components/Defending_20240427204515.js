import React, { useEffect, useState } from 'react';
import { Image } from 'react-bootstrap';

function Defending({ selectedTeam }) {
    const [pressureMapUrl, setPressureMapUrl] = useState('');

    useEffect(() => {
        if (selectedTeam) {
            const url = `/pressuremaps/${encodeURIComponent(selectedTeam)}`;
            setPressureMapUrl(url);
        }
    }, [selectedTeam]);

    return (
        <div className="defensive-container" style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
            <div className="graph-container" style={{ width: '45%' }}>
                {/* Placeholder or another component for the left graph */}
            </div>
            <div className="graph-container" style={{ width: '45%' }}>
                {selectedTeam && pressureMapUrl ? (
                    <Image src={pressureMapUrl} alt={`${selectedTeam} Pressure Map`} fluid style={{ maxWidth: '100%', height: 'auto' }} />
                ) : (
                    <p>Please select a team to view the pressure map.</p>
                )}
            </div>
        </div>
    );
}

export default Defending;



