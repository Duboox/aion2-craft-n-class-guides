'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ENDPOINTS_CONFIG } from '../config/endpoints.config';
import type {
  Locale,
  MarketItem,
  NpcVendorMaterial,
  SubstanceMorphRecipe,
} from '../domain/models/types';
import {
  type UniversalEntityEntry,
  type UniversalEntityType,
  loadUniversalDatabaseEntities,
} from '../infrastructure/adapters/universalSearchDecoder';
import { aion2Repository } from '../infrastructure/repositories/aion2.repository';

interface DatabaseExplorerTabProps {
  readonly locale: Locale;
  readonly refreshTrigger: number;
  readonly onPriceUpdated: () => Promise<void>;
}

type ExplorerSubTab =
  | 'MARKET'
  | 'VENDOR'
  | 'MORPH'
  | 'ITEMS'
  | 'PETS'
  | 'NPCS'
  | 'DUNGEONS'
  | 'SKILLS'
  | 'QUESTS'
  | 'WINGS_TITLES'
  | 'SKINS'
  | 'COLLECTIONS'
  | 'WORLD_ZONES';

interface EntitySubTabDef {
  readonly id: ExplorerSubTab;
  readonly entityTypes?: readonly UniversalEntityType[];
  readonly labelEs: string;
  readonly labelEn: string;
}

const ENTITY_SUBTABS: readonly [EntitySubTabDef, ...EntitySubTabDef[]] = [
  { id: 'MARKET', labelEs: '📈 Precios Broker (732)', labelEn: '📈 Broker Prices (732)' },
  {
    id: 'ITEMS',
    entityTypes: ['item'],
    labelEs: '📦 Ítems con Icono (6.637)',
    labelEn: '📦 Items with Icon (6,637)',
  },
  {
    id: 'PETS',
    entityTypes: ['vehicle'],
    labelEs: '🐾 Mascotas & Monturas (209)',
    labelEn: '🐾 Pets & Mounts (209)',
  },
  {
    id: 'NPCS',
    entityTypes: ['npc'],
    labelEs: '👹 Jefes & NPCs (4.595)',
    labelEn: '👹 Bosses & NPCs (4,595)',
  },
  {
    id: 'DUNGEONS',
    entityTypes: ['dungeon'],
    labelEs: '🏰 Mazmorras (562)',
    labelEn: '🏰 Dungeons (562)',
  },
  {
    id: 'SKILLS',
    entityTypes: ['skill'],
    labelEs: '⚡ Habilidades (1.236)',
    labelEn: '⚡ Client Skills (1,236)',
  },
  {
    id: 'QUESTS',
    entityTypes: ['quest'],
    labelEs: '📜 Misiones (968)',
    labelEn: '📜 Quests (968)',
  },
  {
    id: 'WINGS_TITLES',
    entityTypes: ['wing', 'title'],
    labelEs: '🪽 Alas (29) & Títulos (995)',
    labelEn: '🪽 Wings (29) & Titles (995)',
  },
  {
    id: 'SKINS',
    entityTypes: ['skin', 'skin_set'],
    labelEs: '👗 Skins & Sets (1.624)',
    labelEn: '👗 Skins & Sets (1,624)',
  },
  {
    id: 'COLLECTIONS',
    entityTypes: ['collection', 'achievement'],
    labelEs: '📚 Colecciones (509) & Logros (863)',
    labelEn: '📚 Collections (509) & Achievements (863)',
  },
  {
    id: 'WORLD_ZONES',
    entityTypes: ['world_object', 'zone'],
    labelEs: '🌿 Nodos (1.777) & Zonas (909)',
    labelEn: '🌿 Nodes (1,777) & Zones (909)',
  },
  { id: 'VENDOR', labelEs: '🏪 Materiales PNJ (33)', labelEn: '🏪 NPC Vendors (33)' },
  {
    id: 'MORPH',
    labelEs: '⚗️ Transmutaciones (163)',
    labelEn: '⚗️ Substance Morphs (163)',
  },
];

export const DatabaseExplorerTab: React.FC<DatabaseExplorerTabProps> = ({
  locale,
  refreshTrigger,
  onPriceUpdated,
}) => {
  const [subTab, setSubTab] = useState<ExplorerSubTab>('ITEMS');
  const [query, setQuery] = useState<string>('');
  const [subTypeFilter, setSubTypeFilter] = useState<string>('ALL');
  const [marketItems, setMarketItems] = useState<readonly MarketItem[]>([]);
  const [vendorItems, setVendorItems] = useState<readonly NpcVendorMaterial[]>([]);
  const [morphItems, setMorphItems] = useState<readonly SubstanceMorphRecipe[]>([]);
  const [universalMap, setUniversalMap] = useState<ReadonlyMap<
    UniversalEntityType,
    readonly UniversalEntityEntry[]
  > | null>(null);
  const [customPriceMap, setCustomPriceMap] = useState<Record<number, string>>({});

  const loadExplorerData = useCallback(async (): Promise<void> => {
    const [mkt, vnd, mrp, uMap] = await Promise.all([
      aion2Repository.getAllMarketItems(),
      aion2Repository.getAllVendorMaterials(),
      aion2Repository.searchSubstanceMorphRecipes(query, 163),
      loadUniversalDatabaseEntities(),
    ]);
    setMarketItems(mkt);
    setVendorItems(vnd);
    setMorphItems(mrp);
    setUniversalMap(uMap);
  }, [query]);

  useEffect(() => {
    void loadExplorerData();
  }, [loadExplorerData, refreshTrigger]);

  const activeTabDef = useMemo(
    () => ENTITY_SUBTABS.find((t) => t.id === subTab) ?? ENTITY_SUBTABS[0],
    [subTab]
  );

  const rawUniversalList = useMemo((): readonly UniversalEntityEntry[] => {
    if (!universalMap || !activeTabDef.entityTypes) return [];
    const combined: UniversalEntityEntry[] = [];
    for (const et of activeTabDef.entityTypes) {
      const list = universalMap.get(et);
      if (list) {
        combined.push(...list);
      }
    }
    return combined;
  }, [universalMap, activeTabDef]);

  const availableSubTypes = useMemo((): readonly string[] => {
    const set = new Set<string>();
    for (const entry of rawUniversalList) {
      const st = locale === 'es' ? entry.subTypeEs : entry.subTypeEn;
      if (st) set.add(st);
    }
    return Array.from(set).sort();
  }, [rawUniversalList, locale]);

  const filteredUniversalList = useMemo((): readonly UniversalEntityEntry[] => {
    const q = query.trim().toLowerCase();
    return rawUniversalList
      .filter((entry) => {
        if (subTypeFilter !== 'ALL') {
          const st = locale === 'es' ? entry.subTypeEs : entry.subTypeEn;
          if (st !== subTypeFilter) return false;
        }
        if (!q) return true;
        return (
          entry.nameEs.toLowerCase().includes(q) ||
          entry.nameEn.toLowerCase().includes(q) ||
          entry.subTypeEs.toLowerCase().includes(q) ||
          entry.subTypeEn.toLowerCase().includes(q) ||
          String(entry.id).includes(q)
        );
      })
      .slice(0, 150);
  }, [rawUniversalList, query, subTypeFilter, locale]);

  const filteredMarket = marketItems
    .filter((it) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      const localizedName = locale === 'es' ? it.nameEs : it.nameEn;
      return (
        localizedName.toLowerCase().includes(q) ||
        it.nameEs.toLowerCase().includes(q) ||
        it.nameEn.toLowerCase().includes(q) ||
        it.categoryName.toLowerCase().includes(q) ||
        String(it.itemKey).includes(q)
      );
    })
    .slice(0, 120);

  const handleSavePrice = async (itemKey: number): Promise<void> => {
    const raw = customPriceMap[itemKey];
    if (raw === undefined) return;
    const num = Number(raw);
    if (!Number.isFinite(num) || num < 0) return;
    await aion2Repository.updateCustomItemPrice(itemKey, num);
    await loadExplorerData();
    await onPriceUpdated();
  };

  const getGradeBadgeClass = (grade: string): string => {
    switch (grade) {
      case 'Mythic':
      case 'Special':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'Epic':
      case 'Unique':
        return 'bg-[#d9b36c]/20 text-[#f0d59a] border-[#d9b36c]/50';
      case 'Legend':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      case 'Rare':
        return 'bg-[#6fd08c]/20 text-[#6fd08c] border-[#6fd08c]/40';
      default:
        return 'bg-[#141a24] text-slate-300 border-[#263042]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Category Selector for All 21,288 Entities */}
      <div className="aion-card-gold rounded-2xl p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-[#f0d59a]">
              🗄️{' '}
              {locale === 'es'
                ? 'Enciclopedia Universal Bilingüe del Cliente (21.288 Registros con Iconos Oficiales)'
                : 'Universal Bilingual Client Encyclopedia (21,288 Records with Official Icons)'}
            </h2>
            <p className="text-xs text-slate-300">
              {locale === 'es'
                ? 'Incluye Ítems (6.637), Mascotas y Monturas (209), Jefes y NPCs (4.595), Mazmorras (562), Habilidades (1.236), Misiones (968), Alas (29), Títulos (995), Skins (1.624), Colecciones (509), Logros (863), Nodos (1.777), Zonas (909), Broker (732) y PNJ (33).'
                : 'Includes Items (6,637), Pets & Mounts (209), Bosses & NPCs (4,595), Dungeons (562), Skills (1,236), Quests (968), Wings (29), Titles (995), Skins (1,624), Collections (509), Achievements (863), Nodes (1,777), Zones (909), Broker (732) & Vendors (33).'}
            </p>
          </div>

          <a
            href={
              locale === 'es'
                ? ENDPOINTS_CONFIG.externalReferenceLinks.shugoDatabaseEs
                : ENDPOINTS_CONFIG.externalReferenceLinks.shugoDatabaseEn
            }
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-[#0b0e14] hover:bg-[#1b2230] text-[#f0d59a] border border-[#d9b36c]/40 text-xs font-bold self-start shrink-0 transition"
          >
            🌐 {locale === 'es' ? 'Base de Datos Shugo.gg (ES)' : 'Shugo.gg Database (EN)'} ↗
          </a>
        </div>

        {/* 13 Category Sub-Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {ENTITY_SUBTABS.map((tab) => {
            const active = subTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setSubTab(tab.id);
                  setSubTypeFilter('ALL');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition ${
                  active
                    ? 'bg-[#d9b36c] text-[#0b0e14] border-[#d9b36c] shadow'
                    : 'bg-[#0b0e14] text-slate-300 border-[#263042] hover:text-white'
                }`}
              >
                {locale === 'es' ? tab.labelEs : tab.labelEn}
              </button>
            );
          })}
        </div>

        {/* Search & Subtype Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3 pt-2 border-t border-[#263042]">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              locale === 'es'
                ? 'Buscar por nombre (ES o EN), subtipo o ID del cliente...'
                : 'Search by name (EN or ES), subtype, or client ID...'
            }
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#0b0e14] border border-[#263042] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#d9b36c]"
          />

          {availableSubTypes.length > 0 && (
            <select
              value={subTypeFilter}
              onChange={(e) => setSubTypeFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-[#0b0e14] border border-[#263042] text-xs font-bold text-[#f0d59a]"
            >
              <option value="ALL">
                {locale === 'es'
                  ? `Todas las Subcategorías (${rawUniversalList.length.toLocaleString()})`
                  : `All Subcategories (${rawUniversalList.length.toLocaleString()})`}
              </option>
              {availableSubTypes.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* =====================================================================
          UNIVERSAL ENTITY TABLE (ITEMS, PETS, NPCS, DUNGEONS, SKILLS, QUESTS, WINGS, TITLES, SKINS, COLLECTIONS, ZONES)
         ===================================================================== */}
      {activeTabDef.entityTypes && (
        <div className="aion-card rounded-2xl overflow-hidden">
          <div className="px-4 py-3 bg-[#0b0e14] border-b border-[#263042] flex items-center justify-between text-xs text-[#9aa6bc]">
            <span>
              {locale === 'es'
                ? `Mostrando primeros ${filteredUniversalList.length} resultados de ${rawUniversalList.length.toLocaleString()} registros en esta categoría`
                : `Showing top ${filteredUniversalList.length} results out of ${rawUniversalList.length.toLocaleString()} records in this category`}
            </span>
            <span className="text-[#f0d59a] font-bold">
              {locale === 'es' ? 'Idioma Activo: Español' : 'Active Language: English'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0b0e14] border-b border-[#263042] text-[11px] uppercase tracking-wider text-[#9aa6bc]">
                  <th className="py-3.5 px-4 w-24">ID</th>
                  <th className="py-3.5 px-4">
                    {locale === 'es' ? 'Nombre (con Icono Oficial)' : 'Name (with Official Icon)'}
                  </th>
                  <th className="py-3.5 px-4">
                    {locale === 'es' ? 'Tipo / Subcategoría' : 'Type / Subcategory'}
                  </th>
                  <th className="py-3.5 px-4 text-center">
                    {locale === 'es' ? 'Grado' : 'Grade'}
                  </th>
                  <th className="py-3.5 px-4 text-right">
                    {locale === 'es' ? 'Nivel' : 'Level'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263042]/60 text-sm">
                {filteredUniversalList.map((entry) => {
                  const primaryName = locale === 'es' ? entry.nameEs : entry.nameEn;
                  const subTypeLabel =
                    locale === 'es' ? entry.subTypeEs : entry.subTypeEn;

                  return (
                    <tr
                      key={`${entry.entityType}_${entry.id}`}
                      className="hover:bg-[#1b2230]/70 transition"
                    >
                      <td className="py-3 px-4 font-mono text-xs text-[#9aa6bc]">
                        {entry.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {entry.iconUrl ? (
                            <img
                              src={entry.iconUrl}
                              alt={primaryName}
                              loading="lazy"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display =
                                  'none';
                              }}
                              className="w-9 h-9 rounded-lg border border-[#263042] bg-[#0b0e14] object-contain shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-lg border border-[#263042] bg-[#0b0e14] flex items-center justify-center text-xs text-[#9aa6bc] shrink-0">
                              #{String(entry.id).slice(-2)}
                            </div>
                          )}
                          <span className="font-bold text-slate-100">{primaryName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-300">
                        {subTypeLabel || entry.entityType.toUpperCase()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${getGradeBadgeClass(
                            entry.grade
                          )}`}
                        >
                          {entry.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-xs text-[#f0d59a]">
                        {entry.level > 0 ? `Lv. ${entry.level}` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          MARKET PRICES SUB-TAB
         ===================================================================== */}
      {subTab === 'MARKET' && (
        <div className="aion-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0b0e14] border-b border-[#263042] text-[11px] uppercase tracking-wider text-[#9aa6bc]">
                  <th className="py-3.5 px-4">ID</th>
                  <th className="py-3.5 px-4">
                    {locale === 'es' ? 'Nombre del Ítem' : 'Item Name'}
                  </th>
                  <th className="py-3.5 px-4">
                    {locale === 'es' ? 'Categoría' : 'Category'}
                  </th>
                  <th className="py-3.5 px-4 text-right">
                    {locale === 'es' ? 'Precio Broker' : 'Broker Price'}
                  </th>
                  <th className="py-3.5 px-4 text-right">Listings</th>
                  <th className="py-3.5 px-4 text-right">
                    {locale === 'es' ? 'Editar Precio Local' : 'Edit Local Price'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263042]/60 text-sm">
                {filteredMarket.map((item) => {
                  const displayName = locale === 'es' ? item.nameEs : item.nameEn;
                  return (
                    <tr
                      key={item.itemKey}
                      className="hover:bg-[#1b2230]/70 transition"
                    >
                      <td className="py-3 px-4 font-mono text-xs text-[#9aa6bc]">
                        {item.itemKey}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-100">
                        {displayName}
                      </td>
                      <td className="py-3 px-4 text-xs text-[#9aa6bc]">
                        {item.categoryName}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-[#6fd08c]">
                        {item.price.toLocaleString()} K
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-xs text-slate-300">
                        {item.listings}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <input
                            type="number"
                            defaultValue={item.price}
                            onChange={(e) =>
                              setCustomPriceMap((prev) => ({
                                ...prev,
                                [item.itemKey]: e.target.value,
                              }))
                            }
                            className="w-24 px-2 py-1 rounded bg-[#0b0e14] border border-[#263042] text-right font-mono text-xs text-slate-100"
                          />
                          <button
                            type="button"
                            onClick={() => void handleSavePrice(item.itemKey)}
                            className="px-2.5 py-1 rounded bg-[#d9b36c] hover:bg-[#f0d59a] text-[#0b0e14] text-xs font-bold"
                          >
                            OK
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          NPC VENDOR MATERIALS SUB-TAB
         ===================================================================== */}
      {subTab === 'VENDOR' && (
        <div className="aion-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0b0e14] border-b border-[#263042] text-[11px] uppercase tracking-wider text-[#9aa6bc]">
                  <th className="py-3.5 px-4">ID</th>
                  <th className="py-3.5 px-4">
                    {locale === 'es' ? 'Material de PNJ' : 'NPC Vendor Material'}
                  </th>
                  <th className="py-3.5 px-4 text-right">
                    {locale === 'es'
                      ? 'Precio Fijo Oficial PNJ (Kinah)'
                      : 'Official Fixed NPC Price (Kinah)'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263042]/60 text-sm">
                {vendorItems
                  .filter((v) => {
                    const q = query.trim().toLowerCase();
                    if (!q) return true;
                    const displayName = locale === 'es' ? v.nameEs : v.nameEn;
                    return (
                      displayName.toLowerCase().includes(q) || String(v.id).includes(q)
                    );
                  })
                  .map((v) => {
                    const displayName = locale === 'es' ? v.nameEs : v.nameEn;
                    return (
                      <tr key={v.id} className="hover:bg-[#1b2230]/70 transition">
                        <td className="py-3 px-4 font-mono text-xs text-[#9aa6bc]">
                          {v.id}
                        </td>
                        <td className="py-3 px-4 font-bold text-[#f0d59a]">
                          {displayName}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-100">
                          {v.vendorPriceKinah.toLocaleString()} Kinah
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          163 SUBSTANCE MORPHS SUB-TAB
         ===================================================================== */}
      {subTab === 'MORPH' && (
        <div className="aion-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0b0e14] border-b border-[#263042] text-[11px] uppercase tracking-wider text-[#9aa6bc]">
                  <th className="py-3.5 px-4">ID</th>
                  <th className="py-3.5 px-4">
                    {locale === 'es' ? 'Resultado de Transmutación' : 'Morph Output'}
                  </th>
                  <th className="py-3.5 px-4">
                    {locale === 'es' ? 'Categoría' : 'Category'}
                  </th>
                  <th className="py-3.5 px-4">
                    {locale === 'es' ? 'Materiales Requeridos' : 'Required Materials'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263042]/60 text-sm">
                {morphItems.map((m) => {
                  const displayName = locale === 'es' ? m.nameEs : m.nameEn;
                  return (
                    <tr key={m.id} className="hover:bg-[#1b2230]/70 transition">
                      <td className="py-3 px-4 font-mono text-xs text-[#9aa6bc]">
                        {m.id}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#f0d59a]">
                        {displayName}{' '}
                        {m.outputCount > 1 && (
                          <span className="text-xs text-[#6fd08c]">×{m.outputCount}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-300">{m.category}</td>
                      <td className="py-3 px-4 text-xs text-slate-300">
                        {m.materials.map((mat) => `${mat.count}× ${mat.name}`).join(' + ')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
