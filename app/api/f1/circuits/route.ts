import { NextResponse } from 'next/server';
import { CircuitVisualization, CircuitCharacteristics } from '@/types/f1';
import { fetchLastYearResults } from '@/lib/f1-api';

// Add revalidate for automatic caching
export const revalidate = 86400; // 24 hours

const CIRCUIT_DATA: Record<string, CircuitCharacteristics> = {
  'monaco': {
    length: '3.337 km',
    corners: 18,
    drsZones: 1,
    lapRecord: {
      time: '1:12.909',
      driver: 'Lewis Hamilton',
      year: '2019'
    },
    trackType: 'street'
  },
  'silverstone': {
    length: '5.891 km',
    corners: 18,
    drsZones: 2,
    lapRecord: {
      time: '1:24.303',
      driver: 'Max Verstappen',
      year: '2020'
    },
    trackType: 'permanent'
  },
  'monza': {
    length: '5.793 km',
    corners: 11,
    drsZones: 3,
    lapRecord: {
      time: '1:18.887',
      driver: 'Rubens Barrichello',
      year: '2004'
    },
    trackType: 'permanent'
  },
  'spa': {
    length: '7.004 km',
    corners: 19,
    drsZones: 2,
    lapRecord: {
      time: '1:41.252',
      driver: 'Valtteri Bottas',
      year: '2018'
    },
    trackType: 'permanent'
  },
  'bahrain': {
    length: '5.412 km',
    corners: 15,
    drsZones: 2,
    lapRecord: {
      time: '1:27.264',
      driver: 'Pedro de la Rosa',
      year: '2005'
    },
    trackType: 'permanent'
  },
  'suzuka': {
    length: '5.807 km',
    corners: 18,
    drsZones: 1,
    lapRecord: {
      time: '1:27.319',
      driver: 'Lewis Hamilton',
      year: '2019'
    },
    trackType: 'permanent'
  },
  'interlagos': {
    length: '4.309 km',
    corners: 15,
    drsZones: 2,
    lapRecord: {
      time: '1:07.281',
      driver: 'Valtteri Bottas',
      year: '2018'
    },
    trackType: 'permanent'
  },
  'austin': {
    length: '5.513 km',
    corners: 20,
    drsZones: 2,
    lapRecord: {
      time: '1:32.029',
      driver: 'Charles Leclerc',
      year: '2019'
    },
    trackType: 'permanent'
  }
};

const TRACK_LAYOUTS: Record<string, any> = {
  'monaco': {
    width: 400,
    height: 200,
    viewBox: "0 0 400 200",
    path: "M50,150 Q60,120 80,110 Q100,100 120,105 Q140,110 160,100 Q180,90 200,85 Q220,80 240,90 Q260,100 280,110 Q300,120 320,140 Q340,160 350,180 Q360,190 340,195 Q320,200 300,195 Q280,190 260,185 Q240,180 220,175 Q200,170 180,165 Q160,160 140,155 Q120,160 100,165 Q80,170 60,165 Q40,160 30,150 Q20,140 35,135 Q50,130 50,150"
  },
  'silverstone': {
    width: 400,
    height: 300,
    viewBox: "0 0 400 300",
    path: "M50,250 Q80,220 120,210 Q160,200 200,205 Q240,210 280,220 Q320,230 350,250 Q380,270 370,290 Q360,310 330,315 Q300,320 270,315 Q240,310 210,305 Q180,300 150,295 Q120,290 90,285 Q60,280 40,270 Q20,260 25,240 Q30,220 50,250"
  },
  'monza': {
    width: 400,
    height: 250,
    viewBox: "0 0 400 250",
    path: "M50,200 L350,200 Q370,200 370,180 Q370,160 350,140 Q330,120 310,110 Q290,100 270,105 Q250,110 230,120 Q210,130 190,140 Q170,150 150,160 L130,170 Q110,180 90,190 Q70,200 50,200"
  },
  'spa': {
    width: 400,
    height: 280,
    viewBox: "0 0 400 280",
    path: "M50,220 Q70,200 90,180 Q110,160 130,140 Q150,120 170,110 Q190,100 210,105 Q230,110 250,120 Q270,130 290,140 Q310,150 330,160 Q350,170 360,190 Q370,210 360,230 Q350,250 330,260 Q310,270 290,275 Q270,280 250,275 Q230,270 210,265 Q190,260 170,255 Q150,250 130,245 Q110,240 90,235 Q70,230 50,220"
  },
  'bahrain': {
    width: 400,
    height: 220,
    viewBox: "0 0 400 220",
    path: "M50,180 Q80,160 120,150 Q160,140 200,145 Q240,150 280,160 Q320,170 350,180 Q370,190 365,200 Q360,210 340,215 Q320,220 300,215 Q280,210 260,205 Q240,200 220,195 Q200,190 180,185 Q160,180 140,175 Q120,170 100,165 Q80,160 60,165 Q40,170 35,175 Q30,180 40,185 Q50,190 50,180"
  },
  'suzuka': {
    width: 400,
    height: 260,
    viewBox: "0 0 400 260",
    path: "M50,200 Q70,180 100,170 Q130,160 160,155 Q190,150 220,155 Q250,160 280,170 Q310,180 340,200 Q360,220 350,240 Q340,260 310,255 Q280,250 250,245 Q220,240 190,235 Q160,230 130,225 Q100,220 70,215 Q50,210 45,200 Q40,190 50,185 Q60,180 50,200"
  },
  'interlagos': {
    width: 400,
    height: 200,
    viewBox: "0 0 400 200",
    path: "M50,150 Q80,130 120,125 Q160,120 200,125 Q240,130 280,140 Q320,150 350,160 Q370,170 365,185 Q360,200 330,195 Q300,190 270,185 Q240,180 210,175 Q180,170 150,165 Q120,160 90,155 Q60,150 40,145 Q30,140 35,135 Q40,130 50,150"
  },
  'austin': {
    width: 400,
    height: 240,
    viewBox: "0 0 400 240",
    path: "M50,190 Q70,170 100,160 Q130,150 160,155 Q190,160 220,170 Q250,180 280,190 Q310,200 340,210 Q360,220 355,235 Q350,250 320,245 Q290,240 260,235 Q230,230 200,225 Q170,220 140,215 Q110,210 80,205 Q50,200 40,190 Q30,180 40,175 Q50,170 50,190"
  }
};

const CIRCUIT_NAME_MAPPING: Record<string, string> = {
  'monaco': 'Circuit de Monaco',
  'silverstone': 'Silverstone Circuit',
  'monza': 'Autodromo Nazionale di Monza',
  'spa': 'Circuit de Spa-Francorchamps',
  'bahrain': 'Bahrain International Circuit',
  'suzuka': 'Suzuka International Racing Course',
  'interlagos': 'Autódromo José Carlos Pace',
  'austin': 'Circuit of The Americas'
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const circuitId = searchParams.get('id');
    const currentYear = new Date().getFullYear();
    
    // Fetch recent race winners from last year
    const lastYearWinners = await fetchLastYearResults(currentYear - 1);
    
    if (circuitId && CIRCUIT_DATA[circuitId]) {
      const circuitName = CIRCUIT_NAME_MAPPING[circuitId] || circuitId.charAt(0).toUpperCase() + circuitId.slice(1);
      const lastYearWinner = lastYearWinners.get(circuitName);
      
      const circuitVisualization: CircuitVisualization = {
        circuitId,
        circuitName,
        location: {
          lat: '0',
          long: '0',
          locality: circuitId.charAt(0).toUpperCase() + circuitId.slice(1),
          country: 'Unknown'
        },
        characteristics: CIRCUIT_DATA[circuitId],
        trackLayout: TRACK_LAYOUTS[circuitId],
        recentWinners: lastYearWinner ? [lastYearWinner] : undefined
      };
      
      return NextResponse.json(circuitVisualization);
    }
    
    // Return all circuits with winner data
    const allCircuits = Object.keys(CIRCUIT_DATA).map(id => {
      const circuitName = CIRCUIT_NAME_MAPPING[id] || id.charAt(0).toUpperCase() + id.slice(1);
      const lastYearWinner = lastYearWinners.get(circuitName);
      
      return {
        circuitId: id,
        circuitName,
        characteristics: CIRCUIT_DATA[id],
        trackLayout: TRACK_LAYOUTS[id],
        recentWinners: lastYearWinner ? [lastYearWinner] : undefined
      };
    });
    
    return NextResponse.json(allCircuits);
  } catch (error) {
    console.error('Error fetching circuit data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch circuit data' },
      { status: 500 }
    );
  }
}