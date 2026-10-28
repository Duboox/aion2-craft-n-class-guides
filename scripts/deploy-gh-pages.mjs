#!/usr/bin/env node
/**
 * Script de despliegue directo a la rama `gh-pages` de GitHub Pages.
 * Compila la exportación estática (`out/`), añade `.nojekyll` y publica en `origin/gh-pages`.
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'out');

if (!fs.existsSync(outDir)) {
  console.error('[DEPLOY ERROR] No existe la carpeta out/. Ejecuta primero: npm run build');
  process.exit(1);
}

fs.writeFileSync(path.join(outDir, '.nojekyll'), '');
console.log('[DEPLOY] .nojekyll creado en out/. Publicando en la rama gh-pages...');

const gitExe = fs.existsSync('C:\\Program Files\\Git\\cmd\\git.exe')
  ? '"C:\\Program Files\\Git\\cmd\\git.exe"'
  : 'git';

const ghExe = fs.existsSync('C:\\Program Files\\GitHub CLI\\gh.exe')
  ? '"C:\\Program Files\\GitHub CLI\\gh.exe"'
  : 'gh';

let remoteUrl = 'https://github.com/Duboox/aion2-craft-n-class-guides.git';
try {
  const token = execSync(`${ghExe} auth token`, { encoding: 'utf8' }).trim();
  if (token) {
    remoteUrl = `https://x-access-token:${token}@github.com/Duboox/aion2-craft-n-class-guides.git`;
  }
} catch {
  // Usar origin por defecto
}

const outGitDir = path.join(outDir, '.git');
if (fs.existsSync(outGitDir)) {
  fs.rmSync(outGitDir, { recursive: true, force: true });
}

execSync(`${gitExe} init -b gh-pages`, { cwd: outDir, stdio: 'inherit' });
execSync(`${gitExe} config user.name "Duboox"`, { cwd: outDir, stdio: 'inherit' });
execSync(`${gitExe} config user.email "duboox@users.noreply.github.com"`, {
  cwd: outDir,
  stdio: 'inherit',
});
execSync(`${gitExe} add -A`, { cwd: outDir, stdio: 'inherit' });
execSync(`${gitExe} commit -m "deploy: static export to GitHub Pages"`, {
  cwd: outDir,
  stdio: 'inherit',
});
execSync(`${gitExe} push -f "${remoteUrl}" gh-pages:gh-pages`, {
  cwd: outDir,
  stdio: 'inherit',
});

console.log('\x1b[32m[DEPLOY OK] Publicado exitosamente en https://duboox.github.io/aion2-craft-n-class-guides/\x1b[0m');
