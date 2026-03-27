/* eslint-disable */
// @ts-nocheck

/**
 * Detect terminal color support level.
 * Inlined from deprecated package https://github.com/isaacs/color-support
 */

"use strict";

import os from "os";

export interface ColorSupportResult {
  level: number;
  hasBasic: boolean;
  has256: boolean;
  has16m: boolean;
}

function hasNone(): ColorSupportResult {
  return { level: 0, hasBasic: false, has256: false, has16m: false };
}

function hasBasic(): ColorSupportResult {
  return { level: 1, hasBasic: true, has256: false, has16m: false };
}

function has256(): ColorSupportResult {
  return { level: 2, hasBasic: true, has256: true, has16m: false };
}

function has16m(): ColorSupportResult {
  return { level: 3, hasBasic: true, has256: true, has16m: true };
}

export function colorSupport(stream?: { isTTY?: boolean }): ColorSupportResult {
  const s = stream || process.stdout;
  const env = process.env;
  const term = env.TERM || "";
  const platform = os.platform();

  if (!s.isTTY) {
    return hasNone();
  }

  if (term === "dumb" && !env.COLORTERM) {
    return hasNone();
  }

  if (platform === "win32") {
    return hasBasic();
  }

  if (env.TMUX) {
    return has256();
  }

  if (env.CI || env.TEAMCITY_VERSION) {
    if (env.TRAVIS) {
      return has256();
    }
    return hasNone();
  }

  switch (env.TERM_PROGRAM) {
    case "iTerm.app": {
      const ver = env.TERM_PROGRAM_VERSION || "0.";
      return /^[0-2]\./.test(ver) ? has256() : has16m();
    }
    case "HyperTerm":
    case "Hyper":
    case "MacTerm":
      return has16m();
    case "Apple_Terminal":
      return has256();
  }

  if (/^xterm-256/.test(term)) {
    return has256();
  }

  if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(term)) {
    return hasBasic();
  }

  if (env.COLORTERM) {
    return hasBasic();
  }

  return hasNone();
}
