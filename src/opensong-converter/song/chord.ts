import {
  checkAndTransposeNote,
  formatNote,
  note,
  Note,
  NoteCheckAndTransposeOptions,
  NoteFormatOptions,
  ParsedNote,
  parseNote,
} from './note';

export interface ChordType {
  names: string[];
  notes: number[];
}

export const chordTypes: ChordType[] = [];
const tokenToChordType: { [token: string]: ChordType } = {};

interface ChordDetectorResult {
  root: number;
  typeDetails: ChordType;
}
const chordsDetector: { [key: number]: ChordDetectorResult[] } = {};

const chordKeyMask = 0b111111111111;
const transposeChordKey = (key: number, transposition: number) => {
  transposition = (12 + transposition) % 12;
  // tslint:disable-next-line:no-bitwise
  return (
    chordKeyMask & ((key << transposition) | (key >>> (12 - transposition)))
  );
};

const pitchesToChordKey = (pitches: number[]) => {
  let enabledPitches = 0;
  for (const pitch of pitches) {
    // tslint:disable-next-line:no-bitwise
    enabledPitches = enabledPitches | (1 << pitch % 12);
  }
  return enabledPitches;
};

const removeUnicodeAlterations = (text: string) =>
  text.replace(/\u266D/g, 'b').replace(/\u266F/g, '#');

const registerChord = (names: string[], notes: number[]) => {
  const chordInfo = {
    names,
    notes,
  };
  chordTypes.push(chordInfo);
  for (let i = names.length - 1; i >= 0; i--) {
    const name = names[i];
    const nameWithoutUnicodeAlt = removeUnicodeAlterations(name);
    if (name !== nameWithoutUnicodeAlt) {
      names.push(nameWithoutUnicodeAlt);
    }
  }
  names.forEach((name) => (tokenToChordType[name] = chordInfo));
  const chordKey = pitchesToChordKey(notes);
  for (let transposition = 0; transposition < 12; transposition++) {
    const transposedChordKey = transposeChordKey(chordKey, transposition);
    let possibleChords = chordsDetector[transposedChordKey];
    if (!possibleChords) {
      possibleChords = chordsDetector[transposedChordKey] = [];
    }
    possibleChords.push({ root: transposition, typeDetails: chordInfo });
  }
};

registerChord(['', 'maj'], [0, 4, 7]);
registerChord(['5'], [0, 7]);
registerChord(['6'], [0, 4, 7, 9]);
registerChord(['6/9'], [0, 4, 7, 9, 14]);
registerChord(['7'], [0, 4, 7, 10]);
registerChord(['7\u266F9'], [0, 4, 7, 10, 15]);
registerChord(['7\u266F11'], [0, 4, 7, 10, 18]);
registerChord(['7\u266D5'], [0, 4, 6, 10]);
registerChord(['7\u266D9'], [0, 4, 7, 10, 13]);
registerChord(['7\u266D5(\u266F9)'], [0, 4, 6, 10, 15]);
registerChord(['7sus4', 'sus7'], [0, 5, 7, 10]);
registerChord(['9'], [0, 4, 7, 10, 14]);
registerChord(['9\u266D5'], [0, 4, 6, 10, 14]);
registerChord(['9\u266F11'], [0, 4, 7, 10, 14, 18]);
registerChord(['9sus4'], [0, 5, 7, 10, 14]);
registerChord(['11'], [0, 4, 7, 10, 14, 17]);
registerChord(['13'], [0, 4, 7, 10, 14, 21]);
registerChord(['13\u266D9'], [0, 4, 7, 10, 13, 21]);
registerChord(['13sus4'], [0, 5, 7, 10, 14, 21]);
registerChord(['add9'], [0, 4, 7, 14]);
registerChord(['dim'], [0, 3, 6]);
registerChord(['dim7', '°7'], [0, 3, 6, 9]);
registerChord(['m', 'min', '-'], [0, 3, 7]);
registerChord(['m6'], [0, 3, 7, 9]);
registerChord(['m\u266D6'], [0, 3, 7, 8]);
registerChord(['m6/9'], [0, 3, 7, 9, 14]);
registerChord(['m7'], [0, 3, 7, 10]);
registerChord(['m7\u266D5'], [0, 3, 6, 10]);
registerChord(['m9'], [0, 3, 7, 10, 14]);
registerChord(['m9\u266D5'], [0, 3, 6, 10, 14]);
registerChord(['m9(maj7)'], [0, 3, 7, 11, 14]);
registerChord(['m11'], [0, 3, 7, 10, 14, 17]);
registerChord(['m13'], [0, 3, 7, 10, 14, 21]);
registerChord(['m(add9)'], [0, 3, 7, 14]);
registerChord(['m(maj7)', 'mMaj7'], [0, 3, 7, 11]);
registerChord(['maj7', '7M', 'M7'], [0, 4, 7, 11]);
registerChord(['maj7\u266D5'], [0, 4, 6, 11]);
registerChord(['maj7\u266F11'], [0, 4, 7, 11, 18]);
registerChord(['maj9'], [0, 4, 7, 11, 14]);
registerChord(['maj11'], [0, 4, 7, 11, 14, 17]);
registerChord(['maj13'], [0, 4, 7, 11, 14, 21]);
registerChord(['sus2', '2', '2sus'], [0, 2, 7]);
registerChord(['sus4', '4', '4sus', 'sus'], [0, 5, 7]);
registerChord(['+', 'aug'], [0, 4, 8]);
registerChord(['+7', 'aug7'], [0, 4, 8, 10]);
registerChord(['+7\u266F9', 'aug7\u266F9'], [0, 4, 8, 10, 15]);
registerChord(['+7\u266D9', 'aug7\u266D9'], [0, 4, 8, 10, 13]);
registerChord(['+9', 'aug9'], [0, 4, 8, 10, 14]);

const chordRegExp = new RegExp(
  `^(${note})([-+#\(\)a-zA-Z0-9\u266D\u266F°]*(?:/[0-9]+)?)(/(${note}))?$`,
  'i',
);

export type Chord = [Note, string, Note] | [Note, string];

export interface ParsedChord {
  chord: Chord;
  typeDetails: ChordType;
  parsedRoot: ParsedNote;
  parsedBass?: ParsedNote;
}

export const parseChord = (inputChord: string): ParsedChord | undefined => {
  const match = chordRegExp.exec(inputChord);
  if (match) {
    const root = parseNote(match[1]) as ParsedNote;
    const type = match[2];
    const typeDetails = tokenToChordType[type];
    const bass = match[3] ? parseNote(match[3].slice(1)) : undefined;
    return {
      chord: bass ? [root.note, type, bass.note] : [root.note, type],
      typeDetails,
      parsedRoot: root,
      parsedBass: bass,
    };
  }
};

export interface ChordCheckAndTransposeOptions
  extends NoteCheckAndTransposeOptions {
  skipNormalizingChordTypes?: boolean;
  acceptUnknownChords?: boolean;
}

export const checkAndTransposeChord = (
  chord: Chord,
  options: ChordCheckAndTransposeOptions = {},
): Chord => {
  options = Object.assign({}, options);
  options.mod12 = true;
  const root = checkAndTransposeNote(chord[0], options);
  let type = chord[1];
  const typeDetails = tokenToChordType[type];
  if (!options.skipNormalizingChordTypes && typeDetails) {
    type = typeDetails.names[0];
  }
  if (!options.acceptUnknownChords && !typeDetails) {
    throw new Error(`Unknown chord type: ${type}`);
  }
  let bass = chord[2] as Note | undefined;
  if (bass) {
    bass = checkAndTransposeNote(bass, options);
    if (bass[0] === root[0]) {
      bass = undefined;
    }
  }
  if (bass) {
    return [root, type, bass];
  } else {
    return [root, type];
  }
};

export interface ChordFormatOptions
  extends ChordCheckAndTransposeOptions,
    NoteFormatOptions {}

export const formatChord = (
  chord: Chord,
  options?: ChordFormatOptions,
): string => {
  chord = checkAndTransposeChord(chord, options);
  const root = chord[0];
  const type = chord[1];
  const bass = chord[2] as Note | undefined;
  const remainingOptions = options
    ? {
        doReMi: options.doReMi,
      }
    : undefined;
  return `${formatNote(root, remainingOptions)}${type}${
    bass ? `/${formatNote(bass, remainingOptions)}` : ''
  }`;
};

const buildDetectedChords = (
  possibleChords: ChordDetectorResult[],
  bassPitch: any,
): Chord[] => {
  const bassMatchingRoot: Chord[] = [];
  const bassNotMatchingRoot: Chord[] = [];
  possibleChords.forEach((chord) => {
    if (chord.root === bassPitch) {
      bassMatchingRoot.push([[chord.root, 0], chord.typeDetails.names[0]]);
    } else {
      bassNotMatchingRoot.push([
        [chord.root, 0],
        chord.typeDetails.names[0],
        [bassPitch, 0],
      ]);
    }
  });
  return bassMatchingRoot.concat(bassNotMatchingRoot);
};

export const detectChord = (pitches: number[]): Chord[] => {
  if (pitches.length > 0) {
    let chordKey = pitchesToChordKey(pitches);
    let possibleChords = chordsDetector[chordKey];
    const bassPitch = Math.min.apply(Math, pitches) % 12;
    if (possibleChords) {
      return buildDetectedChords(possibleChords, bassPitch);
    }
    // tslint:disable-next-line:no-bitwise
    chordKey = chordKey & ~(1 << bassPitch); // try to detect the chord without the bass
    possibleChords = chordsDetector[chordKey];
    if (possibleChords) {
      return buildDetectedChords(possibleChords, bassPitch);
    }
  }
  return [];
};
