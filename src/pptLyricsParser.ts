// @ts-ignore
import PPTX from './js-pptx/pptx';

import { Iconv } from 'iconv';
const iconv = new Iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE');

const { startsWith, capitalize, trim } = require('lodash');
const EMPTY_SPACE = ' ';
const EMPTY_STRING = '';
const NEW_LINE = '\n';
const CARET_RETURN = '\r';
const CHORUS_SEQ = 'chorus';

const isChorus = (slideTextEntry: string) => startsWith(slideTextEntry, '/:');

export const processPPTFileAndConvertToTxt = (
  data: Buffer,
  fileName: string,
) => {
  const presentation = new PPTX.Presentation();

  let exportFileName;
  let basicTemplate;

  const attemptToProcess = (err: Error) => {
    if (err) {
      throw err;
    }

    const slideCounts = presentation.getSlideCount();
    const slidesAsText = [];

    for (let i = 0; i < slideCounts; i++) {
      const shapes = presentation.getSlide(`slide${i + 1}`).getShapes();
      const allTextAsOnce = shapes
        ?.map((shape: any) => shape.text())
        .join(EMPTY_STRING);

      slidesAsText.push(allTextAsOnce);
    }

    const seq = [] as string[];
    let customIndex = 1;

    const basicFormat = slidesAsText
      .map((slideTextEntry) => {
        const seqIndex = `${
          isChorus(slideTextEntry) ? CHORUS_SEQ : customIndex++
        }`;
        seq.push(seqIndex);

        return `[${seqIndex}]
${slideTextEntry}`;
      })
      .join(`${CARET_RETURN}${NEW_LINE}${CARET_RETURN}${NEW_LINE}`);

    const content = basicFormat
      .replaceAll('Ref.', EMPTY_STRING)
      .replaceAll('AMIN!', EMPTY_STRING)
      .replaceAll(' ', EMPTY_STRING)
      .replaceAll('ţ', 'ț')
      .replaceAll('Ţ', 'Ț')
      .replaceAll('ş', 'ș')
      .replaceAll('Ş', 'Ș')
      .replaceAll('"', '”')
      .replaceAll('…', '.')
      .replaceAll('–', '-')
      .replaceAll(' .', '.')
      .replaceAll("'", '’')
      .replaceAll('`', '’')
      .replaceAll("'", '’')
      .replaceAll('‘', '’')
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

    const parsedFileName = capitalize(
      trim(
        fileName
          .replaceAll(/\./gi, EMPTY_STRING)
          .replaceAll(/[0-9]/gi, EMPTY_STRING)
          .replaceAll(',', EMPTY_STRING)
          .replaceAll('!', EMPTY_STRING)
          .replaceAll('_', EMPTY_STRING)
          .replaceAll(' ', EMPTY_STRING)
          .replaceAll(/pptx/gi, EMPTY_STRING)
          .replaceAll('"', EMPTY_SPACE)
          .replaceAll('…', EMPTY_SPACE)
          .replaceAll('–', '-')
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

    exportFileName = iconv
      .convert(parsedFileName)
      .toString()
      .replaceAll('^a', 'a')
      .replaceAll('^A', 'A')
      .replaceAll('^i', 'i')
      .replaceAll('^I', 'I');

    basicTemplate = `[title]
${exportFileName}

[sequence]
${seq.join(',').replaceAll(CHORUS_SEQ, 'c')}

${content}`;
  };

  presentation.load(data, attemptToProcess);

  return { exportFileName, basicTemplate };
};
