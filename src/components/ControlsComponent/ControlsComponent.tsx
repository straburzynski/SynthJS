import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Scale } from '@tonaljs/tonal';
import { StringIndex } from '../../types';
import styles from './ControlsComponent.module.scss';

const KEY_MAPPING: StringIndex = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k'];
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const SCALE_NAMES = ['major', 'minor', 'melodic minor', 'aeolian', 'dorian', 'flamenco', 'locrian', 'lydian', 'oriental', 'persian', 'phrygian'];
const normalizeNotes = (noteName: string) => noteName
    .replace('Cb', 'B')
    .replace('Db', 'C#')
    .replace('Eb', 'D#')
    .replace('Gb', 'F#')
    .replace('Ab', 'G#')
    .replace('Bb', 'A#')
    .replace('E#', 'F')
    .replace('B#', 'A')
    .replace('C##', 'D')
    .replace('D##', 'E')
    .replace('F##', 'G')
    .replace('G##', 'A')
    .replace('A##', 'B');

type ControlsComponentProps = {
    onHandleKey: (event: React.MouseEvent<HTMLElement> | KeyboardEvent, note: string) => void;
};

const ControlsComponent: FC<ControlsComponentProps> = ({ onHandleKey }) => {
    const [octave, setOctave] = useState(3);
    const [rootNote, setRootNote] = useState('C');
    const [scale, setScale] = useState('major');
    const updateScaleRange = (rootNote: string = 'C', scale: string = 'major', octave: number = 3) => {
        return Scale.rangeOf(`${rootNote} ${scale}`)(`${rootNote}${octave + 1}`, `${rootNote}${octave + 2}`)
            .concat(Scale.rangeOf(`${rootNote} ${scale}`)(`${rootNote}${octave}`, `${rootNote}${octave + 1}`));
    };
    const [notes, setNotes] = useState(updateScaleRange);

    const keyMapping = useMemo((): StringIndex => {
        return KEY_MAPPING.reduce((a: any, v: number) => ({ ...a, [v]: notes[KEY_MAPPING.indexOf(v)] }), {});
    }, [notes]);

    const handleKeyEvent = useCallback(
        (e: KeyboardEvent) => {
            console.log(e);
            if (keyMapping.hasOwnProperty(e.key) && !e.repeat && !e.metaKey) {
                onHandleKey(e, keyMapping[e.key]);
            }
        },
        [keyMapping, onHandleKey],
    );



    useEffect(() => {
        setNotes(updateScaleRange(rootNote, scale, octave));
    }, [octave, rootNote, scale]);

    useEffect(() => {
        window.addEventListener('keyup', handleKeyEvent);
        window.addEventListener('keydown', handleKeyEvent);
        return () => {
            window.removeEventListener('keyup', handleKeyEvent);
            window.removeEventListener('keydown', handleKeyEvent);
        };
    }, [handleKeyEvent]);

    const handleRootNoteChange = (note: string) => {
        setRootNote(note);
    };
    const handleScaleChange = (scale: string) => {
        setScale(scale);
    };

    const handleOctaveChange = (inc: number) => {
        const newValue = octave + inc;
        if (newValue > 0 && newValue <= 6) {
            setOctave(newValue);
        }
    };

    return (
        <div className='component-wrapper'>
            <div className={styles.title + ' teal'}>
                <span>Keyboard</span>

                <span className="margin-left-50">Octave: </span>
                <button className='button1' onClick={() => handleOctaveChange(-1)}>-</button>
                <span>{octave}</span>
                <button className='button1' onClick={() => handleOctaveChange(+1)}>+</button>

                <span className="margin-left-50">Root note: </span>
                <div className='dropdown'>
                    <button className='dropbtn'>{rootNote}</button>
                    <div className='dropdown-content'>
                        {NOTE_NAMES.map(note =>
                            <span key={note} onClick={() => handleRootNoteChange(note)}>{note}</span>,
                        )}
                    </div>
                </div>

                <span className="margin-left-50">Scale: </span>
                <div className='dropdown'>
                    <button className='dropbtn'>{scale}</button>
                    <div className='dropdown-content'>
                        {SCALE_NAMES.map(scale =>
                            <span key={scale} onClick={() => handleScaleChange(scale)}>{scale}</span>,
                        )}
                    </div>
                </div>

            </div>
            <div className={styles.parentWrapper}>
                <div className={styles.parent}>
                    {Object.entries(keyMapping).map(([key, value]) =>
                        <div
                            id={key}
                            key={key + value}
                            className={styles.child}
                            onMouseDown={(e) => onHandleKey(e, value)}
                            onMouseUp={(e) => onHandleKey(e, value)}
                        >
                            <div className={`${styles.controlBtn} ${value}`}>
                                <p className={styles.label}>
                                    {key} - {normalizeNotes(value)}
                                </p>
                            </div>
                        </div>,
                    )}
                </div>
            </div>
        </div>
    );
};

export default React.memo(ControlsComponent);
