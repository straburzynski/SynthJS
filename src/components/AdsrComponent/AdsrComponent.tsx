import React, { FC } from 'react';
import { DefaultParams } from '../../consts/DefaultParams';
import styles from './AdsrComponent.module.scss';
import VerticalSliderComponent from '../shared/VerticalSliderComponent/VerticalSliderComponent';

type AdsrComponentProps = {
    attack: number;
    setAttack: Function;
    decay: number;
    setDecay: Function;
    sustain: number;
    setSustain: Function;
    release: number;
    setRelease: Function;
};

const AdsrComponent: FC<AdsrComponentProps> = ({
    attack,
    setAttack,
    decay,
    setDecay,
    sustain,
    setSustain,
    release,
    setRelease,
}) => {
    const handleAdsrChange = (name: string, changedValue: number, setterFunction: Function) => {
        console.log(name, changedValue);
        setterFunction(changedValue);
    };

    return (
        <div className="component-wrapper">
            <p>ADSR Control</p>
            <div className="columns vertical-fader-scale">
                <div className="column-4">
                    <VerticalSliderComponent
                        name={'attack'}
                        minValue={DefaultParams.adsrMin}
                        maxValue={DefaultParams.adsrMax}
                        value={attack}
                        onChange={(changedValue: number) => handleAdsrChange('attack', changedValue, setAttack)}
                        defaultValue={DefaultParams.attack}
                        step={0.05}
                    />
                </div>
                <div className="column-4">
                    <VerticalSliderComponent
                        name={'decay'}
                        minValue={DefaultParams.adsrMin}
                        maxValue={DefaultParams.adsrMax}
                        value={decay}
                        onChange={(changedValue: number) => handleAdsrChange('decay', changedValue, setDecay)}
                        defaultValue={DefaultParams.decay}
                        step={0.05}
                    />
                </div>
                <div className="column-4">
                    <VerticalSliderComponent
                        name={'sustain'}
                        minValue={DefaultParams.adsrMin}
                        maxValue={DefaultParams.adsrMax}
                        value={sustain}
                        onChange={(changedValue: number) => handleAdsrChange('sustain', changedValue, setSustain)}
                        defaultValue={DefaultParams.sustain}
                        step={0.05}
                    />
                </div>
                <div className="column-4">
                    <VerticalSliderComponent
                        name={'release'}
                        minValue={DefaultParams.adsrMin}
                        maxValue={DefaultParams.adsrMax}
                        value={release}
                        onChange={(changedValue: number) => handleAdsrChange('release', changedValue, setRelease)}
                        defaultValue={DefaultParams.release}
                        step={0.05}
                    />
                </div>
            </div>
            <div className={'columns ' + styles.textCenter}>
                <div className="column-4">
                    <label htmlFor="attack-control">
                        Attack Time:
                        <br /> {attack}
                    </label>
                </div>
                <div className="column-4">
                    <label htmlFor="decay-control">
                        Decay Time:
                        <br /> {decay}
                    </label>
                </div>
                <div className="column-4">
                    <label htmlFor="sustain-control">
                        Sustain Level:
                        <br /> {sustain}
                    </label>
                </div>
                <div className="column-4">
                    <label htmlFor="release-control">
                        Release Time:
                        <br /> {release}
                    </label>
                </div>
            </div>
        </div>
    );
};

export default AdsrComponent;
