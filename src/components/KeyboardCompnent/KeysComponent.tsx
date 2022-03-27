import React, { useState } from 'react';
import './keyComponent.scss';
import { NOTES } from '../../consts/Notes';

const KeysComponent = ({ onHandleKey }: any) => {
    const handleKey = (e: any, note: any) => {
        onHandleKey(e, note);
    };
    const [octave, setOctave] = useState(3);

    const getKeyNotes = () => {
        const startIndex = Object.keys(NOTES).indexOf(`C-${octave}`);
        return Object.keys(NOTES).slice(startIndex, startIndex + 13);
    };

    return (
        <div className="keys-container">
            {getKeyNotes().map((note: any, i: number) => {
                return (
                    <button
                        id={note}
                        key={i}
                        className={note.includes('#') ? 'black' : 'white'}
                        onMouseDown={(e) => handleKey(e, note)}
                        onMouseUp={(e) => handleKey(e, note)}
                    >
                        {note}
                    </button>
                );
            })}
        </div>
    );
};

export default KeysComponent;
