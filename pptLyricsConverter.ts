import fs from 'fs';
import path from 'path';
import fsExtra from 'fs-extra';
import recursive from 'recursive-readdir';
import chalk from 'chalk';
import dotenv from 'dotenv';
import { processPPTFileAndConvertToTxt } from './src/pptLyricsParser';
import { TXT_EXTENSION } from './src/constants';
import { logFileWithLinkInConsole } from './src/utils';
import process from 'process';

dotenv.config();

const cleanOutputDirAndProcessFrom = async (
  sourceDir: string,
  outputDir: string,
) => {
  fsExtra.emptyDirSync(outputDir);

  (await recursive(sourceDir, ['.DS_Store']))
    .filter((filePath) => path.extname(filePath) === '.pptx')
    .filter(
      (filePath) =>
        !path.basename(filePath).includes('Icon') &&
        !path.basename(filePath).startsWith('$'),
    )
    .forEach((filePath: string) => {
      const fileName = path.basename(filePath);
      const data = fs.readFileSync(filePath);
      console.log(chalk.cyan(`Processing "${path.basename(filePath)}".`));
      logFileWithLinkInConsole(filePath);

      const { exportFileName, basicTemplate } = processPPTFileAndConvertToTxt(
        data,
        fileName,
      );

      fs.writeFileSync(
        `${outputDir}/${exportFileName}${TXT_EXTENSION}`,
        basicTemplate!,
      );
    });
};

(async () => {
  await cleanOutputDirAndProcessFrom(
    `${process.env.FOLDER_INPUT_BES_CLOUD_PPT_SONGS}/Cor de copii Dynamis/PPT`,
    './out/cor_copii_ppt',
  );

  await cleanOutputDirAndProcessFrom(
    `${process.env.FOLDER_INPUT_BES_CLOUD_PPT_SONGS}/Cantari Beni`,
    './out/cantari_beni_ppt',
  );

  await cleanOutputDirAndProcessFrom(
    `${process.env.FOLDER_INPUT_BES_CLOUD_PPT_SONGS}/Cantari fanfara`,
    './out/cantari_fanfara_ppt',
  );

  await cleanOutputDirAndProcessFrom(
    `${process.env.FOLDER_INPUT_BES_CLOUD_PPT_SONGS}/Grupul Betel`,
    './out/grupul_bethel__ppt',
  );

  await cleanOutputDirAndProcessFrom(
    `${process.env.FOLDER_INPUT_BES_CLOUD_PPT_SONGS}/Grupul Ekklesia`,
    './out/grupul_ekklesia__ppt',
  );

  await cleanOutputDirAndProcessFrom(
    `${process.env.FOLDER_INPUT_BES_CLOUD_PPT_SONGS}/Grupul Petras`,
    './out/grupul_petras__ppt',
  );

  await cleanOutputDirAndProcessFrom(
    `${process.env.FOLDER_INPUT_BES_CLOUD_PPT_SONGS}/Cor Barbatesc`,
    './out/cor_barbatesc__ppt',
  );

  await cleanOutputDirAndProcessFrom(
    `${process.env.FOLDER_INPUT_BES_CLOUD_PPT_SONGS}/Cantari Florin/(florin colinde)`,
    './out/fc_colinde__ppt',
  );

  await cleanOutputDirAndProcessFrom(
    `${process.env.FOLDER_INPUT_BES_CLOUD_PPT_SONGS}/Cantari Florin/(florin rusalii)`,
    './out/fc_rusalii__ppt',
  );

  await cleanOutputDirAndProcessFrom(
    `${process.env.FOLDER_INPUT_BES_CLOUD_PPT_SONGS}/Cantari Florin/(florin staruinta)`,
    './out/fc_staruinta__ppt',
  );

  await cleanOutputDirAndProcessFrom(
    `${process.env.FOLDER_INPUT_BES_CLOUD_PPT_SONGS}/Cantari Florin/[florin toate cantarile]`,
    './out/fc_toate_cantarile__ppt',
  );

  await cleanOutputDirAndProcessFrom(
    `${process.env.FOLDER_INPUT_BES_CLOUD_PPT_SONGS}/Cantari Florin/Cantari cu LOGO-ul bisericii`,
    './out/fc_cu_logo__ppt',
  );

  await cleanOutputDirAndProcessFrom(
    `${process.env.FOLDER_INPUT_BES_CLOUD_PPT_SONGS}/Cantari Florin/Cantari cu LOGO-ul bisericii`,
    './out/fc_cu_logo__ppt',
  );

  await cleanOutputDirAndProcessFrom(
    `${process.env.FOLDER_INPUT_BES_CLOUD_PPT_SONGS}/Cantari Florin/Cantari cu LOGO-ul bisericii`,
    './out/gramada__ppt',
  );
})();
