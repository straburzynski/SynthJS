import { MidiMessageModel } from '../models/MidiMessageModel';

export const base64ToArrayBuffer = (base64: string) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
};

export const midiMessageConverter = (e: MIDIMessageEvent): MidiMessageModel => {
    return {
        type: e.data![0],
        note: e.data![1],
        velocity: e.data![2],
    };
};
