export enum SequenceChar {
  VERSE = 'v',
  PRECHORUS = 'p',
  CHORUS = 'c',
  BRIDGE = 'b',
  ENDING = 'e',
  RECITAL = 's',
}

export const SongSection = {
  SEQUENCE: '[sequence]',
  TITLE: '[title]',
  VERSE: (index = 0) =>
    `[${index > 0 ? `${SequenceChar.VERSE}${index}` : SequenceChar.VERSE}]`,
  PRECHORUS: (index = 0) =>
    `[${
      index > 1 ? `${SequenceChar.PRECHORUS}${index}` : SequenceChar.PRECHORUS
    }]`,
  CHORUS: (index = 0) =>
    `[${index > 1 ? `${SequenceChar.CHORUS}${index}` : SequenceChar.CHORUS}]`,
  BRIDGE: (index = 0) =>
    `[${index > 1 ? `${SequenceChar.BRIDGE}${index}` : SequenceChar.BRIDGE}]`,
  RECITAL: (index = 0) =>
    `[${index > 1 ? `${SequenceChar.RECITAL}${index}` : SequenceChar.RECITAL}]`,
  ENDING: `[${SequenceChar.ENDING}]`,
};

export enum SongMeta {
  ALTERNATIVE = 'alternative',
  COMPOSER = 'composer',
  RC_ID = 'rcId',
  VERSION = 'version',
}
