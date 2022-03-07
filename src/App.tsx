import React, { useEffect, useRef, useState } from 'react';
import VolumeComponent from './components/volume-component/VolumeComponent';
import { WaveformEnum } from './models/WaveformEnum';
import { randomValue } from './services/utils';
import './App.css';

const AudioContext = window.AudioContext || (window as any).webkitAudioContext;

function App() {
    const audioContextRef = useRef<any>();
    const lfoRef = useRef<any>();
    const vcaRef = useRef<any>();

    const [playing, setPlaying] = useState(false);
    const [waveform, setWaveform] = useState<OscillatorType>(WaveformEnum.SINE);

    useEffect(() => {
        // new context
        const audioContext = new AudioContext();

        // LFO - oscillator node
        let LFO = audioContext.createOscillator();
        LFO.type = waveform;
        LFO.frequency.value = 440;

        // VCA - gain node
        let VCA = audioContext.createGain();
        VCA.gain.value = randomValue();

        LFO.start();
        audioContext.suspend();

        // connect
        LFO.connect(VCA).connect(audioContext.destination);

        audioContextRef.current = audioContext;
        lfoRef.current = LFO;
        vcaRef.current = VCA;

        return () => LFO.disconnect(VCA);
    }, []);

    useEffect(() => {
        console.log('use effect on waveform: ', waveform);
        if (lfoRef.current) {
            lfoRef.current.type = waveform;
        }
    }, [waveform]);

    const toggleOscillator = () => {
        if (playing) {
            audioContextRef.current.suspend();
        } else {
            audioContextRef.current.resume();
        }
        setPlaying((play) => !play);
    };

    const handleWaveformChange = (event: any) => {
        const selectedWaveform: OscillatorType = event.target.value;
        setWaveform(selectedWaveform);
    };

    return (
        <div className='App'>
            <br />
            <button onClick={toggleOscillator}>
                <span>{playing ? 'Pause' : 'Play'}</span>
            </button>
            <br /><br />
            <hr />
            <VolumeComponent name={'main'} gainNode={vcaRef} />
            <hr />
            <p>Waveform select</p>
            {
                Object.values(WaveformEnum).map((w, i) => {
                    return (
                        <div key={i}>
                            <input
                                type='radio'
                                id={w + '-wave'}
                                name='waveform'
                                value={w}
                                onChange={handleWaveformChange}
                                checked={w === waveform} />
                            <label htmlFor={w + '-wave'}>{w + ' wave'}</label><br />
                        </div>
                    );
                })
            }

        </div>
    );
}

export default App;
