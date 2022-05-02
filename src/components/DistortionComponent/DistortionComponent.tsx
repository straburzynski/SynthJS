import React, { FC, useState } from 'react';
import { DefaultParams } from '../../consts/DefaultParams';
import SliderComponent from '../shared/SliderComponent/SliderComponent';
import { SynthEngineModel } from '../../models/SynthEngineModel';
import { createDistortionCurve } from '../../services/DistortionCurveGenerator';

type DistortionType = 'off' | 'type1';
type DistortionComponentProps = {
    synthEngine: React.MutableRefObject<SynthEngineModel>;
};
const DistortionComponent: FC<DistortionComponentProps> = ({ synthEngine }) => {
    const [distortionType, setDistortionType] = useState<DistortionType>('off');
    const [distortionGain, setDistortionGain] = useState<number>(0);

    const handleDistortionGainChange = (changedDistortionGain: number) => {
        if (distortionType) {
            synthEngine.current.distortion.curve = createDistortionCurve(changedDistortionGain);
        }
        setDistortionGain(changedDistortionGain);
    };

    const handleDistortionTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const changedDistortionActive = event.target.value as DistortionType;
        console.log('distortion type', changedDistortionActive);
        switch (changedDistortionActive) {
            case 'type1':
                console.log('distortion type1');
                synthEngine.current.distortion.curve = createDistortionCurve(distortionGain);
                break;
            case 'off':
            default:
                console.log('distortion off');
                synthEngine.current.distortion.curve = null;
                break;
        }
        setDistortionType(changedDistortionActive);
    };

    return (
        <div className="component-wrapper">
            <p className="title">Distortion</p>
            <div className="columns top-labels text-center">
                <div className="column-2">
                    <label></label>
                </div>
                <div className="column-2">
                    <label>Amount</label>
                </div>
            </div>

            <div className="columns">
                <div className="column-2">
                    <label htmlFor={'distortion-off'} className="icon-label">
                        <input
                            className="icon-input"
                            type="radio"
                            id={'distortion-off'}
                            name={'distortion'}
                            value={'off'}
                            onChange={handleDistortionTypeChange}
                            checked={'off' === distortionType}
                        />
                        <span>OFF</span>
                    </label>{' '}
                    <label htmlFor={'distortion-1'} className="icon-label">
                        <input
                            className="icon-input"
                            type="radio"
                            id={'distortion-1'}
                            name={'distortion'}
                            value={'type1'}
                            onChange={handleDistortionTypeChange}
                            checked={'type1' === distortionType}
                        />
                        <span>#1</span>
                    </label>
                </div>
                <div className="column-2">
                    <SliderComponent
                        name="distortion-amount"
                        minValue={DefaultParams.distortionMin}
                        maxValue={DefaultParams.distortionMax}
                        value={distortionGain}
                        onChange={handleDistortionGainChange}
                        defaultValue={DefaultParams.distortion}
                        step={1}
                    />
                </div>
            </div>
            <div className="columns bottom-labels text-center">
                <div className="column-2">
                    <label></label>
                </div>
                <div className="column-2">
                    <label>{distortionGain}</label>
                </div>
            </div>
        </div>
    );
};

export default DistortionComponent;
