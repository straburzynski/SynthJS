import React, { FC, useCallback } from 'react';
import styles from './SliderComponent.module.scss';

type VerticalSliderComponentProps = {
    mode?: 'horizontal' | 'vertical';
    name: string;
    minValue: number;
    maxValue: number;
    value: number;
    onChange: Function;
    defaultValue: number;
    step: number;
};
const SliderComponent: FC<VerticalSliderComponentProps> = ({
    mode = 'vertical',
    name,
    minValue,
    maxValue,
    value,
    onChange,
    defaultValue,
    step,
}) => {
    const handleOnChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const changedValue: number = event.target.valueAsNumber;
            console.log(name, changedValue);
            onChange(changedValue);
        },
        [name, onChange]
    );

    const handleDoubleClick = useCallback(
        (event: React.MouseEvent<HTMLInputElement>, setterFunction: Function, value: number) => {
            console.log(name, 'double click -> reset to default value: ', defaultValue);
            if (event.detail === 2) {
                setterFunction(value);
            }
        },
        [defaultValue, name]
    );

    return (
        <div className={`${styles[mode]} vertical-fader-scale`}>
            <input
                type="range"
                id={`${name}-control`}
                name={`${name}-control`}
                min={minValue}
                max={maxValue}
                step={step}
                value={value}
                onChange={handleOnChange}
                onClick={(e) => handleDoubleClick(e, onChange, defaultValue)}
            />
        </div>
    );
};

export default SliderComponent;
