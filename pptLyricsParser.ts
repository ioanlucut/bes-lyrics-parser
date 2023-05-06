import fs from 'fs';
import path from 'path';
import fsExtra from 'fs-extra';
import { processPPTFileAndConvertToTxt } from './src/pptLyricsParser';

const cleanOutputDirAndProcessFrom = (sourceDir: string, outputDir: string) => {
  fsExtra.emptyDirSync(outputDir);

  fs.readdirSync(sourceDir).forEach((fileName: string) => {
    const filePath = path.join(sourceDir, fileName);
    const data = fs.readFileSync(filePath);
    console.log(`Processing ${fileName}..`);

    const { exportFileName, basicTemplate } = processPPTFileAndConvertToTxt(
      data,
      fileName,
    );

    fs.writeFileSync(`${outputDir}/${exportFileName}.txt`, basicTemplate!);
  });
};

(async () => {
  cleanOutputDirAndProcessFrom(
    '/Users/ilucut/Biserica Emanuel SB SYNC/Cantece (PPT sau Audio)/PPT cor de copii Dynamis/PPT',
    './out/cor_copii_ppt',
  );
  // cleanOutputDirAndProcessFrom('./RAW_SOURCE_PPT_FROM_FC', './txt_from_ppt_fc');
})();
