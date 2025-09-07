export interface Driver {
  code: string;
  givenName: string;
  familyName: string;
  nationality: string;
}

export interface Constructor {
  name: string;
  nationality: string;
}

export interface QualifyingResult {
  position: string;
  number: string;
  driver: Driver;
  constructor: Constructor;
  Q1?: string;
  Q2?: string;
  Q3?: string;
}

export interface RaceWinner {
  driver: Driver;
  constructor: Constructor;
  points: string;
  time?: string;
}

export interface CircuitLocation {
  lat: string;
  long: string;
  locality: string;
  country: string;
}

export interface CircuitDetails {
  circuitId: string;
  circuitName: string;
  location: CircuitLocation;
  url: string;
}

export interface F1Event {
  id: string;
  name: string;
  circuit: string;
  location: string;
  date: string;
  time: string;
  utcDateTime: string;
  eventType: 'race' | 'qualifying' | 'sprint' | 'practice';
  isNext: boolean;
  qualifyingResults?: QualifyingResult[];
  lastYearWinner?: RaceWinner;
  circuitDetails?: CircuitDetails;
  round?: string;
  hasSprint?: boolean;
}

export interface DriverStanding {
  position: string;
  points: string;
  wins: string;
  driver: Driver;
  constructor: Constructor;
}

export interface ConstructorStanding {
  position: string;
  points: string;
  wins: string;
  constructor: Constructor;
}

export interface RaceResult {
  position: string;
  number: string;
  points: string;
  driver: Driver;
  constructor: Constructor;
  grid: string;
  laps: string;
  status: string;
  time?: {
    millis: string;
    time: string;
  };
  fastestLap?: {
    rank: string;
    lap: string;
    time: {
      time: string;
    };
    averageSpeed: {
      units: string;
      speed: string;
    };
  };
}

// API Response types from Jolpica/Ergast
export interface JolpicaRaceResponse {
  MRData: {
    RaceTable: {
      season: string;
      Races: Array<{
        season: string;
        round: string;
        url: string;
        raceName: string;
        date: string;
        time: string;
        Circuit: {
          circuitId: string;
          url: string;
          circuitName: string;
          Location: {
            lat: string;
            long: string;
            locality: string;
            country: string;
          };
        };
        Qualifying?: {
          date: string;
          time: string;
        };
        Sprint?: {
          date: string;
          time: string;
        };
        FirstPractice?: {
          date: string;
          time: string;
        };
        SecondPractice?: {
          date: string;
          time: string;
        };
        ThirdPractice?: {
          date: string;
          time: string;
        };
        Results?: RaceResult[];
        QualifyingResults?: QualifyingResult[];
      }>;
    };
  };
}

export interface JolpicaStandingsResponse {
  MRData: {
    StandingsTable: {
      season: string;
      StandingsLists: Array<{
        season: string;
        round: string;
        DriverStandings?: DriverStanding[];
        ConstructorStandings?: ConstructorStanding[];
      }>;
    };
  };
}