/**
 * Modelos de Dominio estrictamente tipados (Zero-Any Policy).
 */

export type Locale = 'es' | 'en';

export type CraftingCategory =
  | 'All'
  | 'Blacksmithing'
  | 'Jewelcrafting'
  | 'Tailoring'
  | 'Alchemy'
  | 'Cooking'
  | 'Molienda'
  | 'Balaur'
  | 'Vinculados';

export type RecipeFilterScope = 'FEATURED_META' | 'ALL_CLIENT';

export type IngredientSourceType = 'BROKER' | 'NPC' | 'BOUND';

export type RecipeVerdict =
  | 'PROFITABLE_BOTH'
  | 'BOUND_GOLDMINE'
  | 'DESTROYS_VALUE'
  | 'LOW_MARGIN';

export type AionClassId =
  | 'chanter'
  | 'gladiator'
  | 'templar'
  | 'assassin'
  | 'ranger'
  | 'sorcerer'
  | 'elementalist'
  | 'cleric';

export interface ServerInfo {
  readonly id: number;
  readonly name: string;
  readonly region: string;
  readonly faction: 'Asmodian' | 'Elyos';
  readonly shugoServerId: number;
  readonly shugoSlug: string;
}

export interface UserPreferences {
  readonly selectedServerId: number;
  readonly hasActiveSubscription: boolean;
  readonly legionName: string;
}

export interface SavedCharacterConfig {
  readonly id: string;
  readonly name: string;
  readonly serverId: number;
  readonly serverSlug: string;
  readonly shugoServerId: number;
  readonly role: 'MAIN' | 'ALT';
  readonly hasSubscription: boolean;
}

export interface ShugoEquipmentItem {
  readonly slotName: string;
  readonly itemName: string;
  readonly grade: string;
  readonly enchantLevel: number;
  readonly exceedLevel: number;
}

export interface ShugoStatItem {
  readonly name: string;
  readonly value: number | string;
}

export interface CharacterRecommendation {
  readonly id: string;
  readonly severity: 'CRITICAL' | 'HIGH' | 'GOOD';
  readonly titleEs: string;
  readonly titleEn: string;
  readonly detailEs: string;
  readonly detailEn: string;
}

export interface ShugoCharacterProfile {
  readonly characterName: string;
  readonly serverName: string;
  readonly serverSlug: string;
  readonly shugoServerId: number;
  readonly className: string;
  readonly raceName: string;
  readonly level: number;
  readonly combatPower: number;
  readonly gearScore: number;
  readonly titleName: string;
  readonly rankByCp: number | null;
  readonly rankByGs: number | null;
  readonly totalClassRanked: number;
  readonly stats: readonly ShugoStatItem[];
  readonly equipment: readonly ShugoEquipmentItem[];
  readonly recommendations: readonly CharacterRecommendation[];
  readonly fetchedAt: string;
  readonly profileUrl: string;
}

export interface ShugoLeaderboardEntry {
  readonly rankByCp: number;
  readonly rankByGs: number;
  readonly name: string;
  readonly className: string;
  readonly raceName: string;
  readonly level: number;
  readonly combatPower: number;
  readonly gearScore: number;
  readonly guildName: string;
}

export interface CatalogItem {
  readonly id: number;
  readonly nameEn: string;
  readonly nameEs: string;
}

export interface NpcVendorMaterial {
  readonly id: number;
  readonly nameEn: string;
  readonly nameEs: string;
  readonly vendorPriceKinah: number;
}

export interface MarketItem {
  readonly itemKey: number;
  readonly nameEn: string;
  readonly nameEs: string;
  readonly price: number;
  readonly listings: number;
  readonly categoryName: string;
  readonly capturedAt: string;
  readonly changePct: number;
  readonly isCustomOverride: boolean;
}

export interface RecipeIngredient {
  readonly itemId: number;
  readonly nameEn: string;
  readonly nameEs: string;
  readonly quantity: number;
  readonly sourceType: IngredientSourceType;
  readonly fixedNpcPrice?: number;
}

export interface VerifiedRecipe {
  readonly recipeId: string;
  readonly productId: number;
  readonly nameEn: string;
  readonly nameEs: string;
  readonly category: Exclude<CraftingCategory, 'All'>;
  readonly professionEs: string;
  readonly professionEn: string;
  readonly levelReq: number;
  readonly productQuantity: number;
  readonly baseSuccessRate: number;
  readonly comboProductId?: number;
  readonly comboNameEn?: string;
  readonly comboNameEs?: string;
  readonly comboRate?: number;
  readonly isFeatured?: boolean;
  readonly isBalaur?: boolean;
  readonly isMolienda?: boolean;
  readonly hasBoundInput?: boolean;
  readonly grade?: string;
  readonly ingredients: readonly RecipeIngredient[];
  readonly notesEs: string;
  readonly notesEn: string;
}

export interface EvaluatedIngredientLine {
  readonly itemId: number;
  readonly nameEn: string;
  readonly nameEs: string;
  readonly quantity: number;
  readonly sourceType: IngredientSourceType;
  readonly unitPriceKinah: number;
  readonly subtotalKinah: number;
}

export interface EvaluatedRecipeAudit {
  readonly recipe: VerifiedRecipe;
  readonly unitBrokerPrice: number;
  readonly comboBrokerPrice: number;
  readonly activeListings: number;
  readonly npcFixedCost: number;
  readonly brokerMaterialsCost: number;
  readonly boundMaterialsMarketValue: number;
  readonly totalDirectAttemptCost: number;
  readonly expectedCostAdjustedForFailure: number;
  readonly expectedNetRevenuePerAttempt90: number;
  readonly netProfitBuyingAll: number;
  readonly roiBuyingAllPct: number;
  readonly opportunityCostRawSales90: number;
  readonly valueAddedWithOwnMats: number;
  readonly profitWithBoundMats: number;
  readonly roiWithBoundMatsPct: number;
  readonly breakevenUnitPrice: number;
  readonly verdict: RecipeVerdict;
  readonly ingredientBreakdown: readonly EvaluatedIngredientLine[];
}

export interface SubstanceMorphMaterial {
  readonly id: number;
  readonly name: string;
  readonly grade: string;
  readonly count: number;
}

export interface SubstanceMorphRecipe {
  readonly id: number;
  readonly nameEn: string;
  readonly nameEs: string;
  readonly category: string;
  readonly grade: string;
  readonly mastery: number;
  readonly outputCount: number;
  readonly materials: readonly SubstanceMorphMaterial[];
}

export interface DatabaseStats {
  readonly catalogCount: number;
  readonly marketItemsCount: number;
  readonly vendorItemsCount: number;
  readonly morphCount: number;
  readonly clientRecipesCount: number;
  readonly lastSyncedAt: string | null;
  readonly syncSource: 'STATIC_SEED' | 'LIVE_API' | 'EMPTY';
}

export interface ChecklistTaskItem {
  readonly id: string;
  readonly frequency: 'DAILY' | 'WEEKLY' | 'ALT_EXPRESS';
  readonly titleEs: string;
  readonly titleEn: string;
  readonly descriptionEs: string;
  readonly descriptionEn: string;
  readonly rewardBadgeEs: string;
  readonly rewardBadgeEn: string;
  readonly priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface ClassSkillSpecChip {
  readonly level: 'Lv 8' | 'Lv 12' | 'Lv 16' | 'Lv 20';
  readonly textEs: string;
  readonly textEn: string;
}

export interface ClassSkillEntry {
  readonly slug: string;
  readonly nameEs: string;
  readonly nameEn: string;
  readonly iconUrl: string;
  readonly category: 'ACTIVE' | 'STIGMA' | 'PASSIVE';
  readonly modeTag: 'BOTH' | 'PVE' | 'PVP';
  readonly priorityBadge: string;
  readonly summaryEs: string;
  readonly summaryEn: string;
  readonly specs: readonly ClassSkillSpecChip[];
}

export interface ClassGuideSheet {
  readonly classId: AionClassId;
  readonly nameEs: string;
  readonly nameEn: string;
  readonly archetypeEs: string;
  readonly archetypeEn: string;
  readonly heroIconUrl: string;
  readonly externalGuideUrlEn: string;
  readonly externalGuideUrlEs: string;
  readonly oneSentencePveEs: string;
  readonly oneSentencePveEn: string;
  readonly oneSentencePvpEs: string;
  readonly oneSentencePvpEn: string;
  readonly statPriorityPveEs: readonly string[];
  readonly statPriorityPveEn: readonly string[];
  readonly statPriorityPvpEs: readonly string[];
  readonly statPriorityPvpEn: readonly string[];
  readonly arcanaPriorityEs: readonly string[];
  readonly arcanaPriorityEn: readonly string[];
  readonly hotbarAndMacroTipEs: string;
  readonly hotbarAndMacroTipEn: string;
  readonly skills: readonly ClassSkillEntry[];
}

export interface GlossaryTerm {
  readonly id: string;
  readonly termEs: string;
  readonly termEn: string;
  readonly badge: string;
  readonly category: 'STATS' | 'GEAR' | 'ECONOMY' | 'COMBAT';
  readonly definitionEs: string;
  readonly definitionEn: string;
  readonly exampleOrTipEs: string;
  readonly exampleOrTipEn: string;
}
