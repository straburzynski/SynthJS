import React, { FC, useState } from 'react';
import { WaveformEnum } from '../../models/WaveformEnum';
import { DefaultParams } from '../../consts/DefaultParams';
import { SynthEngineModel } from '../../models/SynthEngineModel';
import SliderComponent from '../shared/SliderComponent/SliderComponent';
import styles from './OscillatorComponent.module.scss';
import WaveformIconComponent from '../shared/WaveformIconComponent/WaveformIconComponent';

type OscillatorComponentProps = {
    synthEngine: React.MutableRefObject<SynthEngineModel>;
    primary: boolean;
    detune: number;
    setDetune: Function;
    waveform: OscillatorType;
    setWaveform: Function;
};
export const OscillatorComponent: FC<OscillatorComponentProps> = ({
    synthEngine,
    primary,
    detune,
    setDetune,
    waveform,
    setWaveform,
}) => {
    const [volume, setVolume] = useState<number>(DefaultParams.gain);

    const handleWaveformChange = (
        setWaveform: Function,
        primary: boolean,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const selectedWaveform = event.target.value as OscillatorType;
        console.log(event.target.name, selectedWaveform);
        const oscillatorNode = primary ? synthEngine.current.primaryVco : synthEngine.current.secondaryVco;
        oscillatorNode.type = selectedWaveform;
        setWaveform(selectedWaveform);
    };

    const handleDetuneChange = (changedDetune: number) => {
        console.log((primary ? 'Primary' : 'Secondary') + ' detune change: ', changedDetune);
        const oscillatorNode = primary ? synthEngine.current.primaryVco : synthEngine.current.secondaryVco;
        oscillatorNode.detune.setValueAtTime(changedDetune, synthEngine.current.audioContext.currentTime); // value in cents
        setDetune(changedDetune);
    };

    const handleVolumeChange = (changedVolume: number) => {
        console.log((primary ? 'Primary' : 'Secondary') + ' volume change: ', changedVolume);
        const volumeNode = primary ? synthEngine.current.primaryVca : synthEngine.current.secondaryVca;
        volumeNode.gain.value = changedVolume;
        setVolume(changedVolume);
    };

    return (
        <div className="component-wrapper">
            <p>{primary ? 'Primary' : 'Secondary'} OSC</p>
            <div className="columns">
                <div className={`${styles.leftColumn} ${styles.verticalContainer} flex-75`}>
                    <div className="flex-100">Waveform</div>
                    <div className={styles.flexContainer}>
                        <div className={styles.iconsContainer}>
                            {Object.values(WaveformEnum).map((w, i) => {
                                return (
                                    <label
                                        htmlFor={w + '-wave-' + (primary ? 'primary' : 'secondary')}
                                        className={styles.iconLabel}
                                        key={i}
                                    >
                                        <input
                                            className={styles.iconInput}
                                            type="radio"
                                            id={w + '-wave-' + (primary ? 'primary' : 'secondary')}
                                            name={(primary ? 'primary' : 'secondary') + '-waveform'}
                                            value={w}
                                            onChange={(e) => handleWaveformChange(setWaveform, primary, e)}
                                            checked={w === waveform}
                                        />
                                        <span>
                                            <WaveformIconComponent waveform={w} />
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex-100">Detune</div>
                    <div className={styles.detuneColumn}>
                        <SliderComponent
                            mode="horizontal"
                            name={primary ? 'primary-detune' : 'secondary-detune'}
                            minValue={DefaultParams.detuneMin}
                            maxValue={DefaultParams.detuneMax}
                            value={detune}
                            onChange={handleDetuneChange}
                            defaultValue={DefaultParams.detune}
                            step={0.05}
                        />
                    </div>
                </div>
                <div className={`${styles.columnVolume} flex-25 vertical-fader-scale`}>
                    <SliderComponent
                        mode="vertical"
                        name={primary ? 'primary-vca' : 'secondary-vca'}
                        minValue={DefaultParams.gainMin}
                        maxValue={DefaultParams.gainMax}
                        value={volume}
                        onChange={handleVolumeChange}
                        defaultValue={DefaultParams.gain}
                        step={0.05}
                    />
                </div>
            </div>
        </div>
    );
};
