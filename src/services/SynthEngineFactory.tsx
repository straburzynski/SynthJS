import { SynthEngineModel } from '../models/SynthEngineModel';
import { DefaultParams } from '../consts/DefaultParams';
import { WaveformEnum } from '../models/WaveformEnum';
import { createImpulseResponse } from './ImpulseResponseGenerator';

const AudioContext = window.AudioContext || (window as any).webkitAudioContext;

const audioContext = new AudioContext({
    latencyHint: 'interactive',
    sampleRate: 44100,
});

export const createSynthEngine = (): SynthEngineModel => {
    // create oscillators
    const primaryVco = audioContext.createOscillator();
    const secondaryVco = audioContext.createOscillator();

    // create adsr's and vca's
    let primaryAdsr = audioContext.createGain();
    let secondaryAdsr = audioContext.createGain();
    let primaryVca = audioContext.createGain();
    let secondaryVca = audioContext.createGain();

    // create filter
    let filter = audioContext.createBiquadFilter();

    // create distortion
    const distortion = audioContext.createWaveShaper()

    // create analyser
    const analyser = audioContext.createAnalyser();

    // create master volume
    let masterVca = audioContext.createGain();

    // create filter lfo
    const lfo1 = audioContext.createOscillator();
    const lfo1Gain = audioContext.createGain();
    const lfo2 = audioContext.createOscillator();
    const lfo2Gain = audioContext.createGain();

    // create reverb
    const reverbNode = audioContext.createConvolver();
    const reverbGain = audioContext.createGain();
    reverbGain.gain.value = DefaultParams.reverbGain;
    reverbNode.buffer = createImpulseResponse(audioContext, 2, 2, false);
    reverbNode.normalize = true;

    // configure filter lfo
    lfo1.type = WaveformEnum.SINE;
    lfo1.frequency.value = DefaultParams.lfoFrequency;
    lfo1.start();
    lfo1Gain.gain.value = DefaultParams.lfoGain;

    lfo2.type = WaveformEnum.SQUARE;
    lfo2.frequency.value = DefaultParams.lfoFrequency;
    lfo2.start();
    lfo2Gain.gain.value = DefaultParams.lfoGain;

    // configure filter
    filter.type = DefaultParams.filterType;
    filter.frequency.value = DefaultParams.filter;
    filter.Q.value = DefaultParams.qualityFactor;
    filter.gain.value = 0;

    // configure delay
    const delayNode = audioContext.createDelay(5);
    delayNode.delayTime.value = DefaultParams.delayTime;
    const delayFeedback = audioContext.createGain();
    delayFeedback.gain.value = DefaultParams.delayFeedback;

    // configure analyser
    analyser.smoothingTimeConstant = 0.5;
    analyser.fftSize = 512;
    const analyserBufferLength = analyser.fftSize;

    const limiter = audioContext.createDynamicsCompressor();
    limiter.threshold.setValueAtTime(-2, audioContext.currentTime);
    limiter.knee.setValueAtTime(0, audioContext.currentTime);
    limiter.ratio.setValueAtTime(20, audioContext.currentTime);
    limiter.attack.setValueAtTime(0.005, audioContext.currentTime);
    limiter.release.setValueAtTime(0.25, audioContext.currentTime);

    // set master volume
    masterVca.gain.value = DefaultParams.gain;

    // connect nodes
    primaryAdsr.connect(primaryVca).connect(filter);
    secondaryAdsr.connect(secondaryVca).connect(filter);
    filter.connect(delayNode).connect(delayFeedback).connect(filter); // delay
    lfo1.connect(lfo1Gain).connect(filter.detune);
    lfo2.connect(lfo2Gain).connect(masterVca.gain);
    filter.connect(distortion).connect(masterVca).connect(limiter).connect(analyser).connect(audioContext.destination);

    masterVca.connect(reverbGain).connect(reverbNode).connect(limiter); // reverb

    // start oscillators
    primaryVco.start();
    secondaryVco.start();

    return {
        audioContext: audioContext,
        primaryVco: primaryVco,
        secondaryVco: secondaryVco,
        primaryAdsr: primaryAdsr,
        secondaryAdsr: secondaryAdsr,
        primaryVca: primaryVca,
        secondaryVca: secondaryVca,
        filter: filter,
        distortion: distortion,
        reverbNode: reverbNode,
        reverbGain: reverbGain,
        lfo1: lfo1,
        lfo1Gain: lfo1Gain,
        lfo2: lfo2,
        lfo2Gain: lfo2Gain,
        delayNode: delayNode,
        delayFeedback: delayFeedback,
        masterVca: masterVca,
        analyserNode: analyser,
        analyserData: new Uint8Array(analyserBufferLength),
    };
};
