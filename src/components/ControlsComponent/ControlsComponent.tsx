import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Scale } from '@tonaljs/tonal';
import { StringIndex } from '../../types';
import styles from './ControlsComponent.module.scss';

const KEY_MAPPING: StringIndex = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k'];

type ControlsComponentProps = {
    onHandleKey: (event: React.MouseEvent<HTMLElement> | KeyboardEvent, note: string) => void;
};

const ControlsComponent: FC<ControlsComponentProps> = ({ onHandleKey }) => {
    console.log('-- ControlsComponent render --');
    const [octave, setOctave] = useState(3);
    const [notes, setNotes] = useState(
        Scale.rangeOf('C major')(`C${octave + 1}`, `C${octave + 2}`).concat(
            Scale.rangeOf('C major')(`C${octave}`, `C${octave + 1}`)
        )
    );

    const keyMappingObject = useMemo((): StringIndex => {
        return KEY_MAPPING.reduce((a: any, v: number) => ({ ...a, [v]: notes[KEY_MAPPING.indexOf(v)] }), {});
    }, [notes]);

    const [keyMapping, setKeyMapping] = useState(keyMappingObject);

    const handleKeyEvent = useCallback(
        (e: KeyboardEvent) => {
            console.log(e);
            if (keyMapping.hasOwnProperty(e.key) && !e.repeat && !e.metaKey) {
                onHandleKey(e, keyMapping[e.key]);
            }
        },
        [keyMapping, onHandleKey]
    );

    useEffect(() => {
        window.addEventListener('keyup', handleKeyEvent);
        window.addEventListener('keydown', handleKeyEvent);
        return () => {
            window.removeEventListener('keyup', handleKeyEvent);
            window.removeEventListener('keydown', handleKeyEvent);
        };
    }, [handleKeyEvent]);

    return (
        <div className="component-wrapper">
            <p className="title teal">Keyboard</p>
            <div className={styles.parentWrapper}>
                <div className={styles.parent}>
                    {Object.entries(keyMapping).map(([key, value]) => {
                        return (
                            <div
                                id={key}
                                key={key + value}
                                className={styles.child}
                                onMouseDown={(e) => onHandleKey(e, value)}
                                onMouseUp={(e) => onHandleKey(e, value)}
                            >
                                <div className={`${styles.controlBtn} ${value}`}>
                                    <p className={styles.label}>
                                        {key} - {value}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default React.memo(ControlsComponent);
