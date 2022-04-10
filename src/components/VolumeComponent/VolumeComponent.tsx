import React, { FC, useState } from 'react';
import RangeInput from '../shared/RangeInput/RangeInput';
import { DefaultParams } from '../../consts/DefaultParams';

type VolumeComponentProps = {
    name: string;
    volumeNode: GainNode;
    min?: number;
    max?: number;
    step?: number;
    initialState?: number;
};
const VolumeComponent: FC<VolumeComponentProps> = ({
    name,
    volumeNode,
    min = DefaultParams.gainMin,
    max = DefaultParams.gainMax,
    step = 0.05,
    initialState = DefaultParams.gain
}) => {
    const [volume, setVolume] = useState<number>(initialState);

    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const volumeLevel: number = event.target.valueAsNumber;
        console.log('volume change: ', name, volumeLevel);
        volumeNode.gain.value = volumeLevel;
        setVolume(volumeLevel);
    };

    return (
        <div>
            <RangeInput min={min} max={max} step={step} value={volume} onChange={handleVolumeChange} />  {name}: {volume}
            <br />
        </div>
    );
};

export default VolumeComponent;
