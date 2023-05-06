import fs from 'fs';
import path from 'path';
import fsExtra from 'fs-extra';
import { processPPTFileAndConvertToTxt } from './src/pptLyricsParser';

const cleanOutputDirAndProcessFrom = (sourceDir: string, outputDir: string) => {
  fsExtra.emptyDirSync(outputDir);

  fs.readdirSync(sourceDir).forEach((fileName: string) => {
    const filePath = path.join(sourceDir, fileName);
    const data = fs.readFileSync(filePath);

    const { exportFileName, basicTemplate } = processPPTFileAndConvertToTxt(
      data,
      fileName,
    );

    fs.writeFileSync(`${outputDir}/${exportFileName}.txt`, basicTemplate!);
  });
};

(async () => {
  cleanOutputDirAndProcessFrom('./txt_from_ppt_fc', './RAW_SOURCE_PPT_FROM_FC');
})();
