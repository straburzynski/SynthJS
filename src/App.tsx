import React, { useEffect, useRef, useState } from 'react';
import VolumeComponent from './components/volume-component/VolumeComponent';
import { WaveformEnum } from './models/WaveformEnum';
import './App.css';
import FrequencyComponent from './components/frequency-component/FrequencyComponent';

const AudioContext = window.AudioContext || (window as any).webkitAudioContext;

function App() {
    const audioContextRef = useRef<any>();
    const lfoRef = useRef<any>();
    const vcaRef = useRef<any>();

    const [playing, setPlaying] = useState(false);
    const [waveform, setWaveform] = useState<OscillatorType>(WaveformEnum.SINE);
    const [attack, setAttack] = useState<number>(0.3);
    const [release, setRelease] = useState<number>(0.3);
    const [sustain, setSustain] = useState<number>(0.8);
    const [noteLength, setNoteLength] = useState<number>(1);
    const [frequency, setFrequency] = useState<number>(440);
    const [synthesizerActive, setSynthesizerActive] = useState<boolean>(false);

    useEffect(() => {
        // new context
        const audioContext = new AudioContext();
        // VCA - gain node
        let VCA = audioContext.createGain();
        audioContext.suspend();
        // connect
        VCA.connect(audioContext.destination);
        audioContextRef.current = audioContext;
        vcaRef.current = VCA;
    }, []);

    const toggleSynthesizer = () => {
        if (synthesizerActive) {
            audioContextRef.current.suspend();
        } else {
            audioContextRef.current.resume();
        }
        setSynthesizerActive((active) => !active);
    };
    const toggleOscillator = () => {
        if (playing) {
            lfoRef.current.stop();
        } else {
            // LFO - oscillator node
            let LFO = audioContextRef.current.createOscillator();
            LFO.type = waveform;
            // LFO.frequency.value = 440;
            LFO.connect(vcaRef.current);
            lfoRef.current = LFO;
            lfoRef.current.start();
        }
        setPlaying((play) => !play);
    };

    const createOscillator = () => {
        const osc = audioContextRef.current.createOscillator();
        const noteGain = audioContextRef.current.createGain();
        noteGain.gain.setValueAtTime(0, 0);
        noteGain.gain.linearRampToValueAtTime(sustain, audioContextRef.current.currentTime + noteLength * attack);
        noteGain.gain.setValueAtTime(sustain, audioContextRef.current.currentTime + noteLength - noteLength * release);
        noteGain.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + noteLength);

        osc.type = waveform;
        osc.frequency.setValueAtTime(600, 0);
        osc.start(0);
        osc.stop(audioContextRef.current.currentTime + 1);
        osc.connect(noteGain);
        noteGain.connect(audioContextRef.current.destination);
    };

    const handleAttackChange = (event: any) => {
        const changedAttack: number = event.target.valueAsNumber;
        console.log('attack: ', changedAttack);
        setAttack(changedAttack);
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
            <button onClick={toggleSynthesizer}>
                <span>{synthesizerActive ? 'On' : 'Off'}</span>
            </button>
            <div>
                <br />
                <button onClick={toggleOscillator} disabled={!synthesizerActive}>
                    <span>{playing ? 'Pause' : 'Play'}</span>
                </button>
                <button onClick={createOscillator} disabled={!synthesizerActive}>
                    <span>Play one</span>
                </button>
                <br />
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
                <label htmlFor="attack-control">Attack Time</label>

                <br />
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
                <label htmlFor="release-control">Release Time</label>
                <br />
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
                <label htmlFor="sustain-control">Sustain Time</label>
                <br />
                <hr />
                <FrequencyComponent name={'frequency'} nodeRef={lfoRef} />
                <hr />
                <VolumeComponent name={'main value'} gainNode={vcaRef} />
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
