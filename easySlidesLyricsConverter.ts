// ---
// Parser which parses the initial XML from easy slides to markdown files
// Should be done only once
// ---
import _ from 'lodash';
import fsExtra from 'fs-extra';
import xml2js from 'xml2js';
import fs from 'fs';
import path from 'path';

const XML_DIR = './RAW_SOURCE_XML';
const RAW_XML = 'BES_MASTER.xml';
const OUTPUT_DIR = './out/easy_slides';
const EMPTY_STRING = '';
const EMPTY_SPACE = ' ';

const parser = new xml2js.Parser({});
const rawXML = fs.readFileSync(path.join(__dirname, XML_DIR, RAW_XML));
const xmlAsString = rawXML.toString();

const generateFileNameByTitle = (title: string) => {
  const normalizedTitle = title
    .replaceAll('/', EMPTY_STRING)
    .replaceAll('!', EMPTY_STRING);

  const fileName = _.capitalize(
    _.trimStart(_.trimEnd(normalizedTitle))
      .split(EMPTY_SPACE)
      .filter(Boolean)
      .join(EMPTY_SPACE)
      .toLowerCase(),
  );

  return `${OUTPUT_DIR}/${fileName}.txt`;
};

const transformSong = (parsedSongAsXML: {
  Title1: string[];
  Contents: string[];
  Sequence: string[];
}) => {
  const { Title1, Contents, Sequence } = parsedSongAsXML;
  const title = Title1.join(EMPTY_STRING);
  const syncLyrics = Contents.join(EMPTY_STRING);
  const sequenceAsString = Sequence.join(EMPTY_STRING);
  const separators = syncLyrics.match(/(\[).*/gim);

  return {
    title,
    syncLyrics,
    sequenceAsString,
    separators,
  };
};

const writeToFileAndReturn = (item: {
  title: string;
  syncLyrics: string;
  sequenceAsString: string;
  separators: string;
}) => {
  const { title, syncLyrics, sequenceAsString, separators } = item;
  const exportFileNamePath = generateFileNameByTitle(title);

  const enrichedMarkdownContent = `[title] ${title}
[sequence] ${sequenceAsString}
${syncLyrics}
`;

  fs.writeFileSync(exportFileNamePath, enrichedMarkdownContent);

  return item;
};

(async () => {
  fsExtra.emptyDirSync(OUTPUT_DIR);

  const result = await parser.parseStringPromise(xmlAsString);
  const parsedSongs =
    result.Easyslides.Item.map(transformSong).map(writeToFileAndReturn);

  const uniqueSeparators = _.uniq(
    _.flatten(parsedSongs.map(({ separators }: any) => separators)),
  )
    .sort()
    .join(EMPTY_STRING);

  console.log(`The unique separators are ${uniqueSeparators}`);
})();
