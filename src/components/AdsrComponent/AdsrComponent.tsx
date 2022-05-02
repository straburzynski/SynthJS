import React, { FC } from 'react';
import { DefaultParams } from '../../consts/DefaultParams';
import SliderComponent from '../shared/SliderComponent/SliderComponent';

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
            <p className="title">Envelope</p>
            <div className="columns top-labels text-center">
                <div className="column-4">
                    <label htmlFor="attack-control">Att</label>
                </div>
                <div className="column-4">
                    <label htmlFor="decay-control">Dec</label>
                </div>
                <div className="column-4">
                    <label htmlFor="sustain-control">Sus</label>
                </div>
                <div className="column-4">
                    <label htmlFor="release-control">Rel</label>
                </div>
            </div>
            <div className="columns">
                <div className="column-4">
                    <SliderComponent
                        name="attack"
                        minValue={DefaultParams.adsrMin}
                        maxValue={DefaultParams.adsrMax}
                        value={attack}
                        onChange={(changedValue: number) => handleAdsrChange('attack', changedValue, setAttack)}
                        defaultValue={DefaultParams.attack}
                        step={0.05}
                    />
                </div>
                <div className="column-4">
                    <SliderComponent
                        name="decay"
                        minValue={DefaultParams.adsrMin}
                        maxValue={DefaultParams.adsrMax}
                        value={decay}
                        onChange={(changedValue: number) => handleAdsrChange('decay', changedValue, setDecay)}
                        defaultValue={DefaultParams.decay}
                        step={0.05}
                    />
                </div>
                <div className="column-4">
                    <SliderComponent
                        name="sustain"
                        minValue={DefaultParams.adsrMin}
                        maxValue={DefaultParams.adsrMax}
                        value={sustain}
                        onChange={(changedValue: number) => handleAdsrChange('sustain', changedValue, setSustain)}
                        defaultValue={DefaultParams.sustain}
                        step={0.05}
                    />
                </div>
                <div className="column-4">
                    <SliderComponent
                        name="release"
                        minValue={DefaultParams.adsrMin}
                        maxValue={DefaultParams.adsrMax}
                        value={release}
                        onChange={(changedValue: number) => handleAdsrChange('release', changedValue, setRelease)}
                        defaultValue={DefaultParams.release}
                        step={0.05}
                    />
                </div>
            </div>
            <div className="columns bottom-labels text-center">
                <div className="column-4">
                    <label htmlFor="attack-control">{attack}</label>
                </div>
                <div className="column-4">
                    <label htmlFor="decay-control">{decay}</label>
                </div>
                <div className="column-4">
                    <label htmlFor="sustain-control">{sustain}</label>
                </div>
                <div className="column-4">
                    <label htmlFor="release-control">{release}</label>
                </div>
            </div>
        </div>
    );
};

export default AdsrComponent;
