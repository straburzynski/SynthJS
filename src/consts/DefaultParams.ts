import { WaveformEnum } from '../models/WaveformEnum';
import { FilterTypeEnum } from '../models/FilterTypeEnum';

const oscillators = 2;

export const DefaultParams = {
    primaryWaveform: WaveformEnum.SAWTOOTH,
    secondaryWaveform: WaveformEnum.SQUARE,
    filterType: FilterTypeEnum.LOWPASS,

    detune: 0,
    detuneMin: -100,
    detuneMax: 100,

    attack: 0.01,
    decay: 0.5,
    release: 0.3,
    sustain: 1.0,

    adsrMin: 0,
    adsrMax: 1,

    gain: 0.5,
    gainMin: 0,
    gainMax: 1 / oscillators,

    masterVcaGain: 0.7,
    masterVcaGainMin: 0,
    masterVcaGainMax: 1,

    lfoWaveform: WaveformEnum.SINE,

    lfoGain: 0,
    lfoGainMin: 0,
    lfoGainMax: 5000,

    lfoFrequency: 1,
    lfoFrequencyMin: 0.1,
    lfoFrequencyMax: 20,

    filter: 2000,
    filterMin: 50,
    filterMax: 10000,

    distortion: 5,
    distortionMin: 0,
    distortionMax: 40,

    delayTime: 0.4,
    delayTimeMin: 0,
    delayTimeMax: 1,

    delayFeedback: 0.2,
    delayFeedbackMin: 0,
    delayFeedbackMax: 1,

    reverbLength: 2,
    reverbLengthMin: 0.1,
    reverbLengthMax: 5,

    reverbGain: 0.3,
    reverbGainMin: 0,
    reverbGainMax: 1,

    qualityFactor: 0,
    qualityFactorMin: 0,
    qualityFactorMax: 20,
};
