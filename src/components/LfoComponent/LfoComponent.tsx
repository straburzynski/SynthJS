import React, { FC, useState } from 'react';
import { WaveformEnum } from '../../models/WaveformEnum';
import { DefaultParams } from '../../consts/DefaultParams';
import { SynthEngineModel } from '../../models/SynthEngineModel';
import SliderComponent from '../shared/SliderComponent/SliderComponent';
import WaveformIconComponent from '../shared/WaveformIconComponent/WaveformIconComponent';
import styles from './LfoComponent.module.scss';
import { LfoTargetEnum } from '../../models/LfoTargetEnum';

type LfoComponentProps = {
    synthEngine: React.MutableRefObject<SynthEngineModel>;
    lfoTarget: LfoTargetEnum;
};

export const LfoComponent: FC<LfoComponentProps> = ({ synthEngine, lfoTarget }) => {
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
            <p>{lfoTarget} LFO</p>
            <div className="columns">
                <div className={`${styles.leftColumn} ${styles.verticalContainer} flex-50`}>
                    <div className="flex-100">Waveform</div>
                    <div className={styles.flexContainer}>
                        <div className={styles.iconsContainer}>
                            {Object.values(WaveformEnum).map((w, i) => {
                                return (
                                    <label htmlFor={w + '-wave-' + lfoTarget} className={styles.iconLabel} key={i}>
                                        <input
                                            className={styles.iconInput}
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
                    </div>
                </div>
                <div className={`${styles.columnVolume} flex-100`}>
                    <div className="columns vertical-fader-scale">
                        <div className="column-2">
                            <SliderComponent
                                mode="vertical"
                                name={'frequency'}
                                minValue={DefaultParams.lfoFrequencyMin}
                                maxValue={DefaultParams.lfoFrequencyMax}
                                value={lfoFrequency}
                                onChange={handleLfoFrequencyChange}
                                defaultValue={DefaultParams.lfoFrequency}
                                step={0.1}
                            />
                        </div>
                        <div className="column-2">
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
                    <div className={'columns ' + styles.textCenter}>
                        <div className="column-2">
                            <label htmlFor="attack-control">
                                freq:
                                <br /> {lfoFrequency + ' Hz'}
                            </label>
                        </div>
                        <div className="column-2">
                            <label htmlFor="decay-control">
                                gain:
                                <br /> {lfoGain}
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
