import React, { FC, useState } from 'react';
import { AVAILABLE_FILTERS } from '../../consts/AvailableFilters';
import { DefaultParams } from '../../consts/DefaultParams';
import { SynthEngineModel } from '../../models/SynthEngineModel';
import styles from '../LfoComponent/LfoComponent.module.scss';
import SliderComponent from '../shared/SliderComponent/SliderComponent';
import { FilterTypeEnum } from '../../models/FilterTypeEnum';
import { StringIndex } from '../../types';

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

    const handleFilterTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFilterType = event.target.value as BiquadFilterType;
        console.log('filter type: ', selectedFilterType);
        synthEngine.current.filter.type = selectedFilterType;
        setFilterType(selectedFilterType);
    };

    const handleFrequencyChange = (value: number) => {
        console.log('filter frequency change: ', value);
        setFrequency(value);
        synthEngine.current.filter.frequency.value = value;
    };

    const handleFilterQualityFactorChange = (value: number) => {
        console.log('filter Q: ', value);
        synthEngine.current.filter.Q.value = value;
        setFilterQualityFactor(value);
    };

    return (
        <div className="component-wrapper">
            <p className="title">Filter</p>
            <div className="columns">
                <div className={`${styles.leftColumn} ${styles.verticalContainer} flex-50`}>
                    {Object.values(AVAILABLE_FILTERS).map((f, i) => {
                        return (
                            <label htmlFor={f + '-filter'} className={styles.iconLabel} key={i}>
                                <input
                                    className={styles.iconInput}
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
                </div>
                <div className={`${styles.columnVolume} flex-100`}>
                    <div className="columns vertical-fader-scale">
                        <div className="column-2">
                            <SliderComponent
                                mode="vertical"
                                name="frequency"
                                minValue={DefaultParams.filterMin}
                                maxValue={DefaultParams.filterMax}
                                value={frequency}
                                onChange={handleFrequencyChange}
                                defaultValue={DefaultParams.filter}
                                step={1}
                            />
                        </div>
                        <div className="column-2">
                            <SliderComponent
                                mode="vertical"
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
                    <div className={'columns ' + styles.textCenter}>
                        <div className="column-2">
                            <label htmlFor="attack-control">
                                freq:
                                <br /> {frequency + ' Hz'}
                            </label>
                        </div>
                        <div className="column-2">
                            <label htmlFor="decay-control">
                                gain:
                                <br /> {`+${filterQualityFactor} db`}
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterComponent;
