import React, { FC } from 'react';

type RangeInputProps = {
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
};

const RangeInput: FC<RangeInputProps> = (rangeInputModel: RangeInputProps) => {
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
            <label>{rangeInputModel.label}</label>
        </>
    );
};

export default RangeInput;
