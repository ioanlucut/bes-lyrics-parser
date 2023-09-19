import fs from 'fs';
import path from 'path';
import { importFile } from './opensong-converter/song/formats/import';
import { exportFile } from './opensong-converter/song/formats/export';

describe('opensongImportExport', () => {
  describe('VCTC', () => {
    const MOCK_OS = 'mock_opensong_1_format_VCTC.txt';
    const MOCK_OS_CONTENT = fs
      .readFileSync(path.resolve(__dirname, '../mocks/' + MOCK_OS))
      .toString();

    it('should import and parse an opensong format correctly', () => {
      expect(importFile(MOCK_OS_CONTENT, MOCK_OS)).toMatchInlineSnapshot(`
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

    it('should export an opensong format correctly', () => {
      expect(exportFile(importFile(MOCK_OS_CONTENT, MOCK_OS), MOCK_OS))
        .toMatchInlineSnapshot(`
        "[title]
        Isus e rege {composer: {Lari Muntean adaptare după Sinach}}

        [sequence]
        v1,c,v2,c,e,c2,c

        [v1]
        Al Tău nume e-nălțat,
        Isus, pe-ntreg pământ!
        Nume puternic și măreț,
        Plin de glorie și sfânt,
        În El sunt salvat!

        [c]
        /: Isus e Rege vrednic de laudă,
        Domn peste toate, nimeni nu este ca El!
        Isus e mare, sfânt și înălțat,
        Alfa, Omega, nimeni nu este ca El! :/

        [v2]
        Nume de viață plin,
        Tu trăiești în noi!
        În al Său nume biruim,
        Prin El victoria primim,
        Ce Nume minunat!

        [e]
        El e Domnul vieții înălțat,
        Prin moarte ne-a răscumpărat,
        Fie lăudat!
        Orice genunchi se va pleca,
        De aceea aleșii Îi vor cânta:
        Isus Hristos e Domn!

        [c2]
        /: Isus, Domn Preasfânt!
        Isus, Tu ești Sfânt!
        Isus, Isus! :/"
      `);
    });
  });

  describe('CVCT', () => {
    const MOCK_OS = 'mock_opensong_2_format_CVCT.txt';
    const MOCK_1_CONTENT = fs
      .readFileSync(path.resolve(__dirname, '../mocks/' + MOCK_OS))
      .toString();

    it('should import and parse an opensong format correctly', () => {
      expect(importFile(MOCK_1_CONTENT, MOCK_OS)).toMatchInlineSnapshot(`
          {
            "authors": [
              {
                "name": "Rahela Goagără",
              },
            ],
            "music": {
              "parts": [
                {
                  "content": [
                    [
                      {
                        "lyrics": "Viața-n zori se-noiește,",
                      },
                    ],
                    [
                      {
                        "lyrics": "Soarele-anunță un început,",
                      },
                    ],
                    [
                      {
                        "lyrics": "Sunt înconjurat de frumuseți!",
                      },
                    ],
                    [
                      {
                        "lyrics": "Viața-n zori se-noiește,",
                      },
                    ],
                    [
                      {
                        "lyrics": "Zilnic Isus, lângă mine ești,",
                      },
                    ],
                    [
                      {
                        "lyrics": "Zilnic vreau să văd prin ochii Săi!",
                      },
                    ],
                  ],
                  "name": "C",
                  "type": "chorus",
                },
                {
                  "content": [
                    [
                      {
                        "lyrics": "Soarele răsare, razele lui strălucesc la fel",
                      },
                    ],
                    [
                      {
                        "lyrics": "Și-al păsărilor cântec nu-i schimbat",
                      },
                    ],
                    [
                      {
                        "lyrics": "Văd roua pe frunze ca de-obicei",
                      },
                    ],
                    [
                      {
                        "lyrics": "Muguri ce se-agață de ram,",
                      },
                    ],
                    [
                      {
                        "lyrics": "Dar tot ce văd Dumnezeu pentru min' a creat!",
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
                        "lyrics": "Și mâinile creatoare",
                      },
                    ],
                    [
                      {
                        "lyrics": "Munții maiestoși cu talent au sculptat,",
                      },
                    ],
                    [
                      {
                        "lyrics": "Și-atent a modelat oceane și mări,",
                      },
                    ],
                    [
                      {
                        "lyrics": "Suflare de viața, a suflat,",
                      },
                    ],
                    [
                      {
                        "lyrics": "În zi, noaptea a transformat",
                      },
                    ],
                    [
                      {
                        "lyrics": "Ca eu să mă bucur de tot ce-ai lăsat!",
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
                        "lyrics": "/: Totu-i frumos! :/",
                      },
                    ],
                  ],
                  "name": "T",
                  "type": "tag",
                },
              ],
              "voices": {
                "lyrics": "lyrics",
              },
            },
            "presentation": "C V1 C V2 C T",
            "title": "03 O noua zi",
          }
        `);
    });

    it('should export an opensong format correctly', () => {
      expect(exportFile(importFile(MOCK_1_CONTENT, MOCK_OS), MOCK_OS))
        .toMatchInlineSnapshot(`
        "[title]
        O noua zi {composer: {Rahela Goagără}}

        [sequence]
        c,v1,c,v2,c,e

        [c]
        Viața-n zori se-noiește,
        Soarele-anunță un început,
        Sunt înconjurat de frumuseți!
        Viața-n zori se-noiește,
        Zilnic Isus, lângă mine ești,
        Zilnic vreau să văd prin ochii Săi!

        [v1]
        Soarele răsare, razele lui strălucesc la fel
        Și-al păsărilor cântec nu-i schimbat
        Văd roua pe frunze ca de-obicei
        Muguri ce se-agață de ram,
        Dar tot ce văd Dumnezeu pentru min’ a creat!

        [v2]
        Și mâinile creatoare
        Munții maiestoși cu talent au sculptat,
        Și-atent a modelat oceane și mări,
        Suflare de viața, a suflat,
        În zi, noaptea a transformat
        Ca eu să mă bucur de tot ce-ai lăsat!

        [e]
        /: Totu-i frumos! :/"
      `);
    });
  });

  describe('STSB', () => {
    const MOCK_OS = 'mock_opensong_3_format_wrong_STSB.txt';
    const MOCK_1_CONTENT = fs
      .readFileSync(path.resolve(__dirname, '../mocks/' + MOCK_OS))
      .toString();

    it('should import and parse an opensong format correctly', () => {
      expect(importFile(MOCK_1_CONTENT, MOCK_OS)).toMatchInlineSnapshot(`
          {
            "authors": [
              {
                "name": "Chris",
              },
            ],
            "music": {
              "parts": [
                {
                  "content": [
                    [
                      {
                        "lyrics": "Luminile cetatii, rand pe rand se sting",
                      },
                    ],
                    [
                      {
                        "lyrics": "Si linistea se-asterne-n Betleem",
                      },
                    ],
                    [
                      {
                        "lyrics": "Doar ingeri albi, in zbor usor",
                      },
                    ],
                    [
                      {
                        "lyrics": "Pamantul il ating vestind un dar suprem.",
                      },
                    ],
                    [
                      {
                        "lyrics": "In staulul rece, in ieslea fara pret",
                      },
                    ],
                    [
                      {
                        "lyrics": "Ai coborat smerit din cerul Tau",
                      },
                    ],
                    [
                      {
                        "lyrics": "Ai ales sa mergi pe drumul lung",
                      },
                    ],
                    [
                      {
                        "lyrics": "De ura si dispret",
                      },
                    ],
                    [
                      {
                        "lyrics": "Isus, de dragul meu!",
                      },
                    ],
                  ],
                  "name": "S1",
                },
                {
                  "content": [
                    [
                      {
                        "lyrics": "Ai venit pe pamant dintre stele si ingeri",
                      },
                    ],
                    [
                      {
                        "lyrics": "In staul sarac, in valea de plangeri",
                      },
                    ],
                    [
                      {
                        "lyrics": "Copil preacurat, Fiu de Dumnezeu!",
                      },
                    ],
                    [
                      {
                        "lyrics": "Ai ales sa te nasti si sa suferi",
                      },
                    ],
                    [
                      {
                        "lyrics": "Sufletul Tau, petale de nuferi, va fi sfasiat",
                      },
                    ],
                    [
                      {
                        "lyrics": "De dragul meu!",
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
                        "lyrics": "Ce taina adanca, ce gest fara egal",
                      },
                    ],
                    [
                      {
                        "lyrics": "Cu moarte sa Te-mbraci din nemurire",
                      },
                    ],
                    [
                      {
                        "lyrics": "Sa cobori din slava pe pamant",
                      },
                    ],
                    [
                      {
                        "lyrics": "Luand pacatul greu",
                      },
                    ],
                    [
                      {
                        "lyrics": "Isus, de dragul meu!",
                      },
                    ],
                  ],
                  "name": "S2",
                },
                {
                  "content": [
                    [
                      {
                        "lyrics": "In ieslea saraca, umil",
                      },
                    ],
                    [
                      {
                        "lyrics": "Cu chip plapand de copil",
                      },
                    ],
                    [
                      {
                        "lyrics": "Tu, Dumnezeu, de dragul meu!",
                      },
                    ],
                    [
                      {
                        "lyrics": "De slava Te-ai dezbracat",
                      },
                    ],
                    [
                      {
                        "lyrics": "Chip de om ai luat",
                      },
                    ],
                    [
                      {
                        "lyrics": "Tu, Dumnezeu, de dragul meu!",
                      },
                    ],
                  ],
                  "name": "B",
                  "type": "bridge",
                },
              ],
              "voices": {
                "lyrics": "lyrics",
              },
            },
            "presentation": "S1 T S2 B",
            "title": "De dragul meu!",
          }
        `);
    });

    it('should export an opensong format correctly', () => {
      expect(exportFile(importFile(MOCK_1_CONTENT, MOCK_OS), MOCK_OS))
        .toMatchInlineSnapshot(`
        "[title]
        De dragul meu {composer: {Chris}}

        [sequence]
        s,e,s2,b

        [s]
        Luminile cetatii, rand pe rand se sting
        Si linistea se-asterne-n Betleem
        Doar ingeri albi, in zbor usor
        Pamantul il ating vestind un dar suprem.
        In staulul rece, in ieslea fara pret
        Ai coborat smerit din cerul Tau
        Ai ales sa mergi pe drumul lung
        De ura si dispret
        Isus, de dragul meu!

        [e]
        Ai venit pe pamant dintre stele si ingeri
        In staul sarac, in valea de plangeri
        Copil preacurat, Fiu de Dumnezeu!
        Ai ales sa te nasti si sa suferi
        Sufletul Tau, petale de nuferi, va fi sfasiat
        De dragul meu!

        [s2]
        Ce taina adanca, ce gest fara egal
        Cu moarte sa Te-mbraci din nemurire
        Sa cobori din slava pe pamant
        Luand pacatul greu
        Isus, de dragul meu!

        [b]
        In ieslea saraca, umil
        Cu chip plapand de copil
        Tu, Dumnezeu, de dragul meu!
        De slava Te-ai dezbracat
        Chip de om ai luat
        Tu, Dumnezeu, de dragul meu!"
      `);
    });
  });

  describe('Edge cases', () => {
    const MOCK_OS = 'mock_opensong_4_space_in_presentation_and_recital.txt';
    const MOCK_4_CONTENT = fs
      .readFileSync(path.resolve(__dirname, '../mocks/' + MOCK_OS))
      .toString();

    it('should import and parse an opensong format correctly', () => {
      expect(importFile(MOCK_4_CONTENT, MOCK_OS)).toMatchInlineSnapshot(`
        {
          "authors": [
            {
              "name": "Chris",
            },
          ],
          "music": {
            "parts": [
              {
                "content": [
                  [
                    {
                      "lyrics": "Luminile cetatii, rand pe rand se sting",
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
                      "lyrics": "Ai venit pe pamant dintre stele si ingeri",
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
                      "lyrics": "Ce taina adanca, ce gest fara egal",
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
                      "lyrics": "In ieslea saraca, umil",
                    },
                  ],
                ],
                "name": "S",
              },
            ],
            "voices": {
              "lyrics": "lyrics",
            },
          },
          "presentation": "V1 T V2 S",
          "title": "De dragul meu!",
        }
      `);
    });

    it('should export an opensong format correctly', () => {
      expect(exportFile(importFile(MOCK_4_CONTENT, MOCK_OS), MOCK_OS))
        .toMatchInlineSnapshot(`
        "[title]
        De dragul meu {composer: {Chris}}

        [sequence]
        v1,e,v2,s

        [v1]
        Luminile cetatii, rand pe rand se sting

        [e]
        Ai venit pe pamant dintre stele si ingeri

        [v2]
        Ce taina adanca, ce gest fara egal

        [s]
        In ieslea saraca, umil"
      `);
    });
  });
});
