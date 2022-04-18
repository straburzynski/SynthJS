import React, { FC, useState } from 'react';
import { DefaultParams } from '../../consts/DefaultParams';
import VerticalSliderComponent from '../shared/VerticalSliderComponent/VerticalSliderComponent';
import styles from './MasterVolumeComponent.module.scss';

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
            <p>VCA</p>
            <div className="columns">
                <div className={'column-1 vertical-fader-scale ' + styles.faders}>
                    <VerticalSliderComponent
                        name={'master-vca'}
                        minValue={DefaultParams.masterVcaGainMin}
                        maxValue={DefaultParams.masterVcaGainMax}
                        value={volume}
                        onChange={(changedValue: number) => handleVolumeChange('master-vca', changedValue, setVolume)}
                        defaultValue={DefaultParams.masterVcaGain}
                        step={0.05}
                    />
                </div>
            </div>
            <div className="columns">
                <div className={styles.textCenter + ' column-1'}>
                    <label htmlFor="master-vca-control">
                        Master volume:
                        <br /> {volume}
                    </label>
                </div>
            </div>
        </div>
    );
};

export default MasterVolumeComponent;
