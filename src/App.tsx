import React, { useEffect, useRef, useState } from 'react';
import VolumeComponent from './components/VolumeComponent/VolumeComponent';
import { WaveformEnum } from './models/WaveformEnum';
import KeysComponent from './components/KeyboardCompnent/KeysComponent';
import { NOTES } from './consts/Notes';
import AdsrComponent from './components/AdsrComponent/AdsrComponent';
import FrequencyComponent from './components/FrequencyComponent/FrequencyComponent';
import { DefaultParams } from './consts/DefaultParams';
import RangeInput from './components/shared/RangeInput/RangeInput';
import { KEY_MAPPING } from './consts/KeyMapping';
import { AVAILABLE_FILTERS } from './consts/AvailableFilters';
import { SynthEngineModel } from './models/SynthEngineModel';
import { createSynthEngine } from './services/SynthEngineFactory';
import './App.css';

function App() {
    const synthEngine = useRef<SynthEngineModel>(createSynthEngine());

    const [filterType, setFilterType] = useState<BiquadFilterType>(DefaultParams.filterType);
    const [filterQualityFactor, setFilterQualityFactor] = useState<number>(DefaultParams.qualityFactor);
    const [primaryWaveform, setPrimaryWaveform] = useState<OscillatorType>(DefaultParams.waveform);
    const [secondaryWaveform, setSecondaryWaveform] = useState<OscillatorType>(DefaultParams.waveform);

    const [attack, setAttack] = useState<number>(DefaultParams.attack);
    const [decay, setDecay] = useState<number>(DefaultParams.decay);
    const [release, setRelease] = useState<number>(DefaultParams.release);
    const [sustain, setSustain] = useState<number>(DefaultParams.sustain);

    const [delayTime, setDelayTime] = useState<number>(DefaultParams.delayTime);
    const [delayFeedback, setDelayFeedback] = useState<number>(DefaultParams.delayFeedback);

    const [currentNote, setCurrentNote] = useState<string>();

    const canvasRef = useRef<any>(null);

    useEffect(() => {
        const getAnalyserData = () => {
            synthEngine.current.analyserNode.getByteTimeDomainData(synthEngine.current.analyserData);
            return synthEngine.current.analyserData;
        };
        const draw = () => {
            const canvas = canvasRef.current.getContext('2d');
            const width = canvasRef.current.width;
            const height = canvasRef.current.height;
            const chh = Math.round(height * 0.5);
            canvas.fillStyle = 'red';
            canvas.lineWidth = 2;
            canvas.strokeStyle = 'red';
            requestAnimationFrame(draw);
            canvas.clearRect(0, 0, width, height);
            const data = getAnalyserData();
            canvas.beginPath();
            canvas.moveTo(0, chh);
            for (let i = 0, ln = data.length; i < ln; i++) {
                canvas.lineTo(i, height * (data[i] / 255));
            }
            canvas.stroke();
        };
        draw();
    }, []);

    // keyboard event listener
    useEffect(() => {
        window.addEventListener('keyup', handleKeyEvent);
        window.addEventListener('keydown', handleKeyEvent);
        return () => {
            window.removeEventListener('keyup', handleKeyEvent);
            window.removeEventListener('keydown', handleKeyEvent);
        };
    });

    const handleKeyEvent = (e: any) => {
        if (KEY_MAPPING.hasOwnProperty(e.key) && !e.repeat) {
            handleKey(e, KEY_MAPPING[e.key]);
        }
    };

    const handleKey = (e: any, note: string) => {
        const s = synthEngine.current;
        s.audioContext.resume();
        switch (e.type) {
            case 'mousedown':
            case 'keydown':
                setCurrentNote(note);
                document.getElementById(note)?.classList.add('active');
                s.primaryVco.type = primaryWaveform;
                s.secondaryVco.type = secondaryWaveform;
                s.primaryVco.frequency.setValueAtTime(NOTES[note], 0);
                s.secondaryVco.frequency.setValueAtTime(NOTES[note], 0);
                envelopeOn(s.primaryAdsr.gain, attack, decay, sustain);
                envelopeOn(s.secondaryAdsr.gain, attack, decay, sustain);
                break;
            case 'mouseup':
            case 'keyup':
                if (currentNote === note) {
                    document.getElementById(note)?.classList.remove('active');
                    synthEngine.current.primaryVco.type = primaryWaveform;
                    synthEngine.current.secondaryVco.type = secondaryWaveform;
                    envelopeOff(s.primaryAdsr.gain, release);
                    envelopeOff(s.secondaryAdsr.gain, release);
                    break;
                }
        }
    };

    function envelopeOn(vcaGain: AudioParam, a: number, d: number, s: number) {
        const now = synthEngine.current.audioContext.currentTime;
        vcaGain.cancelScheduledValues(0);
        vcaGain.setValueAtTime(0, now);
        vcaGain.linearRampToValueAtTime(1, now + a);
        vcaGain.linearRampToValueAtTime(s, now + a + d);
    }

    function envelopeOff(vcaGain: AudioParam, r: number) {
        const now = synthEngine.current.audioContext.currentTime;
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

    const handleWaveformChange = (setWaveform: any, oscillatorNode: OscillatorNode, event: any) => {
        const selectedWaveform: OscillatorType = event.target.value;
        console.log('waveform: ', selectedWaveform);
        oscillatorNode.type = selectedWaveform;
        setWaveform(selectedWaveform);
    };

    const handleDelayTimeChange = (event: any) => {
        const changedDelayTime: number = event.target.valueAsNumber;
        console.log('delay time: ', changedDelayTime);
        synthEngine.current.delayNode.delayTime.linearRampToValueAtTime(
            changedDelayTime,
            synthEngine.current.audioContext.currentTime + 0.01
        );
        setDelayTime(changedDelayTime);
    };

    const handleDelayFeedbackChange = (event: any) => {
        const changedDelayFeedback: number = event.target.valueAsNumber;
        console.log('delay feedback: ', changedDelayFeedback);
        synthEngine.current.delayFeedback.gain.linearRampToValueAtTime(
            changedDelayFeedback,
            synthEngine.current.audioContext.currentTime + 0.01
        );
        setDelayFeedback(changedDelayFeedback);
    };

    const handleFilterTypeChange = (event: any) => {
        const selectedFilterType: BiquadFilterType = event.target.value;
        console.log('filter type: ', selectedFilterType);
        synthEngine.current.filter.type = selectedFilterType;
        setFilterType(selectedFilterType);
    };

    const handleFilterQualityFactorChange = (event: any) => {
        const selectedQualityFactor: number = event.target.valueAsNumber;
        console.log('filter type: ', selectedQualityFactor);
        synthEngine.current.filter.Q.value = selectedQualityFactor;
        setFilterQualityFactor(selectedQualityFactor);
    };

    return (
        <div className="App">
            <br />
            <KeysComponent onHandleKey={handleKey} />
            <br />
            <canvas className="visualizer" width="500" height="100" ref={canvasRef} />
            <hr />
            <hr />
            <div style={{ height: '100%', width: '50%', display: 'inline-block' }}>
                <p>Primary OSC</p>
                <p>Waveform select</p>
                {Object.values(WaveformEnum).map((w, i) => {
                    return (
                        <div key={i}>
                            <input
                                type="radio"
                                id={w + '-wave-primary'}
                                name="primary-waveform"
                                value={w}
                                onChange={(e) =>
                                    handleWaveformChange(setPrimaryWaveform, synthEngine.current.primaryVco, e)
                                }
                                checked={w === primaryWaveform}
                            />
                            <label htmlFor={w + '-wave-primary'}>{w + ' wave'}</label>
                            <br />
                        </div>
                    );
                })}
                <br />
                <VolumeComponent name={'Primary VCA'} volumeNode={synthEngine.current.primaryVca} />
            </div>
            <div style={{ height: '100%', width: '50%', display: 'inline-block' }}>
                <p>Secondary OSC</p>
                <p>Waveform select</p>
                {Object.values(WaveformEnum).map((w, i) => {
                    return (
                        <div key={i}>
                            <input
                                type="radio"
                                id={w + '-wave-secondary'}
                                name="secondary-waveform"
                                value={w}
                                onChange={(e) =>
                                    handleWaveformChange(setSecondaryWaveform, synthEngine.current.secondaryVco, e)
                                }
                                checked={w === secondaryWaveform}
                            />
                            <label htmlFor={w + '-wave-secondary'}>{w + ' wave'}</label>
                            <br />
                        </div>
                    );
                })}
                <br />
                <VolumeComponent name={'Secondary VCA'} volumeNode={synthEngine.current.secondaryVca} />
            </div>
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
            <p>Filter type select</p>
            {Object.values(AVAILABLE_FILTERS).map((f, i) => {
                return (
                    <div key={i}>
                        <input
                            type="radio"
                            id={f + '-filter'}
                            name="filter"
                            value={f}
                            onChange={handleFilterTypeChange}
                            checked={f === filterType}
                        />
                        <label htmlFor={f + '-filter'}>{f + ' filter'}</label>
                        <br />
                    </div>
                );
            })}
            <br />
            <FrequencyComponent name="Filter frequency" node={synthEngine.current.filter} />
            <br />
            <RangeInput
                min={DefaultParams.qualityFactorMin}
                max={DefaultParams.qualityFactorMax}
                step={0.1}
                value={filterQualityFactor}
                onChange={handleFilterQualityFactorChange}
            />
            Filter quality factor: {filterQualityFactor}
            <br />
            <hr />
            <br />
            <p>Delay</p>
            <input
                type="range"
                id="delay-time-control"
                name="delay-time-control"
                min={DefaultParams.delayTimeMin}
                max={DefaultParams.delayTimeMax}
                step={0.1}
                value={delayTime}
                onChange={handleDelayTimeChange}
            />
            <label htmlFor="delay-time-control">Delay time in: {delayTime}s</label>
            <br />
            <input
                type="range"
                id="delay-feedback-control"
                name="delay-feedback-control"
                min={DefaultParams.delayFeedbackMin}
                max={DefaultParams.delayFeedbackMax}
                step={0.1}
                value={delayFeedback}
                onChange={handleDelayFeedbackChange}
            />
            <label htmlFor="delay-feedback-control">Delay feedback: {delayFeedback * 100}%</label>
            <br />
            <hr />
            <VolumeComponent name={'Master value'} volumeNode={synthEngine.current.masterVca} />
            <hr />
        </div>
    );
}

export default App;
