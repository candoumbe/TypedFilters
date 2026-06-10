/**
 * Jest global setup: pre-bundle chevrotain (a pure-ESM package) to CommonJS
 * so that Jest's CJS test runner can require() it normally.
 */
"use strict";

const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.join(__dirname, ".jest-cache");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "chevrotain-cjs.js");

const POLYFILL = `
// Polyfill for Object.groupBy (ES2024)
if (!Object.groupBy) {
  Object.groupBy = function (items, keyFn) {
    const result = {};
    for (const item of items) {
      const key = keyFn(item);
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(item);
    }
    return result;
  };
}
`;

async function setup() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    await esbuild.build({
        entryPoints: [require.resolve("chevrotain")],
        bundle: true,
        format: "cjs",
        platform: "node",
        target: "node20",
        outfile: OUTPUT_FILE,
        logLevel: "silent",
    });

    // Inject polyfill at the beginning of the bundled file
    const bundleContent = fs.readFileSync(OUTPUT_FILE, "utf8");
    fs.writeFileSync(OUTPUT_FILE, POLYFILL + "\n" + bundleContent, "utf8");
}

module.exports = setup;
