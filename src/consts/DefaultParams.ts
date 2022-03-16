import { WaveformEnum } from '../models/WaveformEnum';
import { FilterTypeEnum } from '../models/FilterTypeEnum';

export const DefaultParams = {
    waveform: WaveformEnum.SAWTOOTH,
    filterType: FilterTypeEnum.ALLPASS,

    unisonWidth: 1,
    unisonWidthMin: 0,
    unisonWidthMax: 100,

    attack: 0.1,
    decay: 0.1,
    release: 0.3,
    sustain: 1.0,
    adsrMin: 0,
    adsrMax: 2,

    gain: 0.5,
    gainMin: 0,
    gainMax: 1,

    filter: 100,
    filterMin: 50,
    filterMax: 10000,

    qualityFactor: 0,
    qualityFactorMin: 0,
    qualityFactorMax: 10,
};
