import React, { FC, useState } from 'react';
import { DefaultParams } from '../../consts/DefaultParams';
import SliderComponent from '../shared/SliderComponent/SliderComponent';

type MasterVolumeComponentProps = {
    masterVcaNode: GainNode;
};

const MasterVolumeComponent: FC<MasterVolumeComponentProps> = ({ masterVcaNode }) => {
    const [volume, setVolume] = useState<number>(DefaultParams.masterVcaGain);

    const handleVolumeChange = (name: string, changedValue: number, setterFunction: Function) => {
        console.log(name, changedValue);
        masterVcaNode.gain.value = changedValue;
        setterFunction(changedValue);
    };

    return (
        <div className="component-wrapper">
            <p className="title">VCA</p>
            <div className="columns top-labels text-center">
                <div className="column-1">
                    <label htmlFor="master-vca">Vol</label>
                </div>
            </div>
            <div className="columns">
                <div className="column-1">
                    <SliderComponent
                        name="master-vca"
                        minValue={DefaultParams.masterVcaGainMin}
                        maxValue={DefaultParams.masterVcaGainMax}
                        value={volume}
                        onChange={(changedValue: number) => handleVolumeChange('master-vca', changedValue, setVolume)}
                        defaultValue={DefaultParams.masterVcaGain}
                        step={0.05}
                    />
                </div>
            </div>
            <div className="columns bottom-labels text-center">
                <div className="column-1">
                    <label htmlFor="master-vca">{volume}</label>
                </div>
            </div>
        </div>
    );
};

export default MasterVolumeComponent;
