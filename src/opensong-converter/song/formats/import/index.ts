import { Song } from '../../song';
import { determineFormat, FileFormat, processFormats } from '../index';
import { openSongImporter } from './opensong';
import { last, parseInt } from 'lodash';
import { EMPTY_STRING, RC_DASH, TXT_EXTENSION } from '../../../../constants';

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
  const song = importer.importFile(fileContent);
  const maybeRcIdAsString = last(
    fileName.replace(TXT_EXTENSION, EMPTY_STRING).split(RC_DASH),
  );
  if (maybeRcIdAsString) {
    const maybeRcId = parseInt(maybeRcIdAsString as never);
    if (!isNaN(maybeRcId)) {
      song.rcId = maybeRcId;
    }
  }

  return song;
};
