'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { BossesDungeonsSettingsTab } from '../components/BossesDungeonsSettingsTab';
import { CharacterAndLeaderboardTab } from '../components/CharacterAndLeaderboardTab';
import { ClassGuidesTab } from '../components/ClassGuidesTab';
import { CraftingAuditorDashboard } from '../components/CraftingAuditorDashboard';
import { DatabaseControlPanel } from '../components/DatabaseControlPanel';
import { DatabaseExplorerTab } from '../components/DatabaseExplorerTab';
import { GlossaryAndChecklistTab } from '../components/GlossaryAndChecklistTab';
import { ToolsAndDungeonsTab } from '../components/ToolsAndDungeonsTab';
import { ENDPOINTS_CONFIG, FEATURED_SERVERS } from '../config/endpoints.config';
import type {
  DatabaseStats,
  EvaluatedRecipeAudit,
  Locale,
  RecipeFilterScope,
  UserPreferences,
} from '../domain/models/types';
import { TRANSLATIONS } from '../i18n/translations';
import { aion2Repository } from '../infrastructure/repositories/aion2.repository';

type MainTab =
  | 'AUDITOR'
  | 'CLASSES'
  | 'CHARACTERS'
  | 'BOSSES'
  | 'TOOLS'
  | 'EXPLORER'
  | 'GLOSSARY';

export default function HomePage(): React.ReactElement {
  const [locale, setLocale] = useState<Locale>('es');
  const [activeTab, setActiveTab] = useState<MainTab>('AUDITOR');
  const [recipeScope, setRecipeScope] = useState<RecipeFilterScope>('ALL_CLIENT');

  const [dbStats, setDbStats] = useState<DatabaseStats>({
    catalogCount: 0,
    marketItemsCount: 0,
    vendorItemsCount: 0,
    morphCount: 0,
    clientRecipesCount: 0,
    lastSyncedAt: null,
    syncSource: 'EMPTY',
  });

  const [userPrefs, setUserPrefs] = useState<UserPreferences>({
    selectedServerId: ENDPOINTS_CONFIG.defaultServerId,
    hasActiveSubscription: true,
    legionName: ENDPOINTS_CONFIG.defaultLegionName,
  });

  const [audits, setAudits] = useState<readonly EvaluatedRecipeAudit[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const t = TRANSLATIONS[locale];

  const loadAllData = useCallback(
    async (scopeOverride?: RecipeFilterScope): Promise<void> => {
      const targetScope = scopeOverride ?? recipeScope;
      const stats = await aion2Repository.initializeDatabaseIfNeeded();
      setDbStats(stats);
      const [prefs, evaluated] = await Promise.all([
        aion2Repository.getUserPreferences(),
        aion2Repository.evaluateRecipes('All', targetScope),
      ]);
      setUserPrefs(prefs);
      setAudits(evaluated);
      setRefreshTrigger((prev) => prev + 1);
    },
    [recipeScope]
  );

  useEffect(() => {
    void loadAllData();
  }, [loadAllData]);

  const handleScopeChange = async (newScope: RecipeFilterScope): Promise<void> => {
    setRecipeScope(newScope);
    await loadAllData(newScope);
  };

  const handleSavePrefs = async (newPrefs: UserPreferences): Promise<void> => {
    setUserPrefs(newPrefs);
    await aion2Repository.saveUserPreferences(newPrefs);
  };

  const activeServerObj =
    FEATURED_SERVERS.find((s) => s.id === userPrefs.selectedServerId) ??
    FEATURED_SERVERS[0];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Hero Header (Aion2-Guides Dark & Warm Gold Style) */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#0b0e14]/90 border-b border-[#263042]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#d9b36c]/20 text-[#f0d59a] border border-[#d9b36c]/50">
                  🛡️ Legión {userPrefs.legionName} • {activeServerObj.name}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#6fd08c]/15 text-[#6fd08c] border border-[#6fd08c]/30">
                  Client 2.0.8.0 • IndexedDB v2
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                {t.headerTitle}
              </h1>
              <p className="text-xs text-[#9aa6bc]">{t.headerSubtitle}</p>
            </div>

            {/* Language Switcher (ES / EN) */}
            <div className="flex items-center gap-2 self-start lg:self-center">
              <div className="inline-flex rounded-xl bg-[#141a24] p-1 border border-[#263042]">
                <button
                  type="button"
                  onClick={() => setLocale('es')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition ${
                    locale === 'es'
                      ? 'bg-[#d9b36c] text-[#0b0e14] shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🇪🇸 Español
                </button>
                <button
                  type="button"
                  onClick={() => setLocale('en')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition ${
                    locale === 'en'
                      ? 'bg-[#d9b36c] text-[#0b0e14] shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🇺🇸 English
                </button>
              </div>
            </div>
          </div>

          {/* 6-Tab Navigation Bar */}
          <nav className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-[#263042]/70">
            {(
              [
                { id: 'AUDITOR', label: t.navAuditor },
                { id: 'CLASSES', label: t.navClasses },
                { id: 'CHARACTERS', label: t.navCharacters },
                { id: 'BOSSES', label: t.navBosses },
                { id: 'TOOLS', label: t.navTools },
                { id: 'EXPLORER', label: t.navExplorer },
                { id: 'GLOSSARY', label: t.navGlossary },
              ] as const
            ).map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition border ${
                    isActive
                      ? 'bg-[#d9b36c] text-[#0b0e14] border-[#f0d59a] shadow-[0_0_20px_rgba(217,179,108,0.25)]'
                      : 'bg-[#141a24] text-slate-300 border-[#263042] hover:border-[#d9b36c]/50 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        <DatabaseControlPanel
          locale={locale}
          stats={dbStats}
          userPrefs={userPrefs}
          onStatsChanged={setDbStats}
          onDataMutated={() => loadAllData()}
          onPrefsChanged={handleSavePrefs}
        />

        {activeTab === 'AUDITOR' && (
          <CraftingAuditorDashboard
            locale={locale}
            audits={audits}
            activeScope={recipeScope}
            onScopeChange={(s) => void handleScopeChange(s)}
            onPriceUpdated={() => loadAllData()}
          />
        )}

        {activeTab === 'CLASSES' && <ClassGuidesTab locale={locale} />}

        {activeTab === 'CHARACTERS' && (
          <CharacterAndLeaderboardTab locale={locale} userPrefs={userPrefs} />
        )}

        {activeTab === 'BOSSES' && <BossesDungeonsSettingsTab locale={locale} />}

        {activeTab === 'TOOLS' && (
          <ToolsAndDungeonsTab
            locale={locale}
            userPrefs={userPrefs}
            onToggleSub={() =>
              handleSavePrefs({
                ...userPrefs,
                hasActiveSubscription: !userPrefs.hasActiveSubscription,
              })
            }
          />
        )}

        {activeTab === 'EXPLORER' && (
          <DatabaseExplorerTab
            locale={locale}
            refreshTrigger={refreshTrigger}
            onPriceUpdated={() => loadAllData()}
          />
        )}

        {activeTab === 'GLOSSARY' && <GlossaryAndChecklistTab locale={locale} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#263042] bg-[#0b0e14]/90 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9aa6bc]">
          <div>
            Aion 2 Community Hub •{' '}
            <strong className="text-[#f0d59a]">{userPrefs.legionName}</strong> • Next.js
            15 + Strict TypeScript + Tailwind CSS + Dexie IndexedDB
          </div>
          <div className="flex flex-wrap gap-4">
            <a
              href={ENDPOINTS_CONFIG.externalReferenceLinks.aion2GuidesHome}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#f0d59a] transition"
            >
              aion2-guides.info ↗
            </a>
            <a
              href={ENDPOINTS_CONFIG.externalReferenceLinks.shugoDatabaseEs}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#f0d59a] transition"
            >
              shugo.gg/database ↗
            </a>
            <a
              href={ENDPOINTS_CONFIG.externalReferenceLinks.questlogSkillBuilderEs}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#f0d59a] transition"
            >
              questlog.gg/skill-builder ↗
            </a>
            <a
              href={ENDPOINTS_CONFIG.externalReferenceLinks.questlogServerStatusEs}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#f0d59a] transition"
            >
              questlog.gg/server-status ↗
            </a>
            <a
              href={ENDPOINTS_CONFIG.externalReferenceLinks.aion2Exchange}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#f0d59a] transition"
            >
              aion2.exchange ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
