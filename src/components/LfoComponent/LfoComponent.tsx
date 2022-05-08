import React, { FC, useState } from 'react';
import { WaveformEnum } from '../../models/WaveformEnum';
import { DefaultParams } from '../../consts/DefaultParams';
import { SynthEngineModel } from '../../models/SynthEngineModel';
import SliderComponent from '../shared/SliderComponent/SliderComponent';
import WaveformIconComponent from '../shared/WaveformIconComponent/WaveformIconComponent';
import { LfoTargetEnum } from '../../models/LfoTargetEnum';

type LfoComponentProps = {
    synthEngine: React.MutableRefObject<SynthEngineModel>;
    lfoTarget: LfoTargetEnum;
};

const LfoComponent: FC<LfoComponentProps> = ({ synthEngine, lfoTarget }) => {
    const [lfoGain, setLfoGain] = useState<number>(DefaultParams.lfoGain);
    const [lfoFrequency, setLfoFrequency] = useState<number>(DefaultParams.lfoFrequency);
    const [lfoWaveform, setLfoWaveform] = useState<OscillatorType>(DefaultParams.lfoWaveform);

    const handleLfoFrequencyChange = (value: number) => {
        console.log('lfo frequency', value);
        setLfoFrequency(value);
        switch (lfoTarget) {
            case LfoTargetEnum.FREQUENCY:
                synthEngine.current.lfo1.frequency.value = value;
                break;
            case LfoTargetEnum.VCA:
                synthEngine.current.lfo2.frequency.value = value;
                break;
            default:
                console.error('lfo frequency error');
        }
    };

    const handleLfoGainChange = (value: number) => {
        console.log('lfo gain', value);
        setLfoGain(value);
        switch (lfoTarget) {
            case LfoTargetEnum.FREQUENCY:
                synthEngine.current.lfo1Gain.gain.value = value;
                break;
            case LfoTargetEnum.VCA:
                synthEngine.current.lfo2Gain.gain.value = value;
                break;
            default:
                console.error('lfo gain error');
        }
    };

    const handleWaveformChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedWaveform = event.target.value as OscillatorType;
        console.log(event.target.name, selectedWaveform);
        switch (lfoTarget) {
            case LfoTargetEnum.FREQUENCY:
                setLfoWaveform(selectedWaveform);
                synthEngine.current.lfo1.type = selectedWaveform;
                break;
            case LfoTargetEnum.VCA:
                setLfoWaveform(selectedWaveform);
                synthEngine.current.lfo2.type = selectedWaveform;
                break;
            default:
                console.error('lfo waveform error');
        }
    };

    return (
        <div className="component-wrapper">
            <p className="title teal">{`LFO > ${lfoTarget}`} </p>
            <div className="columns top-labels text-center">
                <div className="column-3">
                    <label htmlFor="attack-control">Wave</label>
                </div>
                <div className="column-3">
                    <label htmlFor="decay-control">Freq</label>
                </div>
                <div className="column-3">
                    <label htmlFor="sustain-control">Level</label>
                </div>
            </div>

            <div className="columns">
                <div className="column-3">
                    {Object.values(WaveformEnum).map((w, i) => {
                        return (
                            <label htmlFor={w + '-wave-' + lfoTarget} className="icon-label" key={i}>
                                <input
                                    className="icon-input"
                                    type="radio"
                                    id={w + '-wave-' + lfoTarget}
                                    name={lfoTarget + '-waveform'}
                                    value={w}
                                    onChange={handleWaveformChange}
                                    checked={w === lfoWaveform}
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
                        mode="vertical"
                        name="frequency"
                        minValue={DefaultParams.lfoFrequencyMin}
                        maxValue={DefaultParams.lfoFrequencyMax}
                        value={lfoFrequency}
                        onChange={handleLfoFrequencyChange}
                        defaultValue={DefaultParams.lfoFrequency}
                        step={0.1}
                    />
                </div>
                <div className="column-3">
                    <SliderComponent
                        mode="vertical"
                        name={'gain'}
                        minValue={DefaultParams.lfoGainMin}
                        maxValue={lfoTarget === LfoTargetEnum.FREQUENCY ? DefaultParams.lfoGainMax : 0.5}
                        value={lfoGain}
                        onChange={handleLfoGainChange}
                        defaultValue={DefaultParams.lfoGain}
                        step={0.05}
                    />
                </div>
            </div>

            <div className="columns bottom-labels text-center">
                <div className="column-3">
                    <label>{lfoWaveform}</label>
                </div>
                <div className="column-3">
                    <label>{lfoFrequency + ' Hz'}</label>
                </div>
                <div className="column-3">
                    <label>{lfoGain}</label>
                </div>
            </div>
        </div>
    );
};

export default LfoComponent;
