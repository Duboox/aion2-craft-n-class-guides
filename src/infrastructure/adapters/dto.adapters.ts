/**
 * Adaptadores y Mappers de DTOs externos (aion2.exchange y aion2.gg) hacia nuestros Modelos de Dominio.
 * Si la estructura JSON de una API externa cambia, solo se modifica este adaptador.
 */
import type {
  CatalogItem,
  MarketItem,
  NpcVendorMaterial,
  SubstanceMorphMaterial,
  SubstanceMorphRecipe,
} from '../../domain/models/types';

export interface Aion2ExchangeItemDto {
  readonly item_key?: number;
  readonly name?: string;
  readonly price?: number;
  readonly listings?: number;
  readonly captured_at?: string;
  readonly change_pct?: number | null;
  readonly category?: {
    readonly id?: number;
    readonly name?: string;
    readonly section_id?: string;
    readonly section_name?: string;
  } | null;
}

export interface Aion2ExchangeItemsEnvelopeDto {
  readonly items?: readonly Aion2ExchangeItemDto[];
  readonly total?: number;
}

export interface Aion2GgCatalogDto {
  readonly id?: number;
  readonly name_en?: string;
  readonly name_es?: string;
}

export interface Aion2GgVendorDto {
  readonly id?: number;
  readonly name_en?: string;
  readonly name_es?: string;
  readonly vendor_price_kinah?: number;
}

export interface Aion2GgMorphRowDto {
  readonly id?: number;
  readonly n?: string;
  readonly g?: string;
  readonly c?: string;
  readonly m?: number;
  readonly x?: number;
  readonly mt?: readonly (readonly [number, string, string, string, number])[];
}

export function adaptExchangePayloadToDtoArray(raw: unknown): readonly Aion2ExchangeItemDto[] {
  if (Array.isArray(raw)) {
    return raw as readonly Aion2ExchangeItemDto[];
  }
  if (typeof raw === 'object' && raw !== null && 'items' in raw) {
    const env = raw as Aion2ExchangeItemsEnvelopeDto;
    if (Array.isArray(env.items)) {
      return env.items;
    }
  }
  return [];
}

export function mapExchangeDtoToMarketItem(
  dto: Aion2ExchangeItemDto,
  esNameLookup: ReadonlyMap<number, string>
): MarketItem | null {
  const itemKey = typeof dto.item_key === 'number' ? dto.item_key : 0;
  const nameEn = typeof dto.name === 'string' ? dto.name.trim() : '';
  if (!itemKey || !nameEn) {
    return null;
  }
  const nameEs = esNameLookup.get(itemKey) ?? nameEn;
  const price = typeof dto.price === 'number' && Number.isFinite(dto.price) ? dto.price : 0;
  const listings = typeof dto.listings === 'number' && Number.isFinite(dto.listings) ? dto.listings : 0;
  const categoryName = dto.category?.name ?? 'Misc';
  const capturedAt = typeof dto.captured_at === 'string' ? dto.captured_at : new Date().toISOString();
  const changePct = typeof dto.change_pct === 'number' && Number.isFinite(dto.change_pct) ? dto.change_pct : 0;

  return {
    itemKey,
    nameEn,
    nameEs,
    price,
    listings,
    categoryName,
    capturedAt,
    changePct,
    isCustomOverride: false,
  };
}

export function mapCatalogDtoToDomain(dto: Aion2GgCatalogDto): CatalogItem | null {
  const id = typeof dto.id === 'number' ? dto.id : 0;
  if (!id) return null;
  const nameEn = typeof dto.name_en === 'string' ? dto.name_en : '';
  const nameEs = typeof dto.name_es === 'string' ? dto.name_es : nameEn;
  return { id, nameEn, nameEs };
}

export function mapVendorDtoToDomain(dto: Aion2GgVendorDto): NpcVendorMaterial | null {
  const id = typeof dto.id === 'number' ? dto.id : 0;
  if (!id) return null;
  const nameEn = typeof dto.name_en === 'string' ? dto.name_en : '';
  const nameEs = typeof dto.name_es === 'string' ? dto.name_es : nameEn;
  const vendorPriceKinah = typeof dto.vendor_price_kinah === 'number' ? dto.vendor_price_kinah : 0;
  return { id, nameEn, nameEs, vendorPriceKinah };
}

export function mapMorphDtoToDomain(
  dto: Aion2GgMorphRowDto,
  esNameLookup: ReadonlyMap<number, string>
): SubstanceMorphRecipe | null {
  const id = typeof dto.id === 'number' ? dto.id : 0;
  const nameEn = typeof dto.n === 'string' ? dto.n : '';
  if (!id || !nameEn) return null;

  const materials: SubstanceMorphMaterial[] = [];
  if (Array.isArray(dto.mt)) {
    for (const tuple of dto.mt) {
      if (Array.isArray(tuple) && tuple.length >= 5) {
        const matId = Number(tuple[0]);
        const matNameEn = String(tuple[1]);
        const matGrade = String(tuple[2]);
        const matCount = Number(tuple[4]);
        materials.push({
          id: matId,
          name: esNameLookup.get(matId) ? `${esNameLookup.get(matId)} (${matNameEn})` : matNameEn,
          grade: matGrade,
          count: matCount,
        });
      }
    }
  }

  return {
    id,
    nameEn,
    nameEs: nameEn,
    category: typeof dto.c === 'string' ? dto.c : 'Substance Morph',
    grade: typeof dto.g === 'string' ? dto.g : 'Common',
    mastery: typeof dto.m === 'number' ? dto.m : 1,
    outputCount: typeof dto.x === 'number' ? dto.x : 1,
    materials,
  };
}
