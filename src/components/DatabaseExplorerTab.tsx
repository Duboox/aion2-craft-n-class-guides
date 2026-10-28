'use client';

import React, { useEffect, useState } from 'react';
import type {
  CatalogItem,
  Locale,
  MarketItem,
  NpcVendorMaterial,
  SubstanceMorphRecipe,
} from '../domain/models/types';
import { aion2Repository } from '../infrastructure/repositories/aion2.repository';

export interface DatabaseExplorerTabProps {
  readonly locale: Locale;
  readonly marketItems: readonly MarketItem[];
  readonly vendorMaterials: readonly NpcVendorMaterial[];
  readonly onUpdateCustomPrice: (itemKey: number, newPrice: number) => Promise<void>;
}

type ExplorerSubTab = 'MARKET' | 'VENDOR' | 'CATALOG' | 'MORPH';

export const DatabaseExplorerTab: React.FC<DatabaseExplorerTabProps> = ({
  locale,
  marketItems,
  vendorMaterials,
  onUpdateCustomPrice,
}) => {
  const [subTab, setSubTab] = useState<ExplorerSubTab>('MARKET');
  const [query, setQuery] = useState<string>('');
  const [catalogResults, setCatalogResults] = useState<readonly CatalogItem[]>([]);
  const [morphResults, setMorphResults] = useState<readonly SubstanceMorphRecipe[]>([]);
  const [editingPriceMap, setEditingPriceMap] = useState<Readonly<Record<number, string>>>({});

  useEffect(() => {
    let active = true;
    const load = async (): Promise<void> => {
      if (subTab === 'CATALOG') {
        const res = await aion2Repository.searchCatalogItems(query, 100);
        if (active) setCatalogResults(res);
      } else if (subTab === 'MORPH') {
        const res = await aion2Repository.searchSubstanceMorphRecipes(query, 80);
        if (active) setMorphResults(res);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [subTab, query]);

  const filteredMarket = marketItems
    .filter((item) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        item.nameEs.toLowerCase().includes(q) ||
        item.nameEn.toLowerCase().includes(q) ||
        item.categoryName.toLowerCase().includes(q) ||
        String(item.itemKey).includes(q)
      );
    })
    .slice(0, 120);

  const filteredVendors = vendorMaterials.filter((v) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      v.nameEs.toLowerCase().includes(q) ||
      v.nameEn.toLowerCase().includes(q) ||
      String(v.id).includes(q)
    );
  });

  const handleSavePrice = async (itemKey: number): Promise<void> => {
    const raw = editingPriceMap[itemKey];
    if (raw === undefined) return;
    const num = Number.parseFloat(raw);
    if (Number.isFinite(num) && num >= 0) {
      await onUpdateCustomPrice(itemKey, num);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSubTab('MARKET')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer ${
              subTab === 'MARKET'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {locale === 'es'
              ? `📈 Mercado Azphel (${marketItems.length})`
              : `📈 Azphel Market (${marketItems.length})`}
          </button>
          <button
            type="button"
            onClick={() => setSubTab('VENDOR')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer ${
              subTab === 'VENDOR'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {locale === 'es'
              ? `🏪 33 Materiales PNJ (${vendorMaterials.length})`
              : `🏪 33 NPC Vendor Mats (${vendorMaterials.length})`}
          </button>
          <button
            type="button"
            onClick={() => setSubTab('CATALOG')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer ${
              subTab === 'CATALOG'
                ? 'bg-sky-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {locale === 'es'
              ? '🌐 Diccionario 6.637 Ítems (EN ⇄ ES)'
              : '🌐 6,637 Items Dictionary (EN ⇄ ES)'}
          </button>
          <button
            type="button"
            onClick={() => setSubTab('MORPH')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer ${
              subTab === 'MORPH'
                ? 'bg-purple-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {locale === 'es'
              ? '🔮 163 Transmutaciones (Substance Morph)'
              : '🔮 163 Substance Morphs'}
          </button>
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            locale === 'es'
              ? 'Buscar por nombre ES, EN o ID en IndexedDB...'
              : 'Search by ES name, EN name, or ID in IndexedDB...'
          }
          className="w-full sm:w-80 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
        />
      </div>

      {subTab === 'MARKET' && (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase">
              <tr>
                <th className="px-4 py-3">ID Cliente</th>
                <th className="px-4 py-3">Nombre Español (ES)</th>
                <th className="px-4 py-3">Nombre Inglés (EN)</th>
                <th className="px-3 py-3">Categoría</th>
                <th className="px-3 py-3 text-right">Listings</th>
                <th className="px-4 py-3 text-right">Precio Broker (Editable)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filteredMarket.map((item) => (
                <tr key={item.itemKey} className="hover:bg-slate-800/40">
                  <td className="px-4 py-2.5 font-mono text-slate-400">{item.itemKey}</td>
                  <td className="px-4 py-2.5 font-semibold text-white">{item.nameEs}</td>
                  <td className="px-4 py-2.5 text-slate-300">{item.nameEn}</td>
                  <td className="px-3 py-2.5 text-sky-400">{item.categoryName}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-slate-300">
                    {item.listings}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <input
                        type="number"
                        value={editingPriceMap[item.itemKey] ?? String(item.price)}
                        onChange={(e) =>
                          setEditingPriceMap((prev) => ({
                            ...prev,
                            [item.itemKey]: e.target.value,
                          }))
                        }
                        className="w-28 rounded border border-slate-700 bg-slate-950 px-2 py-1 text-right font-mono text-xs text-emerald-300"
                      />
                      <button
                        type="button"
                        onClick={() => void handleSavePrice(item.itemKey)}
                        className="rounded bg-emerald-700 hover:bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white cursor-pointer"
                      >
                        OK
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {subTab === 'VENDOR' && (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase">
              <tr>
                <th className="px-4 py-3">ID Cliente</th>
                <th className="px-4 py-3">Nombre Oficial Español (ES)</th>
                <th className="px-4 py-3">Nombre Oficial Inglés (EN)</th>
                <th className="px-4 py-3 text-right">Precio Fijo PNJ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filteredVendors.map((v) => (
                <tr key={v.id} className="hover:bg-slate-800/40">
                  <td className="px-4 py-2.5 font-mono text-slate-400">{v.id}</td>
                  <td className="px-4 py-2.5 font-bold text-amber-300">{v.nameEs}</td>
                  <td className="px-4 py-2.5 text-slate-200">{v.nameEn}</td>
                  <td className="px-4 py-2.5 text-right font-mono font-bold text-emerald-400">
                    {v.vendorPriceKinah.toLocaleString()} Kinah
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {subTab === 'CATALOG' && (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase">
              <tr>
                <th className="px-4 py-3">ID Cliente (aion2.gg)</th>
                <th className="px-4 py-3">Español Oficial (ES)</th>
                <th className="px-4 py-3">Inglés Oficial (EN)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {catalogResults.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40">
                  <td className="px-4 py-2.5 font-mono text-slate-400">{c.id}</td>
                  <td className="px-4 py-2.5 font-semibold text-white">{c.nameEs}</td>
                  <td className="px-4 py-2.5 text-sky-300">{c.nameEn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {subTab === 'MORPH' && (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase">
              <tr>
                <th className="px-4 py-3">ID Receta</th>
                <th className="px-4 py-3">Resultado (Substance Morph)</th>
                <th className="px-3 py-3 text-center">Cantidad</th>
                <th className="px-4 py-3">Materiales Requeridos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {morphResults.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/40">
                  <td className="px-4 py-2.5 font-mono text-slate-400">{m.id}</td>
                  <td className="px-4 py-2.5 font-bold text-purple-300">{m.nameEn}</td>
                  <td className="px-3 py-2.5 text-center font-mono text-white">
                    x{m.outputCount}
                  </td>
                  <td className="px-4 py-2.5 text-slate-300">
                    {m.materials.map((mat) => `${mat.count}x ${mat.name}`).join(' + ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
