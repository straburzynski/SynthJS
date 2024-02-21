import { SynthParametersModel } from '../models/SynthParametersModel';
import { DefaultParams } from '../consts/DefaultParams';

export const createSynthParameters = (): SynthParametersModel => {
    return {
        firstOscillatorDetune: DefaultParams.detune,
        firstOscillatorWaveForm: DefaultParams.firstOscillatorWaveForm,

        secondOscillatorDetune: DefaultParams.detune,
        secondOscillatorWaveForm: DefaultParams.secondOscillatorWaveForm,

        adsr: {
            attack: DefaultParams.attack,
            decay: DefaultParams.decay,
            sustain: DefaultParams.sustain,
            release: DefaultParams.release,
        },
        // todo make enum
        envelope: 'env',
    };
};
