import React, { FC, useCallback, useState } from 'react';
import { WaveformEnum } from '../../models/WaveformEnum';
import { DefaultParams } from '../../consts/DefaultParams';
import { SynthEngineModel } from '../../models/SynthEngineModel';
import SliderComponent from '../shared/SliderComponent/SliderComponent';
import WaveformIconComponent from '../shared/WaveformIconComponent/WaveformIconComponent';
import { SynthParametersModel } from '../../models/SynthParametersModel';

type OscillatorComponentProps = {
    synthEngine: React.MutableRefObject<SynthEngineModel>;
    synthParameters: React.MutableRefObject<SynthParametersModel>;
    oscName: string;
};
const OscillatorComponent: FC<OscillatorComponentProps> = ({ synthEngine, synthParameters, oscName }) => {
    const [volume, setVolume] = useState<number>(DefaultParams.gain);
    const [waveForm, setWaveForm] = useState<OscillatorType>(
        synthParameters.current.oscillatorsParams.get(oscName)!.waveForm
    );
    const [detune, setDetune] = useState<number>(DefaultParams.detune);

    const handleWaveformChange = useCallback(
        (oscName: string, event: React.ChangeEvent<HTMLInputElement>) => {
            const changedWaveForm = event.target.value as OscillatorType;
            console.log(event.target.name, changedWaveForm);
            const oscillatorNode = synthEngine.current.oscillatorsGroup.get(oscName)!.vcoNode;
            oscillatorNode.type = changedWaveForm;
            setWaveForm(changedWaveForm);
            synthParameters.current.oscillatorsParams.get(oscName)!.waveForm = changedWaveForm;
        },
        [synthEngine, synthParameters]
    );

    const handleDetuneChange = useCallback(
        (changedDetune: number) => {
            console.log(oscName + ' detune change: ', changedDetune);
            const oscillatorNode = synthEngine.current.oscillatorsGroup.get(oscName)!.vcoNode;
            oscillatorNode.detune.setValueAtTime(changedDetune, synthEngine.current.audioContext.currentTime); // value in cents
            setDetune(changedDetune);
            synthParameters.current.oscillatorsParams.get(oscName)!.detune = changedDetune;
        },
        [oscName, synthEngine, synthParameters]
    );

    const handleVolumeChange = useCallback(
        (changedVolume: number) => {
            console.log(oscName + ' volume change: ', changedVolume);
            const volumeNode = synthEngine.current.oscillatorsGroup.get(oscName)!.vcaNode;
            volumeNode.gain.value = changedVolume;
            setVolume(changedVolume);
        },
        [oscName, synthEngine]
    );

    return (
        <div className="component-wrapper">
            <p className="title orange">{oscName} OSC</p>
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
                            <label htmlFor={w + '-wave-' + oscName} className="icon-label" key={i}>
                                <input
                                    className="icon-input"
                                    type="radio"
                                    id={w + '-wave-' + oscName}
                                    name={oscName + '-waveform'}
                                    value={w}
                                    onChange={(e) => handleWaveformChange(oscName, e)}
                                    checked={w === waveForm}
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
                        name={oscName + '-detune'}
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
                        name={oscName + '-vca'}
                        minValue={DefaultParams.gainMin}
                        maxValue={DefaultParams.gainMax}
                        value={volume}
                        onChange={handleVolumeChange}
                        defaultValue={DefaultParams.gain}
                        step={0.01}
                    />
                </div>
            </div>
            <div className="columns bottom-labels text-center">
                <div className="column-3">
                    <label>{waveForm}</label>
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

export default React.memo(OscillatorComponent);
