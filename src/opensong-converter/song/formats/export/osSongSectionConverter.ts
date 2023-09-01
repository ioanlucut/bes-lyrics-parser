import { SequenceChar } from '../../../../types';
import { DOT, EMPTY_STRING } from '../../../../constants';
import chalk from 'chalk';
import { isTestEnv } from '../../../../utils';

/*
 --> Daca se incepe cu refren, facem ordinea astfel:
         R 1 2 3 ->  C V1 C V2 C V3 C ...
 --> Daca se incepe cu strofa, facem ordinea astfel:
         1 R 2 3 ->  V1 C V2 C V3 C
 --> Daca sunt mai multe refrene, se adauga ultimul dupa fiecare strofa:
         R 1 2 R2 3 -> C V1 C V2 C2 V3 C2
         1 R 2 3 R2 -> V1 C V2 C V3 C2
 --> Daca este vreun bridge, il adaugam in ordinea in care s-a scris, considerandu-l la un loc cu strofa care-l preceda:
         R 1 B R1 2 B R2 3 B C -> C V1 B C1 V2 B C2 V3 B C2 T
         1 B R1 2 B R2 3 B C -> V1 B C1 V2 B C2 V3 B C2 T
     Consideram ca un Bridge nu poate fi fara o strofa.
 --> Daca este vreun recital (S:), il adaugam in ordinea in care s-a scris, considerandu-l un element separat de celelalte:
         R 1 B 2 B S -> C V1 B C V2 B C S C
         1 B R 2 B S -> V1 B C V2 B C S C
     Fiind un element separat, se adauga dupa el ultimul refren.
     Daca se incepe cu strofa iar apoi urmeaza direct recital, fara refren, il vom adauga in acea ordine. Daca este specificat insa un refren inainte de a fi specificat recitalul, vom adauga acel refren inainte de recital.
         1 S R 2 S -> V1 S C V2 C S C
         R 1 S 2 B S -> C V1 C S C V2 B C S C
 --> Dupa CODA nu se mai adauga refren.
 --> Elementul "I" se ignora.
 */

enum OpenSongSequenceChar {
  VERSE = 'V',
  PRECHORUS = 'P',
  CHORUS = 'C',
  BRIDGE = 'B',
  TAG = 'T',
  RECITAL = 'S',
  INFO = 'I',
}

// OS
// C: 'chorus',
// V: 'verse',
// B: 'bridge',
// T: 'tag',
// P: 'prechorus',

// BES
// "[chorus]": "c",
// "[chorus 2]": "t",
// "[prechorus]": "p",
// "[prechorus 2]": "q",
// "[ending]": "e",
// "[bridge]": "b",
// "[bridge 2]": "w",

export const convertSongSection = (rawSongSection: string) => {
  const songSection = rawSongSection.trim().replaceAll(DOT, EMPTY_STRING);
  const maybeVerse = new RegExp(
    `(${OpenSongSequenceChar.VERSE})(\\d+)?$`,
    'gi',
  ).exec(songSection);
  if (maybeVerse) {
    const [, , index] = maybeVerse;

    return [SequenceChar.VERSE, index || 1].filter(Boolean).join(EMPTY_STRING);
  }

  const maybeBridge = new RegExp(
    `(${OpenSongSequenceChar.BRIDGE})(\\d+)?$`,
    'gi',
  ).exec(songSection);
  if (maybeBridge) {
    const [, , index] = maybeBridge;

    return [SequenceChar.BRIDGE, index === '1' ? undefined : index]
      .filter(Boolean)
      .join(EMPTY_STRING);
  }

  const maybePreChorus = new RegExp(
    `(${OpenSongSequenceChar.PRECHORUS})(\\d+)?$`,
    'gi',
  ).exec(songSection);
  if (maybePreChorus) {
    const [, , index] = maybePreChorus;

    return [SequenceChar.PRECHORUS, index === '1' ? undefined : index]
      .filter(Boolean)
      .join(EMPTY_STRING);
  }

  const maybeChorus = new RegExp(
    `(${OpenSongSequenceChar.CHORUS})(\\d+)?$`,
    'gi',
  ).exec(songSection);
  if (maybeChorus) {
    const [, , index] = maybeChorus;

    return [SequenceChar.CHORUS, index === '1' ? undefined : index]
      .filter(Boolean)
      .join(EMPTY_STRING);
  }

  const maybeEndingOrTag = new RegExp(
    `(${OpenSongSequenceChar.TAG})(\\d+)?$`,
    'gi',
  ).exec(songSection);
  if (maybeEndingOrTag) {
    const [, , index] = maybeEndingOrTag;

    return [SequenceChar.ENDING, index === '1' ? undefined : index]
      .filter(Boolean)
      .join(EMPTY_STRING);
  }

  const maybeSTag = RegExp(
    `(${OpenSongSequenceChar.RECITAL})(\\d+)?$`,
    'gi',
  ).exec(songSection);
  if (maybeSTag) {
    const [, , index] = maybeSTag;

    return [SequenceChar.RECITAL, index === '1' ? undefined : index]
      .filter(Boolean)
      .join(EMPTY_STRING);
  }

  const maybeUnsupportedITag = new RegExp(`(I)(\\d+)?$`, 'gi').exec(
    songSection,
  );
  if (maybeUnsupportedITag) {
    const [, , index] = maybeUnsupportedITag;
    if (!isTestEnv()) {
      console.warn(chalk.cyan(`Ignored ${songSection}.`));
    }

    return EMPTY_STRING;
  }

  throw new Error(`Unknown song section: ${songSection}`);
};
