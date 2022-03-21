import { WaveformEnum } from '../models/WaveformEnum';
import { FilterTypeEnum } from '../models/FilterTypeEnum';

export const DefaultParams = {
    waveform: WaveformEnum.SAWTOOTH,
    filterType: FilterTypeEnum.ALLPASS,

    detune: 0,
    detuneMin: -100,
    detuneMax: 100,

    attack: 0.1,
    decay: 0.1,
    release: 0.3,
    sustain: 1.0,
    adsrMin: 0,
    adsrMax: 1,

    gain: 0.5,
    gainMin: 0,
    gainMax: 1,

    filter: 1000,
    filterMin: 50,
    filterMax: 10000,

    delayTime: 0.4,
    delayFeedback: 0.2,
    delayTimeMin: 0,
    delayTimeMax: 1,
    delayFeedbackMin: 0,
    delayFeedbackMax: 1,

    qualityFactor: 0,
    qualityFactorMin: 0,
    qualityFactorMax: 10,
};
