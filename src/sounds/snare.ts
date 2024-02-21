import { MutableRefObject } from 'react';
import { SynthEngineModel } from '../models/SynthEngineModel';
import { FilterTypeEnum } from '../models/FilterTypeEnum';
import { InstrumentModel } from '../models/InstrumentModel';

export class Snare implements InstrumentModel {
    private synthEngine: MutableRefObject<SynthEngineModel>;
    public tone: number;
    public decay: number;
    private noise: AudioBufferSourceNode;
    private noiseEnvelope: GainNode;
    private osc: OscillatorNode;
    private oscEnvelope: GainNode;
    public volume: number;

    constructor(synthEngine: MutableRefObject<SynthEngineModel>) {
        this.synthEngine = synthEngine;
        this.tone = 100;
        this.decay = 0.2;
        this.volume = 1;
        this.noise = this.synthEngine.current.audioContext.createBufferSource();
        this.noise.buffer = this.noiseBuffer();

        const noiseFilter = this.synthEngine.current.audioContext.createBiquadFilter();
        noiseFilter.type = FilterTypeEnum.HIGHPASS;
        noiseFilter.frequency.value = 1000;
        this.noise.connect(noiseFilter);

        this.noiseEnvelope = this.synthEngine.current.audioContext.createGain();
        noiseFilter.connect(this.noiseEnvelope);

        this.noiseEnvelope.connect(synthEngine.current.limiter);

        this.osc = this.synthEngine.current.audioContext.createOscillator();
        this.osc.type = 'triangle';

        this.oscEnvelope = this.synthEngine.current.audioContext.createGain();
        this.osc.connect(this.oscEnvelope);
        this.oscEnvelope.connect(synthEngine.current.limiter);
    }

    noiseBuffer() {
        var bufferSize = this.synthEngine.current.audioContext.sampleRate;
        var buffer = this.synthEngine.current.audioContext.createBuffer(
            1,
            bufferSize,
            this.synthEngine.current.audioContext.sampleRate
        );
        var output = buffer.getChannelData(0);

        for (var i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        return buffer;
    }

    trigger(time: number) {
        this.noiseEnvelope.gain.setValueAtTime(this.volume, time);
        this.noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, time + this.decay);
        this.noise.start(time);

        this.osc.frequency.setValueAtTime(this.tone, time);
        this.oscEnvelope.gain.setValueAtTime(0.7 * this.volume, time);
        this.oscEnvelope.gain.exponentialRampToValueAtTime(0.01 * this.volume, time + this.decay / 2);
        this.osc.start(time);

        this.osc.stop(time + this.decay);
        this.noise.stop(time + this.decay);
    }
}
