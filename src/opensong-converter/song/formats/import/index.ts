import { Song } from '../../song';
import { FileFormat, Formats, processFormats, determineFormat } from '../index';
import { openSongImporter } from './opensong';

export interface FileImporter extends FileFormat {
  importFile(fileContent: string): Song;
}

export const autoDetectImporter: FileImporter = {
  name: 'Auto',
  fileExtensions: [],

  importFile(fileContent): Song {
    const errors: { importer: FileImporter; error: any }[] = [];
    // tslint:disable-next-line:no-use-before-declare
    for (const importer of importers.list) {
      if (importer === autoDetectImporter) {
        continue;
      }
      try {
        const song = importer.importFile(fileContent);
        return song;
      } catch (error) {
        errors.push({ importer, error });
      }
    }
    const error = new Error();
    error['cause'] = errors;
    throw error;
  },
};

export const importers = processFormats([openSongImporter, autoDetectImporter]);

export const importFile = (
  fileContent: string,
  fileName: string,
  formatName?: string,
  defaultFormatName: string = 'auto',
) => {
  const importer = determineFormat(
    importers,
    defaultFormatName,
    fileName,
    formatName,
  );
  return importer.importFile(fileContent);
};
