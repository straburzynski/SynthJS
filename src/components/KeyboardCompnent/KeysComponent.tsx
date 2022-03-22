import React from 'react';
import './keyComponent.scss';

const KeysComponent = ({ onHandleKey }: any) => {
    const handleKey = (e: any, note: any) => {
        onHandleKey(e, note);
    };
    const selectedNotes = ['C-3', 'C#3', 'D-3', 'D#3', 'E-3', 'F-3', 'F#3', 'G-3', 'G#3', 'A-3', 'A#3', 'B-3', 'C-4'];

    return (
        <div className="keys-container">
            {selectedNotes.map((note: any, i: number) => {
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
