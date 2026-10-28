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
  RecipeFilterScope,
  SavedCharacterConfig,
  ShugoCharacterProfile,
  ShugoLeaderboardEntry,
  SubstanceMorphRecipe,
  UserPreferences,
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
  getRecipes(
    category?: CraftingCategory,
    scope?: RecipeFilterScope
  ): Promise<readonly VerifiedRecipe[]>;
  evaluateRecipes(
    category?: CraftingCategory,
    scope?: RecipeFilterScope
  ): Promise<readonly EvaluatedRecipeAudit[]>;
}

export interface IUserPreferencesRepository {
  getUserPreferences(): Promise<UserPreferences>;
  saveUserPreferences(prefs: UserPreferences): Promise<void>;
  getSavedCharacters(): Promise<readonly SavedCharacterConfig[]>;
  saveCharacterConfig(charConfig: SavedCharacterConfig): Promise<void>;
  removeCharacterConfig(id: string): Promise<void>;
}

export interface IShugoRepository {
  fetchCharacterProfile(
    serverSlug: string,
    shugoServerId: number,
    characterName: string
  ): Promise<ShugoCharacterProfile>;
  fetchLeaderboard(
    shugoServerId: number,
    className?: string,
    limit?: number
  ): Promise<readonly ShugoLeaderboardEntry[]>;
}

export interface IDatabaseLifecycleRepository {
  initializeDatabaseIfNeeded(): Promise<DatabaseStats>;
  getDatabaseStats(): Promise<DatabaseStats>;
  reseedFromStaticFiles(): Promise<DatabaseStats>;
  clearAndDeleteIndexedDB(): Promise<void>;
}
