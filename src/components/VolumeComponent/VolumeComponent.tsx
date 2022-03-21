import React, { useState } from 'react';
import RangeInput from '../shared/RangeInput/RangeInput';

const VolumeComponent = ({ name, volumeNode }: any) => {
    const [masterVolume, setMasterVolume] = useState<number>(0.5);

    const handleVolumeChange = (event: any) => {
        const volumeLevel: number = event.target.valueAsNumber;
        console.log('volume change: ', name, volumeLevel);
        volumeNode.gain.value = volumeLevel;
        setMasterVolume(volumeLevel);
    };

    return (
        <div>
            <p>
                {name}: {masterVolume}
            </p>
            <RangeInput min={0} max={1} step={0.05} value={masterVolume} onChange={handleVolumeChange} />
            <br />
        </div>
    );
};

export default VolumeComponent;
