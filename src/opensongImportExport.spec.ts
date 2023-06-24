import fs from 'fs';
import path from 'path';
import { importFile } from './opensong-converter/song/formats/import';
import { exportFile } from './opensong-converter/song/formats/export';

describe('opensongImportExport', () => {
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

    expect(importFile(fileContent, ANY_FILE_NAME)).toMatchInlineSnapshot(`
      {
        "authors": [
          {
            "name": "Lari Muntean (adaptare după Sinach)",
          },
        ],
        "music": {
          "parts": [
            {
              "content": [
                [
                  {
                    "lyrics": "Al Tău nume e-nălțat,",
                  },
                ],
                [
                  {
                    "lyrics": "Isus, pe-ntreg pământ!",
                  },
                ],
                [
                  {
                    "lyrics": "Nume puternic și măreț,",
                  },
                ],
                [
                  {
                    "lyrics": "Plin de glorie și sfânt,",
                  },
                ],
                [
                  {
                    "lyrics": "În El sunt salvat!",
                  },
                ],
              ],
              "name": "V1",
              "type": "verse",
            },
            {
              "content": [
                [
                  {
                    "lyrics": "/: Isus e Rege vrednic de laudă,",
                  },
                ],
                [
                  {
                    "lyrics": "Domn peste toate, nimeni nu este ca El!",
                  },
                ],
                [
                  {
                    "lyrics": "Isus e mare, sfânt și înălțat,",
                  },
                ],
                [
                  {
                    "lyrics": "Alfa, Omega, nimeni nu este ca El! : /",
                  },
                ],
              ],
              "name": "C1",
              "type": "chorus",
            },
            {
              "content": [
                [
                  {
                    "lyrics": "Nume de viață plin,",
                  },
                ],
                [
                  {
                    "lyrics": "Tu trăiești în noi!",
                  },
                ],
                [
                  {
                    "lyrics": "În al Său nume biruim,",
                  },
                ],
                [
                  {
                    "lyrics": "Prin El victoria primim,",
                  },
                ],
                [
                  {
                    "lyrics": "Ce Nume minunat!",
                  },
                ],
              ],
              "name": "V2",
              "type": "verse",
            },
            {
              "content": [
                [
                  {
                    "lyrics": "El e Domnul vieții înălțat,",
                  },
                ],
                [
                  {
                    "lyrics": "Prin moarte ne-a răscumpărat,",
                  },
                ],
                [
                  {
                    "lyrics": "Fie lăudat!",
                  },
                ],
                [
                  {
                    "lyrics": "Orice genunchi se va pleca,",
                  },
                ],
                [
                  {
                    "lyrics": "De aceea aleșii Îi vor cânta:",
                  },
                ],
                [
                  {
                    "lyrics": "Isus Hristos e Domn!",
                  },
                ],
              ],
              "name": "T",
              "type": "tag",
            },
            {
              "content": [
                [
                  {
                    "lyrics": "/: Isus, Domn Preasfânt!",
                  },
                ],
                [
                  {
                    "lyrics": "Isus, Tu ești Sfânt!",
                  },
                ],
                [
                  {
                    "lyrics": "Isus, Isus! : /",
                  },
                ],
              ],
              "name": "C2",
              "type": "chorus",
            },
          ],
          "voices": {
            "lyrics": "lyrics",
          },
        },
        "presentation": "V1 C1 V2 C1 T C2 C1",
        "title": "Isus e Rege",
      }
    `);
  });

  it('should import and export an opensong format correctly', () => {
    const ANY_FILE_NAME = 'Isus e Rege - 176028';

    const fileContent = fs
      .readFileSync(
        path.resolve(
          __dirname,
          '../RAW_SOURCE_FROM_RESURSE_CRESTINE/' + ANY_FILE_NAME,
        ),
      )
      .toString();

    const song = importFile(fileContent, ANY_FILE_NAME);
    expect(exportFile(song, ANY_FILE_NAME)).toMatchInlineSnapshot(`
      "[title]
      Isus e rege {Author: {Lari Muntean adaptare după Sinach}}

      [sequence]
      1,c,2,c,e,t,c

      V1
      Al Tău nume e-nălțat,
      Isus, pe-ntreg pământ!
      Nume puternic și măreț,
      Plin de glorie și sfânt,
      În El sunt salvat!

      C1
      /: Isus e Rege vrednic de laudă,
      Domn peste toate, nimeni nu este ca El!
      Isus e mare, sfânt și înălțat,
      Alfa, Omega, nimeni nu este ca El! :/

      V2
      Nume de viață plin,
      Tu trăiești în noi!
      În al Său nume biruim,
      Prin El victoria primim,
      Ce Nume minunat!

      T
      El e Domnul vieții înălțat,
      Prin moarte ne-a răscumpărat,
      Fie lăudat!
      Orice genunchi se va pleca,
      De aceea aleșii Îi vor cânta:
      Isus Hristos e Domn!

      C2
      /: Isus, Domn Preasfânt!
      Isus, Tu ești Sfânt!
      Isus, Isus! :/"
    `);
  });
});
