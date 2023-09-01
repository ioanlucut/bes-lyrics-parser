import fs from 'fs';
import path from 'path';
import fsExtra from 'fs-extra';
import recursive from 'recursive-readdir';
import dotenv from 'dotenv';
import chalk from 'chalk';
import { processOSFileAndConvertToTxt } from './src/opensongParser';
import { COMMA, EMPTY_SPACE, TXT_EXTENSION } from './src/constants';
import { first, groupBy, isEmpty, reject, size } from 'lodash';
import { cleanContent, cleanFilename } from './src/contentCleaner';

dotenv.config();

const FILES_TO_IGNORE = ['.DS_Store'];
const AUTHORS_TO_IGNORE = 'Traducere RO';

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
      return authors.join(`${COMMA}${EMPTY_SPACE}`);
    }

    const singleAuthor = first(authors) as string;

    const UNKNOWN_AUTHOR = 'Autor Necunoscut';
    if (
      new RegExp(`(^Anon.*|^Necu.*| necun.*|\\?.*)`, 'gi').test(singleAuthor)
    ) {
      return UNKNOWN_AUTHOR;
    }

    return singleAuthor;
  });

  Object.entries(groupedSongs).forEach(([author, parsedSongsArray]) => {
    const authorPath = cleanContent(author);
    const authorDir = `${outputDir}/${authorPath}`;

    fsExtra.ensureDirSync(authorDir);

    parsedSongsArray.forEach(
      ({ processed: { exportFileName, song, basicTemplate }, filePath }) => {
        fs.writeFileSync(
          `${authorDir}/${exportFileName}${TXT_EXTENSION}`,
          basicTemplate!,
        );
      },
    );
  });
};

(async () => {
  await cleanOutputDirAndProcessFrom(
    process.env.FOLDER_INPUT_RC_OS,
    './out/resurse_crestine',
  );
})();
