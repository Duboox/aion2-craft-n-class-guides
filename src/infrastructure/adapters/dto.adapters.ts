/**
 * Adaptadores y Mappers de DTOs externos (aion2.exchange, aion2.gg y shugo.gg) hacia nuestros Modelos de Dominio.
 * Si la estructura JSON de una API externa cambia, solo se modifica este adaptador.
 */
import type {
  CatalogItem,
  CharacterRecommendation,
  CraftingCategory,
  IngredientSourceType,
  MarketItem,
  NpcVendorMaterial,
  RecipeIngredient,
  ShugoCharacterProfile,
  ShugoEquipmentItem,
  ShugoLeaderboardEntry,
  ShugoStatItem,
  SubstanceMorphMaterial,
  SubstanceMorphRecipe,
  VerifiedRecipe,
} from '../../domain/models/types';

export interface Aion2ExchangeItemDto {
  readonly item_key?: number;
  readonly name?: string;
  readonly price?: number;
  readonly listings?: number;
  readonly captured_at?: string;
  readonly change_pct?: number | null;
  readonly category?: {
    readonly id?: number;
    readonly name?: string;
    readonly section_id?: string;
    readonly section_name?: string;
  } | null;
}

export interface Aion2ExchangeItemsEnvelopeDto {
  readonly items?: readonly Aion2ExchangeItemDto[];
  readonly total?: number;
}

export interface Aion2GgCatalogDto {
  readonly id?: number;
  readonly name_en?: string;
  readonly name_es?: string;
}

export interface Aion2GgVendorDto {
  readonly id?: number;
  readonly name_en?: string;
  readonly name_es?: string;
  readonly vendor_price_kinah?: number;
}

export interface Aion2GgMorphRowDto {
  readonly id?: number;
  readonly n?: string;
  readonly g?: string;
  readonly c?: string;
  readonly m?: number;
  readonly x?: number;
  readonly mt?: readonly (readonly [number, string, string, string, number])[];
}

export interface ClientRecipeIngredientJsonDto {
  readonly itemId?: number;
  readonly nameEs?: string;
  readonly nameEn?: string;
  readonly quantity?: number;
  readonly isNpcVendor?: boolean;
  readonly isBoundMat?: boolean;
}

export interface ClientRecipeJsonDto {
  readonly recipeId?: string;
  readonly nameEs?: string;
  readonly nameEn?: string;
  readonly category?: string;
  readonly isBalaur?: boolean;
  readonly isMolienda?: boolean;
  readonly hasBoundInput?: boolean;
  readonly grade?: string;
  readonly masteryLevel?: number;
  readonly outputItemId?: number;
  readonly outputQuantity?: number;
  readonly baseSuccessRate?: number;
  readonly comboRate?: number;
  readonly comboOutputNameEs?: string;
  readonly comboOutputNameEn?: string;
  readonly isFeatured?: boolean;
  readonly notesEs?: string;
  readonly notesEn?: string;
  readonly ingredients?: readonly ClientRecipeIngredientJsonDto[];
}

export interface ShugoLeaderboardRawEntryDto {
  readonly characterId?: string;
  readonly characterName?: string;
  readonly name?: string;
  readonly className?: string;
  readonly raceName?: string;
  readonly level?: number;
  readonly characterLevel?: number;
  readonly combatPower?: number;
  readonly gearScore?: number;
  readonly itemLevel?: number;
  readonly guildName?: string;
  readonly rank?: number;
}

export interface ShugoLeaderboardResponseDto {
  readonly entries?: readonly ShugoLeaderboardRawEntryDto[];
  readonly data?: readonly ShugoLeaderboardRawEntryDto[];
  readonly list?: readonly ShugoLeaderboardRawEntryDto[];
}

export function adaptExchangePayloadToDtoArray(raw: unknown): readonly Aion2ExchangeItemDto[] {
  if (Array.isArray(raw)) {
    return raw as readonly Aion2ExchangeItemDto[];
  }
  if (typeof raw === 'object' && raw !== null && 'items' in raw) {
    const env = raw as Aion2ExchangeItemsEnvelopeDto;
    if (Array.isArray(env.items)) {
      return env.items;
    }
  }
  return [];
}

export function mapExchangeDtoToMarketItem(
  dto: Aion2ExchangeItemDto,
  esNameLookup: ReadonlyMap<number, string>
): MarketItem | null {
  const itemKey = typeof dto.item_key === 'number' ? dto.item_key : 0;
  const nameEn = typeof dto.name === 'string' ? dto.name.trim() : '';
  if (!itemKey || !nameEn) {
    return null;
  }
  const nameEs = esNameLookup.get(itemKey) ?? nameEn;
  const price = typeof dto.price === 'number' && Number.isFinite(dto.price) ? dto.price : 0;
  const listings =
    typeof dto.listings === 'number' && Number.isFinite(dto.listings) ? dto.listings : 0;
  const categoryName = dto.category?.name ?? 'Misc';
  const capturedAt =
    typeof dto.captured_at === 'string' ? dto.captured_at : new Date().toISOString();
  const changePct =
    typeof dto.change_pct === 'number' && Number.isFinite(dto.change_pct) ? dto.change_pct : 0;

  return {
    itemKey,
    nameEn,
    nameEs,
    price,
    listings,
    categoryName,
    capturedAt,
    changePct,
    isCustomOverride: false,
  };
}

export function mapCatalogDtoToDomain(dto: Aion2GgCatalogDto): CatalogItem | null {
  const id = typeof dto.id === 'number' ? dto.id : 0;
  if (!id) return null;
  const nameEn = typeof dto.name_en === 'string' ? dto.name_en : '';
  const nameEs = typeof dto.name_es === 'string' ? dto.name_es : nameEn;
  return { id, nameEn, nameEs };
}

export function mapVendorDtoToDomain(dto: Aion2GgVendorDto): NpcVendorMaterial | null {
  const id = typeof dto.id === 'number' ? dto.id : 0;
  if (!id) return null;
  const nameEn = typeof dto.name_en === 'string' ? dto.name_en : '';
  const nameEs = typeof dto.name_es === 'string' ? dto.name_es : nameEn;
  const vendorPriceKinah =
    typeof dto.vendor_price_kinah === 'number' ? dto.vendor_price_kinah : 0;
  return { id, nameEn, nameEs, vendorPriceKinah };
}

export function mapMorphDtoToDomain(
  dto: Aion2GgMorphRowDto,
  esNameLookup: ReadonlyMap<number, string>
): SubstanceMorphRecipe | null {
  const id = typeof dto.id === 'number' ? dto.id : 0;
  const nameEn = typeof dto.n === 'string' ? dto.n : '';
  if (!id || !nameEn) return null;

  const materials: SubstanceMorphMaterial[] = [];
  if (Array.isArray(dto.mt)) {
    for (const tuple of dto.mt) {
      if (Array.isArray(tuple) && tuple.length >= 5) {
        const matId = Number(tuple[0]);
        const matNameEn = String(tuple[1]);
        const matGrade = String(tuple[2]);
        const matCount = Number(tuple[4]);
        materials.push({
          id: matId,
          name: esNameLookup.get(matId) ?? matNameEn,
          grade: matGrade,
          count: matCount,
        });
      }
    }
  }

  return {
    id,
    nameEn,
    nameEs: esNameLookup.get(id) ?? nameEn,
    category: typeof dto.c === 'string' ? dto.c : 'Substance Morph',
    grade: typeof dto.g === 'string' ? dto.g : 'Common',
    mastery: typeof dto.m === 'number' ? dto.m : 1,
    outputCount: typeof dto.x === 'number' ? dto.x : 1,
    materials,
  };
}

const PROFESSION_LABELS_ES: Readonly<Record<string, string>> = {
  Blacksmithing: 'Herrería',
  Jewelcrafting: 'Orfebrería',
  Tailoring: 'Sastrería',
  Alchemy: 'Alquimia',
  Cooking: 'Cocina',
  Molienda: 'Molienda',
  Balaur: 'Balaur',
  Vinculados: 'Vinculados',
};

export function mapClientRecipeDtoToDomain(
  dto: ClientRecipeJsonDto,
  vendorPriceMap: ReadonlyMap<number, number>
): VerifiedRecipe | null {
  const recipeId = typeof dto.recipeId === 'string' ? dto.recipeId : '';
  const productId = typeof dto.outputItemId === 'number' ? dto.outputItemId : 0;
  const nameEn = typeof dto.nameEn === 'string' ? dto.nameEn : '';
  const nameEs = typeof dto.nameEs === 'string' ? dto.nameEs : nameEn;
  if (!recipeId || !productId || !nameEn) return null;

  const rawCat = typeof dto.category === 'string' ? dto.category : 'Alchemy';
  const validCategories: readonly Exclude<CraftingCategory, 'All'>[] = [
    'Blacksmithing',
    'Jewelcrafting',
    'Tailoring',
    'Alchemy',
    'Cooking',
    'Molienda',
    'Balaur',
    'Vinculados',
  ];
  const category: Exclude<CraftingCategory, 'All'> = validCategories.includes(
    rawCat as Exclude<CraftingCategory, 'All'>
  )
    ? (rawCat as Exclude<CraftingCategory, 'All'>)
    : 'Alchemy';

  const levelReq = typeof dto.masteryLevel === 'number' ? dto.masteryLevel : 1;
  const productQuantity = typeof dto.outputQuantity === 'number' ? dto.outputQuantity : 1;
  const baseSuccessRate =
    typeof dto.baseSuccessRate === 'number' ? dto.baseSuccessRate : 0.7288;
  const comboRate = typeof dto.comboRate === 'number' ? dto.comboRate : 0.15;

  const profEsLabel = PROFESSION_LABELS_ES[category] ?? category;
  const pctText = `${(baseSuccessRate * 100).toFixed(1)}%`;

  const ingredients: RecipeIngredient[] = [];
  if (Array.isArray(dto.ingredients)) {
    for (const ing of dto.ingredients) {
      const itemId = typeof ing.itemId === 'number' ? ing.itemId : 0;
      if (!itemId) continue;
      const isNpc = Boolean(ing.isNpcVendor) || vendorPriceMap.has(itemId);
      const isBound = Boolean(ing.isBoundMat) && !isNpc;
      const sourceType: IngredientSourceType = isNpc
        ? 'NPC'
        : isBound
          ? 'BOUND'
          : 'BROKER';
      const fixedNpcPrice = isNpc ? (vendorPriceMap.get(itemId) ?? 1200) : undefined;

      ingredients.push({
        itemId,
        nameEn: typeof ing.nameEn === 'string' ? ing.nameEn : `Item #${itemId}`,
        nameEs: typeof ing.nameEs === 'string' ? ing.nameEs : `Objeto #${itemId}`,
        quantity: typeof ing.quantity === 'number' ? ing.quantity : 1,
        sourceType,
        fixedNpcPrice,
      });
    }
  }

  return {
    recipeId,
    productId,
    nameEn,
    nameEs,
    category,
    professionEs: `${profEsLabel} Nv. ${levelReq} (${pctText})`,
    professionEn: `${category} Lv. ${levelReq} (${pctText})`,
    levelReq,
    productQuantity,
    baseSuccessRate,
    comboNameEn: dto.comboOutputNameEn,
    comboNameEs: dto.comboOutputNameEs,
    comboRate,
    isFeatured: Boolean(dto.isFeatured),
    isBalaur: Boolean(dto.isBalaur),
    isMolienda: Boolean(dto.isMolienda),
    hasBoundInput: Boolean(dto.hasBoundInput),
    grade: typeof dto.grade === 'string' ? dto.grade : 'Common',
    ingredients,
    notesEs:
      typeof dto.notesEs === 'string'
        ? dto.notesEs
        : `Receta de ${profEsLabel} Nv. ${levelReq}.`,
    notesEn:
      typeof dto.notesEn === 'string'
        ? dto.notesEn
        : `${category} Lv. ${levelReq} client recipe.`,
  };
}

export function mapShugoLeaderboardDtoToDomain(
  rawPayload: unknown
): readonly ShugoLeaderboardEntry[] {
  let rows: readonly ShugoLeaderboardRawEntryDto[] = [];
  if (Array.isArray(rawPayload)) {
    rows = rawPayload as readonly ShugoLeaderboardRawEntryDto[];
  } else if (typeof rawPayload === 'object' && rawPayload !== null) {
    const obj = rawPayload as ShugoLeaderboardResponseDto;
    if (Array.isArray(obj.entries)) rows = obj.entries;
    else if (Array.isArray(obj.data)) rows = obj.data;
    else if (Array.isArray(obj.list)) rows = obj.list;
  }

  const normalized = rows
    .map((r) => {
      const name = (r.characterName ?? r.name ?? '').trim();
      const combatPower = Number(r.combatPower ?? 0);
      const gearScore = Number(r.gearScore ?? r.itemLevel ?? 0);
      return {
        name,
        className: String(r.className ?? 'Unknown'),
        raceName: String(r.raceName ?? 'Asmodians'),
        level: Number(r.level ?? r.characterLevel ?? 45),
        combatPower: Number.isFinite(combatPower) ? combatPower : 0,
        gearScore: Number.isFinite(gearScore) ? gearScore : 0,
        guildName: String(r.guildName ?? '—'),
      };
    })
    .filter((r) => r.name.length > 0);

  const byCp = [...normalized].sort((a, b) => b.combatPower - a.combatPower);
  const byGs = [...normalized].sort((a, b) => b.gearScore - a.gearScore);

  const gsRankMap = new Map<string, number>();
  byGs.forEach((entry, idx) => {
    gsRankMap.set(entry.name.toLowerCase(), idx + 1);
  });

  return byCp.map((entry, idx) => ({
    ...entry,
    rankByCp: idx + 1,
    rankByGs: gsRankMap.get(entry.name.toLowerCase()) ?? idx + 1,
  }));
}

export function buildCharacterRecommendations(
  combatPower: number,
  gearScore: number,
  equipment: readonly ShugoEquipmentItem[],
  stats: readonly ShugoStatItem[]
): readonly CharacterRecommendation[] {
  const recs: CharacterRecommendation[] = [];

  // 1. Check weapon & guard enchant / breakthrough
  const mainWeapon = equipment.find(
    (e) =>
      e.slotName.toLowerCase().includes('main') ||
      e.slotName.toLowerCase().includes('weapon') ||
      e.slotName.toLowerCase().includes('right')
  );
  if (mainWeapon && (mainWeapon.enchantLevel < 15 || mainWeapon.exceedLevel < 1)) {
    recs.push({
      id: 'weapon_breakthrough',
      severity: 'CRITICAL',
      titleEs: `Prioridad #1: Llevar Arma Principal (${mainWeapon.itemName}) a +15 ◆1`,
      titleEn: `Priority #1: Push Main Weapon (${mainWeapon.itemName}) to +15 ◆1`,
      detailEs: `Tu arma actual está en +${mainWeapon.enchantLevel} ◆${mainWeapon.exceedLevel}. El mayor salto de CP y Daño de Arma proviene de alcanzar +15 y activar la primera Ruptura (◆1).`,
      detailEn: `Your weapon is currently +${mainWeapon.enchantLevel} ◆${mainWeapon.exceedLevel}. The biggest jump in CP and Weapon Damage comes from reaching +15 and unlocking your first Breakthrough (◆1).`,
    });
  } else if (mainWeapon && mainWeapon.exceedLevel >= 1) {
    recs.push({
      id: 'weapon_good',
      severity: 'GOOD',
      titleEs: `Arma Principal en +${mainWeapon.enchantLevel} ◆${mainWeapon.exceedLevel} (Excelente Base)`,
      titleEn: `Main Weapon at +${mainWeapon.enchantLevel} ◆${mainWeapon.exceedLevel} (Strong Foundation)`,
      detailEs:
        'Ya superaste la primera barrera de Ruptura en tu arma. Enfoca ahora tus recursos en subir tu Habilidad Principal a Nivel 16–20 mediante Arcanas (+2/+3) y Joyería.',
      detailEn:
        'You already cleared the first Breakthrough milestone on your weapon. Focus your resources now on pushing your Core Skill to Level 16–20 via Arcanas (+2/+3) and Jewelry.',
    });
  }

  // 2. Check armor pieces below +10 (Aluckyro Server Storage Bridge)
  const lowArmor = equipment.filter((e) => e.enchantLevel < 10);
  if (lowArmor.length > 0) {
    recs.push({
      id: 'armor_plus_10',
      severity: 'HIGH',
      titleEs: `${lowArmor.length} pieza(s) por debajo de +10 (Zona 100% Segura)`,
      titleEn: `${lowArmor.length} piece(s) below +10 (100% Safe Enchant Zone)`,
      detailEs: `Recuerda que de +1 a +10 la tasa de éxito es del 100%. Si alguna pieza aún es comerciable, pásala por el Almacén Compartido a tu Alt para subirla a +10 con Piedras y Kinah Vinculadas del Alt.`,
      detailEn: `Remember +1 to +10 enchanting has a 100% success rate. If any piece is still tradeable, pass it via Server Storage to your Alt to enchant to +10 using the Alt's Bound Stones and Kinah.`,
    });
  }

  // 3. Check CP to GS ratio
  const cpPerGs = gearScore > 0 ? combatPower / gearScore : 0;
  if (gearScore >= 2000 && cpPerGs < 45) {
    recs.push({
      id: 'cp_density_warning',
      severity: 'HIGH',
      titleEs: `Densidad CP/GS (${cpPerGs.toFixed(1)} CP por punto de GS): Optimiza Arcanas, Daevanion e Insight`,
      titleEn: `CP/GS Density (${cpPerGs.toFixed(1)} CP per GS): Optimize Arcanas, Daevanion & Pet Insight`,
      detailEs:
        'Los jugadores Top 50 del servidor mantienen un ratio de 52 a 68+ CP por cada punto de GS gracias a Nodos Daevanion (Fragmentos de Ariel), las 5 Ruedas de Mascotas Nv. 10 y Arcanas Doradas en Trascendencia Tier 3–4.',
      detailEn:
        'Top 50 server players maintain a ratio of 52 to 68+ CP per GS point through Daevanion Boards (Ariel Fragments), all 5 Level 10 Pet Insight Wheels, and Gold Arcanas from Transcendence Tier 3–4.',
    });
  } else if (gearScore >= 2500) {
    recs.push({
      id: 'transcendence_t4_ready',
      severity: 'GOOD',
      titleEs: `Apto para Trascendencia Tier 4 (960.000 Kinah con 2 Cubos)`,
      titleEn: `Eligible for Transcendence Tier 4 (960,000 Kinah with 2 Cubes)`,
      detailEs: `Con ${gearScore.toLocaleString()} GS superas los 2.500 GS requeridos para Trascendencia Tier 4. Abrir 2 cubos allí con Membresía Activa te otorga 960k Kinah por run (9.6M en 10 runs).`,
      detailEn: `At ${gearScore.toLocaleString()} GS you exceed the 2,500 GS gate for Transcendence Tier 4. Opening 2 cubes there with an Active Subscription yields 960k Kinah per run (9.6M in 10 runs).`,
    });
  }

  // 4. Check Might stat
  const mightStat = stats.find((s) => s.name.toLowerCase() === 'might');
  const mightVal = mightStat ? Number(mightStat.value) : 0;
  if (mightVal > 0 && mightVal < 110) {
    recs.push({
      id: 'might_double_chance',
      severity: 'HIGH',
      titleEs: `Incrementar Fuerza / Might (${mightVal}) para subir Golpe % (Double Chance)`,
      titleEn: `Increase Might (${mightVal}) to boost Double Chance % (Golpe %)`,
      detailEs:
        'Cada punto de Fuerza (Might) otorga +0.2% de Golpe (Double Chance). Busca Fuerza y Velocidad de Combate en tus Impresiones de Alma antes de encantar piezas nuevas.',
      detailEn:
        'Each point of Might grants +0.2% Double Chance. Roll Might and Combat Speed on your Soul Bindings before enchanting new gear.',
    });
  }

  return recs;
}

export function parseShugoProfileHtmlToDomain(
  html: string,
  serverSlug: string,
  shugoServerId: number,
  characterName: string,
  leaderboardEntries: readonly ShugoLeaderboardEntry[],
  profileUrl: string
): ShugoCharacterProfile | null {
  const match = html.match(/<script id="shugo-profile"[^>]*>([\s\S]*?)<\/script>/i);
  if (!match || !match[1]) {
    return null;
  }

  const rawJson = JSON.parse(match[1]) as {
    readonly info?: {
      readonly profile?: {
        readonly characterName?: string;
        readonly serverName?: string;
        readonly className?: string;
        readonly raceName?: string;
        readonly characterLevel?: number;
        readonly combatPower?: number;
        readonly titleName?: string;
      };
      readonly stat?: {
        readonly statList?: readonly {
          readonly name?: string;
          readonly type?: string;
          readonly value?: number | string;
        }[];
      };
    };
    readonly equipment?: {
      readonly equipment?: {
        readonly equipmentList?: readonly {
          readonly slotPosName?: string;
          readonly name?: string;
          readonly grade?: string;
          readonly enchantLevel?: number;
          readonly exceedLevel?: number;
        }[];
      };
    };
  };

  const prof = rawJson.info?.profile;
  if (!prof) return null;

  const rawStats = rawJson.info?.stat?.statList ?? [];
  const stats: ShugoStatItem[] = [];
  let gearScore = 0;

  for (const st of rawStats) {
    const sName = String(st.name ?? st.type ?? '');
    const sVal = st.value ?? 0;
    if (!sName) continue;
    if (sName.toLowerCase() === 'itemlevel') {
      gearScore = Number(sVal) || 0;
    }
    stats.push({ name: sName, value: sVal });
  }

  const rawEquip = rawJson.equipment?.equipment?.equipmentList ?? [];
  const equipment: ShugoEquipmentItem[] = rawEquip.map((eq) => ({
    slotName: String(eq.slotPosName ?? 'Slot'),
    itemName: String(eq.name ?? 'Unknown'),
    grade: String(eq.grade ?? 'Unique'),
    enchantLevel: Number(eq.enchantLevel ?? 0),
    exceedLevel: Number(eq.exceedLevel ?? 0),
  }));

  const resolvedName = String(prof.characterName ?? characterName);
  const combatPower = Number(prof.combatPower ?? 0);

  const lbMatch = leaderboardEntries.find(
    (e) => e.name.toLowerCase() === resolvedName.toLowerCase()
  );

  const recommendations = buildCharacterRecommendations(
    combatPower,
    gearScore,
    equipment,
    stats
  );

  return {
    characterName: resolvedName,
    serverName: String(prof.serverName ?? serverSlug),
    serverSlug,
    shugoServerId,
    className: String(prof.className ?? 'Chanter'),
    raceName: String(prof.raceName ?? 'Asmodians'),
    level: Number(prof.characterLevel ?? 45),
    combatPower,
    gearScore,
    titleName: String(prof.titleName ?? 'Daeva'),
    rankByCp: lbMatch?.rankByCp ?? null,
    rankByGs: lbMatch?.rankByGs ?? null,
    totalClassRanked: leaderboardEntries.length,
    stats,
    equipment,
    recommendations,
    fetchedAt: new Date().toISOString(),
    profileUrl,
  };
}
