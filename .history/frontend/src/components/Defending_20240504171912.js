import React, { useEffect, useState } from 'react';
import { Image } from 'react-bootstrap';
import styles from './Defending.css'; // Import the CSS module

function Defending({ selectedTeam }) {
    const [pressureMapUrl, setPressureMapUrl] = useState('');
    const [PPMapUrl, setPPMapUrl] = useState('');
    const [blockedMapUrl, setBlockedMapUrl] = useState('');
    const [tacklesMapUrl, setTacklesMapUrl] = useState('');

    useEffect(() => {
        if (selectedTeam) {
            setPressureMapUrl(`/pressuremaps/${encodeURIComponent(selectedTeam)}`);
            setBlockedMapUrl(`/blockedmaps/${encodeURIComponent(selectedTeam)}`);
            setPPMapUrl(`/ppmaps/${encodeURIComponent(selectedTeam)}`);
            setTacklesMapUrl(`/tacklesmaps/${encodeURIComponent(selectedTeam)}`);
        }
    }, [selectedTeam]);

    return (
        <div className="defensive-container" style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
            <div className="graph-container" style={{ width: '32.5%' }}>
                {selectedTeam && blockedMapUrl ? (
                    <Image src={blockedMapUrl} alt={`${selectedTeam} Blocked Map`} fluid style={{ maxWidth: '100%', height: 'auto' }} />
                ) : (
                    <p>Please select a team to view the blocked map.</p>
                )}
            </div>
            <div className="graph-container" style={{ width: '32.5%' }}>
                {selectedTeam && PPMapUrl ? (
                    <Image src={PPMapUrl} alt={`${selectedTeam} SDPM Chart`} fluid style={{ maxWidth: '100%', height: 'auto' }} />
                ) : (
                    <p>Please select a team to view the PP map.</p>
                )}
            </div>
            <div className="graph-container" style={{ width: '30%' }}>
                {selectedTeam && pressureMapUrl ? (
                    <Image src={pressureMapUrl} alt={`${selectedTeam} Pressure Map`} fluid style={{ maxWidth: '100%', height: 'auto' }} />
                ) : (
                    <p>Please select a team to view the pressure map.</p>
                )}
            </div>
            <div className="graph-container" style={{ width: '30%' }}>
                {selectedTeam && tacklesMapUrl ? (
                    <Image src={tacklesMapUrl} alt={`${selectedTeam} Tackle Map`} fluid style={{ maxWidth: '100%', height: 'auto' }} />
                ) : (
                    <p>Please select a team to view the tackles map.</p>
                )}
            </div>
        </div>
    );
}

export default Defending;


