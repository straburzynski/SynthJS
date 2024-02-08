export interface SynthParametersModel {
    // todo extract to OscillatorParams
    firstOscillatorWaveForm: OscillatorType;
    firstOscillatorDetune: number;

    secondOscillatorWaveForm: OscillatorType;
    secondOscillatorDetune: number;

    attack: number;
    decay: number;
    sustain: number;
    release: number;

    envelope: string;
}

export interface OscillatorParams {
    name: string;
    waveForm: OscillatorType;
    detune: number;
}
