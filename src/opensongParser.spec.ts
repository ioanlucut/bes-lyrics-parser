import fs from 'fs';
import path from 'path';
import { importFile } from './opensong-converter/song/formats/import';
import { exportFile } from './opensong-converter/song/formats/export';

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
    expect(exportFile(song, ANY_FILE_NAME)).toMatchInlineSnapshot(
      `"{"title":"Isus e Rege","music":{"voices":{"lyrics":"lyrics"},"parts":[{"name":"V1","content":[[{"lyrics":"Al Tău nume e-nălțat,"}],[{"lyrics":"Isus, pe-ntreg pământ!"}],[{"lyrics":"Nume puternic și măreț,"}],[{"lyrics":"Plin de glorie și sfânt,"}],[{"lyrics":"În El sunt salvat!"}]],"type":"verse"},{"name":"C1","content":[[{"lyrics":"/: Isus e Rege vrednic de laudă,"}],[{"lyrics":"Domn peste toate, nimeni nu este ca El!"}],[{"lyrics":"Isus e mare, sfânt și înălțat,"}],[{"lyrics":"Alfa, Omega, nimeni nu este ca El! : /"}]],"type":"chorus"},{"name":"V2","content":[[{"lyrics":"Nume de viață plin,"}],[{"lyrics":"Tu trăiești în noi!"}],[{"lyrics":"În al Său nume biruim,"}],[{"lyrics":"Prin El victoria primim,"}],[{"lyrics":"Ce Nume minunat!"}]],"type":"verse"},{"name":"T","content":[[{"lyrics":"El e Domnul vieții înălțat,"}],[{"lyrics":"Prin moarte ne-a răscumpărat,"}],[{"lyrics":"Fie lăudat!"}],[{"lyrics":"Orice genunchi se va pleca,"}],[{"lyrics":"De aceea aleșii Îi vor cânta:"}],[{"lyrics":"Isus Hristos e Domn!"}]],"type":"tag"},{"name":"C2","content":[[{"lyrics":"/: Isus, Domn Preasfânt!"}],[{"lyrics":"Isus, Tu ești Sfânt!"}],[{"lyrics":"Isus, Isus! : /"}]],"type":"chorus"}]},"authors":[{"name":"Lari Muntean (adaptare după Sinach)"}]}"`,
    );
  });
});
