import fs from 'fs';
import path from 'path';
import { processOSFileAndConvertToTxt } from './opensongParser';

describe('opensongParser', () => {
  describe('VCTC', () => {
    const MOCK_OS = 'mock_opensong_1_format_VCTC.txt';
    const MOCK_OS_CONTENT = fs
      .readFileSync(path.resolve(__dirname, '../mocks/' + MOCK_OS))
      .toString();

    it('should import and parse an opensong format correctly', () => {
      const { exportFileName, basicTemplate } = processOSFileAndConvertToTxt(
        MOCK_OS_CONTENT,
        'mock_opensong_1_format_VCTC - 12345.txt',
      );

      expect(exportFileName).toMatchInlineSnapshot(
        `"mock_opensong_1_format_VCTC - 12345.txt"`,
      );
      expect(basicTemplate).toMatchInlineSnapshot(`
        "[title]
        Isus e rege {author: {Lari Muntean adaptare după Sinach}, {rcId: {12345}}

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
      const { exportFileName, basicTemplate } = processOSFileAndConvertToTxt(
        MOCK_1_CONTENT,
        MOCK_OS,
      );

      expect(exportFileName).toMatchInlineSnapshot(
        `"mock_opensong_2_format_CVCT.txt"`,
      );
      expect(basicTemplate).toMatchInlineSnapshot(`
        "[title]
        O noua zi {author: {Rahela Goagără}}

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
      const { exportFileName, basicTemplate } = processOSFileAndConvertToTxt(
        MOCK_1_CONTENT,
        MOCK_OS,
      );

      expect(exportFileName).toMatchInlineSnapshot(
        `"mock_opensong_3_format_wrong_STSB.txt"`,
      );
      expect(basicTemplate).toMatchInlineSnapshot(`
        "[title]
        De dragul meu {author: {Chris}}

        [sequence]
        __S__,e,__S__2,b

        [__S__]
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

        [__S__2]
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
});
