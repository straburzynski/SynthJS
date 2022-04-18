import React, { FC } from 'react';
import { Note } from '@tonaljs/tonal';
import styles from './CurrentNoteComponent.module.scss';

type CurrentNoteComponentProps = {
    currentNote: string | undefined;
};
const CurrentNoteComponent: FC<CurrentNoteComponentProps> = ({ currentNote }) => {
    return (
        <div className={styles.textCenter}>
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
