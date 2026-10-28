/**
 * Configuración centralizada de APIs externas, rutas estáticas y parámetros del servidor.
 * Si un endpoint de aion2.exchange o aion2.gg cambia en el futuro, solo se modifica este archivo.
 */

export interface ExternalEndpointsConfig {
  readonly defaultServerId: number;
  readonly defaultServerName: string;
  readonly brokerTax: {
    readonly salesTaxRate: number;
    readonly listingFeeRate: number;
    readonly netRetentionMultiplier: number;
  };
  readonly liveApi: {
    readonly exchangeItemsUrl: (serverId: number, limit?: number) => string;
    readonly exchangeCraftsUrl: (serverId: number) => string;
    readonly exchangeOverviewUrl: (serverId: number) => string;
    readonly corsProxies: readonly ((targetUrl: string) => string)[];
  };
  readonly staticSeedPaths: {
    readonly marketItems: string;
    readonly catalogItemsEnEs: string;
    readonly vendorPrices: string;
    readonly morphConversions: string;
    readonly fullAuditSnapshot: string;
  };
  readonly externalReferenceLinks: {
    readonly aion2Exchange: string;
    readonly aion2GgCalcEn: string;
    readonly aion2GgCalcEs: string;
    readonly shugoVoidex: string;
    readonly shugoDuboox: string;
    readonly kanonBibleDoc: string;
  };
}

const getBasePath = (): string => {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BASE_PATH) {
    return process.env.NEXT_PUBLIC_BASE_PATH;
  }
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/aion2-craft-n-class-guides')) {
    return '/aion2-craft-n-class-guides';
  }
  return '';
};

export const getStaticAssetUrl = (relativePath: string): string => {
  const base = getBasePath();
  const normalized = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  return `${base}${normalized}`;
};

export const ENDPOINTS_CONFIG: ExternalEndpointsConfig = {
  defaultServerId: 12106,
  defaultServerName: 'NA East - Azphel (Asmodian)',
  brokerTax: {
    salesTaxRate: 0.10,
    listingFeeRate: 0.02,
    netRetentionMultiplier: 0.90,
  },
  liveApi: {
    exchangeItemsUrl: (serverId: number, limit = 1000): string =>
      `https://aion2.exchange/api/items?server=${serverId}&limit=${limit}`,
    exchangeCraftsUrl: (serverId: number): string =>
      `https://aion2.exchange/api/crafts?server=${serverId}`,
    exchangeOverviewUrl: (serverId: number): string =>
      `https://aion2.exchange/api/overview?server=${serverId}`,
    corsProxies: [
      (targetUrl: string): string =>
        `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
      (targetUrl: string): string =>
        `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
    ],
  },
  staticSeedPaths: {
    marketItems: '/data/azphel_items_precios_mercado.json',
    catalogItemsEnEs: '/data/aion2gg_catalogo_items_en_es.json',
    vendorPrices: '/data/aion2gg_precios_pnj_oficiales.json',
    morphConversions: '/data/aion2gg_163_conversiones_transmutacion.json',
    fullAuditSnapshot: '/data/auditoria_completa_recetas_azphel.json',
  },
  externalReferenceLinks: {
    aion2Exchange: 'https://aion2.exchange/',
    aion2GgCalcEn: 'https://aion2.gg/tools/crafting-calculator',
    aion2GgCalcEs: 'https://aion2.gg/es/tools/crafting-calculator',
    shugoVoidex: 'https://shugo.gg/character/global/nae-azphel/Voidex',
    shugoDuboox: 'https://shugo.gg/character/global/nae-azphel/Duboox',
    kanonBibleDoc: 'https://docs.google.com/document/d/11u4wLCG1WfL-xSka2Aze0rI9vYRa7mq3N3Gp1bt0AWY/edit',
  },
};
