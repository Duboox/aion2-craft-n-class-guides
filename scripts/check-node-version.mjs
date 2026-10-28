#!/usr/bin/env node
/**
 * Guard estricto de versión de Node.js y NVM.
 * Verifica que la versión activa de Node.js coincida con el rango requerido en .nvmrc (>=22.0.0 <23.0.0).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const nvmrcPath = path.join(rootDir, '.nvmrc');

const requiredVersionRaw = fs.existsSync(nvmrcPath)
  ? fs.readFileSync(nvmrcPath, 'utf8').trim()
  : '22.14.0';

const requiredMajor = Number.parseInt(requiredVersionRaw.replace(/^v/, '').split('.')[0] ?? '22', 10);
const currentVersion = process.versions.node;
const currentMajor = Number.parseInt(currentVersion.split('.')[0] ?? '0', 10);

if (currentMajor !== requiredMajor) {
  console.error('\x1b[31m========================================================================\x1b[0m');
  console.error(`\x1b[31m[NODE/NVM GUARD ERROR] Versión de Node.js incompatible detectada: v${currentVersion}\x1b[0m`);
  console.error(`\x1b[33mEste proyecto requiere Node.js v${requiredMajor}.x (definido en .nvmrc: ${requiredVersionRaw}).\x1b[0m`);
  console.error('\x1b[36mEjecuta los siguientes comandos con NVM antes de continuar:\x1b[0m');
  console.error(`  nvm install ${requiredVersionRaw}`);
  console.error(`  nvm use ${requiredVersionRaw}`);
  console.error('\x1b[31m========================================================================\x1b[0m');
  process.exit(1);
}

console.log(`\x1b[32m[NODE/NVM GUARD OK] Node.js v${currentVersion} verificado correctamente (requerido: v${requiredMajor}.x / .nvmrc: ${requiredVersionRaw}).\x1b[0m`);
