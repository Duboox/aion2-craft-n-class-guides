/**
 * Configuración centralizada de APIs externas, rutas estáticas y parámetros del servidor.
 * Si un endpoint de aion2.exchange, aion2.gg, shugo.gg o questlog.gg cambia, solo se modifica este archivo.
 */
import type { ServerInfo } from '../domain/models/types';

export interface ExternalEndpointsConfig {
  readonly defaultServerId: number;
  readonly defaultServerName: string;
  readonly defaultLegionName: string;
  readonly brokerTax: {
    readonly salesTaxRate: number;
    readonly listingFeeRate: number;
    readonly netRetentionMultiplier: number;
  };
  readonly liveApi: {
    readonly exchangeItemsUrl: (serverId: number, limit?: number) => string;
    readonly exchangeCraftsUrl: (serverId: number) => string;
    readonly exchangeOverviewUrl: (serverId: number) => string;
    readonly shugoCharacterUrl: (serverSlug: string, characterName: string) => string;
    readonly shugoLeaderboardUrl: (
      shugoServerId: number,
      className?: string,
      limit?: number
    ) => string;
    readonly corsProxies: readonly ((targetUrl: string) => string)[];
  };
  readonly staticSeedPaths: {
    readonly marketItems: string;
    readonly catalogItemsEnEs: string;
    readonly vendorPrices: string;
    readonly morphConversions: string;
    readonly allClientRecipes: string;
    readonly serversList: string;
  };
  readonly externalReferenceLinks: {
    readonly aion2Exchange: string;
    readonly aion2GgCalcEn: string;
    readonly aion2GgCalcEs: string;
    readonly aion2GuidesHome: string;
    readonly shugoDatabaseEs: string;
    readonly shugoDatabaseEn: string;
    readonly shugoLeaderboardWeb: string;
    readonly questlogSkillBuilderEs: string;
    readonly questlogSkillBuilderEn: string;
    readonly questlogServerStatusEs: string;
    readonly questlogServerStatusEn: string;
    readonly kanonBibleDoc: string;
  };
}

export const FEATURED_SERVERS: readonly [ServerInfo, ...ServerInfo[]] = [
  {
    id: 12106,
    name: 'NAE - Azphel (Asmodian)',
    region: 'NAE',
    faction: 'Asmodian',
    shugoServerId: 2106,
    shugoSlug: 'nae-azphel',
  },
  {
    id: 12101,
    name: 'NAE - Israphel (Asmodian)',
    region: 'NAE',
    faction: 'Asmodian',
    shugoServerId: 2101,
    shugoSlug: 'nae-israphel',
  },
  {
    id: 12105,
    name: 'NAE - Marchutan (Asmodian)',
    region: 'NAE',
    faction: 'Asmodian',
    shugoServerId: 2105,
    shugoSlug: 'nae-marchutan',
  },
  {
    id: 11101,
    name: 'NAE - Siel (Elyos)',
    region: 'NAE',
    faction: 'Elyos',
    shugoServerId: 1101,
    shugoSlug: 'nae-siel',
  },
  {
    id: 11102,
    name: 'NAE - Nezekan (Elyos)',
    region: 'NAE',
    faction: 'Elyos',
    shugoServerId: 1102,
    shugoSlug: 'nae-nezekan',
  },
  {
    id: 11103,
    name: 'NAE - Vaizel (Elyos)',
    region: 'NAE',
    faction: 'Elyos',
    shugoServerId: 1103,
    shugoSlug: 'nae-vaizel',
  },
  {
    id: 12201,
    name: 'NAW - Israphel (Asmodian)',
    region: 'NAW',
    faction: 'Asmodian',
    shugoServerId: 2201,
    shugoSlug: 'naw-israphel',
  },
  {
    id: 12206,
    name: 'NAW - Azphel (Asmodian)',
    region: 'NAW',
    faction: 'Asmodian',
    shugoServerId: 2206,
    shugoSlug: 'naw-azphel',
  },
  {
    id: 11201,
    name: 'NAW - Siel (Elyos)',
    region: 'NAW',
    faction: 'Elyos',
    shugoServerId: 1201,
    shugoSlug: 'naw-siel',
  },
  {
    id: 22101,
    name: 'EU - Israphel (Asmodian)',
    region: 'EU',
    faction: 'Asmodian',
    shugoServerId: 2101,
    shugoSlug: 'eu-israphel',
  },
  {
    id: 21101,
    name: 'EU - Siel (Elyos)',
    region: 'EU',
    faction: 'Elyos',
    shugoServerId: 1101,
    shugoSlug: 'eu-siel',
  },
];

const getBasePath = (): string => {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BASE_PATH) {
    return process.env.NEXT_PUBLIC_BASE_PATH;
  }
  if (
    typeof window !== 'undefined' &&
    window.location.pathname.startsWith('/aion2-craft-n-class-guides')
  ) {
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
  defaultServerName: 'NAE - Azphel (Asmodian)',
  defaultLegionName: 'SangreLatina',
  brokerTax: {
    salesTaxRate: 0.1,
    listingFeeRate: 0.02,
    netRetentionMultiplier: 0.9,
  },
  liveApi: {
    exchangeItemsUrl: (serverId: number, limit = 1000): string =>
      `https://aion2.exchange/api/items?server=${serverId}&limit=${limit}`,
    exchangeCraftsUrl: (serverId: number): string =>
      `https://aion2.exchange/api/crafts?server=${serverId}`,
    exchangeOverviewUrl: (serverId: number): string =>
      `https://aion2.exchange/api/overview?server=${serverId}`,
    shugoCharacterUrl: (serverSlug: string, characterName: string): string =>
      `https://shugo.gg/character/global/${encodeURIComponent(serverSlug)}/${encodeURIComponent(characterName.trim())}`,
    shugoLeaderboardUrl: (
      shugoServerId: number,
      className?: string,
      limit = 50
    ): string => {
      const classParam =
        className && className !== 'All' ? `&class=${encodeURIComponent(className)}` : '';
      return `https://shugo.gg/api/leaderboard/combat-power?region=GLOBAL&serverId=${shugoServerId}${classParam}&limit=${limit}`;
    },
    corsProxies: [
      (targetUrl: string): string =>
        `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`,
      (targetUrl: string): string =>
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`,
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
    allClientRecipes: '/data/all_client_recipes_complete.json',
    serversList: '/data/servers_list.json',
  },
  externalReferenceLinks: {
    aion2Exchange: 'https://aion2.exchange/',
    aion2GgCalcEn: 'https://aion2.gg/tools/crafting-calculator',
    aion2GgCalcEs: 'https://aion2.gg/es/tools/crafting-calculator',
    aion2GuidesHome: 'https://aion2-guides.info/',
    shugoDatabaseEs: 'https://shugo.gg/es/database',
    shugoDatabaseEn: 'https://shugo.gg/en/database',
    shugoLeaderboardWeb: 'https://shugo.gg/es/leaderboard',
    questlogSkillBuilderEs: 'https://questlog.gg/aion-2/es/skill-builder',
    questlogSkillBuilderEn: 'https://questlog.gg/aion-2/en/skill-builder',
    questlogServerStatusEs: 'https://questlog.gg/aion-2/es/server-status',
    questlogServerStatusEn: 'https://questlog.gg/aion-2/en/server-status',
    kanonBibleDoc:
      'https://docs.google.com/document/d/11u4wLCG1WfL-xSka2Aze0rI9vYRa7mq3N3Gp1bt0AWY/edit',
  },
};
