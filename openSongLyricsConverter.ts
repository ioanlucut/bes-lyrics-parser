import fs from 'fs';
import path from 'path';
import fsExtra from 'fs-extra';
import recursive from 'recursive-readdir';
import { processOSFileAndConvertToTxt } from './src/opensongParser';

const TXT = `.txt`;
const RAW_DATA =
  '/Users/ilucut/WORK/BES/bes-lyrics-parser/RAW_SOURCE_FROM_RESURSE_CRESTINE';

const cleanOutputDirAndProcessFrom = async (
  sourceDir: string,
  outputDir: string,
) => {
  fsExtra.emptyDirSync(outputDir);

  (await recursive(sourceDir, ['.DS_Store']))
    .filter((filePath) => !path.basename(filePath).includes('Icon'))
    .filter((filePath) => {
      const fileBasename = path.basename(filePath);

      return fileBasename.match(/Isus e Rege - 176028/);
    })
    .forEach((filePath: string) => {
      const fileName = path.basename(filePath);
      const data = fs.readFileSync(filePath).toString();
      console.log(`Processing "${filePath}".`);

      const { exportFileName, basicTemplate } = processOSFileAndConvertToTxt(
        data,
        fileName,
      );

      fs.writeFileSync(`${outputDir}/${exportFileName}${TXT}`, basicTemplate!);
    });
};

(async () => {
  await cleanOutputDirAndProcessFrom(RAW_DATA, './out/resurse_crestine');
})();
