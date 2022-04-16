import React, { FC } from 'react';
import { DefaultParams } from '../../consts/DefaultParams';
import styles from './AdsrComponent.module.scss';

type AdsrComponentProps = {
    attack: number;
    onHandleAttackChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    decay: number;
    onHandleDecayChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    sustain: number;
    onHandleSustainChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    release: number;
    onHandleReleaseChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const AdsrComponent: FC<AdsrComponentProps> = (
    {
        attack,
        onHandleAttackChange,
        decay,
        onHandleDecayChange,
        sustain,
        onHandleSustainChange,
        release,
        onHandleReleaseChange,
    },
) => {
    return (
        <div className='component-wrapper'>
            <p>ADSR Control</p>
            <div className='columns vertical-fader-scale'>
                <div className={'column-4 ' + styles.faders}>
                    <input
                        type='range'
                        id='attack-control'
                        name='attack-control'
                        className='vertical-slider'
                        min={DefaultParams.adsrMin}
                        max={DefaultParams.adsrMax}
                        step={0.05}
                        value={attack}
                        onChange={onHandleAttackChange}
                    />
                </div>
                <div className='column-4'>
                    <input
                        type='range'
                        id='decay-control'
                        name='decay-control'
                        className='vertical-slider'
                        min={DefaultParams.adsrMin}
                        max={DefaultParams.adsrMax}
                        step={0.05}
                        value={decay}
                        onChange={onHandleDecayChange}
                    />
                </div>
                <div className='column-4'>
                    <input
                        type='range'
                        id='sustain-control'
                        name='sustain-control'
                        className='vertical-slider'
                        min={DefaultParams.adsrMin}
                        max={DefaultParams.adsrMax}
                        step={0.05}
                        value={sustain}
                        onChange={onHandleSustainChange}
                    />
                </div>
                <div className='column-4'>
                    <input
                        type='range'
                        id='release-control'
                        name='release-control'
                        className='vertical-slider'
                        min={DefaultParams.adsrMin}
                        max={DefaultParams.adsrMax}
                        step={0.05}
                        value={release}
                        onChange={onHandleReleaseChange}
                    />
                </div>
            </div>
            <div className='columns'>
                <div className='column-4'>
                    <label htmlFor='attack-control'>Attack Time: {attack}</label>
                </div>
                <div className='column-4'>
                    <label htmlFor='decay-control'>Decay Time: {decay}</label>
                </div>
                <div className='column-4'>
                    <label htmlFor='sustain-control'>Sustain Level: {sustain}</label>
                </div>
                <div className='column-4'>
                    <label htmlFor='release-control'>Release Time: {release}</label>
                </div>
            </div>
        </div>
    );
};

export default AdsrComponent;
