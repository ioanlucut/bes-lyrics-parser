import {
  checkAndTransposeChord,
  Chord,
  ChordCheckAndTransposeOptions,
} from './chord';
import {
  checkAndTransposeNote,
  Note,
  NoteCheckAndTransposeOptions,
} from './note';

export type VoiceType = 'lyrics' | 'chords' | 'notes' | 'comments' | 'timing';

export type LyricsConfig = never;
export type ChordsConfig = never;
export type NotesConfig = never;
export type CommentsConfig = never;
export interface TimingConfig {
  bpm: number;
  bpmUnit: Timing;
}

export type VoiceConfig =
  | LyricsConfig
  | ChordsConfig
  | NotesConfig
  | CommentsConfig
  | TimingConfig;

export type VoiceDefinition =
  | VoiceType
  | {
      type: VoiceType;
      title?: string;
      config?: VoiceConfig;
      activeByDefault?: boolean;
    };

export type Timing = [number, number];

// In the following types:
// - false means silence (the previous value ends here but is not replaced)
// - undefined means continue as before (the previous value continues during this event)
// - another value means the new value replaces the previous one (the previous value stops)
export type LyricsEvent = string | false | undefined;
export type ChordsEvent = Chord | false | undefined;
export type NotesEvent = Note[] | false | undefined;
export type CommentsEvent = string | false | undefined;
export type TimingEvent = Timing | false | undefined;

export interface Event {
  [voiceName: string]:
    | LyricsEvent
    | ChordsEvent
    | NotesEvent
    | CommentsEvent
    | TimingEvent;
}

export type PartType = 'verse' | 'prechorus' | 'chorus' | 'bridge' | 'tag';

export interface Part {
  name: string;
  voicesConfig?: { [voiceName: string]: boolean };
  content: Event[][];
  type?: PartType;
}

export interface Execution {
  part: string;
  comment?: string;
  voices?: { [voiceName: string]: boolean };
}

export interface SheetMusic {
  voices: {
    [voiceName: string]: VoiceDefinition;
  };
  parts: Part[];
  execution?: Execution[];
}

export interface SheetMusicCheckAndTransposeOptions
  extends ChordCheckAndTransposeOptions,
    NoteCheckAndTransposeOptions {}

export const getVoiceType = (
  sheetMusic: SheetMusic,
  voiceName: string,
): VoiceType | undefined => {
  let voiceType: VoiceDefinition | undefined = sheetMusic.voices[voiceName];
  if (typeof voiceType !== 'string') {
    voiceType = voiceType ? voiceType.type : undefined;
  }
  return voiceType;
};

export const getPartType = (part: Part): PartType => {
  return part.type || 'verse';
};

export const getVoices = (sheetMusic: SheetMusic, voiceTypes?: VoiceType[]) => {
  let result = Object.keys(sheetMusic.voices);
  if (voiceTypes) {
    result = result.filter((voiceName) => {
      const voiceType = getVoiceType(sheetMusic, voiceName);
      return voiceType ? voiceTypes.indexOf(voiceType) > -1 : false;
    });
  }
  return result;
};

export const checkAndTransposeSheetMusic = (
  sheetMusic: SheetMusic,
  options: SheetMusicCheckAndTransposeOptions = {},
): SheetMusic => {
  const chordVoices: string[] = [];
  const noteVoices: string[] = [];
  for (const voiceName of Object.keys(sheetMusic.voices)) {
    const voiceType = getVoiceType(sheetMusic, voiceName);
    if (voiceType === 'chords') {
      chordVoices.push(voiceName);
    } else if (voiceType === 'notes') {
      noteVoices.push(voiceName);
    }
  }
  const sheetMusicResult = { ...sheetMusic };
  sheetMusicResult.parts = sheetMusicResult.parts.map((part) => {
    const partResult = { ...part };
    partResult.content = partResult.content.map((events) =>
      events.map((event) => {
        const eventResult = { ...event };
        for (const chordVoice of chordVoices) {
          const chordEvent = eventResult[chordVoice] as ChordsEvent;
          if (chordEvent) {
            eventResult[chordVoice] = checkAndTransposeChord(
              chordEvent,
              options,
            );
          }
        }
        for (const noteVoice of noteVoices) {
          const noteEvent = eventResult[noteVoice] as NotesEvent;
          if (noteEvent) {
            eventResult[noteVoice] = noteEvent.map((note) =>
              checkAndTransposeNote(note, options),
            );
          }
        }
        return eventResult;
      }),
    );
    return partResult;
  });
  return sheetMusicResult;
};

export const extractLyrics = (sheetMusic: SheetMusic): string => {
  const lyrics: string[] = [];
  const lyricsVoices = getVoices(sheetMusic, ['lyrics']);
  for (const voice of lyricsVoices) {
    let emptyVoice = true;
    for (const part of sheetMusic.parts) {
      let emptyPart = true;
      for (const line of part.content) {
        let emptyLine = true;
        for (const event of line) {
          const eventLyrics = event[voice] as string;
          if (eventLyrics) {
            lyrics.push(eventLyrics);
            emptyLine = false;
          }
        }
        if (!emptyLine) {
          emptyPart = false;
          lyrics.push('\n');
        }
      }
      if (!emptyPart) {
        emptyVoice = false;
        lyrics.push('\n');
      }
    }
    if (!emptyVoice) {
      lyrics.push('\n');
    }
  }
  return lyrics.join('');
};

export interface SongAuthor {
  name: string;
  composer?: boolean;
  lyricist?: boolean;
  arranger?: boolean;
  translator?: boolean;
}

export interface Song {
  title: string;
  year?: number;
  authors?: SongAuthor[];
  copyright?: string;
  music: SheetMusic;
}

export interface SongPosition {
  currentPart?: number;
  currentLine?: number;
  currentEvent?: number;
}
