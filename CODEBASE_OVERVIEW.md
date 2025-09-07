# F1 Details - Codebase Overview

> **A comprehensive Formula 1 insights application built with Next.js 15, featuring real-time race data, driver standings, and circuit visualizations.**

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Architecture Overview](#architecture-overview)
- [Core Technologies](#core-technologies)
- [Project Structure](#project-structure)
- [Data Integration](#data-integration)
- [Components Architecture](#components-architecture)
- [API Routes](#api-routes)
- [Styling System](#styling-system)
- [Type System](#type-system)
- [Caching Strategy](#caching-strategy)
- [Key Features](#key-features)
- [Development Guidelines](#development-guidelines)
- [Important Files Reference](#important-files-reference)

## 🚀 Quick Start

```bash
# Development
npm run dev          # Start development server on http://localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Dependencies
npm install          # Install all dependencies
```

## 🏗️ Architecture Overview

### Framework Stack
- **Next.js 15** with App Router (`app/` directory structure)
- **TypeScript** with strict type checking
- **TailwindCSS** + **shadcn/ui** component library
- **Node.js caching** with intelligent TTL strategies

### Design Pattern
**Client-Server Architecture** with:
- **API Routes** (`app/api/f1/`) as backend services
- **React Components** as frontend with client-side data fetching
- **Shared Types** (`types/f1.ts`) ensuring type safety across stack
- **Service Layer** (`lib/f1-api.ts`) handling external API integration

## 🔧 Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.0.3 | React framework with App Router |
| React | 18.3.1 | UI library |
| TypeScript | 5.6.3 | Type safety |
| TailwindCSS | 3.4.14 | Styling framework |
| Axios | 1.7.7 | HTTP client for API calls |
| Node-Cache | 5.1.2 | In-memory caching |
| Radix UI | Latest | Accessible component primitives |
| Lucide React | 0.453.0 | Icon library |

## 📁 Project Structure

```
f1details/
├── app/                    # Next.js 15 App Router
│   ├── api/f1/            # Backend API routes
│   │   ├── circuits/       # Circuit data endpoint
│   │   ├── schedule/       # Race schedule endpoint
│   │   └── standings/      # Championship standings
│   ├── globals.css         # Global styles + F1 theme
│   ├── layout.tsx          # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/               # shadcn/ui base components
│   ├── HeroSection.tsx   # Next race countdown
│   ├── UpcomingRaces.tsx # Race calendar
│   ├── DriversStandings.tsx # Championship table
│   └── CircuitVisualization.tsx # Interactive circuits
├── lib/                  # Utility libraries
│   ├── f1-api.ts        # F1 data service layer
│   ├── cache.ts         # Caching configuration
│   └── utils.ts         # General utilities
├── types/               # TypeScript definitions
│   └── f1.ts           # F1 data types
└── CLAUDE.md           # Development instructions
```

## 🔄 Data Integration

### External Data Source
**Jolpica F1 API** (`http://api.jolpi.ca/ergast/f1`)
- Modern replacement for deprecated Ergast API
- Provides 2025 F1 season data
- Historical race results for previous year winners
- Driver and constructor championship standings

### Data Flow Architecture
1. **External API** → **Service Layer** (`lib/f1-api.ts`)
2. **Service Layer** → **API Routes** (`app/api/f1/`)
3. **API Routes** → **React Components** (via fetch)
4. **Components** → **User Interface**

### API Response Transformation
```typescript
// Raw Jolpica API format
standing.Driver.code        // Nested object structure
standing.Constructors[0]    // Array access required

// Transformed format (in API routes)
standing.driver.code        // Flat structure
standing.constructor        // Direct object access
```

## 🧩 Components Architecture

### Main Page Components

#### `HeroSection.tsx`
- **Purpose**: Next race countdown and weekend schedule
- **Data**: Fetches from `/api/f1/schedule`
- **Features**: Live countdown timer, race weekend schedule, circuit info
- **State Management**: `useState` + `useEffect` pattern

#### `UpcomingRaces.tsx`
- **Purpose**: Race calendar grid with circuit info
- **Data**: Filters race events from schedule API
- **Features**: Previous year winners, sprint weekend indicators, country flags
- **Displays**: Next 6 upcoming races

#### `DriversStandings.tsx`
- **Purpose**: Live championship table
- **Data**: Fetches from `/api/f1/standings/drivers`
- **Features**: Team colors, nationality flags, progress bars
- **Styling**: 2025 F1 team color mapping hardcoded

#### `CircuitVisualization.tsx`
- **Purpose**: Interactive circuit showcases
- **Features**: SVG track layouts, circuit characteristics
- **Usage**: Featured circuits on homepage

### Data Fetching Pattern
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

## 🛣️ API Routes

### `/api/f1/schedule/route.ts`
- **Purpose**: Race schedule with all session types
- **Caching**: 2 hours (`CACHE_KEYS.F1_SCHEDULE`)
- **Features**: Qualifying results, previous year winners, sprint indicators

### `/api/f1/standings/drivers/route.ts`
- **Purpose**: Driver championship standings
- **Caching**: 30 minutes (`CACHE_KEYS.DRIVER_STANDINGS`)
- **Transformation**: Maps nested API response to flat structure

### `/api/f1/standings/constructors/route.ts`
- **Purpose**: Constructor championship standings
- **Caching**: 30 minutes (`CACHE_KEYS.CONSTRUCTOR_STANDINGS`)

### `/api/f1/circuits/route.ts`
- **Purpose**: Circuit data and characteristics
- **Features**: Track layouts, lap records, elevation data

## 🎨 Styling System

### TailwindCSS Configuration
```javascript
// tailwind.config.js - shadcn/ui + custom F1 theme
theme: {
  extend: {
    colors: {
      primary: "hsl(var(--primary))",    // F1 Red
      accent: "hsl(var(--accent))",      // Electric Blue
      // ... shadcn/ui color system
    }
  }
}
```

### F1 Custom Classes (`app/globals.css`)
```css
.f1-gradient {
  background: linear-gradient(135deg, #E10600 0%, #FF6B00 100%);
}

.f1-text-glow {
  text-shadow: 0 0 20px rgba(225, 6, 0, 0.5);
}

.f1-border-glow {
  border: 1px solid rgba(225, 6, 0, 0.3);
  box-shadow: 0 0 10px rgba(225, 6, 0, 0.1);
}

.f1-card-hover {
  transition: all 0.3s ease;
}

.f1-card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(225, 6, 0, 0.2);
}
```

### Team Color Mapping (2025 Season)
```typescript
const teamColors = {
  'Red Bull': '#3671C6',
  'Ferrari': '#E8002D', 
  'McLaren': '#FF8000',
  'Mercedes': '#27F4D2',
  'Aston Martin': '#00594F',
  'Alpine': '#0093CC',
  'Williams': '#64C4FF',
  'RB': '#6692FF',
  'Kick Sauber': '#52E252',
  'Haas': '#B6BABD'
};
```

## 📝 Type System

### Core Interfaces (`types/f1.ts`)

#### F1Event
```typescript
interface F1Event {
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
```

#### DriverStanding
```typescript
interface DriverStanding {
  position: string;
  points: string;
  wins: string;
  driver: Driver;
  constructor: Constructor;
}
```

#### API Response Types
- `JolpicaRaceResponse` - Raw API response format
- `JolpicaStandingsResponse` - Standings API format
- Mapped to clean interfaces in API routes

## 💾 Caching Strategy

### Cache Configuration (`lib/cache.ts`)
```typescript
export const cache = new NodeCache({ 
  stdTTL: 7200,        // 2 hours default TTL
  checkperiod: 600,    // Check expired keys every 10 minutes
  useClones: false     // Performance optimization
});
```

### Intelligent TTL Strategy
| Data Type | TTL | Reasoning |
|-----------|-----|-----------|
| **Schedule Data** | 2 hours | Changes during race weekends |
| **Driver Standings** | 30 minutes | Updates after each session |
| **Historical Results** | 24 hours | Rarely changes |
| **Qualifying Results** | 4 hours | Only for recent races (±7-30 days) |
| **Empty Results** | 1 hour | Prevent repeated failed API calls |

### Smart Qualifying Fetch Logic
```typescript
// Only fetch qualifying for races within 7 days past or 30 days future
function shouldFetchQualifying(raceDate: string, currentDate: Date): boolean {
  const race = new Date(raceDate);
  const daysDiff = Math.floor((race.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
  return daysDiff >= -7 && daysDiff <= 30;
}
```

## ✨ Key Features

### 🏎️ Real-Time Race Countdown
- Live countdown to next F1 event
- Complete race weekend schedule
- Previous year winner information
- Sprint weekend indicators

### 📊 Championship Standings
- Live driver and constructor standings
- Team color-coded displays
- Nationality flags
- Progress visualization

### 📅 Race Calendar
- Upcoming race schedule
- Circuit information and characteristics
- Historical context with previous winners
- Session scheduling (Practice, Qualifying, Sprint, Race)

### 🏁 Circuit Visualizations
- Interactive circuit layouts
- Track characteristics (length, corners, DRS zones)
- Lap records and elevation data
- Recent winner history

### ⚡ Performance Optimizations
- Intelligent caching with varying TTL
- Rate limiting for external API calls
- Optimized package imports
- Client-side loading states and error boundaries

## 📋 Development Guidelines

### Adding New F1 Data Endpoints
1. **Add types** to `types/f1.ts`
2. **Create fetch function** in `lib/f1-api.ts` with caching
3. **Add API route** in `app/api/f1/[endpoint]/route.ts`
4. **Update components** to fetch from new endpoint

### Component Development Pattern
- Use `'use client'` directive for interactive components
- Follow `useState` + `useEffect` data fetching pattern
- Implement loading states and error boundaries
- Apply F1 theming classes consistently

### API Response Transformation
- Always transform raw Jolpica API responses in API routes
- Use flat object structures for component consumption
- Implement proper error handling and caching

### Caching Best Practices
- Use `CACHE_KEYS` constants for consistent naming
- Set appropriate TTL based on data volatility
- Cache empty results to prevent repeated failed calls
- Include rate limiting for external API calls

## 📚 Important Files Reference

### Core Configuration
- `package.json` - Dependencies and scripts
- `next.config.js` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - TailwindCSS + shadcn/ui setup

### Essential Code Files
- `types/f1.ts` - Complete F1 data type definitions
- `lib/f1-api.ts` - F1 data service layer with caching
- `lib/cache.ts` - Caching configuration and keys
- `app/globals.css` - F1 theme and custom styles
- `CLAUDE.md` - Development instructions and context

### Main Components
- `app/page.tsx` - Homepage layout
- `components/HeroSection.tsx` - Next race countdown
- `components/UpcomingRaces.tsx` - Race calendar
- `components/DriversStandings.tsx` - Championship standings
- `components/CircuitVisualization.tsx` - Interactive circuits

### API Endpoints
- `app/api/f1/schedule/route.ts` - Race schedule data
- `app/api/f1/standings/drivers/route.ts` - Driver standings
- `app/api/f1/standings/constructors/route.ts` - Constructor standings
- `app/api/f1/circuits/route.ts` - Circuit data

---

## 🏁 Current Season Context

The application displays **2025 F1 season data** with notable changes:
- **Oscar Piastri** leading the championship (McLaren)
- **Lewis Hamilton** moved to Ferrari  
- **Kimi Antonelli** debuting at Mercedes
- **Sprint weekends** have special indicators and scheduling logic

This codebase represents a production-ready F1 application with excellent architecture, performance optimizations, and comprehensive feature set for Formula 1 enthusiasts.