import { DOMParser } from 'xmldom';
import { FileImporter } from './index';
import { Chord, parseChord } from '../../chord';
import { PartType, Song } from '../../song';
import { SongBuilder } from '../builder';
import { EMPTY_SPACE, EMPTY_STRING } from '../../../../constants';

const getXMLTagContent = (doc: any, tag: string): string => {
  const element = doc.getElementsByTagName(tag)[0];
  return element ? element.textContent || '' : '';
};

const lyricsLineRegExp = /^[ 0-9]/;
const emptyLineRegExp = /^\s*$/;
// _  is used to align with chords (if chords take more place)
// |  is used to insert a new line
// || is used to insert a new slide
const processLyricsPiece = (piece: string) =>
  piece.replace(/_/g, '').replace(/\|/g, ' ').replace(/\s+/g, ' ');

interface ChordChunk {
  size?: number;
  chord?: Chord;
}

const parseChordsLine = (line: string) => {
  const result: ChordChunk[] = [];
  line = line.substr(1);
  let lastChordSize = 0;
  let lastChord;
  let match = /\S+/.exec(line);
  while (match) {
    const curChordSize = match[0].length;
    const parsedChord = parseChord(match[0]);
    if (parsedChord) {
      const size = lastChordSize + match.index;
      if (size > 0) {
        if (!lastChord) {
          lastChord = {};
          result.push(lastChord);
        }
        (lastChord as any).size = size;
      }
      lastChord = {
        chord: parsedChord.chord,
      };
      result.push(lastChord);
      lastChordSize = curChordSize;
    } else {
      // we ignore this chord as if it did not exist:

      lastChordSize += match.index + curChordSize;
      line = line.substr(match.index + curChordSize);
      match = /\S+/.exec(line);
      continue;
    }
    line = line.substr(match.index + curChordSize);
    match = /\S+/.exec(line);
  }
  if (result.length === 0) {
    // no valid chord in the line!
    return null;
  }
  return result;
};

const partTypes: { [key: string]: PartType } = {
  C: 'chorus',
  V: 'verse',
  B: 'bridge',
  T: 'tag',
  P: 'prechorus',
};

export const openSongImporter: FileImporter = {
  // cf the following specification:
  // http://www.opensong.org/home/file-formats

  name: 'OpenSong',
  fileExtensions: [],

  importFile(fileContent): Song {
    const parser = new DOMParser();
    const doc = parser.parseFromString(fileContent, 'text/xml');
    const rootEltName = doc.documentElement.nodeName;
    if (rootEltName !== 'song') {
      throw new Error(`Unexpected root element: ${rootEltName}`);
    }
    const builder = new SongBuilder();
    builder.addTitle(getXMLTagContent(doc, 'title'));
    builder.splitAndAddAuthors(getXMLTagContent(doc, 'author'));
    builder.addCopyright(getXMLTagContent(doc, 'copyright'));

    const presentationXMLTagContent = getXMLTagContent(doc, 'presentation');
    builder.addPresentation(
      presentationXMLTagContent
        .split(EMPTY_SPACE)
        .filter(Boolean)
        .join(EMPTY_SPACE),
    );

    const getPart = (partName: any) => {
      const part = builder.getPart(partName);
      const partType = partTypes[partName.charAt(0).toUpperCase()];
      if (partType) {
        part.setType(partType);
      }
      return part;
    };

    const lyrics = getXMLTagContent(doc, 'lyrics').replace(
      /\r\n|\n\r|\r/g,
      '\n',
    );
    const lines = lyrics.split('\n');
    const l = lines.length;
    let currentPartName = 'main';
    let lastChordLine: ChordChunk[] | null = null;
    let lastChordLineUsage = 0;
    for (const curLine of lines) {
      const firstChar = curLine.charAt(0);
      if (lyricsLineRegExp.test(firstChar) && !emptyLineRegExp.test(curLine)) {
        let lyricsLine = curLine.substr(1);
        const currentLinePartName =
          firstChar === ' '
            ? currentPartName
            : `${currentPartName}${firstChar}`;
        const currentLinePart = getPart(currentLinePartName);
        currentLinePart.changeLine();
        if (lastChordLine) {
          // add those lyrics with the last chords
          lastChordLineUsage++;
          for (const chordChunk of lastChordLine) {
            if (chordChunk.chord) {
              currentLinePart.addChord(chordChunk.chord);
            }
            const chunkSize = chordChunk.size || lyricsLine.length;
            const lyricsChunk = lyricsLine.substr(0, chunkSize);
            currentLinePart.addLyrics(processLyricsPiece(lyricsChunk));
            lyricsLine = lyricsLine.substr(chunkSize);
            currentLinePart.changeEvent();
          }
        } else {
          currentLinePart.addLyrics(processLyricsPiece(lyricsLine).trim());
        }
      } else if (lastChordLine) {
        if (lastChordLineUsage === 0) {
          // chords without corresponding lyrics on the next line
          const currentLinePart = getPart(currentPartName);
          currentLinePart.changeLine();
          lastChordLine.forEach((chord) => {
            if (chord.chord) {
              currentLinePart.addChord(chord.chord);
            }
            currentLinePart.changeEvent();
          });
        }
        lastChordLine = null;
      }
      if (firstChar === '[') {
        currentPartName = curLine.substr(1).replace(/\]\s*$/, '');
      } else if (firstChar === '.') {
        lastChordLine = parseChordsLine(curLine);
        lastChordLineUsage = 0;
      } else if (firstChar === ';') {
        const comment = curLine.substr(1).trim();
        if (comment) {
          const currentLinePart = getPart(currentPartName);
          currentLinePart.changeLine();
          currentLinePart.addComments(comment);
        }
      }
    }

    // TODO: process presentation
    return builder.buildSong();
  },
};
