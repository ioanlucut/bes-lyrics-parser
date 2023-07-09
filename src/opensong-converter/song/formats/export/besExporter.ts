import { isEmpty, trim } from 'lodash';
import { FileExporter } from './index';
import { Song } from '../../song';
import { cleanContent, cleanFilename } from '../../../../contentCleaner';
import {
  CARET_RETURN,
  NEW_LINE,
  COMMA,
  EMPTY_SPACE,
  EMPTY_STRING,
  TXT_EXTENSION,
} from '../../../../constants';
import { SongMeta, SongSection } from '../../../../types';
import { convertSongSection } from './osSongSectionConverter';

export const besExporter: FileExporter = {
  name: 'BES',
  fileExtensions: [TXT_EXTENSION],

  exportFile(song: Song) {
    const hasAuthor = !isEmpty(song.authors);

    const titleContent = `${cleanFilename(song.title)}${
      hasAuthor
        ? `${EMPTY_SPACE}{${SongMeta.AUTHOR}: {${song?.authors?.map(
            ({ name }) => cleanContent(name),
          )}}}`
        : EMPTY_STRING
    }`;

    const sequenceContent = song.presentation
      ?.split(EMPTY_SPACE)
      .map((osSongSection) => convertSongSection(osSongSection))
      .join(COMMA);

    const lyrics = trim(
      song?.music?.parts
        .map(({ name: osSongSection, content }) => {
          return `[${convertSongSection(osSongSection)}]
${content
  .map((event) => cleanContent(event[0]?.lyrics as string))
  .join(`${CARET_RETURN}${NEW_LINE}`)}
`;
        })
        .join(`${CARET_RETURN}${NEW_LINE}`),
    );

    return `${SongSection.TITLE}
${titleContent}

${SongSection.SEQUENCE}
${sequenceContent}

${lyrics}`;
  },
};
