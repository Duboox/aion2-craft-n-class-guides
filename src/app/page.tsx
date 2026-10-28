'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { ClassAndEconomyGuidesTab } from '../components/ClassAndEconomyGuidesTab';
import { CraftingAuditorDashboard } from '../components/CraftingAuditorDashboard';
import { DatabaseControlPanel } from '../components/DatabaseControlPanel';
import { DatabaseExplorerTab } from '../components/DatabaseExplorerTab';
import { ENDPOINTS_CONFIG } from '../config/endpoints.config';
import type {
  DatabaseStats,
  EvaluatedRecipeAudit,
  Locale,
  MarketItem,
  NpcVendorMaterial,
} from '../domain/models/types';
import { TRANSLATIONS } from '../i18n/translations';
import { aion2Repository } from '../infrastructure/repositories/aion2.repository';

type ActiveTab = 'AUDITOR' | 'EXPLORER' | 'CLASSES' | 'ECONOMY' | 'CHECKLIST';

const INITIAL_STATS: DatabaseStats = {
  catalogCount: 0,
  marketItemsCount: 0,
  vendorItemsCount: 0,
  morphCount: 0,
  lastSyncedAt: null,
  syncSource: 'EMPTY',
};

export default function HomePage(): React.ReactElement {
  const [locale, setLocale] = useState<Locale>('es');
  const [activeTab, setActiveTab] = useState<ActiveTab>('AUDITOR');
  const [stats, setStats] = useState<DatabaseStats>(INITIAL_STATS);
  const [audits, setAudits] = useState<readonly EvaluatedRecipeAudit[]>([]);
  const [marketItems, setMarketItems] = useState<readonly MarketItem[]>([]);
  const [vendorMaterials, setVendorMaterials] = useState<readonly NpcVendorMaterial[]>([]);
  const [isBusy, setIsBusy] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const t = TRANSLATIONS[locale];

  const reloadAllFromRepository = useCallback(async (): Promise<void> => {
    const [dbStats, evaluated, allMarket, allVendors] = await Promise.all([
      aion2Repository.getDatabaseStats(),
      aion2Repository.evaluateRecipes('All'),
      aion2Repository.getAllMarketItems(),
      aion2Repository.getAllVendorMaterials(),
    ]);
    setStats(dbStats);
    setAudits(evaluated);
    setMarketItems(allMarket);
    setVendorMaterials(allVendors);
  }, []);

  useEffect(() => {
    let mounted = true;
    const init = async (): Promise<void> => {
      setIsBusy(true);
      try {
        await aion2Repository.initializeDatabaseIfNeeded();
        if (mounted) {
          await reloadAllFromRepository();
        }
      } finally {
        if (mounted) {
          setIsBusy(false);
        }
      }
    };
    void init();
    return () => {
      mounted = false;
    };
  }, [reloadAllFromRepository]);

  const handleRefreshLiveApi = async (): Promise<void> => {
    setIsBusy(true);
    setStatusMessage(t.msgRefreshing);
    try {
      const result = await aion2Repository.refreshLiveMarketPrices();
      await reloadAllFromRepository();
      setStatusMessage(
        `${t.msgLiveUpdated} (${result.updatedCount} items • ${result.source})`
      );
    } finally {
      setIsBusy(false);
    }
  };

  const handleReseedDatabase = async (): Promise<void> => {
    setIsBusy(true);
    try {
      await aion2Repository.reseedFromStaticFiles();
      await reloadAllFromRepository();
      setStatusMessage(t.msgReseeded);
    } finally {
      setIsBusy(false);
    }
  };

  const handleClearDatabase = async (): Promise<void> => {
    setIsBusy(true);
    try {
      await aion2Repository.clearAndDeleteIndexedDB();
      const emptyStats = await aion2Repository.getDatabaseStats();
      setStats(emptyStats);
      setMarketItems([]);
      setVendorMaterials([]);
      setAudits([]);
      setStatusMessage(t.msgCleared);
    } finally {
      setIsBusy(false);
    }
  };

  const handleUpdateCustomPrice = async (
    itemKey: number,
    newPrice: number
  ): Promise<void> => {
    await aion2Repository.updateCustomItemPrice(itemKey, newPrice);
    await reloadAllFromRepository();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 py-3.5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[11px] font-bold text-amber-300">
                {t.serverBadge}
              </span>
            </div>
            <h1 className="mt-1 text-lg sm:text-xl font-extrabold tracking-tight text-white">
              {t.headerTitle}
            </h1>
            <p className="text-xs text-slate-400">{t.headerSubtitle}</p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <div className="inline-flex rounded-lg border border-slate-800 bg-slate-900 p-1">
              <button
                type="button"
                onClick={() => setLocale('es')}
                className={`rounded-md px-3 py-1 text-xs font-bold transition cursor-pointer ${
                  locale === 'es'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                🇪🇸 Español
              </button>
              <button
                type="button"
                onClick={() => setLocale('en')}
                className={`rounded-md px-3 py-1 text-xs font-bold transition cursor-pointer ${
                  locale === 'en'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                🇺🇸 English
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mx-auto max-w-7xl px-4 flex flex-wrap gap-1 border-t border-slate-900 pt-2 pb-2">
          {(
            [
              { id: 'AUDITOR', label: t.navAuditor },
              { id: 'EXPLORER', label: t.navExplorer },
              { id: 'CLASSES', label: t.navClasses },
              { id: 'ECONOMY', label: t.navEconomy },
              { id: 'CHECKLIST', label: t.navChecklist },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-sky-500 text-slate-950 shadow'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 space-y-6">
        <DatabaseControlPanel
          locale={locale}
          stats={stats}
          isBusy={isBusy}
          statusMessage={statusMessage}
          onRefreshLiveApi={handleRefreshLiveApi}
          onReseedDatabase={handleReseedDatabase}
          onClearDatabase={handleClearDatabase}
        />

        {activeTab === 'AUDITOR' && (
          <CraftingAuditorDashboard
            locale={locale}
            audits={audits}
            onUpdateCustomPrice={handleUpdateCustomPrice}
          />
        )}

        {activeTab === 'EXPLORER' && (
          <DatabaseExplorerTab
            locale={locale}
            marketItems={marketItems}
            vendorMaterials={vendorMaterials}
            onUpdateCustomPrice={handleUpdateCustomPrice}
          />
        )}

        {(activeTab === 'CLASSES' ||
          activeTab === 'ECONOMY' ||
          activeTab === 'CHECKLIST') && (
          <ClassAndEconomyGuidesTab locale={locale} activeSection={activeTab} />
        )}
      </main>

      {/* Footer con enlaces oficiales */}
      <footer className="border-t border-slate-800 bg-slate-950 py-5 text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <strong>Aion 2 Craft & Class Guides</strong> • Voidex & Duboox (Azphel #12106)
          </div>
          <div className="flex flex-wrap gap-4">
            <a
              href={ENDPOINTS_CONFIG.externalReferenceLinks.aion2Exchange}
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-400"
            >
              aion2.exchange ↗
            </a>
            <a
              href={ENDPOINTS_CONFIG.externalReferenceLinks.aion2GgCalcEs}
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-400"
            >
              aion2.gg Calculator ↗
            </a>
            <a
              href={ENDPOINTS_CONFIG.externalReferenceLinks.shugoVoidex}
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-400"
            >
              Shugo.gg Voidex ↗
            </a>
            <a
              href={ENDPOINTS_CONFIG.externalReferenceLinks.kanonBibleDoc}
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-400"
            >
              Kanon&apos;s Bible ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
