export interface SynthEngineModel {
    audioContext: AudioContext;
    oscillatorsGroup: Map<string, OscillatorNodeGroup>;
    filter: BiquadFilterNode;
    limiter: DynamicsCompressorNode;
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

export interface OscillatorNodeGroup {
    vcoNode: OscillatorNode;
    adsrNode: GainNode;
    vcaNode: GainNode;
}
