import { NextResponse } from 'next/server';
import { fetchConstructorStandings } from '@/lib/f1-api';

export async function GET() {
  try {
    console.log("API: Fetching constructor standings data");
    
    const currentYear = new Date().getFullYear();
    const standings = await fetchConstructorStandings(currentYear);
    
    console.log(`API: Successfully fetched ${standings.length} constructor standings`);
    
    return NextResponse.json(standings);
  } catch (error) {
    console.error("API: Error fetching constructor standings:", error);
    
    return NextResponse.json(
      { 
        message: "Failed to fetch constructor standings data",
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}