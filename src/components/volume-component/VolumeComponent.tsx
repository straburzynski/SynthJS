import React from 'react';
import RangeInput from '../shared/range-input/RangeInput';

const VolumeComponent = ({ name, volume, onVolumeChange }: any) => {
    const handleVolumeChange = (event: any) => {
        const volumeLevel: number = event.target.valueAsNumber;
        console.log('volume change: ', name, volumeLevel);
        onVolumeChange(volumeLevel);
    };

    return (
        <div>
            <p>
                {name}: {volume}
            </p>
            <RangeInput min={0} max={1} step={0.05} value={volume} onChange={handleVolumeChange} />
            <br />
        </div>
    );
};

export default VolumeComponent;
