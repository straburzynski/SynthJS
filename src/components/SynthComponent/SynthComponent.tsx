import React, { FC, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { DefaultParams } from '../../consts/DefaultParams';
import { LfoTargetEnum } from '../../models/LfoTargetEnum';
import { Note } from '@tonaljs/tonal';
import { SynthEngineModel } from '../../models/SynthEngineModel';
import AdsrComponent from '../AdsrComponent/AdsrComponent';
import DistortionComponent from '../DistortionComponent/DistortionComponent';
import DelayComponent from '../DelayComponent/DelayComponent';
import FilterComponent from '../FilterComponent/FilterComponent';
import LfoComponent from '../LfoComponent/LfoComponent';
import MasterVolumeComponent from '../MasterVolumeComponent/MasterVolumeComponent';
import OscillatorComponent from '../OscillatorComponent/OscillatorComponent';
import ReverbComponent from '../ReverbComponent/ReverbComponent';
import CurrentNoteComponent from '../CurrentNoteComponent/CurrentNoteComponent';
import useSyncState from '../../hooks/useSyncState';
import KeyboardComponent from '../KeyboardComponent/KeyboardComponent';
import './synthComponent.scss';

const SynthComponent: FC<MutableRefObject<SynthEngineModel>> = (synthEngine: MutableRefObject<SynthEngineModel>) => {
    const [primaryWaveform, setPrimaryWaveform] = useState<OscillatorType>(DefaultParams.primaryWaveform);
    const [secondaryWaveform, setSecondaryWaveform] = useState<OscillatorType>(DefaultParams.secondaryWaveform);
    const [primaryVcoDetune, setPrimaryVcoDetune] = useState<number>(DefaultParams.detune);
    const [secondaryVcoDetune, setSecondaryVcoDetune] = useState<number>(DefaultParams.detune);
    const [attack, setAttack] = useState<number>(DefaultParams.attack);
    const [decay, setDecay] = useState<number>(DefaultParams.decay);
    const [release, setRelease] = useState<number>(DefaultParams.release);
    const [sustain, setSustain] = useState<number>(DefaultParams.sustain);
    const [envelope, setEnvelope] = useState<string>('env');
    const currentNote = useSyncState<string | undefined>(undefined);
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

    const createOscillator = useCallback(
        (freq: number | null | undefined, isPrimary: boolean, detune: number) => {
            console.log('createOscillator ', isPrimary);
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
        },
        [primaryWaveform, secondaryWaveform, synthEngine]
    );

    const killOscillators = useCallback(
        (t = 0, note?: string) => {
            console.log('killOscillators');
            synthEngine.current.primaryAdsr.gain.cancelAndHoldAtTime(t);
            synthEngine.current.secondaryAdsr.gain.cancelAndHoldAtTime(t);
            synthEngine.current.filter.frequency.cancelAndHoldAtTime(t);
            if (synthEngine.current.primaryVco) {
                synthEngine.current.primaryVco.stop(t);
                synthEngine.current.primaryVco.onended = () => {
                    if (note) {
                        currentNote.set(undefined);
                    }
                };
            }
            if (synthEngine.current.secondaryVco) {
                synthEngine.current.secondaryVco.stop(t);
            }
        },
        [currentNote, synthEngine]
    );

    const handleKey = useCallback(
        (e: React.MouseEvent<HTMLButtonElement> | KeyboardEvent, note: string) => {
            console.log('handleKey');
            const envelopeOn = (vcaGain: AudioParam, a: number, d: number, s: number, envelope: string) => {
                const now = synthEngine.current.audioContext.currentTime;
                switch (envelope) {
                    case 'env':
                        vcaGain.cancelScheduledValues(0);
                        vcaGain.setValueAtTime(0, now);
                        vcaGain.linearRampToValueAtTime(1, now + a);
                        vcaGain.linearRampToValueAtTime(s, now + a + d);
                        break;
                    case 'gate':
                    default:
                        vcaGain.value = DefaultParams.adsrMax;
                        break;
                }
            };
            const envelopeOff = (vcaGain: AudioParam, r: number, envelope: string, note?: string) => {
                const now = synthEngine.current.audioContext.currentTime;
                switch (envelope) {
                    case 'env':
                        vcaGain.cancelScheduledValues(0);
                        vcaGain.setValueAtTime(vcaGain.value, now);
                        vcaGain.linearRampToValueAtTime(0, now + r);
                        killOscillators(now + r, note);
                        break;
                    case 'gate':
                    default:
                        vcaGain.value = 0;
                        killOscillators(now, note);
                        break;
                }
            };

            const s = synthEngine.current;
            switch (e.type) {
                case 'mousedown':
                case 'keydown':
                    console.log('note on: ', note);
                    currentNote.set(note);
                    killOscillators();
                    const freq = Note.get(note).freq;
                    document.getElementById(note)?.classList.add('active');
                    s.primaryVco = createOscillator(freq, true, primaryVcoDetune);
                    s.secondaryVco = createOscillator(freq, false, secondaryVcoDetune);
                    envelopeOn(s.primaryAdsr.gain, attack, decay, sustain, envelope);
                    envelopeOn(s.secondaryAdsr.gain, attack, decay, sustain, envelope);
                    s.primaryVco.start();
                    s.secondaryVco.start();
                    break;
                case 'mouseup':
                case 'keyup':
                    console.log('note off: ', note);
                    document.getElementById(note)?.classList.remove('active');
                    console.log('currentNote', currentNote);
                    console.log('note', note);
                    if (currentNote.get() === note) {
                        envelopeOff(s.primaryAdsr.gain, release, envelope, note);
                        envelopeOff(s.secondaryAdsr.gain, release, envelope, note);
                        break;
                    }
            }
        },
        [
            attack,
            createOscillator,
            currentNote,
            decay,
            envelope,
            killOscillators,
            primaryVcoDetune,
            release,
            secondaryVcoDetune,
            sustain,
            synthEngine,
        ]
    );

    return (
        <div className="synth-wrapper">
            <div className="container">
                <div className="flex-100">
                    <KeyboardComponent onHandleKey={handleKey} />
                </div>
                <div className="flex-30">
                    <p className='text-center'>Current note:</p>
                    <hr />
                    <CurrentNoteComponent currentNote={currentNote.get()} />
                    <hr />
                </div>
                <div className="flex-100">
                    <canvas className="visualizer" width="500" height="100" ref={canvasRef} />
                </div>
            </div>
            <br />

            <div className="first container">
                <div className="flex-100">
                    <OscillatorComponent
                        synthEngine={synthEngine}
                        primary={true}
                        detune={primaryVcoDetune}
                        setDetune={setPrimaryVcoDetune}
                        waveform={primaryWaveform}
                        setWaveform={setPrimaryWaveform}
                    />
                </div>
                <div className="flex-100">
                    <OscillatorComponent
                        synthEngine={synthEngine}
                        primary={false}
                        detune={secondaryVcoDetune}
                        setDetune={setSecondaryVcoDetune}
                        waveform={secondaryWaveform}
                        setWaveform={setSecondaryWaveform}
                    />
                </div>
                <div className="flex-100">
                    <AdsrComponent
                        attack={attack}
                        setAttack={setAttack}
                        decay={decay}
                        setDecay={setDecay}
                        sustain={sustain}
                        setSustain={setSustain}
                        release={release}
                        setRelease={setRelease}
                        envelope={envelope}
                        setEnvelope={setEnvelope}
                    />
                </div>
                <div className="flex-100">
                    <FilterComponent synthEngine={synthEngine} />
                </div>
            </div>
            <div className="second container">
                <div className="flex-100">
                    <LfoComponent synthEngine={synthEngine} lfoTarget={LfoTargetEnum.FREQUENCY} />
                </div>
                <div className="flex-100">
                    <LfoComponent synthEngine={synthEngine} lfoTarget={LfoTargetEnum.VCA} />
                </div>
                <div className="flex-50">
                    <DistortionComponent synthEngine={synthEngine} />
                </div>
                <div className="flex-50">
                    <DelayComponent synthEngine={synthEngine} />
                </div>
                <div className="flex-50">
                    <ReverbComponent synthEngine={synthEngine} />
                </div>
                <div className="flex-30">
                    <MasterVolumeComponent masterVcaNode={synthEngine.current.masterVca} />
                </div>
            </div>
        </div>
    );
};

export default SynthComponent;
