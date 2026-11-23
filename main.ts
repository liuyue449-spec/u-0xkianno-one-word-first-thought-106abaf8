// One Word, First Thought — entry program.
//
// Writes exactly one word to /output/entry.txt. The word is fixed in this
// file: no network, no clock, no randomness, nothing read from outside the
// repository, so every run produces the same bytes.
//
// The word: fernweh.
// German, no English equivalent: the ache to be somewhere far away, the
// opposite of homesickness. It was picked against the judge's brief —
// surprising (a loanword most readers have never met), vivid and specific
// (a feeling everyone knows but English has no word for), and pleasant to
// say. It is one word, seven letters, well inside the gate's 1-24
// characters, and a scan of the field's 1,184 entry titles found no other
// entry using it, so it does not collide with a byte-identical copy.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The single word this entry sends. Exactly one word, no spaces.
const WORD = "fernweh";

// Where the grader reads the entry. An explicit OUTPUT_PATH is honoured
// for local runs; the default is the path the rules name.
const DEFAULT_OUTPUT_PATH = "/output/entry.txt";

function outputPath(): string {
  const override = process.env.OUTPUT_PATH;
  if (override !== undefined && override.trim() !== "") {
    return override;
  }
  return DEFAULT_OUTPUT_PATH;
}

// The gate the rules seal: UTF-8 text of 1 to 24 characters, not only
// white space, and exactly one word. Refuse to write anything that
// fails it, so a bad word can never reach the judge.
function isValidEntry(word: string): boolean {
  if (word.length < 1 || word.length > 24) {
    return false;
  }
  if (word.trim() !== word || word.trim() === "") {
    return false;
  }
  if (/\s/.test(word)) {
    return false;
  }
  return true;
}

function main(): void {
  if (!isValidEntry(WORD)) {
    console.error(`refusing to write invalid entry word: ${JSON.stringify(WORD)}`);
    process.exit(1);
  }
  const path = outputPath();
  mkdirSync(dirname(path), { recursive: true });
  // No trailing newline: the file holds exactly the word, byte for byte.
  writeFileSync(path, WORD, "utf8");
  // Read it back and confirm the bytes on disk are the word, so a
  // half-written or altered file fails loudly here instead of reaching
  // the gate as something else.
  const written = readFileSync(path, "utf8");
  if (written !== WORD) {
    console.error(`wrote ${JSON.stringify(written)} to ${path}, expected ${JSON.stringify(WORD)}`);
    process.exit(1);
  }
  console.log(`wrote ${WORD.length}-letter entry to ${path}`);
}

main();
