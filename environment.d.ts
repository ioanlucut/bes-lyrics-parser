declare global {
  namespace NodeJS {
    interface ProcessEnv {
      FOLDER_INPUT_EASY_SLIDES: string;
      FOLDER_INPUT_RC_OS: string;
      FOLDER_INPUT_BES_CLOUD_PPT_SONGS: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
