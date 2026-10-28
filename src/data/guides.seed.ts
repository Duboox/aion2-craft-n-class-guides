/**
 * Datos estructurados y bilingües (ES / EN) de Economía de Mazmorras (Conquista + Trascendencia Tier 1-4),
 * Glosario de Términos para Jugadores Nuevos y Checklist Diario/Semanal (Sin nombres personales).
 */
import type { ChecklistTaskItem, GlossaryTerm } from '../domain/models/types';

export interface DungeonYieldRow {
  readonly id: string;
  readonly dungeonType: 'CONQUEST' | 'TRANSCENDENCE';
  readonly nameEs: string;
  readonly nameEn: string;
  readonly minGs: number;
  readonly partyCp: string;
  readonly odyleCostSingle: number;
  readonly odyleCostDouble: number;
  readonly kinahSingleCube: number;
  readonly kinahSubDoubleCube: number;
  readonly gross10RunsSub: number;
  readonly netProfit10RunsWithOdyleBuy: number;
  readonly keyDropsEs: string;
  readonly keyDropsEn: string;
}

export const DUNGEON_YIELDS_SEED: readonly [DungeonYieldRow, ...DungeonYieldRow[]] = [
  {
    id: 'conquest_krao',
    dungeonType: 'CONQUEST',
    nameEs: 'Conquista: Cueva de Krao / Draupnir',
    nameEn: 'Conquest: Krao Cave / Draupnir',
    minGs: 700,
    partyCp: '45k – 55k CP',
    odyleCostSingle: 40,
    odyleCostDouble: 80,
    kinahSingleCube: 200000,
    kinahSubDoubleCube: 400000,
    gross10RunsSub: 4000000,
    netProfit10RunsWithOdyleBuy: 2000000,
    keyDropsEs: 'Piezas Bakarma y materiales base',
    keyDropsEn: 'Bakarma gear pieces & base materials',
  },
  {
    id: 'conquest_urugugu',
    dungeonType: 'CONQUEST',
    nameEs: 'Conquista: Cañón Urugugu / Isla Vakron',
    nameEn: 'Conquest: Urugugu Canyon / Vakron Sky Island',
    minGs: 1400,
    partyCp: '70k – 75k CP',
    odyleCostSingle: 40,
    odyleCostDouble: 80,
    kinahSingleCube: 300000,
    kinahSubDoubleCube: 600000,
    gross10RunsSub: 6000000,
    netProfit10RunsWithOdyleBuy: 4000000,
    keyDropsEs: 'Joyería dorada Aulamus y Set Vakron (iLvl 70)',
    keyDropsEn: 'Gold Aulamus Jewelry & Vakron Set (iLvl 70)',
  },
  {
    id: 'conquest_fire_temple',
    dungeonType: 'CONQUEST',
    nameEs: 'Conquista: Templo del Fuego (Enraged Kromede)',
    nameEn: 'Conquest: Fire Temple (Enraged Kromede)',
    minGs: 2100,
    partyCp: '100k – 110k+ CP',
    odyleCostSingle: 40,
    odyleCostDouble: 80,
    kinahSingleCube: 400000,
    kinahSubDoubleCube: 800000,
    gross10RunsSub: 8000000,
    netProfit10RunsWithOdyleBuy: 6000000,
    keyDropsEs: 'Armas doradas Kromede y Joyería Enraged Kromede',
    keyDropsEn: 'Gold Kromede Weapons & Enraged Kromede Jewelry',
  },
  {
    id: 'conquest_horn_den',
    dungeonType: 'CONQUEST',
    nameEs: 'Conquista: Guarida del Cuerno Feroz (Nuakum)',
    nameEn: 'Conquest: Ferocious Horn Den (Nuakum)',
    minGs: 2100,
    partyCp: '100k – 110k+ CP',
    odyleCostSingle: 40,
    odyleCostDouble: 80,
    kinahSingleCube: 400000,
    kinahSubDoubleCube: 800000,
    gross10RunsSub: 8000000,
    netProfit10RunsWithOdyleBuy: 6000000,
    keyDropsEs: 'Set completo de armadura pesada Nuakum y Guardias',
    keyDropsEn: 'Full Nuakum heavy armor set & Guards',
  },
  {
    id: 'trans_tier_1',
    dungeonType: 'TRANSCENDENCE',
    nameEs: 'Trascendencia Tier 1 (Deus Lab / Arcanis Nv. 1)',
    nameEn: 'Transcendence Tier 1 (Deus Lab / Arcanis Lv. 1)',
    minGs: 1600,
    partyCp: '80k – 95k CP',
    odyleCostSingle: 40,
    odyleCostDouble: 80,
    kinahSingleCube: 300000,
    kinahSubDoubleCube: 600000,
    gross10RunsSub: 6000000,
    netProfit10RunsWithOdyleBuy: 4000000,
    keyDropsEs: 'Arcanas base + Piedras de Maná/Alma Menores (Vinculadas)',
    keyDropsEn: 'Base Arcanas + Bound Lesser Manastones/Soulstones',
  },
  {
    id: 'trans_tier_2',
    dungeonType: 'TRANSCENDENCE',
    nameEs: 'Trascendencia Tier 2 (Deus Lab / Arcanis Nv. 2)',
    nameEn: 'Transcendence Tier 2 (Deus Lab / Arcanis Lv. 2)',
    minGs: 1900,
    partyCp: '95k – 115k CP',
    odyleCostSingle: 40,
    odyleCostDouble: 80,
    kinahSingleCube: 360000,
    kinahSubDoubleCube: 720000,
    gross10RunsSub: 7200000,
    netProfit10RunsWithOdyleBuy: 5200000,
    keyDropsEs: 'Arcanas Raras/Únicas + Piedras Menores (Vinculadas)',
    keyDropsEn: 'Rare/Unique Arcanas + Bound Lesser Stones',
  },
  {
    id: 'trans_tier_3',
    dungeonType: 'TRANSCENDENCE',
    nameEs: 'Trascendencia Tier 3 (Deus Lab / Arcanis Nv. 3)',
    nameEn: 'Transcendence Tier 3 (Deus Lab / Arcanis Lv. 3)',
    minGs: 2200,
    partyCp: '115k – 135k CP',
    odyleCostSingle: 40,
    odyleCostDouble: 80,
    kinahSingleCube: 420000,
    kinahSubDoubleCube: 840000,
    gross10RunsSub: 8400000,
    netProfit10RunsWithOdyleBuy: 6400000,
    keyDropsEs: 'Arcanas Doradas (Cáliz, Pergamino, Brújula) + Piedras Vinculadas',
    keyDropsEn: 'Gold Arcanas (Chalice, Parchment, Compass) + Bound Stones',
  },
  {
    id: 'trans_tier_4',
    dungeonType: 'TRANSCENDENCE',
    nameEs: '👑 Trascendencia Tier 4 (Endgame Arcana Nv. 4)',
    nameEn: '👑 Transcendence Tier 4 (Endgame Arcana Lv. 4)',
    minGs: 2500,
    partyCp: '135k – 160k+ CP',
    odyleCostSingle: 40,
    odyleCostDouble: 80,
    kinahSingleCube: 480000,
    kinahSubDoubleCube: 960000,
    gross10RunsSub: 9600000,
    netProfit10RunsWithOdyleBuy: 7600000,
    keyDropsEs: '960k Kinah (2 cubos) + Arcanas Doradas BiS (Campana, Espejo, Pergamino)',
    keyDropsEn: '960k Kinah (2 cubes) + BiS Gold Arcanas (Bell, Mirror, Parchment)',
  },
];

export const GLOSSARY_TERMS_SEED: readonly GlossaryTerm[] = [
  {
    id: 'gs_vs_cp',
    termEs: 'GS (Gear Score / Nivel de Objeto) vs. CP (Combat Power / Poder de Combate)',
    termEn: 'GS (Gear Score / Item Level) vs. CP (Combat Power)',
    badge: 'FUNDAMENTAL',
    category: 'STATS',
    definitionEs:
      'El GS (Item Level, ej. 2.500 – 2.860) es solo un requisito de entrada para abrir la puerta de una mazmorra. El CP (Combat Power, ej. 110.000 – 195.000+) mide tu daño, velocidad de combate, niveles de habilidad (Lv 16–20), Arcanas y nodos Daevanion reales.',
    definitionEn:
      'GS (Item Level, e.g., 2,500 – 2,860) is only the entry gate requirement to queue into a dungeon. CP (Combat Power, e.g., 110,000 – 195,000+) measures your real damage, combat speed, skill levels (Lv 16–20), Arcanas, and Daevanion nodes.',
    exampleOrTipEs:
      '⚠️ La Trampa del GS: Un jugador con 2.700 GS pero estadísticas basuras en el Alma hace la mitad de daño que un jugador con 2.450 GS que tiene su habilidad principal al Nivel 16–20 y +20% Velocidad de Combate.',
    exampleOrTipEn:
      '⚠️ The GS Trap: A player at 2,700 GS with junk Soul Binding stats deals half the DPS of a 2,450 GS player who unlocked Level 16–20 on their core skill and +20% Combat Speed.',
  },
  {
    id: 'double_chance_smite',
    termEs: 'Golpe % (Smite / Double Chance / Multi-Hit)',
    termEn: 'Double Chance % (Smite / Golpe % / Multi-Hit)',
    badge: 'STAT #1 PVE',
    category: 'STATS',
    definitionEs:
      'Traducido en el cliente en español como «Golpe %» (y en inglés como «Double Chance» o «Smite»). NO es Precisión: es la probabilidad de que cualquier ataque se duplique e inflija un segundo impacto adicional instantáneo.',
    definitionEn:
      'Called "Double Chance" (or "Smite") in English and "Golpe %" in the Spanish client. It is NOT Accuracy: it is the probability that any skill hit triggers an extra double-damage strike.',
    exampleOrTipEs:
      'Prioriza siempre Fuerza (Might: +0.2% Golpe por punto) y Velocidad de Combate antes que Crítico plano al inicio del endgame.',
    exampleOrTipEn:
      'Always prioritize Might (+0.2% Double Chance per point) and Combat Speed before flat Crit in early-to-mid endgame.',
  },
  {
    id: 'breakthrough_exceed',
    termEs: 'Ruptura / Superación (Breakthrough ◆1 – ◆5)',
    termEn: 'Breakthrough / Exceed (◆1 – ◆5)',
    badge: 'ENDGAME GEAR',
    category: 'GEAR',
    definitionEs:
      'Cuando un arma o armadura dorada llega a +15 (o +10 en piezas iniciales), puedes usar una copia idéntica o Piedra de Ruptura para añadir un rombo (◆1 hasta ◆5), desbloqueando +5 niveles adicionales de encantamiento y bonos porcentuales masivos.',
    definitionEn:
      'Once a Gold weapon or armor reaches +15 (or +10 on starter tiers), you sacrifice a duplicate or Breakthrough Stone to add a diamond (◆1 to ◆5), unlocking higher enchant caps and massive % bonuses.',
    exampleOrTipEs:
      'Prioriza primero llevar tu Arma y Guardia a +15 ◆1 antes de gastar millones subiendo armaduras secundarias más allá de +10.',
    exampleOrTipEn:
      'Prioritize getting your Main Weapon and Guard to +15 ◆1 before spending millions pushing armor pieces past +10.',
  },
  {
    id: 'pity_system',
    termEs: 'Sistema de Pity (+5% Probabilidad Acumulada por Fallo)',
    termEn: 'Enchant Pity System (+5% Cumulative Rate per Failure)',
    badge: 'ENCANTAMIENTO',
    category: 'GEAR',
    definitionEs:
      'De +1 a +10 el encantamiento es 100% seguro. De +10 a +15 la tasa cae (50% ➔ 30% ➔ 25%), pero tu ítem NUNCA se destruye ni baja de nivel al fallar: cada fallo suma +5% de probabilidad garantizada al siguiente intento.',
    definitionEn:
      'From +1 to +10 enchanting has a 100% success rate. From +10 to +15 the base rate drops (50% ➔ 30% ➔ 25%), but your item NEVER breaks or downgrades: every failure adds +5% guaranteed chance to your next attempt.',
    exampleOrTipEs:
      'Usa el Puente del Almacén Compartido (Técnica Aluckyro): pasa piezas comerciables a tu Alt para subirlas a +10 con las Piedras y Kinah Vinculada del Alt.',
    exampleOrTipEn:
      'Use the Server Storage Bridge (Aluckyro Technique): move tradeable gear to your Alt to enchant to +10 using the Alt’s Bound Stones and Bound Kinah.',
  },
  {
    id: 'soul_binding_order',
    termEs: 'Impresión de Alma (Soul Binding) y Orden de Reroll',
    termEn: 'Soul Binding & Optimal Reroll Order',
    badge: 'AHORRO KINAH',
    category: 'GEAR',
    definitionEs:
      'Al identificar un equipo nuevo obtienes sub-estadísticas aleatorias. Si bloqueas (Lock) líneas buenas y haces reroll con Piedras de Alma, el coste en Kinah y piedras se multiplica exponencialmente.',
    definitionEn:
      'Identifying new gear rolls random sub-stats. Locking good lines and rerolling with Soulstones multiplies the Kinah and stone cost exponentially.',
    exampleOrTipEs:
      '¡Haz SIEMPRE tus rerolls de Impresión de Alma ANTES de encantar la pieza a +10/+15! Si la pieza está a +0 el reroll cuesta una fracción de Kinah.',
    exampleOrTipEn:
      'ALWAYS finish your Soul Binding rerolls BEFORE enchanting the item to +10/+15! Rerolling at +0 costs a fraction of the Kinah.',
  },
  {
    id: 'odyle_energy_cubes',
    termEs: 'Energía de Odyle y Cubos de Mazmorra (1 Cubo F2P vs 2 Cubos Sub)',
    termEn: 'Odyle Energy & Dungeon Cubes (1 Cube F2P vs 2 Cubes Sub)',
    badge: 'ECONOMÍA',
    category: 'ECONOMY',
    definitionEs:
      'La Energía de Odyle es tu batería para abrir el Cubo final de Conquista y Trascendencia. Abrir 1 cubo cuesta 40 Odyle; con Membresía Activa puedes abrir 2 cubos por jefe (80 Odyle), cobrando el DOBLE de Kinah y drops en la mitad de tiempo.',
    definitionEn:
      'Odyle Energy is required to open the final reward Cube in Conquest and Transcendence. Opening 1 cube costs 40 Odyle; with an Active Subscription you can open 2 cubes per boss (80 Odyle), earning DOUBLE Kinah and drops in half the runs.',
    exampleOrTipEs:
      'En Trascendencia Tier 4, abrir 2 cubos te entrega exactamente 960.000 Kinah brutos por partida (9.6M Kinah en 10 runs).',
    exampleOrTipEn:
      'In Transcendence Tier 4, opening 2 cubes awards exactly 960,000 gross Kinah per run (9.6M Kinah across 10 runs).',
  },
  {
    id: 'inline_slot_vs_macro',
    termEs: 'Ranura en Línea (Inline Slot) vs. Macro Secuencial',
    termEn: 'Inline Skill Slot vs. Sequential Macro',
    badge: 'COMBATE PRO',
    category: 'COMBAT',
    definitionEs:
      'Una Macro dispara habilidades a ciegas en orden. La función nativa «Asignar a Ranura en Línea» permite poner 2 o 3 habilidades en la misma tecla pero te deja elegir cuándo pulsar el segundo salto o esperar al derribo.',
    definitionEn:
      'A sequential Macro fires skills blindly in order. The native "Assign to Inline Slot" binds 2–3 skills to one key while letting you manually time the second dash or wait for a knockdown.',
    exampleOrTipEs:
      'Nunca metas tu anticontrol (Defiance / Eliminación de impacto) dentro de una macro: déjalo siempre aislado en Espacio.',
    exampleOrTipEn:
      'Never put your CC-breaker (Defiance) inside a macro: always keep it isolated on Spacebar.',
  },
  {
    id: 'pet_insight_wheels',
    termEs: 'Comprensión de Mascotas (Pet Insight — 5 Ruedas de Estadísticas)',
    termEn: 'Pet Insight (5 Stat Wheels: Intellect, Wild, Nature, Transformation, Special)',
    badge: 'PROGRESIÓN CUENTA',
    category: 'STATS',
    definitionEs:
      'Subir las 5 categorías de mascotas al Nivel 10 desbloquea 5 ruedas permanentes de estadísticas para tu personaje. Al rellenar los nodos azules/dorados de una rueda y bloquear los buenos, desbloqueas los nodos centrales de Poder.',
    definitionEn:
      'Leveling all 5 pet families to Level 10 unlocks 5 permanent stat wheels for your character. Filling and locking high-tier nodes unlocks the central Power nodes.',
    exampleOrTipEs:
      'Compra cada miércoles las 1.000 Piedras de Alma Multicolor (500 Kinah c/u) en Conversión de Sustancias para subir las 5 familias rápidamente.',
    exampleOrTipEn:
      'Every Wednesday after reset, craft the 1,000 Multicolor Soul Crystals (500 Kinah each) in Substance Morph to max all 5 pet families.',
  },
];

export const CHECKLIST_TASKS_SEED: readonly ChecklistTaskItem[] = [
  {
    id: 'daily_odyle_drain',
    frequency: 'DAILY',
    titleEs: '1. Drenar Energía de Odyle (Nunca llegar al tope de 560 / 840)',
    titleEn: '1. Drain Odyle Energy (Never cap at 560 / 840)',
    descriptionEs:
      'Se regenera +15 cada 3h. Gástala en Trascendencia Tier 4 (960k con 2 cubos) o Templo del Fuego / Horn Den (800k con 2 cubos).',
    descriptionEn:
      'Regenerates +15 every 3h. Spend it in Transcendence Tier 4 (960k with 2 cubes) or Fire Temple / Horn Den (800k with 2 cubes).',
    rewardBadgeEs: '+600k a +960k Kinah/run',
    rewardBadgeEn: '+600k to +960k Kinah/run',
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
    titleEs: '3. Mazmorra de Trascendencia Tier 1–4 (+2 cargas/día, tope 14)',
    titleEn: '3. Transcendence Dungeon Tier 1–4 (+2 charges/day, cap 14)',
    descriptionEs:
      'En Tier 4 entrega 960.000 Kinah al abrir 2 cubos, además de Arcanas Doradas y Piedras de Maná/Alma Inferiores (Vinculadas) para convertir en Alquimia.',
    descriptionEn:
      'Tier 4 awards 960,000 Kinah when opening 2 cubes, plus Gold Arcanas and Bound Lesser Manastones/Soulstones to convert in Alchemy.',
    rewardBadgeEs: '960k Kinah + Arcanas BiS',
    rewardBadgeEn: '960k Kinah + BiS Arcanas',
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
    titleEs: '5. Festival Shugo (+3 llaves), Donación a la Legión y Cofre Gratis Tienda',
    titleEn: '5. Shugo Festival (+3 keys), Legion Donation & Free Shop Chest',
    descriptionEs:
      'Prioriza Cristales Daevanion con las Fichas de raíz centenaria en la tienda de Shugo y apoya el progreso de tu legión.',
    descriptionEn:
      'Prioritize Daevanion Crystals using Centennial Root Tokens in the Shugo shop and support your legion progress.',
    rewardBadgeEs: 'Cristales Daevanion',
    rewardBadgeEn: 'Daevanion Crystals',
    priority: 'MEDIUM',
  },
  {
    id: 'weekly_wind_breeze_odyle',
    frequency: 'WEEKLY',
    titleEs: '1. Mercader de Viento: Comprar 20 Piedras de Odyle en tu Main + 20 en tu Alt',
    titleEn: '1. Wind Breeze Merchant: Buy 20 Odyle Stones on Main + 20 on Alt',
    descriptionEs:
      'Inversión: 2M Kinah por personaje. Al quemarlas en Trascendencia T4 o Conquista con doble cubo retornan hasta 9.6M brutos (+7.6M Kinah netos por PJ).',
    descriptionEn:
      'Investment: 2M Kinah per character. Burning them in Transcendence T4 or Conquest double cubes returns up to 9.6M gross (+7.6M net Kinah per char).',
    rewardBadgeEs: '+7.6M a +15.2M Kinah Neta',
    rewardBadgeEn: '+7.6M to +15.2M Net Kinah',
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
    titleEs: 'Ruta Express de Alt (15 min): Bio-Research + 4 Corredores del Abismo + Puente Almacén',
    titleEn: 'Alt 15-Min Express Route: Bio-Research + 4 Abyss Corridors + Warehouse Bridge',
    descriptionEs:
      'Usa las Piedras de Mejora y Kinah Vinculada de tu Alt para encantar a +10 piezas comerciables de tu Main a través del Almacén Compartido (Técnica Aluckyro).',
    descriptionEn:
      'Use your Alt’s Bound Enchant Stones and Bound Kinah to enchant tradeable Main gear to +10 via Server Storage (Aluckyro Warehouse Bridge).',
    rewardBadgeEs: 'Ahorro Millones en Main',
    rewardBadgeEn: 'Saves Millions on Main',
    priority: 'CRITICAL',
  },
];
