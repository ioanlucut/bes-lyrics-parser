import { Song } from '../../song';
import { determineFormat, FileFormat, processFormats } from '../index';
import { besExporter } from './besExporter';

export interface FileExporter extends FileFormat {
  exportFile(song: Song): string;
}

export const exporters = processFormats([besExporter]);

const FORMAT_NAME = 'BES';

export const exportFile = (
  song: Song,
  fileName?: string,
  formatName: string = FORMAT_NAME,
  defaultFormatName: string = FORMAT_NAME,
) => {
  const exporter = determineFormat(
    exporters,
    defaultFormatName,
    fileName,
    formatName,
  );

  return exporter.exportFile(song);
};
