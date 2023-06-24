import fs from 'fs';
import path from 'path';
import { processPPTFileAndConvertToTxt } from './pptLyricsParser';

describe.skip('pptLyricsParser', () => {
  it('should parse PPT song from FC', () => {
    const ANY_FILE_NAME = '10.000 motive.pptx';

    const data = fs.readFileSync(
      path.resolve(__dirname, '../RAW_SOURCE_PPT_FROM_FC/' + ANY_FILE_NAME),
    );

    const { basicTemplate, exportFileName } = processPPTFileAndConvertToTxt(
      data,
      ANY_FILE_NAME,
    );

    expect(exportFileName).toMatchInlineSnapshot(`undefined`);
    expect(basicTemplate).toMatchInlineSnapshot(`
      "[title]
      Motive

      [sequence]
      1,2,3,4,5,6,7

      [1]
      CÂNTĂ SUFLET AL MEUPENTRU DUMNEZEU, 
      CEL BINECUVÂNTATA LUI NUME E SFÂNT, 
      CÂNTĂ ACUMCUM NU AI MAI CÂNTAT.
      [2]
      E o nouă zi, soarele răsare, 
      E timp să cânt spre Slava Ta,
      Orice'ar veni, ce în faţă mi-ar apare, 
      Eu vreau să cânt şi seara laude!
      [3]
      CÂNTĂ SUFLET AL MEUPENTRU DUMNEZEU, 
      CEL BINECUVÂNTATA LUI NUME E SFÂNT, 
      CÂNTĂ ACUMCUM NU AI MAI CÂNTAT.
      [4]
      Încet Tu ești Doamne la mânie,
      În dragoste ești bogat, și ești bun,
      Găsesc că am 10.000 de motive,
      Ca să Te laud și tuturor să spun.
      [5]
      CÂNTĂ SUFLET AL MEUPENTRU DUMNEZEU, 
      CEL BINECUVÂNTATA LUI NUME E SFÂNT, 
      CÂNTĂ ACUMCUM NU AI MAI CÂNTAT.
      [6]
      Iar când sfârșitul îmi va fi aproape,
      Puterile când îmi vor slăbi,
      Al meu suflet va cânta continuu,
      Ori 10.000 de ani și-n veșnicii.
      [7]
      CÂNTĂ SUFLET AL MEUPENTRU DUMNEZEU, 
      CEL BINECUVÂNTATA LUI NUME E SFÂNT, 
      CÂNTĂ ACUMCUM NU AI MAI CÂNTAT."
    `);
  });

  it('should parse PPT song', () => {
    const ANY_FILE_NAME = '.Eu ma-ncred doar in Domnul.pptx';

    const data = fs.readFileSync(
      path.resolve(__dirname, '../RAW_SOURCE_PPT/' + ANY_FILE_NAME),
    );

    const { basicTemplate, exportFileName } = processPPTFileAndConvertToTxt(
      data,
      ANY_FILE_NAME,
    );

    expect(exportFileName).toMatchInlineSnapshot(`undefined`);
    expect(basicTemplate).toMatchInlineSnapshot(`
      "[title]
      Eu ma-ncred doar in domnul

      [sequence]
      1,2,3,4

      [1]
      Eu mă-ncred doar în Domnul,
      El mă ajută,
      Eu mă-ncred doar în Domnul,
      El e-a mea stâncă.
      El e-al meu turn în care
      La necaz alerg,
      Eu mă-ncred doar în Domnul
      Știu că nu greşesc.
      [2]
      PE DOMNUL SLĂVESC,  AJUTORUL MEU,
      EL E SLAVA MEA ŞI CÂND DRUMU-I GREU.
      TOATE POPOARELE LUMII
      SĂ SE-NCREADĂ-N EL,
      EU MĂ-NCRED DOAR ÎN DOMNUL
      ŞTIU CĂ NU GREŞESC.
      [3]
      Eu mă-ncred doar în Domnul,
      Salvatorul meu,
      Eu mă-ncred doar în Domnul,
      El mă iubeşte.
      El din cer jos a venit,
      viaţă-n dar mi-a dat,
      Eu mă-ncred doar în Domnul,
      Căci El m-a salvat.
      [4]
      PE DOMNUL SLĂVESC,  AJUTORUL MEU,
      EL E SLAVA MEA ŞI CÂND DRUMU-I GREU.
      TOATE POPOARELE LUMII
      SĂ SE-NCREADĂ-N EL,
      EU MĂ-NCRED DOAR ÎN DOMNUL
      ŞTIU CĂ NU GREŞESC."
    `);
  });
});
