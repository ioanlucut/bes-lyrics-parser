import { CARET_RETURN, COMMA, EMPTY_STRING, NEW_LINE } from './constants';
// @ts-ignore
import PPTX from './js-pptx/pptx';
import { cleanContent, cleanFilename } from './contentCleaner';
import { SequenceChar, SongSection } from './types';

const { startsWith } = require('lodash');

const SEPARATOR = `${CARET_RETURN}${NEW_LINE}${CARET_RETURN}${NEW_LINE}`;

// Not very reliable, though
export const isMaybeChorus = (slideTextEntry: string) =>
  startsWith(slideTextEntry, '/:');

export const processPPTFileAndConvertToTxt = (
  data: Buffer,
  fileName: string,
) => {
  const presentation = new PPTX.Presentation();

  let basicTemplate;

  const attemptToProcess = (error: Error) => {
    if (error) {
      throw error;
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

    const sequence = [] as string[];
    let customIndex = 1;

    const basicFormat = slidesAsText
      .map((slideTextEntry) => {
        const seqIndex = `${
          isMaybeChorus(slideTextEntry)
            ? SequenceChar.CHORUS
            : SongSection.VERSE(customIndex++)
        }`;
        sequence.push(seqIndex);

        return `${seqIndex}
${slideTextEntry}`;
      })
      .join(SEPARATOR);

    const exportFileName = cleanFilename(fileName);
    const content = cleanContent(basicFormat);

    basicTemplate = `${SongSection.TITLE}
${exportFileName}

${SongSection.SEQUENCE}
${sequence.join(COMMA).replaceAll('[', EMPTY_STRING).replaceAll(']', EMPTY_STRING)}

${content}`;
  };

  presentation.load(data, attemptToProcess);

  return {
    exportFileName: cleanFilename(fileName),
    basicTemplate,
  };
};
