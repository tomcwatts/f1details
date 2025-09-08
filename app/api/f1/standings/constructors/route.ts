import { NextResponse } from 'next/server';
import { fetchConstructorStandings } from '@/lib/f1-api';

// Add revalidate for automatic caching
export const revalidate = 1800; // 30 minutes

export async function GET() {
  try {
    console.log("API: Fetching constructor standings data");
    
    const currentYear = new Date().getFullYear();
    const standings = await fetchConstructorStandings(currentYear);
    
    console.log(`API: Successfully fetched ${standings.length} constructor standings`);
    
    return NextResponse.json(standings, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=900'
      }
    });
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