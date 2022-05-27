import React, { FC, useCallback, useState } from 'react';
import { DefaultParams } from '../../consts/DefaultParams';
import SliderComponent from '../shared/SliderComponent/SliderComponent';
import { SynthEngineModel } from '../../models/SynthEngineModel';

type DelayComponentProps = {
    synthEngine: React.MutableRefObject<SynthEngineModel>;
};
const DelayComponent: FC<DelayComponentProps> = ({ synthEngine }) => {
    const [delayTime, setDelayTime] = useState<number>(DefaultParams.delayTime);
    const [delayFeedback, setDelayFeedback] = useState<number>(DefaultParams.delayFeedback);

    const handleDelayTimeChange = useCallback(
        (value: number) => {
            synthEngine.current.delayNode.delayTime.linearRampToValueAtTime(
                value,
                synthEngine.current.audioContext.currentTime + 0.01
            );
            setDelayTime(value);
        },
        [synthEngine]
    );

    const handleDelayFeedbackChange = useCallback(
        (value: number) => {
            synthEngine.current.delayFeedback.gain.linearRampToValueAtTime(
                value,
                synthEngine.current.audioContext.currentTime + 0.01
            );
            setDelayFeedback(value);
        },
        [synthEngine]
    );

    return (
        <div className="component-wrapper">
            <p className="title yellow">Delay</p>
            <div className="columns top-labels text-center">
                <div className="column-2">
                    <label>Time</label>
                </div>
                <div className="column-2">
                    <label>Feedback</label>
                </div>
            </div>

            <div className="columns">
                <div className="column-2">
                    <SliderComponent
                        name="time"
                        minValue={DefaultParams.delayTimeMin}
                        maxValue={DefaultParams.delayTimeMax}
                        value={delayTime}
                        onChange={handleDelayTimeChange}
                        defaultValue={DefaultParams.delayTime}
                        step={0.05}
                    />
                </div>
                <div className="column-2">
                    <SliderComponent
                        name="feedback"
                        minValue={DefaultParams.delayFeedbackMin}
                        maxValue={DefaultParams.delayFeedbackMax}
                        value={delayFeedback}
                        onChange={handleDelayFeedbackChange}
                        defaultValue={DefaultParams.delayFeedback}
                        step={0.05}
                    />
                </div>
            </div>
            <div className="columns bottom-labels text-center">
                <div className="column-2">
                    <label>{delayTime} s</label>
                </div>
                <div className="column-2">
                    <label>{(delayFeedback * 100).toFixed(0)} %</label>
                </div>
            </div>
        </div>
    );
};

export default React.memo(DelayComponent);
