import { capitalize, trim } from 'lodash';
import { Iconv } from 'iconv';
import { EMPTY_SPACE, EMPTY_STRING, NEW_LINE } from './constants';

const iconv = new Iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE');

export const cleanContent = (content: string = EMPTY_STRING) =>
  content
    .replaceAll('(', EMPTY_STRING)
    .replaceAll(')', EMPTY_STRING)
    .replaceAll(' ', EMPTY_STRING)
    .replaceAll('­', '-')
    .replaceAll(': /', ':/')
    .replaceAll('/ :', '/:')
    .replaceAll('ţ', 'ț')
    .replaceAll('ă', 'ă')
    .replaceAll('ș', 'ș')
    .replaceAll('ţ', 'ț')
    .replaceAll('ã', 'ă')
    .replaceAll('Ţ', 'Ț')
    .replaceAll('ï', 'i')
    .replaceAll('ş', 'ș')
    .replaceAll('+<<', 'î')
    .replaceAll('Ş', 'Ș')
    .replaceAll('"', '”')
    .replaceAll('…', '.')
    .replaceAll('–', '-')
    .replaceAll(' .', '.')
    .replaceAll("'", '’')
    .replaceAll('“', '„')
    .replaceAll('`', '’')
    .replaceAll("'", '’')
    .replaceAll('‘', '’')
    .replaceAll('|', '/')
    .replaceAll(' !', '!')
    .replaceAll(' , ', ', ')
    .replaceAll(' ,', ', ')
    .replaceAll(' –', '-')
    // aA -> a new line A
    .replaceAll(/([a-zîâșăț.,;!?’”„])([A-ZÎÂȘĂȚ])/gu, `$1${NEW_LINE}$2`)
    // a	A -> a new line A
    .replaceAll(/([a-zîâșăț]	+)([A-ZÎÂȘĂȚ])/gu, `$1${NEW_LINE}$2`)
    // Remove all tabs
    .replaceAll('\t', EMPTY_SPACE)
    // a at least two spaces or more A -> a new line A
    .replaceAll(/([a-zîâșăț] {2,})([A-ZÎÂȘĂȚ])/gu, `$1${NEW_LINE}$2`)
    // Remove all spaces
    .replaceAll(/ \n/gimu, NEW_LINE)
    .replaceAll(/ {2,}/gimu, EMPTY_SPACE)
    // a,b -> a, b
    .replaceAll(/([a-zîâșățA-ZÎÂȘĂȚ],)([a-zîâșățA-ZÎÂȘĂȚ])/g, `$1 $2`)
    .replaceAll(/(?!\()(2x|3x)/gm, `($1)`)
    .replaceAll('/(', '/ (')

    // orice:/, pune space
    .replaceAll(/([a-zîâșățA-ZÎÂȘĂȚ.,;!?’”„])(:\/)/gu, `$1 $2`)
    // cânt/:, split
    .replaceAll(/([a-zîâșățA-ZÎÂȘĂȚ.,;!?’”„])( ?\/:)/gu, `$1${NEW_LINE}$2`)
    // :/orice, pune space
    .replaceAll(/(\/:)([a-zîâșățA-ZÎÂȘĂȚ.,;!?’”„])/gu, `$1 $2`)
    .replaceAll(/(:\/)(\/:)/g, `$1${NEW_LINE}$2`)
    .replaceAll(/(:\/)([a-zîâșățA-ZÎÂȘĂȚ.,;!?’”„])/g, `$1${NEW_LINE}$2`)
    .replaceAll(/(:)(\/:)/gu, `$1${NEW_LINE}$2`)
    .replaceAll(/^( )/gm, EMPTY_SPACE);

export const cleanFilename = (rawFileName: string) => {
  const parsedFileName = capitalize(
    trim(
      rawFileName
        .replaceAll(/\./gi, EMPTY_STRING)
        .replaceAll(/[0-9]/gi, EMPTY_STRING)
        .replaceAll(',', EMPTY_STRING)
        .replaceAll('!', EMPTY_STRING)
        .replaceAll('_', EMPTY_STRING)
        .replaceAll(' ', EMPTY_STRING)
        .replaceAll(/pptx/gi, EMPTY_STRING)
        .replaceAll('"', EMPTY_SPACE)
        .replaceAll('…', EMPTY_SPACE)
        .replaceAll('-', EMPTY_SPACE)
        .replaceAll(' .', EMPTY_SPACE)
        .replaceAll('`', EMPTY_SPACE)
        .replaceAll("'", EMPTY_SPACE)
        .replaceAll('‘', EMPTY_SPACE),
    )
      .split(EMPTY_SPACE)
      .filter(Boolean)
      .join(EMPTY_SPACE)
      .toLowerCase(),
  );

  return iconv
    .convert(parsedFileName)
    .toString()
    .replaceAll('^a', 'a')
    .replaceAll('^A', 'A')
    .replaceAll('^i', 'i')
    .replaceAll('^I', 'I');
};
