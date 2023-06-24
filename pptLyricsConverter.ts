import fs from 'fs';
import path from 'path';
import fsExtra from 'fs-extra';
import recursive from 'recursive-readdir';
import { processPPTFileAndConvertToTxt } from './src/pptLyricsParser';

const TXT = `.txt`;
const RAW_CLOUD_DATA =
  '/Users/ilucut/WORK/BES/CLOUD DATA/Cantece (PPT sau Audio)';

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
      console.log(`Processing "${filePath}".`);

      const { exportFileName, basicTemplate } = processPPTFileAndConvertToTxt(
        data,
        fileName,
      );

      fs.writeFileSync(`${outputDir}/${exportFileName}${TXT}`, basicTemplate!);
    });
};

(async () => {
  await cleanOutputDirAndProcessFrom(
    `${RAW_CLOUD_DATA}/Cor de copii Dynamis/PPT`,
    './out/cor_copii_ppt',
  );

  await cleanOutputDirAndProcessFrom(
    `${RAW_CLOUD_DATA}/Cantari Beni`,
    './out/cantari_beni_ppt',
  );

  await cleanOutputDirAndProcessFrom(
    `${RAW_CLOUD_DATA}/Cantari fanfara`,
    './out/cantari_fanfara_ppt',
  );

  await cleanOutputDirAndProcessFrom(
    `${RAW_CLOUD_DATA}/Grupul Betel`,
    './out/grupul_bethel__ppt',
  );

  await cleanOutputDirAndProcessFrom(
    `${RAW_CLOUD_DATA}/Grupul Ekklesia`,
    './out/grupul_ekklesia__ppt',
  );

  await cleanOutputDirAndProcessFrom(
    `${RAW_CLOUD_DATA}/Grupul Petras`,
    './out/grupul_petras__ppt',
  );

  await cleanOutputDirAndProcessFrom(
    `${RAW_CLOUD_DATA}/Cor Barbatesc`,
    './out/cor_barbatesc__ppt',
  );

  await cleanOutputDirAndProcessFrom(
    `${RAW_CLOUD_DATA}/Cantari Florin/(florin colinde)`,
    './out/fc_colinde__ppt',
  );

  await cleanOutputDirAndProcessFrom(
    `${RAW_CLOUD_DATA}/Cantari Florin/(florin rusalii)`,
    './out/fc_rusalii__ppt',
  );

  await cleanOutputDirAndProcessFrom(
    `${RAW_CLOUD_DATA}/Cantari Florin/(florin staruinta)`,
    './out/fc_staruinta__ppt',
  );

  await cleanOutputDirAndProcessFrom(
    `${RAW_CLOUD_DATA}/Cantari Florin/[florin toate cantarile]`,
    './out/fc_toate_cantarile__ppt',
  );

  await cleanOutputDirAndProcessFrom(
    `${RAW_CLOUD_DATA}/Cantari Florin/Cantari cu LOGO-ul bisericii`,
    './out/fc_cu_logo__ppt',
  );

  await cleanOutputDirAndProcessFrom(
    `${RAW_CLOUD_DATA}/Cantari Florin/Cantari cu LOGO-ul bisericii`,
    './out/fc_cu_logo__ppt',
  );

  await cleanOutputDirAndProcessFrom(
    `${RAW_CLOUD_DATA}/Cantari Florin/Cantari cu LOGO-ul bisericii`,
    './out/gramada__ppt',
  );
})();
