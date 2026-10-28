/**
 * Base de datos indexada en el navegador (IndexedDB) mediante Dexie.js con tipado estricto.
 */
import Dexie, { type EntityTable } from 'dexie';
import type {
  CatalogItem,
  MarketItem,
  NpcVendorMaterial,
  SavedCharacterConfig,
  SubstanceMorphRecipe,
  VerifiedRecipe,
} from '../../domain/models/types';

export interface DbMetaEntry {
  readonly key: string;
  readonly value: string;
}

export interface ChecklistCompletedEntry {
  readonly taskId: string;
  readonly completed: boolean;
  readonly updatedAt: string;
}

export class Aion2CraftGuidesDatabase extends Dexie {
  public marketItems!: EntityTable<MarketItem, 'itemKey'>;
  public catalogItems!: EntityTable<CatalogItem, 'id'>;
  public vendorMaterials!: EntityTable<NpcVendorMaterial, 'id'>;
  public morphRecipes!: EntityTable<SubstanceMorphRecipe, 'id'>;
  public clientRecipes!: EntityTable<VerifiedRecipe, 'recipeId'>;
  public savedCharacters!: EntityTable<SavedCharacterConfig, 'id'>;
  public checklist!: EntityTable<ChecklistCompletedEntry, 'taskId'>;
  public meta!: EntityTable<DbMetaEntry, 'key'>;

  public constructor() {
    super('Aion2CraftGuidesDB');
    this.version(2).stores({
      marketItems: 'itemKey, nameEn, nameEs, categoryName, price, listings',
      catalogItems: 'id, nameEn, nameEs',
      vendorMaterials: 'id, nameEn, nameEs, vendorPriceKinah',
      morphRecipes: 'id, nameEn, category, grade',
      clientRecipes: 'recipeId, productId, category, nameEn, nameEs, isFeatured',
      savedCharacters: 'id, name, serverId, role',
      checklist: 'taskId, completed',
      meta: 'key',
    });
  }
}

export const dbInstance = new Aion2CraftGuidesDatabase();
