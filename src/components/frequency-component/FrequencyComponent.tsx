import React, { useState } from 'react';
import RangeInput from '../shared/range-input/RangeInput';

const FrequencyComponent = ({ name, nodeRef }: any) => {
    const [frequency, setFrequency] = useState<number>(440);

    const handleFrequencyChange = (event: any) => {
        const changedFrequency: number = event.target.value;
        console.log('frequency change: ', name, changedFrequency);
        setFrequency(changedFrequency);
        nodeRef.current.frequency.value = changedFrequency;
    };

    return (
        <div>
            <p>{name}</p>
            <RangeInput min={220} max={1200} step={10} value={frequency} onChange={handleFrequencyChange} />
            <br />
        </div>
    );
};

export default FrequencyComponent;
