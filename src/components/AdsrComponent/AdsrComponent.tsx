import React, { FC } from 'react';
import { DefaultParams } from '../../consts/DefaultParams';
import styles from './AdsrComponent.module.scss';

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

const AdsrComponent: FC<AdsrComponentProps> = (
    {
        attack,
        setAttack,
        decay,
        setDecay,
        sustain,
        setSustain,
        release,
        setRelease,
    },
) => {
    const handleAttackChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const changedAttack: number = event.target.valueAsNumber;
        console.log('attack: ', changedAttack);
        setAttack(changedAttack);
    };

    const handleDecayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const changedDecay: number = event.target.valueAsNumber;
        console.log('decay: ', changedDecay);
        setDecay(changedDecay);
    };

    const handleSustainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const changedSustain: number = event.target.valueAsNumber;
        console.log('sustain: ', changedSustain);
        setSustain(changedSustain);
    };

    const handleReleaseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const changedRelease: number = event.target.valueAsNumber;
        console.log('release: ', changedRelease);
        setRelease(changedRelease);
    };

    const handleDoubleClick = (event: React.MouseEvent<HTMLInputElement>, setterFunction: Function, value: number) => {
        console.log('double click -> reset to default value: ', event.currentTarget.id);
        if (event.detail === 2) {
            setterFunction(value)
        }
    };

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
                        onChange={handleAttackChange}
                        onClick={(e) => handleDoubleClick(e, setAttack, DefaultParams.attack)}
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
                        onChange={handleDecayChange}
                        onClick={(e) => handleDoubleClick(e, setDecay, DefaultParams.decay)}
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
                        onChange={handleSustainChange}
                        onClick={(e) => handleDoubleClick(e, setSustain, DefaultParams.sustain)}
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
                        onChange={handleReleaseChange}
                        onClick={(e) => handleDoubleClick(e, setRelease, DefaultParams.release)}
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
