/**
 * Implementación concreta del Patrón Repository sobre IndexedDB (Dexie) + Fetch API con Fallback CORS.
 * Si cambia un endpoint o estructura de API, la UI no se entera: todo pasa por esta capa y los adaptadores.
 */
import { ENDPOINTS_CONFIG, getStaticAssetUrl } from '../../config/endpoints.config';
import { VERIFIED_RECIPES_SEED } from '../../data/verified-recipes.seed';
import type {
  CatalogItem,
  CraftingCategory,
  DatabaseStats,
  EvaluatedIngredientLine,
  EvaluatedRecipeAudit,
  MarketItem,
  NpcVendorMaterial,
  RecipeFilterScope,
  RecipeVerdict,
  SavedCharacterConfig,
  ShugoCharacterProfile,
  ShugoLeaderboardEntry,
  SubstanceMorphRecipe,
  UserPreferences,
  VerifiedRecipe,
} from '../../domain/models/types';
import type {
  ICatalogRepository,
  IDatabaseLifecycleRepository,
  IMarketRepository,
  IRecipeRepository,
  IShugoRepository,
  IUserPreferencesRepository,
} from '../../domain/repositories/interfaces';
import {
  type Aion2GgCatalogDto,
  type Aion2GgMorphRowDto,
  type Aion2GgVendorDto,
  type ClientRecipeJsonDto,
  adaptExchangePayloadToDtoArray,
  buildCharacterRecommendations,
  mapCatalogDtoToDomain,
  mapClientRecipeDtoToDomain,
  mapExchangeDtoToMarketItem,
  mapMorphDtoToDomain,
  mapShugoLeaderboardDtoToDomain,
  mapVendorDtoToDomain,
  parseShugoProfileHtmlToDomain,
} from '../adapters/dto.adapters';
import { dbInstance } from '../db/dexie.db';

const META_LAST_SYNC_KEY = 'lastSyncedAt';
const META_SYNC_SOURCE_KEY = 'syncSource';
const META_USER_PREFS_KEY = 'userPreferencesJson';
const META_SEED_VERSION_KEY = 'seedDatasetVersion';
const CURRENT_SEED_VERSION = 'v2.4-complete-432';
const MARKET_REFRESH_COOLDOWN_MS = 60_000;
const CHAR_PROFILE_CACHE_TTL_MS = 300_000;

const DEFAULT_USER_PREFS: UserPreferences = {
  selectedServerId: ENDPOINTS_CONFIG.defaultServerId,
  hasActiveSubscription: true,
  legionName: ENDPOINTS_CONFIG.defaultLegionName,
};

export class Aion2UnifiedRepository
  implements
    IMarketRepository,
    ICatalogRepository,
    IRecipeRepository,
    IUserPreferencesRepository,
    IShugoRepository,
    IDatabaseLifecycleRepository
{
  private initPromise: Promise<DatabaseStats> | null = null;
  private readonly lastMarketRefreshByServer = new Map<number, number>();
  private readonly characterProfileCache = new Map<
    string,
    { readonly profile: ShugoCharacterProfile; readonly expiresAt: number }
  >();
  private azphelLeaderboardSeedCache: readonly ShugoLeaderboardEntry[] | null = null;

  public async initializeDatabaseIfNeeded(): Promise<DatabaseStats> {
    if (typeof window === 'undefined') {
      return {
        catalogCount: 0,
        marketItemsCount: 0,
        vendorItemsCount: 0,
        morphCount: 0,
        clientRecipesCount: 0,
        lastSyncedAt: null,
        syncSource: 'EMPTY',
      };
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async (): Promise<DatabaseStats> => {
      await dbInstance.open();
      const [
        existingMarketCount,
        existingCatalogCount,
        existingRecipeCount,
        seedVersionMeta,
      ] = await Promise.all([
        dbInstance.marketItems.count(),
        dbInstance.catalogItems.count(),
        dbInstance.clientRecipes.count(),
        dbInstance.meta.get(META_SEED_VERSION_KEY),
      ]);

      if (
        existingMarketCount > 0 &&
        existingCatalogCount > 0 &&
        existingRecipeCount >= 400 &&
        seedVersionMeta?.value === CURRENT_SEED_VERSION
      ) {
        return this.getDatabaseStats();
      }
      return this.reseedFromStaticFiles();
    })();

    try {
      return await this.initPromise;
    } finally {
      this.initPromise = null;
    }
  }

  public async getDatabaseStats(): Promise<DatabaseStats> {
    if (typeof window === 'undefined') {
      return {
        catalogCount: 0,
        marketItemsCount: 0,
        vendorItemsCount: 0,
        morphCount: 0,
        clientRecipesCount: 0,
        lastSyncedAt: null,
        syncSource: 'EMPTY',
      };
    }
    await dbInstance.open();
    const [
      catalogCount,
      marketItemsCount,
      vendorItemsCount,
      morphCount,
      clientRecipesCount,
      syncMeta,
      sourceMeta,
    ] = await Promise.all([
      dbInstance.catalogItems.count(),
      dbInstance.marketItems.count(),
      dbInstance.vendorMaterials.count(),
      dbInstance.morphRecipes.count(),
      dbInstance.clientRecipes.count(),
      dbInstance.meta.get(META_LAST_SYNC_KEY),
      dbInstance.meta.get(META_SYNC_SOURCE_KEY),
    ]);

    const rawSource = sourceMeta?.value;
    const syncSource: 'STATIC_SEED' | 'LIVE_API' | 'EMPTY' =
      rawSource === 'LIVE_API'
        ? 'LIVE_API'
        : marketItemsCount > 0
          ? 'STATIC_SEED'
          : 'EMPTY';

    return {
      catalogCount,
      marketItemsCount,
      vendorItemsCount,
      morphCount,
      clientRecipesCount,
      lastSyncedAt: syncMeta?.value ?? null,
      syncSource,
    };
  }

  public async reseedFromStaticFiles(): Promise<DatabaseStats> {
    await dbInstance.open();

    const [catalogRes, vendorRes, marketRes, morphRes, clientRecipesRes] =
      await Promise.all([
        fetch(getStaticAssetUrl(ENDPOINTS_CONFIG.staticSeedPaths.catalogItemsEnEs)),
        fetch(getStaticAssetUrl(ENDPOINTS_CONFIG.staticSeedPaths.vendorPrices)),
        fetch(getStaticAssetUrl(ENDPOINTS_CONFIG.staticSeedPaths.marketItems)),
        fetch(getStaticAssetUrl(ENDPOINTS_CONFIG.staticSeedPaths.morphConversions)),
        fetch(getStaticAssetUrl(ENDPOINTS_CONFIG.staticSeedPaths.allClientRecipes)),
      ]);

    const catalogDtos = (await catalogRes.json()) as readonly Aion2GgCatalogDto[];
    const vendorDtos = (await vendorRes.json()) as readonly Aion2GgVendorDto[];
    const marketRaw = (await marketRes.json()) as unknown;
    const morphDtos = (await morphRes.json()) as readonly Aion2GgMorphRowDto[];
    const clientRecipeDtos =
      (await clientRecipesRes.json()) as readonly ClientRecipeJsonDto[];

    const catalogItems: CatalogItem[] = [];
    const esNameMap = new Map<number, string>();
    for (const dto of catalogDtos) {
      const mapped = mapCatalogDtoToDomain(dto);
      if (mapped) {
        catalogItems.push(mapped);
        esNameMap.set(mapped.id, mapped.nameEs);
      }
    }

    const vendorMaterials: NpcVendorMaterial[] = [];
    const vendorPriceMap = new Map<number, number>();
    for (const dto of vendorDtos) {
      const mapped = mapVendorDtoToDomain(dto);
      if (mapped) {
        vendorMaterials.push(mapped);
        esNameMap.set(mapped.id, mapped.nameEs);
        vendorPriceMap.set(mapped.id, mapped.vendorPriceKinah);
      }
    }

    const exchangeDtos = adaptExchangePayloadToDtoArray(marketRaw);
    const marketItems: MarketItem[] = [];
    for (const dto of exchangeDtos) {
      const mapped = mapExchangeDtoToMarketItem(dto, esNameMap);
      if (mapped) {
        marketItems.push(mapped);
      }
    }

    const morphRecipes: SubstanceMorphRecipe[] = [];
    for (const dto of morphDtos) {
      const mapped = mapMorphDtoToDomain(dto, esNameMap);
      if (mapped) {
        morphRecipes.push(mapped);
      }
    }

    // Merge curated featured recipes + all 416 client recipes across all professions
    const mergedRecipes: VerifiedRecipe[] = VERIFIED_RECIPES_SEED.map((r) => ({
      ...r,
      isFeatured: true,
      isBalaur: r.category === 'Balaur',
      isMolienda: r.category === 'Molienda',
      hasBoundInput:
        r.category === 'Vinculados' || r.ingredients.some((i) => i.sourceType === 'BOUND'),
    }));
    const seenRecipeIds = new Set<string>(mergedRecipes.map((r) => r.recipeId));

    for (const dto of clientRecipeDtos) {
      const mapped = mapClientRecipeDtoToDomain(dto, vendorPriceMap);
      if (mapped && !seenRecipeIds.has(mapped.recipeId)) {
        seenRecipeIds.add(mapped.recipeId);
        mergedRecipes.push(mapped);
      }
    }

    const nowIso = new Date().toISOString();

    await dbInstance.transaction(
      'rw',
      [
        dbInstance.catalogItems,
        dbInstance.vendorMaterials,
        dbInstance.marketItems,
        dbInstance.morphRecipes,
        dbInstance.clientRecipes,
        dbInstance.meta,
      ],
      async () => {
        await dbInstance.catalogItems.clear();
        await dbInstance.vendorMaterials.clear();
        await dbInstance.marketItems.clear();
        await dbInstance.morphRecipes.clear();
        await dbInstance.clientRecipes.clear();

        await dbInstance.catalogItems.bulkPut(catalogItems);
        await dbInstance.vendorMaterials.bulkPut(vendorMaterials);
        await dbInstance.marketItems.bulkPut(marketItems);
        await dbInstance.morphRecipes.bulkPut(morphRecipes);
        await dbInstance.clientRecipes.bulkPut(mergedRecipes);

        await dbInstance.meta.put({ key: META_LAST_SYNC_KEY, value: nowIso });
        await dbInstance.meta.put({ key: META_SYNC_SOURCE_KEY, value: 'STATIC_SEED' });
        await dbInstance.meta.put({
          key: META_SEED_VERSION_KEY,
          value: CURRENT_SEED_VERSION,
        });
      }
    );

    return this.getDatabaseStats();
  }

  public async clearAndDeleteIndexedDB(): Promise<void> {
    if (typeof window === 'undefined') return;
    await dbInstance.delete();
    await dbInstance.open();
  }

  // ==========================================================================
  // USER PREFERENCES & SAVED CHARACTERS (PRIVACY-FIRST IN INDEXEDDB)
  // ==========================================================================
  public async getUserPreferences(): Promise<UserPreferences> {
    if (typeof window === 'undefined') return DEFAULT_USER_PREFS;
    await dbInstance.open();
    const entry = await dbInstance.meta.get(META_USER_PREFS_KEY);
    if (!entry?.value) return DEFAULT_USER_PREFS;
    try {
      const parsed = JSON.parse(entry.value) as Partial<UserPreferences>;
      return {
        selectedServerId:
          typeof parsed.selectedServerId === 'number'
            ? parsed.selectedServerId
            : DEFAULT_USER_PREFS.selectedServerId,
        hasActiveSubscription:
          typeof parsed.hasActiveSubscription === 'boolean'
            ? parsed.hasActiveSubscription
            : DEFAULT_USER_PREFS.hasActiveSubscription,
        legionName:
          typeof parsed.legionName === 'string' && parsed.legionName.trim().length > 0
            ? parsed.legionName.trim()
            : DEFAULT_USER_PREFS.legionName,
      };
    } catch {
      return DEFAULT_USER_PREFS;
    }
  }

  public async saveUserPreferences(prefs: UserPreferences): Promise<void> {
    if (typeof window === 'undefined') return;
    await dbInstance.open();
    await dbInstance.meta.put({
      key: META_USER_PREFS_KEY,
      value: JSON.stringify(prefs),
    });
  }

  public async getSavedCharacters(): Promise<readonly SavedCharacterConfig[]> {
    if (typeof window === 'undefined') return [];
    await dbInstance.open();
    return dbInstance.savedCharacters.toArray();
  }

  public async saveCharacterConfig(charConfig: SavedCharacterConfig): Promise<void> {
    if (typeof window === 'undefined') return;
    await dbInstance.open();
    await dbInstance.savedCharacters.put(charConfig);
  }

  public async removeCharacterConfig(id: string): Promise<void> {
    if (typeof window === 'undefined') return;
    await dbInstance.open();
    await dbInstance.savedCharacters.delete(id);
  }

  // ==========================================================================
  // SHUGO.GG LIVE CHARACTER PROFILE & LEADERBOARD (WITH ZERO-CORS AZPHEL SEED & RATE LIMITING)
  // ==========================================================================
  private unwrapProxyResponseText(rawText: string): string {
    const trimmed = rawText.trim();
    if (trimmed.startsWith('{') && trimmed.includes('"contents"')) {
      try {
        const parsed = JSON.parse(trimmed) as { readonly contents?: unknown };
        if (typeof parsed.contents === 'string' && parsed.contents.length > 10) {
          return parsed.contents;
        }
      } catch {
        // Return original text
      }
    }
    return rawText;
  }

  private async fetchTextWithCorsFallback(targetUrl: string): Promise<string> {
    const candidateUrls: string[] = [
      ...ENDPOINTS_CONFIG.liveApi.corsProxies.map((proxyFn) => proxyFn(targetUrl)),
      targetUrl,
    ];

    for (const url of candidateUrls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 9000);
        const res = await fetch(url, { signal: controller.signal, cache: 'no-store' });
        clearTimeout(timeoutId);
        if (!res.ok) continue;
        const rawText = await res.text();
        const unwrapped = this.unwrapProxyResponseText(rawText);
        if (unwrapped && unwrapped.length > 20) {
          return unwrapped;
        }
      } catch {
        // Try next proxy
      }
    }
    throw new Error(`Unable to reach ${targetUrl} via CORS proxies.`);
  }

  private async loadAzphelLeaderboardStaticSeed(): Promise<
    readonly ShugoLeaderboardEntry[]
  > {
    if (this.azphelLeaderboardSeedCache) {
      return this.azphelLeaderboardSeedCache;
    }
    try {
      const res = await fetch(getStaticAssetUrl('/data/shugo_leaderboard_azphel.json'));
      if (res.ok) {
        const json = (await res.json()) as unknown;
        const mapped = mapShugoLeaderboardDtoToDomain(json);
        if (mapped.length > 0) {
          this.azphelLeaderboardSeedCache = mapped;
          return mapped;
        }
      }
    } catch {
      // Ignore fallback error
    }
    return [];
  }

  public async fetchLeaderboard(
    shugoServerId: number,
    className?: string,
    limit = 50
  ): Promise<readonly ShugoLeaderboardEntry[]> {
    // 1. For Azphel NA-East (2106), use our 1,723-player synced snapshot immediately (Zero CORS!)
    if (shugoServerId === 2106) {
      const staticAzphel = await this.loadAzphelLeaderboardStaticSeed();
      if (staticAzphel.length > 0) {
        const filtered =
          className && className !== 'All'
            ? staticAzphel.filter(
                (e) => e.className.toLowerCase() === className.toLowerCase()
              )
            : staticAzphel;
        return filtered.slice(0, limit);
      }
    }

    const targetUrl = ENDPOINTS_CONFIG.liveApi.shugoLeaderboardUrl(
      shugoServerId,
      className,
      limit
    );
    try {
      const rawText = await this.fetchTextWithCorsFallback(targetUrl);
      const json = JSON.parse(rawText) as unknown;
      return mapShugoLeaderboardDtoToDomain(json).slice(0, limit);
    } catch {
      return [];
    }
  }

  public async fetchCharacterProfile(
    serverSlug: string,
    shugoServerId: number,
    characterName: string
  ): Promise<ShugoCharacterProfile> {
    const cleanName = characterName.trim();
    const cacheKey = `${serverSlug}_${cleanName.toLowerCase()}`;
    const cached = this.characterProfileCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.profile;
    }

    const profileUrl = ENDPOINTS_CONFIG.liveApi.shugoCharacterUrl(serverSlug, cleanName);

    // Pre-load full server leaderboard so rankByCp & rankByGs are accurate
    const fullLeaderboard =
      shugoServerId === 2106
        ? await this.loadAzphelLeaderboardStaticSeed()
        : await this.fetchLeaderboard(shugoServerId, undefined, 100);

    try {
      const html = await this.fetchTextWithCorsFallback(profileUrl);
      const parsed = parseShugoProfileHtmlToDomain(
        html,
        serverSlug,
        shugoServerId,
        cleanName,
        fullLeaderboard,
        profileUrl
      );

      if (parsed) {
        this.characterProfileCache.set(cacheKey, {
          profile: parsed,
          expiresAt: Date.now() + CHAR_PROFILE_CACHE_TTL_MS,
        });
        return parsed;
      }
    } catch {
      // Fallback to Leaderboard snapshot below if CORS proxy was rate-limited
    }

    // Zero-CORS Fallback: If character is in the 1,723-player Azphel Leaderboard snapshot, build profile directly!
    const lbMatch = fullLeaderboard.find(
      (e) => e.name.toLowerCase() === cleanName.toLowerCase()
    );
    if (lbMatch) {
      const fallbackProfile: ShugoCharacterProfile = {
        characterName: lbMatch.name,
        serverName: serverSlug.toUpperCase(),
        serverSlug,
        shugoServerId,
        className: lbMatch.className,
        raceName: lbMatch.raceName,
        level: lbMatch.level,
        combatPower: lbMatch.combatPower,
        gearScore: lbMatch.gearScore,
        titleName: `Ranked #${lbMatch.rankByCp} CP / #${lbMatch.rankByGs} GS`,
        rankByCp: lbMatch.rankByCp,
        rankByGs: lbMatch.rankByGs,
        totalClassRanked: fullLeaderboard.length,
        stats: [
          { name: 'CombatPower', value: lbMatch.combatPower },
          { name: 'ItemLevel (GS)', value: lbMatch.gearScore },
          {
            name: 'CP/GS Ratio',
            value:
              lbMatch.gearScore > 0
                ? (lbMatch.combatPower / lbMatch.gearScore).toFixed(1)
                : '0',
          },
        ],
        equipment: [],
        recommendations: buildCharacterRecommendations(
          lbMatch.combatPower,
          lbMatch.gearScore,
          [],
          []
        ),
        fetchedAt: new Date().toISOString(),
        profileUrl,
      };
      this.characterProfileCache.set(cacheKey, {
        profile: fallbackProfile,
        expiresAt: Date.now() + CHAR_PROFILE_CACHE_TTL_MS,
      });
      return fallbackProfile;
    }

    throw new Error(
      `No se encontró el perfil de "${cleanName}" en Shugo.gg (${serverSlug}) ni en el Leaderboard de ${fullLeaderboard.length} jugadores. Verifica el nombre exacto y el servidor.`
    );
  }

  // ==========================================================================
  // MARKET & CATALOG REPOSITORIES
  // ==========================================================================
  public async getAllMarketItems(): Promise<readonly MarketItem[]> {
    await this.initializeDatabaseIfNeeded();
    return dbInstance.marketItems.toArray();
  }

  public async getMarketItem(
    itemId: number,
    fallbackNameEn?: string
  ): Promise<MarketItem | null> {
    await this.initializeDatabaseIfNeeded();
    const byKey = await dbInstance.marketItems.get(itemId);
    if (byKey) return byKey;

    if (fallbackNameEn) {
      const lower = fallbackNameEn.toLowerCase();
      const all = await dbInstance.marketItems.toArray();
      const found = all.find((it) => it.nameEn.toLowerCase() === lower);
      if (found) return found;
    }
    return null;
  }

  public async updateCustomItemPrice(
    itemKey: number,
    newPriceKinah: number
  ): Promise<void> {
    await this.initializeDatabaseIfNeeded();
    const existing = await dbInstance.marketItems.get(itemKey);
    if (existing) {
      await dbInstance.marketItems.put({
        ...existing,
        price: Math.max(0, Math.round(newPriceKinah)),
        capturedAt: new Date().toISOString(),
        isCustomOverride: true,
      });
    }
  }

  public async refreshLiveMarketPrices(
    serverId: number = ENDPOINTS_CONFIG.defaultServerId
  ): Promise<{
    readonly updatedCount: number;
    readonly source: 'LIVE_API' | 'STATIC_FALLBACK';
    readonly timestamp: string;
  }> {
    await this.initializeDatabaseIfNeeded();

    // Rate-Limit Cooldown Guard (60s per server) so free proxies are never spammed
    const lastRefresh = this.lastMarketRefreshByServer.get(serverId) ?? 0;
    if (Date.now() - lastRefresh < MARKET_REFRESH_COOLDOWN_MS) {
      const currentCount = await dbInstance.marketItems.count();
      const syncMeta = await dbInstance.meta.get(META_LAST_SYNC_KEY);
      if (currentCount > 50) {
        return {
          updatedCount: currentCount,
          source: 'LIVE_API',
          timestamp: syncMeta?.value ?? new Date().toISOString(),
        };
      }
    }

    const targetUrl = ENDPOINTS_CONFIG.liveApi.exchangeItemsUrl(serverId, 1000);

    const catalogAll = await dbInstance.catalogItems.toArray();
    const esNameMap = new Map<number, string>();
    for (const c of catalogAll) {
      esNameMap.set(c.id, c.nameEs);
    }

    const candidateUrls: string[] = [
      targetUrl,
      ...ENDPOINTS_CONFIG.liveApi.corsProxies.map((proxyFn) => proxyFn(targetUrl)),
    ];

    for (const url of candidateUrls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 9000);
        const res = await fetch(url, { signal: controller.signal, cache: 'no-store' });
        clearTimeout(timeoutId);

        if (!res.ok) continue;
        const rawText = await res.text();
        const unwrappedText = this.unwrapProxyResponseText(rawText);
        const jsonRaw = JSON.parse(unwrappedText) as unknown;
        const dtos = adaptExchangePayloadToDtoArray(jsonRaw);
        if (dtos.length < 50) continue;

        const mappedItems: MarketItem[] = [];
        for (const dto of dtos) {
          const item = mapExchangeDtoToMarketItem(dto, esNameMap);
          if (item) {
            mappedItems.push(item);
          }
        }

        if (mappedItems.length > 50) {
          const nowIso = new Date().toISOString();
          this.lastMarketRefreshByServer.set(serverId, Date.now());
          await dbInstance.transaction(
            'rw',
            [dbInstance.marketItems, dbInstance.meta],
            async () => {
              await dbInstance.marketItems.clear();
              await dbInstance.marketItems.bulkPut(mappedItems);
              await dbInstance.meta.put({ key: META_LAST_SYNC_KEY, value: nowIso });
              await dbInstance.meta.put({ key: META_SYNC_SOURCE_KEY, value: 'LIVE_API' });
            }
          );

          return {
            updatedCount: mappedItems.length,
            source: 'LIVE_API',
            timestamp: nowIso,
          };
        }
      } catch {
        // Continúa con el siguiente proxy CORS si falla
      }
    }

    const stats = await this.reseedFromStaticFiles();
    return {
      updatedCount: stats.marketItemsCount,
      source: 'STATIC_FALLBACK',
      timestamp: stats.lastSyncedAt ?? new Date().toISOString(),
    };
  }

  public async searchCatalogItems(
    query: string,
    limit = 80
  ): Promise<readonly CatalogItem[]> {
    await this.initializeDatabaseIfNeeded();
    const trimmed = query.trim().toLowerCase();
    const all = await dbInstance.catalogItems.toArray();
    if (!trimmed) {
      return all.slice(0, limit);
    }
    const matches: CatalogItem[] = [];
    for (const item of all) {
      if (
        item.nameEs.toLowerCase().includes(trimmed) ||
        item.nameEn.toLowerCase().includes(trimmed) ||
        String(item.id).includes(trimmed)
      ) {
        matches.push(item);
        if (matches.length >= limit) break;
      }
    }
    return matches;
  }

  public async getAllVendorMaterials(): Promise<readonly NpcVendorMaterial[]> {
    await this.initializeDatabaseIfNeeded();
    return dbInstance.vendorMaterials.orderBy('vendorPriceKinah').toArray();
  }

  public async searchSubstanceMorphRecipes(
    query: string,
    limit = 60
  ): Promise<readonly SubstanceMorphRecipe[]> {
    await this.initializeDatabaseIfNeeded();
    const trimmed = query.trim().toLowerCase();
    const all = await dbInstance.morphRecipes.toArray();
    if (!trimmed) {
      return all.slice(0, limit);
    }
    return all
      .filter(
        (r) =>
          r.nameEs.toLowerCase().includes(trimmed) ||
          r.nameEn.toLowerCase().includes(trimmed) ||
          r.category.toLowerCase().includes(trimmed) ||
          r.materials.some((m) => m.name.toLowerCase().includes(trimmed))
      )
      .slice(0, limit);
  }

  // ==========================================================================
  // RECIPES AUDITOR (FEATURED META + ALL 240+ CLIENT RECIPES)
  // ==========================================================================
  public async getRecipes(
    category: CraftingCategory = 'All',
    scope: RecipeFilterScope = 'FEATURED_META'
  ): Promise<readonly VerifiedRecipe[]> {
    await this.initializeDatabaseIfNeeded();
    const all = await dbInstance.clientRecipes.toArray();
    const baseList = all.length > 0 ? all : VERIFIED_RECIPES_SEED;

    const scoped =
      scope === 'FEATURED_META'
        ? baseList.filter((r) => Boolean(r.isFeatured))
        : baseList;

    if (category === 'All') {
      return scoped;
    }
    if (category === 'Balaur') {
      return scoped.filter((r) => r.category === 'Balaur' || Boolean(r.isBalaur));
    }
    if (category === 'Molienda') {
      return scoped.filter((r) => r.category === 'Molienda' || Boolean(r.isMolienda));
    }
    if (category === 'Vinculados') {
      return scoped.filter(
        (r) => r.category === 'Vinculados' || Boolean(r.hasBoundInput)
      );
    }
    return scoped.filter((r) => r.category === category);
  }

  public async evaluateRecipes(
    category: CraftingCategory = 'All',
    scope: RecipeFilterScope = 'FEATURED_META'
  ): Promise<readonly EvaluatedRecipeAudit[]> {
    await this.initializeDatabaseIfNeeded();
    const [allMarketItems, recipes] = await Promise.all([
      dbInstance.marketItems.toArray(),
      this.getRecipes(category, scope),
    ]);

    const byId = new Map<number, MarketItem>();
    const byName = new Map<string, MarketItem>();
    for (const m of allMarketItems) {
      byId.set(m.itemKey, m);
      byName.set(m.nameEn.toLowerCase(), m);
    }

    const findMarketItem = (id: number, nameEn: string): MarketItem | undefined => {
      const cleanName = nameEn.replace(/\s*\(Bulk x30\)/i, '').trim().toLowerCase();
      return byId.get(id) ?? byName.get(cleanName);
    };

    const retention = ENDPOINTS_CONFIG.brokerTax.netRetentionMultiplier;

    return recipes.map((recipe): EvaluatedRecipeAudit => {
      let npcFixedCost = 0;
      let brokerMaterialsCost = 0;
      let boundMaterialsMarketValue = 0;
      const ingredientBreakdown: EvaluatedIngredientLine[] = [];

      for (const ing of recipe.ingredients) {
        if (ing.sourceType === 'NPC') {
          const unitPrice = ing.fixedNpcPrice ?? 1200;
          const subtotal = unitPrice * ing.quantity;
          npcFixedCost += subtotal;
          ingredientBreakdown.push({
            itemId: ing.itemId,
            nameEn: ing.nameEn,
            nameEs: ing.nameEs,
            quantity: ing.quantity,
            sourceType: 'NPC',
            unitPriceKinah: unitPrice,
            subtotalKinah: subtotal,
          });
        } else if (ing.sourceType === 'BOUND') {
          const mkt = findMarketItem(ing.itemId, ing.nameEn);
          const unitPrice = mkt?.price ?? 0;
          const subtotal = unitPrice * ing.quantity;
          boundMaterialsMarketValue += subtotal;
          ingredientBreakdown.push({
            itemId: ing.itemId,
            nameEn: ing.nameEn,
            nameEs: ing.nameEs,
            quantity: ing.quantity,
            sourceType: 'BOUND',
            unitPriceKinah: unitPrice,
            subtotalKinah: subtotal,
          });
        } else {
          const mkt = findMarketItem(ing.itemId, ing.nameEn);
          const unitPrice = mkt?.price ?? 0;
          const subtotal = unitPrice * ing.quantity;
          brokerMaterialsCost += subtotal;
          ingredientBreakdown.push({
            itemId: ing.itemId,
            nameEn: ing.nameEn,
            nameEs: ing.nameEs,
            quantity: ing.quantity,
            sourceType: 'BROKER',
            unitPriceKinah: unitPrice,
            subtotalKinah: subtotal,
          });
        }
      }

      const prodMkt = findMarketItem(recipe.productId, recipe.nameEn);
      const unitBrokerPrice = prodMkt?.price ?? 0;
      const activeListings = prodMkt?.listings ?? 0;

      let comboBrokerPrice = 0;
      if (recipe.comboProductId && recipe.comboNameEn) {
        const comboMkt = findMarketItem(recipe.comboProductId, recipe.comboNameEn);
        comboBrokerPrice = comboMkt?.price ?? 0;
      }

      const baseNetSale90 = unitBrokerPrice * recipe.productQuantity * retention;
      const netSaleIfSuccess =
        recipe.comboRate && recipe.comboRate > 0 && comboBrokerPrice > 0
          ? (1 - recipe.comboRate) * baseNetSale90 +
            recipe.comboRate * (comboBrokerPrice * recipe.productQuantity * retention)
          : baseNetSale90;

      const expectedNetRevenuePerAttempt90 = netSaleIfSuccess * recipe.baseSuccessRate;

      const totalDirectAttemptCost =
        npcFixedCost + brokerMaterialsCost + boundMaterialsMarketValue;
      const expectedCostAdjustedForFailure =
        recipe.baseSuccessRate > 0
          ? totalDirectAttemptCost / recipe.baseSuccessRate
          : totalDirectAttemptCost;

      const netProfitBuyingAll = expectedNetRevenuePerAttempt90 - totalDirectAttemptCost;
      const roiBuyingAllPct =
        totalDirectAttemptCost > 0
          ? (netProfitBuyingAll / totalDirectAttemptCost) * 100
          : 0;

      const opportunityCostRawSales90 = brokerMaterialsCost * retention;
      const valueAddedWithOwnMats =
        expectedNetRevenuePerAttempt90 - npcFixedCost - opportunityCostRawSales90;

      const outOfPocketBoundCost = npcFixedCost + brokerMaterialsCost;
      const profitWithBoundMats = expectedNetRevenuePerAttempt90 - outOfPocketBoundCost;
      const roiWithBoundMatsPct =
        outOfPocketBoundCost > 0
          ? (profitWithBoundMats / outOfPocketBoundCost) * 100
          : 0;

      const breakevenUnitPrice =
        recipe.baseSuccessRate > 0 && recipe.productQuantity > 0
          ? totalDirectAttemptCost /
            (recipe.baseSuccessRate * recipe.productQuantity * retention)
          : 0;

      let verdict: RecipeVerdict = 'LOW_MARGIN';
      if (
        (recipe.category === 'Vinculados' || recipe.hasBoundInput) &&
        profitWithBoundMats > 10000
      ) {
        verdict = 'BOUND_GOLDMINE';
      } else if (netProfitBuyingAll > 1500 && valueAddedWithOwnMats > 1500) {
        verdict = 'PROFITABLE_BOTH';
      } else if (valueAddedWithOwnMats < 0) {
        verdict = 'DESTROYS_VALUE';
      }

      return {
        recipe,
        unitBrokerPrice,
        comboBrokerPrice,
        activeListings,
        npcFixedCost,
        brokerMaterialsCost,
        boundMaterialsMarketValue,
        totalDirectAttemptCost,
        expectedCostAdjustedForFailure,
        expectedNetRevenuePerAttempt90,
        netProfitBuyingAll,
        roiBuyingAllPct,
        opportunityCostRawSales90,
        valueAddedWithOwnMats,
        profitWithBoundMats,
        roiWithBoundMatsPct,
        breakevenUnitPrice,
        verdict,
        ingredientBreakdown,
      };
    });
  }
}

export const aion2Repository = new Aion2UnifiedRepository();
