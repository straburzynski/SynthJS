import React, { useEffect, useState } from 'react';
import './keyboardComponent.scss';
import { NOTES, StringIndex } from '../../consts/Notes';

const KeyboardComponent = ({ onHandleKey }: any) => {
    const [octave, setOctave] = useState(3);

    const KEY_MAPPING: StringIndex = {
        a: `C-${octave}`,
        s: `D-${octave}`,
        d: `E-${octave}`,
        f: `F-${octave}`,
        g: `G-${octave}`,
        h: `A-${octave}`,
        j: `B-${octave}`,
        k: `C-${octave + 1}`,
        w: `C#${octave}`,
        e: `D#${octave}`,
        t: `F#${octave}`,
        y: `G#${octave}`,
        u: `A#${octave}`,
    };

    const handleKeyEvent = (e: any) => {
        if (KEY_MAPPING.hasOwnProperty(e.key) && !e.repeat) {
            onHandleKey(e, KEY_MAPPING[e.key]);
        }
    };

    const getStartIndex = () => Object.keys(NOTES).indexOf(`C-${octave}`);

    const getKeyNotes = () => {
        const startIndex = getStartIndex();
        return Object.keys(NOTES).slice(startIndex, startIndex + 13);
    };

    const handleOctaveChange = (value: number) => {
        const newOctaveValue = octave + value;
        if (newOctaveValue <= 7 && newOctaveValue >= 1) {
            setOctave((o) => o + value);
        }
    };

    useEffect(() => {
        window.addEventListener('keyup', handleKeyEvent);
        window.addEventListener('keydown', handleKeyEvent);
        return () => {
            window.removeEventListener('keyup', handleKeyEvent);
            window.removeEventListener('keydown', handleKeyEvent);
        };
    });

    return (
        <div className="keys-container">
            <button className="octave-switch" onClick={() => handleOctaveChange(-1)}>
                -
            </button>
            {getKeyNotes().map((note: any, i: number) => {
                return (
                    <button
                        id={note}
                        key={i}
                        className={note.includes('#') ? 'black' : 'white'}
                        onMouseDown={(e) => onHandleKey(e, note)}
                        onMouseUp={(e) => onHandleKey(e, note)}
                    >
                        {note}
                    </button>
                );
            })}
            <button className="octave-switch" onClick={() => handleOctaveChange(1)}>
                +
            </button>
        </div>
    );
};

export default KeyboardComponent;
