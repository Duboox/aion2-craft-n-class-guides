/**
 * Diccionario de internacionalización (i18n) estrictamente tipado (Español ⇄ Inglés).
 */
import type { Locale } from '../domain/models/types';

export interface TranslationsDictionary {
  readonly headerTitle: string;
  readonly headerSubtitle: string;
  readonly navAuditor: string;
  readonly navClasses: string;
  readonly navCharacters: string;
  readonly navBosses: string;
  readonly navTools: string;
  readonly navExplorer: string;
  readonly navGlossary: string;
  readonly dbStatusTitle: string;
  readonly dbCatalogLabel: string;
  readonly dbMarketLabel: string;
  readonly dbVendorLabel: string;
  readonly dbMorphLabel: string;
  readonly dbRecipesLabel: string;
  readonly dbLastSync: string;
  readonly btnRefreshLive: string;
  readonly btnReseed: string;
  readonly btnClearDb: string;
  readonly msgRefreshing: string;
  readonly msgCleared: string;
  readonly msgReseeded: string;
  readonly msgLiveUpdated: string;
  readonly searchPlaceholder: string;
  readonly batchLabel: string;
  readonly colRecipe: string;
  readonly colSuccess: string;
  readonly colBrokerPrice: string;
  readonly colNpcCost: string;
  readonly colAttemptCost: string;
  readonly colExpectedNet: string;
  readonly colProfitBuyAll: string;
  readonly colValueAddedOwn: string;
  readonly colVerdict: string;
  readonly verdictProfitable: string;
  readonly verdictGoldmine: string;
  readonly verdictDestroys: string;
  readonly verdictLow: string;
  readonly formulaBannerTitle: string;
  readonly formulaBannerDesc: string;
}

export const TRANSLATIONS: Readonly<Record<Locale, TranslationsDictionary>> = {
  es: {
    headerTitle: 'Aion 2 — Hub Oficial de Crafteo, Clases, Personajes y Herramientas',
    headerSubtitle:
      'Ecosistema Completo: 242 Recetas Reales × Precios Broker × 8 Guías de Clase × Inspector Shugo.gg & Leaderboard',
    navAuditor: '📊 Crafteo & Mercado (242)',
    navClasses: '⚔️ Guías de Clases (8)',
    navCharacters: '🏆 Mis PJs & Leaderboard',
    navBosses: '🐉 Bosses, Mecánicas & Settings',
    navTools: '🛠️ Herramientas & Mazmorras',
    navExplorer: '🗄️ Base de Datos (6.637)',
    navGlossary: '📚 Glosario & Checklist',
    dbStatusTitle: 'Motor IndexedDB Local + Selector de Servidor (Patrón Repository)',
    dbCatalogLabel: 'Catálogo Ítems',
    dbMarketLabel: 'Precios Broker',
    dbVendorLabel: 'Precios PNJ',
    dbMorphLabel: 'Transmutación',
    dbRecipesLabel: 'Recetas Cliente',
    dbLastSync: 'Sincronizado',
    btnRefreshLive: '🔄 Refrescar API',
    btnReseed: '♻️ Recargar Semilla',
    btnClearDb: '🗑️ Vaciar IndexedDB',
    msgRefreshing: 'Consultando API de aion2.exchange y actualizando IndexedDB...',
    msgCleared:
      'Base de datos IndexedDB vaciada. Pulsa "Recargar Semilla" para reindexar los datos base.',
    msgReseeded: 'Semilla estática (242 recetas y 6.637 ítems) reindexada en IndexedDB.',
    msgLiveUpdated: 'Precios del servidor sincronizados en IndexedDB.',
    searchPlaceholder: 'Buscar por nombre, profesión o ingrediente...',
    batchLabel: 'Lote:',
    colRecipe: 'Nombre de Receta',
    colSuccess: 'Éxito / Proc',
    colBrokerPrice: 'Precio Broker',
    colNpcCost: 'Coste Fijo PNJ',
    colAttemptCost: 'Coste Intento',
    colExpectedNet: 'Retorno Neto (× Éxito)',
    colProfitBuyAll: 'Escenario A: Comprando 100%',
    colValueAddedOwn: 'Escenario B: Valor Añadido (Mats Propios vs Crudo)',
    colVerdict: 'Veredicto',
    verdictProfitable: 'RENTABLE (Compra y Propios)',
    verdictGoldmine: 'ORO PURO (Solo Mats Bound)',
    verdictDestroys: 'DESTRUYE VALOR (Vende Crudo)',
    verdictLow: 'MARGEN BAJO / NEUTRO',
    formulaBannerTitle: 'Regla Matemática de Coste de Oportunidad:',
    formulaBannerDesc:
      'Valor Añadido Real = (Venta Neta 90% × Tasa Éxito) − Coste Fijo PNJ − (Valor de Mercado de Tus Mats Crudos × 90%). Si es negativo, fabricar con tus propios materiales destruye valor frente a venderlos crudos.',
  },
  en: {
    headerTitle: 'Aion 2 — Official Crafting, Classes, Character Inspector & Tools Hub',
    headerSubtitle:
      'Full Ecosystem: 242 Client Recipes × Broker Prices × 8 Class Guides × Shugo.gg Inspector & Leaderboard',
    navAuditor: '📊 Crafting & Market (242)',
    navClasses: '⚔️ Class Guides (8)',
    navCharacters: '🏆 My Chars & Leaderboard',
    navBosses: '🐉 Bosses, Mechanics & Settings',
    navTools: '🛠️ Tools & Dungeons',
    navExplorer: '🗄️ Database (6,637)',
    navGlossary: '📚 Glossary & Checklist',
    dbStatusTitle: 'Browser IndexedDB Engine + Server Selector (Repository Pattern)',
    dbCatalogLabel: 'Item Catalog',
    dbMarketLabel: 'Broker Prices',
    dbVendorLabel: 'NPC Prices',
    dbMorphLabel: 'Substance Morphs',
    dbRecipesLabel: 'Client Recipes',
    dbLastSync: 'Last Synced',
    btnRefreshLive: '🔄 Refresh API',
    btnReseed: '♻️ Re-seed Cache',
    btnClearDb: '🗑️ Clear IndexedDB',
    msgRefreshing: 'Querying aion2.exchange API and updating IndexedDB...',
    msgCleared:
      'IndexedDB database cleared. Click "Re-seed Cache" to re-index base datasets.',
    msgReseeded: 'Static seed (242 recipes & 6,637 items) re-indexed into IndexedDB.',
    msgLiveUpdated: 'Server market prices synced into IndexedDB.',
    searchPlaceholder: 'Search by name, profession, or ingredient...',
    batchLabel: 'Batch:',
    colRecipe: 'Recipe Name',
    colSuccess: 'Success / Proc',
    colBrokerPrice: 'Broker Price',
    colNpcCost: 'Fixed NPC Cost',
    colAttemptCost: 'Attempt Cost',
    colExpectedNet: 'Expected Net (× Success)',
    colProfitBuyAll: 'Scenario A: Buying 100%',
    colValueAddedOwn: 'Scenario B: Value Added (Own Mats vs Raw)',
    colVerdict: 'Verdict',
    verdictProfitable: 'PROFITABLE (Buy & Own)',
    verdictGoldmine: 'GOLDMINE (Bound Mats Only)',
    verdictDestroys: 'DESTROYS VALUE (Sell Raw)',
    verdictLow: 'LOW MARGIN / NEUTRAL',
    formulaBannerTitle: 'Mathematical Opportunity Cost Rule:',
    formulaBannerDesc:
      'Real Value Added = (90% Net Sale × Base Success Rate) − Fixed NPC Cost − (90% Raw Market Value of Your Gathered Mats). If negative, crafting your own materials loses money compared to selling them raw.',
  },
};
