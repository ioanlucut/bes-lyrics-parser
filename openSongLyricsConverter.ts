import fs from 'fs';
import path from 'path';
import fsExtra from 'fs-extra';
import recursive from 'recursive-readdir';
import dotenv from 'dotenv';
import chalk from 'chalk';
import { processOSFileAndConvertToTxt } from './src/opensongParser';
import {
  COMMA,
  DASH,
  EMPTY_SPACE,
  NEW_LINE,
  TXT_EXTENSION,
} from './src/constants';
import { first, groupBy, isEmpty, size } from 'lodash';
import { cleanBasicContent, cleanFilename } from './src/contentCleaner';

dotenv.config();

const FILES_TO_IGNORE = ['.DS_Store'];
const AUTHORS_TO_IGNORE = 'Traducere RO';

const getPathForAuthor = (author: string) =>
  cleanFilename(cleanBasicContent(author))
    .replaceAll(EMPTY_SPACE, '_')
    .replaceAll(DASH, '_');

const cleanOutputDirAndProcessFrom = async (
  sourceDir: string,
  outputDir: string,
  songIds?: string[],
) => {
  fsExtra.emptyDirSync(outputDir);

  const parsedSongs = (await recursive(sourceDir, FILES_TO_IGNORE))
    .filter((filePath) => !path.basename(filePath).includes('Icon'))
    .filter((filePath) =>
      !isEmpty(songIds)
        ? songIds?.some((songId) => path.basename(filePath).includes(songId))
        : true,
    )
    .filter((filePath: string) => {
      const data = fs.readFileSync(filePath).toString();

      if (data.includes('<presentation></presentation>')) {
        console.warn(
          chalk.yellow(`The song "${filePath}"'s presentation is empty.`),
        );

        return false;
      }

      return true;
    })
    .map((filePath: string) => {
      const fileName = path.basename(filePath);
      const data = fs.readFileSync(filePath).toString();

      // console.log(chalk.cyan(`Processing "${path.basename(filePath)}".`));
      // logFileWithLinkInConsole(filePath);

      return {
        processed: processOSFileAndConvertToTxt(data, fileName),
        filePath,
      };
    });

  const groupedSongs = groupBy(parsedSongs, (song) => {
    const authors =
      song.processed.song.authors
        ?.map((author) => author.name)
        ?.filter((candidate) => !AUTHORS_TO_IGNORE.includes(candidate)) || [];

    if (size(authors) > 1) {
      return getPathForAuthor(authors.join(`${COMMA}${EMPTY_SPACE}`));
    }

    const singleAuthor = first(authors) as string;

    const UNKNOWN_AUTHOR = 'Autor Necunoscut';
    if (
      new RegExp(`(^Anon.*|^Necu.*| necun.*|\\?.*|Autor nec)`, 'gi').test(singleAuthor)
    ) {
      return getPathForAuthor(UNKNOWN_AUTHOR);
    }

    return getPathForAuthor(singleAuthor)
      ? getPathForAuthor(singleAuthor)
      : getPathForAuthor(UNKNOWN_AUTHOR);
  });

  Object.entries(groupedSongs).forEach(([authorPath, parsedSongsArray]) => {
    const authorDir = `${outputDir}/${authorPath}`;

    fsExtra.ensureDirSync(authorDir);

    parsedSongsArray.forEach(
      ({ processed: { exportFileName, basicTemplate }, filePath }) => {
        fs.writeFileSync(
          `${authorDir}/${exportFileName}${TXT_EXTENSION}`,
          basicTemplate!,
        );
      },
    );
  });

  fs.writeFileSync(
    `${outputDir}/authors${TXT_EXTENSION}`,
    Object.keys(groupedSongs).sort().join(NEW_LINE),
  );
};

(async () => {
  await cleanOutputDirAndProcessFrom(
    process.env.FOLDER_INPUT_RC_OS,
    './out/resurse_crestine',
  );
})();
