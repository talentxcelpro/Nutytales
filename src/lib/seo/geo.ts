/**
 * Nutty Tales SEO — Geo Entity System
 *
 * Geography is database-driven, not hardcoded.
 * This module provides the entity types, relationship graph,
 * and a seed of real, commercially-meaningful geo entities.
 *
 * Rule: Only launch a geo page when:
 *   - Genuine demand exists in that geography
 *   - Useful content exists
 *   - Supply exists or sourcing is possible
 *   - The business can serve the customer
 *
 * This seed data represents the initial launch set.
 * Additional geographies are added when the above criteria are met.
 */

import type { GeoEntity } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// GEO ENTITY SEED DATA
// Real geographies where Nutty Tales has supply, demand, and capability.
// ─────────────────────────────────────────────────────────────────────────────

export const GEO_ENTITIES: GeoEntity[] = [
  // ── Countries ──────────────────────────────────────────────────────────────
  {
    id: 'geo-in',
    slug: 'india',
    name: 'India',
    type: 'country',
    isoCode: 'IN',
    hasSupply: true,
    hasDemand: true,
    isLaunched: true,
    currencies: ['INR'],
    languages: ['en', 'hi'],
  },
  {
    id: 'geo-ae',
    slug: 'uae',
    name: 'UAE',
    type: 'country',
    isoCode: 'AE',
    hasSupply: false,  // Sourcing capability, not local supply
    hasDemand: true,
    isLaunched: false, // Not yet launched — demand exists, build supply first
    currencies: ['AED', 'USD'],
    languages: ['en', 'ar'],
  },
  {
    id: 'geo-gb',
    slug: 'uk',
    name: 'United Kingdom',
    type: 'country',
    isoCode: 'GB',
    hasSupply: false,
    hasDemand: true,
    isLaunched: false,
    currencies: ['GBP'],
    languages: ['en'],
  },

  // ── Indian States ──────────────────────────────────────────────────────────
  {
    id: 'geo-jk',
    slug: 'kashmir',
    name: 'Jammu & Kashmir',
    nameLocal: 'کشمیر',
    type: 'state',
    parentId: 'geo-in',
    country: 'IN',
    hasSupply: true,
    hasDemand: true,
    isLaunched: true,
    currencies: ['INR'],
    languages: ['en', 'hi', 'ks'],
  },
  {
    id: 'geo-up',
    slug: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    type: 'state',
    parentId: 'geo-in',
    country: 'IN',
    hasSupply: true,
    hasDemand: true,
    isLaunched: true,
    currencies: ['INR'],
    languages: ['en', 'hi'],
  },
  {
    id: 'geo-br',
    slug: 'bihar',
    name: 'Bihar',
    type: 'state',
    parentId: 'geo-in',
    country: 'IN',
    hasSupply: true,
    hasDemand: true,
    isLaunched: true,
    currencies: ['INR'],
    languages: ['en', 'hi'],
  },
  {
    id: 'geo-dl',
    slug: 'delhi',
    name: 'Delhi',
    type: 'state',
    parentId: 'geo-in',
    country: 'IN',
    hasSupply: true,
    hasDemand: true,
    isLaunched: true,
    currencies: ['INR'],
    languages: ['en', 'hi'],
  },
  {
    id: 'geo-mh',
    slug: 'maharashtra',
    name: 'Maharashtra',
    type: 'state',
    parentId: 'geo-in',
    country: 'IN',
    hasSupply: false,
    hasDemand: true,
    isLaunched: true,
    currencies: ['INR'],
    languages: ['en', 'hi', 'mr'],
  },
  {
    id: 'geo-ka',
    slug: 'karnataka',
    name: 'Karnataka',
    type: 'state',
    parentId: 'geo-in',
    country: 'IN',
    hasSupply: false,
    hasDemand: true,
    isLaunched: false,
    currencies: ['INR'],
    languages: ['en', 'kn'],
  },

  // ── Cities (Core) ──────────────────────────────────────────────────────────
  {
    id: 'geo-srg',
    slug: 'srinagar',
    name: 'Srinagar',
    type: 'city',
    parentId: 'geo-jk',
    country: 'IN',
    region: 'kashmir',
    latitude: 34.0837,
    longitude: 74.7973,
    populationBand: 'mid',
    hasSupply: true,
    hasDemand: true,
    isLaunched: true,
    currencies: ['INR'],
    languages: ['en', 'hi', 'ks'],
  },
  {
    id: 'geo-glm',
    slug: 'gulmarg',
    name: 'Gulmarg',
    type: 'city',
    parentId: 'geo-jk',
    country: 'IN',
    region: 'kashmir',
    latitude: 34.0484,
    longitude: 74.3805,
    populationBand: 'small',
    hasSupply: true,
    hasDemand: true,
    isLaunched: true,
    currencies: ['INR'],
    languages: ['en', 'hi'],
  },
  {
    id: 'geo-phl',
    slug: 'pahalgam',
    name: 'Pahalgam',
    type: 'city',
    parentId: 'geo-jk',
    country: 'IN',
    region: 'kashmir',
    latitude: 34.0161,
    longitude: 75.3153,
    populationBand: 'small',
    hasSupply: true,
    hasDemand: true,
    isLaunched: false, // Demand exists; launch after content review
    currencies: ['INR'],
    languages: ['en', 'hi'],
  },
  {
    id: 'geo-nda',
    slug: 'noida',
    name: 'Noida',
    type: 'city',
    parentId: 'geo-up',
    country: 'IN',
    region: 'ncr',
    latitude: 28.5355,
    longitude: 77.3910,
    populationBand: 'major',
    hasSupply: true,
    hasDemand: true,
    isLaunched: true,
    currencies: ['INR'],
    languages: ['en', 'hi'],
  },
  {
    id: 'geo-ptn',
    slug: 'patna',
    name: 'Patna',
    type: 'city',
    parentId: 'geo-br',
    country: 'IN',
    region: 'bihar',
    latitude: 25.5941,
    longitude: 85.1376,
    populationBand: 'major',
    hasSupply: true,
    hasDemand: true,
    isLaunched: true,
    currencies: ['INR'],
    languages: ['en', 'hi'],
  },
  {
    id: 'geo-mum',
    slug: 'mumbai',
    name: 'Mumbai',
    type: 'city',
    parentId: 'geo-mh',
    country: 'IN',
    latitude: 19.0760,
    longitude: 72.8777,
    populationBand: 'metro',
    hasSupply: false,
    hasDemand: true,
    isLaunched: true, // Demand is high enough; supply via delivery
    currencies: ['INR'],
    languages: ['en', 'hi', 'mr'],
  },
  {
    id: 'geo-blr',
    slug: 'bangalore',
    name: 'Bangalore',
    type: 'city',
    parentId: 'geo-ka',
    country: 'IN',
    latitude: 12.9716,
    longitude: 77.5946,
    populationBand: 'metro',
    hasSupply: false,
    hasDemand: true,
    isLaunched: true,
    currencies: ['INR'],
    languages: ['en', 'kn', 'hi'],
  },
  {
    id: 'geo-dxb',
    slug: 'dubai',
    name: 'Dubai',
    type: 'city',
    parentId: 'geo-ae',
    country: 'AE',
    latitude: 25.2048,
    longitude: 55.2708,
    populationBand: 'metro',
    hasSupply: false,
    hasDemand: true,
    isLaunched: false, // High demand; build supply chain before launching
    currencies: ['AED', 'USD'],
    languages: ['en', 'ar', 'hi'],
  },
  {
    id: 'geo-lon',
    slug: 'london',
    name: 'London',
    type: 'city',
    parentId: 'geo-gb',
    country: 'GB',
    latitude: 51.5074,
    longitude: -0.1278,
    populationBand: 'metro',
    hasSupply: false,
    hasDemand: true,
    isLaunched: false,
    currencies: ['GBP'],
    languages: ['en'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// GEO LOOKUP UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

const _geoBySlug = new Map<string, GeoEntity>(
  GEO_ENTITIES.map((g) => [g.slug, g])
);

const _geoById = new Map<string, GeoEntity>(
  GEO_ENTITIES.map((g) => [g.id, g])
);

export function getGeoBySlug(slug: string): GeoEntity | undefined {
  return _geoBySlug.get(slug);
}

export function getGeoById(id: string): GeoEntity | undefined {
  return _geoById.get(id);
}

export function getLaunchedGeos(): GeoEntity[] {
  return GEO_ENTITIES.filter((g) => g.isLaunched);
}

export function getGeosByCountry(countryCode: string): GeoEntity[] {
  return GEO_ENTITIES.filter(
    (g) => g.isoCode === countryCode || g.country === countryCode
  );
}

/**
 * Returns cities that have both demand and supply (or sourcing), filtered to
 * launched geographies. Used to determine which location pages to publish.
 */
export function getEligibleCities(): GeoEntity[] {
  return GEO_ENTITIES.filter(
    (g) => g.type === 'city' && g.isLaunched && g.hasDemand
  );
}

/**
 * Gets parent geo hierarchy for a geo entity (for breadcrumbs and schema).
 */
export function getGeoHierarchy(geoId: string): GeoEntity[] {
  const hierarchy: GeoEntity[] = [];
  let current = _geoById.get(geoId);

  while (current) {
    hierarchy.unshift(current);
    current = current.parentId ? _geoById.get(current.parentId) : undefined;
  }

  return hierarchy;
}
