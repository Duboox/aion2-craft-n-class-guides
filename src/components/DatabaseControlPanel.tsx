'use client';

import React from 'react';
import type { DatabaseStats, Locale } from '../domain/models/types';
import { TRANSLATIONS } from '../i18n/translations';

export interface DatabaseControlPanelProps {
  readonly locale: Locale;
  readonly stats: DatabaseStats;
  readonly isBusy: boolean;
  readonly statusMessage: string | null;
  readonly onRefreshLiveApi: () => Promise<void>;
  readonly onReseedDatabase: () => Promise<void>;
  readonly onClearDatabase: () => Promise<void>;
}

export const DatabaseControlPanel: React.FC<DatabaseControlPanelProps> = ({
  locale,
  stats,
  isBusy,
  statusMessage,
  onRefreshLiveApi,
  onReseedDatabase,
  onClearDatabase,
}) => {
  const t = TRANSLATIONS[locale];

  const formattedTime = stats.lastSyncedAt
    ? new Date(stats.lastSyncedAt).toLocaleString(locale === 'es' ? 'es-ES' : 'en-US')
    : locale === 'es'
      ? 'Sin datos (Vaciada)'
      : 'Empty (Purged)';

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full ${
                stats.marketItemsCount > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              {t.dbStatusTitle}
            </h2>
            <span className="rounded bg-slate-800 px-2 py-0.5 text-xs font-mono text-sky-300">
              {stats.syncSource}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-300">
            <div className="rounded-lg bg-slate-950/80 px-3 py-1.5 border border-slate-800">
              <span className="text-slate-400">{t.dbCatalogLabel}: </span>
              <strong className="text-white font-mono">
                {stats.catalogCount.toLocaleString()}
              </strong>
            </div>
            <div className="rounded-lg bg-slate-950/80 px-3 py-1.5 border border-slate-800">
              <span className="text-slate-400">{t.dbMarketLabel}: </span>
              <strong className="text-emerald-400 font-mono">
                {stats.marketItemsCount.toLocaleString()}
              </strong>
            </div>
            <div className="rounded-lg bg-slate-950/80 px-3 py-1.5 border border-slate-800">
              <span className="text-slate-400">{t.dbVendorLabel}: </span>
              <strong className="text-amber-300 font-mono">
                {stats.vendorItemsCount.toLocaleString()}
              </strong>
            </div>
            <div className="rounded-lg bg-slate-950/80 px-3 py-1.5 border border-slate-800">
              <span className="text-slate-400">{t.dbMorphLabel}: </span>
              <strong className="text-sky-300 font-mono">
                {stats.morphCount.toLocaleString()}
              </strong>
            </div>
            <div className="rounded-lg bg-slate-950/80 px-3 py-1.5 border border-slate-800">
              <span className="text-slate-400">{t.dbLastSync}: </span>
              <strong className="text-slate-200 font-mono">{formattedTime}</strong>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={isBusy}
            onClick={() => void onRefreshLiveApi()}
            className="rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 px-3.5 py-2 text-xs font-semibold text-white transition shadow-sm cursor-pointer"
          >
            {t.btnRefreshLive}
          </button>

          <button
            type="button"
            disabled={isBusy}
            onClick={() => void onReseedDatabase()}
            className="rounded-lg bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 px-3.5 py-2 text-xs font-semibold text-white transition shadow-sm cursor-pointer"
          >
            {t.btnReseed}
          </button>

          <button
            type="button"
            disabled={isBusy}
            onClick={() => void onClearDatabase()}
            className="rounded-lg bg-rose-700 hover:bg-rose-600 disabled:opacity-50 px-3.5 py-2 text-xs font-semibold text-white transition shadow-sm cursor-pointer"
          >
            {t.btnClearDb}
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="mt-3 rounded-lg border border-sky-500/30 bg-sky-950/40 px-3 py-2 text-xs text-sky-200">
          {statusMessage}
        </div>
      )}
    </section>
  );
};
