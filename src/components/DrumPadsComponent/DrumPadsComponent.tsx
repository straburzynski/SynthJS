import React, { FC, MutableRefObject, useCallback, useEffect, useState } from 'react';
import styles from './DrumPadsComponent.module.scss';
import { StringIndex } from '../../types';
import { Instrument } from '../../models/Instrument';
import { Kick } from '../../sounds/kick';
import { Snare } from '../../sounds/snare';
import { HiHat } from '../../sounds/hihat';
import { SynthEngineModel } from '../../models/SynthEngineModel';
import { Crash } from '../../sounds/crash';

const KEY_MAPPING: StringIndex = {
    z: `kick`,
    x: `snare`,
    c: `hihat_closed`,
    v: `hihat_opened`,
    b: `crash`,
};

type DrumPadsComponentProps = {
    synthEngine: MutableRefObject<SynthEngineModel>;
};
const DrumPadsComponent: FC<DrumPadsComponentProps> = ({ synthEngine }) => {
    const [activeKey, setActiveKey] = useState(new Set());

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
            switch (e.type) {
                case 'keydown':
                    if (KEY_MAPPING.hasOwnProperty(e.key) && !e.repeat && !e.metaKey) {
                        playDrumSound(KEY_MAPPING[e.key]);
                        handleActiveKey(e.key, 'add');
                    }
                    break;
                case 'keyup':
                    handleActiveKey(e.key, 'delete');
                    break;
            }
        },
        [handleActiveKey, playDrumSound]
    );

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

export default React.memo(DrumPadsComponent);
