'use client';

import React, { useMemo, useState } from 'react';
import type {
  CraftingCategory,
  EvaluatedRecipeAudit,
  Locale,
  RecipeVerdict,
} from '../domain/models/types';
import { TRANSLATIONS } from '../i18n/translations';

export interface CraftingAuditorDashboardProps {
  readonly locale: Locale;
  readonly audits: readonly EvaluatedRecipeAudit[];
  readonly onUpdateCustomPrice: (itemKey: number, newPrice: number) => Promise<void>;
}

const CATEGORIES: readonly { readonly id: CraftingCategory; readonly labelEs: string; readonly labelEn: string }[] = [
  { id: 'All', labelEs: 'Todas (16)', labelEn: 'All (16)' },
  { id: 'Molienda', labelEs: '🌾 Molienda 100% Éxito', labelEn: '🌾 100% Milling' },
  { id: 'Balaur', labelEs: '🐉 Materiales Balaur', labelEn: '🐉 Balaur Materials' },
  { id: 'Vinculados', labelEs: '💎 Conversión Bound (20% Proc)', labelEn: '💎 Bound Conversion (20% Proc)' },
  { id: 'Cocina', labelEs: '🍖 Cocina', labelEn: '🍖 Cooking' },
  { id: 'Alquimia', labelEs: '🧪 Alquimia (Pergaminos/Elixires)', labelEn: '🧪 Alchemy (Scrolls/Serums)' },
  { id: 'Orfebreria', labelEs: '💍 Orfebrería (Anillo Zafiro)', labelEn: '💍 Handicrafting (Sapphire Ring)' },
];

export const CraftingAuditorDashboard: React.FC<CraftingAuditorDashboardProps> = ({
  locale,
  audits,
  onUpdateCustomPrice,
}) => {
  const t = TRANSLATIONS[locale];
  const [selectedCategory, setSelectedCategory] = useState<CraftingCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [batchSize, setBatchSize] = useState<number>(1);
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>('315021005_30');
  const [editingPriceMap, setEditingPriceMap] = useState<Readonly<Record<number, string>>>({});

  const filteredAudits = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return audits.filter((a) => {
      if (selectedCategory !== 'All' && a.recipe.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      return (
        a.recipe.nameEs.toLowerCase().includes(q) ||
        a.recipe.nameEn.toLowerCase().includes(q) ||
        a.recipe.professionEs.toLowerCase().includes(q) ||
        a.ingredientBreakdown.some(
          (ing) =>
            ing.nameEs.toLowerCase().includes(q) || ing.nameEn.toLowerCase().includes(q)
        )
      );
    });
  }, [audits, selectedCategory, searchQuery]);

  const renderVerdictBadge = (verdict: RecipeVerdict): React.ReactNode => {
    switch (verdict) {
      case 'PROFITABLE_BOTH':
        return (
          <span className="inline-block rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1 text-xs font-bold text-emerald-300">
            ✅ {t.verdictProfitable}
          </span>
        );
      case 'BOUND_GOLDMINE':
        return (
          <span className="inline-block rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 text-xs font-bold text-amber-300">
            💎 {t.verdictGoldmine}
          </span>
        );
      case 'DESTROYS_VALUE':
        return (
          <span className="inline-block rounded-full bg-rose-500/20 border border-rose-500/40 px-2.5 py-1 text-xs font-bold text-rose-300">
            🛑 {t.verdictDestroys}
          </span>
        );
      default:
        return (
          <span className="inline-block rounded-full bg-slate-700/50 border border-slate-600 px-2.5 py-1 text-xs font-semibold text-slate-300">
            ⚠️ {t.verdictLow}
          </span>
        );
    }
  };

  const handlePriceInputCommit = async (itemKey: number): Promise<void> => {
    const rawVal = editingPriceMap[itemKey];
    if (rawVal === undefined) return;
    const parsed = Number.parseFloat(rawVal);
    if (Number.isFinite(parsed) && parsed >= 0) {
      await onUpdateCustomPrice(itemKey, parsed);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner de Fórmula de Coste de Oportunidad */}
      <div className="rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 p-4">
        <h3 className="text-sm font-bold text-amber-300">{t.formulaBannerTitle}</h3>
        <p className="mt-1 text-xs text-slate-300 leading-relaxed">{t.formulaBannerDesc}</p>
      </div>

      {/* Controles de Filtro, Buscador y Multiplicador de Lote */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/70 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {locale === 'es' ? cat.labelEs : cat.labelEn}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full sm:w-72 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
          />

          <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs">
            <span className="text-slate-400">{t.batchLabel}</span>
            {[1, 5, 10, 20].map((mult) => (
              <button
                key={mult}
                type="button"
                onClick={() => setBatchSize(mult)}
                className={`rounded px-2 py-0.5 font-mono font-bold cursor-pointer ${
                  batchSize === mult
                    ? 'bg-sky-500 text-slate-950'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                x{mult}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla Maestra de Auditoría */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80 shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-800 bg-slate-950/90 text-slate-400 uppercase">
            <tr>
              <th className="px-4 py-3">{t.colRecipe}</th>
              <th className="px-3 py-3 text-center">{t.colSuccess}</th>
              <th className="px-3 py-3 text-right">{t.colBrokerPrice}</th>
              <th className="px-3 py-3 text-right">{t.colNpcCost}</th>
              <th className="px-3 py-3 text-right">{t.colAttemptCost}</th>
              <th className="px-3 py-3 text-right">{t.colExpectedNet}</th>
              <th className="px-3 py-3 text-right">{t.colProfitBuyAll}</th>
              <th className="px-3 py-3 text-right">{t.colValueAddedOwn}</th>
              <th className="px-4 py-3 text-center">{t.colVerdict}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {filteredAudits.map((audit) => {
              const isExpanded = expandedRecipeId === audit.recipe.recipeId;
              const profitBuyScaled = Math.round(audit.netProfitBuyingAll * batchSize);
              const valueAddedScaled =
                audit.recipe.category === 'Vinculados'
                  ? Math.round(audit.profitWithBoundMats * batchSize)
                  : Math.round(audit.valueAddedWithOwnMats * batchSize);

              return (
                <React.Fragment key={audit.recipe.recipeId}>
                  <tr
                    onClick={() =>
                      setExpandedRecipeId(isExpanded ? null : audit.recipe.recipeId)
                    }
                    className="hover:bg-slate-800/50 transition cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <div className="font-bold text-white">
                        {locale === 'es' ? audit.recipe.nameEs : audit.recipe.nameEn}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {locale === 'es' ? audit.recipe.nameEn : audit.recipe.nameEs} •{' '}
                        <span className="text-sky-400">
                          {locale === 'es'
                            ? audit.recipe.professionEs
                            : audit.recipe.professionEn}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-3 text-center font-mono">
                      <span
                        className={`rounded px-1.5 py-0.5 font-bold ${
                          audit.recipe.baseSuccessRate >= 1
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : audit.recipe.baseSuccessRate >= 0.95
                              ? 'bg-sky-500/20 text-sky-300'
                              : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {(audit.recipe.baseSuccessRate * 100).toFixed(1)}%
                      </span>
                      {audit.recipe.comboRate && (
                        <div className="mt-1 text-[10px] text-amber-400">
                          +{(audit.recipe.comboRate * 100).toFixed(0)}% Proc
                        </div>
                      )}
                    </td>

                    <td className="px-3 py-3 text-right font-mono">
                      <div className="font-bold text-white">
                        {audit.unitBrokerPrice.toLocaleString()} K
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {audit.activeListings} listings | x{audit.recipe.productQuantity}
                      </div>
                    </td>

                    <td className="px-3 py-3 text-right font-mono text-amber-300">
                      {Math.round(audit.npcFixedCost * batchSize).toLocaleString()} K
                    </td>

                    <td className="px-3 py-3 text-right font-mono text-slate-200">
                      {Math.round(audit.totalDirectAttemptCost * batchSize).toLocaleString()} K
                    </td>

                    <td className="px-3 py-3 text-right font-mono text-sky-300">
                      {Math.round(
                        audit.expectedNetRevenuePerAttempt90 * batchSize
                      ).toLocaleString()}{' '}
                      K
                    </td>

                    <td
                      className={`px-3 py-3 text-right font-mono font-bold ${
                        profitBuyScaled >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      <div>
                        {profitBuyScaled >= 0 ? '+' : ''}
                        {profitBuyScaled.toLocaleString()} K
                      </div>
                      <div className="text-[10px] font-normal">
                        ({audit.roiBuyingAllPct >= 0 ? '+' : ''}
                        {audit.roiBuyingAllPct.toFixed(1)}% ROI)
                      </div>
                    </td>

                    <td
                      className={`px-3 py-3 text-right font-mono font-bold ${
                        valueAddedScaled >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      <div>
                        {valueAddedScaled >= 0 ? '+' : ''}
                        {valueAddedScaled.toLocaleString()} K
                      </div>
                      <div className="text-[10px] font-normal text-slate-400">
                        {audit.recipe.category === 'Vinculados'
                          ? `(+${audit.roiWithBoundMatsPct.toFixed(0)}% vs Bound)`
                          : `(vs ${Math.round(audit.opportunityCostRawSales90 * batchSize).toLocaleString()} K crudo)`}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-center">
                      {renderVerdictBadge(audit.verdict)}
                    </td>
                  </tr>

                  {/* Desglose interactivo de ingredientes y edición de precios en IndexedDB */}
                  {isExpanded && (
                    <tr className="bg-slate-950/90">
                      <td colSpan={9} className="p-4">
                        <div className="grid gap-4 lg:grid-cols-2">
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                              {locale === 'es'
                                ? 'Desglose Exacto de Ingredientes (Editable en IndexedDB)'
                                : 'Exact Client Ingredients Breakdown (Editable in IndexedDB)'}
                            </h4>
                            <div className="divide-y divide-slate-800 rounded-lg border border-slate-800 bg-slate-900/90">
                              {audit.ingredientBreakdown.map((ing) => (
                                <div
                                  key={ing.itemId}
                                  className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-xs"
                                >
                                  <div>
                                    <span className="font-mono font-bold text-amber-300">
                                      {ing.quantity * batchSize}x
                                    </span>{' '}
                                    <span className="font-semibold text-white">
                                      {locale === 'es' ? ing.nameEs : ing.nameEn}
                                    </span>{' '}
                                    <span
                                      className={`ml-1 rounded px-1.5 py-0.5 text-[10px] font-mono ${
                                        ing.sourceType === 'NPC'
                                          ? 'bg-amber-500/20 text-amber-300'
                                          : ing.sourceType === 'BOUND'
                                            ? 'bg-purple-500/20 text-purple-300'
                                            : 'bg-sky-500/20 text-sky-300'
                                      }`}
                                    >
                                      {ing.sourceType}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    {ing.sourceType !== 'NPC' ? (
                                      <div
                                        className="flex items-center gap-1"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <input
                                          type="number"
                                          value={
                                            editingPriceMap[ing.itemId] ??
                                            String(ing.unitPriceKinah)
                                          }
                                          onChange={(e) =>
                                            setEditingPriceMap((prev) => ({
                                              ...prev,
                                              [ing.itemId]: e.target.value,
                                            }))
                                          }
                                          className="w-24 rounded border border-slate-700 bg-slate-950 px-2 py-1 text-right font-mono text-xs text-white"
                                        />
                                        <button
                                          type="button"
                                          onClick={() =>
                                            void handlePriceInputCommit(ing.itemId)
                                          }
                                          className="rounded bg-sky-600 hover:bg-sky-500 px-2 py-1 text-[10px] font-bold text-white cursor-pointer"
                                        >
                                          Guardar
                                        </button>
                                      </div>
                                    ) : (
                                      <span className="font-mono text-amber-300">
                                        {ing.unitPriceKinah.toLocaleString()} K c/u (Fijo PNJ)
                                      </span>
                                    )}
                                    <span className="font-mono font-bold text-slate-200">
                                      = {(ing.subtotalKinah * batchSize).toLocaleString()} K
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col justify-between rounded-lg border border-slate-800 bg-slate-900/90 p-3.5">
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400">
                                {locale === 'es'
                                  ? 'Notas de Auditoría y Precio Breakeven'
                                  : 'Audit Notes & Breakeven Price'}
                              </h4>
                              <p className="mt-2 text-xs text-slate-200 leading-relaxed">
                                {locale === 'es'
                                  ? audit.recipe.notesEs
                                  : audit.recipe.notesEn}
                              </p>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-800 pt-3 text-xs">
                              <div>
                                <span className="text-slate-400">
                                  {locale === 'es'
                                    ? 'Precio Mínimo Breakeven (c/u):'
                                    : 'Breakeven Unit Price:'}
                                </span>
                                <div className="font-mono font-bold text-amber-300">
                                  {Math.round(audit.breakevenUnitPrice).toLocaleString()} Kinah
                                </div>
                              </div>
                              <div>
                                <span className="text-slate-400">
                                  {locale === 'es'
                                    ? 'Editar Precio Venta Producto:'
                                    : 'Edit Product Sell Price:'}
                                </span>
                                <div
                                  className="mt-1 flex items-center gap-1"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <input
                                    type="number"
                                    value={
                                      editingPriceMap[audit.recipe.productId] ??
                                      String(audit.unitBrokerPrice)
                                    }
                                    onChange={(e) =>
                                      setEditingPriceMap((prev) => ({
                                        ...prev,
                                        [audit.recipe.productId]: e.target.value,
                                      }))
                                    }
                                    className="w-28 rounded border border-slate-700 bg-slate-950 px-2 py-1 text-right font-mono text-xs text-white"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      void handlePriceInputCommit(audit.recipe.productId)
                                    }
                                    className="rounded bg-emerald-600 hover:bg-emerald-500 px-2 py-1 text-[10px] font-bold text-white cursor-pointer"
                                  >
                                    OK
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
