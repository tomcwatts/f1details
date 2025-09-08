import { unstable_cache } from 'next/cache';

// Cache key constants for consistency
export const CACHE_KEYS = {
  F1_SCHEDULE: 'f1_schedule_complete',
  DRIVER_STANDINGS: 'driver_standings',
  CONSTRUCTOR_STANDINGS: 'constructor_standings',
  QUALIFYING_RESULTS: (season: number, round: string) => `qualifying_${season}_${round}`,
  RACE_WINNERS: (season: number) => `winners_${season}`,
  RACE_RESULTS: (season: number, round: string) => `results_${season}_${round}`,
} as const;

// Cache TTL constants (in seconds)
export const CACHE_TTL = {
  SCHEDULE: 2 * 60 * 60, // 2 hours
  STANDINGS: 30 * 60, // 30 minutes
  HISTORICAL: 24 * 60 * 60, // 24 hours
  QUALIFYING: 4 * 60 * 60, // 4 hours
  FAILED_REQUEST: 30 * 60, // 30 minutes for failed requests
} as const;

// Create cached versions of functions using Next.js unstable_cache
export function createCachedFunction<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyPrefix: string,
  revalidate: number,
  tags?: string[]
): T {
  return unstable_cache(
    fn,
    [keyPrefix],
    {
      revalidate,
      tags: tags || [keyPrefix],
    }
  ) as T;
}

// Helper function to generate cache tags
export function getCacheTags(type: string, ...identifiers: string[]): string[] {
  return [type, ...identifiers.map(id => `${type}_${id}`)];
}