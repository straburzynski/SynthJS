import { SynthEngineModel } from '../models/SynthEngineModel';
import { DefaultParams } from '../consts/DefaultParams';

const AudioContext = window.AudioContext || (window as any).webkitAudioContext;

export const createSynthEngine = (): SynthEngineModel => {
    // new context
    const audioContext = new AudioContext();
    audioContext.suspend();

    // create oscillators
    const primaryVco = audioContext.createOscillator();
    const secondaryVco = audioContext.createOscillator();
    // todo: create primary and secondary detune

    // todo: create vca after adsr
    // create adsr
    let primaryVca = audioContext.createGain();
    let secondaryVca = audioContext.createGain();

    let filter = audioContext.createBiquadFilter();
    let masterVca = audioContext.createGain();

    // configure filter
    filter.type = DefaultParams.filterType;
    filter.frequency.setTargetAtTime(DefaultParams.filter, audioContext.currentTime, 0);
    filter.Q.value = DefaultParams.qualityFactor;

    //configure delay
    const delayNode = audioContext.createDelay(5);
    delayNode.delayTime.value = DefaultParams.delayTime;
    const delayFeedback = audioContext.createGain();
    delayFeedback.gain.value = DefaultParams.delayFeedback;

    // connect vco, vca and filter
    primaryVco.connect(primaryVca).connect(filter);
    secondaryVco.connect(secondaryVca).connect(filter);
    filter.connect(masterVca);

    // connect delay
    filter.connect(delayNode);
    delayNode.connect(delayFeedback);
    delayFeedback.connect(filter);

    // set volume
    masterVca.gain.value = DefaultParams.gain;
    primaryVca.gain.value = DefaultParams.gainMin;
    secondaryVca.gain.value = DefaultParams.gainMin;
    primaryVco.start();
    secondaryVco.start();

    // analyser
    const analyser = audioContext.createAnalyser();
    analyser.smoothingTimeConstant = 0.5;
    analyser.fftSize = 1024;
    const analyserBufferLength = analyser.fftSize;

    // connect master volume
    masterVca.connect(analyser);
    analyser.connect(audioContext.destination);

    return {
        audioContext: audioContext,
        primaryVco: primaryVco,
        secondaryVco: secondaryVco,
        primaryVca: primaryVca,
        secondaryVca: secondaryVca,
        filter: filter,
        delayNode: delayNode,
        delayFeedback: delayFeedback,
        masterVca: masterVca,
        analyserNode: analyser,
        analyserData: new Uint8Array(analyserBufferLength),
    };
};
