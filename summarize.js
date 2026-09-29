#!/usr/bin/env node
// Reads the JSON report file at argv[2], writes a one-line human summary to
// stderr (visible in the Action's log) and score=/band= to stdout (appended
// to $GITHUB_OUTPUT by action.yml, so nothing else may go to stdout here).

const fs = require('node:fs');

const reportPath = process.argv[2];
let score = '';
let band = '';
let findings = '';
let compareLine = '';

try {
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  score = report.score ?? '';
  band = report.band ?? '';
  findings = Array.isArray(report.findings) ? String(report.findings.length) : '';
  if (report.compare) {
    const sign = report.compare.delta > 0 ? '+' : '';
    compareLine = ` (was ${report.compare.previous.score}, ${sign}${report.compare.delta})`;
  }
} catch {
  // Not JSON: e.g. "Nothing to check" prints plain text, not a report.
  // Leave score/band empty rather than guessing.
}

const summary = score === '' ? 'Nothing to check.' : `${score}/100 (${band})${compareLine}, ${findings} finding(s)`;
process.stderr.write(`Setup Doctor: ${summary}\n`);

process.stdout.write(`score=${score}\n`);
process.stdout.write(`band=${band}\n`);
