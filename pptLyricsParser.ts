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
    .filter((filePath) => !path.basename(filePath).includes('Icon'))
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
})();
