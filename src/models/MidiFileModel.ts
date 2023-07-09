import { Midi as TonejsMidi } from '@tonejs/midi';

export interface MidiFileModel {
    midi: TonejsMidi;
    name: string;
}
