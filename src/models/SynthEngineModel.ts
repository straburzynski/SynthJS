export interface SynthEngineModel {
    audioContext: AudioContext;
    vcoArray: OscillatorNode[];
    vca: GainNode;
    filter: BiquadFilterNode;
    delayNode: DelayNode;
    delayFeedback: GainNode;
    masterVca: GainNode;
    analyserNode: AnalyserNode;
    analyserData: Uint8Array;
}
