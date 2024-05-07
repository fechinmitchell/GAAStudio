import React, { useEffect, useState } from 'react';
import { Image } from 'react-bootstrap';
import './Defending.css'; // Import the CSS module

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
        <div className={defensiveContainer}>
            <div className={graphContainer}>
                {selectedTeam && blockedMapUrl ? (
                    <Image className={graphImage} src={blockedMapUrl} alt={`${selectedTeam} Blocked Map`} fluid />
                ) : (
                    <p className={instructionText}>Please select a team to view the blocked map.</p>
                )}
            </div>
            <div className={graphContainer}>
                {selectedTeam && PPMapUrl ? (
                    <Image className={graphImage} src={PPMapUrl} alt={`${selectedTeam} PP Map`} fluid />
                ) : (
                    <p className={instructionText}>Please select a team to view the PP map.</p>
                )}
            </div>
            <div className={graphContainer}>
                {selectedTeam && pressureMapUrl ? (
                    <Image className={graphImage} src={pressureMapUrl} alt={`${selectedTeam} Pressure Map`} fluid />
                ) : (
                    <p className={instructionText}>Please select a team to view the pressure map.</p>
                )}
            </div>
            <div className={graphContainer}>
                {selectedTeam && tacklesMapUrl ? (
                    <Image className={graphImage} src={tacklesMapUrl} alt={`${selectedTeam} Tackle Map`} fluid />
                ) : (
                    <p className={instructionText}>Please select a team to view the tackles map.</p>
                )}
            </div>
        </div>
    );
}

export default Defending;
