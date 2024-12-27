import React, { FC, useCallback, useState } from 'react';
import { DefaultParams } from '../../consts/DefaultParams';
import SliderComponent from '../shared/SliderComponent/SliderComponent';
import styles from './AdsrComponent.module.scss';
import { SynthParametersModel } from '../../models/SynthParametersModel';
import { StringIndex } from '../../types';
import { ADSRModel } from '../../models/ADSRModel';

type AdsrComponentProps = {
    synthParameters: React.MutableRefObject<SynthParametersModel>;
};

const AdsrComponent: FC<AdsrComponentProps> = ({ synthParameters }) => {
    const [adsr, setAdsr] = useState<ADSRModel>(synthParameters.current.adsr);
    const [envelope, setEnvelope] = useState<string>(synthParameters.current.envelope);

    const handleAdsrChangeNew = useCallback(
        (name: string, changedValue: number) => {
            synthParameters.current.adsr = { ...adsr, [name]: changedValue };
            setAdsr((prevState) => ({ ...prevState, [name]: changedValue }));
        },
        [adsr, synthParameters]
    );

    const handleEnvelopeChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const changedEnv = event.target.value;
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
                            name='envelope'
                            value='env'
                            onChange={handleEnvelopeChange}
                            checked={'env' === envelope}
                        />
                    </label>
                    <label htmlFor="gate" className={styles.verticalRadioLabel}>
                        <input
                            className={styles.verticalRadioInput}
                            type="radio"
                            id='gate'
                            name='envelope'
                            value='gate'
                            onChange={handleEnvelopeChange}
                            checked={'gate' === envelope}
                        />
                        <p>gate</p>
                    </label>
                </div>
                {Object.keys(synthParameters.current.adsr).map((adsrParam) => {
                    return (
                        <div className="column-5" key={adsrParam}>
                            <SliderComponent
                                name={adsrParam}
                                minValue={DefaultParams.adsrMin}
                                maxValue={DefaultParams.adsrMax}
                                value={(adsr as StringIndex)[adsrParam]}
                                onChange={(changedValue: number) => handleAdsrChangeNew(adsrParam, changedValue)}
                                defaultValue={DefaultParams[adsrParam]}
                                step={0.1}
                            />
                        </div>
                    );
                })}
            </div>
            <div className="columns bottom-labels text-center">
                <div className="column-5">
                    <label></label>
                </div>
                <div className="column-5">
                    <label htmlFor="attack-control">{adsr.attack}</label>
                </div>
                <div className="column-5">
                    <label htmlFor="decay-control">{adsr.decay}</label>
                </div>
                <div className="column-5">
                    <label htmlFor="sustain-control">{adsr.sustain}</label>
                </div>
                <div className="column-5">
                    <label htmlFor="release-control">{adsr.release}</label>
                </div>
            </div>
        </div>
    );
};

export default React.memo(AdsrComponent);
