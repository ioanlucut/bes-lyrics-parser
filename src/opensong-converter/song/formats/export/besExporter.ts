import { isEmpty, trim } from 'lodash';
import { FileExporter } from './index';
import { Song } from '../../song';
import { cleanBasicContent, cleanContent, cleanFilename } from "../../../../contentCleaner";
import {
  CARET_RETURN,
  COMMA,
  EMPTY_SPACE,
  EMPTY_STRING,
  NEW_LINE,
  TXT_EXTENSION,
} from '../../../../constants';
import { SongMeta, SongSection } from '../../../../types';
import { convertSongSection } from './osSongSectionConverter';

export const besExporter: FileExporter = {
  name: 'BES',
  fileExtensions: [TXT_EXTENSION],

  exportFile(song: Song) {
    const maybeAuthor = `${
      !isEmpty(song.authors)
        ? `${SongMeta.AUTHOR}: {${song?.authors
            ?.map(({ name }) => cleanBasicContent(name))
            .join(`${COMMA}${EMPTY_SPACE}`)}}`
        : EMPTY_STRING
    }`;
    const maybeRCIdReference = `${
      song.rcId ? `{${SongMeta.RC_ID}: {${song?.rcId}}` : EMPTY_STRING
    }`;
    const titleOfTheSong = `${cleanFilename(song.title)}`;
    const metaInfo = [maybeAuthor, maybeRCIdReference].filter(Boolean);
    const titleContent = `${titleOfTheSong}${
      !isEmpty(metaInfo)
        ? `${EMPTY_SPACE}{${metaInfo.join(`${COMMA}${EMPTY_SPACE}`)}}`
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
