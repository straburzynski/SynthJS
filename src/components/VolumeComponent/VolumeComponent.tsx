import React, { useState } from 'react';
import RangeInput from '../shared/RangeInput/RangeInput';
import { DefaultParams } from '../../consts/DefaultParams';

const VolumeComponent = ({
    name,
    volumeNode,
    min = DefaultParams.gainMin,
    max = DefaultParams.gainMax,
    step = 0.05
}: any) => {
    const [volume, setVolume] = useState<number>(DefaultParams.gain);

    const handleVolumeChange = (event: any) => {
        const volumeLevel: number = event.target.valueAsNumber;
        console.log('volume change: ', name, volumeLevel);
        volumeNode.gain.value = volumeLevel;
        setVolume(volumeLevel);
    };

    return (
        <div>
            <p>
                {name}: {volume}
            </p>
            <RangeInput min={min} max={max} step={step} value={volume} onChange={handleVolumeChange} />
            <br />
        </div>
    );
};

export default VolumeComponent;
