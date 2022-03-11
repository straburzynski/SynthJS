import React, { useEffect, useRef, useState } from 'react';
import VolumeComponent from './components/volume-component/VolumeComponent';
import { WaveformEnum } from './models/WaveformEnum';
import FrequencyComponent from './components/frequency-component/FrequencyComponent';
import './App.css';
import KeysComponent from './components/keys/KeysComponent';
import { NOTES } from './models/Notes';

const AudioContext = window.AudioContext || (window as any).webkitAudioContext;

function App() {
    const audioContextRef = useRef<any>();
    const vcoRef = useRef<any>();
    const vcaRef = useRef<any>();
    const lfoRef = useRef<any>();
    const masterVcaRef = useRef<any>();

    const [waveform, setWaveform] = useState<OscillatorType>(WaveformEnum.SINE);
    const [masterVolume, setMasterVolume] = useState<number>(0.5);

    const [attack, setAttack] = useState<number>(0.1);
    const [decay, setDecay] = useState<number>(0.1);
    const [release, setRelease] = useState<number>(0.1);
    const [sustain, setSustain] = useState<number>(1);

    const [frequency, setFrequency] = useState<number>(440);

    useEffect(() => {
        // new context
        const audioContext = new AudioContext();
        audioContext.suspend();

        // create osc and gain
        let VCO = audioContext.createOscillator();
        let VCA = audioContext.createGain();
        let masterVCA = audioContext.createGain();

        // connect modules
        VCO.connect(VCA);
        VCA.connect(masterVCA);
        masterVCA.connect(audioContext.destination);

        // set volume
        masterVCA.gain.value = masterVolume;
        VCA.gain.value = 0;
        VCO.start(0);

        audioContextRef.current = audioContext;
        masterVcaRef.current = masterVCA;
        vcoRef.current = VCO;
        vcaRef.current = VCA;
    }, []);

    const handleKey = (e: any, note: string) => {
        audioContextRef.current.resume();
        switch (e.type) {
            case 'mousedown':
                vcoRef.current.type = waveform;
                vcoRef.current.frequency.setValueAtTime(NOTES[note], 0);
                vcaRef.current.gain.value = 1;
                envelopeOn(vcaRef.current.gain, attack, decay, sustain);
                break;
            case 'mouseup':
                vcoRef.current.type = waveform;
                envelopeOff(vcaRef.current.gain, release);
                break;
        }
    };

    function envelopeOn(vcaGain: any, a: number, d: number, s: number) {
        const now = audioContextRef.current.currentTime;
        vcaGain.cancelScheduledValues(0);
        vcaGain.setValueAtTime(0, now);
        vcaGain.linearRampToValueAtTime(1, now + a);
        vcaGain.linearRampToValueAtTime(s, now + a + d);
    }

    function envelopeOff(vcaGain: any, r: number) {
        const now = audioContextRef.current.currentTime;
        vcaGain.cancelScheduledValues(0);
        vcaGain.setValueAtTime(vcaGain.value, now);
        vcaGain.linearRampToValueAtTime(0, now + r);
    }

    const handleFrequencyChange = (value: number) => {
        console.log('update freq', value);
        if (lfoRef.current) {
            lfoRef.current.frequency.setValueAtTime(value, 0);
        }
        setFrequency(value);
    };

    const handleMasterVolumeChange = (value: number) => {
        console.log('master vol', value);
        masterVcaRef.current.gain.value = value;
        setMasterVolume(value);
    };

    const handleAttackChange = (event: any) => {
        const changedAttack: number = event.target.valueAsNumber;
        console.log('attack: ', changedAttack);
        setAttack(changedAttack);
    };

    const handleDecayChange = (event: any) => {
        const changedDecay: number = event.target.valueAsNumber;
        console.log('decay: ', changedDecay);
        setDecay(changedDecay);
    };

    const handleSustainChange = (event: any) => {
        const changedSustain: number = event.target.valueAsNumber;
        console.log('sustain: ', changedSustain);
        setSustain(changedSustain);
    };

    const handleReleaseChange = (event: any) => {
        const changedRelease: number = event.target.valueAsNumber;
        console.log('release: ', changedRelease);
        setRelease(changedRelease);
    };

    const handleWaveformChange = (event: any) => {
        const selectedWaveform: OscillatorType = event.target.value;
        console.log('waveform: ', selectedWaveform);
        if (lfoRef.current) {
            lfoRef.current.type = selectedWaveform;
        }
        setWaveform(selectedWaveform);
    };

    return (
        <div className="App">
            <br />
            <KeysComponent onHandleKey={handleKey} />

            <div>
                <br />
                <input
                    type="range"
                    id="attack-control"
                    name="attack-control"
                    min={0}
                    max={1}
                    step={0.05}
                    value={attack}
                    onChange={handleAttackChange}
                />
                <label htmlFor="attack-control">Attack Time: {attack}</label>
                <br />
                <input
                    type="range"
                    id="decay-control"
                    name="decay-control"
                    min={0}
                    max={1}
                    step={0.05}
                    value={decay}
                    onChange={handleDecayChange}
                />
                <label htmlFor="decay-control">Decay Time: {decay}</label>

                <br />
                <input
                    type="range"
                    id="release-control"
                    name="release-control"
                    min={0}
                    max={1}
                    step={0.05}
                    value={release}
                    onChange={handleReleaseChange}
                />
                <label htmlFor="release-control">Release Time: {release}</label>
                <br />
                <input
                    type="range"
                    id="sustain-control"
                    name="sustain-control"
                    min={0}
                    max={1}
                    step={0.05}
                    value={sustain}
                    onChange={handleSustainChange}
                />
                <label htmlFor="sustain-control">Sustain Time: {sustain}</label>
                <br />
                <hr />
                <FrequencyComponent
                    name={'Frequency'}
                    frequency={frequency}
                    onFrequencyChange={handleFrequencyChange}
                />
                <hr />
                <VolumeComponent
                    name={'Master value'}
                    volume={masterVolume}
                    onVolumeChange={handleMasterVolumeChange}
                />
                <hr />
                <p>Waveform select</p>
                {Object.values(WaveformEnum).map((w, i) => {
                    return (
                        <div key={i}>
                            <input
                                type="radio"
                                id={w + '-wave'}
                                name="waveform"
                                value={w}
                                onChange={handleWaveformChange}
                                checked={w === waveform}
                            />
                            <label htmlFor={w + '-wave'}>{w + ' wave'}</label>
                            <br />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default App;
