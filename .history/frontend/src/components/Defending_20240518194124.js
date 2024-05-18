import React, { useEffect, useState } from 'react';
import { Image, Spinner } from 'react-bootstrap';
import './Defending.css'; // Make sure the path is correct
import axios from 'axios';

function Defending({ selectedTeam }) {
    const [pressureMapUrl, setPressureMapUrl] = useState('');
    const [PPMapUrl, setPPMapUrl] = useState('');
    const [blockedMapUrl, setBlockedMapUrl] = useState('');
    const [tacklesMapUrl, setTacklesMapUrl] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMapUrl = async (endpoint, setUrl) => {
            try {
                setLoading(true);
                const response = await axios.get(endpoint);
                setUrl(response.data.url);
            } catch (error) {
                console.error('Error fetching map URL:', error);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 1000); // Simulate longer loading time
            }
        };

        if (selectedTeam) {
            fetchMapUrl(`/pressuremaps/${encodeURIComponent(selectedTeam)}`, setPressureMapUrl);
            fetchMapUrl(`/blockedmaps/${encodeURIComponent(selectedTeam)}`, setBlockedMapUrl);
            fetchMapUrl(`/ppmaps/${encodeURIComponent(selectedTeam)}`, setPPMapUrl);
            fetchMapUrl(`/tacklesmaps/${encodeURIComponent(selectedTeam)}`, setTacklesMapUrl);
        }
    }, [selectedTeam]);

    if (loading) {
        return (
            <div className="loading-container">
                <Spinner animation="border" role="status" />
                <span className="loading-text">GAA Studio</span>
            </div>
        );
    }

    return (
        <div className="defensiveContainer">
            <div className="graphContainer">
                {selectedTeam && blockedMapUrl ? (
                    <Image className="graphImage" src={blockedMapUrl} alt={`${selectedTeam} Blocked Map`} fluid />
                ) : (
                    <p className="instructionText">Please select a team to view the blocked map.</p>
                )}
            </div>
            <div className="graphContainer">
                {selectedTeam && PPMapUrl ? (
                    <Image className="graphImage" src={PPMapUrl} alt={`${selectedTeam} PP Map`} fluid />
                ) : (
                    <p className="instructionText">Please select a team to view the PP map.</p>
                )}
            </div>
            <div className="graphContainer">
                {selectedTeam && pressureMapUrl ? (
                    <Image className="graphImage" src={pressureMapUrl} alt={`${selectedTeam} Pressure Map`} fluid />
                ) : (
                    <p className="instructionText">Please select a team to view the pressure map.</p>
                )}
            </div>
            <div className="fullWidthGraphContainer">
                {selectedTeam && tacklesMapUrl ? (
                    <Image className="graphImage" src={tacklesMapUrl} alt={`${selectedTeam} Tackle Map`} fluid />
                ) : (
                    <p className="instructionText">Please select a team to view the tackles map.</p>
                )}
            </div>
        </div>
    );
}

export default Defending;
