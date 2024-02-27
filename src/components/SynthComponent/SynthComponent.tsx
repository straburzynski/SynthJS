import React, { FC, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { LfoTargetEnum } from '../../models/LfoTargetEnum';
import { Midi as TonaljsMidi, Note } from '@tonaljs/tonal';
import { SynthEngineModel } from '../../models/SynthEngineModel';
import AdsrComponent from '../AdsrComponent/AdsrComponent';
import DistortionComponent from '../DistortionComponent/DistortionComponent';
import DelayComponent from '../DelayComponent/DelayComponent';
import FilterComponent from '../FilterComponent/FilterComponent';
import LfoComponent from '../LfoComponent/LfoComponent';
import MasterVolumeComponent from '../MasterVolumeComponent/MasterVolumeComponent';
import OscillatorComponent from '../OscillatorComponent/OscillatorComponent';
import ReverbComponent from '../ReverbComponent/ReverbComponent';
import ControlsComponent from '../ControlsComponent/ControlsComponent';
import CurrentNoteComponent from '../CurrentNoteComponent/CurrentNoteComponent';
import useSyncState from '../../hooks/useSyncState';
import LogoComponent from '../LogoComponent/LogoComponent';
import { Midi as TonejsMidi } from '@tonejs/midi';
import { MidiFileModel } from '../../models/MidiFileModel';
import { MidiMessageModel } from '../../models/MidiMessageModel';
import { NOTE_OFF, NOTE_ON } from '../../consts/MidiMessageCodes';
import { SynthParametersModel } from '../../models/SynthParametersModel';
import DrumPadsComponent from '../DrumPadsComponent/DrumPadsComponent';
import { midiMessageConverter } from '../../services/Converter';
import { ADSRModel } from '../../models/ADSRModel';
import { namesOfOscillators } from '../../services/SynthEngineFactory';
import './synthComponent.scss';

type SynthComponentProps = {
    synthEngine: MutableRefObject<SynthEngineModel>;
    synthParameters: MutableRefObject<SynthParametersModel>;
};

const SynthComponent: FC<SynthComponentProps> = ({ synthEngine, synthParameters }) => {
    // todo make player with start, stop
    const [midi, setMidi] = useState<MidiFileModel | undefined>(undefined);
    const [midiDevice, setMidiDevice] = useState<MIDIInput>();
    const [, setMidiDeviceList] = useState<MIDIInput[]>([]);
    const currentNote = useSyncState<string | undefined>(undefined);
    const canvasRef = useRef<any>();
    const fileUploadRef = useRef<any>();

    useEffect(() => {
        const getAnalyserData = () => {
            synthEngine.current.analyserNode.getByteTimeDomainData(synthEngine.current.analyserData);
            return synthEngine.current.analyserData;
        };
        // todo select node to connect
        // todo switchable to eq analyser
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
        (freq: number | null | undefined, oscName: string, detune: number) => {
            console.log('createOscillator ', oscName);
            if (freq == null) {
                throw new Error('Unrecognized note');
            } else {
                const osc = synthEngine.current.audioContext.createOscillator();
                osc.type = synthParameters.current.oscillatorsParams.get(oscName)!.waveForm;
                osc.frequency.value = freq;
                osc.detune.value = detune;
                osc.connect(synthEngine.current.oscillatorsGroup.get(oscName)!.adsrNode);
                return osc;
            }
        },
        [synthEngine, synthParameters]
    );

    const killOscillators = useCallback(
        (t = 0, note?: string) => {
            const s = synthEngine.current;
            s.oscillatorsGroup.forEach((oscValue, oscName) => {
                oscValue.adsrNode.gain.cancelAndHoldAtTime && oscValue.adsrNode.gain.cancelAndHoldAtTime(t);
                if (oscValue.vcoNode) {
                    oscValue.vcoNode.stop(t);
                    oscValue.vcoNode.onended = () => {
                        if (note) currentNote.set(undefined);
                    };
                }
            });
            s.filter.frequency.cancelAndHoldAtTime && s.filter.frequency.cancelAndHoldAtTime(t);
        },
        [currentNote, synthEngine]
    );

    const envelopeOn = useCallback(
        (vcaGain: AudioParam, adsr: ADSRModel, envelope: string) => {
            const now = synthEngine.current.audioContext.currentTime;
            switch (envelope) {
                case 'env':
                    vcaGain.cancelScheduledValues(0);
                    vcaGain.setValueAtTime(0, now);
                    vcaGain.linearRampToValueAtTime(1, now + adsr.attack);
                    vcaGain.linearRampToValueAtTime(adsr.sustain, now + adsr.attack + adsr.decay);
                    break;
                case 'gate':
                default:
                    vcaGain.setValueAtTime(1, now);
                    break;
            }
        },
        [synthEngine]
    );

    const envelopeOff = useCallback(
        (vcaGain: AudioParam, r: number, envelope: string, note?: string) => {
            const now = synthEngine.current.audioContext.currentTime;
            switch (envelope) {
                case 'env':
                    vcaGain.cancelScheduledValues(0);
                    vcaGain.setValueAtTime(vcaGain.value, now);
                    vcaGain.linearRampToValueAtTime(0, now + r);
                    console.log(`killOscillators env, note: ${note}`);
                    killOscillators(now + r, note);
                    break;
                case 'gate':
                default:
                    vcaGain.value = 0;
                    console.log(`killOscillators gate, note: ${note}`);
                    killOscillators(now, note);
                    break;
            }
        },
        [synthEngine, killOscillators]
    );

    const playNote = useCallback(
        (note: string) => {
            const engine = synthEngine.current;
            const params = synthParameters.current;
            console.log('Note on: ', note);
            currentNote.set(note);
            killOscillators();
            const freq = Note.get(note).freq;
            const actives = document.querySelectorAll('.btn-active');
            actives.forEach((a) => a.id !== currentNote.get() && a.classList.remove('btn-active'));
            Array.from(document.getElementsByClassName(note)).forEach((el) => el.classList.add('btn-active'));
            engine.oscillatorsGroup.forEach((_oscValue, oscName) => {
                engine.oscillatorsGroup.get(oscName)!.vcoNode = createOscillator(
                    freq,
                    oscName,
                    params.oscillatorsParams.get(oscName)!.detune
                );
            });
            engine.oscillatorsGroup.forEach((_oscValue, oscName) => {
                console.log('play note - osc', oscName);
                envelopeOn(engine.oscillatorsGroup.get(oscName)!.adsrNode.gain, params.adsr, params.envelope);
                engine.oscillatorsGroup.get(oscName)!.vcoNode.start();
            });
        },
        [createOscillator, currentNote, envelopeOn, killOscillators, synthEngine, synthParameters]
    );

    const stopNote = useCallback(
        (note: string) => {
            const engine = synthEngine.current;
            const params = synthParameters.current;
            console.log('Note off: ', note);
            Array.from(document.getElementsByClassName(note)).forEach((el) => {
                el.id !== currentNote.get() && el.classList.remove('btn-active');
            });
            console.log('Current note', currentNote.get());
            if (currentNote.get() === note) {
                engine.oscillatorsGroup.forEach((_oscValue, oscName) => {
                    envelopeOff(engine.oscillatorsGroup.get(oscName)!.adsrNode.gain, params.adsr.release, note);
                });
            }
        },
        [currentNote, envelopeOff, synthEngine, synthParameters]
    );

    const handleKey = useCallback(
        (e: React.MouseEvent<HTMLElement> | KeyboardEvent | MidiMessageModel, note: string) => {
            console.log('handleKey synth', e);
            switch (e.type) {
                case 'mousedown':
                case 'keydown':
                case NOTE_ON:
                    playNote(note);
                    break;
                case 'mouseup':
                case 'keyup':
                case NOTE_OFF:
                    stopNote(note);
                    break;
            }
        },
        [playNote, stopNote]
    );

    useEffect(() => {
        const onMidiMessageEvent = (midiMessageEvent: MIDIMessageEvent) => {
            if (midiMessageEvent.data && [NOTE_ON, NOTE_OFF].includes(midiMessageEvent.data[0])) {
                console.log('Raw midi message for synthesizer', midiMessageEvent);
                const midiMessage = midiMessageConverter(midiMessageEvent);
                console.log('Parsed midi message for synthesizer', midiMessage);
                const note = TonaljsMidi.midiToNoteName(midiMessage.note, { sharps: true });
                handleKey(midiMessage, note);
            }
        };
        midiDevice?.addEventListener('midimessage', onMidiMessageEvent);
        return () => {
            midiDevice?.removeEventListener('midimessage', onMidiMessageEvent);
        };
    }, [handleKey, midiDevice]);

    useEffect(() => {
        console.log('Initialize midi devices');
        const onMidiStateChange = (midiAccess: MIDIAccess) => {
            const midiInputs = Array.from(midiAccess.inputs.values());
            console.log(
                'Found midi devices',
                midiInputs.map((d) => `${d.manufacturer} - ${d.name}`)
            );
            setMidiDeviceList(midiInputs);
            // todo make dropdown menu for midi device selection
            midiInputs.length > 0 && setMidiDevice(midiInputs[0]);
        };

        if (!('requestMIDIAccess' in navigator)) {
            console.log('Error - cannot run midi on this browser');
        } else {
            navigator.requestMIDIAccess().then((midiAccess: MIDIAccess) => {
                onMidiStateChange(midiAccess);
                midiAccess.onstatechange = (e: Event) => onMidiStateChange(e.target as MIDIAccess);
            });
        }
    }, []);

    async function handlePlay() {
        const sleep = (s: number) => new Promise((r) => setTimeout(r, s));
        const playAndStopNote = async (note: string, stopAfterMs: number) => {
            playNote(note);
            setTimeout(() => stopNote(note), stopAfterMs);
        };
        console.log('Play midi file', { midi });
        const notes = midi?.midi.tracks[0].notes;
        const bpm = midi?.midi.header.tempos[0]?.bpm || 120;
        const ppq = midi?.midi.header.ppq; // Pulses Per Quarter
        if (notes == null || ppq == null) return;
        const tickMsValue = 60000 / (bpm * ppq);

        let currentTime = 0;

        for (let i = 0; i < notes.length; i++) {
            await sleep(notes[i].ticks * tickMsValue - currentTime);
            currentTime = notes[i].ticks * tickMsValue;
            const currentNote = TonaljsMidi.midiToNoteName(notes[i].midi, { sharps: true });
            playAndStopNote(currentNote, notes[i].durationTicks * tickMsValue);
        }
    }

    const handleClear = () => {
        fileUploadRef.current.value = '';
        setMidi(undefined);
    };

    const handleLoadMidiFile = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const files = (e.target as HTMLInputElement).files;
        if (files && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                const midiJson = new TonejsMidi(e.target?.result as ArrayBuffer);
                const midi = { midi: midiJson, name: file.name };
                setMidi(midi);
                console.log(midi);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    return (
        <div className="synth-wrapper">
            <div className="container">
                <div className="flex-100">
                    <LogoComponent />
                </div>
                <div className="flex-30">
                    <p className="text-center">Current note:</p>
                    <hr />
                    <CurrentNoteComponent currentNote={currentNote.get()} />
                    <hr />
                </div>
                <div className="flex-100">
                    <canvas className="visualizer" width="500" height="100" ref={canvasRef} />
                </div>
            </div>
            <div className="first container">
                {namesOfOscillators.map((oscName) => (
                    <div className="flex-100" key={oscName}>
                        <OscillatorComponent
                            synthEngine={synthEngine}
                            synthParameters={synthParameters}
                            oscName={oscName}
                        />
                    </div>
                ))}
                <div className="flex-100">
                    <AdsrComponent synthParameters={synthParameters} />
                </div>
                <div className="flex-100">
                    <FilterComponent synthEngine={synthEngine} />
                </div>
            </div>
            <div className="second container">
                <div className="flex-100">
                    <LfoComponent synthEngine={synthEngine} lfoTarget={LfoTargetEnum.FREQUENCY} levelStep={500} />
                </div>
                <div className="flex-100">
                    <LfoComponent synthEngine={synthEngine} lfoTarget={LfoTargetEnum.VCA} levelStep={0.05} />
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
            <div className="third container">
                <div className="flex-100">
                    <ControlsComponent onHandleKey={handleKey} />
                </div>
            </div>
            <div className="fourth container">
                <div className="flex-100">
                    <DrumPadsComponent synthEngine={synthEngine} midiDevice={midiDevice} />
                </div>
            </div>
            <div className="container">
                <div className="flex-100">
                    <div className="custom-input">
                        <input
                            ref={fileUploadRef}
                            id="file-upload"
                            onChange={handleLoadMidiFile}
                            type="file"
                            accept="*.mid, *.midi"
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="file-upload">Upload midi file</label>
                        {midi && (
                            <>
                                <div className="midi-name">{midi.name}</div>
                                <div
                                    className="button1"
                                    onClick={handleClear}
                                    style={{ display: 'inline-block', padding: '3px 10px', marginLeft: '10px' }}
                                >
                                    X
                                </div>
                                <div
                                    className="button1"
                                    onClick={handlePlay}
                                    style={{ display: 'inline-block', padding: '3px 20px', marginLeft: '20px' }}
                                >
                                    Play
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex-100">
                    <p>
                        <a className="link" href="https://github.com/straburzynski/synth-js">
                            https://github.com/straburzynski/synth-js
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default React.memo(SynthComponent);
