'use client';

import React, { useMemo, useState } from 'react';
import type {
  CraftingCategory,
  EvaluatedRecipeAudit,
  Locale,
  RecipeFilterScope,
} from '../domain/models/types';
import { TRANSLATIONS } from '../i18n/translations';
import { aion2Repository } from '../infrastructure/repositories/aion2.repository';

interface CraftingAuditorDashboardProps {
  readonly locale: Locale;
  readonly audits: readonly EvaluatedRecipeAudit[];
  readonly activeScope: RecipeFilterScope;
  readonly onScopeChange: (newScope: RecipeFilterScope) => void;
  readonly onPriceUpdated: () => Promise<void>;
}

const CATEGORIES: readonly {
  readonly id: CraftingCategory;
  readonly labelEs: string;
  readonly labelEn: string;
}[] = [
  { id: 'All', labelEs: 'Todas', labelEn: 'All' },
  { id: 'Blacksmithing', labelEs: '⚒️ Herrería', labelEn: '⚒️ Blacksmithing' },
  { id: 'Jewelcrafting', labelEs: '💍 Orfebrería', labelEn: '💍 Jewelcrafting' },
  { id: 'Tailoring', labelEs: '🧵 Sastrería / Armaduras', labelEn: '🧵 Tailoring / Armor' },
  { id: 'Alchemy', labelEs: '⚗️ Alquimia', labelEn: '⚗️ Alchemy' },
  { id: 'Cooking', labelEs: '🍖 Cocina', labelEn: '🍖 Cooking' },
  { id: 'Molienda', labelEs: '💎 Molienda', labelEn: '💎 Milling' },
  { id: 'Balaur', labelEs: '🐉 Balaur / Dracónico', labelEn: '🐉 Balaur / Draconic' },
  { id: 'Vinculados', labelEs: '🔒 Vinculados (Bound)', labelEn: '🔒 Bound' },
];

const BATCH_SIZES: readonly number[] = [1, 10, 50, 100];

const matchesCategory = (
  audit: EvaluatedRecipeAudit,
  cat: CraftingCategory
): boolean => {
  if (cat === 'All') return true;
  if (cat === 'Balaur') {
    return audit.recipe.category === 'Balaur' || Boolean(audit.recipe.isBalaur);
  }
  if (cat === 'Molienda') {
    return audit.recipe.category === 'Molienda' || Boolean(audit.recipe.isMolienda);
  }
  if (cat === 'Vinculados') {
    return audit.recipe.category === 'Vinculados' || Boolean(audit.recipe.hasBoundInput);
  }
  return audit.recipe.category === cat;
};

export const CraftingAuditorDashboard: React.FC<CraftingAuditorDashboardProps> = ({
  locale,
  audits,
  activeScope,
  onScopeChange,
  onPriceUpdated,
}) => {
  const t = TRANSLATIONS[locale];
  const [selectedCategory, setSelectedCategory] = useState<CraftingCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [batchSize, setBatchSize] = useState<number>(1);
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>(null);
  const [editingPriceMap, setEditingPriceMap] = useState<Record<number, string>>({});

  const categoryCounts = useMemo((): Readonly<Record<CraftingCategory, number>> => {
    const counts: Record<CraftingCategory, number> = {
      All: audits.length,
      Blacksmithing: 0,
      Jewelcrafting: 0,
      Tailoring: 0,
      Alchemy: 0,
      Cooking: 0,
      Molienda: 0,
      Balaur: 0,
      Vinculados: 0,
    };
    for (const a of audits) {
      if (matchesCategory(a, 'Blacksmithing')) counts.Blacksmithing++;
      if (matchesCategory(a, 'Jewelcrafting')) counts.Jewelcrafting++;
      if (matchesCategory(a, 'Tailoring')) counts.Tailoring++;
      if (matchesCategory(a, 'Alchemy')) counts.Alchemy++;
      if (matchesCategory(a, 'Cooking')) counts.Cooking++;
      if (matchesCategory(a, 'Molienda')) counts.Molienda++;
      if (matchesCategory(a, 'Balaur')) counts.Balaur++;
      if (matchesCategory(a, 'Vinculados')) counts.Vinculados++;
    }
    return counts;
  }, [audits]);

  const filteredAudits = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return audits.filter((audit) => {
      if (!matchesCategory(audit, selectedCategory)) {
        return false;
      }
      if (!q) return true;
      const localizedRecipeName =
        locale === 'es' ? audit.recipe.nameEs : audit.recipe.nameEn;
      return (
        localizedRecipeName.toLowerCase().includes(q) ||
        audit.recipe.nameEs.toLowerCase().includes(q) ||
        audit.recipe.nameEn.toLowerCase().includes(q) ||
        audit.recipe.professionEs.toLowerCase().includes(q) ||
        audit.ingredientBreakdown.some(
          (ing) =>
            ing.nameEs.toLowerCase().includes(q) || ing.nameEn.toLowerCase().includes(q)
        )
      );
    });
  }, [audits, selectedCategory, searchQuery, locale]);

  const handleSaveCustomPrice = async (itemId: number): Promise<void> => {
    const rawVal = editingPriceMap[itemId];
    if (rawVal === undefined) return;
    const numeric = Number(rawVal);
    if (!Number.isFinite(numeric) || numeric < 0) return;
    await aion2Repository.updateCustomItemPrice(itemId, numeric);
    await onPriceUpdated();
  };

  const renderVerdictBadge = (audit: EvaluatedRecipeAudit): React.ReactNode => {
    switch (audit.verdict) {
      case 'PROFITABLE_BOTH':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#6fd08c]/15 text-[#6fd08c] border border-[#6fd08c]/40">
            ✅ {t.verdictProfitable}
          </span>
        );
      case 'BOUND_GOLDMINE':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#d9b36c]/20 text-[#f0d59a] border border-[#d9b36c]/50">
            💎 {t.verdictGoldmine}
          </span>
        );
      case 'DESTROYS_VALUE':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#e5484d]/15 text-rose-300 border border-[#e5484d]/40">
            🛑 {t.verdictDestroys}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#1b2230] text-slate-300 border border-[#263042]">
            ⚖️ {t.verdictLow}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Scope Toggle + Opportunity Cost Callout */}
      <div className="aion-card-gold rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1 max-w-3xl">
          <h3 className="text-sm font-bold text-[#f0d59a] flex items-center gap-2">
            <span>📐</span>
            <span>{t.formulaBannerTitle}</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">{t.formulaBannerDesc}</p>
        </div>

        <div className="flex items-center gap-2 bg-[#0b0e14] p-1.5 rounded-xl border border-[#263042] shrink-0">
          <button
            type="button"
            onClick={() => onScopeChange('ALL_CLIENT')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition ${
              activeScope === 'ALL_CLIENT'
                ? 'bg-[#d9b36c] text-[#0b0e14] shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            {locale === 'es'
              ? '📚 Todas las Recetas del Juego (432)'
              : '📚 All Client Recipes (432)'}
          </button>
          <button
            type="button"
            onClick={() => onScopeChange('FEATURED_META')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition ${
              activeScope === 'FEATURED_META'
                ? 'bg-[#d9b36c] text-[#0b0e14] shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            {locale === 'es' ? '🔥 Solo Meta Destacadas' : '🔥 Featured Meta Only'}
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="aion-card rounded-2xl p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] ?? 0;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  if (activeScope === 'FEATURED_META' && cat.id !== 'All' && count <= 1) {
                    onScopeChange('ALL_CLIENT');
                  }
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                  active
                    ? 'bg-[#d9b36c]/20 text-[#f0d59a] border-[#d9b36c]/60 shadow-sm'
                    : 'bg-[#0b0e14] text-slate-400 border-[#263042] hover:text-slate-200'
                }`}
              >
                {locale === 'es' ? cat.labelEs : cat.labelEn} ({count})
              </button>
            );
          })}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-[#263042]/60">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full px-4 py-2 rounded-xl bg-[#0b0e14] border border-[#263042] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#d9b36c]"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">
              {locale === 'es'
                ? `Mostrando ${filteredAudits.length} receta(s)`
                : `Showing ${filteredAudits.length} recipe(s)`}
            </span>
            <div className="flex items-center gap-1.5 bg-[#0b0e14] p-1 rounded-xl border border-[#263042]">
              <span className="text-xs text-slate-400 px-2 font-medium">{t.batchLabel}</span>
              {BATCH_SIZES.map((mult) => (
                <button
                  key={mult}
                  type="button"
                  onClick={() => setBatchSize(mult)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    batchSize === mult
                      ? 'bg-[#d9b36c] text-[#0b0e14]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ×{mult}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Auditor Table — Single Dynamic Name Column */}
      <div className="aion-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0b0e14] border-b border-[#263042] text-[11px] uppercase tracking-wider text-[#9aa6bc]">
                <th className="py-3.5 px-4">{t.colRecipe}</th>
                <th className="py-3.5 px-3 text-center">{t.colSuccess}</th>
                <th className="py-3.5 px-3 text-right">{t.colBrokerPrice}</th>
                <th className="py-3.5 px-3 text-right">{t.colNpcCost}</th>
                <th className="py-3.5 px-3 text-right">{t.colAttemptCost}</th>
                <th className="py-3.5 px-3 text-right">{t.colExpectedNet}</th>
                <th className="py-3.5 px-3 text-right">{t.colProfitBuyAll}</th>
                <th className="py-3.5 px-3 text-right">{t.colValueAddedOwn}</th>
                <th className="py-3.5 px-4 text-center">{t.colVerdict}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263042]/60 text-sm">
              {filteredAudits.map((audit) => {
                const { recipe } = audit;
                const isExpanded = expandedRecipeId === recipe.recipeId;
                const primaryName = locale === 'es' ? recipe.nameEs : recipe.nameEn;
                const profLabel =
                  locale === 'es' ? recipe.professionEs : recipe.professionEn;
                const comboLabel =
                  locale === 'es' ? recipe.comboNameEs : recipe.comboNameEn;

                const npcCostBatch = Math.round(audit.npcFixedCost * batchSize);
                const attemptCostBatch = Math.round(
                  audit.totalDirectAttemptCost * batchSize
                );
                const expectedNetBatch = Math.round(
                  audit.expectedNetRevenuePerAttempt90 * batchSize
                );
                const profitBuyAllBatch = Math.round(audit.netProfitBuyingAll * batchSize);
                const valueAddedOwnBatch = Math.round(
                  audit.valueAddedWithOwnMats * batchSize
                );
                const profitBoundBatch = Math.round(audit.profitWithBoundMats * batchSize);

                return (
                  <React.Fragment key={recipe.recipeId}>
                    <tr
                      onClick={() =>
                        setExpandedRecipeId(isExpanded ? null : recipe.recipeId)
                      }
                      className="hover:bg-[#1b2230]/80 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-2.5">
                          <span className="text-[#d9b36c] text-xs mt-1">
                            {isExpanded ? '▼' : '▶'}
                          </span>
                          <div>
                            <div className="font-bold text-slate-100 flex items-center gap-2 flex-wrap">
                              <span>{primaryName}</span>
                              {recipe.productQuantity > 1 && (
                                <span className="px-1.5 py-0.5 rounded bg-[#d9b36c]/20 text-[#f0d59a] text-[10px] font-bold">
                                  ×{recipe.productQuantity}
                                </span>
                              )}
                              {recipe.isFeatured && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                                  META
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#9aa6bc] mt-0.5">
                              {profLabel}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <div className="font-bold text-slate-200">
                          {(recipe.baseSuccessRate * 100).toFixed(1)}%
                        </div>
                        {recipe.comboRate && recipe.comboRate > 0 ? (
                          <div className="text-[11px] text-[#f0d59a] font-semibold">
                            +{(recipe.comboRate * 100).toFixed(0)}% Proc
                          </div>
                        ) : null}
                      </td>

                      <td className="py-3.5 px-3 text-right font-mono">
                        <div className="text-slate-100 font-semibold">
                          {audit.unitBrokerPrice > 0
                            ? audit.unitBrokerPrice.toLocaleString()
                            : '—'}
                        </div>
                        <div className="text-[10px] text-[#9aa6bc]">
                          {audit.activeListings} listings
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-right font-mono text-[#f0d59a]">
                        {npcCostBatch.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-3 text-right font-mono text-slate-200">
                        {attemptCostBatch.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-3 text-right font-mono text-[#8b95ff] font-semibold">
                        {expectedNetBatch.toLocaleString()}
                      </td>

                      <td
                        className={`py-3.5 px-3 text-right font-mono font-bold ${
                          profitBuyAllBatch >= 0 ? 'text-[#6fd08c]' : 'text-[#e5484d]'
                        }`}
                      >
                        <div>
                          {profitBuyAllBatch >= 0 ? '+' : ''}
                          {profitBuyAllBatch.toLocaleString()}
                        </div>
                        <div className="text-[10px] opacity-80">
                          ({audit.roiBuyingAllPct >= 0 ? '+' : ''}
                          {audit.roiBuyingAllPct.toFixed(1)}%)
                        </div>
                      </td>

                      <td
                        className={`py-3.5 px-3 text-right font-mono font-bold ${
                          recipe.category === 'Vinculados' || recipe.hasBoundInput
                            ? 'text-[#f0d59a]'
                            : valueAddedOwnBatch >= 0
                              ? 'text-[#6fd08c]'
                              : 'text-[#e5484d]'
                        }`}
                      >
                        {recipe.category === 'Vinculados' || recipe.hasBoundInput ? (
                          <div>
                            +{profitBoundBatch.toLocaleString()}
                            <div className="text-[10px] text-[#f0d59a]/80">
                              (Bound = 0 Kinah)
                            </div>
                          </div>
                        ) : (
                          <div>
                            {valueAddedOwnBatch >= 0 ? '+' : ''}
                            {valueAddedOwnBatch.toLocaleString()}
                            <div className="text-[10px] opacity-75">
                              {locale === 'es' ? 'vs vender crudo' : 'vs raw sale'}
                            </div>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {renderVerdictBadge(audit)}
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-[#0b0e14]/95">
                        <td colSpan={9} className="p-5 border-l-4 border-[#d9b36c]">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Ingredients Breakdown — Single Localized Name */}
                            <div className="space-y-3">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-[#f0d59a]">
                                {locale === 'es'
                                  ? 'Desglose de Ingredientes y Simulador de Precios'
                                  : 'Ingredient Breakdown & Price Simulator'}
                              </h4>
                              <div className="space-y-2">
                                {audit.ingredientBreakdown.map((ing) => {
                                  const ingName =
                                    locale === 'es' ? ing.nameEs : ing.nameEn;
                                  return (
                                    <div
                                      key={ing.itemId}
                                      className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-[#141a24] border border-[#263042]"
                                    >
                                      <div>
                                        <div className="text-xs font-bold text-slate-100">
                                          {ing.quantity * batchSize}× {ingName}
                                        </div>
                                        <div className="text-[10px] text-[#9aa6bc]">
                                          ID: {ing.itemId}
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <span
                                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                            ing.sourceType === 'NPC'
                                              ? 'bg-[#d9b36c]/20 text-[#f0d59a]'
                                              : ing.sourceType === 'BOUND'
                                                ? 'bg-[#8b95ff]/20 text-[#8b95ff]'
                                                : 'bg-[#1b2230] text-slate-300'
                                          }`}
                                        >
                                          {ing.sourceType}
                                        </span>

                                        {ing.sourceType !== 'NPC' ? (
                                          <div className="flex items-center gap-1">
                                            <input
                                              type="number"
                                              defaultValue={ing.unitPriceKinah}
                                              onClick={(e) => e.stopPropagation()}
                                              onChange={(e) =>
                                                setEditingPriceMap((prev) => ({
                                                  ...prev,
                                                  [ing.itemId]: e.target.value,
                                                }))
                                              }
                                              className="w-24 px-2 py-1 rounded bg-[#0b0e14] border border-[#263042] text-right font-mono text-xs text-slate-100"
                                            />
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                void handleSaveCustomPrice(ing.itemId);
                                              }}
                                              className="px-2 py-1 rounded bg-[#d9b36c] hover:bg-[#f0d59a] text-[#0b0e14] text-[10px] font-bold"
                                            >
                                              OK
                                            </button>
                                          </div>
                                        ) : (
                                          <span className="font-mono text-xs text-[#f0d59a]">
                                            {ing.unitPriceKinah.toLocaleString()} c/u
                                          </span>
                                        )}

                                        <span className="font-mono text-xs font-bold text-slate-200 w-24 text-right">
                                          ={(
                                            ing.subtotalKinah * batchSize
                                          ).toLocaleString()}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Notes & Product Price Simulator */}
                            <div className="space-y-3">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-[#f0d59a]">
                                {locale === 'es'
                                  ? 'Diagnóstico Económico y Punto de Equilibrio (Breakeven)'
                                  : 'Economic Diagnosis & Breakeven Analysis'}
                              </h4>
                              <div className="p-3.5 rounded-xl bg-[#141a24] border border-[#263042] space-y-2 text-xs">
                                <p className="text-slate-200 leading-relaxed">
                                  {locale === 'es' ? recipe.notesEs : recipe.notesEn}
                                </p>
                                <div className="pt-2 border-t border-[#263042] grid grid-cols-2 gap-2">
                                  <div>
                                    <span className="text-[#9aa6bc] block">
                                      {locale === 'es'
                                        ? 'Precio Breakeven Unitario:'
                                        : 'Unit Breakeven Price:'}
                                    </span>
                                    <strong className="font-mono text-sm text-[#f0d59a]">
                                      {Math.round(
                                        audit.breakevenUnitPrice
                                      ).toLocaleString()}{' '}
                                      Kinah
                                    </strong>
                                  </div>
                                  <div>
                                    <span className="text-[#9aa6bc] block">
                                      {locale === 'es'
                                        ? 'Valor Neto 90% de tus Mats Crudos:'
                                        : '90% Net Value of Your Raw Mats:'}
                                    </span>
                                    <strong className="font-mono text-sm text-slate-200">
                                      {Math.round(
                                        audit.opportunityCostRawSales90 * batchSize
                                      ).toLocaleString()}{' '}
                                      Kinah
                                    </strong>
                                  </div>
                                </div>

                                {comboLabel && (
                                  <div className="pt-2 border-t border-[#263042] flex items-center justify-between">
                                    <span className="text-[#f0d59a]">
                                      ✨ Proc ({((recipe.comboRate ?? 0) * 100).toFixed(0)}
                                      %): {comboLabel}
                                    </span>
                                    {audit.comboBrokerPrice > 0 && (
                                      <span className="font-mono font-bold text-[#f0d59a]">
                                        {audit.comboBrokerPrice.toLocaleString()} Kinah
                                      </span>
                                    )}
                                  </div>
                                )}

                                {/* Simulate output price */}
                                <div className="pt-2 border-t border-[#263042] flex items-center justify-between">
                                  <span className="text-[#9aa6bc]">
                                    {locale === 'es'
                                      ? 'Simular Precio Venta Producto:'
                                      : 'Simulate Product Sale Price:'}
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="number"
                                      defaultValue={audit.unitBrokerPrice}
                                      onClick={(e) => e.stopPropagation()}
                                      onChange={(e) =>
                                        setEditingPriceMap((prev) => ({
                                          ...prev,
                                          [recipe.productId]: e.target.value,
                                        }))
                                      }
                                      className="w-28 px-2 py-1 rounded bg-[#0b0e14] border border-[#263042] text-right font-mono text-xs text-slate-100"
                                    />
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        void handleSaveCustomPrice(recipe.productId);
                                      }}
                                      className="px-2.5 py-1 rounded bg-[#d9b36c] hover:bg-[#f0d59a] text-[#0b0e14] text-xs font-bold"
                                    >
                                      {locale === 'es' ? 'Guardar' : 'Save'}
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
    </div>
  );
};
