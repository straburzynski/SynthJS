import React, { FC, MutableRefObject, useCallback, useEffect } from 'react';
import styles from './DrumPadsComponent.module.scss';
import { StringIndex } from '../../types';
import { Instrument } from '../../models/Instrument';
import { Kick } from '../../sounds/kick';
import { Snare } from '../../sounds/snare';
import { HiHat } from '../../sounds/hihat';
import { SynthEngineModel } from '../../models/SynthEngineModel';

const KEY_MAPPING: StringIndex = {
    z: `kick`,
    x: `snare`,
    c: `hihat_closed`,
    v: `hihat_opened`,
};

type DrumPadsComponentProps = {
    synthEngine: MutableRefObject<SynthEngineModel>;
};
const DrumPadsComponent: FC<DrumPadsComponentProps> = ({ synthEngine }) => {
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
                default:
                    throw Error(`Unrecognized drum sound ${sound}`);
            }
            sample.trigger(synthEngine.current.audioContext.currentTime);
        },
        [synthEngine]
    );

    const handleMouseEvent = useCallback(
        (e: React.MouseEvent<HTMLDivElement>, sound: string) => {
            if (e.type === 'mousedown') {
                // todo set button active
                playDrumSound(sound);
            } else if (e.type === 'mouseup') {
                // todo unset button active
            }
        },
        [playDrumSound]
    );

    const handleKeyEvent = useCallback(
        (e: KeyboardEvent) => {
            switch (e.type) {
                case 'keydown':
                    // todo set button active
                    if (KEY_MAPPING.hasOwnProperty(e.key) && !e.repeat && !e.metaKey) {
                        playDrumSound(KEY_MAPPING[e.key]);
                    }
                    break;
                case 'keyup':
                    // todo unset button active
                    break;
            }
        },
        [playDrumSound]
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
                            onMouseDown={(e) => handleMouseEvent(e, value)}
                            onMouseUp={(e) => handleMouseEvent(e, value)}
                        >
                            <div className={`${styles.controlBtn} ${value} ${styles.white}`}>
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
