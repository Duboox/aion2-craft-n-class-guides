'use client';

import React, { useEffect, useState } from 'react';
import { ENDPOINTS_CONFIG, getStaticAssetUrl } from '../config/endpoints.config';
import { ALL_CLASS_GUIDES_SEED } from '../data/all-classes-guides.seed';
import type { AionClassId, ClassGuideSheet, Locale } from '../domain/models/types';

interface ClassGuidesTabProps {
  readonly locale: Locale;
}

interface FullSkillSpecDto {
  readonly level: string;
  readonly text: string;
}

interface FullClassSkillDto {
  readonly slug: string;
  readonly id: string;
  readonly nameEn: string;
  readonly category: 'ACTIVE' | 'STIGMA' | 'PASSIVE';
  readonly iconUrl: string;
  readonly cooldownSec: number;
  readonly descEn: string;
  readonly specs: readonly FullSkillSpecDto[];
}

interface DaevanionPresetDto {
  readonly pveSkillSlugs: readonly string[];
  readonly pvpSkillSlugs: readonly string[];
  readonly levelingSkillSlugs: readonly string[];
  readonly noteEs: string;
  readonly noteEn: string;
}

interface TierBoardListDto {
  readonly source: string;
  readonly tiers: Readonly<Record<string, readonly string[]>>;
}

interface TierBoardDto {
  readonly id: string;
  readonly titleEn: string;
  readonly leadEn: string;
  readonly noteEn: string;
  readonly lists: readonly TierBoardListDto[];
}

interface PingRowDto {
  readonly label: string;
  readonly tone: string;
  readonly classes: readonly string[];
}

interface ClassEncyclopediaPayload {
  readonly totalSkillsCount: number;
  readonly skillsByClass: Readonly<Record<string, readonly FullClassSkillDto[]>>;
  readonly daevanionPresets: Readonly<Record<string, DaevanionPresetDto>>;
  readonly tierBoards: readonly TierBoardDto[];
  readonly pingMatrix: {
    readonly titleEn: string;
    readonly leadEn: string;
    readonly rows: readonly PingRowDto[];
  };
}

export const ClassGuidesTab: React.FC<ClassGuidesTabProps> = ({ locale }) => {
  const [selectedClassId, setSelectedClassId] = useState<AionClassId>('chanter');
  const [mode, setMode] = useState<'PVE' | 'PVP'>('PVE');
  const [subView, setSubView] = useState<'BUILD' | 'ALL_SKILLS' | 'TIERLIST'>('BUILD');
  const [skillFilterCat, setSkillFilterCat] = useState<
    'ALL' | 'ACTIVE' | 'STIGMA' | 'PASSIVE'
  >('ALL');
  const [encyclopedia, setEncyclopedia] = useState<ClassEncyclopediaPayload | null>(
    null
  );

  useEffect(() => {
    const loadEncyclopedia = async (): Promise<void> => {
      try {
        const res = await fetch(
          getStaticAssetUrl('/data/class_encyclopedia_complete.json')
        );
        if (res.ok) {
          const data = (await res.json()) as ClassEncyclopediaPayload;
          setEncyclopedia(data);
        }
      } catch {
        // Fallback to seed skills
      }
    };
    void loadEncyclopedia();
  }, []);

  const currentGuide: ClassGuideSheet =
    ALL_CLASS_GUIDES_SEED.find((g) => g.classId === selectedClassId) ??
    ALL_CLASS_GUIDES_SEED[0];

  const oneSentence =
    mode === 'PVE'
      ? locale === 'es'
        ? currentGuide.oneSentencePveEs
        : currentGuide.oneSentencePveEn
      : locale === 'es'
        ? currentGuide.oneSentencePvpEs
        : currentGuide.oneSentencePvpEn;

  const statPriorities =
    mode === 'PVE'
      ? locale === 'es'
        ? currentGuide.statPriorityPveEs
        : currentGuide.statPriorityPveEn
      : locale === 'es'
        ? currentGuide.statPriorityPvpEs
        : currentGuide.statPriorityPvpEn;

  const arcanaPriorities =
    locale === 'es' ? currentGuide.arcanaPriorityEs : currentGuide.arcanaPriorityEn;

  const fullClassSkills: readonly FullClassSkillDto[] =
    encyclopedia?.skillsByClass[selectedClassId] ?? [];

  const filteredFullSkills = fullClassSkills.filter((s) =>
    skillFilterCat === 'ALL' ? true : s.category === skillFilterCat
  );

  const daevPreset = encyclopedia?.daevanionPresets[selectedClassId];

  return (
    <div className="space-y-6">
      {/* 8-Class Selector Bar + SubView Switch */}
      <div className="aion-card rounded-2xl p-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-[#f0d59a] flex items-center gap-2">
              <span>⚔️</span>
              <span>
                {locale === 'es'
                  ? 'Guías Maestras de las 8 Clases, 280 Habilidades, Tableros Daevanion y Tier List'
                  : 'Master 8-Class Guides, 280 Skills Encyclopedia, Daevanion Boards & Tier List'}
              </span>
            </h2>
            <p className="text-xs text-[#9aa6bc]">
              {locale === 'es'
                ? 'Datos extraídos de Aion2-Guides.info + repositorio oficial (280 habilidades con especializaciones Nv. 8/12/16/20, Presets Daevanion y Matriz de Ping)'
                : 'Powered by Aion2-Guides.info dataset (280 skills with Lv. 8/12/16/20 specs, Daevanion Board Presets & Ping Matrix)'}
            </p>
          </div>

          {/* SubView Selector: Build | 280 Skills Encyclopedia | Tier List & Ping */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#0b0e14] p-1.5 rounded-xl border border-[#263042]">
            <button
              type="button"
              onClick={() => setSubView('BUILD')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition ${
                subView === 'BUILD'
                  ? 'bg-[#d9b36c] text-[#0b0e14] shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              🎯 {locale === 'es' ? 'Build, Daevanion & Stats' : 'Build, Daevanion & Stats'}
            </button>
            <button
              type="button"
              onClick={() => setSubView('ALL_SKILLS')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition ${
                subView === 'ALL_SKILLS'
                  ? 'bg-[#d9b36c] text-[#0b0e14] shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              📖{' '}
              {locale === 'es'
                ? `Todas las Habilidades (${fullClassSkills.length || 35})`
                : `All Class Skills (${fullClassSkills.length || 35})`}
            </button>
            <button
              type="button"
              onClick={() => setSubView('TIERLIST')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition ${
                subView === 'TIERLIST'
                  ? 'bg-[#d9b36c] text-[#0b0e14] shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              🏆 {locale === 'es' ? 'Tier List & Ping (LATAM/NA)' : 'Tier List & Ping Matrix'}
            </button>
          </div>
        </div>

        {/* 8 Classes Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {ALL_CLASS_GUIDES_SEED.map((cls) => {
            const isSelected = cls.classId === selectedClassId;
            return (
              <button
                key={cls.classId}
                type="button"
                onClick={() => setSelectedClassId(cls.classId)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-[#1b2230] border-[#d9b36c] shadow-[0_0_20px_rgba(217,179,108,0.2)]'
                    : 'bg-[#0b0e14] border-[#263042] hover:border-slate-600 opacity-80 hover:opacity-100'
                }`}
              >
                <img
                  src={cls.heroIconUrl}
                  alt={cls.nameEn}
                  className="w-11 h-11 rounded-lg border border-[#d9b36c]/50 object-cover"
                />
                <span
                  className={`text-xs font-bold leading-tight ${
                    isSelected ? 'text-[#f0d59a]' : 'text-slate-200'
                  }`}
                >
                  {locale === 'es' ? cls.nameEs.split(' ')[0] : cls.nameEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          SUBVIEW 1: CORE BUILD, DAEVANION PRESETS, STATS & ARCANAS
         ===================================================================== */}
      {subView === 'BUILD' && (
        <>
          {/* Hero Class Banner ("The Build in One Sentence") */}
          <div className="aion-card-gold rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <img
                  src={currentGuide.heroIconUrl}
                  alt={currentGuide.nameEn}
                  className="w-16 h-16 rounded-2xl border-2 border-[#d9b36c] shadow-lg shrink-0"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-2xl font-extrabold text-white">
                      {locale === 'es' ? currentGuide.nameEs : currentGuide.nameEn}
                    </h3>
                    <div className="flex items-center gap-1 bg-[#0b0e14] p-1 rounded-xl border border-[#263042]">
                      <button
                        type="button"
                        onClick={() => setMode('PVE')}
                        className={`px-3 py-0.5 rounded-lg text-[11px] font-extrabold transition ${
                          mode === 'PVE'
                            ? 'bg-[#6fd08c] text-[#0b0e14]'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        🐉 PvE
                      </button>
                      <button
                        type="button"
                        onClick={() => setMode('PVP')}
                        className={`px-3 py-0.5 rounded-lg text-[11px] font-extrabold transition ${
                          mode === 'PVP'
                            ? 'bg-[#8b95ff] text-[#0b0e14]'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        ⚔️ PvP
                      </button>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-[#d9b36c] mt-0.5">
                    {locale === 'es'
                      ? currentGuide.archetypeEs
                      : currentGuide.archetypeEn}
                  </p>
                  <p className="text-sm text-slate-200 mt-2.5 leading-relaxed max-w-4xl">
                    <strong className="text-[#f0d59a]">
                      {locale === 'es'
                        ? 'La Build en una frase: '
                        : 'The Build in One Sentence: '}
                    </strong>
                    {oneSentence}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
                <a
                  href={currentGuide.externalGuideUrlEn}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#d9b36c] hover:bg-[#f0d59a] text-[#0b0e14] text-xs font-extrabold text-center transition"
                >
                  📖 {locale === 'es' ? 'Ver en Aion2-Guides.info' : 'View on Aion2-Guides.info'} ↗
                </a>
                <a
                  href={
                    locale === 'es'
                      ? ENDPOINTS_CONFIG.externalReferenceLinks.questlogSkillBuilderEs
                      : ENDPOINTS_CONFIG.externalReferenceLinks.questlogSkillBuilderEn
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#1b2230] hover:bg-[#263042] text-slate-100 border border-[#263042] text-xs font-bold text-center transition"
                >
                  🛠️ Questlog.gg Skill Builder ↗
                </a>
              </div>
            </div>
          </div>

          {/* Daevanion Board Preset Card (from data/boards/presets.json) */}
          {daevPreset && (
            <div className="aion-card rounded-2xl p-5 border-[#d9b36c]/40 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <h4 className="text-sm font-extrabold text-[#f0d59a] flex items-center gap-2">
                  <span>✨</span>
                  <span>
                    {locale === 'es'
                      ? `Ruta Óptima de Tableros Daevanion (${currentGuide.nameEs})`
                      : `Optimal Daevanion Board Route (${currentGuide.nameEn})`}
                  </span>
                </h4>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#d9b36c]/20 text-[#f0d59a] border border-[#d9b36c]/40">
                  Nodos Naranjas (Grado 41) + Nodos de Habilidad Clave
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {locale === 'es' ? daevPreset.noteEs : daevPreset.noteEn}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-[#0b0e14] border border-[#6fd08c]/40 space-y-2">
                  <span className="text-xs font-extrabold text-[#6fd08c] block">
                    🐉{' '}
                    {locale === 'es'
                      ? 'Nodos de Habilidad Prioritarios en Tableros PvE (Tableros 1 al 4):'
                      : 'Priority Skill Nodes on PvE Boards (Boards 1 to 4):'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {daevPreset.pveSkillSlugs.map((slug) => (
                      <span
                        key={slug}
                        className="px-2.5 py-1 rounded-lg bg-[#141a24] border border-[#263042] text-xs font-bold text-white flex items-center gap-1.5"
                      >
                        <img
                          src={`https://aion2-guides.info/assets/icons/${selectedClassId}/${slug}.webp`}
                          alt={slug}
                          className="w-5 h-5 rounded"
                        />
                        <span>{slug.replace(/-/g, ' ')}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0b0e14] border border-[#8b95ff]/40 space-y-2">
                  <span className="text-xs font-extrabold text-[#8b95ff] block">
                    ⚔️{' '}
                    {locale === 'es'
                      ? 'Nodos de Habilidad Prioritarios en Tableros PvP (Incluye Tablero #5):'
                      : 'Priority Skill Nodes on PvP Boards (Includes Board #5):'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {daevPreset.pvpSkillSlugs.map((slug) => (
                      <span
                        key={slug}
                        className="px-2.5 py-1 rounded-lg bg-[#141a24] border border-[#263042] text-xs font-bold text-white flex items-center gap-1.5"
                      >
                        <img
                          src={`https://aion2-guides.info/assets/icons/${selectedClassId}/${slug}.webp`}
                          alt={slug}
                          className="w-5 h-5 rounded"
                        />
                        <span>{slug.replace(/-/g, ' ')}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Core Skills, Stigmas & Specializations Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#f0d59a]">
                {locale === 'es'
                  ? 'Habilidades Núcleo de la Rotación (Nv. 8 / 12 / 16)'
                  : 'Core Rotation Skills (Lv. 8 / 12 / 16)'}
              </h4>
              <button
                type="button"
                onClick={() => setSubView('ALL_SKILLS')}
                className="text-xs font-bold text-[#d9b36c] hover:underline"
              >
                {locale === 'es'
                  ? `Ver las ${fullClassSkills.length || 35} habilidades completas de la clase →`
                  : `View all ${fullClassSkills.length || 35} class skills →`}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentGuide.skills.map((sk) => {
                const skillTitle = locale === 'es' ? sk.nameEs : sk.nameEn;

                return (
                  <div
                    key={sk.slug}
                    className="aion-card rounded-2xl p-4 flex flex-col justify-between gap-3 hover:border-[#d9b36c]/50 transition"
                  >
                    <div className="flex items-start gap-3.5">
                      <img
                        src={sk.iconUrl}
                        alt={sk.nameEn}
                        className="w-12 h-12 rounded-xl border border-[#d9b36c]/50 shrink-0 bg-[#0b0e14]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <h5 className="font-bold text-sm text-white truncate">
                            {skillTitle}
                          </h5>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                              sk.category === 'STIGMA'
                                ? 'bg-[#8b95ff]/20 text-[#8b95ff] border border-[#8b95ff]/40'
                                : sk.category === 'PASSIVE'
                                  ? 'bg-[#6fd08c]/15 text-[#6fd08c] border border-[#6fd08c]/30'
                                  : 'bg-[#d9b36c]/20 text-[#f0d59a] border border-[#d9b36c]/40'
                            }`}
                          >
                            {sk.category} • {sk.priorityBadge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                          {locale === 'es' ? sk.summaryEs : sk.summaryEn}
                        </p>
                      </div>
                    </div>

                    {sk.specs.length > 0 && (
                      <div className="pt-2.5 border-t border-[#263042]/80 flex flex-wrap gap-1.5">
                        {sk.specs.map((sp) => (
                          <div
                            key={sp.level}
                            className={`px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1.5 border ${
                              sp.level === 'Lv 16'
                                ? 'bg-[#d9b36c]/15 border-[#d9b36c]/50 text-[#f0d59a] font-bold'
                                : 'bg-[#0b0e14] border-[#263042] text-slate-300'
                            }`}
                          >
                            <span className="font-extrabold text-[#d9b36c]">
                              {sp.level}:
                            </span>
                            <span>{locale === 'es' ? sp.textEs : sp.textEn}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stat Priority, Arcana Cards & Hotbar/Inline Slot Guide */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="aion-card rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#6fd08c] flex items-center gap-2">
                <span>📈</span>
                <span>
                  {locale === 'es'
                    ? `Prioridad de Estadísticas (${mode})`
                    : `Stat Priority (${mode})`}
                </span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-200">
                {statPriorities.map((st, idx) => (
                  <li
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#0b0e14] border border-[#263042] leading-relaxed"
                  >
                    {st}
                  </li>
                ))}
              </ul>
            </div>

            <div className="aion-card rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#f0d59a] flex items-center gap-2">
                <span>🃏</span>
                <span>
                  {locale === 'es'
                    ? 'Cartas de Arcana Recomendadas (Trascendencia)'
                    : 'Recommended Arcana Cards (Transcendence)'}
                </span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-200">
                {arcanaPriorities.map((arc, idx) => (
                  <li
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#0b0e14] border border-[#263042] leading-relaxed"
                  >
                    {arc}
                  </li>
                ))}
              </ul>
            </div>

            <div className="aion-card rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#8b95ff] flex items-center gap-2">
                <span>⌨️</span>
                <span>
                  {locale === 'es'
                    ? 'Configuración de Teclado (Ranura en Línea vs. Macro)'
                    : 'Hotbar Setup (Inline Slot vs. Macro)'}
                </span>
              </h4>
              <div className="p-3.5 rounded-xl bg-[#0b0e14] border border-[#263042] text-xs text-slate-200 leading-relaxed space-y-2">
                <p>
                  {locale === 'es'
                    ? currentGuide.hotbarAndMacroTipEs
                    : currentGuide.hotbarAndMacroTipEn}
                </p>
                <div className="pt-2 border-t border-[#263042] text-[11px] text-[#f0d59a]">
                  {locale === 'es'
                    ? '💡 Consejo Pro: Usa «Asignar a Ranura en Línea» en vez de macros secuenciales ciegas para no desperdiciar saltos ni anticontroles.'
                    : '💡 Pro Tip: Use "Assign to Inline Slot" instead of blind sequential macros so you never waste gap-closers or CC-breakers.'}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =====================================================================
          SUBVIEW 2: COMPLETE 280-SKILL ENCYCLOPEDIA FOR SELECTED CLASS
         ===================================================================== */}
      {subView === 'ALL_SKILLS' && (
        <div className="space-y-4">
          <div className="aion-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-[#f0d59a]">
                {locale === 'es'
                  ? `Enciclopedia Completa de Habilidades: ${currentGuide.nameEs} (${filteredFullSkills.length})`
                  : `Complete Skill Encyclopedia: ${currentGuide.nameEn} (${filteredFullSkills.length})`}
              </h3>
              <p className="text-xs text-[#9aa6bc]">
                {locale === 'es'
                  ? 'Incluye todas las Habilidades Activas, Estigmas y Pasivas con tiempos de reutilización y árbol completo de especializaciones.'
                  : 'Includes all Active Skills, Stigmas, and Passives with exact cooldowns and full specialization trees.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  { id: 'ALL', es: 'Todas', en: 'All' },
                  { id: 'ACTIVE', es: '⚔️ Activas', en: '⚔️ Active' },
                  { id: 'STIGMA', es: '🔮 Estigmas', en: '🔮 Stigmas' },
                  { id: 'PASSIVE', es: '🛡️ Pasivas', en: '🛡️ Passives' },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSkillFilterCat(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                    skillFilterCat === cat.id
                      ? 'bg-[#d9b36c] text-[#0b0e14] border-[#d9b36c]'
                      : 'bg-[#0b0e14] text-slate-300 border-[#263042] hover:text-white'
                  }`}
                >
                  {locale === 'es' ? cat.es : cat.en}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFullSkills.map((sk) => (
              <div
                key={sk.slug}
                className="aion-card rounded-2xl p-4 flex flex-col justify-between gap-3"
              >
                <div className="flex items-start gap-3.5">
                  <img
                    src={sk.iconUrl}
                    alt={sk.nameEn}
                    className="w-12 h-12 rounded-xl border border-[#d9b36c]/50 bg-[#0b0e14] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-bold text-sm text-white">{sk.nameEn}</h4>
                      <div className="flex items-center gap-1.5">
                        {sk.cooldownSec > 0 && (
                          <span className="px-2 py-0.5 rounded bg-[#0b0e14] border border-[#263042] text-[10px] font-mono text-[#f0d59a]">
                            ⏱️ {sk.cooldownSec}s CD
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            sk.category === 'STIGMA'
                              ? 'bg-[#8b95ff]/20 text-[#8b95ff]'
                              : sk.category === 'PASSIVE'
                                ? 'bg-[#6fd08c]/15 text-[#6fd08c]'
                                : 'bg-[#d9b36c]/20 text-[#f0d59a]'
                          }`}
                        >
                          {sk.category}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 mt-1.5 whitespace-pre-line leading-relaxed">
                      {sk.descEn}
                    </p>
                  </div>
                </div>

                {sk.specs.length > 0 && (
                  <div className="pt-2.5 border-t border-[#263042]/70 flex flex-wrap gap-1.5">
                    {sk.specs.map((sp, i) => (
                      <span
                        key={`${sp.level}_${i}`}
                        className="px-2 py-1 rounded-lg bg-[#0b0e14] border border-[#263042] text-[11px] text-slate-300"
                      >
                        <strong className="text-[#d9b36c]">{sp.level}:</strong>{' '}
                        {sp.text}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          SUBVIEW 3: OFFICIAL TIER LIST (PVE, MASS PVP, 1V1, DPS) & PING MATRIX
         ===================================================================== */}
      {subView === 'TIERLIST' && encyclopedia && (
        <div className="space-y-6">
          {/* Ping Matrix Callout (Crucial for SangreLatina / LATAM players on NAE) */}
          <div className="aion-card-gold rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#f0d59a] flex items-center gap-2">
                <span>📡</span>
                <span>
                  {locale === 'es'
                    ? 'Matriz de Sensibilidad al Ping (Especial para Jugadores de LATAM en NA East)'
                    : encyclopedia.pingMatrix.titleEn}
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {locale === 'es'
                  ? 'Con latencia alta (+80–120 ms), las clases que dependen de micro-weaving pierden hasta un 40% de velocidad si no se configuran correctamente en Ranuras en Línea.'
                  : encyclopedia.pingMatrix.leadEn}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {encyclopedia.pingMatrix.rows.map((row) => (
                <div
                  key={row.label}
                  className="p-4 rounded-xl bg-[#0b0e14] border border-[#263042] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#f0d59a]">
                      Ping: {row.label} ms
                    </span>
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-[#1b2230] text-slate-300">
                      {row.label === '50+'
                        ? locale === 'es'
                          ? 'Ideal Ping Alto'
                          : 'High Ping Friendly'
                        : row.label === '30–50'
                          ? locale === 'es'
                            ? 'Ping Medio'
                            : 'Medium Ping'
                          : locale === 'es'
                            ? 'Alta Velocidad / Weaving'
                            : 'Fast Weaving'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {row.classes.map((cls) => (
                      <span
                        key={cls}
                        onClick={() => {
                          setSelectedClassId(cls as AionClassId);
                          setSubView('BUILD');
                        }}
                        className="cursor-pointer px-3 py-1 rounded-lg bg-[#141a24] hover:border-[#d9b36c] border border-[#263042] text-xs font-bold text-white capitalize transition"
                      >
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4 Tier Boards: PvE, Mass PvP, Solo 1v1, Pure DPS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {encyclopedia.tierBoards.map((board) => (
              <div key={board.id} className="aion-card rounded-2xl p-5 space-y-4">
                <div>
                  <h4 className="text-base font-extrabold text-white">
                    {board.titleEn}
                  </h4>
                  <p className="text-xs text-[#9aa6bc] mt-0.5">{board.leadEn}</p>
                </div>

                <div className="space-y-3">
                  {board.lists.map((lst, idx) => (
                    <div
                      key={`${lst.source}_${idx}`}
                      className="p-3.5 rounded-xl bg-[#0b0e14] border border-[#263042] space-y-2"
                    >
                      <div className="text-[11px] font-extrabold uppercase text-[#d9b36c]">
                        Fuente / Analista: {lst.source.toUpperCase()}
                      </div>
                      <div className="space-y-1.5">
                        {Object.entries(lst.tiers).map(([tierKey, clsArr]) => (
                          <div
                            key={tierKey}
                            className="flex items-center gap-2 text-xs"
                          >
                            <span
                              className={`w-7 h-7 rounded-lg flex items-center justify-center font-extrabold shrink-0 ${
                                tierKey === 'S'
                                  ? 'bg-[#d9b36c] text-[#0b0e14]'
                                  : tierKey === 'A'
                                    ? 'bg-[#6fd08c]/20 text-[#6fd08c] border border-[#6fd08c]/40'
                                    : tierKey === 'B'
                                      ? 'bg-[#8b95ff]/20 text-[#8b95ff] border border-[#8b95ff]/40'
                                      : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {tierKey}
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {clsArr.map((c) => (
                                <span
                                  key={c}
                                  onClick={() => {
                                    setSelectedClassId(c as AionClassId);
                                    setSubView('BUILD');
                                  }}
                                  className="cursor-pointer px-2.5 py-1 rounded bg-[#141a24] border border-[#263042] hover:border-[#d9b36c] text-white font-semibold capitalize text-xs transition"
                                >
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-slate-300 bg-[#1b2230]/60 p-3 rounded-xl border border-[#263042]">
                  💡 {board.noteEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
