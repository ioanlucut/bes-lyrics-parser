import { isEmpty, trim } from 'lodash';
import { FileExporter } from './index';
import { Song } from '../../song';
import {
  CARET_RETURN,
  cleanContent,
  cleanFilename,
  COMMA,
  EMPTY_SPACE,
  EMPTY_STRING,
  NEW_LINE,
} from '../../../../contentCleaner';

const bridgeTheQualifierInSequence = (presentationEntry: string) => {
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

  if (presentationEntry.startsWith('C1')) {
    return presentationEntry.replaceAll('C1', 'c');
  }
  if (presentationEntry.startsWith('C2')) {
    return presentationEntry.replaceAll('C2', 't');
  }
  if (presentationEntry.startsWith('C')) {
    throw new Error(`${presentationEntry} is unknown!`);
  }

  if (presentationEntry.startsWith('V')) {
    return presentationEntry.replaceAll('V', EMPTY_STRING);
  }

  if (presentationEntry.startsWith('B1')) {
    return presentationEntry.replaceAll('B1', 'b');
  }

  if (presentationEntry.startsWith('B2')) {
    return presentationEntry.replaceAll('B2', 'w');
  }
  if (presentationEntry.startsWith('B')) {
    throw new Error(`${presentationEntry} is unknown!`);
  }

  // TODO
  if (presentationEntry.startsWith('T1')) {
    return presentationEntry.replaceAll('T1', 'b');
  }

  // TODO
  if (presentationEntry === 'T') {
    return presentationEntry.replaceAll('T', 'b');
  }

  if (presentationEntry.startsWith('T')) {
    throw new Error(`${presentationEntry} is unknown!`);
  }

  if (presentationEntry.startsWith('P1')) {
    return presentationEntry.replaceAll('P1', 'p');
  }

  if (presentationEntry.startsWith('P2')) {
    return presentationEntry.replaceAll('P2', 'q');
  }
  if (presentationEntry.startsWith('P')) {
    throw new Error(`${presentationEntry} is unknown!`);
  }

  throw new Error(`${presentationEntry} is unknown!`);
};

const bridgeTheQualifierInContent = (presentationEntry: string) => {
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

  if (presentationEntry.startsWith('C1')) {
    return presentationEntry.replaceAll('C1', 'chorus');
  }
  if (presentationEntry.startsWith('C2')) {
    return presentationEntry.replaceAll('C2', 'chorus 2');
  }
  if (presentationEntry.startsWith('C')) {
    throw new Error(`${presentationEntry} is unknown!`);
  }

  if (presentationEntry.startsWith('V')) {
    return presentationEntry.replaceAll('V', EMPTY_STRING);
  }

  if (presentationEntry.startsWith('B1')) {
    return presentationEntry.replaceAll('B1', 'bridge');
  }

  if (presentationEntry.startsWith('B2')) {
    return presentationEntry.replaceAll('B2', 'bridge 2');
  }
  if (presentationEntry.startsWith('B')) {
    throw new Error(`${presentationEntry} is unknown!`);
  }

  // TODO!
  if (presentationEntry.startsWith('T1')) {
    return presentationEntry.replaceAll('T1', 'bridge');
  }

  // TODO!
  if (presentationEntry === 'T') {
    return presentationEntry.replaceAll('T', 'bridge');
  }

  if (presentationEntry.startsWith('T')) {
    throw new Error(`${presentationEntry} is unknown!`);
  }

  if (presentationEntry.startsWith('P1')) {
    return presentationEntry.replaceAll('P1', 'prechorus');
  }

  if (presentationEntry.startsWith('P2')) {
    return presentationEntry.replaceAll('P2', 'prechorus 2');
  }
  if (presentationEntry.startsWith('P')) {
    throw new Error(`${presentationEntry} is unknown!`);
  }

  throw new Error(`${presentationEntry} is unknown!`);
};

export const besExporter: FileExporter = {
  name: 'BES',
  fileExtensions: ['.txt'],

  exportFile(song: Song) {
    const hasAuthor = !isEmpty(song.authors);

    const titleContent = `${cleanFilename(song.title)}${
      hasAuthor
        ? `${EMPTY_SPACE}{Author: {${song?.authors?.map(({ name }) =>
            cleanContent(name),
          )}}}`
        : EMPTY_STRING
    }`;

    const sequenceContent = song.presentation
      ?.split(EMPTY_SPACE)
      .map(bridgeTheQualifierInSequence)
      .join(COMMA);

    const lyrics = trim(
      song?.music?.parts
        .map(({ name, content }) => {
          return `[${bridgeTheQualifierInContent(name)}]
${content
  .map((event) => cleanContent(event[0]?.lyrics as string))
  .join(`${CARET_RETURN}${NEW_LINE}`)}
`;
        })
        .join(`${CARET_RETURN}${NEW_LINE}`),
    );

    return `[title]
${titleContent}

[sequence]
${sequenceContent}

${lyrics}`;
  },
};
