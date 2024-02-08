export interface SynthParametersModel {
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
