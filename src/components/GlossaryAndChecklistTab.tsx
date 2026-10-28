'use client';

import React, { useEffect, useState } from 'react';
import { CHECKLIST_TASKS_SEED, GLOSSARY_TERMS_SEED } from '../data/guides.seed';
import type { Locale } from '../domain/models/types';
import { dbInstance } from '../infrastructure/db/dexie.db';

interface GlossaryAndChecklistTabProps {
  readonly locale: Locale;
}

export const GlossaryAndChecklistTab: React.FC<GlossaryAndChecklistTabProps> = ({
  locale,
}) => {
  const [glossaryFilter, setGlossaryFilter] = useState<string>('ALL');
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadChecklist = async (): Promise<void> => {
      if (typeof window === 'undefined') return;
      await dbInstance.open();
      const rows = await dbInstance.checklist.toArray();
      const map: Record<string, boolean> = {};
      for (const r of rows) {
        map[r.taskId] = r.completed;
      }
      setCompletedMap(map);
    };
    void loadChecklist();
  }, []);

  const handleToggleChecklist = async (taskId: string): Promise<void> => {
    const nextVal = !completedMap[taskId];
    setCompletedMap((prev) => ({ ...prev, [taskId]: nextVal }));
    if (typeof window !== 'undefined') {
      await dbInstance.open();
      await dbInstance.checklist.put({
        taskId,
        completed: nextVal,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const handleResetChecklist = async (): Promise<void> => {
    setCompletedMap({});
    if (typeof window !== 'undefined') {
      await dbInstance.open();
      await dbInstance.checklist.clear();
    }
  };

  const filteredGlossary = GLOSSARY_TERMS_SEED.filter((g) =>
    glossaryFilter === 'ALL' ? true : g.category === glossaryFilter
  );

  return (
    <div className="space-y-8">
      {/* Section 1: New Player Glossary */}
      <div className="aion-card-gold rounded-2xl p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-[#f0d59a] flex items-center gap-2">
              <span>📚</span>
              <span>
                {locale === 'es'
                  ? 'Glosario Esencial para Jugadores Nuevos y Veteranos (CP, GS, Golpe %, ◆)'
                  : 'Essential Glossary for New & Veteran Players (CP, GS, Double Chance %, ◆)'}
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              {locale === 'es'
                ? 'Aprende la diferencia real entre Gear Score (GS) y Combat Power (CP), cómo funciona Golpe % y cómo ahorrar millones al encantar.'
                : 'Understand the real difference between Gear Score (GS) and Combat Power (CP), how Double Chance % works, and how to save millions enchanting.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'ALL', es: 'Todos', en: 'All' },
              { id: 'STATS', es: '📊 Stats (CP/GS)', en: '📊 Stats (CP/GS)' },
              { id: 'GEAR', es: '🛡️ Equipo (◆ / Pity)', en: '🛡️ Gear (◆ / Pity)' },
              { id: 'ECONOMY', es: '💰 Economía', en: '💰 Economy' },
              { id: 'COMBAT', es: '⚔️ Combate', en: '⚔️ Combat' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setGlossaryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                  glossaryFilter === cat.id
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
          {filteredGlossary.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-[#0b0e14] border border-[#263042] space-y-2.5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-extrabold text-white">
                    {locale === 'es' ? item.termEs : item.termEn}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#d9b36c]/20 text-[#f0d59a] border border-[#d9b36c]/40 shrink-0">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {locale === 'es' ? item.definitionEs : item.definitionEn}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#141a24] border border-[#d9b36c]/30 text-xs text-[#f0d59a]">
                💡 {locale === 'es' ? item.exampleOrTipEs : item.exampleOrTipEn}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Interactive Daily & Weekly Checklist */}
      <div className="aion-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-[#6fd08c] flex items-center gap-2">
              <span>✅</span>
              <span>
                {locale === 'es'
                  ? 'Checklist Interactivo de Rutina Diaria, Semanal y Ruta Express de Alt'
                  : 'Interactive Daily, Weekly & Alt Express Routine Checklist'}
              </span>
            </h3>
            <p className="text-xs text-[#9aa6bc]">
              {locale === 'es'
                ? 'Tu progreso se guarda automáticamente en el IndexedDB de tu navegador.'
                : 'Your progress is automatically persisted in your browser’s IndexedDB.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void handleResetChecklist()}
            className="px-3.5 py-1.5 rounded-xl bg-[#1b2230] hover:bg-[#263042] text-xs font-bold text-slate-300 border border-[#263042] transition"
          >
            🔄 {locale === 'es' ? 'Reiniciar Marcas' : 'Reset Checks'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CHECKLIST_TASKS_SEED.map((task) => {
            const done = Boolean(completedMap[task.id]);
            return (
              <div
                key={task.id}
                onClick={() => void handleToggleChecklist(task.id)}
                className={`p-4 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                  done
                    ? 'bg-[#6fd08c]/10 border-[#6fd08c]/50 opacity-80'
                    : 'bg-[#0b0e14] border-[#263042] hover:border-[#d9b36c]/50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() => {}}
                  className="mt-1 h-4 w-4 accent-[#6fd08c] cursor-pointer"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`text-xs font-extrabold ${
                        done ? 'line-through text-slate-400' : 'text-white'
                      }`}
                    >
                      {locale === 'es' ? task.titleEs : task.titleEn}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#d9b36c]/20 text-[#f0d59a]">
                      {locale === 'es' ? task.rewardBadgeEs : task.rewardBadgeEn}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {locale === 'es' ? task.descriptionEs : task.descriptionEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
