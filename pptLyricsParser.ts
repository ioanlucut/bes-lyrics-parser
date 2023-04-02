const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const fsExtra = require('fs-extra');
const PPTX = require('./js-pptx/pptx');

const DIR = './RAW_SOURCE_PPT_FROM_FC';
const EMPTY_SPACE = ' ';
const OUTPUT_DIR = './txt_from_ppt_fc';
const EMPTY_STRING = '';
const NEW_LINE = '\n';

const processPPTFileAndConvertToTxt = (fileName: string) => {
  const filePath = path.join(DIR, fileName);
  const data = fs.readFileSync(filePath);
  const presentation = new PPTX.Presentation();

  const attemptToProcess = (err: Error) => {
    if (err) {
      console.error(err);

      return;
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

    const sections = [] as string[];
    let customIndex = 1;

    const basicFormat = slidesAsText
      .map((slideTextEntry) => {
        const section = `${
          _.startsWith(slideTextEntry, '/:') ? 'chorus' : customIndex++
        }`;
        sections.push(section);

        return `[${section}]
${slideTextEntry}`;
      })
      .join(NEW_LINE);

    const content = basicFormat
      .replaceAll('Ref.', EMPTY_STRING)
      .replaceAll('AMIN!', EMPTY_STRING)
      .replaceAll(/\d{2}(\.|-)\d{2}(\.|-)\d{4}/gi, EMPTY_STRING)
      .replaceAll(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, EMPTY_STRING)
      .replaceAll(/([a-zîâșăț])([A-ZÎÂȘĂȚ])/gu, `$1${NEW_LINE}$2`)
      .replaceAll(/(,)([A-ZÎÂȘĂȚ])/gu, `$1${NEW_LINE}$2`)
      .replaceAll(/(, )([A-ZÎÂȘĂȚ])/gu, `$1${NEW_LINE}$2`)
      .replaceAll(/([a-zîâșățA-ZÎÂȘĂȚ.,;])(\/:)/g, `$1${NEW_LINE}$2`)
      .replaceAll(
        /([a-zîâșățA-ZÎÂȘĂȚ]\.)([a-zîâșățA-ZÎÂȘĂȚ])/g,
        `$1${NEW_LINE}$2`,
      )
      .replaceAll(
        /([a-zîâșățA-ZÎÂȘĂȚ],)([a-zîâșățA-ZÎÂȘĂȚ])/g,
        `$1${NEW_LINE}$2`,
      )
      .replaceAll(
        /([a-zîâșățA-ZÎÂȘĂȚ]:)([a-zîâșățA-ZÎÂȘĂȚ])/g,
        `$1${NEW_LINE}$2`,
      )
      .replaceAll(
        /([a-zîâșățA-ZÎÂȘĂȚ];)([a-zîâșățA-ZÎÂȘĂȚ])/g,
        `$1${NEW_LINE}$2`,
      )
      .replaceAll(
        /([a-zîâșățA-ZÎÂȘĂȚ]!)([a-zîâșățA-ZÎÂȘĂȚ])/g,
        `$1${NEW_LINE}$2`,
      )
      .replaceAll(/(:\/)(\/:)/g, `$1${NEW_LINE}$2`)
      .replaceAll(/(:\/)([a-zîâșățA-ZÎÂȘĂȚ])/g, `$1${NEW_LINE}$2`)
      .replaceAll(
        /([a-zîâșățA-ZÎÂȘĂȚ];)([a-zîâșățA-ZÎÂȘĂȚ])/g,
        `$1${NEW_LINE}$2`,
      );

    const exportFileName = _.capitalize(
      _.trim(
        fileName
          .replaceAll(/\./gi, EMPTY_STRING)
          .replaceAll(/[0-9]/gi, EMPTY_STRING)
          .replaceAll(',', EMPTY_STRING)
          .replaceAll('!', EMPTY_STRING)
          .replaceAll('_', EMPTY_STRING)
          .replaceAll(' ', EMPTY_STRING)
          .replaceAll(/pptx/gi, EMPTY_STRING),
      )
        .split(EMPTY_SPACE)
        .filter(Boolean)
        .join(EMPTY_SPACE)
        .toLowerCase(),
    );
    const exportFileNamePath = `${OUTPUT_DIR}/${exportFileName}.txt`;

    const basicTemplate = `[title]
${exportFileName}

[sequence]
${sections.join(',')}

${content}`;

    fs.writeFileSync(exportFileNamePath, basicTemplate);
  };

  try {
    presentation.load(data, attemptToProcess);
  } catch (error) {
    console.error(`Error with ${filePath}`, error);
  }
};

fsExtra.emptyDirSync(OUTPUT_DIR);
fs.readdirSync(DIR).forEach(processPPTFileAndConvertToTxt as any);
