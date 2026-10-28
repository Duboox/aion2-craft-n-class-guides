'use client';

import React, { useState } from 'react';
import { ENDPOINTS_CONFIG } from '../config/endpoints.config';
import { DUNGEON_YIELDS_SEED } from '../data/guides.seed';
import type { Locale, UserPreferences } from '../domain/models/types';

interface ToolsAndDungeonsTabProps {
  readonly locale: Locale;
  readonly userPrefs: UserPreferences;
  readonly onToggleSub: () => Promise<void>;
}

export const ToolsAndDungeonsTab: React.FC<ToolsAndDungeonsTabProps> = ({
  locale,
  userPrefs,
  onToggleSub,
}) => {
  // Tool 1: Kinah -> Quna Calculator
  const [qunaMarketRate, setQunaMarketRate] = useState<number>(21800);
  const [kinahBudgetMillions, setKinahBudgetMillions] = useState<number>(10);

  // Tool 2: Weekly Odyle & Dungeon Runs Calculator
  const [selectedDungeonId, setSelectedDungeonId] = useState<string>('trans_tier_4');
  const [weeklyOdyleStonesBought, setWeeklyOdyleStonesBought] = useState<number>(20);
  const [numCharactersRunning, setNumCharactersRunning] = useState<number>(2);

  // Tool 3: Broker Tax & Breakeven Calculator
  const [rawCraftCost, setRawCraftCost] = useState<number>(45000);
  const [craftSuccessPct, setCraftSuccessPct] = useState<number>(72.9);
  const [saleListingPrice, setSaleListingPrice] = useState<number>(75000);

  // Quna Math
  const totalKinah = Math.max(0, kinahBudgetMillions) * 1_000_000;
  const boxesCrafted = Math.floor(totalKinah / 1_100_000);
  const qunaReceivedNet = Math.floor(
    (boxesCrafted * 1_000_000) / Math.max(1, qunaMarketRate)
  );
  const realKinahPerQuna =
    qunaReceivedNet > 0 ? Math.round(totalKinah / qunaReceivedNet) : 0;

  // Dungeon & Odyle Math
  const selectedDungeon =
    DUNGEON_YIELDS_SEED.find((d) => d.id === selectedDungeonId) ??
    DUNGEON_YIELDS_SEED[0];

  const isSub = userPrefs.hasActiveSubscription;
  const odyleFromStones = weeklyOdyleStonesBought * 40;
  const odyleCostPerRun = isSub
    ? selectedDungeon.odyleCostDouble
    : selectedDungeon.odyleCostSingle;
  const runsFromBoughtStones = Math.floor(odyleFromStones / odyleCostPerRun);
  const kinahPerRun = isSub
    ? selectedDungeon.kinahSubDoubleCube
    : selectedDungeon.kinahSingleCube;
  const grossKinahPerChar = runsFromBoughtStones * kinahPerRun;
  const stonesCostPerChar = weeklyOdyleStonesBought * 100_000;
  const netProfitPerChar = grossKinahPerChar - stonesCostPerChar;
  const totalAccountWeeklyNet = netProfitPerChar * numCharactersRunning;

  // Broker Breakeven Math
  const rateDec = Math.max(0.01, Math.min(1, craftSuccessPct / 100));
  const realExpectedCost = Math.round(rawCraftCost / rateDec);
  const breakevenListingPrice = Math.round(realExpectedCost / 0.9);
  const netFromSale90 = Math.round(saleListingPrice * 0.9);
  const expectedNetPerAttempt = Math.round(netFromSale90 * rateDec);
  const netProfitPerAttempt = expectedNetPerAttempt - rawCraftCost;

  return (
    <div className="space-y-6">
      {/* External Tools & Community Databases Banner */}
      <div className="aion-card-gold rounded-2xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-[#f0d59a] flex items-center gap-2">
              <span>🛠️</span>
              <span>
                {locale === 'es'
                  ? 'Centro de Herramientas, Calculadoras y Portales Oficiales'
                  : 'Tools Center, Calculators & Community Portals'}
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              {locale === 'es'
                ? 'Calculadoras de Conversión Kinah ➔ Quna, Rendimiento de Trascendencia Tier 1–4, Impuestos del Broker y acceso rápido a Questlog.gg y Shugo.gg.'
                : 'Kinah ➔ Quna Converter, Transcendence Tier 1–4 Profit Calculator, Broker Tax Simulator, and direct links to Questlog.gg & Shugo.gg.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={
                locale === 'es'
                  ? ENDPOINTS_CONFIG.externalReferenceLinks.questlogSkillBuilderEs
                  : ENDPOINTS_CONFIG.externalReferenceLinks.questlogSkillBuilderEn
              }
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-xl bg-[#d9b36c] hover:bg-[#f0d59a] text-[#0b0e14] text-xs font-extrabold transition"
            >
              ⚔️ Questlog Skill Builder ↗
            </a>
            <a
              href={
                locale === 'es'
                  ? ENDPOINTS_CONFIG.externalReferenceLinks.questlogServerStatusEs
                  : ENDPOINTS_CONFIG.externalReferenceLinks.questlogServerStatusEn
              }
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-xl bg-[#1b2230] hover:bg-[#263042] text-[#6fd08c] border border-[#6fd08c]/40 text-xs font-bold transition"
            >
              🟢 Questlog Server Status ↗
            </a>
            <a
              href={
                locale === 'es'
                  ? ENDPOINTS_CONFIG.externalReferenceLinks.shugoDatabaseEs
                  : ENDPOINTS_CONFIG.externalReferenceLinks.shugoDatabaseEn
              }
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-xl bg-[#1b2230] hover:bg-[#263042] text-[#f0d59a] border border-[#d9b36c]/40 text-xs font-bold transition"
            >
              🗄️ Shugo.gg Database ({locale.toUpperCase()}) ↗
            </a>
          </div>
        </div>
      </div>

      {/* Calculators Row: 1. Kinah -> Quna | 2. Broker Tax & Breakeven */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tool 1: Kinah -> Quna Conversion Calculator */}
        <div className="aion-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#f0d59a] flex items-center gap-2">
              <span>💎</span>
              <span>
                {locale === 'es'
                  ? 'Herramienta 1: Calculadora Kinah ➔ Quna (Mercado de Divisas)'
                  : 'Tool 1: Kinah ➔ Quna Currency Exchange Calculator'}
              </span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#d9b36c]/20 text-[#f0d59a] border border-[#d9b36c]/40">
              Peaje +10% Morph
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {locale === 'es'
              ? 'Para vender Kinah por Quna debes empaquetar 1.000.000 Kinah + 100.000 Kinah de tasa en Conversión de Sustancias (Coste real = 1,1M por Caja de 1M Kinah).'
              : 'To sell Kinah for Quna you must package 1,000,000 Kinah + 100,000 Kinah fee in Substance Morph (Real cost = 1.1M per 1M Kinah Box).'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-[#0b0e14] border border-[#263042] space-y-1.5">
              <label className="text-xs font-bold text-[#9aa6bc] block">
                {locale === 'es'
                  ? 'Presupuesto de Kinah (Millones):'
                  : 'Kinah Budget (Millions):'}
              </label>
              <input
                type="number"
                min={1.1}
                step={1.1}
                value={kinahBudgetMillions}
                onChange={(e) => setKinahBudgetMillions(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[#141a24] border border-[#263042] font-mono text-sm font-bold text-white"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[#0b0e14] border border-[#263042] space-y-1.5">
              <label className="text-xs font-bold text-[#9aa6bc] block">
                {locale === 'es'
                  ? 'Tasa Actual del Servidor (Kinah / 1 Quna):'
                  : 'Current Server Rate (Kinah / 1 Quna):'}
              </label>
              <input
                type="number"
                min={1000}
                step={500}
                value={qunaMarketRate}
                onChange={(e) => setQunaMarketRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[#141a24] border border-[#263042] font-mono text-sm font-bold text-[#f0d59a]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-[#0b0e14] border border-[#263042] text-center">
              <span className="text-[10px] uppercase text-[#9aa6bc] block">
                {locale === 'es' ? 'Cajas 1M Empacadas' : '1M Boxes Crafted'}
              </span>
              <strong className="text-base font-extrabold text-white font-mono">
                {boxesCrafted} cajas
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-[#0b0e14] border border-[#6fd08c]/40 text-center">
              <span className="text-[10px] uppercase text-[#9aa6bc] block">
                {locale === 'es' ? 'Quna Neta a Recibir' : 'Net Quna Received'}
              </span>
              <strong className="text-base font-extrabold text-[#6fd08c] font-mono">
                {qunaReceivedNet.toLocaleString()} Quna
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-[#0b0e14] border border-[#d9b36c]/40 text-center">
              <span className="text-[10px] uppercase text-[#9aa6bc] block">
                {locale === 'es' ? 'Coste Real / Quna' : 'Real Cost / Quna'}
              </span>
              <strong className="text-base font-extrabold text-[#f0d59a] font-mono">
                {realKinahPerQuna.toLocaleString()} K
              </strong>
            </div>
          </div>
        </div>

        {/* Tool 2: Broker Tax & Breakeven Calculator */}
        <div className="aion-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#6fd08c] flex items-center gap-2">
              <span>⚖️</span>
              <span>
                {locale === 'es'
                  ? 'Herramienta 2: Simulador Rápido de Impuesto Broker y Breakeven'
                  : 'Tool 2: Quick Broker Tax & Craft Breakeven Simulator'}
              </span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#6fd08c]/15 text-[#6fd08c] border border-[#6fd08c]/40">
              Retención Neta 90%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-[#0b0e14] border border-[#263042] space-y-1">
              <label className="text-[11px] font-bold text-[#9aa6bc] block">
                {locale === 'es' ? 'Coste Materiales (Kinah):' : 'Material Cost (Kinah):'}
              </label>
              <input
                type="number"
                value={rawCraftCost}
                onChange={(e) => setRawCraftCost(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded bg-[#141a24] border border-[#263042] font-mono text-sm font-bold text-white"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#0b0e14] border border-[#263042] space-y-1">
              <label className="text-[11px] font-bold text-[#9aa6bc] block">
                {locale === 'es' ? 'Tasa Éxito Base (%):' : 'Base Success Rate (%):'}
              </label>
              <input
                type="number"
                step={0.1}
                value={craftSuccessPct}
                onChange={(e) => setCraftSuccessPct(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded bg-[#141a24] border border-[#263042] font-mono text-sm font-bold text-[#f0d59a]"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#0b0e14] border border-[#263042] space-y-1">
              <label className="text-[11px] font-bold text-[#9aa6bc] block">
                {locale === 'es' ? 'Precio Venta Broker:' : 'Broker Sale Price:'}
              </label>
              <input
                type="number"
                value={saleListingPrice}
                onChange={(e) => setSaleListingPrice(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded bg-[#141a24] border border-[#263042] font-mono text-sm font-bold text-[#6fd08c]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-[#0b0e14] border border-[#263042] text-center">
              <span className="text-[10px] uppercase text-[#9aa6bc] block">
                {locale === 'es' ? 'Coste Real (con fallos)' : 'Real Cost (with fails)'}
              </span>
              <strong className="text-base font-extrabold text-white font-mono">
                {realExpectedCost.toLocaleString()} K
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-[#0b0e14] border border-[#d9b36c]/40 text-center">
              <span className="text-[10px] uppercase text-[#9aa6bc] block">
                {locale === 'es' ? 'Precio Mínimo Breakeven' : 'Min Breakeven Price'}
              </span>
              <strong className="text-base font-extrabold text-[#f0d59a] font-mono">
                {breakevenListingPrice.toLocaleString()} K
              </strong>
            </div>

            <div
              className={`p-3 rounded-xl bg-[#0b0e14] border text-center ${
                netProfitPerAttempt >= 0
                  ? 'border-[#6fd08c]/40 text-[#6fd08c]'
                  : 'border-[#e5484d]/40 text-[#e5484d]'
              }`}
            >
              <span className="text-[10px] uppercase text-[#9aa6bc] block">
                {locale === 'es' ? 'Ganancia Neta / Intento' : 'Net Profit / Attempt'}
              </span>
              <strong className="text-base font-extrabold font-mono">
                {netProfitPerAttempt >= 0 ? '+' : ''}
                {netProfitPerAttempt.toLocaleString()} K
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Tool 3: Dungeon Yields (Conquest + Transcendence Tier 1 to Tier 4 = 960K) */}
      <div className="aion-card rounded-2xl p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-[#f0d59a] flex items-center gap-2">
              <span>🏰</span>
              <span>
                {locale === 'es'
                  ? 'Herramienta 3: Tabla de Rendimiento de Conquista y Trascendencia (Tier 1 a Tier 4)'
                  : 'Tool 3: Conquest & Transcendence (Tier 1 to Tier 4) Kinah Yield Table'}
              </span>
            </h3>
            <p className="text-xs text-[#9aa6bc]">
              {locale === 'es'
                ? 'Trascendencia Tier 4 entrega exactamente 480.000 Kinah con 1 cubo y 960.000 Kinah al abrir 2 cubos (80 Odyle).'
                : 'Transcendence Tier 4 awards exactly 480,000 Kinah for 1 cube and 960,000 Kinah when opening 2 cubes (80 Odyle).'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void onToggleSub()}
            className={`px-4 py-2 rounded-xl border text-xs font-extrabold transition ${
              isSub
                ? 'bg-[#6fd08c]/15 border-[#6fd08c] text-[#6fd08c]'
                : 'bg-[#0b0e14] border-[#263042] text-slate-300'
            }`}
          >
            {isSub
              ? locale === 'es'
                ? '👑 Calculando con Membresía Activa (2 Cubos / 80 Odyle)'
                : '👑 Calculating with Active Subscription (2 Cubes / 80 Odyle)'
              : locale === 'es'
                ? '👤 Calculando sin Membresía (1 Cubo / 40 Odyle)'
                : '👤 Calculating without Subscription (1 Cube / 40 Odyle)'}
          </button>
        </div>

        {/* Interactive Weekly Odyle Stones Simulator */}
        <div className="p-4 rounded-2xl bg-[#0b0e14] border border-[#d9b36c]/40 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div>
            <label className="text-[11px] font-bold uppercase text-[#9aa6bc] block mb-1">
              {locale === 'es' ? 'Mazmorra Objetivo:' : 'Target Dungeon:'}
            </label>
            <select
              value={selectedDungeonId}
              onChange={(e) => setSelectedDungeonId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#141a24] border border-[#263042] text-xs font-bold text-[#f0d59a]"
            >
              {DUNGEON_YIELDS_SEED.map((d) => (
                <option key={d.id} value={d.id}>
                  {locale === 'es' ? d.nameEs : d.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase text-[#9aa6bc] block mb-1">
              {locale === 'es'
                ? 'Piedras Odyle Compradas / Sem (Máx 20):'
                : 'Weekly Odyle Stones Bought (Max 20):'}
            </label>
            <input
              type="number"
              min={0}
              max={20}
              value={weeklyOdyleStonesBought}
              onChange={(e) =>
                setWeeklyOdyleStonesBought(
                  Math.max(0, Math.min(20, Number(e.target.value)))
                )
              }
              className="w-full px-3 py-2 rounded-xl bg-[#141a24] border border-[#263042] font-mono text-xs font-bold text-white"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase text-[#9aa6bc] block mb-1">
              {locale === 'es'
                ? 'Nº de Personajes en la Cuenta:'
                : 'Number of Characters:'}
            </label>
            <input
              type="number"
              min={1}
              max={8}
              value={numCharactersRunning}
              onChange={(e) =>
                setNumCharactersRunning(Math.max(1, Math.min(8, Number(e.target.value))))
              }
              className="w-full px-3 py-2 rounded-xl bg-[#141a24] border border-[#263042] font-mono text-xs font-bold text-white"
            />
          </div>

          <div className="p-3 rounded-xl bg-[#141a24] border border-[#6fd08c]/50 text-center">
            <span className="text-[10px] uppercase tracking-wider text-[#9aa6bc] block">
              {locale === 'es'
                ? `Ganancia Neta Semanal (${numCharactersRunning} PJ)`
                : `Weekly Net Profit (${numCharactersRunning} Chars)`}
            </span>
            <strong className="text-lg font-extrabold text-[#6fd08c] font-mono">
              +{totalAccountWeeklyNet.toLocaleString()} Kinah
            </strong>
            <span className="text-[10px] text-slate-400 block">
              ({runsFromBoughtStones} runs × {kinahPerRun.toLocaleString()} −{' '}
              {stonesCostPerChar.toLocaleString()} coste)
            </span>
          </div>
        </div>

        {/* Full Dungeon Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0b0e14] border-b border-[#263042] text-[11px] uppercase tracking-wider text-[#9aa6bc]">
                <th className="py-3 px-4">
                  {locale === 'es' ? 'Mazmorra / Tier' : 'Dungeon / Tier'}
                </th>
                <th className="py-3 px-3 text-center">Min GS / CP</th>
                <th
                  className={`py-3 px-3 text-right ${
                    !isSub ? 'text-[#f0d59a] bg-[#d9b36c]/10' : ''
                  }`}
                >
                  {locale === 'es' ? '1 Cubo (40 Odyle)' : '1 Cube (40 Odyle)'}
                </th>
                <th
                  className={`py-3 px-3 text-right ${
                    isSub ? 'text-[#6fd08c] bg-[#6fd08c]/10' : ''
                  }`}
                >
                  {locale === 'es' ? '👑 2 Cubos Sub (80 Odyle)' : '👑 2 Cubes Sub (80 Odyle)'}
                </th>
                <th className="py-3 px-3 text-right">
                  {locale === 'es'
                    ? 'Bruto 10 Runs (800 Odyle)'
                    : 'Gross 10 Runs (800 Odyle)'}
                </th>
                <th className="py-3 px-3 text-right">
                  {locale === 'es'
                    ? 'Neto Semanal (−2M Piedras)'
                    : 'Weekly Net (−2M Stones)'}
                </th>
                <th className="py-3 px-4">
                  {locale === 'es' ? 'Recompensas Clave' : 'Key Drops'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263042]/60 text-xs">
              {DUNGEON_YIELDS_SEED.map((d) => {
                const isT4 = d.id === 'trans_tier_4';
                return (
                  <tr
                    key={d.id}
                    className={`transition ${
                      isT4
                        ? 'bg-[#d9b36c]/15 border-l-4 border-[#d9b36c]'
                        : 'hover:bg-[#1b2230]/70'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-white">
                      {locale === 'es' ? d.nameEs : d.nameEn}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="font-mono font-bold text-[#f0d59a]">
                        {d.minGs.toLocaleString()} GS
                      </span>
                      <span className="block text-[10px] text-[#9aa6bc]">
                        {d.partyCp}
                      </span>
                    </td>
                    <td
                      className={`py-3.5 px-3 text-right font-mono ${
                        !isSub
                          ? 'font-extrabold text-[#f0d59a] bg-[#d9b36c]/10'
                          : 'text-slate-300'
                      }`}
                    >
                      {d.kinahSingleCube.toLocaleString()}
                    </td>
                    <td
                      className={`py-3.5 px-3 text-right font-mono ${
                        isSub
                          ? 'font-extrabold text-[#6fd08c] bg-[#6fd08c]/10'
                          : 'text-slate-200 font-bold'
                      }`}
                    >
                      {d.kinahSubDoubleCube.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-100">
                      {d.gross10RunsSub.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-extrabold text-[#6fd08c]">
                      +{d.netProfit10RunsWithOdyleBuy.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {locale === 'es' ? d.keyDropsEs : d.keyDropsEn}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
