import axios from 'axios';
import { createCachedFunction, CACHE_TTL } from './next-cache';
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

// Internal function to fetch qualifying results (will be cached)
async function _fetchQualifyingResults(season: number, round: string, raceDate: string): Promise<QualifyingResult[]> {
  // Don't fetch qualifying for races that are too far in the future or past
  if (!shouldFetchQualifying(raceDate, new Date())) {
    return [];
  }

  try {
    const response = await axios.get<JolpicaRaceResponse>(
      `${JOLPICA_BASE_URL}/${season}/${round}/qualifying.json`
    );

    if (!response.data?.MRData?.RaceTable?.Races?.[0]?.QualifyingResults) {
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

    return results;
  } catch (error) {
    console.error(`Error fetching qualifying results for ${season}/${round}:`, error);
    return [];
  }
}

// Cached version of qualifying results fetcher
export const fetchQualifyingResults = createCachedFunction(
  _fetchQualifyingResults,
  'qualifying',
  CACHE_TTL.QUALIFYING,
  ['qualifying']
);

// Internal function to fetch last year's race winners (will be cached)
async function _fetchLastYearResults(lastYearSeason: number): Promise<Map<string, RaceWinner>> {
  const winners = new Map<string, RaceWinner>();
  
  try {
    const response = await axios.get<JolpicaRaceResponse>(
      `${JOLPICA_BASE_URL}/${lastYearSeason}/results.json?limit=100`
    );

    if (!response.data?.MRData?.RaceTable?.Races) {
      return winners;
    }

    const races = response.data.MRData.RaceTable.Races;
    
    for (const race of races) {
      if (race.Results && race.Results.length > 0) {
        const winner = race.Results[0] as any; // Raw API response format
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
    
    console.log(`Fetched ${winners.size} race winners from ${lastYearSeason}`);
    return winners;
  } catch (error) {
    console.error(`Error fetching results for season ${lastYearSeason}:`, error);
    return winners;
  }
}

// Cached version of last year results fetcher
export const fetchLastYearResults = createCachedFunction(
  _fetchLastYearResults,
  'race-winners',
  CACHE_TTL.HISTORICAL,
  ['historical', 'winners']
);

// Internal function to fetch current season schedule (will be cached)
async function _fetchF1Schedule(season: number = new Date().getFullYear()): Promise<F1Event[]> {
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

    // Find the next upcoming RACE (not just any event)
    const currentDate = new Date();
    const futureRaces = events
      .filter(event => {
        const eventDateTime = new Date(event.utcDateTime);
        return eventDateTime > currentDate && event.eventType === 'race';
      })
      .sort((a, b) => new Date(a.utcDateTime).getTime() - new Date(b.utcDateTime).getTime());

    if (futureRaces.length > 0) {
      // Mark the next race event
      const nextRaceId = futureRaces[0].id;
      const nextRaceIndex = events.findIndex(event => event.id === nextRaceId);
      if (nextRaceIndex !== -1) {
        events[nextRaceIndex].isNext = true;
        console.log(`Next race: ${events[nextRaceIndex].name} on ${events[nextRaceIndex].date}`);
      }
    }

    console.log(`Processed complete F1 schedule with ${events.length} events`);

    return events;
  } catch (error) {
    console.error("Error fetching F1 schedule:", error);
    throw error;
  }
}

// Cached version of F1 schedule fetcher
export const fetchF1Schedule = createCachedFunction(
  _fetchF1Schedule,
  'f1-schedule',
  CACHE_TTL.SCHEDULE,
  ['schedule', 'f1']
);

// Internal function to fetch driver standings (will be cached)
async function _fetchDriverStandings(season: number = new Date().getFullYear()): Promise<DriverStanding[]> {
  try {
    const response = await axios.get<JolpicaStandingsResponse>(
      `${JOLPICA_BASE_URL}/${season}/driverStandings.json`
    );

    if (!response.data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings) {
      throw new Error("Invalid driver standings response format");
    }

    const standings = response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    console.log(`Fetched ${standings.length} driver standings`);

    return standings;
  } catch (error) {
    console.error("Error fetching driver standings:", error);
    throw error;
  }
}

// Cached version of driver standings fetcher
export const fetchDriverStandings = createCachedFunction(
  _fetchDriverStandings,
  'driver-standings',
  CACHE_TTL.STANDINGS,
  ['standings', 'drivers']
);

// Internal function to fetch constructor standings (will be cached)
async function _fetchConstructorStandings(season: number = new Date().getFullYear()): Promise<ConstructorStanding[]> {
  try {
    const response = await axios.get<JolpicaStandingsResponse>(
      `${JOLPICA_BASE_URL}/${season}/constructorStandings.json`
    );

    if (!response.data?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings) {
      throw new Error("Invalid constructor standings response format");
    }

    const standings = response.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
    console.log(`Fetched ${standings.length} constructor standings`);

    return standings;
  } catch (error) {
    console.error("Error fetching constructor standings:", error);
    throw error;
  }
}

// Cached version of constructor standings fetcher
export const fetchConstructorStandings = createCachedFunction(
  _fetchConstructorStandings,
  'constructor-standings',
  CACHE_TTL.STANDINGS,
  ['standings', 'constructors']
);