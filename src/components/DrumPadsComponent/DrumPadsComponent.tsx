import React, { FC, MutableRefObject, useCallback, useEffect, useState } from 'react';
import styles from './DrumPadsComponent.module.scss';
import { StringIndex } from '../../types';
import { Instrument } from '../../models/Instrument';
import { Kick } from '../../sounds/kick';
import { Snare } from '../../sounds/snare';
import { HiHat } from '../../sounds/hihat';
import { SynthEngineModel } from '../../models/SynthEngineModel';
import { Crash } from '../../sounds/crash';
import { NOTE_CC, VOL_MAX, VOL_MIN } from '../../consts/MidiMessageCodes';
import { midiMessageConverter } from '../../services/Converter';
import { MidiMessageModel } from '../../models/MidiMessageModel';

const KEY_MAPPING: StringIndex = {
    z: `kick`,
    x: `snare`,
    c: `hihat_closed`,
    v: `hihat_opened`,
    b: `crash`,
};

type DrumPadsComponentProps = {
    synthEngine: MutableRefObject<SynthEngineModel>;
    midiDevice: MIDIInput | undefined;
};
const DrumPadsComponent: FC<DrumPadsComponentProps> = ({ synthEngine, midiDevice }) => {
    const [activeKey, setActiveKey] = useState<Set<string>>(new Set());

    const playDrumSound = useCallback(
        (sound: string) => {
            let sample: Instrument;
            switch (sound) {
                case 'kick':
                    sample = new Kick(synthEngine);
                    break;
                case 'snare':
                    sample = new Snare(synthEngine);
                    break;
                case 'hihat_closed':
                    sample = new HiHat(synthEngine, false);
                    break;
                case 'hihat_opened':
                    sample = new HiHat(synthEngine, true);
                    break;
                case 'crash':
                    sample = new Crash(synthEngine);
                    break;
                default:
                    throw Error(`Unrecognized drum sound ${sound}`);
            }
            sample.trigger(synthEngine.current.audioContext.currentTime);
        },
        [synthEngine]
    );

    const handleActiveKey = useCallback(
        (key: string, operation: string) => {
            const newSet = new Set(activeKey);
            switch (operation) {
                case 'add':
                    setActiveKey(newSet.add(key));
                    break;
                case 'delete':
                    newSet.delete(key);
                    setActiveKey(newSet);
                    break;
            }
        },
        [activeKey, setActiveKey]
    );

    const handleMouseEvent = useCallback(
        (e: React.MouseEvent<HTMLDivElement>, key: string) => {
            if (e.type === 'mousedown') {
                playDrumSound(KEY_MAPPING[key]);
                handleActiveKey(key, 'add');
            } else if (e.type === 'mouseup') {
                handleActiveKey(key, 'delete');
            }
        },
        [handleActiveKey, playDrumSound]
    );

    const handleKeyEvent = useCallback(
        (e: KeyboardEvent) => {
            if (KEY_MAPPING.hasOwnProperty(e.key) && !e.repeat && !e.metaKey) {
                console.log('handleKey drums', e);
                switch (e.type) {
                    case 'keydown':
                        playDrumSound(KEY_MAPPING[e.key]);
                        handleActiveKey(e.key, 'add');
                        break;
                    case 'keyup':
                        handleActiveKey(e.key, 'delete');
                        break;
                }
            }
        },
        [handleActiveKey, playDrumSound]
    );

    useEffect(() => {
        const onMidiMessageEvent = (midiMessageEvent: MIDIMessageEvent) => {
            if (!midiMessageEvent.data) return;
            const midiMessage: MidiMessageModel = midiMessageConverter(midiMessageEvent);
            if ([NOTE_CC].includes(midiMessage.type)) {
                const drumSoundsArray: string[] = Object.values(KEY_MAPPING);
                if (midiMessage.note in drumSoundsArray) {
                    console.log('raw midi message CC', midiMessageEvent);
                    // todo simplify with better key mapping object
                    const key =
                        Object.keys(KEY_MAPPING)[Object.values(KEY_MAPPING).indexOf(drumSoundsArray[midiMessage.note])];
                    if (midiMessage.velocity > VOL_MIN && midiMessageEvent.eventPhase < VOL_MAX) {
                        playDrumSound(drumSoundsArray[midiMessage.note]);
                        handleActiveKey(key, 'add');
                    } else if (midiMessage.velocity === VOL_MIN) {
                        handleActiveKey(key, 'delete');
                    }
                }
            }
        };
        midiDevice?.addEventListener('midimessage', onMidiMessageEvent);
        return () => {
            midiDevice?.removeEventListener('midimessage', onMidiMessageEvent);
        };
    }, [handleActiveKey, midiDevice, playDrumSound]);

    useEffect(() => {
        console.log('DrumPadsComponent render');
        window.addEventListener('keyup', handleKeyEvent);
        window.addEventListener('keydown', handleKeyEvent);
        return () => {
            window.removeEventListener('keyup', handleKeyEvent);
            window.removeEventListener('keydown', handleKeyEvent);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="component-wrapper">
            <div className={styles.title + ' orange'}>
                <span>Drum pads</span>
            </div>
            <div className={styles.parentWrapper}>
                <div className={styles.parent}>
                    {Object.entries(KEY_MAPPING).map(([key, value]) => (
                        <div
                            id={value}
                            key={key + value}
                            className={styles.child}
                            onMouseDown={(e) => handleMouseEvent(e, key)}
                            onMouseUp={(e) => handleMouseEvent(e, key)}
                        >
                            <div
                                className={`${styles.controlBtn} ${value} ${styles.white} ${activeKey.has(key) ? ' btn-active' : ''}`}
                            >
                                <p className={styles.label}>
                                    {key} - {value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DrumPadsComponent;
