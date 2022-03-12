import React, { useEffect, useRef, useState } from 'react';
import VolumeComponent from './components/volume-component/VolumeComponent';
import { WaveformEnum } from './models/WaveformEnum';
import KeysComponent from './components/KeyboardCompnent/KeysComponent';
import { NOTES } from './models/Notes';
import AdsrComponent from './components/AdsrComponent/AdsrComponent';
import './App.css';

const AudioContext = window.AudioContext || (window as any).webkitAudioContext;

function App() {
    const audioContextRef = useRef<any>();
    const vcoRef = useRef<any>();
    const vcaRef = useRef<any>();
    const lfoRef = useRef<any>();
    const masterVcaRef = useRef<any>();

    const [waveform, setWaveform] = useState<OscillatorType>(WaveformEnum.SINE);

    const [attack, setAttack] = useState<number>(0.1);
    const [decay, setDecay] = useState<number>(0.1);
    const [release, setRelease] = useState<number>(0.1);
    const [sustain, setSustain] = useState<number>(1);

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
        masterVCA.gain.value = 0.5;
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

            <br />
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
            <br />
            <hr />
            <AdsrComponent
                attack={attack}
                onHandleAttackChange={handleAttackChange}
                decay={decay}
                onHandleDecayChange={handleDecayChange}
                sustain={sustain}
                onHandleSustainChange={handleSustainChange}
                release={release}
                onHandleReleaseChange={handleReleaseChange}
            />
            <br />
            <hr />
            <VolumeComponent name={'Master value'} volumeNode={masterVcaRef} />
            <hr />
        </div>
    );
}

export default App;
