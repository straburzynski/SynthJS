import React, { FC } from 'react';
import styles from './VerticalSliderComponent.module.scss';

type VerticalSliderComponentProps = {
    name: string;
    minValue: number;
    maxValue: number;
    value: number;
    onChange: Function;
    defaultValue: number;
    step: number;
};
const VerticalSliderComponent: FC<VerticalSliderComponentProps> = ({
    name,
    minValue,
    maxValue,
    value,
    onChange,
    defaultValue,
    step,
}) => {
    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const changedValue: number = event.target.valueAsNumber;
        console.log(name, changedValue);
        onChange(changedValue);
    };

    const handleDoubleClick = (event: React.MouseEvent<HTMLInputElement>, setterFunction: Function, value: number) => {
        console.log(name, 'double click -> reset to default value: ', defaultValue);
        if (event.detail === 2) {
            setterFunction(value);
        }
    };

    return (
        <div className={styles.verticalSliderWrapper}>
            <input
                type="range"
                id={`${name}-control`}
                name={`${name}-control`}
                className={styles.verticalSlider + ' asd'}
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

export default VerticalSliderComponent;
