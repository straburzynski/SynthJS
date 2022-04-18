import React, { FC, useState } from 'react';
import { WaveformEnum } from '../../models/WaveformEnum';
import { DefaultParams } from '../../consts/DefaultParams';
import { SynthEngineModel } from '../../models/SynthEngineModel';
import './OscillatorComponent.scss';
import VerticalSliderComponent from '../shared/VerticalSliderComponent/VerticalSliderComponent';

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
        oscillatorNode: OscillatorNode,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const selectedWaveform = event.target.value as OscillatorType;
        console.log(event.target.name, selectedWaveform);
        oscillatorNode.type = selectedWaveform;
        setWaveform(selectedWaveform);
    };

    const handleDetuneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const changedDetune: number = event.target.valueAsNumber;
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
        <div className="component-wrapper oscillator">
            <p>{primary ? 'Primary' : 'Secondary'} OSC</p>
            <div className="columns">
                <div className={`columnDetune flex-75 vertical-container`}>
                    <div className={'flex-100'}>
                        {Object.values(WaveformEnum).map((w, i) => {
                            return (
                                <div key={i}>
                                    <input
                                        type="radio"
                                        id={w + '-wave-' + (primary ? 'primary' : 'secondary')}
                                        name={(primary ? 'primary' : 'secondary') + '-waveform'}
                                        value={w}
                                        onChange={(e) =>
                                            handleWaveformChange(
                                                setWaveform,
                                                primary
                                                    ? synthEngine.current.primaryVco
                                                    : synthEngine.current.secondaryVco,
                                                e
                                            )
                                        }
                                        checked={w === waveform}
                                    />
                                    <label htmlFor={w + '-wave-' + (primary ? 'primary' : 'secondary')}>{w}</label>
                                    <br />
                                </div>
                            );
                        })}
                    </div>
                    <div className={'flex-100'}>
                        <input
                            type="range"
                            id={(primary ? 'primary-detune' : 'secondary-detune') + '-control'}
                            name={(primary ? 'primary-detune' : 'secondary-detune') + '-control'}
                            className="horizontal-slider"
                            min={DefaultParams.detuneMin}
                            max={DefaultParams.detuneMax}
                            step={0.05}
                            value={detune}
                            onChange={handleDetuneChange}
                            // onClick={(e) => handleDoubleClick(e, setDetune, DefaultParams.detune)}
                        />
                    </div>
                </div>
                <div className={`columnVolume flex-25 vertical-fader-scale`}>
                    <VerticalSliderComponent
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
