'use client';

import React, { useState } from 'react';
import { ENDPOINTS_CONFIG } from '../config/endpoints.config';
import { ALL_CLASS_GUIDES_SEED } from '../data/all-classes-guides.seed';
import type { AionClassId, ClassGuideSheet, Locale } from '../domain/models/types';

interface ClassGuidesTabProps {
  readonly locale: Locale;
}

export const ClassGuidesTab: React.FC<ClassGuidesTabProps> = ({ locale }) => {
  const [selectedClassId, setSelectedClassId] = useState<AionClassId>('chanter');
  const [mode, setMode] = useState<'PVE' | 'PVP'>('PVE');

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

  return (
    <div className="space-y-6">
      {/* 8-Class Selector Bar */}
      <div className="aion-card rounded-2xl p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-extrabold text-[#f0d59a] flex items-center gap-2">
              <span>⚔️</span>
              <span>
                {locale === 'es'
                  ? 'Guías Maestras de las 8 Clases (PvE & PvP)'
                  : 'Master Guides for All 8 Classes (PvE & PvP)'}
              </span>
            </h2>
            <p className="text-xs text-[#9aa6bc]">
              {locale === 'es'
                ? 'Especializaciones Nv. 8 / 12 / 16, Estigmas, Prioridad de Estadísticas, Arcanas y Configuración de Ranuras en Línea'
                : 'Lv. 8 / 12 / 16 Specializations, Stigmas, Stat Priority, Arcana Cards & Inline Slot Setup'}
            </p>
          </div>

          {/* PvE / PvP Mode Switch */}
          <div className="flex items-center gap-2 bg-[#0b0e14] p-1.5 rounded-xl border border-[#263042] self-start">
            <button
              type="button"
              onClick={() => setMode('PVE')}
              className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition ${
                mode === 'PVE'
                  ? 'bg-[#6fd08c] text-[#0b0e14] shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🐉 PvE (Conquista / Trascendencia)
            </button>
            <button
              type="button"
              onClick={() => setMode('PVP')}
              className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition ${
                mode === 'PVP'
                  ? 'bg-[#8b95ff] text-[#0b0e14] shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚔️ PvP (Abismo / Duelos)
            </button>
          </div>
        </div>

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
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    mode === 'PVE'
                      ? 'bg-[#6fd08c]/15 text-[#6fd08c] border-[#6fd08c]/40'
                      : 'bg-[#8b95ff]/15 text-[#8b95ff] border-[#8b95ff]/40'
                  }`}
                >
                  {mode === 'PVE' ? 'MODO PVE' : 'MODO PVP'}
                </span>
              </div>
              <p className="text-xs font-semibold text-[#d9b36c] mt-0.5">
                {locale === 'es' ? currentGuide.archetypeEs : currentGuide.archetypeEn}
              </p>
              <p className="text-sm text-slate-200 mt-2.5 leading-relaxed max-w-4xl">
                <strong className="text-[#f0d59a]">
                  {locale === 'es' ? 'La Build en una frase: ' : 'The Build in One Sentence: '}
                </strong>
                {oneSentence}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
            <a
              href={
                locale === 'es'
                  ? currentGuide.externalGuideUrlEs
                  : currentGuide.externalGuideUrlEn
              }
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

      {/* Core Skills, Stigmas & Specializations Grid */}
      <div className="space-y-3">
        <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#f0d59a]">
          {locale === 'es'
            ? 'Habilidades Núcleo, Estigmas y Especializaciones (Nv. 8 / 12 / 16)'
            : 'Core Skills, Stigmas & Specializations (Lv. 8 / 12 / 16)'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentGuide.skills.map((sk) => {
            const skillTitle =
              locale === 'es'
                ? `${sk.nameEs} (${sk.nameEn})`
                : `${sk.nameEn} (${sk.nameEs})`;

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

                {/* Specialization Chips (Lv 8, Lv 12, Lv 16) */}
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
                        <span className="font-extrabold text-[#d9b36c]">{sp.level}:</span>
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
        {/* Stat Priority */}
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

        {/* Arcana Priority */}
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

        {/* Hotbar & Inline Slot vs Macro Tip */}
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
                ? '💡 Consejo Pro: Usa la función nativa «Asignar a Ranura en Línea» en vez de macros secuenciales ciegas para no desperdiciar saltos ni anticontroles.'
                : '💡 Pro Tip: Use the native "Assign to Inline Slot" feature instead of blind sequential macros so you never waste gap-closers or CC-breakers.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
