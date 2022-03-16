import React, { useState } from 'react';
import RangeInput from '../shared/RangeInput/RangeInput';
import { DefaultParams } from '../../consts/DefaultParams';

const FrequencyComponent = ({ name, nodeRef }: any) => {
    const [frequency, setFrequency] = useState<number>(100);

    const handleFrequencyChange = (event: any) => {
        const changedFrequency: number = event.target.value;
        console.log('frequency change: ', name, changedFrequency);
        setFrequency(changedFrequency);
        nodeRef.current.frequency.value = changedFrequency;
    };

    return (
        <div>
            <RangeInput
                min={DefaultParams.filterMin}
                max={DefaultParams.filterMax}
                step={10}
                value={frequency}
                onChange={handleFrequencyChange}
            />
            {name}: {frequency}
            <br />
        </div>
    );
};

export default FrequencyComponent;
