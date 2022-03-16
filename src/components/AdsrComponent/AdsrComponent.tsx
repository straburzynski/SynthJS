import React from 'react';
import { DefaultParams } from '../../models/DefaultParams';

const AdsrComponent = ({
    attack,
    onHandleAttackChange,
    decay,
    onHandleDecayChange,
    sustain,
    onHandleSustainChange,
    release,
    onHandleReleaseChange,
}: any) => {
    return (
        <>
            <p>ADSR Control</p>
            <input
                type="range"
                id="attack-control"
                name="attack-control"
                min={DefaultParams.adsrMin}
                max={DefaultParams.adsrMax}
                step={0.05}
                value={attack}
                onChange={onHandleAttackChange}
            />
            <label htmlFor="attack-control">Attack Time: {attack}</label>
            <br />
            <input
                type="range"
                id="decay-control"
                name="decay-control"
                min={DefaultParams.adsrMin}
                max={DefaultParams.adsrMax}
                step={0.05}
                value={decay}
                onChange={onHandleDecayChange}
            />
            <label htmlFor="decay-control">Decay Time: {decay}</label>
            <br />
            <input
                type="range"
                id="sustain-control"
                name="sustain-control"
                min={DefaultParams.adsrMin}
                max={DefaultParams.adsrMax}
                step={0.05}
                value={sustain}
                onChange={onHandleSustainChange}
            />
            <label htmlFor="sustain-control">Sustain Time: {sustain}</label>
            <br />
            <input
                type="range"
                id="release-control"
                name="release-control"
                min={DefaultParams.adsrMin}
                max={DefaultParams.adsrMax}
                step={0.05}
                value={release}
                onChange={onHandleReleaseChange}
            />
            <label htmlFor="release-control">Release Time: {release}</label>
            <br />
        </>
    );
};

export default AdsrComponent;
