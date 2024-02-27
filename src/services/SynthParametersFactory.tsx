import { SynthParametersModel } from '../models/SynthParametersModel';
import { DefaultParams, getDefaultWaveForm } from '../consts/DefaultParams';
import { namesOfOscillators } from './SynthEngineFactory';

export const createSynthParameters = (): SynthParametersModel => {
    const oscillatorsParams = new Map(
        namesOfOscillators.map((osc) => [
            osc,
            {
                waveForm: getDefaultWaveForm(osc),
                detune: DefaultParams.detune,
            },
        ])
    );

    return {
        oscillatorsParams: oscillatorsParams,
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
