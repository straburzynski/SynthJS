import { ADSRModel } from './ADSRModel';

export interface SynthParametersModel {
    oscillatorsParams: Map<string, OscillatorParams>;
    adsr: ADSRModel;
    envelope: string;
}

export interface OscillatorParams {
    waveForm: OscillatorType;
    detune: number;
}
