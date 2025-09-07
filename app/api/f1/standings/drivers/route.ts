import { NextResponse } from 'next/server';
import { fetchDriverStandings } from '@/lib/f1-api';
import type { DriverStanding } from '@/types/f1';

export async function GET() {
  try {
    console.log("API: Fetching driver standings data");
    
    const currentYear = new Date().getFullYear();
    const rawStandings = await fetchDriverStandings(currentYear);
    
    // Map the raw API response to our expected format
    const mappedStandings: DriverStanding[] = rawStandings.map((standing: any) => ({
      position: standing.position,
      points: standing.points,
      wins: standing.wins,
      driver: {
        code: standing.Driver.code,
        givenName: standing.Driver.givenName,
        familyName: standing.Driver.familyName,
        nationality: standing.Driver.nationality,
      },
      constructor: {
        name: standing.Constructors[0].name,
        nationality: standing.Constructors[0].nationality,
      }
    }));
    
    console.log(`API: Successfully fetched ${mappedStandings.length} driver standings`);
    
    return NextResponse.json(mappedStandings);
  } catch (error) {
    console.error("API: Error fetching driver standings:", error);
    
    return NextResponse.json(
      { 
        message: "Failed to fetch driver standings data",
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}