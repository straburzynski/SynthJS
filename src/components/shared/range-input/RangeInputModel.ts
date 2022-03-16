import { ChangeEventHandler } from 'react';

export type RangeInputModel = {
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: ChangeEventHandler<HTMLInputElement>;
};
