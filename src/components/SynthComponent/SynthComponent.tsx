import React, { FC, MutableRefObject, useEffect, useRef, useState } from 'react';
import { DefaultParams } from '../../consts/DefaultParams';
import KeyboardComponent from '../KeyboardComponent/KeyboardComponent';
import { WaveformEnum } from '../../models/WaveformEnum';
import VolumeComponent from '../VolumeComponent/VolumeComponent';
import AdsrComponent from '../AdsrComponent/AdsrComponent';
import { AVAILABLE_FILTERS } from '../../consts/AvailableFilters';
import FrequencyComponent from '../FrequencyComponent/FrequencyComponent';
import RangeInput from '../shared/RangeInput/RangeInput';
import { SynthEngineModel } from '../../models/SynthEngineModel';
import { createImpulseResponse } from '../../services/ImpulseResponseGenerator';
import { createDistortionCurve } from '../../services/DistortionCurveGenerator';
import { Note } from '@tonaljs/tonal';
import { OscillatorComponent } from '../OscillatorComponent/OscillatorComponent';
import CurrentNoteComponent from '../CurrentNoteComponent/CurrentNoteComponent';
import MasterVolumeComponent from '../MasterVolumeComponent/MasterVolumeComponent';
import './synthComponent.scss';

const SynthComponent: FC<MutableRefObject<SynthEngineModel>> = (synthEngine: MutableRefObject<SynthEngineModel>) => {
    const [filterType, setFilterType] = useState<BiquadFilterType>(DefaultParams.filterType);
    const [filterQualityFactor, setFilterQualityFactor] = useState<number>(DefaultParams.qualityFactor);

    const [primaryWaveform, setPrimaryWaveform] = useState<OscillatorType>(DefaultParams.primaryWaveform);
    const [secondaryWaveform, setSecondaryWaveform] = useState<OscillatorType>(DefaultParams.secondaryWaveform);
    const [primaryVcoDetune, setPrimaryVcoDetune] = useState<number>(DefaultParams.detune);
    const [secondaryVcoDetune, setSecondaryVcoDetune] = useState<number>(DefaultParams.detune);

    const [lfo1Gain, setLfo1Gain] = useState<number>(DefaultParams.lfoGain);
    const [lfo1Frequency, setLfo1Frequency] = useState<number>(DefaultParams.lfoFrequency);
    const [lfo1Waveform, setLfo1Waveform] = useState<OscillatorType>(DefaultParams.lfoWaveform);

    const [lfo2Gain, setLfo2Gain] = useState<number>(DefaultParams.lfoGain);
    const [lfo2Frequency, setLfo2Frequency] = useState<number>(DefaultParams.lfoFrequency);
    const [lfo2Waveform, setLfo2Waveform] = useState<OscillatorType>(DefaultParams.lfoWaveform);

    const [attack, setAttack] = useState<number>(DefaultParams.attack);
    const [decay, setDecay] = useState<number>(DefaultParams.decay);
    const [release, setRelease] = useState<number>(DefaultParams.release);
    const [sustain, setSustain] = useState<number>(DefaultParams.sustain);

    const [distortionActive, setDistortionActive] = useState<boolean>(false);
    const [distortionGain, setDistortionGain] = useState<number>(0);

    const [delayTime, setDelayTime] = useState<number>(DefaultParams.delayTime);
    const [delayFeedback, setDelayFeedback] = useState<number>(DefaultParams.delayFeedback);

    const [reverbLength, setReverbLength] = useState<number>(2);

    const [currentNote, setCurrentNote] = useState<string>();
    const canvasRef = useRef<any>();

    useEffect(() => {
        const getAnalyserData = () => {
            synthEngine.current.analyserNode.getByteTimeDomainData(synthEngine.current.analyserData);
            return synthEngine.current.analyserData;
        };
        const draw = () => {
            if (canvasRef.current) {
                const canvas: CanvasRenderingContext2D | null = canvasRef.current.getContext('2d');
                if (canvas == null) return;
                const width = canvasRef.current.width;
                const height = canvasRef.current.height;
                const chh = Math.round(height * 0.5);
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
            }
        };
        draw();
    }, [synthEngine]);

    const createOscillator = (freq: number | null | undefined, isPrimary: boolean, detune: number) => {
        if (freq == null) {
            throw new Error('unrecognized note');
        } else {
            const osc = synthEngine.current.audioContext.createOscillator();
            osc.type = isPrimary ? primaryWaveform : secondaryWaveform;
            osc.frequency.value = freq;
            osc.detune.value = detune;
            osc.connect(isPrimary ? synthEngine.current.primaryAdsr : synthEngine.current.secondaryAdsr);
            return osc;
        }
    };

    const killOscillators = (t = 0, note?: string) => {
        synthEngine.current.primaryAdsr.gain.cancelAndHoldAtTime(t);
        synthEngine.current.secondaryAdsr.gain.cancelAndHoldAtTime(t);
        synthEngine.current.filter.frequency.cancelAndHoldAtTime(t);
        if (synthEngine.current.primaryVco) {
            synthEngine.current.primaryVco.stop(t);
            synthEngine.current.primaryVco.onended = () => {
                if (note) {
                    setCurrentNote(undefined);
                }
            };
        }
        if (synthEngine.current.secondaryVco) {
            synthEngine.current.secondaryVco.stop(t);
        }
    };

    const handleKey = (e: React.MouseEvent<HTMLButtonElement> | KeyboardEvent, note: string) => {
        const s = synthEngine.current;
        switch (e.type) {
            case 'mousedown':
            case 'keydown':
                console.log('note on: ', note);
                killOscillators();
                setCurrentNote(note);
                const freq = Note.get(note).freq;
                document.getElementById(note)?.classList.add('active');
                s.primaryVco = createOscillator(freq, true, primaryVcoDetune);
                s.secondaryVco = createOscillator(freq, false, secondaryVcoDetune);
                envelopeOn(s.primaryAdsr.gain, attack, decay, sustain);
                envelopeOn(s.secondaryAdsr.gain, attack, decay, sustain);
                s.primaryVco.start();
                s.secondaryVco.start();
                break;
            case 'mouseup':
            case 'keyup':
                console.log('note off: ', note);
                document.getElementById(note)?.classList.remove('active');
                if (currentNote === note) {
                    envelopeOff(s.primaryAdsr.gain, release, note);
                    envelopeOff(s.secondaryAdsr.gain, release, note);
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

    function envelopeOff(vcaGain: AudioParam, r: number, note?: string) {
        const now = synthEngine.current.audioContext.currentTime;
        vcaGain.cancelScheduledValues(0);
        vcaGain.setValueAtTime(vcaGain.value, now);
        vcaGain.linearRampToValueAtTime(0, now + r);
        killOscillators(now + r, note);
    }

    const handleWaveformChange = (
        setWaveform: Function,
        oscillatorNode: OscillatorNode,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const selectedWaveform = event.target.value as OscillatorType;
        console.log(event.target.name, selectedWaveform);
        oscillatorNode.type = selectedWaveform;
        setWaveform(selectedWaveform);
    };

    const handleDelayTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const changedDelayTime: number = event.target.valueAsNumber;
        console.log('delay time: ', changedDelayTime);
        synthEngine.current.delayNode.delayTime.linearRampToValueAtTime(
            changedDelayTime,
            synthEngine.current.audioContext.currentTime + 0.01
        );
        setDelayTime(changedDelayTime);
    };

    const handleDelayFeedbackChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const changedDelayFeedback: number = event.target.valueAsNumber;
        console.log('delay feedback: ', changedDelayFeedback);
        synthEngine.current.delayFeedback.gain.linearRampToValueAtTime(
            changedDelayFeedback,
            synthEngine.current.audioContext.currentTime + 0.01
        );
        setDelayFeedback(changedDelayFeedback);
    };

    const handleReverbLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const changedReverbLength: number = event.target.valueAsNumber;
        console.log('reverb length: ', changedReverbLength);
        synthEngine.current.reverbNode.buffer = createImpulseResponse(
            synthEngine.current.audioContext,
            reverbLength,
            2,
            false
        );
        setReverbLength(changedReverbLength);
    };

    const handleDistortionGainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const changedDistortionGain: number = event.target.valueAsNumber;
        console.log('distortion gain: ', changedDistortionGain);
        if (distortionActive) {
            synthEngine.current.distortion.curve = createDistortionCurve(changedDistortionGain);
        }
        setDistortionGain(changedDistortionGain);
    };

    const handleDistortionActiveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const changedDistortionActive: boolean = event.target.checked;
        console.log('distortion active: ', changedDistortionActive);
        if (changedDistortionActive) {
            console.log('distortion on');
            synthEngine.current.distortion.curve = createDistortionCurve(distortionGain);
        } else {
            console.log('distortion off');
            synthEngine.current.distortion.curve = null;
        }
        setDistortionActive(changedDistortionActive);
    };

    const handleFilterTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFilterType = event.target.value as BiquadFilterType;
        console.log('filter type: ', selectedFilterType);
        synthEngine.current.filter.type = selectedFilterType;
        setFilterType(selectedFilterType);
    };

    const handleLfo1GainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedLfoGain: number = event.target.valueAsNumber;
        console.log('lfo 1 gain', selectedLfoGain);
        synthEngine.current.lfo1Gain.gain.value = selectedLfoGain;
        setLfo1Gain(selectedLfoGain);
    };

    const handleLfo1FrequencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedLfoFrequency: number = event.target.valueAsNumber;
        console.log('lfo 1 frequency', selectedLfoFrequency);
        synthEngine.current.lfo1.frequency.value = selectedLfoFrequency;
        setLfo1Frequency(selectedLfoFrequency);
    };

    const handleLfo2GainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedLfoGain: number = event.target.valueAsNumber;
        console.log('lfo 2 gain', selectedLfoGain);
        synthEngine.current.lfo2Gain.gain.value = selectedLfoGain;
        setLfo2Gain(selectedLfoGain);
    };

    const handleLfo2FrequencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedLfoFrequency: number = event.target.valueAsNumber;
        console.log('lfo 2 frequency', selectedLfoFrequency);
        synthEngine.current.lfo2.frequency.value = selectedLfoFrequency;
        setLfo2Frequency(selectedLfoFrequency);
    };

    const handleFilterQualityFactorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedQualityFactor: number = event.target.valueAsNumber;
        console.log('filter type: ', selectedQualityFactor);
        synthEngine.current.filter.Q.value = selectedQualityFactor;
        setFilterQualityFactor(selectedQualityFactor);
    };

    return (
        <div className="synth-wrapper">
            <div className="container">
                <div className="flex-100">
                    <KeyboardComponent onHandleKey={handleKey} />
                </div>
                <div className="flex-100">
                    <canvas className="visualizer" width="500" height="100" ref={canvasRef} />
                </div>
            </div>

            <br />
            <br />
            <hr />
            <CurrentNoteComponent currentNote={currentNote} />
            <hr />
            <br />

            <div className="first container">
                <div className="blue flex-30">
                    <OscillatorComponent
                        synthEngine={synthEngine}
                        primary={true}
                        detune={primaryVcoDetune}
                        setDetune={setPrimaryVcoDetune}
                        waveform={primaryWaveform}
                        setWaveform={setPrimaryWaveform}
                    />
                </div>
                <div className="green flex-30">
                    <OscillatorComponent
                        synthEngine={synthEngine}
                        primary={false}
                        detune={secondaryVcoDetune}
                        setDetune={setSecondaryVcoDetune}
                        waveform={secondaryWaveform}
                        setWaveform={setSecondaryWaveform}
                    />
                </div>
                <div className="blue flex-30">
                    <AdsrComponent
                        attack={attack}
                        setAttack={setAttack}
                        decay={decay}
                        setDecay={setDecay}
                        sustain={sustain}
                        setSustain={setSustain}
                        release={release}
                        setRelease={setRelease}
                    />
                </div>
                <div className="red flex-10">
                    <MasterVolumeComponent masterVcaNode={synthEngine.current.masterVca} />
                </div>
            </div>

            <br />
            <hr />

            <div className="columns">
                <div className="column-33">
                    <p>LFO waveform -{'>'} filter</p>
                    {Object.values(WaveformEnum).map((w, i) => {
                        return (
                            <div key={i}>
                                <input
                                    type="radio"
                                    id={w + '-lfo-1-waveform'}
                                    name="lfo-1-waveform"
                                    value={w}
                                    onChange={(e) => handleWaveformChange(setLfo1Waveform, synthEngine.current.lfo1, e)}
                                    checked={w === lfo1Waveform}
                                />
                                <label htmlFor={w + '-lfo-1-waveform'}>{w}</label>
                                <br />
                            </div>
                        );
                    })}
                    <br />
                    <RangeInput
                        min={DefaultParams.lfoFrequencyMin}
                        max={DefaultParams.lfoFrequencyMax}
                        step={0.1}
                        value={lfo1Frequency}
                        onChange={handleLfo1FrequencyChange}
                        label={'Frequency ' + lfo1Frequency + ' Hz'}
                    />
                    <br />
                    <RangeInput
                        min={DefaultParams.lfoGainMin}
                        max={DefaultParams.lfoGainMax}
                        step={0.1}
                        value={lfo1Gain}
                        onChange={handleLfo1GainChange}
                        label={'Gain ' + lfo1Gain}
                    />
                </div>
                <div className="column-33">
                    <p>LFO waveform -{'>'} master vca</p>
                    {Object.values(WaveformEnum).map((w, i) => {
                        return (
                            <div key={i}>
                                <input
                                    type="radio"
                                    id={w + '-lfo-2-waveform'}
                                    name="lfo-2-waveform"
                                    value={w}
                                    onChange={(e) => handleWaveformChange(setLfo2Waveform, synthEngine.current.lfo2, e)}
                                    checked={w === lfo2Waveform}
                                />
                                <label htmlFor={w + '-lfo-2-waveform'}>{w}</label>
                                <br />
                            </div>
                        );
                    })}
                    <br />
                    <RangeInput
                        min={DefaultParams.lfoFrequencyMin}
                        max={DefaultParams.lfoFrequencyMax}
                        step={0.1}
                        value={lfo2Frequency}
                        onChange={handleLfo2FrequencyChange}
                        label={'Frequency ' + lfo2Frequency + ' Hz'}
                    />
                    <br />
                    <RangeInput
                        min={DefaultParams.lfoGainMin}
                        max={0.5}
                        step={0.1}
                        value={lfo2Gain}
                        onChange={handleLfo2GainChange}
                        label={'Gain ' + lfo2Gain}
                    />
                </div>
                <div className="column-33">
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
            <div className="columns">
                <div className="column-33">
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
                </div>
                <div className="column-33">
                    <p>Reverb</p>
                    <VolumeComponent
                        name={'Reverb'}
                        volumeNode={synthEngine.current.reverbGain}
                        min={DefaultParams.reverbGainMin}
                        max={DefaultParams.reverbGainMax}
                        initialState={DefaultParams.reverbGain}
                        step={0.1}
                    />
                    <input
                        type="range"
                        id="reverb-length-control"
                        name="reverb-length-control"
                        min={0.1}
                        max={5}
                        step={0.1}
                        value={reverbLength}
                        onChange={handleReverbLengthChange}
                    />
                    <label htmlFor="reverb-length-control">Reverb length: {reverbLength}s</label>
                </div>
                <div className="column-33">
                    <p>Distortion</p>
                    <label className="distortion-switch">
                        <input type="checkbox" checked={distortionActive} onChange={handleDistortionActiveChange} />
                    </label>
                    <br />
                    <input
                        type="range"
                        id="distortion-control"
                        name="distortion-control"
                        min={0}
                        max={40}
                        step={1}
                        value={distortionGain}
                        onChange={handleDistortionGainChange}
                    />
                    <label htmlFor="distortion-control">Distortion gain: {distortionGain}</label>
                </div>
            </div>
            <br />
            <hr />
        </div>
    );
};

export default SynthComponent;
