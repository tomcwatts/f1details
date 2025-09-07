# F1 Insights ⚡

A modern Formula 1 data and insights web application built with **Next.js 15**, **TypeScript**, and **TailwindCSS**. Get real-time F1 race data, driver standings, and comprehensive race analytics.

## 🏎️ Features

- **Live Race Data**: Real-time F1 2025 season data from Jolpica F1 API
- **Race Calendar**: Complete F1 schedule with practice, qualifying, sprint, and race sessions
- **Driver Standings**: Live championship standings with team colors and flags
- **Next Race Countdown**: Dynamic countdown timer to the next F1 event
- **Circuit Information**: Detailed circuit data and 2024 race winners
- **Sprint Weekend Detection**: Special badges and scheduling for sprint race weekends
- **Responsive Design**: Mobile-first approach with beautiful F1-themed styling
- **Performance Optimized**: Aggressive caching and optimized API calls

## 🚀 Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom F1 theme
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Data Source**: Jolpica F1 API (Ergast replacement)
- **Caching**: Node-cache for high-performance data caching

## 🎨 Design

- **Dark F1 Theme**: Custom F1 red gradients and electric blue accents
- **Typography**: Clean, modern fonts with F1 racing aesthetics
- **Animations**: Smooth transitions and micro-interactions
- **Loading States**: Skeleton animations and proper error handling

## 📊 API Endpoints

- `GET /api/f1/schedule` - Complete F1 race calendar
- `GET /api/f1/standings/drivers` - Driver championship standings
- `GET /api/f1/standings/constructors` - Constructor standings

## 🏁 Current 2025 Season

- **Championship Leader**: Oscar Piastri (McLaren) - 309 points
- **Notable Moves**: Lewis Hamilton at Ferrari, Kimi Antonelli at Mercedes
- **Next Race**: Italian Grand Prix, September 7, 2025

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📱 Screenshots

The app features a modern, responsive design with:
- Dynamic race countdown timers
- Real-time championship standings
- Beautiful circuit information cards
- Sprint weekend indicators
- Mobile-optimized layouts

## 🔧 Configuration

The app uses intelligent caching:
- **Schedule Data**: 2-hour cache
- **Driver Standings**: 30-minute cache
- **Historical Results**: 24-hour cache

## 📄 License

Built with ❤️ for Formula 1 fans worldwide.

---

*Data provided by Jolpica F1 API • Not affiliated with Formula 1*