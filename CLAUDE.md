# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
npm run dev          # Start development server on http://localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Dependencies
npm install          # Install all dependencies
```

## Architecture Overview

### Next.js 15 App Router Structure
- **App Router**: Uses Next.js 15 App Router architecture (`app/` directory)
- **API Routes**: RESTful API endpoints in `app/api/f1/` for F1 data
- **Components**: Page components in `components/` (not in app directory)
- **TypeScript**: Full TypeScript implementation with strict typing

### F1 Data Integration Architecture

**External Data Source**: Jolpica F1 API (`http://api.jolpi.ca/ergast/f1`) - replacement for deprecated Ergast API
- Real-time 2025 F1 season data
- Historical race results for previous year winners
- Driver and constructor championship standings

**Caching Strategy** (`lib/cache.ts`):
- **Schedule Data**: 2-hour cache (`CACHE_KEYS.F1_SCHEDULE`)
- **Driver Standings**: 30-minute cache (`CACHE_KEYS.DRIVER_STANDINGS`) 
- **Historical Results**: 24-hour cache (`CACHE_KEYS.RACE_WINNERS`)
- **Qualifying Results**: Intelligent caching - only fetch for races within 7 days past or 30 days future

**Data Flow Architecture**:
1. **API Routes** (`app/api/f1/`) fetch from Jolpica API with caching
2. **F1 API Service** (`lib/f1-api.ts`) handles data transformation and caching logic
3. **Components** fetch from internal API routes via client-side fetch
4. **Type Safety** ensured via `types/f1.ts` interfaces

### Component Architecture

**Main Page Components**:
- `HeroSection`: Next race countdown and weekend schedule
- `UpcomingRaces`: Race calendar grid with circuit info and previous winners  
- `DriversStandings`: Live championship table with team colors and flags
- `LiveTiming`: Simulated live timing (currently mock data)

**Data Fetching Pattern**:
- All main components use `useState` + `useEffect` for data fetching
- Loading states with skeleton animations
- Error boundaries with fallback UI
- Client-side components marked with `'use client'`

### Styling System

**TailwindCSS with Custom F1 Theme** (`app/globals.css`):
- Dark theme with F1 official colors (red: `#E10600`, electric blue: `#00D4FF`)
- Custom CSS classes: `.f1-gradient`, `.f1-text-glow`, `.f1-border-glow`, `.f1-card-hover`
- shadcn/ui components for consistent UI primitives

**Team Color Mapping**: Components include hardcoded team color mappings for 2025 F1 season teams (Red Bull: `#3671C6`, Ferrari: `#E8002D`, McLaren: `#FF8000`, etc.)

## Key Integration Points

### Adding New F1 Data Endpoints
1. Add types to `types/f1.ts`
2. Create fetch function in `lib/f1-api.ts` with caching
3. Add API route in `app/api/f1/[endpoint]/route.ts`
4. Update components to fetch from new endpoint

### API Response Transformation
- Jolpica API returns nested objects (e.g., `standing.Driver.code`)  
- API routes transform to flat structure (e.g., `standing.driver.code`)
- Critical: Always map raw API responses in API routes before returning to components

### Cache Management
- Use `CACHE_KEYS` constants for consistent cache key naming
- Different TTL for different data types based on update frequency
- Cache empty results with shorter TTL to prevent repeated failed API calls

### Component Data Loading Pattern
```typescript
const [data, setData] = useState<Type[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('/api/f1/endpoint');
      if (!response.ok) throw new Error('Failed to fetch');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError('Error message');
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

## Current F1 Season Context

The app displays **2025 F1 season data** with notable driver changes:
- Oscar Piastri leading championship (McLaren)
- Lewis Hamilton moved to Ferrari
- Kimi Antonelli debuting at Mercedes
- Sprint weekends have special indicators and scheduling logic

## Data Sources Documentation

- `f1_data_sources.md`: Details about Jolpica F1 API endpoints and capabilities
- `design_concept.md`: Complete F1-themed design system and visual guidelines