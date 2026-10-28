/**
 * Modelos de Dominio estrictamente tipados (Zero-Any Policy).
 */

export type Locale = 'es' | 'en';

export type CraftingCategory =
  | 'All'
  | 'Molienda'
  | 'Balaur'
  | 'Alquimia'
  | 'Cocina'
  | 'Vinculados'
  | 'Orfebreria';

export type IngredientSourceType = 'BROKER' | 'NPC' | 'BOUND';

export type RecipeVerdict =
  | 'PROFITABLE_BOTH'
  | 'BOUND_GOLDMINE'
  | 'DESTROYS_VALUE'
  | 'LOW_MARGIN';

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
