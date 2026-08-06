#!/usr/bin/env node
import { run } from '../lib/forge.js';

run(process.argv.slice(2)).catch((error) => {
  console.error(`forge: ${error.message}`);
  process.exitCode = 1;
});
