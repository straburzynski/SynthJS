import { SynthEngineModel } from '../models/SynthEngineModel';
import { MutableRefObject } from 'react';
import { Instrument } from '../models/Instrument';

export class Kick implements Instrument {
    private synthEngine: MutableRefObject<SynthEngineModel>;
    public tone: number;
    public decay: number;
    private osc: OscillatorNode;
    private gain: GainNode;

    constructor(synthEngine: MutableRefObject<SynthEngineModel>) {
        this.synthEngine = synthEngine;
        this.tone = 150;
        this.decay = 0.5;
        this.osc = this.synthEngine.current.audioContext.createOscillator();
        this.gain = this.synthEngine.current.audioContext.createGain();
        this.osc.connect(this.gain);
        this.gain.connect(this.synthEngine.current.limiter);
    }

    trigger(time: number) {
        this.osc.frequency.setValueAtTime(this.tone, time + 0.001);
        this.osc.frequency.exponentialRampToValueAtTime(1, time + this.decay);
        this.gain.gain.linearRampToValueAtTime(1, time + 0.1);
        this.gain.gain.exponentialRampToValueAtTime(0.01, time + this.decay);
        this.gain.gain.linearRampToValueAtTime(0, time + this.decay + 0.1);
        this.osc.start(time);
        this.osc.stop(time + this.decay + 0.1);
    }
}
