import React, { FC, useState } from 'react';
import { DefaultParams } from '../../consts/DefaultParams';
import styles from './MasterVolumeComponent.module.scss';

type MasterVolumeComponentProps = {
    masterVcaNode: GainNode;
};

const MasterVolumeComponent: FC<MasterVolumeComponentProps> = ({ masterVcaNode }) => {
    const [volume, setVolume] = useState<number>(DefaultParams.masterVcaGain);

    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const volumeLevel: number = event.target.valueAsNumber;
        console.log('master volume change: ', volumeLevel);
        masterVcaNode.gain.value = volumeLevel;
        setVolume(volumeLevel);
    };

    const handleDoubleClick = (event: React.MouseEvent<HTMLInputElement>, setterFunction: Function, value: number) => {
        console.log('double click -> reset to default value: ', event.currentTarget.id);
        if (event.detail === 2) {
            setterFunction(value);
        }
    };

    return (
        <div className="component-wrapper">
            <p>VCA</p>
            <div className="columns">
                <div className={'column-1 vertical-fader-scale ' + styles.faders}>
                    <input
                        type="range"
                        id="master-vca-control"
                        name="master-vca-control"
                        className="vertical-slider"
                        min={DefaultParams.masterVcaGainMin}
                        max={DefaultParams.masterVcaGainMax}
                        step={0.05}
                        value={volume}
                        onChange={handleVolumeChange}
                        onClick={(e) => handleDoubleClick(e, setVolume, DefaultParams.masterVcaGain)}
                    />
                </div>
            </div>
            <div className="columns">
                <div className="column-1">
                    <label htmlFor="master-vca-control">Master vol: {volume}</label>
                </div>
            </div>
        </div>
    );
};

export default MasterVolumeComponent;
