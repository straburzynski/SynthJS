export interface SynthEngineModel {
    audioContext: AudioContext;
    primaryVco: OscillatorNode;
    secondaryVco: OscillatorNode;
    primaryAdsr: GainNode;
    secondaryAdsr: GainNode;
    primaryVca: GainNode;
    secondaryVca: GainNode;
    filter: BiquadFilterNode;
    distortion: WaveShaperNode;
    lfo1: OscillatorNode;
    lfo1Gain: GainNode;
    lfo2: OscillatorNode;
    lfo2Gain: GainNode;
    delayNode: DelayNode;
    delayFeedback: GainNode;
    reverbNode: ConvolverNode;
    reverbGain: GainNode;
    masterVca: GainNode;
    analyserNode: AnalyserNode;
    analyserData: Uint8Array;
}
