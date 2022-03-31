import React, { FC, useState } from 'react';
import RangeInput from '../shared/RangeInput/RangeInput';
import { DefaultParams } from '../../consts/DefaultParams';

type FrequencyComponentProps = {
    name: string;
    node: BiquadFilterNode;
};

const FrequencyComponent: FC<FrequencyComponentProps> = ({ name, node }) => {
    const [frequency, setFrequency] = useState<number>(DefaultParams.filter);

    const handleFrequencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const changedFrequency: number = event.target.valueAsNumber;
        console.log('frequency change: ', name, changedFrequency);
        setFrequency(changedFrequency);
        node.frequency.value = changedFrequency;
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
