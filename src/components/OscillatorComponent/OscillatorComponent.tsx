import React, { FC } from 'react';
import { WaveformEnum } from '../../models/WaveformEnum';
import VolumeComponent from '../VolumeComponent/VolumeComponent';
import RangeInput from '../shared/RangeInput/RangeInput';
import { DefaultParams } from '../../consts/DefaultParams';
import { SynthEngineModel } from '../../models/SynthEngineModel';

type OscillatorComponentProps = {
    synthEngine: React.MutableRefObject<SynthEngineModel>;
    primary: boolean;
    detune: number;
    setDetune: Function;
    waveform: OscillatorType,
    setWaveform: Function,
}
export const OscillatorComponent: FC<OscillatorComponentProps> = (
    {
        synthEngine,
        primary,
        detune,
        setDetune,
        waveform,
        setWaveform,
    },
) => {
    const handleWaveformChange = (
        setWaveform: Function,
        oscillatorNode: OscillatorNode,
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const selectedWaveform = event.target.value as OscillatorType;
        console.log(event.target.name, selectedWaveform);
        oscillatorNode.type = selectedWaveform;
        setWaveform(selectedWaveform);
    };

    const handleDetuneChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        setDetune: Function,
        oscNode: OscillatorNode,
    ) => {
        const changedDetune: number = event.target.valueAsNumber;
        console.log('detune change: ', changedDetune);
        setDetune(changedDetune);
        oscNode.detune.setValueAtTime(changedDetune, synthEngine.current.audioContext.currentTime); // value in cents
    };

    return (
        <>
            <p>{primary ? 'Primary' : 'Secondary'} OSC</p>
            {Object.values(WaveformEnum).map((w, i) => {
                return (
                    <div key={i}>
                        <input
                            type='radio'
                            id={w + '-wave-' + (primary ? 'primary' : 'secondary')}
                            name={(primary ? 'primary' : 'secondary') + '-waveform'}
                            value={w}
                            onChange={(e) =>
                                handleWaveformChange(setWaveform,
                                    primary ? synthEngine.current.primaryVco : synthEngine.current.secondaryVco, e)
                            }
                            checked={w === waveform}
                        />
                        <label htmlFor={w + '-wave-' + (primary ? 'primary' : 'secondary')}>{w}</label>
                        <br />
                    </div>
                );
            })}
            <br />
            <VolumeComponent
                name={(primary ? 'Primary' : 'Secondary') + 'VCA'}
                volumeNode={primary ? synthEngine.current.primaryVca : synthEngine.current.secondaryVca} />
            <div>
                <RangeInput
                    min={DefaultParams.detuneMin}
                    max={DefaultParams.detuneMax}
                    step={0.5}
                    value={detune}
                    onChange={(e) => handleDetuneChange(e, setDetune,
                        primary ? synthEngine.current.primaryVco : synthEngine.current.secondaryVco)}
                />
                {'detune'}: {detune}
                <br />
            </div>
        </>
    );
};
