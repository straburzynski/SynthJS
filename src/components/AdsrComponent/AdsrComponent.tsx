import React, { FC, useCallback, useState } from 'react';
import { DefaultParams } from '../../consts/DefaultParams';
import SliderComponent from '../shared/SliderComponent/SliderComponent';
import styles from './AdsrComponent.module.scss';
import { SynthParametersModel } from '../../models/SynthParametersModel';

type AdsrComponentProps = {
    synthParameters: React.MutableRefObject<SynthParametersModel>;
};

const AdsrComponent: FC<AdsrComponentProps> = ({ synthParameters }) => {
    // todo make one model
    const [attack, setAttack] = useState<number>(synthParameters.current.attack);
    const [decay, setDecay] = useState<number>(synthParameters.current.decay);
    const [release, setRelease] = useState<number>(synthParameters.current.release);
    const [sustain, setSustain] = useState<number>(synthParameters.current.sustain);
    const [envelope, setEnvelope] = useState<string>(synthParameters.current.envelope);

    const handleAdsrChange = (name: string, changedValue: number, setterFunction: Function) => {
        console.log(name, changedValue);
        setterFunction(changedValue);
        (synthParameters.current as any)[name] = changedValue;
    };

    const handleEnvelopeChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const changedEnv = event.target.value;
            console.log('adsr mode', changedEnv);
            setEnvelope(changedEnv);
            synthParameters.current.envelope = changedEnv;
        },
        [synthParameters]
    );

    return (
        <div className="component-wrapper">
            <p className="title orange">Envelope</p>
            <div className="columns top-labels text-center">
                <div className="column-5">
                    <label></label>
                </div>
                <div className="column-5">
                    <label htmlFor="attack-control">Att</label>
                </div>
                <div className="column-5">
                    <label htmlFor="decay-control">Dec</label>
                </div>
                <div className="column-5">
                    <label htmlFor="sustain-control">Sus</label>
                </div>
                <div className="column-5">
                    <label htmlFor="release-control">Rel</label>
                </div>
            </div>
            <div className="columns">
                <div className={`column-5 ${styles.envColumn}`}>
                    <label htmlFor="env" className={styles.verticalRadioLabel}>
                        <p>env</p>
                        <input
                            className={styles.verticalRadioInput}
                            type="radio"
                            id="env"
                            name={'envelope'}
                            value={'env'}
                            onChange={handleEnvelopeChange}
                            checked={'env' === envelope}
                        />
                    </label>
                    <label htmlFor="gate" className={styles.verticalRadioLabel}>
                        <input
                            className={styles.verticalRadioInput}
                            type="radio"
                            id={'gate'}
                            name={'envelope'}
                            value={'gate'}
                            onChange={handleEnvelopeChange}
                            checked={'gate' === envelope}
                        />
                        <p>gate</p>
                    </label>
                </div>
                <div className="column-5">
                    <SliderComponent
                        name="attack"
                        minValue={DefaultParams.adsrMin}
                        maxValue={DefaultParams.adsrMax}
                        value={attack}
                        onChange={(changedValue: number) => handleAdsrChange('attack', changedValue, setAttack)}
                        defaultValue={DefaultParams.attack}
                        step={0.1}
                    />
                </div>
                <div className="column-5">
                    <SliderComponent
                        name="decay"
                        minValue={DefaultParams.adsrMin}
                        maxValue={DefaultParams.adsrMax}
                        value={decay}
                        onChange={(changedValue: number) => handleAdsrChange('decay', changedValue, setDecay)}
                        defaultValue={DefaultParams.decay}
                        step={0.1}
                    />
                </div>
                <div className="column-5">
                    <SliderComponent
                        name="sustain"
                        minValue={DefaultParams.adsrMin}
                        maxValue={DefaultParams.adsrMax}
                        value={sustain}
                        onChange={(changedValue: number) => handleAdsrChange('sustain', changedValue, setSustain)}
                        defaultValue={DefaultParams.sustain}
                        step={0.1}
                    />
                </div>
                <div className="column-5">
                    <SliderComponent
                        name="release"
                        minValue={DefaultParams.adsrMin}
                        maxValue={DefaultParams.adsrMax}
                        value={release}
                        onChange={(changedValue: number) => handleAdsrChange('release', changedValue, setRelease)}
                        defaultValue={DefaultParams.release}
                        step={0.1}
                    />
                </div>
            </div>
            <div className="columns bottom-labels text-center">
                <div className="column-5">
                    <label></label>
                </div>
                <div className="column-5">
                    <label htmlFor="attack-control">{attack}</label>
                </div>
                <div className="column-5">
                    <label htmlFor="decay-control">{decay}</label>
                </div>
                <div className="column-5">
                    <label htmlFor="sustain-control">{sustain}</label>
                </div>
                <div className="column-5">
                    <label htmlFor="release-control">{release}</label>
                </div>
            </div>
        </div>
    );
};

export default React.memo(AdsrComponent);
