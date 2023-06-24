import fs from 'fs';
import path from 'path';
import { processOSFileAndConvertToTxt } from './opensongParser';

describe.only('opensongParser', () => {
  it('should import and parse an opensong format correctly', () => {
    const ANY_FILE_NAME = 'Isus e Rege - 176028';

    const fileContent = fs
      .readFileSync(
        path.resolve(
          __dirname,
          '../RAW_SOURCE_FROM_RESURSE_CRESTINE/' + ANY_FILE_NAME,
        ),
      )
      .toString();

    const { exportFileName, basicTemplate } = processOSFileAndConvertToTxt(
      fileContent,
      ANY_FILE_NAME,
    );

    expect(exportFileName).toMatchInlineSnapshot(`"Isus e Rege - 176028"`);
    expect(basicTemplate).toMatchInlineSnapshot(`
      "[title]
      Isus e rege {Author: {Lari Muntean adaptare după Sinach}}

      [sequence]
      1,c,2,c,b,t,c

      [1]
      Al Tău nume e-nălțat,
      Isus, pe-ntreg pământ!
      Nume puternic și măreț,
      Plin de glorie și sfânt,
      În El sunt salvat!

      [chorus]
      /: Isus e Rege vrednic de laudă,
      Domn peste toate, nimeni nu este ca El!
      Isus e mare, sfânt și înălțat,
      Alfa, Omega, nimeni nu este ca El! :/

      [2]
      Nume de viață plin,
      Tu trăiești în noi!
      În al Său nume biruim,
      Prin El victoria primim,
      Ce Nume minunat!

      [bridge]
      El e Domnul vieții înălțat,
      Prin moarte ne-a răscumpărat,
      Fie lăudat!
      Orice genunchi se va pleca,
      De aceea aleșii Îi vor cânta:
      Isus Hristos e Domn!

      [chorus 2]
      /: Isus, Domn Preasfânt!
      Isus, Tu ești Sfânt!
      Isus, Isus! :/"
    `);
  });
});
