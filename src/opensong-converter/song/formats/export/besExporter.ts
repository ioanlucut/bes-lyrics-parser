import { FileExporter } from './index';
import { Song } from '../../song';

export const besExporter: FileExporter = {
  name: 'BES',
  fileExtensions: ['.txt'],

  exportFile(song: Song) {
    return JSON.stringify(song);
  },
};
