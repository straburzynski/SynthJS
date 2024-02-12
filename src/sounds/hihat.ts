import { MutableRefObject } from 'react';
import { SynthEngineModel } from '../models/SynthEngineModel';
import { FilterTypeEnum } from '../models/FilterTypeEnum';
import { WaveformEnum } from '../models/WaveformEnum';
import { Instrument } from '../models/Instrument';

export class HiHat implements Instrument {
    private synthEngine: MutableRefObject<SynthEngineModel>;
    private ratios: number[];
    public tone: number;
    public decay: number;
    private oscEnvelope: GainNode;
    private bandPass: BiquadFilterNode;
    private highPass: BiquadFilterNode;
    public volume: number;
    public fxAmount: number;
    private panner: StereoPannerNode;

    constructor(synthEngine: MutableRefObject<SynthEngineModel>, open: boolean) {
        this.synthEngine = synthEngine;
        this.ratios = [1, 1.342, 1.2312, 1.6532, 1.9523, 2.1523];
        this.tone = 130.81;
        this.decay = open ? 1.5 : 0.5;
        this.volume = 1;
        this.fxAmount = 0;

        this.oscEnvelope = this.synthEngine.current.audioContext.createGain();

        this.bandPass = this.synthEngine.current.audioContext.createBiquadFilter();
        this.bandPass.type = FilterTypeEnum.BANDPASS;
        this.bandPass.frequency.value = 20000;
        this.bandPass.Q.value = 0.2;

        this.highPass = this.synthEngine.current.audioContext.createBiquadFilter();
        this.highPass.type = FilterTypeEnum.HIGHPASS;
        this.highPass.frequency.value = 5000;
        this.panner = this.synthEngine.current.audioContext.createStereoPanner();

        this.bandPass.connect(this.highPass);
        this.highPass.connect(this.oscEnvelope);
        this.oscEnvelope.connect(this.panner);
        this.panner.connect(this.synthEngine.current.audioContext.destination);
    }

    trigger(time: number) {
        this.panner.pan.value = (Math.cos(time * 4) * this.fxAmount) / 100;
        this.ratios.forEach((ratio) => {
            const osc = this.synthEngine.current.audioContext.createOscillator();
            osc.type = WaveformEnum.SQUARE;
            osc.frequency.value = this.tone * ratio;
            osc.connect(this.bandPass);
            osc.start(time);
            osc.stop(time + this.decay);
        });
        this.oscEnvelope.gain.setValueAtTime(0.00001 * this.volume, time);
        this.oscEnvelope.gain.exponentialRampToValueAtTime(0.3 * this.volume, time + 0.01 * this.decay);
        this.oscEnvelope.gain.exponentialRampToValueAtTime(0.2 * this.volume, time + 0.1 * this.decay);
        this.oscEnvelope.gain.exponentialRampToValueAtTime(0.00001 * this.volume, time + this.decay);
    }
}
