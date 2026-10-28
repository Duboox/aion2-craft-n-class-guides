'use client';

import React, { useEffect, useState } from 'react';
import {
  CHANTER_SKILLS_SEED,
  CHECKLIST_TASKS_SEED,
  DUNGEON_YIELDS_SEED,
  GLADIATOR_SKILLS_SEED,
} from '../data/guides.seed';
import type { Locale } from '../domain/models/types';
import { dbInstance } from '../infrastructure/db/dexie.db';

export interface ClassAndEconomyGuidesTabProps {
  readonly locale: Locale;
  readonly activeSection: 'CLASSES' | 'ECONOMY' | 'CHECKLIST';
}

export const ClassAndEconomyGuidesTab: React.FC<ClassAndEconomyGuidesTabProps> = ({
  locale,
  activeSection,
}) => {
  const [completedMap, setCompletedMap] = useState<Readonly<Record<string, boolean>>>({});
  const [qunaChestsCount, setQunaChestsCount] = useState<number>(2);
  const [qunaListingPrice, setQunaListingPrice] = useState<number>(820);

  useEffect(() => {
    let mounted = true;
    const loadChecklist = async (): Promise<void> => {
      if (typeof window === 'undefined') return;
      await dbInstance.open();
      const rows = await dbInstance.checklist.toArray();
      if (!mounted) return;
      const map: Record<string, boolean> = {};
      for (const r of rows) {
        map[r.taskId] = r.completed;
      }
      setCompletedMap(map);
    };
    void loadChecklist();
    return () => {
      mounted = false;
    };
  }, []);

  const toggleChecklistTask = async (taskId: string): Promise<void> => {
    const nextVal = !completedMap[taskId];
    setCompletedMap((prev) => ({ ...prev, [taskId]: nextVal }));
    await dbInstance.checklist.put({
      taskId,
      completed: nextVal,
      updatedAt: new Date().toISOString(),
    });
  };

  const resetAllTasks = async (): Promise<void> => {
    setCompletedMap({});
    await dbInstance.checklist.clear();
  };

  if (activeSection === 'CLASSES') {
    return (
      <div className="space-y-8">
        {/* Perfil y Guía de Voidex (Chanter) */}
        <div className="rounded-xl border border-amber-500/30 bg-slate-900/90 p-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="rounded bg-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-300">
                MAIN CHARACTER • CHANTER (CANTOR) LV. 45
              </span>
              <h2 className="mt-2 text-xl font-extrabold text-white">
                👑 Voidex — 2,726 GS | 133,931 CP (Top #1 SangreLatina)
              </h2>
              <p className="mt-1 text-xs text-slate-300">
                {locale === 'es'
                  ? 'Armamento: Enraged Kromede Rod +15 ◆2 | Nuakum Guard +15 ◆1 | Set Nuakum 7/7 (+12) | 5/5 Arcanas Doradas'
                  : 'Loadout: Enraged Kromede Rod +15 ◆2 | Nuakum Guard +15 ◆1 | 7/7 Nuakum Set (+12) | 5/5 Gold Arcanas'}
              </p>
            </div>
            <a
              href="https://shugo.gg/character/global/nae-azphel/Voidex"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-amber-500 hover:bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 transition"
            >
              Ver Perfil en Shugo.gg ↗
            </a>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-4">
              <h3 className="text-xs font-bold uppercase text-amber-400">
                {locale === 'es'
                  ? '1. Prioridad #1 de Estadística: Golpe % (Double Chance)'
                  : '1. #1 Stat Priority: Double Chance (Smite / Golpe %)'}
              </h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                {locale === 'es'
                  ? 'En el cliente en español, "Double Chance / Smite" se traduce como "Golpe %". Otorga la probabilidad de duplicar tu daño x2 en cada impacto. Búscala siempre en la Ranura 4 de Special Insight y en el Espejo de Magia (Lumiel).'
                  : 'In the Spanish client, "Double Chance / Smite" is translated as "Golpe %". It grants the chance to deal 2x damage on hit. Prioritize it in Slot 4 of Special Insight and Magic Mirror (Lumiel).'}
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-4">
              <h3 className="text-xs font-bold uppercase text-sky-400">
                {locale === 'es'
                  ? '2. Fractura Sombría (Dark Crush) Nivel 16 (0s Cooldown)'
                  : '2. Dark Crush Level 16 (0s Cooldown Specialty)'}
              </h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                {locale === 'es'
                  ? 'Al alcanzar Nivel 16 (10 base + 4 Daevanion + 2 por Arcana/Anillo), se activa la Especialidad Roja que ELIMINA el enfriamiento dentro del combo, junto con la Dorada (100% Crítico garantizado).'
                  : 'Reaching Level 16 (10 base + 4 Daevanion + 2 via Arcana/Ring) unlocks the Red Specialty that REMOVES cooldown inside combos, paired with the Gold Specialty (100% guaranteed Crit).'}
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-4">
              <h3 className="text-xs font-bold uppercase text-emerald-400">
                {locale === 'es'
                  ? '3. Supervivencia en Fire Temple (Kromede)'
                  : '3. Fire Temple (Kromede) Survival Protocol'}
              </h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                {locale === 'es'
                  ? 'Ataca SIEMPRE por la espalda de Kromede para evitar su cleave frontal y amplificar Back Damage Boost. Guarda Palabra de Protección para la fase de Enrage (<30% HP).'
                  : 'ALWAYS attack from Kromede’s back to avoid frontal cleaves and trigger Back Damage Boost. Save Protective Word for the Enrage phase (<30% HP).'}
              </p>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase">
                <tr>
                  <th className="px-3 py-2">Español (ES)</th>
                  <th className="px-3 py-2">Inglés (EN)</th>
                  <th className="px-3 py-2">Prioridad</th>
                  <th className="px-3 py-2">Función y Mecánica Clave</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {CHANTER_SKILLS_SEED.map((sk) => (
                  <tr key={sk.nameEn}>
                    <td className="px-3 py-2.5 font-bold text-amber-300">{sk.nameEs}</td>
                    <td className="px-3 py-2.5 text-white">{sk.nameEn}</td>
                    <td className="px-3 py-2.5">
                      <span className="rounded bg-sky-500/20 px-2 py-0.5 font-mono text-[10px] text-sky-300">
                        {sk.priorityBadge}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-300">
                      {locale === 'es' ? sk.roleEs : sk.roleEn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Perfil y Guía de Duboox (Gladiator) + Ranuras en Línea vs Macros */}
        <div className="rounded-xl border border-sky-500/30 bg-slate-900/90 p-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="rounded bg-sky-500/20 px-2.5 py-1 text-xs font-bold text-sky-300">
                ALT FARMER & WARHOUSE BRIDGE • GLADIATOR LV. 45
              </span>
              <h2 className="mt-2 text-xl font-extrabold text-white">
                ⚔️ Duboox — 1,518 GS | 74,800 CP (Motor Secundario de Conquista)
              </h2>
              <p className="mt-1 text-xs text-slate-300">
                {locale === 'es'
                  ? 'Ranura en Línea (Nativa, Latencia Cero) vs. Macros con Temporizador: Usa siempre Ranura en Línea en RMB, Q y E.'
                  : 'Inline Skill Slot (Native Zero-Latency) vs. Timed Macros: Always use Inline Skill Slots on RMB, Q, and E.'}
              </p>
            </div>
            <a
              href="https://shugo.gg/character/global/nae-azphel/Duboox"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-sky-500 hover:bg-sky-400 px-4 py-2 text-xs font-bold text-slate-950 transition"
            >
              Ver Perfil en Shugo.gg ↗
            </a>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase">
                <tr>
                  <th className="px-3 py-2">Español (ES)</th>
                  <th className="px-3 py-2">Inglés (EN)</th>
                  <th className="px-3 py-2">Tipo</th>
                  <th className="px-3 py-2">Rol en Rotación y Asignación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {GLADIATOR_SKILLS_SEED.map((sk) => (
                  <tr key={sk.nameEn}>
                    <td className="px-3 py-2.5 font-bold text-sky-300">{sk.nameEs}</td>
                    <td className="px-3 py-2.5 text-white">{sk.nameEn}</td>
                    <td className="px-3 py-2.5">
                      <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-amber-300">
                        {sk.category}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-300">
                      {locale === 'es' ? sk.roleEs : sk.roleEn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (activeSection === 'ECONOMY') {
    const totalKinahCost = qunaChestsCount * 2200000;
    const grossQuna = qunaChestsCount * qunaListingPrice;
    const netQunaAfterTax = Math.round(grossQuna * 0.9);

    return (
      <div className="space-y-6">
        {/* Tabla de Rendimiento de Mazmorras de Conquista y Trascendencia */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5">
          <h2 className="text-base font-bold text-amber-400">
            {locale === 'es'
              ? '💰 Rendimiento Garantizado en Mazmorras de Conquista y Trascendencia'
              : '💰 Guaranteed Kinah Yield in Conquest & Transcendence Dungeons'}
          </h2>
          <p className="mt-1 text-xs text-slate-300">
            {locale === 'es'
              ? 'Comprar las 20 Piedras de Odyle semanales (2M Kinah) con Voidex + 20 con Duboox genera +8.000.000 Kinah netos garantizados por semana.'
              : 'Buying the 20 weekly Odyle Stones (2M Kinah) on Voidex + 20 on Duboox yields +8,000,000 net guaranteed Kinah per week.'}
          </p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase">
                <tr>
                  <th className="px-3 py-2.5">Mazmorra</th>
                  <th className="px-3 py-2.5 text-center">GS / CP Grupo</th>
                  <th className="px-3 py-2.5 text-right">1 Cubo (40 Odyle)</th>
                  <th className="px-3 py-2.5 text-right">2 Cubos Sub (80 Odyle)</th>
                  <th className="px-3 py-2.5 text-right">Beneficio Neto (10 Runs)</th>
                  <th className="px-3 py-2.5">Botín Clave</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {DUNGEON_YIELDS_SEED.map((d) => (
                  <tr key={d.name} className="hover:bg-slate-800/40">
                    <td className="px-3 py-2.5 font-bold text-white">{d.name}</td>
                    <td className="px-3 py-2.5 text-center font-mono text-sky-300">
                      {d.minGs} GS ({d.partyCp})
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-300">
                      {d.kinahSingleCube.toLocaleString()} K
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono font-bold text-amber-300">
                      {d.kinahSubDoubleCube.toLocaleString()} K
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono font-bold text-emerald-400">
                      +{d.netProfit10RunsWithOdyleBuy.toLocaleString()} K
                    </td>
                    <td className="px-3 py-2.5 text-slate-300">
                      {locale === 'es' ? d.keyDropsEs : d.keyDropsEn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Simulador de Conversión Kinah -> Quna y Ciclo de Autosuficiencia */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-emerald-500/30 bg-slate-900/90 p-5">
            <h3 className="text-sm font-bold text-emerald-400">
              {locale === 'es'
                ? '🔄 Calculadora de Conversión Kinah ➔ Quna (Los 3 Peajes Reales)'
                : '🔄 Kinah ➔ Quna Conversion Calculator (The 3 Real Tolls)'}
            </h3>
            <p className="mt-1 text-xs text-slate-300">
              {locale === 'es'
                ? 'Empaquetar un cofre de 2.000.000 Kinah en Substance Morph cobra 2.200.000 Kinah (+10% recargo), y al retirar la Quna del correo se retiene un 10%.'
                : 'Packing a 2,000,000 Kinah box in Substance Morph costs 2,200,000 Kinah (+10% fee), plus a 10% tax when claiming Quna from mail.'}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400">
                  {locale === 'es' ? 'Cofres de 2M a empaquetar:' : '2M Boxes to pack:'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={qunaChestsCount}
                  onChange={(e) =>
                    setQunaChestsCount(Math.max(1, Number.parseInt(e.target.value || '1', 10)))
                  }
                  className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-1.5 font-mono text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400">
                  {locale === 'es' ? 'Precio Venta por Cofre (Quna):' : 'Sale Price per Box (Quna):'}
                </label>
                <input
                  type="number"
                  min={100}
                  value={qunaListingPrice}
                  onChange={(e) =>
                    setQunaListingPrice(Math.max(1, Number.parseInt(e.target.value || '800', 10)))
                  }
                  className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-1.5 font-mono text-xs text-white"
                />
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Coste Total en Kinah (+10% Morph):</span>
                <strong className="font-mono text-rose-300">
                  {totalKinahCost.toLocaleString()} Kinah
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Quna Bruta de Venta:</span>
                <strong className="font-mono text-slate-200">
                  {grossQuna.toLocaleString()} Quna
                </strong>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-1.5">
                <span className="text-emerald-300 font-bold">
                  Quna Líquida Neta en tu Cuenta (90%):
                </span>
                <strong className="font-mono text-sm text-emerald-400">
                  +{netQunaAfterTax.toLocaleString()} Quna
                </strong>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-rose-500/30 bg-slate-900/90 p-5">
            <h3 className="text-sm font-bold text-rose-400">
              {locale === 'es'
                ? '🛑 Post-Mortem Documentado: El Puente de Almacén vs. La Trampa del RNG'
                : '🛑 Documented Post-Mortem: Warehouse Bridge vs. Compound RNG Trap'}
            </h3>
            <ul className="mt-3 space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <li>
                <strong className="text-emerald-300">
                  ✅ Técnica "Puente de Almacén" (Aluckyro):
                </strong>{' '}
                Pasa el equipo de tu Main (`Voidex`) por el Almacén Compartido a tu Alter (`Duboox`), encántalo a +10 gastando las Piedras de Mejora y Kinah Vinculada del Alter, y devuélvelo al Main. *(Nota: NUNCA encantes a +10 un ítem basura solo para disolverlo, porque gasta más piedras de las que devuelve).*
              </li>
              <li>
                <strong className="text-rose-300">
                  ❌ Prohibido Reinvertir Kinah Comprando Mats para Doble Proc (25% × 25% = 6.25%):
                </strong>{' '}
                En la prueba real con la cadena de Anillos de Zafiro, usar materiales propios dio 5–6M Kinah, pero reinvertir comprando materiales en el Broker sufrió una racha fría (*Cold Streak*) que drenó el capital a 1M. **Jamás compres materiales en el Broker para recetas dependientes de procs compuestos.**
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // CHECKLIST INTERACTIVO GUARDADO EN INDEXEDDB
  const completedCount = CHECKLIST_TASKS_SEED.filter((t) => completedMap[t.id]).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/90 p-4">
        <div>
          <h2 className="text-base font-bold text-white">
            {locale === 'es'
              ? '✅ Checklist Interactivo Diario, Semanal y Ruta Express de Duboox'
              : '✅ Interactive Daily, Weekly & Duboox Express Checklist'}
          </h2>
          <p className="text-xs text-slate-400">
            {locale === 'es'
              ? `Progreso guardado automáticamente en tu IndexedDB local: ${completedCount} / ${CHECKLIST_TASKS_SEED.length} completadas`
              : `Progress automatically saved in your local IndexedDB: ${completedCount} / ${CHECKLIST_TASKS_SEED.length} completed`}
          </p>
        </div>

        <button
          type="button"
          onClick={() => void resetAllTasks()}
          className="rounded-lg bg-slate-800 hover:bg-slate-700 px-3.5 py-2 text-xs font-bold text-amber-300 cursor-pointer"
        >
          {locale === 'es' ? 'Reiniciar Casillas' : 'Reset Checkboxes'}
        </button>
      </div>

      <div className="grid gap-3">
        {CHECKLIST_TASKS_SEED.map((task) => {
          const isDone = Boolean(completedMap[task.id]);
          return (
            <div
              key={task.id}
              onClick={() => void toggleChecklistTask(task.id)}
              className={`flex items-start justify-between gap-4 rounded-xl border p-4 transition cursor-pointer ${
                isDone
                  ? 'border-emerald-500/40 bg-emerald-950/20 opacity-80'
                  : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => {}}
                  className="mt-1 h-4 w-4 rounded border-slate-600 accent-emerald-500"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                        task.frequency === 'DAILY'
                          ? 'bg-sky-500/20 text-sky-300'
                          : task.frequency === 'WEEKLY'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-purple-500/20 text-purple-300'
                      }`}
                    >
                      {task.frequency}
                    </span>
                    <h3
                      className={`text-sm font-bold ${
                        isDone ? 'line-through text-slate-400' : 'text-white'
                      }`}
                    >
                      {locale === 'es' ? task.titleEs : task.titleEn}
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-slate-300">
                    {locale === 'es' ? task.descriptionEs : task.descriptionEn}
                  </p>
                </div>
              </div>

              <span className="shrink-0 rounded-lg bg-slate-950 border border-slate-800 px-2.5 py-1 font-mono text-xs font-semibold text-emerald-400">
                {locale === 'es' ? task.rewardBadgeEs : task.rewardBadgeEn}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
