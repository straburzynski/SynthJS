import { MutableRefObject } from 'react';
import { SynthEngineModel } from '../models/SynthEngineModel';
import { WaveformEnum } from '../models/WaveformEnum';
import { Instrument } from '../models/Instrument';
import { FilterTypeEnum } from '../models/FilterTypeEnum';

export class Crash implements Instrument {
    private synthEngine: MutableRefObject<SynthEngineModel>;
    private ratios: number[];
    public tone: number;
    public decay: number;
    private noise: AudioBufferSourceNode;
    private noiseEnvelope: GainNode;
    private noiseFilter: BiquadFilterNode;
    private oscEnvelope: GainNode;
    private bndPass: BiquadFilterNode;
    private highpass: BiquadFilterNode;
    public volume: number;

    constructor(synthEngine: MutableRefObject<SynthEngineModel>) {
        this.synthEngine = synthEngine;
        this.ratios = [0.2312, 1.6532, 0.9523, 2.1523, 1];
        this.tone = 150;
        this.decay = 3;
        this.volume = 1;

        this.noise = this.synthEngine.current.audioContext.createBufferSource();
        this.noise.buffer = this.noiseBuffer();
        this.noiseEnvelope = this.synthEngine.current.audioContext.createGain();
        this.noiseFilter = this.synthEngine.current.audioContext.createBiquadFilter();
        this.noiseFilter.type = FilterTypeEnum.HIGHPASS;
        this.noiseFilter.frequency.value = 2000;
        this.oscEnvelope = this.synthEngine.current.audioContext.createGain();
        this.bndPass = this.synthEngine.current.audioContext.createBiquadFilter();
        this.bndPass.type = FilterTypeEnum.BANDPASS;
        this.bndPass.frequency.value = 20000;
        this.bndPass.Q.value = 0.2;
        this.highpass = this.synthEngine.current.audioContext.createBiquadFilter();
        this.highpass.type = FilterTypeEnum.HIGHPASS;
        this.highpass.frequency.value = 5000;
        this.noise.connect(this.noiseFilter);
        this.noiseFilter.connect(this.noiseEnvelope);

        this.bndPass.connect(this.highpass);
        this.highpass.connect(this.oscEnvelope);
        this.noiseEnvelope.connect(this.synthEngine.current.audioContext.destination);
        this.oscEnvelope.connect(this.synthEngine.current.audioContext.destination);
    }

    noiseBuffer(): AudioBuffer {
        const bufferSize = this.synthEngine.current.audioContext.sampleRate;
        const buffer = this.synthEngine.current.audioContext.createBuffer(
            1,
            bufferSize,
            this.synthEngine.current.audioContext.sampleRate
        );
        const output = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        return buffer;
    }

    trigger(time: number) {
        this.ratios.forEach((ratio) => {
            const osc = this.synthEngine.current.audioContext.createOscillator();
            osc.type = WaveformEnum.SQUARE;
            osc.frequency.value = this.tone * ratio;
            osc.connect(this.bndPass);
            osc.start(time);
            osc.stop(time + this.decay);
        });
        this.oscEnvelope.gain.setValueAtTime(0.00001 * this.volume, time);
        this.oscEnvelope.gain.exponentialRampToValueAtTime(0.4 * this.volume, time + 0.01);
        this.oscEnvelope.gain.exponentialRampToValueAtTime(0.3 * this.volume, time + 0.1 * this.decay);
        this.oscEnvelope.gain.exponentialRampToValueAtTime(0.00001 * this.volume, time + this.decay);
    }
}
