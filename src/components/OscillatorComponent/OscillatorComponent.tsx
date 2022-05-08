import React, { FC, useState } from 'react';
import { WaveformEnum } from '../../models/WaveformEnum';
import { DefaultParams } from '../../consts/DefaultParams';
import { SynthEngineModel } from '../../models/SynthEngineModel';
import SliderComponent from '../shared/SliderComponent/SliderComponent';
import WaveformIconComponent from '../shared/WaveformIconComponent/WaveformIconComponent';

type OscillatorComponentProps = {
    synthEngine: React.MutableRefObject<SynthEngineModel>;
    primary: boolean;
    detune: number;
    setDetune: Function;
    waveform: OscillatorType;
    setWaveform: Function;
};
const OscillatorComponent: FC<OscillatorComponentProps> = ({
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
            <p className="title orange">{primary ? 'Primary' : 'Secondary'} OSC</p>
            <div className="columns top-labels text-center">
                <div className="column-3">
                    <label>Wave</label>
                </div>
                <div className="column-3">
                    <label>Detune</label>
                </div>
                <div className="column-3">
                    <label>Vol</label>
                </div>
            </div>
            <div className="columns">
                <div className="column-3">
                    {Object.values(WaveformEnum).map((w, i) => {
                        return (
                            <label
                                htmlFor={w + '-wave-' + (primary ? 'primary' : 'secondary')}
                                className="icon-label"
                                key={i}
                            >
                                <input
                                    className="icon-input"
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
                <div className="column-3">
                    <SliderComponent
                        name={primary ? 'primary-detune' : 'secondary-detune'}
                        minValue={DefaultParams.detuneMin}
                        maxValue={DefaultParams.detuneMax}
                        value={detune}
                        onChange={handleDetuneChange}
                        defaultValue={DefaultParams.detune}
                        step={0.05}
                    />
                </div>
                <div className="column-3">
                    <SliderComponent
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
            <div className="columns bottom-labels text-center">
                <div className="column-3">
                    <label>{waveform}</label>
                </div>
                <div className="column-3">
                    <label>{detune}</label>
                </div>
                <div className="column-3">
                    <label>{volume}</label>
                </div>
            </div>
        </div>
    );
};

export default OscillatorComponent;
