import React, { useEffect, useRef, useState } from 'react';
import VolumeComponent from './components/volume-component/VolumeComponent';
import { WaveformEnum } from './models/WaveformEnum';
import KeysComponent from './components/KeyboardCompnent/KeysComponent';
import { NOTES } from './models/Notes';
import AdsrComponent from './components/AdsrComponent/AdsrComponent';
import { DefaultParams } from './models/DefaultParams';
import './App.css';

const AudioContext = window.AudioContext || (window as any).webkitAudioContext;

function App() {
    const audioContextRef = useRef<AudioContext | any>();
    const vcoRefArray = useRef<OscillatorNode[] | any>();
    const vcaRef = useRef<any>();
    const masterVcaRef = useRef<GainNode>();

    const [waveform, setWaveform] = useState<OscillatorType>(WaveformEnum.SAWTOOTH);
    const [unisonWidth, setUnisonWidth] = useState<number>(DefaultParams.unisonWidth);

    const [attack, setAttack] = useState<number>(DefaultParams.attack);
    const [decay, setDecay] = useState<number>(DefaultParams.decay);
    const [release, setRelease] = useState<number>(DefaultParams.release);
    const [sustain, setSustain] = useState<number>(DefaultParams.sustain);

    useEffect(() => {
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
        let masterVCA = audioContext.createGain();

        // connect modules
        VCOs.forEach((vco) => vco.connect(VCA));
        VCA.connect(masterVCA);
        masterVCA.connect(audioContext.destination);

        // set volume
        masterVCA.gain.value = DefaultParams.gain;
        VCA.gain.value = DefaultParams.gainMin;
        VCOs.forEach((vco) => vco.start());

        audioContextRef.current = audioContext;
        masterVcaRef.current = masterVCA;
        vcoRefArray.current = VCOs;
        vcaRef.current = VCA;
    }, []);

    const handleKey = (e: any, note: string) => {
        audioContextRef.current?.resume();
        switch (e.type) {
            case 'mousedown':
                vcoRefArray.current?.forEach((vco: OscillatorNode) => {
                    vco.type = waveform;
                    vco.frequency.setValueAtTime(NOTES[note], 0);
                });
                vcaRef.current.gain.value = 1;
                envelopeOn(vcaRef.current.gain, attack, decay, sustain);
                break;
            case 'mouseup':
                vcoRefArray.current?.forEach((vco: OscillatorNode) => (vco.type = waveform));
                envelopeOff(vcaRef.current.gain, release);
                break;
        }
    };

    function envelopeOn(vcaGain: AudioParam, a: number, d: number, s: number) {
        const now = audioContextRef.current.currentTime;
        vcaGain.cancelScheduledValues(0);
        vcaGain.setValueAtTime(0, now);
        vcaGain.linearRampToValueAtTime(1, now + a);
        vcaGain.linearRampToValueAtTime(s, now + a + d);
    }

    function envelopeOff(vcaGain: AudioParam, r: number) {
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
        setWaveform(selectedWaveform);
    };

    const handleUnisonWidthChange = (event: any) => {
        const width: number = event.target.valueAsNumber;
        console.log('width: ', width);
        vcoRefArray.current[1].detune.value = unisonWidth;
        vcoRefArray.current[2].detune.value = -unisonWidth;
        setUnisonWidth(width);
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
            <input
                type="range"
                id="unison-width-control"
                name="unison-width-control"
                min={DefaultParams.unisonWidthMin}
                max={DefaultParams.unisonWidthMax}
                value={unisonWidth}
                onChange={handleUnisonWidthChange}
            />
            <label htmlFor="unison-width-control">Unison width: {unisonWidth}</label>
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
