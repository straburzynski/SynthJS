import React, { useEffect, useRef, useState } from 'react';
import { DefaultParams } from '../../consts/DefaultParams';
import { KEY_MAPPING } from '../../consts/KeyMapping';
import { NOTES } from '../../consts/Notes';
import KeysComponent from '../KeyboardCompnent/KeysComponent';
import { WaveformEnum } from '../../models/WaveformEnum';
import VolumeComponent from '../VolumeComponent/VolumeComponent';
import AdsrComponent from '../AdsrComponent/AdsrComponent';
import { AVAILABLE_FILTERS } from '../../consts/AvailableFilters';
import FrequencyComponent from '../FrequencyComponent/FrequencyComponent';
import RangeInput from '../shared/RangeInput/RangeInput';
import './synthComponent.scss';

const SynthComponent = ({ synthEngine }: any) => {
    const [filterType, setFilterType] = useState<BiquadFilterType>(DefaultParams.filterType);
    const [filterQualityFactor, setFilterQualityFactor] = useState<number>(DefaultParams.qualityFactor);
    const [primaryWaveform, setPrimaryWaveform] = useState<OscillatorType>(DefaultParams.primaryWaveform);
    const [secondaryWaveform, setSecondaryWaveform] = useState<OscillatorType>(DefaultParams.secondaryWaveform);
    const [lfoGain, setLfoGain] = useState<number>(DefaultParams.lfoGain);
    const [lfoFrequency, setLfoFrequency] = useState<number>(DefaultParams.lfoFrequency);
    const [lfoWaveform, setLfoWaveform] = useState<OscillatorType>(DefaultParams.lfoWaveform);

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
    }, [synthEngine]);

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

    const createOscillator = (freq: number, isPrimary: boolean, detune = 0) => {
        const osc = synthEngine.current.audioContext.createOscillator();
        osc.type = isPrimary ? primaryWaveform : secondaryWaveform;
        osc.frequency.value = freq;
        osc.detune.value = detune;
        osc.connect(isPrimary ? synthEngine.current.primaryAdsr : synthEngine.current.secondaryAdsr);
        return osc;
    };

    const killOscillators = (t = 0, note?: string) => {
        synthEngine.current.primaryAdsr.gain.cancelAndHoldAtTime(t);
        synthEngine.current.secondaryAdsr.gain.cancelAndHoldAtTime(t);
        synthEngine.current.filter.frequency.cancelAndHoldAtTime(t);
        if (synthEngine.current.primaryVco) {
            synthEngine.current.primaryVco.stop(t)
            synthEngine.current.primaryVco.onended = () => {
                if (note) {
                    console.log(note + ' ended');
                }
            };
        }
        if (synthEngine.current.secondaryVco) {
            synthEngine.current.secondaryVco.stop(t);
        }
    };

    const handleKey = (e: any, note: string) => {
        const s = synthEngine.current;
        switch (e.type) {
            case 'mousedown':
            case 'keydown':
                killOscillators();
                setCurrentNote(note);
                document.getElementById(note)?.classList.add('active');
                s.primaryVco = createOscillator(NOTES[note], true);
                s.secondaryVco = createOscillator(NOTES[note], false);
                envelopeOn(s.primaryAdsr.gain, attack, decay, sustain);
                envelopeOn(s.secondaryAdsr.gain, attack, decay, sustain);
                s.primaryVco.start();
                s.secondaryVco.start();
                break;
            case 'mouseup':
            case 'keyup':
                document.getElementById(note)?.classList.remove('active');
                if (currentNote === note) {
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
        killOscillators(now + r);
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
        console.log(event.target.name, selectedWaveform);
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

    const handleLfoGainChange = (event: any) => {
        const selectedLfoGain: number = event.target.valueAsNumber;
        console.log('lfo gain', selectedLfoGain);
        synthEngine.current.lfoGain.gain.value = selectedLfoGain;
        setLfoGain(selectedLfoGain);
    };

    const handleLfoFrequencyChange = (event: any) => {
        const selectedLfoFrequency: number = event.target.valueAsNumber;
        console.log('lfo frequency', selectedLfoFrequency);
        synthEngine.current.lfo.frequency.value = selectedLfoFrequency;
        setLfoFrequency(selectedLfoFrequency);
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
            {currentNote ? (
                <p>
                    <strong>{currentNote}</strong> [<i> {NOTES[currentNote]} Hz</i> ]
                </p>
            ) : (
                <p>---</p>
            )}
            <hr />
            <p>Oscillators</p>
            <div className="columns">
                <div className="column-33">
                    <p>Primary OSC</p>
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
                                <label htmlFor={w + '-wave-primary'}>{w}</label>
                                <br />
                            </div>
                        );
                    })}
                    <br />
                    <VolumeComponent name={'Primary VCA'} volumeNode={synthEngine.current.primaryVca} />
                </div>
                <div className="column-33">
                    <p>Secondary OSC</p>
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
                                <label htmlFor={w + '-wave-secondary'}>{w}</label>
                                <br />
                            </div>
                        );
                    })}
                    <br />
                    <VolumeComponent name={'Secondary VCA'} volumeNode={synthEngine.current.secondaryVca} />
                </div>
                <div className="column-33">
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
                </div>
            </div>
            <br />
            <hr />
            <p>LFO</p>
            <div className="columns">
                <div className="column-50">
                    <p>LFO waveform</p>
                    {Object.values(WaveformEnum).map((w, i) => {
                        return (
                            <div key={i}>
                                <input
                                    type="radio"
                                    id={w + '-lfo-waveform'}
                                    name="lfo-waveform"
                                    value={w}
                                    onChange={(e) => handleWaveformChange(setLfoWaveform, synthEngine.current.lfo, e)}
                                    checked={w === lfoWaveform}
                                />
                                <label htmlFor={w + '-lfo-waveform'}>{w}</label>
                                <br />
                            </div>
                        );
                    })}
                    <br />
                    <RangeInput
                        min={DefaultParams.lfoFrequencyMin}
                        max={DefaultParams.lfoFrequencyMax}
                        step={0.1}
                        value={lfoFrequency}
                        onChange={handleLfoFrequencyChange}
                        label={'Frequency ' + lfoFrequency + ' Hz'}
                    />
                    <br />
                    <RangeInput
                        min={DefaultParams.lfoGainMin}
                        max={DefaultParams.lfoGainMax}
                        step={0.1}
                        value={lfoGain}
                        onChange={handleLfoGainChange}
                        label={'Gain ' + lfoGain}
                    />
                </div>
                <div className="column-50">
                    <p>Filter type</p>
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
                                <label htmlFor={f + '-filter'}>{f}</label>
                                <br />
                            </div>
                        );
                    })}
                    <br />
                    <FrequencyComponent name="Filter frequency" node={synthEngine.current.filter} />
                    <RangeInput
                        min={DefaultParams.qualityFactorMin}
                        max={DefaultParams.qualityFactorMax}
                        step={0.1}
                        value={filterQualityFactor}
                        onChange={handleFilterQualityFactorChange}
                        label={'Filter quality factor: ' + filterQualityFactor}
                    />
                </div>
            </div>
            <br />
            <hr />
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
            <br />
            <hr />
            <VolumeComponent name={'Master value'} volumeNode={synthEngine.current.masterVca} max={1} />
            <hr />
        </div>
    );
};

export default SynthComponent;
