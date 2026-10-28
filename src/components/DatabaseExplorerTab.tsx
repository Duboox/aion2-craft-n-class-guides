'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { ENDPOINTS_CONFIG } from '../config/endpoints.config';
import type {
  CatalogItem,
  Locale,
  MarketItem,
  NpcVendorMaterial,
  SubstanceMorphRecipe,
} from '../domain/models/types';
import { aion2Repository } from '../infrastructure/repositories/aion2.repository';

interface DatabaseExplorerTabProps {
  readonly locale: Locale;
  readonly refreshTrigger: number;
  readonly onPriceUpdated: () => Promise<void>;
}

type ExplorerSubTab = 'MARKET' | 'CATALOG' | 'VENDOR' | 'MORPH';

export const DatabaseExplorerTab: React.FC<DatabaseExplorerTabProps> = ({
  locale,
  refreshTrigger,
  onPriceUpdated,
}) => {
  const [subTab, setSubTab] = useState<ExplorerSubTab>('MARKET');
  const [query, setQuery] = useState<string>('');
  const [marketItems, setMarketItems] = useState<readonly MarketItem[]>([]);
  const [catalogItems, setCatalogItems] = useState<readonly CatalogItem[]>([]);
  const [vendorItems, setVendorItems] = useState<readonly NpcVendorMaterial[]>([]);
  const [morphItems, setMorphItems] = useState<readonly SubstanceMorphRecipe[]>([]);
  const [customPriceMap, setCustomPriceMap] = useState<Record<number, string>>({});

  const loadExplorerData = useCallback(async (): Promise<void> => {
    const [mkt, cat, vnd, mrp] = await Promise.all([
      aion2Repository.getAllMarketItems(),
      aion2Repository.searchCatalogItems(query, 100),
      aion2Repository.getAllVendorMaterials(),
      aion2Repository.searchSubstanceMorphRecipes(query, 80),
    ]);
    setMarketItems(mkt);
    setCatalogItems(cat);
    setVendorItems(vnd);
    setMorphItems(mrp);
  }, [query]);

  useEffect(() => {
    void loadExplorerData();
  }, [loadExplorerData, refreshTrigger]);

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
    .slice(0, 100);

  const handleSavePrice = async (itemKey: number): Promise<void> => {
    const raw = customPriceMap[itemKey];
    if (raw === undefined) return;
    const num = Number(raw);
    if (!Number.isFinite(num) || num < 0) return;
    await aion2Repository.updateCustomItemPrice(itemKey, num);
    await loadExplorerData();
    await onPriceUpdated();
  };

  return (
    <div className="space-y-6">
      <div className="aion-card rounded-2xl p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSubTab('MARKET')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition ${
                subTab === 'MARKET'
                  ? 'bg-[#d9b36c] text-[#0b0e14] border-[#d9b36c]'
                  : 'bg-[#0b0e14] text-slate-300 border-[#263042] hover:text-white'
              }`}
            >
              📈 {locale === 'es' ? 'Precios Broker' : 'Broker Prices'} (
              {marketItems.length})
            </button>
            <button
              type="button"
              onClick={() => setSubTab('VENDOR')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition ${
                subTab === 'VENDOR'
                  ? 'bg-[#d9b36c] text-[#0b0e14] border-[#d9b36c]'
                  : 'bg-[#0b0e14] text-slate-300 border-[#263042] hover:text-white'
              }`}
            >
              🏪 {locale === 'es' ? 'Materiales PNJ Fijos (33)' : 'Fixed NPC Vendors (33)'}
            </button>
            <button
              type="button"
              onClick={() => setSubTab('CATALOG')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition ${
                subTab === 'CATALOG'
                  ? 'bg-[#d9b36c] text-[#0b0e14] border-[#d9b36c]'
                  : 'bg-[#0b0e14] text-slate-300 border-[#263042] hover:text-white'
              }`}
            >
              📖 {locale === 'es' ? 'Catálogo Oficial (6.637)' : 'Official Catalog (6,637)'}
            </button>
            <button
              type="button"
              onClick={() => setSubTab('MORPH')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition ${
                subTab === 'MORPH'
                  ? 'bg-[#d9b36c] text-[#0b0e14] border-[#d9b36c]'
                  : 'bg-[#0b0e14] text-slate-300 border-[#263042] hover:text-white'
              }`}
            >
              ⚗️ {locale === 'es' ? 'Transmutación (163)' : 'Substance Morphs (163)'}
            </button>
          </div>

          <a
            href={
              locale === 'es'
                ? ENDPOINTS_CONFIG.externalReferenceLinks.shugoDatabaseEs
                : ENDPOINTS_CONFIG.externalReferenceLinks.shugoDatabaseEn
            }
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-[#1b2230] hover:bg-[#263042] text-[#f0d59a] border border-[#d9b36c]/40 text-xs font-bold self-start transition"
          >
            🌐 {locale === 'es' ? 'Base de Datos Shugo.gg (ES)' : 'Shugo.gg Database (EN)'} ↗
          </a>
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            locale === 'es'
              ? 'Filtrar en tiempo real dentro de IndexedDB por nombre o ID...'
              : 'Live filter inside IndexedDB by name or ID...'
          }
          className="w-full px-4 py-2.5 rounded-xl bg-[#0b0e14] border border-[#263042] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#d9b36c]"
        />
      </div>

      {/* SubTab 1: Market Prices — Single Dynamic Name Column */}
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

      {/* SubTab 2: NPC Vendor Prices — Single Dynamic Name Column */}
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

      {/* SubTab 3: 6,637 Official Catalog — Single Dynamic Name Column */}
      {subTab === 'CATALOG' && (
        <div className="aion-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0b0e14] border-b border-[#263042] text-[11px] uppercase tracking-wider text-[#9aa6bc]">
                  <th className="py-3.5 px-4">Client Item ID</th>
                  <th className="py-3.5 px-4">
                    {locale === 'es'
                      ? 'Nombre Oficial (Español)'
                      : 'Official Name (English)'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263042]/60 text-sm">
                {catalogItems.map((c) => {
                  const displayName = locale === 'es' ? c.nameEs : c.nameEn;
                  return (
                    <tr key={c.id} className="hover:bg-[#1b2230]/70 transition">
                      <td className="py-3 px-4 font-mono text-xs text-[#9aa6bc]">
                        {c.id}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-100">
                        {displayName}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SubTab 4: 163 Substance Morphs — Single Dynamic Name Column */}
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
