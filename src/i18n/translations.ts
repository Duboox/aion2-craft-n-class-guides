/**
 * Diccionario de internacionalización (i18n) estrictamente tipado (Español ⇄ Inglés).
 */
import type { Locale } from '../domain/models/types';

export interface TranslationsDictionary {
  readonly headerTitle: string;
  readonly headerSubtitle: string;
  readonly serverBadge: string;
  readonly navAuditor: string;
  readonly navExplorer: string;
  readonly navClasses: string;
  readonly navEconomy: string;
  readonly navChecklist: string;
  readonly dbStatusTitle: string;
  readonly dbCatalogLabel: string;
  readonly dbMarketLabel: string;
  readonly dbVendorLabel: string;
  readonly dbMorphLabel: string;
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
    headerTitle: 'Aion 2 — Centro Maestro de Crafteo, Mercado y Guías de Clase',
    headerSubtitle:
      'Auditoría Matemática en Vivo (aion2.gg Client 2.0.8.0 × aion2.exchange) con Base de Datos IndexedDB Local',
    serverBadge: 'Servidor: NA East - Azphel (Asmodian #12106) | Legión: SangreLatina',
    navAuditor: '📊 Auditor de Recetas y Calculadora',
    navExplorer: '🗄️ Explorador IndexedDB (6.637 Ítems)',
    navClasses: '⚔️ Guías de Clase (Chanter & Gladiator)',
    navEconomy: '💰 Economía, Mazmorras y Quna',
    navChecklist: '✅ Checklist Diario y Semanal',
    dbStatusTitle: 'Motor IndexedDB en el Navegador (Patrón Repository)',
    dbCatalogLabel: 'Catálogo EN/ES',
    dbMarketLabel: 'Precios Azphel',
    dbVendorLabel: 'Precios Fijos PNJ',
    dbMorphLabel: 'Transmutaciones',
    dbLastSync: 'Última Sincronización',
    btnRefreshLive: '🔄 Refrescar API en Vivo',
    btnReseed: '♻️ Recargar Semilla Base',
    btnClearDb: '🗑️ Eliminar IndexedDB / Caché',
    msgRefreshing: 'Consultando API de aion2.exchange y actualizando IndexedDB...',
    msgCleared: 'Base de datos IndexedDB eliminada por completo. Pulsa "Recargar Semilla Base" para reindexar.',
    msgReseeded: 'Semilla estática reindexada correctamente en IndexedDB.',
    msgLiveUpdated: 'Precios de Azphel sincronizados en IndexedDB.',
    searchPlaceholder: 'Buscar receta, material o ítem en Español o Inglés...',
    batchLabel: 'Multiplicador de Lote:',
    colRecipe: 'Receta (ES / EN)',
    colSuccess: 'Éxito / Proc',
    colBrokerPrice: 'Precio Broker',
    colNpcCost: 'Coste Fijo PNJ',
    colAttemptCost: 'Coste Intento',
    colExpectedNet: 'Retorno Neto (× Éxito)',
    colProfitBuyAll: 'Escenario A: Comprando 100%',
    colValueAddedOwn: 'Escenario B: Valor Añadido (Mats Propios vs Crudo)',
    colVerdict: 'Veredicto Matemático',
    verdictProfitable: 'RENTABLE (Compra y Propios)',
    verdictGoldmine: 'ORO PURO (Solo Mats Bound)',
    verdictDestroys: 'DESTRUYE VALOR (Vende Crudo)',
    verdictLow: 'MARGEN BAJO / NEUTRO',
    formulaBannerTitle: 'Demostración Matemática del Coste de Oportunidad:',
    formulaBannerDesc:
      'Valor Añadido Real = (Venta Neta 90% × Tasa Éxito) − Coste Fijo PNJ − (Valor de Mercado de Tus Mats Crudos × 90%). Si es negativo, fabricar con tus propios materiales te hace perder dinero frente a venderlos crudos en el Broker.',
  },
  en: {
    headerTitle: 'Aion 2 — Master Crafting, Broker Market & Class Guides Hub',
    headerSubtitle:
      'Live Mathematical Audit (aion2.gg Client 2.0.8.0 × aion2.exchange) Powered by Browser IndexedDB',
    serverBadge: 'Server: NA East - Azphel (Asmodian #12106) | Legion: SangreLatina',
    navAuditor: '📊 Recipe Auditor & Calculator',
    navExplorer: '🗄️ IndexedDB Explorer (6,637 Items)',
    navClasses: '⚔️ Class Guides (Chanter & Gladiator)',
    navEconomy: '💰 Economy, Dungeons & Quna',
    navChecklist: '✅ Daily & Weekly Checklist',
    dbStatusTitle: 'Browser IndexedDB Engine (Repository Pattern)',
    dbCatalogLabel: 'EN/ES Catalog',
    dbMarketLabel: 'Azphel Prices',
    dbVendorLabel: 'Fixed NPC Prices',
    dbMorphLabel: 'Substance Morphs',
    dbLastSync: 'Last Synced',
    btnRefreshLive: '🔄 Refresh Live API',
    btnReseed: '♻️ Re-seed Base Cache',
    btnClearDb: '🗑️ Delete IndexedDB / Cache',
    msgRefreshing: 'Querying aion2.exchange API and updating IndexedDB...',
    msgCleared: 'IndexedDB database completely deleted. Click "Re-seed Base Cache" to re-index.',
    msgReseeded: 'Static seed successfully re-indexed into IndexedDB.',
    msgLiveUpdated: 'Azphel market prices synced into IndexedDB.',
    searchPlaceholder: 'Search recipe, material, or item in Spanish or English...',
    batchLabel: 'Batch Multiplier:',
    colRecipe: 'Recipe (ES / EN)',
    colSuccess: 'Success / Proc',
    colBrokerPrice: 'Broker Price',
    colNpcCost: 'Fixed NPC Cost',
    colAttemptCost: 'Attempt Cost',
    colExpectedNet: 'Expected Net (× Success)',
    colProfitBuyAll: 'Scenario A: Buying 100%',
    colValueAddedOwn: 'Scenario B: Value Added (Own Mats vs Raw)',
    colVerdict: 'Mathematical Verdict',
    verdictProfitable: 'PROFITABLE (Buy & Own)',
    verdictGoldmine: 'GOLDMINE (Bound Mats Only)',
    verdictDestroys: 'DESTROYS VALUE (Sell Raw)',
    verdictLow: 'LOW MARGIN / NEUTRAL',
    formulaBannerTitle: 'Mathematical Opportunity Cost Proof:',
    formulaBannerDesc:
      'Real Value Added = (90% Net Sale × Base Success Rate) − Fixed NPC Cost − (90% Raw Market Value of Your Gathered Mats). If negative, crafting your own materials loses money compared to selling them raw on the Broker.',
  },
};
