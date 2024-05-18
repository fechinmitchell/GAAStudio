import React, { useEffect, useState } from 'react';
import { Image } from 'react-bootstrap';
import './Defending.css'; // Make sure the path is correct
import { getStorage, ref, getDownloadURL } from "firebase/storage";

function Defending({ selectedTeam }) {
    const [pressureMapUrl, setPressureMapUrl] = useState('');
    const [PPMapUrl, setPPMapUrl] = useState('');
    const [blockedMapUrl, setBlockedMapUrl] = useState('');
    const [tacklesMapUrl, setTacklesMapUrl] = useState('');

    useEffect(() => {
        const storage = getStorage();
        if (selectedTeam) {
            const fetchMapUrl = async (path, setUrl) => {
                try {
                    const url = await getDownloadURL(ref(storage, path));
                    setUrl(url);
                } catch (error) {
                    console.error('Error fetching map URL:', error);
                }
            };

            fetchMapUrl(`gs://gaastudio-2a7ac.appspot.com/pressuremaps/${selectedTeam}.png`, setPressureMapUrl);
            fetchMapUrl(`gs://gaastudio-2a7ac.appspot.com/blockedmaps/${selectedTeam}.png`, setBlockedMapUrl);
            fetchMapUrl(`gs://gaastudio-2a7ac.appspot.com/ppmaps/${selectedTeam}.png`, setPPMapUrl);
            fetchMapUrl(`gs://gaastudio-2a7ac.appspot.com/tacklesmaps/${selectedTeam}.png`, setTacklesMapUrl);
        }
    }, [selectedTeam]);

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

