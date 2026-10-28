'use client';

import React, { useEffect, useState } from 'react';
import { getStaticAssetUrl } from '../config/endpoints.config';
import type { Locale } from '../domain/models/types';

interface BossEntryDto {
  readonly id: string;
  readonly nameEn: string;
  readonly titleEn: string;
  readonly level: number;
  readonly areaEn: string;
  readonly respawnMinutes: number;
  readonly schedule: string;
  readonly krReference: string;
}

interface BossGroupDto {
  readonly id: string;
  readonly titleEs: string;
  readonly titleEn: string;
  readonly bosses: readonly BossEntryDto[];
}

interface DungeonMechanicDto {
  readonly nameEn: string;
  readonly textEn: string;
  readonly legendEn: string;
  readonly isWipeDanger: boolean;
  readonly diagramSvg: string;
  readonly videoTimestamp: string;
}

interface DungeonBossDto {
  readonly id: string;
  readonly nameEn: string;
  readonly iconUrl: string;
  readonly mechanics: readonly DungeonMechanicDto[];
}

interface DungeonGuideDto {
  readonly id: string;
  readonly dbId: string;
  readonly nameEn: string;
  readonly type: string;
  readonly minGs: number;
  readonly odyleCost: number;
  readonly bosses: readonly DungeonBossDto[];
}

interface SettingOptionDto {
  readonly group: string;
  readonly recommendedValue: string;
  readonly textEn: string;
}

interface SettingGroupDto {
  readonly id: string;
  readonly titleEn: string;
  readonly options: readonly SettingOptionDto[];
}

interface ProgressionSectionDto {
  readonly id: string;
  readonly labelEn: string;
  readonly titleEn: string;
  readonly descEn: string;
  readonly bullets: readonly string[];
}

interface KeyItemDto {
  readonly id: string;
  readonly nameEn: string;
  readonly grade: string;
  readonly slotEn: string;
  readonly tooltipLines: readonly string[];
  readonly iconUrl: string;
}

interface BossesDungeonsSettingsPayload {
  readonly bossGroups: readonly BossGroupDto[];
  readonly dungeonGuides: readonly DungeonGuideDto[];
  readonly settingsGroups: readonly SettingGroupDto[];
  readonly progressionSections?: readonly ProgressionSectionDto[];
  readonly keyItems?: readonly KeyItemDto[];
}

interface BossesDungeonsSettingsTabProps {
  readonly locale: Locale;
}

export const BossesDungeonsSettingsTab: React.FC<BossesDungeonsSettingsTabProps> = ({
  locale,
}) => {
  const [subView, setSubView] = useState<
    'DUNGEON_MECHS' | 'WORLD_BOSSES' | 'PROGRESSION' | 'GATHERING_TREE' | 'SETTINGS'
  >('DUNGEON_MECHS');
  const [payload, setPayload] = useState<BossesDungeonsSettingsPayload | null>(null);
  const [selectedBossFaction, setSelectedBossFaction] = useState<string>('asmodians');
  const [bossSearch, setBossSearch] = useState<string>('');
  const [selectedProgId, setSelectedProgId] = useState<string>('global');

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        const res = await fetch(
          getStaticAssetUrl('/data/bosses_dungeons_settings.json')
        );
        if (res.ok) {
          const json = (await res.json()) as BossesDungeonsSettingsPayload;
          setPayload(json);
        }
      } catch {
        // Ignore error
      }
    };
    void loadData();
  }, []);

  const activeBossGroup = payload?.bossGroups.find(
    (g) => g.id === selectedBossFaction
  );

  const filteredBosses = (activeBossGroup?.bosses ?? []).filter((b) => {
    const q = bossSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      b.nameEn.toLowerCase().includes(q) ||
      b.areaEn.toLowerCase().includes(q) ||
      b.titleEn.toLowerCase().includes(q)
    );
  });

  const formatRespawn = (mins: number, sched: string): string => {
    if (sched) return sched;
    if (!mins || mins <= 0) return locale === 'es' ? 'Horario Variable' : 'Variable';
    if (mins < 60) return `${mins} min`;
    const hours = mins / 60;
    return `${hours} h (${mins} min)`;
  };

  return (
    <div className="space-y-6">
      {/* Top Sub-Navigation */}
      <div className="aion-card-gold rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-[#f0d59a] flex items-center gap-2">
            <span>🐉</span>
            <span>
              {locale === 'es'
                ? 'Mecánicas de Mazmorras (con Diagramas SVG), 53 Jefes de Mundo, Árbol de Recolección y Settings'
                : 'Dungeon Boss Mechanics (SVG Diagrams), 53 World Bosses, Gathering Tree & Pro Settings'}
            </span>
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            {locale === 'es'
              ? 'Integrado directamente desde el repositorio de datos de Aion2-Guides (bosses.json, dungeons.json, crafting.json y settings.json).'
              : 'Integrated directly from the Aion2-Guides repository (bosses.json, dungeons.json, crafting.json & settings.json).'}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-[#0b0e14] p-1.5 rounded-xl border border-[#263042]">
          <button
            type="button"
            onClick={() => setSubView('DUNGEON_MECHS')}
            className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition ${
              subView === 'DUNGEON_MECHS'
                ? 'bg-[#d9b36c] text-[#0b0e14]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            💀 {locale === 'es' ? 'Mecánicas & Diagramas SVG (9)' : 'Dungeon Mechanics & SVGs (9)'}
          </button>
          <button
            type="button"
            onClick={() => setSubView('WORLD_BOSSES')}
            className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition ${
              subView === 'WORLD_BOSSES'
                ? 'bg-[#d9b36c] text-[#0b0e14]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            ⏱️ {locale === 'es' ? 'Jefes de Mundo (53)' : 'World Bosses (53)'}
          </button>
          <button
            type="button"
            onClick={() => setSubView('PROGRESSION')}
            className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition ${
              subView === 'PROGRESSION'
                ? 'bg-[#d9b36c] text-[#0b0e14]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            🚀 {locale === 'es' ? 'Ruta 0➔2800 GS & Ítems (45)' : '0➔2800 GS Roadmap & Items (45)'}
          </button>
          <button
            type="button"
            onClick={() => setSubView('GATHERING_TREE')}
            className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition ${
              subView === 'GATHERING_TREE'
                ? 'bg-[#d9b36c] text-[#0b0e14]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            🌿 {locale === 'es' ? 'Árbol de Recolección' : 'Gathering Skill Tree'}
          </button>
          <button
            type="button"
            onClick={() => setSubView('SETTINGS')}
            className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition ${
              subView === 'SETTINGS'
                ? 'bg-[#d9b36c] text-[#0b0e14]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            ⚙️ {locale === 'es' ? 'Settings Pro (Combate/FPS)' : 'Pro Settings (Combat/FPS)'}
          </button>
        </div>
      </div>

      {/* =====================================================================
          1. DUNGEON BOSS MECHANICS WITH INTERACTIVE SVG DIAGRAMS
         ===================================================================== */}
      {subView === 'DUNGEON_MECHS' && (
        <div className="space-y-6">
          {(payload?.dungeonGuides ?? []).map((dng) => (
            <div key={dng.id} className="aion-card rounded-2xl p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#263042]">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-xl bg-[#d9b36c]/20 text-[#f0d59a] border border-[#d9b36c]/40 text-xs font-extrabold uppercase">
                    {dng.type === 'transcendence' ? '👑 Transcendence' : '🏰 Conquest'}
                  </span>
                  <h3 className="text-xl font-extrabold text-white">{dng.nameEn}</h3>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-3 py-1 rounded-xl bg-[#0b0e14] border border-[#263042] font-mono font-bold text-[#6fd08c]">
                    Min GS: {dng.minGs.toLocaleString()}
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-[#0b0e14] border border-[#263042] font-mono text-slate-300">
                    Odyle: {dng.odyleCost} (1 Cubo) / {dng.odyleCost * 2} (2 Cubos)
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {dng.bosses.map((boss) => (
                  <div
                    key={boss.id}
                    className="p-4 rounded-2xl bg-[#0b0e14] border border-[#263042] space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={boss.iconUrl}
                        alt={boss.nameEn}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                        className="w-12 h-12 rounded-xl border border-[#d9b36c]/50 object-cover bg-[#141a24]"
                      />
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#9aa6bc] block">
                          Boss ID #{boss.id}
                        </span>
                        <h4 className="text-base font-extrabold text-[#f0d59a]">
                          {boss.nameEn}
                        </h4>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {boss.mechanics.map((mech, mIdx) => (
                        <div
                          key={`${boss.id}_mech_${mIdx}`}
                          className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
                            mech.isWipeDanger
                              ? 'bg-[#e5484d]/10 border-[#e5484d]/50'
                              : 'bg-[#141a24] border-[#263042]'
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <strong className="text-sm text-white">
                                {mech.nameEn}
                              </strong>
                              {mech.isWipeDanger && (
                                <span className="px-2 py-0.5 rounded bg-[#e5484d] text-white text-[10px] font-extrabold uppercase">
                                  💀 WIPE / ONE-SHOT
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-200 leading-relaxed">
                              {mech.textEn}
                            </p>
                          </div>

                          {mech.diagramSvg && (
                            <div className="p-3 rounded-xl bg-[#0b0e14] border border-[#263042] space-y-2">
                              <img
                                src={getStaticAssetUrl(mech.diagramSvg)}
                                alt={mech.nameEn}
                                className="w-full max-h-44 object-contain mx-auto"
                              />
                              {mech.legendEn && (
                                <p className="text-[11px] text-[#f0d59a] text-center">
                                  📐 {mech.legendEn}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =====================================================================
          2. 53 WORLD, FIELD & ABYSS BOSSES (WITH GLOBAL HALVED RESPAWN TIMERS)
         ===================================================================== */}
      {subView === 'WORLD_BOSSES' && (
        <div className="space-y-4">
          <div className="aion-card rounded-2xl p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-[#f0d59a]">
                  {locale === 'es'
                    ? '53 Jefes de Campo y Abismo (Ciclos Reducidos a la Mitad en Servidor Global)'
                    : '53 Field & Abyss Bosses (Halved Respawn Cycles on Global Servers)'}
                </h3>
                <p className="text-xs text-[#9aa6bc]">
                  {locale === 'es'
                    ? 'Nota importante: En el servidor Global los jefes de Altgard y Verteron reaparecen en la MITAD del tiempo que en KR/TW (ej. 6h en vez de 12h, 12h en vez de 24h).'
                    : 'Important: On Global servers, Altgard and Verteron field bosses respawn in HALF the Korean cycle time (e.g., 6h instead of 12h, 12h instead of 24h).'}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {(payload?.bossGroups ?? []).map((grp) => (
                  <button
                    key={grp.id}
                    type="button"
                    onClick={() => setSelectedBossFaction(grp.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border transition ${
                      selectedBossFaction === grp.id
                        ? 'bg-[#d9b36c] text-[#0b0e14] border-[#d9b36c]'
                        : 'bg-[#0b0e14] text-slate-300 border-[#263042] hover:text-white'
                    }`}
                  >
                    {grp.id === 'asmodians'
                      ? '🦅 Asmodian (Altgard — 24)'
                      : grp.id === 'elyos'
                        ? '☀️ Elyos (Verteron — 24)'
                        : '⚔️ Abyss (Reshanta — 5)'}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              value={bossSearch}
              onChange={(e) => setBossSearch(e.target.value)}
              placeholder={
                locale === 'es'
                  ? 'Buscar jefe por nombre, zona o título...'
                  : 'Search boss by name, area, or title...'
              }
              className="w-full px-4 py-2 rounded-xl bg-[#0b0e14] border border-[#263042] text-sm text-white placeholder-slate-500"
            />
          </div>

          <div className="aion-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0b0e14] border-b border-[#263042] text-[11px] uppercase tracking-wider text-[#9aa6bc]">
                    <th className="py-3.5 px-4">ID</th>
                    <th className="py-3.5 px-4">
                      {locale === 'es' ? 'Nombre del Jefe' : 'Boss Name'}
                    </th>
                    <th className="py-3.5 px-4">
                      {locale === 'es' ? 'Título' : 'Title'}
                    </th>
                    <th className="py-3.5 px-4">
                      {locale === 'es' ? 'Zona de Aparición' : 'Spawn Area'}
                    </th>
                    <th className="py-3.5 px-4 text-right">
                      {locale === 'es'
                        ? 'Tiempo de Reaparición (Global)'
                        : 'Global Respawn Timer'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#263042]/60 text-sm">
                  {filteredBosses.map((boss) => (
                    <tr
                      key={boss.id}
                      className="hover:bg-[#1b2230]/70 transition"
                    >
                      <td className="py-3 px-4 font-mono text-xs text-[#9aa6bc]">
                        {boss.id}
                      </td>
                      <td className="py-3 px-4 font-bold text-white">
                        {boss.nameEn}
                      </td>
                      <td className="py-3 px-4 text-xs text-[#f0d59a]">
                        {boss.titleEn || '—'}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-300">
                        📍 {boss.areaEn || 'Reshanta / Abyss'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-[#6fd08c]">
                        ⏱️ {formatRespawn(boss.respawnMinutes, boss.schedule)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          3. GATHERING SKILL TREE (ESSENCE EXTRACTION FROM CRAFTING.JSON)
         ===================================================================== */}
      {subView === 'GATHERING_TREE' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="aion-card rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-extrabold text-[#f0d59a]">
              🌿{' '}
              {locale === 'es'
                ? 'Árbol de Extracción de Esencia (Dónde Invertir los Puntos de Recolección)'
                : 'Essence Extraction Skill Tree (Where to Spend Gathering Points)'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {locale === 'es'
                ? 'Subir de nivel la recolección otorga dos tipos de puntos: habilidades comunes (izquierda) y ramas de material específico (derecha).'
                : 'Leveling gathering awards two types of points: common skills on the left, and material branches on the right.'}
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#0b0e14] border border-[#6fd08c]/50 flex items-center justify-between">
                <div>
                  <strong className="text-sm text-white block">
                    1. Proficient Handling (Manejo Experto)
                  </strong>
                  <span className="text-xs text-slate-400">
                    {locale === 'es'
                      ? 'Acelera el progreso de extracción en cada nodo.'
                      : 'Speeds up extraction progress on every node.'}
                  </span>
                </div>
                <span className="px-3 py-1 rounded-lg bg-[#6fd08c] text-[#0b0e14] font-extrabold text-xs">
                  NIVEL 10 (MAX)
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#0b0e14] border border-[#6fd08c]/50 flex items-center justify-between">
                <div>
                  <strong className="text-sm text-white block">
                    2. Delicate Touch (Toque Delicado)
                  </strong>
                  <span className="text-xs text-slate-400">
                    {locale === 'es'
                      ? 'Reduce el desgaste y aumenta la probabilidad de obtener grado Fino/Brillante.'
                      : 'Reduces failure gauge buildup and boosts Fine/Radiant grade procs.'}
                  </span>
                </div>
                <span className="px-3 py-1 rounded-lg bg-[#6fd08c] text-[#0b0e14] font-extrabold text-xs">
                  NIVEL 10 (MAX)
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#0b0e14] border border-[#d9b36c]/50 flex items-center justify-between">
                <div>
                  <strong className="text-sm text-white block">
                    3. Lady Luck (Dama de la Suerte)
                  </strong>
                  <span className="text-xs text-slate-400">
                    {locale === 'es'
                      ? 'Solo se activa ~1 vez cada 50 nodos cuando la barra de fallo ya está alta. No pases de Nivel 5 (salvo build pura de venta de gemas).'
                      : 'Only procs ~1 in 50 nodes when failure gauge is high. Keep at ≤5 (unless running a pure gem-selling build).'}
                  </span>
                </div>
                <span className="px-3 py-1 rounded-lg bg-[#d9b36c]/20 text-[#f0d59a] border border-[#d9b36c]/50 font-extrabold text-xs">
                  MÁXIMO NV. 5
                </span>
              </div>
            </div>
          </div>

          <div className="aion-card rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-extrabold text-[#6fd08c]">
              🎯{' '}
              {locale === 'es'
                ? 'Qué 2 Ramas de Materiales Subir al Máximo (Derecha)'
                : 'Which 2 Material Branches to Max Out (Right Side)'}
            </h3>

            <div className="space-y-3 text-xs text-slate-200">
              <div className="p-4 rounded-xl bg-[#0b0e14] border border-[#d9b36c] space-y-1">
                <strong className="text-sm text-[#f0d59a] block">
                  👑 Rama Obligatoria #1: Odyle (Od) — ¡Siempre al Máximo!
                </strong>
                <p className="text-slate-300">
                  {locale === 'es'
                    ? 'El Odyle se usa en TODAS las recetas de armas/armaduras y además puede transmutarse en cualquier otro recurso (Mineral, Tronco, Gema o Hierba) en Conversión de Sustancias.'
                    : 'Odyle is required in EVERY weapon/armor recipe and can be transmuted into any other resource (Ore, Log, Gem, or Herb) via Substance Morph.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0b0e14] border border-[#263042] space-y-2">
                <strong className="text-sm text-white block">
                  ⚔️ Rama Obligatoria #2: El Recurso de tu Primera Arma / Profesión
                </strong>
                <ul className="space-y-1.5 text-slate-300">
                  <li>
                    • <strong>Herrería (Espadón, Espada, Daga, Maza, Guardia):</strong>{' '}
                    Sube la rama de <strong>Mineral de Orichalcum (Ore)</strong>.
                  </li>
                  <li>
                    • <strong>Orfebrería (Bastón, Arco):</strong> Sube la rama de{' '}
                    <strong>Tronco de Yggdrasil (Log)</strong>.
                  </li>
                  <li>
                    • <strong>Orfebrería (Anillos, Collares, Pendientes):</strong> Sube
                    la rama de <strong>Gemas / Zafiro (Gemstone)</strong>.
                  </li>
                  <li>
                    • <strong>Alquimia & Cocina:</strong> Sube{' '}
                    <strong>Hierbas (Calendula/Azpha)</strong> o{' '}
                    <strong>Ingredientes (Kukuru)</strong>.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          4. PRO GAME SETTINGS (COMBAT, TARGETING, CAMERA & FPS)
         ===================================================================== */}
      {subView === 'SETTINGS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(payload?.settingsGroups ?? []).map((sGrp) => (
            <div key={sGrp.id} className="aion-card rounded-2xl p-5 space-y-3">
              <h3 className="text-base font-extrabold text-[#f0d59a] border-b border-[#263042] pb-2">
                ⚙️ {sGrp.titleEn}
              </h3>
              <div className="space-y-2.5">
                {sGrp.options.map((opt, idx) => (
                  <div
                    key={`${sGrp.id}_opt_${idx}`}
                    className="p-3 rounded-xl bg-[#0b0e14] border border-[#263042] space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase text-[#9aa6bc]">
                        {opt.group}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#6fd08c]/20 text-[#6fd08c] border border-[#6fd08c]/40 text-[11px] font-extrabold">
                        {opt.recommendedValue}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {opt.textEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =====================================================================
          5. PROGRESSION ROADMAP (0 ➔ 2,800+ GS) & 45 KEY ITEMS (ITEMS.JSON)
         ===================================================================== */}
      {subView === 'PROGRESSION' && (
        <div className="space-y-6">
          {/* Progression Stage Selector */}
          <div className="aion-card rounded-2xl p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-extrabold text-[#f0d59a]">
                  🚀{' '}
                  {locale === 'es'
                    ? 'Ruta Completa de Progresión (Nv. 1 ➔ 1,400 ➔ 1,900 ➔ 2,100 ➔ 2,500 ➔ 2,800+ GS)'
                    : 'Complete Gear Progression Roadmap (Lv. 1 ➔ 1,400 ➔ 1,900 ➔ 2,100 ➔ 2,500 ➔ 2,800+ GS)'}
                </h3>
                <p className="text-xs text-[#9aa6bc]">
                  {locale === 'es'
                    ? 'Incluye las diferencias críticas del servidor Global (las mazmorras ? del mapa enemigo dan 2,500 piedras y 1,000 AP en lugar de Cristales de Daevanion).'
                    : 'Includes critical Global server differences (enemy faction ? dungeons give 2,500 Enhance Stones and 1,000 AP instead of Daevanion Crystals).'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {(payload?.progressionSections ?? []).map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setSelectedProgId(sec.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-extrabold border transition ${
                    selectedProgId === sec.id
                      ? 'bg-[#d9b36c] text-[#0b0e14] border-[#d9b36c]'
                      : 'bg-[#0b0e14] text-slate-300 border-[#263042] hover:text-white'
                  }`}
                >
                  {sec.labelEn}
                </button>
              ))}
            </div>

            {(() => {
              const activeSec =
                (payload?.progressionSections ?? []).find(
                  (s) => s.id === selectedProgId
                ) ?? (payload?.progressionSections ?? [])[0];
              if (!activeSec) return null;
              return (
                <div className="p-5 rounded-2xl bg-[#0b0e14] border border-[#d9b36c]/40 space-y-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#d9b36c]">
                      {activeSec.labelEn}
                    </span>
                    <h4 className="text-lg font-extrabold text-white">
                      {activeSec.titleEn}
                    </h4>
                    {activeSec.descEn && (
                      <p className="text-xs text-slate-300 mt-1">
                        {activeSec.descEn}
                      </p>
                    )}
                  </div>
                  <ul className="space-y-2 text-xs text-slate-200">
                    {activeSec.bullets.map((b, bIdx) => (
                      <li
                        key={`${activeSec.id}_b_${bIdx}`}
                        className="p-2.5 rounded-xl bg-[#141a24] border border-[#263042] leading-relaxed"
                      >
                        • {b}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })()}
          </div>

          {/* 45 Key Progression Items */}
          <div className="aion-card rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#f0d59a]">
                🎒{' '}
                {locale === 'es'
                  ? '45 Ítems Clave de Progresión, Monedas, Piedras y Alas (con Efectos Equipado/Poseído)'
                  : '45 Key Progression Items, Currencies, Stones & Wings (with Equipped/Owned Effects)'}
              </h3>
              <p className="text-xs text-[#9aa6bc]">
                {locale === 'es'
                  ? 'Referencia directa de items.json para identificar de inmediato para qué sirve cada piedra, moneda o pieza de progresión.'
                  : 'Direct reference from items.json to immediately identify the purpose of every progression stone, currency, or gear piece.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {(payload?.keyItems ?? []).map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-[#0b0e14] border border-[#263042] flex items-start gap-3 hover:border-[#d9b36c]/50 transition"
                >
                  <img
                    src={item.iconUrl}
                    alt={item.nameEn}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                    className="w-11 h-11 rounded-xl border border-[#263042] bg-[#141a24] object-contain shrink-0"
                  />
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <strong className="text-xs text-white truncate">
                        {item.nameEn}
                      </strong>
                      <span className="px-1.5 py-0.5 rounded bg-[#141a24] border border-[#263042] text-[10px] font-bold uppercase text-[#f0d59a]">
                        {item.grade}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#9aa6bc] block">
                      {item.slotEn}
                    </span>
                    {item.tooltipLines.length > 0 && (
                      <ul className="space-y-0.5 text-[11px] text-[#6fd08c]">
                        {item.tooltipLines.map((line, lIdx) => (
                          <li key={`${item.id}_l_${lIdx}`}>{line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
