import React, { FC, useEffect, useState } from 'react';
import './keyboardComponent.scss';
import { StringIndex } from '../../types';

type KeyboardComponentProps = {
    onHandleKey: (event: React.MouseEvent<HTMLButtonElement> | KeyboardEvent, note: string) => void;
};

const KeyboardComponent: FC<KeyboardComponentProps> = ({ onHandleKey }) => {
    const [octave, setOctave] = useState(3);

    const KEY_MAPPING: StringIndex = {
        a: `C${octave}`,
        w: `C#${octave}`,
        s: `D${octave}`,
        e: `D#${octave}`,
        d: `E${octave}`,
        f: `F${octave}`,
        t: `F#${octave}`,
        g: `G${octave}`,
        y: `G#${octave}`,
        h: `A${octave}`,
        u: `A#${octave}`,
        j: `B${octave}`,
        k: `C${octave + 1}`,
    };

    const handleKeyEvent = (e: KeyboardEvent) => {
        if (KEY_MAPPING.hasOwnProperty(e.key) && !e.repeat) {
            onHandleKey(e, KEY_MAPPING[e.key]);
        }
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
            {Object.values(KEY_MAPPING).map((note: string) => {
                return (
                    <button
                        id={note}
                        key={note}
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
