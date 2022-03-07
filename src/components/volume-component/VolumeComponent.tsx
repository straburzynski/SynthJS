import React, { useState } from 'react';
import '../../App.css';

const VolumeComponent = ({ name, gainNode }: any) => {

    const [masterVolumeLevel, setMasterVolumeLevel] = useState<number>(0.2);

    const handleVolumeChange = (event: any) => {
        const volumeLevel: number = event.target.value;
        console.log('volume change: ', name, volumeLevel);
        setMasterVolumeLevel(volumeLevel);
        gainNode.current.gain.value = volumeLevel;
    };

    return (
        <div>
            <p>Volume for OSC: {name}</p>
            <input type='range' id='volume-control' min={0} max={1} step={0.05}
                   value={masterVolumeLevel} onChange={handleVolumeChange} /><br />
        </div>
    );
};

export default VolumeComponent;
