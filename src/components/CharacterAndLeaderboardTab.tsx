'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { ENDPOINTS_CONFIG, FEATURED_SERVERS } from '../config/endpoints.config';
import type {
  Locale,
  SavedCharacterConfig,
  ShugoCharacterProfile,
  ShugoLeaderboardEntry,
  UserPreferences,
} from '../domain/models/types';
import { aion2Repository } from '../infrastructure/repositories/aion2.repository';

interface CharacterAndLeaderboardTabProps {
  readonly locale: Locale;
  readonly userPrefs: UserPreferences;
}

const LEADERBOARD_CLASSES: readonly string[] = [
  'All',
  'Chanter',
  'Gladiator',
  'Templar',
  'Assassin',
  'Ranger',
  'Sorcerer',
  'Elementalist',
  'Cleric',
];

export const CharacterAndLeaderboardTab: React.FC<CharacterAndLeaderboardTabProps> = ({
  locale,
  userPrefs,
}) => {
  const [savedChars, setSavedChars] = useState<readonly SavedCharacterConfig[]>([]);
  const [charNameInput, setCharNameInput] = useState<string>('');
  const [charRoleInput, setCharRoleInput] = useState<'MAIN' | 'ALT'>('MAIN');
  const [charHasSubInput, setCharHasSubInput] = useState<boolean>(
    userPrefs.hasActiveSubscription
  );
  const [selectedServerId, setSelectedServerId] = useState<number>(
    userPrefs.selectedServerId
  );

  // Active inspected profile
  const [inspectedProfile, setInspectedProfile] =
    useState<ShugoCharacterProfile | null>(null);
  const [isInspecting, setIsInspecting] = useState<boolean>(false);
  const [inspectError, setInspectError] = useState<string | null>(null);

  // Live Leaderboard state
  const [lbClass, setLbClass] = useState<string>('Chanter');
  const [lbSortBy, setLbSortBy] = useState<'CP' | 'GS'>('CP');
  const [lbEntries, setLbEntries] = useState<readonly ShugoLeaderboardEntry[]>([]);
  const [isLoadingLb, setIsLoadingLb] = useState<boolean>(false);

  const activeServerInfo =
    FEATURED_SERVERS.find((s) => s.id === selectedServerId) ?? FEATURED_SERVERS[0];

  const loadSavedCharacters = useCallback(async (): Promise<void> => {
    const list = await aion2Repository.getSavedCharacters();
    setSavedChars(list);
  }, []);

  const loadLeaderboard = useCallback(
    async (shugoServerId: number, classFilter: string): Promise<void> => {
      setIsLoadingLb(true);
      try {
        const entries = await aion2Repository.fetchLeaderboard(
          shugoServerId,
          classFilter,
          50
        );
        setLbEntries(entries);
      } finally {
        setIsLoadingLb(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadSavedCharacters();
  }, [loadSavedCharacters]);

  useEffect(() => {
    setSelectedServerId(userPrefs.selectedServerId);
  }, [userPrefs.selectedServerId]);

  useEffect(() => {
    void loadLeaderboard(activeServerInfo.shugoServerId, lbClass);
  }, [activeServerInfo.shugoServerId, lbClass, loadLeaderboard]);

  const handleInspectCharacter = async (
    serverSlug: string,
    shugoServerId: number,
    nameToQuery: string
  ): Promise<void> => {
    const trimmed = nameToQuery.trim();
    if (!trimmed) return;
    setIsInspecting(true);
    setInspectError(null);
    try {
      const profile = await aion2Repository.fetchCharacterProfile(
        serverSlug,
        shugoServerId,
        trimmed
      );
      setInspectedProfile(profile);
      if (profile.className) {
        setLbClass(profile.className);
      }
    } catch (err) {
      setInspectError(
        err instanceof Error
          ? err.message
          : locale === 'es'
            ? 'No se pudo consultar el perfil en Shugo.gg.'
            : 'Could not fetch profile from Shugo.gg.'
      );
    } finally {
      setIsInspecting(false);
    }
  };

  const handleSaveCharacter = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const trimmed = charNameInput.trim();
    if (!trimmed) return;

    const srv =
      FEATURED_SERVERS.find((s) => s.id === selectedServerId) ?? FEATURED_SERVERS[0];

    const newChar: SavedCharacterConfig = {
      id: `${srv.id}_${trimmed.toLowerCase()}`,
      name: trimmed,
      serverId: srv.id,
      serverSlug: srv.shugoSlug,
      shugoServerId: srv.shugoServerId,
      role: charRoleInput,
      hasSubscription: charHasSubInput,
    };

    await aion2Repository.saveCharacterConfig(newChar);
    await loadSavedCharacters();
    setCharNameInput('');
    await handleInspectCharacter(srv.shugoSlug, srv.shugoServerId, trimmed);
  };

  const handleRemoveCharacter = async (id: string): Promise<void> => {
    await aion2Repository.removeCharacterConfig(id);
    await loadSavedCharacters();
  };

  const handleToggleCharSub = async (char: SavedCharacterConfig): Promise<void> => {
    await aion2Repository.saveCharacterConfig({
      ...char,
      hasSubscription: !char.hasSubscription,
    });
    await loadSavedCharacters();
  };

  const sortedLbEntries = [...lbEntries].sort((a, b) =>
    lbSortBy === 'CP' ? a.rankByCp - b.rankByCp : a.rankByGs - b.rankByGs
  );

  const savedNamesSet = new Set(savedChars.map((c) => c.name.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Top Privacy & Inspector Card */}
      <div className="aion-card-gold rounded-2xl p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-[#f0d59a] flex items-center gap-2">
              <span>🏆</span>
              <span>
                {locale === 'es'
                  ? 'Inspector de Personajes en Vivo (Shugo.gg) & Mis Personajes'
                  : 'Live Character Inspector (Shugo.gg) & My Characters'}
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              {locale === 'es'
                ? '🔒 Privacidad Total: Los nombres de tus personajes se guardan únicamente en el IndexedDB de tu navegador (nunca en el código público de GitHub).'
                : '🔒 Total Privacy: Your character names are stored strictly in your browser’s local IndexedDB (never hardcoded in the public GitHub repo).'}
            </p>
          </div>

          <a
            href={ENDPOINTS_CONFIG.externalReferenceLinks.shugoLeaderboardWeb}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-[#1b2230] hover:bg-[#263042] text-[#f0d59a] border border-[#d9b36c]/40 text-xs font-bold self-start transition"
          >
            🌐 Shugo.gg Leaderboard Oficial ↗
          </a>
        </div>

        {/* Form to Add / Inspect Character */}
        <form
          onSubmit={(e) => void handleSaveCharacter(e)}
          className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2"
        >
          <div className="md:col-span-3">
            <label className="block text-[11px] font-bold uppercase text-[#9aa6bc] mb-1">
              {locale === 'es' ? 'Servidor' : 'Server'}
            </label>
            <select
              value={selectedServerId}
              onChange={(e) => setSelectedServerId(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-[#0b0e14] border border-[#263042] text-xs font-bold text-slate-100"
            >
              {FEATURED_SERVERS.map((srv) => (
                <option key={srv.id} value={srv.id}>
                  {srv.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="block text-[11px] font-bold uppercase text-[#9aa6bc] mb-1">
              {locale === 'es' ? 'Nombre del Personaje' : 'Character Name'}
            </label>
            <input
              type="text"
              value={charNameInput}
              onChange={(e) => setCharNameInput(e.target.value)}
              placeholder={
                locale === 'es'
                  ? 'Ej. Nombre de tu PJ en el servidor...'
                  : 'e.g. Your character name...'
              }
              className="w-full px-3.5 py-2 rounded-xl bg-[#0b0e14] border border-[#263042] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d9b36c]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] font-bold uppercase text-[#9aa6bc] mb-1">
              {locale === 'es' ? 'Rol en Cuenta' : 'Account Role'}
            </label>
            <select
              value={charRoleInput}
              onChange={(e) => setCharRoleInput(e.target.value as 'MAIN' | 'ALT')}
              className="w-full px-3 py-2 rounded-xl bg-[#0b0e14] border border-[#263042] text-xs font-bold text-slate-100"
            >
              <option value="MAIN">👑 Main Principal</option>
              <option value="ALT">⚡ Alt Secundario</option>
            </select>
          </div>

          <div className="md:col-span-2 flex flex-col justify-end">
            <button
              type="button"
              onClick={() => setCharHasSubInput(!charHasSubInput)}
              className={`w-full px-3 py-2 rounded-xl border text-xs font-bold transition ${
                charHasSubInput
                  ? 'bg-[#6fd08c]/15 border-[#6fd08c]/50 text-[#6fd08c]'
                  : 'bg-[#0b0e14] border-[#263042] text-slate-400'
              }`}
            >
              {charHasSubInput
                ? locale === 'es'
                  ? '👑 Sub Activa (2 Cubos)'
                  : '👑 Sub Active (2 Cubes)'
                : locale === 'es'
                  ? '👤 Sin Sub (1 Cubo)'
                  : '👤 No Sub (1 Cube)'}
            </button>
          </div>

          <div className="md:col-span-2 flex flex-col justify-end">
            <button
              type="submit"
              disabled={isInspecting || !charNameInput.trim()}
              className="w-full px-4 py-2 rounded-xl bg-[#d9b36c] hover:bg-[#f0d59a] disabled:opacity-50 text-[#0b0e14] text-xs font-extrabold transition shadow"
            >
              {isInspecting
                ? locale === 'es'
                  ? 'Consultando...'
                  : 'Fetching...'
                : locale === 'es'
                  ? '➕ Guardar y Analizar'
                  : '➕ Save & Inspect'}
            </button>
          </div>
        </form>

        {/* Saved Characters Chips */}
        {savedChars.length > 0 && (
          <div className="pt-3 border-t border-[#263042] flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold text-[#9aa6bc]">
              {locale === 'es' ? 'Mis Personajes Guardados:' : 'My Saved Characters:'}
            </span>
            {savedChars.map((ch) => (
              <div
                key={ch.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0b0e14] border border-[#263042] text-xs"
              >
                <button
                  type="button"
                  onClick={() =>
                    void handleInspectCharacter(
                      ch.serverSlug,
                      ch.shugoServerId,
                      ch.name
                    )
                  }
                  className="font-bold text-[#f0d59a] hover:underline flex items-center gap-1.5"
                >
                  <span>{ch.role === 'MAIN' ? '👑' : '⚡'}</span>
                  <span>{ch.name}</span>
                  <span className="text-[10px] text-slate-400">({ch.serverSlug})</span>
                </button>

                <button
                  type="button"
                  onClick={() => void handleToggleCharSub(ch)}
                  title={
                    locale === 'es'
                      ? 'Alternar Membresía Activa (2 Cubos vs 1 Cubo)'
                      : 'Toggle Active Subscription (2 Cubes vs 1 Cube)'
                  }
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ch.hasSubscription
                      ? 'bg-[#6fd08c]/20 text-[#6fd08c]'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {ch.hasSubscription ? '2 Cubos (Sub)' : '1 Cubo (F2P)'}
                </button>

                <button
                  type="button"
                  onClick={() => void handleRemoveCharacter(ch.id)}
                  className="text-slate-500 hover:text-rose-400 font-bold ml-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {inspectError && (
          <div className="p-3 rounded-xl bg-[#e5484d]/15 border border-[#e5484d]/40 text-xs text-rose-200">
            ⚠️ {inspectError}
          </div>
        )}
      </div>

      {/* Inspected Character Profile Report & Smart Recommendations */}
      {inspectedProfile && (
        <div className="aion-card rounded-2xl p-6 space-y-6 border-[#d9b36c]/50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#263042]">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-2xl font-extrabold text-white">
                  {inspectedProfile.characterName}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#d9b36c]/20 text-[#f0d59a] border border-[#d9b36c]/40">
                  {inspectedProfile.className} • Lv. {inspectedProfile.level}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#1b2230] text-slate-300 border border-[#263042]">
                  {inspectedProfile.serverName} ({inspectedProfile.raceName})
                </span>
              </div>
              <p className="text-xs text-[#9aa6bc] mt-1">
                {locale === 'es' ? 'Título activo:' : 'Active Title:'}{' '}
                <strong className="text-slate-200">{inspectedProfile.titleName}</strong>
              </p>
            </div>

            {/* Live KPI Cards: CP, GS, Rank by CP, Rank by GS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-[#0b0e14] border border-[#d9b36c]/40 text-center">
                <span className="text-[10px] uppercase tracking-wider text-[#9aa6bc] block">
                  Combat Power (CP)
                </span>
                <strong className="text-lg font-extrabold text-[#f0d59a] font-mono">
                  {inspectedProfile.combatPower.toLocaleString()}
                </strong>
              </div>

              <div className="p-3 rounded-xl bg-[#0b0e14] border border-[#263042] text-center">
                <span className="text-[10px] uppercase tracking-wider text-[#9aa6bc] block">
                  Gear Score (GS)
                </span>
                <strong className="text-lg font-extrabold text-[#6fd08c] font-mono">
                  {inspectedProfile.gearScore.toLocaleString()}
                </strong>
              </div>

              <div className="p-3 rounded-xl bg-[#0b0e14] border border-[#8b95ff]/40 text-center">
                <span className="text-[10px] uppercase tracking-wider text-[#9aa6bc] block">
                  {locale === 'es' ? 'Rank Clase (por CP)' : 'Class Rank (by CP)'}
                </span>
                <strong className="text-lg font-extrabold text-[#8b95ff] font-mono">
                  {inspectedProfile.rankByCp ? `#${inspectedProfile.rankByCp}` : 'Top 100+'}
                </strong>
              </div>

              <div className="p-3 rounded-xl bg-[#0b0e14] border border-[#263042] text-center">
                <span className="text-[10px] uppercase tracking-wider text-[#9aa6bc] block">
                  {locale === 'es' ? 'Rank Clase (por GS)' : 'Class Rank (by GS)'}
                </span>
                <strong className="text-lg font-extrabold text-slate-100 font-mono">
                  {inspectedProfile.rankByGs ? `#${inspectedProfile.rankByGs}` : 'Top 100+'}
                </strong>
              </div>
            </div>
          </div>

          {/* Automated Smart Recommendations */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#f0d59a] flex items-center gap-2">
              <span>🧠</span>
              <span>
                {locale === 'es'
                  ? 'Recomendaciones Inteligentes de Progresión para este Personaje'
                  : 'Smart Progression Recommendations for This Character'}
              </span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {inspectedProfile.recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className={`p-4 rounded-xl border space-y-1 ${
                    rec.severity === 'CRITICAL'
                      ? 'bg-[#e5484d]/10 border-[#e5484d]/40'
                      : rec.severity === 'GOOD'
                        ? 'bg-[#6fd08c]/10 border-[#6fd08c]/40'
                        : 'bg-[#d9b36c]/10 border-[#d9b36c]/40'
                  }`}
                >
                  <div className="text-xs font-extrabold text-white">
                    {locale === 'es' ? rec.titleEs : rec.titleEn}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {locale === 'es' ? rec.detailEs : rec.detailEn}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment & Base Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#9aa6bc]">
                {locale === 'es'
                  ? `Equipo Equipado (${inspectedProfile.equipment.length} piezas)`
                  : `Equipped Gear (${inspectedProfile.equipment.length} pieces)`}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
                {inspectedProfile.equipment.map((eq, idx) => (
                  <div
                    key={`${eq.slotName}_${idx}`}
                    className="p-2.5 rounded-xl bg-[#0b0e14] border border-[#263042] flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="truncate">
                      <span className="text-[10px] text-[#9aa6bc] block">
                        {eq.slotName}
                      </span>
                      <strong className="text-slate-100 truncate block">
                        {eq.itemName}
                      </strong>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="px-2 py-0.5 rounded bg-[#d9b36c]/20 text-[#f0d59a] font-mono font-bold">
                        +{eq.enchantLevel}
                      </span>
                      {eq.exceedLevel > 0 && (
                        <span className="px-2 py-0.5 rounded bg-[#8b95ff]/20 text-[#8b95ff] font-mono font-bold">
                          ◆{eq.exceedLevel}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#9aa6bc]">
                {locale === 'es'
                  ? 'Estadísticas Base y Divinas (Shugo.gg)'
                  : 'Base & Divine Stats (Shugo.gg)'}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {inspectedProfile.stats.map((st, idx) => (
                  <div
                    key={`${st.name}_${idx}`}
                    className="p-2.5 rounded-xl bg-[#0b0e14] border border-[#263042] flex items-center justify-between text-xs"
                  >
                    <span className="text-[#9aa6bc] truncate">{st.name}</span>
                    <strong className="font-mono text-[#f0d59a] ml-2">
                      {st.value}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Shugo.gg Server Leaderboard Table (Rank by CP & Rank by GS) */}
      <div className="aion-card rounded-2xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-[#f0d59a] flex items-center gap-2">
              <span>📊</span>
              <span>
                {locale === 'es'
                  ? `Leaderboard en Vivo de ${activeServerInfo.name} (Posición por CP y por GS)`
                  : `Live ${activeServerInfo.name} Leaderboard (Rank by CP & Rank by GS)`}
              </span>
            </h3>
            <p className="text-xs text-[#9aa6bc]">
              {locale === 'es'
                ? 'Tus personajes guardados se resaltan automáticamente en dorado dentro del ranking.'
                : 'Your saved characters are automatically highlighted in gold inside the ranking.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Sort by CP vs Sort by GS */}
            <div className="flex items-center bg-[#0b0e14] p-1 rounded-xl border border-[#263042]">
              <button
                type="button"
                onClick={() => setLbSortBy('CP')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  lbSortBy === 'CP'
                    ? 'bg-[#d9b36c] text-[#0b0e14]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {locale === 'es' ? 'Ordenar por CP' : 'Sort by CP'}
              </button>
              <button
                type="button"
                onClick={() => setLbSortBy('GS')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  lbSortBy === 'GS'
                    ? 'bg-[#6fd08c] text-[#0b0e14]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {locale === 'es' ? 'Ordenar por GS' : 'Sort by GS'}
              </button>
            </div>
          </div>
        </div>

        {/* Class Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {LEADERBOARD_CLASSES.map((cls) => (
            <button
              key={cls}
              type="button"
              onClick={() => setLbClass(cls)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                lbClass === cls
                  ? 'bg-[#d9b36c]/20 text-[#f0d59a] border-[#d9b36c]'
                  : 'bg-[#0b0e14] text-slate-400 border-[#263042] hover:text-white'
              }`}
            >
              {cls === 'All' ? (locale === 'es' ? 'Todas las Clases' : 'All Classes') : cls}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0b0e14] border-b border-[#263042] text-[11px] uppercase tracking-wider text-[#9aa6bc]">
                <th className="py-3 px-4 text-center">Rank CP</th>
                <th className="py-3 px-4 text-center">Rank GS</th>
                <th className="py-3 px-4">
                  {locale === 'es' ? 'Personaje' : 'Character'}
                </th>
                <th className="py-3 px-4">{locale === 'es' ? 'Clase' : 'Class'}</th>
                <th className="py-3 px-4 text-right">Combat Power (CP)</th>
                <th className="py-3 px-4 text-right">Gear Score (GS)</th>
                <th className="py-3 px-4 text-right">Ratio CP/GS</th>
                <th className="py-3 px-4 text-center">
                  {locale === 'es' ? 'Acción' : 'Action'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263042]/60 text-xs">
              {isLoadingLb ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    {locale === 'es'
                      ? 'Consultando Leaderboard en vivo de Shugo.gg...'
                      : 'Loading live Leaderboard from Shugo.gg...'}
                  </td>
                </tr>
              ) : sortedLbEntries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    {locale === 'es'
                      ? 'Sin resultados de Leaderboard disponibles en este momento.'
                      : 'No Leaderboard entries available right now.'}
                  </td>
                </tr>
              ) : (
                sortedLbEntries.map((entry) => {
                  const isMySavedChar = savedNamesSet.has(entry.name.toLowerCase());
                  const cpPerGs =
                    entry.gearScore > 0
                      ? (entry.combatPower / entry.gearScore).toFixed(1)
                      : '—';

                  return (
                    <tr
                      key={`${entry.name}_${entry.rankByCp}`}
                      className={`transition ${
                        isMySavedChar
                          ? 'bg-[#d9b36c]/20 border-l-4 border-[#d9b36c]'
                          : 'hover:bg-[#1b2230]/70'
                      }`}
                    >
                      <td className="py-3 px-4 text-center font-mono font-extrabold text-[#f0d59a]">
                        #{entry.rankByCp}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-[#6fd08c]">
                        #{entry.rankByGs}
                      </td>
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                        <span>{entry.name}</span>
                        {isMySavedChar && (
                          <span className="px-2 py-0.5 rounded bg-[#d9b36c] text-[#0b0e14] text-[10px] font-extrabold">
                            MI PJ
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-300">{entry.className}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-[#f0d59a]">
                        {entry.combatPower.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-[#6fd08c]">
                        {entry.gearScore > 0 ? entry.gearScore.toLocaleString() : '—'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-300">
                        {cpPerGs}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            void handleInspectCharacter(
                              activeServerInfo.shugoSlug,
                              activeServerInfo.shugoServerId,
                              entry.name
                            )
                          }
                          className="px-2.5 py-1 rounded-lg bg-[#1b2230] hover:bg-[#d9b36c] hover:text-[#0b0e14] text-slate-200 text-[11px] font-bold border border-[#263042] transition"
                        >
                          🔍 {locale === 'es' ? 'Inspeccionar' : 'Inspect'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
