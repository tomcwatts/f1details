import NodeCache from 'node-cache';

// Aggressive caching for high traffic - 2 hour TTL for schedule, 4 hours for historical data
export const cache = new NodeCache({ 
  stdTTL: 7200, // 2 hours for main cache
  checkperiod: 600, // Check for expired keys every 10 minutes
  useClones: false // Better performance for read-heavy workload
});

// Cache keys
export const CACHE_KEYS = {
  F1_SCHEDULE: 'f1_schedule_complete',
  DRIVER_STANDINGS: 'driver_standings',
  CONSTRUCTOR_STANDINGS: 'constructor_standings',
  QUALIFYING_RESULTS: (season: number, round: string) => `qualifying_${season}_${round}`,
  RACE_WINNERS: (season: number) => `winners_${season}`,
  RACE_RESULTS: (season: number, round: string) => `results_${season}_${round}`,
} as const;