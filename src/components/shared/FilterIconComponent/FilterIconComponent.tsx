import React, { FC } from 'react';
import { FilterTypeEnum } from '../../../models/FilterTypeEnum';

type FilterIconComponentProps = {
    filter: FilterTypeEnum;
};
const FilterIconComponent: FC<FilterIconComponentProps> = ({ filter }) => {
    const renderFilterIcon = (filter: FilterTypeEnum) => {
        switch (filter) {
            case FilterTypeEnum.HIGHPASS:
                return (
                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                        <g
                            transform="translate(0.000000,256.000000) scale(0.100000,-0.100000)"
                            fill="#ffffff"
                            stroke="none"
                        >
                            <path d="M320 1360 l0 -880 1040 0 1040 0 0 80 0 80 -747 1 c-496 1 -719 5 -663 10 248 26 386 108 477 285 71 138 96 244 158 669 50 346 86 475 132 475 9 0 66 -49 127 -108 151 -147 246 -192 438 -208 l78 -7 0 82 0 81 -42 0 c-66 0 -170 26 -229 55 -36 18 -86 60 -149 126 -131 135 -201 164 -295 120 -119 -55 -155 -158 -225 -636 -107 -733 -158 -784 -782 -785 l-198 0 0 720 0 720 -80 0 -80 0 0 -880z" />
                        </g>
                    </svg>
                );
            case FilterTypeEnum.LOWPASS:
                return (
                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                        <g
                            transform="translate(0.000000,256.000000) scale(0.100000,-0.100000)"
                            fill="#ffffff"
                            stroke="none"
                        >
                            <path d="M320 1360 l0 -880 1040 0 1040 0 0 159 0 158 -272 6 c-301 6 -381 17 -484 67 -117 57 -189 163 -239 353 -13 51 -43 218 -65 372 -47 326 -69 423 -109 502 -34 67 -71 106 -123 127 -94 40 -169 7 -282 -124 -45 -52 -100 -107 -123 -122 -44 -30 -137 -58 -190 -58 l-33 0 0 160 0 160 -80 0 -80 0 0 -880z m762 684 c30 -51 57 -176 93 -434 41 -286 58 -376 92 -485 96 -309 267 -441 613 -474 52 -5 -202 -9 -657 -10 l-743 -1 0 558 0 558 93 12 c162 21 255 81 401 255 55 66 79 71 108 21z" />
                        </g>
                    </svg>
                );
            case FilterTypeEnum.BANDPASS:
                return (
                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                        <g
                            transform="translate(0.000000,256.000000) scale(0.100000,-0.100000)"
                            fill="#ffffff"
                            stroke="none"
                        >
                            <path d="M320 1360 l0 -880 1040 0 1040 0 0 80 0 80 -960 0 -960 0 0 80 0 80 70 0 c188 0 381 39 477 97 185 110 245 255 323 778 40 267 69 395 90 395 5 0 18 -29 29 -63 19 -62 31 -132 86 -479 48 -308 103 -456 206 -559 105 -105 252 -153 507 -166 l132 -6 0 80 0 80 -133 6 c-212 10 -334 50 -407 134 -73 83 -111 213 -165 569 -64 420 -93 507 -185 554 -81 41 -161 13 -210 -73 -49 -85 -66 -158 -120 -522 -68 -453 -130 -572 -329 -631 -59 -17 -205 -34 -298 -34 l-73 0 0 640 0 640 -80 0 -80 0 0 -880z" />
                        </g>
                    </svg>
                );
            // case WaveformEnum.SINE:
            //     return (
            //         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
            //             <path d="M239.3,131.4c-22,47.2-41.4,69.3-61.3,69.3-25.1,0-40.7-33.7-57.3-69.3-13-28.2-27.8-60.1-42.7-60.1s-36.3,37.6-46.7,60.1a8.1,8.1,0,1,1-14.6-6.8C38.7,77.4,58.1,55.3,78,55.3c25.1,0,40.7,33.7,57.3,69.3,13,28.2,27.8,60.1,42.7,60.1,16.4,0,36.3-37.6,46.7-60.1a8.1,8.1,0,0,1,14.6,6.8Z" />
            //         </svg>
            //     );
            // case WaveformEnum.SAWTOOTH:
            //     return (
            //         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
            //             <path d="M236.2,134.8l-104,64a8,8,0,0,1-8.1.2,8.1,8.1,0,0,1-4.1-7V78.3L28.2,134.8a8,8,0,0,1-8.4-13.6l104-64A8,8,0,0,1,136,64V177.7l91.8-56.5a8,8,0,0,1,8.4,13.6Z" />
            //         </svg>
            //     );
            // case WaveformEnum.TRIANGLE:
            //     return (
            //         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
            //             <path d="M238.5,132.7l-52,72a8.1,8.1,0,0,1-13,0L76,69.7l-45.5,63a8,8,0,1,1-13-9.4l52-72a8.1,8.1,0,0,1,13,0l97.5,135,45.5-63a8,8,0,0,1,13,9.4Z" />
            //         </svg>
            //     );
            default:
                return null;
        }
    };

    return renderFilterIcon(filter);
};

export default FilterIconComponent;
