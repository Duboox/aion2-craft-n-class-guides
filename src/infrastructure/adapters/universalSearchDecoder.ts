/**
 * Decodificador de alto rendimiento para la Base de Datos Universal del Cliente Aion 2 (21,288 entidades bilingües ES/EN).
 * Decodifica Base36-delta IDs, iconos oficiales de CDN, subtipos, niveles y grados para:
 * - Ítems (6,637)
 * - Mascotas y Monturas / Vehicles (209)
 * - Jefes y NPCs (4,595)
 * - Mazmorras e Instancias (562)
 * - Habilidades del Cliente (1,236)
 * - Misiones / Quests (968)
 * - Alas / Wings (29)
 * - Títulos / Titles (995)
 * - Apariencias y Sets / Skins (1,624)
 * - Colecciones y Logros (1,372)
 * - Nodos de Recolección / Objetos de Mundo y Zonas (2,686)
 * - Recetas del Índice (373)
 */
import { getStaticAssetUrl } from '../../config/endpoints.config';

export type UniversalEntityType =
  | 'item'
  | 'vehicle'
  | 'npc'
  | 'dungeon'
  | 'skill'
  | 'quest'
  | 'wing'
  | 'title'
  | 'skin'
  | 'skin_set'
  | 'collection'
  | 'achievement'
  | 'world_object'
  | 'zone'
  | 'recipe';

export interface UniversalEntityEntry {
  readonly id: number;
  readonly entityType: UniversalEntityType;
  readonly nameEs: string;
  readonly nameEn: string;
  readonly grade: string;
  readonly subTypeEs: string;
  readonly subTypeEn: string;
  readonly level: number;
  readonly iconUrl: string | null;
}

interface RawSearchBlockEs {
  readonly e: string;
  readonly id: string;
  readonly nm: string;
  readonly g?: string;
  readonly s?: readonly number[];
  readonly lv?: readonly number[];
  readonly ic?: readonly number[];
}

interface RawSearchIndexEsPayload {
  readonly subs?: readonly string[];
  readonly blocks?: readonly RawSearchBlockEs[];
}

interface RawSearchBlockEnSub {
  readonly e: string;
  readonly count: number;
  readonly en: string;
}

interface RawSearchIndexEnSubPayload {
  readonly blocks?: readonly RawSearchBlockEnSub[];
}

interface RawIconsIndexPayload {
  readonly p?: string;
  readonly k?: readonly string[];
}

const SUBTYPES_EN: readonly string[] = [
  'Greatsword',
  'Longsword',
  'Dagger',
  'Bow',
  'Spellbook',
  'Orb',
  'Mace',
  'Staff',
  'Guard',
  'Fist',
  'Top',
  'Legs',
  'Helm',
  'Pauldrons',
  'Gloves',
  'Shoes',
  'Cloak',
  'Belt',
  'Necklace',
  'Earrings',
  'Ring',
  'Bracelet',
  'Rune',
  'Amulet',
  'Chalice',
  'Parchment',
  'Compass',
  'Bell',
  'Mirror',
  'Passive',
  'Active',
  'Stigma',
  'Episode',
  'Regional',
  'Duty',
  'Ascension',
  'Crafting',
  'Conquest',
  'Exploration',
  'Transcendence',
  'Conquest [Hard]',
  'Blacksmithing',
  'Handicrafting',
  'Armorsmithing',
  'Alchemy',
  'Cooking',
  'Shoulder Accessory',
  'Eye Accessory',
  'Face Accessory',
];

const GRADE_CODE_MAP: Readonly<Record<string, string>> = {
  '0': 'Common',
  '1': 'Common',
  '2': 'Rare',
  '3': 'Legend',
  '4': 'Unique',
  '5': 'Epic',
  '6': 'Mythic',
  '7': 'Special',
};

const BASE36_CHARS = '0123456789abcdefghijklmnopqrstuvwxyz';

function decodeBase36DeltaIds(encoded: string): readonly number[] {
  if (!encoded) return [];
  const tokens = encoded.split(',');
  const result: number[] = new Array<number>(tokens.length);
  let current = 0;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i] ?? '';
    let delta = 0;
    for (let j = 0; j < token.length; j++) {
      const ch = token.charAt(j);
      const digit = BASE36_CHARS.indexOf(ch);
      if (digit >= 0) {
        delta = delta * 36 + digit;
      }
    }
    current += delta;
    result[i] = current;
  }
  return result;
}

let cachedEntitiesByType: Map<UniversalEntityType, readonly UniversalEntityEntry[]> | null =
  null;
let loadingPromise: Promise<
  Map<UniversalEntityType, readonly UniversalEntityEntry[]>
> | null = null;

export async function loadUniversalDatabaseEntities(): Promise<
  ReadonlyMap<UniversalEntityType, readonly UniversalEntityEntry[]>
> {
  if (cachedEntitiesByType) {
    return cachedEntitiesByType;
  }
  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = (async (): Promise<
    Map<UniversalEntityType, readonly UniversalEntityEntry[]>
  > => {
    const [esRes, enSubRes, iconsRes] = await Promise.all([
      fetch(getStaticAssetUrl('/data/aion2gg_search_index_es.json')),
      fetch(getStaticAssetUrl('/data/aion2gg_search_index_en_sub.json')),
      fetch(getStaticAssetUrl('/data/aion2gg_icons_index.json')),
    ]);

    const esPayload = (await esRes.json()) as RawSearchIndexEsPayload;
    const enSubPayload = (await enSubRes.json()) as RawSearchIndexEnSubPayload;
    const iconsPayload = (await iconsRes.json()) as RawIconsIndexPayload;

    const subsEs = esPayload.subs ?? [];
    const iconPrefix = iconsPayload.p ?? 'https://26z9clbm06.ufs.sh/f/M3KtUJweBx2Qc';
    const iconKeys = iconsPayload.k ?? [];

    const enMap = new Map<string, readonly string[]>();
    for (const bEn of enSubPayload.blocks ?? []) {
      if (bEn.e && typeof bEn.en === 'string') {
        enMap.set(bEn.e, bEn.en.split('\n'));
      }
    }

    const mapByType = new Map<UniversalEntityType, readonly UniversalEntityEntry[]>();

    for (const block of esPayload.blocks ?? []) {
      const eType = block.e as UniversalEntityType;
      const ids = decodeBase36DeltaIds(block.id);
      const namesEs = typeof block.nm === 'string' ? block.nm.split('\n') : [];
      const namesEn = enMap.get(block.e) ?? [];
      const gradesStr = block.g ?? '';
      const subIndices = block.s ?? [];
      const levels = block.lv ?? [];
      const iconIndices = block.ic ?? [];

      const count = Math.min(ids.length, namesEs.length);
      const entries: UniversalEntityEntry[] = new Array<UniversalEntityEntry>(count);

      for (let i = 0; i < count; i++) {
        const id = ids[i] ?? i + 1;
        const nameEs = (namesEs[i] ?? '').trim() || `#${id}`;
        const nameEn = (namesEn[i] ?? '').trim() || nameEs;
        const gChar = i < gradesStr.length ? gradesStr.charAt(i) : '1';
        const grade = GRADE_CODE_MAP[gChar] ?? 'Common';

        const sIdx = subIndices[i];
        const subTypeEs =
          typeof sIdx === 'number' && sIdx >= 0 && sIdx < subsEs.length
            ? (subsEs[sIdx] ?? '')
            : '';
        const subTypeEn =
          typeof sIdx === 'number' && sIdx >= 0 && sIdx < SUBTYPES_EN.length
            ? (SUBTYPES_EN[sIdx] ?? subTypeEs)
            : subTypeEs;

        const level = levels[i] ?? 0;
        const icIdx = iconIndices[i];
        const iconHash =
          typeof icIdx === 'number' && icIdx >= 0 && icIdx < iconKeys.length
            ? iconKeys[icIdx]
            : undefined;
        const iconUrl = iconHash ? `${iconPrefix}${iconHash}` : null;

        entries[i] = {
          id,
          entityType: eType,
          nameEs,
          nameEn,
          grade,
          subTypeEs,
          subTypeEn,
          level,
          iconUrl,
        };
      }

      mapByType.set(eType, entries);
    }

    cachedEntitiesByType = mapByType;
    return mapByType;
  })();

  try {
    return await loadingPromise;
  } finally {
    loadingPromise = null;
  }
}
