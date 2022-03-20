import React, { useEffect, useRef, useState } from 'react';
import VolumeComponent from './components/VolumeComponent/VolumeComponent';
import { WaveformEnum } from './models/WaveformEnum';
import KeysComponent from './components/KeyboardCompnent/KeysComponent';
import { NOTES } from './consts/Notes';
import AdsrComponent from './components/AdsrComponent/AdsrComponent';
import FrequencyComponent from './components/FrequencyComponent/FrequencyComponent';
import { DefaultParams } from './consts/DefaultParams';
import './App.css';
import RangeInput from './components/shared/RangeInput/RangeInput';
import { KEY_MAPPING } from './consts/KeyMapping';
import { AVAILABLE_FILTERS } from './consts/AvailableFilters';

const AudioContext = window.AudioContext || (window as any).webkitAudioContext;

function App() {
    const audioContextRef = useRef<AudioContext | any>();
    const vcoRefArray = useRef<OscillatorNode[] | any>();
    const vcaRef = useRef<GainNode | any>();
    const filterRef = useRef<BiquadFilterNode | any>();
    const delayNodeRef = useRef<DelayNode | any>();
    const delayGainRef = useRef<GainNode | any>();
    const masterVcaRef = useRef<GainNode | any>();
    const analyserNodeRef = useRef<AnalyserNode | any>();
    const analyserDataRef = useRef<any>();

    const [filterType, setFilterType] = useState<BiquadFilterType>(DefaultParams.filterType);
    const [filterQualityFactor, setFilterQualityFactor] = useState<number>(DefaultParams.qualityFactor);
    const [waveform, setWaveform] = useState<OscillatorType>(DefaultParams.waveform);
    const [unisonWidth, setUnisonWidth] = useState<number>(DefaultParams.unisonWidth);

    const [attack, setAttack] = useState<number>(DefaultParams.attack);
    const [decay, setDecay] = useState<number>(DefaultParams.decay);
    const [release, setRelease] = useState<number>(DefaultParams.release);
    const [sustain, setSustain] = useState<number>(DefaultParams.sustain);

    const [delayTime, setDelayTime] = useState<number>(DefaultParams.delayTime);
    const [delayFeedback, setDelayFeedback] = useState<number>(DefaultParams.delayFeedback);

    const [currentNote, setCurrentNote] = useState<string>();

    const canvasRef = useRef<any>(null);

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
        let filter = audioContext.createBiquadFilter();
        let masterVCA = audioContext.createGain();

        // configure filter
        filter.type = DefaultParams.filterType;
        filter.frequency.setTargetAtTime(2000, audioContext.currentTime, 0);
        filter.Q.value = DefaultParams.qualityFactor;

        //configure delay
        const delayNode = audioContext.createDelay(5);
        delayNode.delayTime.value = DefaultParams.delayTime;
        const delayFeedback = audioContext.createGain();
        delayFeedback.gain.value = DefaultParams.delayFeedback;

        // connect vco and filter
        VCOs.forEach((vco) => vco.connect(VCA));
        VCA.connect(filter);
        filter.connect(masterVCA);

        // connect delay
        filter.connect(delayNode);
        delayNode.connect(delayFeedback);
        delayFeedback.connect(filter);

        // set volume
        masterVCA.gain.value = DefaultParams.gain;
        VCA.gain.value = DefaultParams.gainMin;
        VCOs.forEach((vco) => vco.start());

        // analyser
        const analyser = audioContext.createAnalyser();
        analyser.smoothingTimeConstant = 0.5;
        analyser.fftSize = 1024;
        const analyserBufferLength = analyser.fftSize;
        analyserDataRef.current = new Uint8Array(analyserBufferLength);
        analyserNodeRef.current = analyser;
        draw();

        // connect master volume
        masterVCA.connect(analyser);
        analyser.connect(audioContext.destination);

        audioContextRef.current = audioContext;
        masterVcaRef.current = masterVCA;
        vcoRefArray.current = VCOs;
        vcaRef.current = VCA;
        delayNodeRef.current = delayNode;
        delayGainRef.current = delayFeedback;
        filterRef.current = filter;
    }, []);

    const getAnalyserData = () => {
        analyserNodeRef.current.getByteTimeDomainData(analyserDataRef.current);
        return analyserDataRef.current;
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
        audioContextRef.current?.resume();
        switch (e.type) {
            case 'mousedown':
            case 'keydown':
                setCurrentNote(note);
                vcoRefArray.current?.forEach((vco: OscillatorNode) => {
                    vco.type = waveform;
                    vco.frequency.setValueAtTime(NOTES[note], 0);
                });
                vcaRef.current.gain.value = 1;
                envelopeOn(vcaRef.current.gain, attack, decay, sustain);
                break;
            case 'mouseup':
            case 'keyup':
                if (currentNote === note) {
                    vcoRefArray.current?.forEach((vco: OscillatorNode) => (vco.type = waveform));
                    envelopeOff(vcaRef.current.gain, release);
                    break;
                }
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
        vcoRefArray.current?.forEach((vco: OscillatorNode) => (vco.type = waveform));
        setWaveform(selectedWaveform);
    };

    const handleUnisonWidthChange = (event: any) => {
        const width: number = event.target.valueAsNumber;
        console.log('width: ', width);
        vcoRefArray.current[1].detune.value = unisonWidth;
        vcoRefArray.current[2].detune.value = -unisonWidth;
        setUnisonWidth(width);
    };

    const handleDelayTimeChange = (event: any) => {
        const changedDelayTime: number = event.target.valueAsNumber;
        console.log('delay time: ', changedDelayTime);
        delayNodeRef.current.delayTime.linearRampToValueAtTime(
            changedDelayTime,
            audioContextRef.current.currentTime + 0.01
        );
        setDelayTime(changedDelayTime);
    };

    const handleDelayFeedbackChange = (event: any) => {
        const changedDelayFeedback: number = event.target.valueAsNumber;
        console.log('delay feedback: ', changedDelayFeedback);
        delayGainRef.current.gain.linearRampToValueAtTime(
            changedDelayFeedback,
            audioContextRef.current.currentTime + 0.01
        );
        setDelayFeedback(changedDelayFeedback);
    };

    const handleFilterTypeChange = (event: any) => {
        const selectedFilterType: BiquadFilterType = event.target.value;
        console.log('filter type: ', selectedFilterType);
        filterRef.current.type = selectedFilterType;
        setFilterType(selectedFilterType);
    };

    const handleFilterQualityFactorChange = (event: any) => {
        const selectedQualityFactor: number = event.target.valueAsNumber;
        console.log('filter type: ', selectedQualityFactor);
        filterRef.current.Q.value = selectedQualityFactor;
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
            <FrequencyComponent name="Filter frequency" nodeRef={filterRef} />
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
            <VolumeComponent name={'Master value'} volumeNode={masterVcaRef} />
            <hr />
        </div>
    );
}

export default App;
