const { startsWith } = require('lodash');
// @ts-ignore
import PPTX from './js-pptx/pptx';
import {
  CARET_RETURN,
  cleanContent,
  cleanFilename,
  EMPTY_STRING,
  NEW_LINE,
} from './contentCleaner';

const CHORUS_SEQ = 'chorus';

const isChorus = (slideTextEntry: string) => startsWith(slideTextEntry, '/:');

export const processPPTFileAndConvertToTxt = (
  data: Buffer,
  fileName: string,
) => {
  const presentation = new PPTX.Presentation();

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

    const exportFileName = cleanFilename(fileName);
    const content = cleanContent(basicFormat);

    basicTemplate = `[title]
${exportFileName}

[sequence]
${seq.join(',').replaceAll(CHORUS_SEQ, 'c')}

${content}`;
  };

  presentation.load(data, attemptToProcess);

  return {
    exportFileName: cleanFilename(fileName),
    basicTemplate,
  };
};
