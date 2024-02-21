import { ADSRModel } from './ADSRModel';

export interface SynthParametersModel {
    // todo extract to OscillatorParams
    firstOscillatorWaveForm: OscillatorType;
    firstOscillatorDetune: number;

    secondOscillatorWaveForm: OscillatorType;
    secondOscillatorDetune: number;

    adsr: ADSRModel;
    envelope: string;
}

export interface OscillatorParams {
    name: string;
    waveForm: OscillatorType;
    detune: number;
}
