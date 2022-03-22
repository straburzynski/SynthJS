export interface SynthEngineModel {
    audioContext: AudioContext;
    primaryVco: OscillatorNode;
    secondaryVco: OscillatorNode;
    primaryAdsr: GainNode;
    secondaryAdsr: GainNode;
    primaryVca: GainNode;
    secondaryVca: GainNode;
    filter: BiquadFilterNode;
    delayNode: DelayNode;
    delayFeedback: GainNode;
    masterVca: GainNode;
    analyserNode: AnalyserNode;
    analyserData: Uint8Array;
}
