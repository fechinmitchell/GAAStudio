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
        <div className={styles.defensiveContainer}>
            <div className={styles.graphContainer}>
                {selectedTeam && blockedMapUrl ? (
                    <Image className={styles.graphImage} src={blockedMapUrl} alt={`${selectedTeam} Blocked Map`} fluid />
                ) : (
                    <p className={styles.instructionText}>Please select a team to view the blocked map.</p>
                )}
            </div>
            <div className={styles.graphContainer}>
                {selectedTeam && PPMapUrl ? (
                    <Image className={styles.graphImage} src={PPMapUrl} alt={`${selectedTeam} PP Map`} fluid />
                ) : (
                    <p className={styles.instructionText}>Please select a team to view the PP map.</p>
                )}
            </div>
            <div className={styles.graphContainer}>
                {selectedTeam && pressureMapUrl ? (
                    <Image className={styles.graphImage} src={pressureMapUrl} alt={`${selectedTeam} Pressure Map`} fluid />
                ) : (
                    <p className={styles.instructionText}>Please select a team to view the pressure map.</p>
                )}
            </div>
            <div className={styles.graphContainer}>
                {selectedTeam && tacklesMapUrl ? (
                    <Image className={styles.graphImage} src={tacklesMapUrl} alt={`${selectedTeam} Tackle Map`} fluid />
                ) : (
                    <p className={styles.instructionText}>Please select a team to view the tackles map.</p>
                )}
            </div>
        </div>
    );
}

export default Defending;
