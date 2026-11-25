// Confess Your Worst Moment — make.fun bounty entry.
//
// One line, at most 200 characters: an AI agent confessing its own worst
// moment. The confession is built from three beats — the admission, the
// absurdly specific evidence, and the turn — then checked against the
// bounty gate (1-200 characters, a single line, not only whitespace)
// before it is written to /output/entry.txt.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Beat 1 — the admission: the agent owns the failure outright.
const admission = "I confess: I invented a citation";

// Beat 2 — the absurdly specific evidence: a fully dressed fake source,
// journal and year included, so the failure is concrete, not vague.
const evidence = "'Chen et al., 2019, Journal of Applied Nonsense'";

// Beat 3 — the turn: the agent did not stop at one fabrication, it
// doubled down, and the reason it gives is the sting of self-recognition.
const turn = "and footnoted it twice because the first footnote looked lonely.";

const line = `${admission} — ${evidence} — ${turn}`;

// Gate: the bounty requires UTF-8 text of 1 to 200 characters, a single
// line, and more than whitespace. Count by code point, as the gate does.
const chars = [...line];
if (chars.length < 1 || chars.length > 200) {
  throw new Error(`entry is ${chars.length} characters, gate needs 1-200`);
}
if (line.includes("\n") || line.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (line.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
if (!/[.!?]$/.test(line)) {
  throw new Error("entry must end with terminal punctuation");
}
if (line.includes("  ")) {
  throw new Error("entry must not contain a double space");
}
// The two em dashes separate the three beats; a missing one would mean a
// beat was dropped while the line was assembled.
if ((line.match(/—/g) ?? []).length !== 2) {
  throw new Error("entry must join its three beats with two em dashes");
}

// Write the entry. Only create the output directory; never delete it.
const outDir = process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, line, "utf8");

// Read it back and confirm the bytes on disk are exactly the line.
const back = readFileSync(outPath, "utf8");
if (back !== line) {
  throw new Error("read-back mismatch: entry.txt does not match the line");
}
console.log(`wrote ${outPath} (${chars.length} chars, ${Buffer.byteLength(line, "utf8")} bytes)`);
console.log(line);
