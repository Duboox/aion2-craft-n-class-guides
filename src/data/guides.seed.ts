/**
 * Datos estructurados y bilingües (ES / EN) de las Guías de Clase (Voidex Chanter & Duboox Gladiator),
 * Economía de Mazmorras, Conversión Kinah -> Quna y Checklist Diario/Semanal.
 */
import type { ChecklistTaskItem } from '../domain/models/types';

export interface SkillMappingEntry {
  readonly nameEn: string;
  readonly nameEs: string;
  readonly category: 'ACTIVE' | 'STIGMA' | 'PASSIVE' | 'ARCANA';
  readonly roleEs: string;
  readonly roleEn: string;
  readonly priorityBadge: string;
}

export interface DungeonYieldRow {
  readonly name: string;
  readonly minGs: number;
  readonly partyCp: string;
  readonly kinahSingleCube: number;
  readonly kinahSubDoubleCube: number;
  readonly netProfit10RunsWithOdyleBuy: number;
  readonly keyDropsEs: string;
  readonly keyDropsEn: string;
}

export const CHANTER_SKILLS_SEED: readonly SkillMappingEntry[] = [
  {
    nameEn: 'Dark Crush',
    nameEs: 'Fractura sombría',
    category: 'ACTIVE',
    roleEs:
      'Habilidad núcleo #1. A Nivel 16 desbloquea la Especialidad Roja que ELIMINA el tiempo de reutilización en combo (0s CD) y la Dorada (100% Crítico garantizado).',
    roleEn:
      'Core #1 skill. At Level 16 unlocks the Red Specialty that REMOVES cooldown inside combos (0s CD) and Gold Specialty (100% guaranteed Critical Hit).',
    priorityBadge: 'Lv. 16–20 BiS',
  },
  {
    nameEn: 'Onslaught / Impactful Crush',
    nameEs: 'Trituración de acometida',
    category: 'ACTIVE',
    roleEs: 'Iniciador de combo a 20m; gran daño de stagger, derribo y restauración de maná.',
    roleEn: '20m gap-closer combo starter; high stagger damage, knockdown, and mana restoration.',
    priorityBadge: 'Core Starter',
  },
  {
    nameEn: 'Spinning Strike',
    nameEs: 'Golpe giratorio',
    category: 'ACTIVE',
    roleEs: 'Detonante / activador de apertura para encadenar Fractura sombría sin enfriamiento.',
    roleEn: 'Combo trigger / opener to chain zero-cooldown Dark Crush.',
    priorityBadge: 'Combo Trigger',
  },
  {
    nameEn: 'Wave Strike / Gust Rampage',
    nameEs: 'Golpe de onda abrasadora',
    category: 'ACTIVE',
    roleEs: 'Ataque frontal en área (AoE) secundario para limpieza de grupos.',
    roleEn: 'Secondary frontal AoE strike for mob clearing.',
    priorityBadge: 'AoE Burst',
  },
  {
    nameEn: 'Parchment of Vigor',
    nameEs: 'Pergamino de vitalidad / vigor',
    category: 'ARCANA',
    roleEs:
      'Carta de Arcana clave para subir a +2/+3 con Cartas de Entrenamiento Doradas (~2.010 Kinah) y obtener +1/+2 a Fractura sombría sin gastar 300k por tirada en anillos.',
    roleEn:
      'Key Arcana card to upgrade to +2/+3 using Gold Training Cards (~2,010 Kinah) to roll +1/+2 Dark Crush without spending 300k per ring reroll.',
    priorityBadge: 'Arcana BiS',
  },
];

export const GLADIATOR_SKILLS_SEED: readonly SkillMappingEntry[] = [
  {
    nameEn: 'Overhead Slam',
    nameEs: 'Punzada descendente',
    category: 'ACTIVE',
    roleEs: 'Daño principal absoluto en PvE y castigo devastador tras derribo en PvP (Prioridad Lv 16–20).',
    roleEn: 'Absolute #1 main damage dealer in PvE and devastating knockdown punish in PvP (Priority Lv 16–20).',
    priorityBadge: 'Lv. 16–20 Core',
  },
  {
    nameEn: 'Mocking Blade',
    nameEs: 'Espada devastadora',
    category: 'ACTIVE',
    roleEs: 'CC de apertura: 3 s de derribo e ignora bloqueo/evasión a nivel 16. Asignar en Tecla E (Ranura en línea).',
    roleEn: 'Opener CC: 3s knockdown and ignores block/evasion at Lv 16. Bind to Key E (Inline Slot).',
    priorityBadge: 'Opener CC',
  },
  {
    nameEn: 'Defiance',
    nameEs: 'Eliminación de impacto',
    category: 'ACTIVE',
    roleEs: 'Seguro de vida manual: limpia CC/aturdimientos y regenera vida. Siempre en tecla aislada (Espacio).',
    roleEn: 'Manual anti-CC breaker & heal. Always bind to an isolated key (Spacebar), never inside a macro.',
    priorityBadge: 'Anti-CC',
  },
  {
    nameEn: 'Aerial Snare',
    nameEs: 'Amarre Aéreo',
    category: 'ACTIVE',
    roleEs: 'Control aéreo para extender la cadena de CC en PvP tras derribo.',
    roleEn: 'Aerial lockdown to extend PvP CC chains.',
    priorityBadge: 'Air Lockdown',
  },
  {
    nameEn: 'Leaping Slam & Rush Strike',
    nameEs: 'Perforación con Salto y Estacazo de acometida',
    category: 'ACTIVE',
    roleEs: 'Saltos de aproximación y movilidad en Tecla Q (Ranura en línea para guardar el segundo dash).',
    roleEn: 'Gap-closers bound to Key Q (Inline Slot to hold the second dash until needed).',
    priorityBadge: 'Mobility',
  },
  {
    nameEn: 'Lunge Stance & Focused Block',
    nameEs: 'Postura de Asalto y Bloqueo concentrado',
    category: 'STIGMA',
    roleEs: 'Estigmas fijos PvE/PvP: velocidad de combate, daño plano y parada manual contra ataques de jefes.',
    roleEn: 'Mandatory PvE/PvP Stigmas: combat speed, flat damage, and manual parry vs boss cleaves.',
    priorityBadge: 'Core Stigmas',
  },
  {
    nameEn: 'Rage Burst & Zikel’s Blessing',
    nameEs: 'Explosión de furia y Bendición de Zikel',
    category: 'STIGMA',
    roleEs: 'Ventana de 10 s en PvE para spamear Punzada descendente con buff masivo de ataque y precisión.',
    roleEn: '10s PvE burst window to spam Overhead Slam with massive attack and accuracy buffs.',
    priorityBadge: 'PvE Burst',
  },
];

export const DUNGEON_YIELDS_SEED: readonly DungeonYieldRow[] = [
  {
    name: 'Krao Cave / Draupnir',
    minGs: 700,
    partyCp: '45k – 55k CP',
    kinahSingleCube: 200000,
    kinahSubDoubleCube: 400000,
    netProfit10RunsWithOdyleBuy: 2000000,
    keyDropsEs: 'Piezas Bakarma y materiales base',
    keyDropsEn: 'Bakarma gear pieces & base materials',
  },
  {
    name: 'Urugugu Canyon / Vakron Sky Island',
    minGs: 1400,
    partyCp: '70k – 75k CP',
    kinahSingleCube: 300000,
    kinahSubDoubleCube: 600000,
    netProfit10RunsWithOdyleBuy: 4000000,
    keyDropsEs: 'Joyería dorada Aulamus y Set Vakron (iLvl 70)',
    keyDropsEn: 'Gold Aulamus Jewelry & Vakron Set (iLvl 70)',
  },
  {
    name: 'Fire Temple (Enraged Kromede)',
    minGs: 2100,
    partyCp: '100k – 110k+ CP',
    kinahSingleCube: 400000,
    kinahSubDoubleCube: 800000,
    netProfit10RunsWithOdyleBuy: 6000000,
    keyDropsEs: 'Armas doradas Kromede y Joyería Enraged Kromede',
    keyDropsEn: 'Gold Kromede Weapons & Enraged Kromede Jewelry',
  },
  {
    name: 'Ferocious Horn Den (Nuakum)',
    minGs: 2100,
    partyCp: '100k – 110k+ CP',
    kinahSingleCube: 400000,
    kinahSubDoubleCube: 800000,
    netProfit10RunsWithOdyleBuy: 6000000,
    keyDropsEs: 'Set completo de armadura pesada Nuakum y Guardias',
    keyDropsEn: 'Full Nuakum heavy armor set & Guards',
  },
  {
    name: 'Transcendence Tier 1 – Tier 4',
    minGs: 1600,
    partyCp: '80k – 130k+ CP',
    kinahSingleCube: 300000,
    kinahSubDoubleCube: 600000,
    netProfit10RunsWithOdyleBuy: 4000000,
    keyDropsEs: 'Cartas de Arcana (Cáliz, Pergamino, Brújula, Campana, Espejo) y Piedras Menores (Bound)',
    keyDropsEn: 'Arcana Cards (Chalice, Parchment, Compass, Bell, Mirror) & Bound Lesser Stones',
  },
];

export const CHECKLIST_TASKS_SEED: readonly ChecklistTaskItem[] = [
  {
    id: 'daily_odyle_drain',
    frequency: 'DAILY',
    titleEs: '1. Drenar Energía de Odyle (Nunca llegar al tope de 560 / 840)',
    titleEn: '1. Drain Odyle Energy (Never cap at 560 / 840)',
    descriptionEs:
      'Se regenera +15 cada 3h. Gástala en Templo del Fuego, Horn Den o Uruguru con doble cubo (Membresía) para cobrar 600k–800k Kinah por run.',
    descriptionEn:
      'Regenerates +15 every 3h. Spend it in Fire Temple, Horn Den, or Urugugu with double cubes (Membership) for 600k–800k Kinah per run.',
    rewardBadgeEs: '+400k a +800k Kinah/run',
    rewardBadgeEn: '+400k to +800k Kinah/run',
    priority: 'CRITICAL',
  },
  {
    id: 'daily_bio_research',
    frequency: 'DAILY',
    titleEs: '2. Mazmorra Diaria: Daeva Bio-Research Base (2 entradas/día o acumular 14)',
    titleEn: '2. Daily Dungeon: Daeva Bio-Research Base (2 entries/day or stack to 14)',
    descriptionEs:
      'Usa AoE agresivo para superar los 10.000 puntos en 90 segundos. Otorga hasta 10.000 Piedras de Mejora por run (140.000 a la semana).',
    descriptionEn:
      'Use aggressive AoE to score 10,000+ points in 90s. Yields up to 10,000 Enchant Stones per run (140,000/week).',
    rewardBadgeEs: '+10.000 Piedras Mejora',
    rewardBadgeEn: '+10,000 Enchant Stones',
    priority: 'CRITICAL',
  },
  {
    id: 'daily_transcendence',
    frequency: 'DAILY',
    titleEs: '3. Mazmorra de Trascendencia (+2 cargas/día, tope 14)',
    titleEn: '3. Transcendence Dungeon (+2 charges/day, cap 14)',
    descriptionEs:
      'Fuente exclusiva de Arcanas Doradas y Piedras de Maná/Alma Inferiores (Vinculadas) para convertir en Alquimia con el proc del 20%.',
    descriptionEn:
      'Exclusive source of Gold Arcanas and Bound Lesser Manastones/Soulstones to convert in Alchemy via the 20% proc.',
    rewardBadgeEs: 'Arcanas + Piedras Bound',
    rewardBadgeEn: 'Arcanas + Bound Stones',
    priority: 'HIGH',
  },
  {
    id: 'daily_duties',
    frequency: 'DAILY',
    titleEs: '4. 5 Misiones de Deber (Duty Quests - Reroll por Fragmentos de Ariel)',
    titleEn: '4. 5 Duty Quests (Reroll for Ariel Fragments & Pet Crystals)',
    descriptionEs:
      'Prioriza siempre Fragmentos de Ariel (tablero Daevanion) y Cristales de Mascotas (ruedas de Insight).',
    descriptionEn:
      'Always prioritize Ariel Fragments (Daevanion board) and Pet Crystals (Insight wheels).',
    rewardBadgeEs: 'Ariel + Cristales Insight',
    rewardBadgeEn: 'Ariel + Insight Crystals',
    priority: 'HIGH',
  },
  {
    id: 'daily_shugo_legion',
    frequency: 'DAILY',
    titleEs: '5. Festival Shugo (+3 llaves), Donación a SangreLatina y Cofre Gratis Tienda',
    titleEn: '5. Shugo Festival (+3 keys), SangreLatina Donation & Free Shop Chest',
    descriptionEs:
      'Prioriza Cristales Daevanion con las Fichas de raíz centenaria en la tienda de Shugo.',
    descriptionEn:
      'Prioritize Daevanion Crystals using Centennial Root Tokens in the Shugo shop.',
    rewardBadgeEs: 'Cristales Daevanion',
    rewardBadgeEn: 'Daevanion Crystals',
    priority: 'MEDIUM',
  },
  {
    id: 'weekly_wind_breeze_odyle',
    frequency: 'WEEKLY',
    titleEs: '1. Mercader de Viento: Comprar 20 Piedras de Odyle con Voidex + 20 con Duboox',
    titleEn: '1. Wind Breeze Merchant: Buy 20 Odyle Stones on Voidex + 20 on Duboox',
    descriptionEs:
      'Inversión: 2M Kinah por PJ (4M total). Al quemarlas en Conquista con doble cubo retornan 12M brutos (+8.000.000 Kinah netos semanales).',
    descriptionEn:
      'Investment: 2M Kinah per character (4M total). Running Conquest double cubes returns 12M gross (+8,000,000 net Kinah/week).',
    rewardBadgeEs: '+8.000.000 Kinah Neta',
    rewardBadgeEn: '+8,000,000 Net Kinah',
    priority: 'CRITICAL',
  },
  {
    id: 'weekly_ascension_trial',
    frequency: 'WEEKLY',
    titleEs: '2. Prueba de Ascenso en Modo Extremo/Difícil (3 entradas semanales)',
    titleEn: '2. Tower of Ascension on Hard/Extreme Mode (3 weekly entries)',
    descriptionEs:
      'Entrega Mysterious Crystals, Cajas de Mascotas y decenas de Piedras de Maná/Alma Menores (Bound) para transformar en Alquimia.',
    descriptionEn:
      'Rewards Mysterious Crystals, Pet Chests, and dozens of Bound Lesser Manastones/Soulstones to convert in Alchemy.',
    rewardBadgeEs: '50+ Piedras Bound + Cristales',
    rewardBadgeEn: '50+ Bound Stones + Crystals',
    priority: 'CRITICAL',
  },
  {
    id: 'weekly_multicolor_crystals',
    frequency: 'WEEKLY',
    titleEs: '3. Conversión Semanal: 1.000 Cristales de Alma Multicolor (Miércoles 07:00 UTC)',
    titleEn: '3. Weekly Conversion: 1,000 Multicolor Soul Crystals (Wednesdays 07:00 UTC)',
    descriptionEs:
      '500 Kinah c/u (500k total). La forma más barata de subir las 5 familias de mascotas a Nivel 10.',
    descriptionEn:
      '500 Kinah each (500k total). Cheapest way to level all 5 pet families to Level 10.',
    rewardBadgeEs: '1.000 Cristales Comodín',
    rewardBadgeEn: '1,000 Wildcard Crystals',
    priority: 'HIGH',
  },
  {
    id: 'weekly_abyss_corridors_alt',
    frequency: 'ALT_EXPRESS',
    titleEs: 'Ruta Express Duboox (15 min): Bio-Research + 4 Corredores del Abismo + Puente Almacén',
    titleEn: 'Duboox 15-Min Express Route: Bio-Research + 4 Abyss Corridors + Warehouse Bridge',
    descriptionEs:
      'Usa las Piedras de Mejora y Kinah Vinculada de Duboox para encantar a +10 piezas del Main a través del Almacén Compartido (Técnica Aluckyro).',
    descriptionEn:
      'Use Duboox’s Bound Enchant Stones and Bound Kinah to enchant Main gear to +10 via Server Storage (Aluckyro Warehouse Bridge).',
    rewardBadgeEs: 'Ahorro Millones en Main',
    rewardBadgeEn: 'Saves Millions on Main',
    priority: 'CRITICAL',
  },
];
