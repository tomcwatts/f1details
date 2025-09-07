import axios from 'axios';
import { cache, CACHE_KEYS } from './cache';
import type { 
  F1Event, 
  QualifyingResult, 
  RaceWinner, 
  JolpicaRaceResponse, 
  JolpicaStandingsResponse,
  DriverStanding,
  ConstructorStanding 
} from '@/types/f1';

const JOLPICA_BASE_URL = 'http://api.jolpi.ca/ergast/f1';

// Function to check if we should fetch qualifying data (only for recent/current races)
function shouldFetchQualifying(raceDate: string, currentDate: Date): boolean {
  const race = new Date(raceDate);
  const daysDiff = Math.floor((race.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Only fetch qualifying for races within 7 days past or 30 days future
  return daysDiff >= -7 && daysDiff <= 30;
}

// Function to fetch qualifying results with caching and intelligent filtering
export async function fetchQualifyingResults(season: number, round: string, raceDate: string): Promise<QualifyingResult[]> {
  const cacheKey = CACHE_KEYS.QUALIFYING_RESULTS(season, round);
  
  // Check cache first
  const cached = cache.get<QualifyingResult[]>(cacheKey);
  if (cached) {
    return cached;
  }

  // Don't fetch qualifying for races that are too far in the future or past
  if (!shouldFetchQualifying(raceDate, new Date())) {
    return [];
  }

  try {
    const response = await axios.get<JolpicaRaceResponse>(
      `${JOLPICA_BASE_URL}/${season}/${round}/qualifying.json`
    );

    if (!response.data?.MRData?.RaceTable?.Races?.[0]?.QualifyingResults) {
      // Cache empty result to avoid repeated API calls
      cache.set(cacheKey, [], 3600); // 1 hour cache for empty results
      return [];
    }

    const qualifyingData = response.data.MRData.RaceTable.Races[0].QualifyingResults;
    
    const results = qualifyingData.map((result: any): QualifyingResult => ({
      position: result.position,
      number: result.number,
      driver: {
        code: result.Driver.code,
        givenName: result.Driver.givenName,
        familyName: result.Driver.familyName,
        nationality: result.Driver.nationality,
      },
      constructor: {
        name: result.Constructor.name,
        nationality: result.Constructor.nationality,
      },
      Q1: result.Q1,
      Q2: result.Q2,
      Q3: result.Q3,
    }));

    // Cache qualifying results for 4 hours (longer than main cache)
    cache.set(cacheKey, results, 14400);
    return results;
  } catch (error) {
    console.error(`Error fetching qualifying results for ${season}/${round}:`, error);
    // Cache empty result to avoid repeated failed API calls
    cache.set(cacheKey, [], 1800); // 30 minutes cache for failed requests
    return [];
  }
}

// Function to fetch last year's race winners with aggressive caching
export async function fetchLastYearResults(lastYearSeason: number): Promise<Map<string, RaceWinner>> {
  const cacheKey = CACHE_KEYS.RACE_WINNERS(lastYearSeason);
  
  // Check cache first - historical data rarely changes
  const cached = cache.get<Map<string, RaceWinner>>(cacheKey);
  if (cached) {
    return cached;
  }

  const winners = new Map<string, RaceWinner>();
  
  try {
    const response = await axios.get<JolpicaRaceResponse>(
      `${JOLPICA_BASE_URL}/${lastYearSeason}/results.json?limit=100`
    );

    if (!response.data?.MRData?.RaceTable?.Races) {
      // Cache empty result to avoid repeated API calls
      cache.set(cacheKey, winners, 7200); // 2 hours cache for empty results
      return winners;
    }

    const races = response.data.MRData.RaceTable.Races;
    
    for (const race of races) {
      if (race.Results && race.Results.length > 0) {
        const winner = race.Results[0]; // First position is the winner
        const circuitName = race.Circuit.circuitName;
        
        if (winner.Driver && winner.Constructor) {
          winners.set(circuitName, {
            driver: {
              code: winner.Driver.code,
              givenName: winner.Driver.givenName,
              familyName: winner.Driver.familyName,
              nationality: winner.Driver.nationality,
            },
            constructor: {
              name: winner.Constructor.name,
              nationality: winner.Constructor.nationality,
            },
            points: winner.points,
            time: winner.Time?.time,
          });
        }
      }
    }
    
    // Cache historical results for 24 hours - they don't change
    cache.set(cacheKey, winners, 86400);
    console.log(`Cached ${winners.size} race winners from ${lastYearSeason}`);
    return winners;
  } catch (error) {
    console.error(`Error fetching results for season ${lastYearSeason}:`, error);
    // Cache empty result to avoid repeated failed calls
    cache.set(cacheKey, winners, 3600); // 1 hour cache for failed requests
    return winners;
  }
}

// Function to fetch current season schedule
export async function fetchF1Schedule(season: number = new Date().getFullYear()): Promise<F1Event[]> {
  const cacheKey = CACHE_KEYS.F1_SCHEDULE;
  
  // Check cache first
  const cachedData = cache.get<F1Event[]>(cacheKey);
  if (cachedData) {
    console.log("Serving F1 schedule from cache");
    return cachedData;
  }

  console.log("Fetching fresh F1 schedule data from Jolpica API");

  try {
    const response = await axios.get<JolpicaRaceResponse>(
      `${JOLPICA_BASE_URL}/${season}.json`
    );

    if (!response.data?.MRData?.RaceTable?.Races) {
      throw new Error("Invalid API response format");
    }

    const races = response.data.MRData.RaceTable.Races;

    // Fetch last year's race winners (cached aggressively)
    const lastYearSeason = season - 1;
    const lastYearWinners = await fetchLastYearResults(lastYearSeason);

    const events: F1Event[] = [];
    const now = new Date();
    
    // Process each race to extract all session types
    for (const race of races) {
      const circuitName = race.Circuit.circuitName;
      
      // Try to fetch qualifying results for this race (with intelligent filtering)
      const qualifyingResults = await fetchQualifyingResults(season, race.round, race.date);
      
      // Get last year's winner for this circuit
      const lastYearWinner = lastYearWinners.get(circuitName);
      
      // Add small delay between races to avoid rate limiting
      if (parseInt(race.round) % 5 === 0) {
        await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay every 5 races
      }

      const circuitDetails = {
        circuitId: race.Circuit.circuitId,
        circuitName: race.Circuit.circuitName,
        location: {
          lat: race.Circuit.Location.lat,
          long: race.Circuit.Location.long,
          locality: race.Circuit.Location.locality,
          country: race.Circuit.Location.country,
        },
        url: race.Circuit.url,
      };
      
      // Main race event
      const raceDateTime = `${race.date}T${race.time}`;
      events.push({
        id: `${season}-${race.round}-race`,
        name: race.raceName,
        circuit: circuitName,
        location: `${race.Circuit.Location.locality}, ${race.Circuit.Location.country}`,
        date: race.date,
        time: race.time,
        utcDateTime: raceDateTime,
        eventType: 'race',
        isNext: false,
        qualifyingResults: qualifyingResults.length > 0 ? qualifyingResults : undefined,
        lastYearWinner: lastYearWinner,
        circuitDetails: circuitDetails,
        round: race.round,
        hasSprint: !!race.Sprint,
      });

      // Qualifying session
      if (race.Qualifying) {
        const qualifyingDateTime = `${race.Qualifying.date}T${race.Qualifying.time}`;
        
        events.push({
          id: `${season}-${race.round}-qualifying`,
          name: `Qualifying - ${race.raceName}`,
          circuit: circuitName,
          location: `${race.Circuit.Location.locality}, ${race.Circuit.Location.country}`,
          date: race.Qualifying.date,
          time: race.Qualifying.time,
          utcDateTime: qualifyingDateTime,
          eventType: 'qualifying',
          isNext: false,
          circuitDetails: circuitDetails,
          round: race.round,
        });
      }

      // Sprint session
      if (race.Sprint) {
        const sprintDateTime = `${race.Sprint.date}T${race.Sprint.time}`;
        
        events.push({
          id: `${season}-${race.round}-sprint`,
          name: `Sprint - ${race.raceName}`,
          circuit: circuitName,
          location: `${race.Circuit.Location.locality}, ${race.Circuit.Location.country}`,
          date: race.Sprint.date,
          time: race.Sprint.time,
          utcDateTime: sprintDateTime,
          eventType: 'sprint',
          isNext: false,
          circuitDetails: circuitDetails,
          round: race.round,
        });
      }

      // Practice sessions
      if (race.FirstPractice) {
        const practiceDateTime = `${race.FirstPractice.date}T${race.FirstPractice.time}`;
        events.push({
          id: `${season}-${race.round}-practice1`,
          name: `Practice 1 - ${race.raceName}`,
          circuit: circuitName,
          location: `${race.Circuit.Location.locality}, ${race.Circuit.Location.country}`,
          date: race.FirstPractice.date,
          time: race.FirstPractice.time,
          utcDateTime: practiceDateTime,
          eventType: 'practice',
          isNext: false,
          circuitDetails: circuitDetails,
          round: race.round,
        });
      }

      if (race.SecondPractice) {
        const practiceDateTime = `${race.SecondPractice.date}T${race.SecondPractice.time}`;
        events.push({
          id: `${season}-${race.round}-practice2`,
          name: `Practice 2 - ${race.raceName}`,
          circuit: circuitName,
          location: `${race.Circuit.Location.locality}, ${race.Circuit.Location.country}`,
          date: race.SecondPractice.date,
          time: race.SecondPractice.time,
          utcDateTime: practiceDateTime,
          eventType: 'practice',
          isNext: false,
          circuitDetails: circuitDetails,
          round: race.round,
        });
      }

      if (race.ThirdPractice) {
        const practiceDateTime = `${race.ThirdPractice.date}T${race.ThirdPractice.time}`;
        events.push({
          id: `${season}-${race.round}-practice3`,
          name: `Practice 3 - ${race.raceName}`,
          circuit: circuitName,
          location: `${race.Circuit.Location.locality}, ${race.Circuit.Location.country}`,
          date: race.ThirdPractice.date,
          time: race.ThirdPractice.time,
          utcDateTime: practiceDateTime,
          eventType: 'practice',
          isNext: false,
          circuitDetails: circuitDetails,
          round: race.round,
        });
      }
    }

    // Find the next upcoming event
    const currentDate = new Date();
    const futureEvents = events.filter(event => {
      const eventDateTime = new Date(event.utcDateTime);
      return eventDateTime > currentDate;
    }).sort((a, b) => new Date(a.utcDateTime).getTime() - new Date(b.utcDateTime).getTime());

    if (futureEvents.length > 0) {
      // Mark the very next event
      const nextEventId = futureEvents[0].id;
      const nextEventIndex = events.findIndex(event => event.id === nextEventId);
      if (nextEventIndex !== -1) {
        events[nextEventIndex].isNext = true;
        console.log(`Next event: ${events[nextEventIndex].name} on ${events[nextEventIndex].date}`);
      }
    }

    // Cache the complete processed data for 2 hours
    cache.set(cacheKey, events, 7200);
    console.log(`Cached complete F1 schedule with ${events.length} events`);

    return events;
  } catch (error) {
    console.error("Error fetching F1 schedule:", error);
    throw error;
  }
}

// Function to fetch driver standings
export async function fetchDriverStandings(season: number = new Date().getFullYear()): Promise<DriverStanding[]> {
  const cacheKey = CACHE_KEYS.DRIVER_STANDINGS;
  
  // Check cache first
  const cached = cache.get<DriverStanding[]>(cacheKey);
  if (cached) {
    console.log("Serving driver standings from cache");
    return cached;
  }

  try {
    const response = await axios.get<JolpicaStandingsResponse>(
      `${JOLPICA_BASE_URL}/${season}/driverStandings.json`
    );

    if (!response.data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings) {
      throw new Error("Invalid driver standings response format");
    }

    const standings = response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

    // Cache for 30 minutes - standings change frequently during season
    cache.set(cacheKey, standings, 1800);
    console.log(`Cached ${standings.length} driver standings`);

    return standings;
  } catch (error) {
    console.error("Error fetching driver standings:", error);
    throw error;
  }
}

// Function to fetch constructor standings
export async function fetchConstructorStandings(season: number = new Date().getFullYear()): Promise<ConstructorStanding[]> {
  const cacheKey = CACHE_KEYS.CONSTRUCTOR_STANDINGS;
  
  // Check cache first
  const cached = cache.get<ConstructorStanding[]>(cacheKey);
  if (cached) {
    console.log("Serving constructor standings from cache");
    return cached;
  }

  try {
    const response = await axios.get<JolpicaStandingsResponse>(
      `${JOLPICA_BASE_URL}/${season}/constructorStandings.json`
    );

    if (!response.data?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings) {
      throw new Error("Invalid constructor standings response format");
    }

    const standings = response.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;

    // Cache for 30 minutes - standings change frequently during season
    cache.set(cacheKey, standings, 1800);
    console.log(`Cached ${standings.length} constructor standings`);

    return standings;
  } catch (error) {
    console.error("Error fetching constructor standings:", error);
    throw error;
  }
}