import React, { FC } from 'react';
import { RangeInputModel } from './RangeInputModel';

const RangeInput: FC<RangeInputModel> = (rangeInputModel: RangeInputModel) => {
    return (
        <>
            <input
                type="range"
                min={rangeInputModel.min}
                max={rangeInputModel.max}
                step={rangeInputModel.step}
                value={rangeInputModel.value}
                onChange={rangeInputModel.onChange}
            />
        </>
    );
};

export default RangeInput;
