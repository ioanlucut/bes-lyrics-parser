import { Event, Part, PartType, Song, SongAuthor } from '../song';
import { Chord, parseChord } from '../chord';

export class PartBuilder {
  _part: Part;
  _curLine: Event[] | null = null;
  _curEvent: Event | null = null;

  constructor(private _songBuilder: SongBuilder, name: string) {
    this._part = {
      name,
      content: [],
    };
    this._songBuilder._parts[name] = this;
    this._songBuilder._song.music.parts.push(this._part);
  }

  setName(name: string) {
    const oldName = this._part.name;
    if (name !== oldName) {
      if (this._songBuilder._parts[name]) {
        throw new Error(`Duplicate part name: ${name}`);
      }
      delete this._songBuilder._parts[oldName];
      this._songBuilder._parts[name] = this;
      this._part.name = name;
    }
  }

  setType(type: PartType) {
    this._part.type = type;
  }

  changeLine() {
    this._curLine = null;
    this.changeEvent();
  }

  changeEvent() {
    this._curEvent = null;
  }

  getCurrentEvent() {
    let curEvent = this._curEvent;
    if (!curEvent) {
      let curLine = this._curLine;
      if (!curLine) {
        curLine = this._curLine = [];
        this._part.content.push(curLine);
      }
      curEvent = this._curEvent = {};
      curLine.push(curEvent);
    }
    return curEvent;
  }

  _addTextEvent(voiceType: any, text: any, voice: any) {
    this._songBuilder.checkVoice(voice, voiceType);
    const curEvent = this.getCurrentEvent();
    if (!curEvent[voice]) {
      curEvent[voice] = '';
    }
    curEvent[voice] += text;
    return curEvent;
  }

  addLyrics(lyrics: any, voice = 'lyrics') {
    return this._addTextEvent('lyrics', lyrics, voice);
  }

  addComments(comments: any, voice = 'comments') {
    return this._addTextEvent('comments', comments, voice);
  }

  addChord(chord: string | Chord, voice = 'chords') {
    this._songBuilder.checkVoice(voice, 'chords');
    const curEvent = this.getCurrentEvent();
    if (curEvent[voice]) {
      throw new Error(`Chord already set in this event for voice ${voice}.`);
    }
    if (typeof chord === 'string') {
      const parsedChord = parseChord(chord);
      if (!parsedChord) {
        // it is not a valid chord, let's add it as a comment
        return this.addComments(chord);
      }
      chord = parsedChord.chord;
    }
    curEvent[voice] = chord;
    return curEvent;
  }
}

export class SongBuilder {
  _song: Song = {
    title: '',
    music: {
      voices: {},
      parts: [],
    },
    presentation: '',
  };
  _authors: { [key: string]: SongAuthor } = {};
  _parts: { [key: string]: PartBuilder } = {};
  // @ts-ignore
  _curPart: PartBuilder | null;

  addTitle(title: any) {
    if (title && !this._song.title) {
      this._song.title = title.trim();
    }
  }

  addAuthor(name: any, type?: 'composer' | 'lyricist' | 'arranger') {
    name = name ? name.trim() : '';
    if (name) {
      const authors = this._authors;
      let author = authors[name.toLowerCase()];
      if (!author) {
        author = authors[name.toLowerCase()] = { name: name };
        const song = this._song;
        if (!song.authors) {
          song.authors = [];
        }
        song.authors.push(author);
      }
      if (type) {
        author[type] = true;
      }
    }
  }

  addCopyright(copyright: any) {
    if (copyright) {
      let existingCopyright = this._song.copyright;
      existingCopyright = existingCopyright ? `${existingCopyright} ` : '';
      this._song.copyright = existingCopyright + copyright.trim();
    }
  }

  addPresentation(presentation: any) {
    if (presentation) {
      this._song.presentation = presentation;
    }
  }

  splitAndAddAuthors(authors: any) {
    if (authors) {
      authors
        .split(/[-\u2013&,;\/]/)
        .forEach((author: any) => this.addAuthor(author));
    }
  }

  changePart() {
    this._curPart = null;
  }

  getCurrentPart() {
    if (!this._curPart) {
      this._curPart = new PartBuilder(this, this._generatePartName());
    }
    return this._curPart;
  }

  _generatePartName() {
    let index = 1;
    while (this._parts[`part${index}`]) {
      index++;
    }
    return `part${index}`;
  }

  getPart(name: any) {
    let result = this._parts[name];
    if (!result) {
      result = this._parts[name] = new PartBuilder(this, name);
    }
    return result;
  }

  checkVoice(name: string, type: any) {
    const voiceDefinition = this._song.music.voices[name];
    if (!voiceDefinition) {
      this._song.music.voices[name] = type;
      return;
    }
    const voiceType =
      typeof voiceDefinition === 'string'
        ? voiceDefinition
        : voiceDefinition.type;
    if (voiceType !== type) {
      throw new Error(
        `Voice ${name} already exists with type ${voiceType}, so it cannot contain events of type ${type}.`,
      );
    }
  }

  buildSong(): Song {
    const song = this._song;
    return song;
  }
}
