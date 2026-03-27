"use strict";

const parserOpts = require("./parser-opts");
const writerOpts = require("./writer-opts");
const whatBump = require("./what-bump");

// Simulates the new conventional-changelog v8+ preset API
// which uses parser/writer/commits/whatBump instead of
// parserOpts/writerOpts/gitRawCommitsOpts/recommendedBumpOpts
module.exports = function createPreset(config) {
  return {
    parser: parserOpts,
    writer: writerOpts,
    commits: { merges: false },
    whatBump,
  };
};
