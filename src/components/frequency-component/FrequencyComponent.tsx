import React from 'react';
import RangeInput from '../shared/range-input/RangeInput';

const FrequencyComponent = ({ name, frequency, onFrequencyChange }: any) => {
    const handleFrequencyChange = (event: any) => {
        const changedFrequency: number = event.target.valueAsNumber;
        console.log('frequency change: ', name, changedFrequency);
        onFrequencyChange(changedFrequency);
    };

    return (
        <div>
            <p>
                {name}: {frequency}
            </p>
            <RangeInput min={220} max={1200} step={10} value={frequency} onChange={handleFrequencyChange} />
            <br />
        </div>
    );
};

export default FrequencyComponent;
