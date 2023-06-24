export type Alteration = -2 | -1 | 0 | 1 | 2;

interface TokenInfo<T> {
  tokens: string;
  pitch: T;
}
const noteTokenToPitch: { [token: string]: TokenInfo<number> } = {};
const notePitchToToken: { [pitch: number]: TokenInfo<number> } = {};
const alterationTokenToPitch: { [token: string]: TokenInfo<Alteration> } = {};
const alterationPitchToToken: { [pitch: number]: TokenInfo<Alteration> } = {};

const registerToken = (
  tokenToPitch: any,
  pitchToToken: any,
  tokens: any,
  pitch: any,
) => {
  const tokenInfo = {
    tokens,
    pitch,
  };
  tokens.forEach((opt: any) => (tokenToPitch[opt.toLowerCase()] = tokenInfo));
  pitchToToken[pitch] = tokenInfo;
};

const registerNote = (tokensString: any, pitch: any) =>
  registerToken(noteTokenToPitch, notePitchToToken, tokensString, pitch);
const registerAlteration = (tokensString: any, pitch: Alteration) =>
  registerToken(
    alterationTokenToPitch,
    alterationPitchToToken,
    tokensString,
    pitch,
  );

registerNote(['C', 'Do', 'Ut', 'Doh'], 0);
registerNote(['D', 'Ré', 'Re'], 2);
registerNote(['E', 'Mi'], 4);
registerNote(['F', 'Fa'], 5);
registerNote(['G', 'Sol', 'So'], 7);
registerNote(['A', 'La'], 9);
registerNote(['B', 'Si', 'Ti'], 11);
export const noteBase = Object.keys(noteTokenToPitch).join('|');

registerAlteration(['\u266D', 'b'], -1);
registerAlteration(['\uD834\uDD2B', '\u266D\u266D', 'bb'], -2);
registerAlteration(['', '\u266E', 'n'], 0);
registerAlteration(['\u266F', '#'], 1);
registerAlteration(['\uD834\uDD2A', '\u266F\u266F', '##'], 2);
export const noteAlteration = Object.keys(alterationTokenToPitch)
  .filter((alt) => !!alt)
  .join('|');

export const note = `(?:${noteBase})(?:${noteAlteration})?(?!${noteAlteration})`;
const noteRegExp = new RegExp(`^(${noteBase})(${noteAlteration})?$`, 'i');

export type Note = [number, Alteration];

export interface ParsedNote {
  note: Note;
  strNote: string;
  strAlteration: string;
}

export const mod12 = (inputPitch: any) => {
  inputPitch = inputPitch % 12;
  if (inputPitch < 0) {
    inputPitch += 12;
  }
  return inputPitch;
};

export const parseAlteration = (alteration: any): Alteration | undefined => {
  const alterationInfo = alterationTokenToPitch[alteration.toLowerCase()];
  if (alterationInfo) {
    return alterationInfo.pitch;
  }
};

export const parseNote = (inputNote: string): ParsedNote | undefined => {
  const match = noteRegExp.exec(inputNote);
  if (match) {
    const noteInfo = noteTokenToPitch[match[1].toLowerCase()];
    const strAlteration = match[2] || '';
    const alterationPitch = parseAlteration(strAlteration);
    if (alterationPitch != null) {
      return {
        note: [mod12(noteInfo.pitch + alterationPitch), alterationPitch],
        strNote: match[1],
        strAlteration: strAlteration,
      };
    }
  }
};

export interface NoteCheckAndTransposeOptions {
  transpose?: number;
  mod12?: boolean;
  resetAlterations?: boolean;
  defaultAlteration?: -1 | 1;
}

export const checkAndTransposeNote = (
  inputNote: Note,
  options: NoteCheckAndTransposeOptions = {},
): Note => {
  let pitch = inputNote[0] + (options.transpose || 0);
  if (options.mod12) {
    pitch = mod12(pitch);
  }
  let alterationPitch = inputNote[1];
  if (
    options.resetAlterations ||
    !alterationPitch ||
    !alterationPitchToToken[alterationPitch]
  ) {
    alterationPitch = 0;
  }
  if (!notePitchToToken[mod12(pitch - alterationPitch)]) {
    if (alterationPitch !== 0) {
      alterationPitch -= Math.sign(alterationPitch);
    } else {
      alterationPitch = options.defaultAlteration || 1;
    }
  }
  return [pitch, alterationPitch] as Note;
};

export interface NoteFormatOptions extends NoteCheckAndTransposeOptions {
  doReMi?: boolean;
}

export const formatNote = (
  inputNote: Note,
  options: NoteFormatOptions = {},
) => {
  const [pitch, alterationPitch] = checkAndTransposeNote(inputNote, options);
  const notePitch = mod12(pitch - alterationPitch);
  const noteInfo = notePitchToToken[notePitch];
  const alterationInfo = alterationPitchToToken[alterationPitch];
  return `${noteInfo.tokens[options.doReMi ? 1 : 0]}${
    alterationInfo.tokens[0]
  }`;
};
