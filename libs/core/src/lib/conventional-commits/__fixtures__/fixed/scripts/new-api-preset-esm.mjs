import { createRequire } from "module";
const require = createRequire(import.meta.url);

const parserOpts = require("./parser-opts");
const writerOpts = require("./writer-opts");
const whatBump = require("./what-bump");

// Simulates an ESM-only conventional-changelog v8+ preset
export default function createPreset(config) {
  return {
    parser: parserOpts,
    writer: writerOpts,
    commits: { merges: false },
    whatBump,
  };
}
