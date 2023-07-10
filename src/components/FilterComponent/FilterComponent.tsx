import React, { FC, useCallback, useState } from 'react';
import { AVAILABLE_FILTERS } from '../../consts/AvailableFilters';
import { DefaultParams } from '../../consts/DefaultParams';
import { SynthEngineModel } from '../../models/SynthEngineModel';
import SliderComponent from '../shared/SliderComponent/SliderComponent';
import { FilterTypeEnum } from '../../models/FilterTypeEnum';
import { StringIndex } from '../../types';
import FilterIconComponent from '../shared/FilterIconComponent/FilterIconComponent';
import styles from './FilterComponent.module.scss';

type OscillatorComponentProps = {
    synthEngine: React.MutableRefObject<SynthEngineModel>;
};

const FilterComponent: FC<OscillatorComponentProps> = ({ synthEngine }) => {
    const [frequency, setFrequency] = useState<number>(DefaultParams.filter);
    const [filterType, setFilterType] = useState<BiquadFilterType>(DefaultParams.filterType);
    const [filterQualityFactor, setFilterQualityFactor] = useState<number>(DefaultParams.qualityFactor);

    const FilterLabel: StringIndex = {
        [FilterTypeEnum.LOWPASS]: 'LP',
        [FilterTypeEnum.HIGHPASS]: 'HP',
        [FilterTypeEnum.BANDPASS]: 'BP',
        [FilterTypeEnum.ALLPASS]: 'AP',
    };

    const handleFilterTypeChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFilterType = event.target.value as BiquadFilterType;
            console.log('filter type: ', selectedFilterType);
            synthEngine.current.filter.type = selectedFilterType;
            setFilterType(selectedFilterType);
        },
        [synthEngine]
    );

    const handleFrequencyChange = useCallback(
        (value: number) => {
            console.log('filter frequency change: ', value);
            setFrequency(value);
            synthEngine.current.filter.frequency.value = value;
        },
        [synthEngine]
    );

    const handleFilterQualityFactorChange = useCallback(
        (value: number) => {
            console.log('filter Q: ', value);
            synthEngine.current.filter.Q.value = value;
            setFilterQualityFactor(value);
        },
        [synthEngine]
    );

    return (
        <div className="component-wrapper">
            <p className="title red">Filter</p>
            <div className="columns top-labels text-center">
                <div className="column-3">
                    <label htmlFor="attack-control">Filter</label>
                </div>
                <div className="column-3">
                    <label htmlFor="decay-control">Freq</label>
                </div>
                <div className="column-3">
                    <label htmlFor="sustain-control">Q</label>
                </div>
            </div>

            <div className="columns">
                <div className="column-3">
                    {Object.values(AVAILABLE_FILTERS).map((f, i) => {
                        return (
                            <label htmlFor={f + '-filter'} className="icon-label" key={i}>
                                <input
                                    className="icon-input"
                                    type="radio"
                                    id={f + '-filter'}
                                    name={f + '-filter'}
                                    value={f}
                                    onChange={handleFilterTypeChange}
                                    checked={f === filterType}
                                />
                                <span>{FilterLabel[f]}</span>
                            </label>
                        );
                    })}
                    <hr className={styles.divider} />
                    <div className={styles.iconContainer}>
                        <FilterIconComponent filter={filterType} />
                    </div>
                </div>

                <div className="column-3">
                    <SliderComponent
                        name="frequency"
                        minValue={DefaultParams.filterMin}
                        maxValue={DefaultParams.filterMax}
                        value={frequency}
                        onChange={handleFrequencyChange}
                        defaultValue={DefaultParams.filter}
                        step={100}
                    />
                </div>
                <div className="column-3">
                    <SliderComponent
                        name="quality factor"
                        minValue={DefaultParams.qualityFactorMin}
                        maxValue={DefaultParams.qualityFactorMax}
                        value={filterQualityFactor}
                        onChange={handleFilterQualityFactorChange}
                        defaultValue={DefaultParams.qualityFactor}
                        step={0.1}
                    />
                </div>
            </div>
            <div className="columns bottom-labels text-center">
                <div className="column-3">
                    <label>{filterType}</label>
                </div>
                <div className="column-3">
                    <label>{frequency + ' Hz'}</label>
                </div>
                <div className="column-3">
                    <label>{`+${filterQualityFactor} db`}</label>
                </div>
            </div>
        </div>
    );
};

export default React.memo(FilterComponent);
