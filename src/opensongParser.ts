import { importFile } from './opensong-converter/song/formats/import';
import { exportFile } from './opensong-converter/song/formats/export';

export const processOSFileAndConvertToTxt = (
  fileContent: string,
  fileName: string,
) => {
  const song = importFile(fileContent, fileName);
  const convertedInBESFormat = exportFile(song, fileName);

  return {
    exportFileName: fileName,
    basicTemplate: convertedInBESFormat,
    song,
  };
};
