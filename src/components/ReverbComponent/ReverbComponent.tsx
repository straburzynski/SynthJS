import React, { FC, useState } from 'react';
import { DefaultParams } from '../../consts/DefaultParams';
import SliderComponent from '../shared/SliderComponent/SliderComponent';
import { SynthEngineModel } from '../../models/SynthEngineModel';
import { createImpulseResponse } from '../../services/ImpulseResponseGenerator';

type ReverbComponentProps = {
    synthEngine: React.MutableRefObject<SynthEngineModel>;
};
const ReverbComponent: FC<ReverbComponentProps> = ({ synthEngine }) => {
    const [reverbLength, setReverbLength] = useState<number>(DefaultParams.reverbLength);
    const [reverbAmount, setReverbAmount] = useState<number>(DefaultParams.reverbGain);

    const handleReverbLengthChange = (changedReverbLength: number) => {
        synthEngine.current.reverbNode.buffer = createImpulseResponse(
            synthEngine.current.audioContext,
            reverbLength,
            2,
            false
        );
        setReverbLength(changedReverbLength);
    };

    const handleReverbAmountChange = (value: number) => {
        synthEngine.current.reverbGain.gain.value = value;
        setReverbAmount(value);
    };

    return (
        <div className="component-wrapper">
            <p className="title">Reverb</p>
            <div className="columns top-labels text-center">
                <div className="column-2">
                    <label>Length</label>
                </div>
                <div className="column-2">
                    <label>Amount</label>
                </div>
            </div>

            <div className="columns">
                <div className="column-2">
                    <SliderComponent
                        name="reverb-length"
                        minValue={DefaultParams.reverbLengthMin}
                        maxValue={DefaultParams.reverbLengthMax}
                        value={reverbLength}
                        onChange={handleReverbLengthChange}
                        defaultValue={DefaultParams.delayTime}
                        step={0.05}
                    />
                </div>
                <div className="column-2">
                    <SliderComponent
                        name="reverb-amount"
                        minValue={DefaultParams.reverbGainMin}
                        maxValue={DefaultParams.reverbGainMax}
                        value={reverbAmount}
                        onChange={handleReverbAmountChange}
                        defaultValue={DefaultParams.reverbGain}
                        step={0.1}
                    />
                </div>
            </div>
            <div className="columns bottom-labels text-center">
                <div className="column-2">
                    <label>{reverbLength} s</label>
                </div>
                <div className="column-2">
                    <label>{(reverbAmount * 100).toFixed(0)} %</label>
                </div>
            </div>
        </div>
    );
};

export default ReverbComponent;
