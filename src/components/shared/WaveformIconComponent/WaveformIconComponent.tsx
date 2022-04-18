import React, { FC } from 'react';
import { WaveformEnum } from '../../../models/WaveformEnum';

type WaveformIconComponentProps = {
    waveform: OscillatorType;
};
const WaveformIconComponent: FC<WaveformIconComponentProps> = ({ waveform }) => {
    const renderWaveformIcon = (waveform: OscillatorType) => {
        switch (waveform) {
            case WaveformEnum.SQUARE:
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                        <path d="M240,128v56a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V80H32v48a8,8,0,0,1-16,0V72a8,8,0,0,1,8-8H128a8,8,0,0,1,8,8V176h88V128a8,8,0,0,1,16,0Z" />
                    </svg>
                );
            case WaveformEnum.SINE:
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                        <path d="M239.3,131.4c-22,47.2-41.4,69.3-61.3,69.3-25.1,0-40.7-33.7-57.3-69.3-13-28.2-27.8-60.1-42.7-60.1s-36.3,37.6-46.7,60.1a8.1,8.1,0,1,1-14.6-6.8C38.7,77.4,58.1,55.3,78,55.3c25.1,0,40.7,33.7,57.3,69.3,13,28.2,27.8,60.1,42.7,60.1,16.4,0,36.3-37.6,46.7-60.1a8.1,8.1,0,0,1,14.6,6.8Z" />
                    </svg>
                );
            case WaveformEnum.SAWTOOTH:
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                        <path d="M236.2,134.8l-104,64a8,8,0,0,1-8.1.2,8.1,8.1,0,0,1-4.1-7V78.3L28.2,134.8a8,8,0,0,1-8.4-13.6l104-64A8,8,0,0,1,136,64V177.7l91.8-56.5a8,8,0,0,1,8.4,13.6Z" />
                    </svg>
                );
            case WaveformEnum.TRIANGLE:
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                        <path d="M238.5,132.7l-52,72a8.1,8.1,0,0,1-13,0L76,69.7l-45.5,63a8,8,0,1,1-13-9.4l52-72a8.1,8.1,0,0,1,13,0l97.5,135,45.5-63a8,8,0,0,1,13,9.4Z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return renderWaveformIcon(waveform);
};

export default WaveformIconComponent;
