import fs from 'fs';
import path from 'path';
import { processPPTFileAndConvertToTxt } from './pptLyricsParser';

describe('pptLyricsParser', () => {
  it('should parse a PPT song', () => {
    const ANY_FILE_NAME = 'mock_pptx_1.pptx';

    const data = fs.readFileSync(
      path.resolve(__dirname, '../mocks/' + ANY_FILE_NAME),
    );

    const { basicTemplate, exportFileName } = processPPTFileAndConvertToTxt(
      data,
      ANY_FILE_NAME,
    );

    expect(exportFileName).toMatchInlineSnapshot(`"Mock"`);
    expect(basicTemplate).toMatchInlineSnapshot(`
      "[title]
      Mock

      [sequence]
      v1,v2,v3,v4,v5,v6

      [v1]
      A Lui Isus venire Curând se apropie
      Și bucurie ne-aduce,
      Căci mii în jur suspină După măreața clipă.
      Grăbește-Ți venirea Doamne!

      [v2]
      Isus vine-n curând! Noi știm că El
      Vine să-Și ia mireasa Sa.
      Cu inima senină, 
      Îl așteptăm să vină
      Grăbește-Ți venirea Doamne!

      [v3]
      Durerea și păcatul Domină-ntreg pământul
      Lumea în noapte se zbate.
      Dar în ziua măreață, Îi vom sta față-n față.
      Grăbește-Ți venirea Doamne!

      [v4]
      Isus vine-n curând! Noi știm că El
      Vine să-Și ia mireasa Sa.
      Cu inima senină, 
      Îl așteptăm să vină
      Grăbește-Ți venirea Doamne!

      [v5]
      El astăzi ne îndeamnă
      Să priveghem în rugă
      Nu știm nici ziua nici ora.
      Doamne-mi albești sufletul Și îmi spală veșmântul
      Spală-l în sânge pe Calvar.

      [v6]
      Isus vine-n curând! Noi știm că El
      Vine să-Și ia mireasa Sa.
      Cu inima senină, 
      Îl așteptăm să vină
      Grăbește-Ți venirea Doamne!"
    `);
  });
});
