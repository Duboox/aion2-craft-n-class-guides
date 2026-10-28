/**
 * Contratos estrictos del Patrón Repository.
 * Desacoplan la interfaz gráfica (UI) de la capa de datos (IndexedDB / REST API / JSON estático).
 */
import type {
  CatalogItem,
  CraftingCategory,
  DatabaseStats,
  EvaluatedRecipeAudit,
  MarketItem,
  NpcVendorMaterial,
  SubstanceMorphRecipe,
  VerifiedRecipe,
} from '../models/types';

export interface IMarketRepository {
  getAllMarketItems(): Promise<readonly MarketItem[]>;
  getMarketItem(itemId: number, fallbackNameEn?: string): Promise<MarketItem | null>;
  updateCustomItemPrice(itemKey: number, newPriceKinah: number): Promise<void>;
  refreshLiveMarketPrices(serverId?: number): Promise<{
    readonly updatedCount: number;
    readonly source: 'LIVE_API' | 'STATIC_FALLBACK';
    readonly timestamp: string;
  }>;
}

export interface ICatalogRepository {
  searchCatalogItems(query: string, limit?: number): Promise<readonly CatalogItem[]>;
  getAllVendorMaterials(): Promise<readonly NpcVendorMaterial[]>;
  searchSubstanceMorphRecipes(query: string, limit?: number): Promise<readonly SubstanceMorphRecipe[]>;
}

export interface IRecipeRepository {
  getVerifiedRecipes(category?: CraftingCategory): readonly VerifiedRecipe[];
  evaluateRecipes(category?: CraftingCategory): Promise<readonly EvaluatedRecipeAudit[]>;
}

export interface IDatabaseLifecycleRepository {
  initializeDatabaseIfNeeded(): Promise<DatabaseStats>;
  getDatabaseStats(): Promise<DatabaseStats>;
  reseedFromStaticFiles(): Promise<DatabaseStats>;
  clearAndDeleteIndexedDB(): Promise<void>;
}
