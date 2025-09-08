import { NextResponse } from 'next/server';
import { fetchF1Schedule } from '@/lib/f1-api';

// Add revalidate for automatic caching
export const revalidate = 7200; // 2 hours

export async function GET() {
  try {
    console.log("API: Fetching F1 schedule data");
    
    const currentYear = new Date().getFullYear();
    const events = await fetchF1Schedule(currentYear);
    
    console.log(`API: Successfully fetched ${events.length} F1 events`);
    
    return NextResponse.json(events, {
      headers: {
        'Cache-Control': 'public, s-maxage=7200, stale-while-revalidate=3600'
      }
    });
  } catch (error) {
    console.error("API: Error fetching F1 schedule:", error);
    
    return NextResponse.json(
      { 
        message: "Failed to fetch F1 schedule data",
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}