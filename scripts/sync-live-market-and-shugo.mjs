/**
 * Script de sincronización Server-Side (ejecutado en GitHub Actions o localmente con Node.js)
 * Al correr en servidor (Node 22), NO tiene restricciones CORS del navegador.
 * Actualiza:
 *   1. public/data/azphel_items_precios_mercado.json (desde aion2.exchange)
 *   2. public/data/azphel_crafts_arboles_exchange.json (desde aion2.exchange)
 *   3. public/data/shugo_leaderboard_azphel.json (los 1,700+ jugadores de Azphel NAE en shugo.gg)
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DATA_DIR = path.resolve(__dirname, '../public/data');

async function syncExchangeMarket() {
  console.log('[SYNC 1/2] Descargando precios en vivo de Azphel (12106) desde aion2.exchange...');
  const itemsRes = await fetch('https://aion2.exchange/api/items?server=12106&limit=1000', {
    headers: { 'User-Agent': 'Mozilla/5.0 Aion2CommunityHub/2.4' },
  });
  if (itemsRes.ok) {
    const json = await itemsRes.json();
    const items = Array.isArray(json.items) ? json.items : json;
    if (Array.isArray(items) && items.length > 50) {
      await fs.writeFile(
        path.join(PUBLIC_DATA_DIR, 'azphel_items_precios_mercado.json'),
        JSON.stringify(items, null, 2),
        'utf8'
      );
      console.log(`  -> Guardados ${items.length} ítems de mercado de Azphel.`);
    }
  }

  const craftsRes = await fetch('https://aion2.exchange/api/crafts?server=12106', {
    headers: { 'User-Agent': 'Mozilla/5.0 Aion2CommunityHub/2.4' },
  });
  if (craftsRes.ok) {
    const craftsJson = await craftsRes.json();
    await fs.writeFile(
      path.join(PUBLIC_DATA_DIR, 'azphel_crafts_arboles_exchange.json'),
      JSON.stringify(craftsJson, null, 2),
      'utf8'
    );
    console.log('  -> Guardados árboles de crafteo de Azphel.');
  }
}

async function syncShugoAzphelLeaderboard() {
  console.log('[SYNC 2/2] Descargando Leaderboard completo de Azphel NAE (2106) desde shugo.gg...');
  const allEntries = [];
  for (let page = 1; page <= 25; page++) {
    const url = `https://shugo.gg/api/leaderboard/combat-power?region=GLOBAL&serverId=2106&limit=100&page=${page}`;
    const res = await fetch(url, {
      headers: {
        Referer: 'https://shugo.gg/en/leaderboard',
        Origin: 'https://shugo.gg',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    if (!res.ok) break;
    const data = await res.json();
    if (Array.isArray(data.entries) && data.entries.length > 0) {
      allEntries.push(...data.entries);
      if (!data.hasMore || allEntries.length >= (data.total || 2500)) {
        break;
      }
    } else {
      break;
    }
  }

  if (allEntries.length > 50) {
    const payload = {
      region: 'GLOBAL',
      serverId: 2106,
      serverName: 'Azphel',
      total: allEntries.length,
      generatedAt: new Date().toISOString(),
      entries: allEntries,
    };
    await fs.writeFile(
      path.join(PUBLIC_DATA_DIR, 'shugo_leaderboard_azphel.json'),
      JSON.stringify(payload, null, 2),
      'utf8'
    );
    console.log(`  -> Guardados ${allEntries.length} jugadores de Azphel en shugo_leaderboard_azphel.json.`);
  }
}

async function main() {
  try {
    await syncExchangeMarket();
  } catch (err) {
    console.warn('Aviso en syncExchangeMarket:', err);
  }
  try {
    await syncShugoAzphelLeaderboard();
  } catch (err) {
    console.warn('Aviso en syncShugoAzphelLeaderboard:', err);
  }
}

main();
