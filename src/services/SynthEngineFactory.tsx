import { SynthEngineModel } from '../models/SynthEngineModel';
import { DefaultParams } from '../consts/DefaultParams';

const AudioContext = window.AudioContext || (window as any).webkitAudioContext;

export const createSynthEngine = (): SynthEngineModel => {
    // new context
    const audioContext = new AudioContext();
    audioContext.suspend();

    // create oscillators
    const oscWidthA = audioContext.createOscillator();
    oscWidthA.detune.value = DefaultParams.unisonWidth;
    const oscWidthB = audioContext.createOscillator();
    oscWidthB.detune.value = -DefaultParams.unisonWidth;
    let VCOs: OscillatorNode[] = [audioContext.createOscillator(), oscWidthA, oscWidthB];

    // create gain
    let VCA = audioContext.createGain();
    let filter = audioContext.createBiquadFilter();
    let masterVCA = audioContext.createGain();

    // configure filter
    filter.type = DefaultParams.filterType;
    filter.frequency.setTargetAtTime(2000, audioContext.currentTime, 0);
    filter.Q.value = DefaultParams.qualityFactor;

    //configure delay
    const delayNode = audioContext.createDelay(5);
    delayNode.delayTime.value = DefaultParams.delayTime;
    const delayFeedback = audioContext.createGain();
    delayFeedback.gain.value = DefaultParams.delayFeedback;

    // connect vco and filter
    VCOs.forEach((vco) => vco.connect(VCA));
    VCA.connect(filter);
    filter.connect(masterVCA);

    // connect delay
    filter.connect(delayNode);
    delayNode.connect(delayFeedback);
    delayFeedback.connect(filter);

    // set volume
    masterVCA.gain.value = DefaultParams.gain;
    VCA.gain.value = DefaultParams.gainMin;
    VCOs.forEach((vco) => vco.start());

    // analyser
    const analyser = audioContext.createAnalyser();
    analyser.smoothingTimeConstant = 0.5;
    analyser.fftSize = 1024;
    const analyserBufferLength = analyser.fftSize;

    // connect master volume
    masterVCA.connect(analyser);
    analyser.connect(audioContext.destination);

    return {
        audioContext: audioContext,
        vcoArray: VCOs,
        vca: VCA,
        filter: filter,
        delayNode: delayNode,
        delayFeedback: delayFeedback,
        masterVca: masterVCA,
        analyserNode: analyser,
        analyserData: new Uint8Array(analyserBufferLength),
    };
};
