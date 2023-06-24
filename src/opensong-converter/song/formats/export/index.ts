import { Song } from '../../song';
import { determineFormat, FileFormat, processFormats } from '../index';
import { besExporter } from './besExporter';

export interface FileExporter extends FileFormat {
  exportFile(song: Song): string;
}

export const exporters = processFormats([besExporter]);

export const exportFile = (
  song: Song,
  fileName?: string,
  formatName: string = 'BES',
  defaultFormatName: string = 'BES',
) => {
  const exporter = determineFormat(
    exporters,
    defaultFormatName,
    fileName,
    formatName,
  );
  return exporter.exportFile(song);
};
