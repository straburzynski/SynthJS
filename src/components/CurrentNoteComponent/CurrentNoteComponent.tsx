import React, { FC } from 'react';
import { Note } from '@tonaljs/tonal';

type CurrentNoteComponentProps = {
    currentNote: string | undefined;
};
const CurrentNoteComponent: FC<CurrentNoteComponentProps> = ({ currentNote }) => {
    return (
        <div className="text-center">
            {currentNote ? (
                <p>
                    <strong>{currentNote}</strong>[<i> {Note.get(currentNote).freq?.toFixed(2)} Hz</i> ]
                </p>
            ) : (
                <p>---</p>
            )}
        </div>
    );
};

export default CurrentNoteComponent;
