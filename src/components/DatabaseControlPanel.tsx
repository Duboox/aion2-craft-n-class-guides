'use client';

import React, { useState } from 'react';
import { FEATURED_SERVERS } from '../config/endpoints.config';
import type { DatabaseStats, Locale, UserPreferences } from '../domain/models/types';
import { TRANSLATIONS } from '../i18n/translations';
import { aion2Repository } from '../infrastructure/repositories/aion2.repository';

interface DatabaseControlPanelProps {
  readonly locale: Locale;
  readonly stats: DatabaseStats;
  readonly userPrefs: UserPreferences;
  readonly onStatsChanged: (newStats: DatabaseStats) => void;
  readonly onDataMutated: () => Promise<void>;
  readonly onPrefsChanged: (newPrefs: UserPreferences) => Promise<void>;
}

export const DatabaseControlPanel: React.FC<DatabaseControlPanelProps> = ({
  locale,
  stats,
  userPrefs,
  onStatsChanged,
  onDataMutated,
  onPrefsChanged,
}) => {
  const t = TRANSLATIONS[locale];
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  const handleServerChange = async (e: React.ChangeEvent<HTMLSelectElement>): Promise<void> => {
    const newServerId = Number(e.target.value);
    const updated: UserPreferences = {
      ...userPrefs,
      selectedServerId: newServerId,
    };
    await onPrefsChanged(updated);
    setIsBusy(true);
    setStatusBanner(t.msgRefreshing);
    try {
      const result = await aion2Repository.refreshLiveMarketPrices(newServerId);
      const updatedStats = await aion2Repository.getDatabaseStats();
      onStatsChanged(updatedStats);
      await onDataMutated();
      setStatusBanner(`${t.msgLiveUpdated} (${result.updatedCount} ítems)`);
    } finally {
      setIsBusy(false);
    }
  };

  const handleToggleSubscription = async (): Promise<void> => {
    const updated: UserPreferences = {
      ...userPrefs,
      hasActiveSubscription: !userPrefs.hasActiveSubscription,
    };
    await onPrefsChanged(updated);
  };

  const handleRefreshLiveApi = async (): Promise<void> => {
    setIsBusy(true);
    setStatusBanner(t.msgRefreshing);
    try {
      const result = await aion2Repository.refreshLiveMarketPrices(userPrefs.selectedServerId);
      const updatedStats = await aion2Repository.getDatabaseStats();
      onStatsChanged(updatedStats);
      await onDataMutated();
      setStatusBanner(
        `${t.msgLiveUpdated} (${result.updatedCount} items — ${
          result.source === 'LIVE_API' ? 'LIVE API' : 'SEED FALLBACK'
        })`
      );
    } finally {
      setIsBusy(false);
    }
  };

  const handleReseedStatic = async (): Promise<void> => {
    setIsBusy(true);
    setStatusBanner(t.msgRefreshing);
    try {
      const updatedStats = await aion2Repository.reseedFromStaticFiles();
      onStatsChanged(updatedStats);
      await onDataMutated();
      setStatusBanner(t.msgReseeded);
    } finally {
      setIsBusy(false);
    }
  };

  const handleClearIndexedDB = async (): Promise<void> => {
    setIsBusy(true);
    try {
      await aion2Repository.clearAndDeleteIndexedDB();
      const emptyStats = await aion2Repository.getDatabaseStats();
      onStatsChanged(emptyStats);
      setStatusBanner(t.msgCleared);
    } finally {
      setIsBusy(false);
    }
  };

  const formattedDate = stats.lastSyncedAt
    ? new Date(stats.lastSyncedAt).toLocaleString(locale === 'es' ? 'es-ES' : 'en-US', {
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

  return (
    <section className="aion-card rounded-2xl p-4 mb-6">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        {/* Left: Server Selector + Subscription Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0b0e14] border border-[#263042] rounded-xl px-3 py-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9aa6bc]">
              {locale === 'es' ? 'Servidor:' : 'Server:'}
            </span>
            <select
              value={userPrefs.selectedServerId}
              onChange={(e) => void handleServerChange(e)}
              disabled={isBusy}
              className="bg-transparent text-sm font-bold text-[#f0d59a] focus:outline-none cursor-pointer"
            >
              {FEATURED_SERVERS.map((srv) => (
                <option key={srv.id} value={srv.id} className="bg-[#141a24] text-slate-100">
                  {srv.name} (#{srv.id})
                </option>
              ))}
            </select>
          </div>

          {/* Active Subscription Toggle */}
          <button
            type="button"
            onClick={() => void handleToggleSubscription()}
            className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all ${
              userPrefs.hasActiveSubscription
                ? 'bg-[#d9b36c]/15 border-[#d9b36c]/50 text-[#f0d59a]'
                : 'bg-[#0b0e14] border-[#263042] text-slate-400 hover:text-slate-200'
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                userPrefs.hasActiveSubscription
                  ? 'bg-[#6fd08c] shadow-[0_0_8px_#6fd08c]'
                  : 'bg-slate-600'
              }`}
            />
            <span>
              {userPrefs.hasActiveSubscription
                ? locale === 'es'
                  ? '👑 Membresía Activa (2 Cubos / 80 Odyle)'
                  : '👑 Active Subscription (2 Cubes / 80 Odyle)'
                : locale === 'es'
                  ? '👤 Modo F2P (1 Cubo / 40 Odyle)'
                  : '👤 F2P Mode (1 Cube / 40 Odyle)'}
            </span>
          </button>

          {/* Compact IndexedDB Counters */}
          <div className="hidden md:flex items-center gap-2 text-xs text-[#9aa6bc] bg-[#0b0e14]/80 border border-[#263042] rounded-xl px-3 py-2">
            <span>
              {t.dbRecipesLabel}:{' '}
              <strong className="text-[#f0d59a]">
                {stats.clientRecipesCount.toLocaleString()}
              </strong>
            </span>
            <span className="text-slate-700">|</span>
            <span>
              {t.dbMarketLabel}:{' '}
              <strong className="text-[#6fd08c]">
                {stats.marketItemsCount.toLocaleString()}
              </strong>
            </span>
            <span className="text-slate-700">|</span>
            <span>
              {t.dbCatalogLabel}:{' '}
              <strong className="text-slate-200">
                {stats.catalogCount.toLocaleString()}
              </strong>
            </span>
            <span className="text-slate-700">|</span>
            <span>
              {t.dbLastSync}: <strong className="text-slate-300">{formattedDate}</strong>
            </span>
          </div>
        </div>

        {/* Right: IndexedDB & API Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={isBusy}
            onClick={() => void handleRefreshLiveApi()}
            className="px-3.5 py-2 rounded-xl bg-[#d9b36c]/20 hover:bg-[#d9b36c]/30 disabled:opacity-50 text-[#f0d59a] text-xs font-bold border border-[#d9b36c]/40 transition"
          >
            {t.btnRefreshLive}
          </button>
          <button
            type="button"
            disabled={isBusy}
            onClick={() => void handleReseedStatic()}
            className="px-3.5 py-2 rounded-xl bg-[#1b2230] hover:bg-[#263042] disabled:opacity-50 text-slate-200 text-xs font-semibold border border-[#263042] transition"
          >
            {t.btnReseed}
          </button>
          <button
            type="button"
            disabled={isBusy}
            onClick={() => void handleClearIndexedDB()}
            className="px-3.5 py-2 rounded-xl bg-[#e5484d]/15 hover:bg-[#e5484d]/25 disabled:opacity-50 text-rose-300 text-xs font-semibold border border-[#e5484d]/30 transition"
          >
            {t.btnClearDb}
          </button>
        </div>
      </div>

      {statusBanner && (
        <div className="mt-3 px-3 py-2 rounded-lg bg-[#0b0e14] border border-[#263042] text-xs text-[#f0d59a] flex items-center justify-between">
          <span>{statusBanner}</span>
          <button
            type="button"
            onClick={() => setStatusBanner(null)}
            className="text-slate-400 hover:text-white ml-4 font-bold"
          >
            ✕
          </button>
        </div>
      )}
    </section>
  );
};
