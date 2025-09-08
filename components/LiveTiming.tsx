'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Timer, 
  Play, 
  Pause, 
  RotateCcw,
  Zap,
  Flag,
  Circle
} from 'lucide-react';

const LiveTiming = () => {
  const [isLive, setIsLive] = useState(false);
  const [sessionTime, setSessionTime] = useState('00:00:00');

  // Mock live timing data - in real app, this would come from OpenF1 API
  const [timingData, setTimingData] = useState([
    {
      position: 1,
      driver: "VER",
      fullName: "Max Verstappen",
      team: "Red Bull Racing",
      teamColor: "#3671C6",
      lastLap: "1:23.456",
      bestLap: "1:22.891",
      gap: "LEADER",
      interval: "LEADER",
      sector1: "23.456",
      sector2: "35.123",
      sector3: "24.312",
      speed: "342",
      status: "running"
    },
    {
      position: 2,
      driver: "NOR",
      fullName: "Lando Norris",
      team: "McLaren",
      teamColor: "#FF8000",
      lastLap: "1:23.789",
      bestLap: "1:23.012",
      gap: "+0.333",
      interval: "+0.333",
      sector1: "23.567",
      sector2: "35.234",
      sector3: "24.988",
      speed: "339",
      status: "running"
    },
    {
      position: 3,
      driver: "LEC",
      fullName: "Charles Leclerc",
      team: "Ferrari",
      teamColor: "#E8002D",
      lastLap: "1:24.123",
      bestLap: "1:23.234",
      gap: "+0.891",
      interval: "+0.558",
      sector1: "23.789",
      sector2: "35.456",
      sector3: "24.878",
      speed: "337",
      status: "running"
    },
    {
      position: 4,
      driver: "PIA",
      fullName: "Oscar Piastri",
      team: "McLaren",
      teamColor: "#FF8000",
      lastLap: "1:24.456",
      bestLap: "1:23.567",
      gap: "+1.234",
      interval: "+0.343",
      sector1: "23.890",
      sector2: "35.678",
      sector3: "24.888",
      speed: "335",
      status: "running"
    },
    {
      position: 5,
      driver: "SAI",
      fullName: "Carlos Sainz",
      team: "Ferrari",
      teamColor: "#E8002D",
      lastLap: "1:24.789",
      bestLap: "1:23.890",
      gap: "+1.567",
      interval: "+0.333",
      sector1: "24.012",
      sector2: "35.789",
      sector3: "24.988",
      speed: "333",
      status: "running"
    }
  ]);

  // Simulate live timing updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLive) {
      interval = setInterval(() => {
        // Update session time
        const now = new Date();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const milliseconds = Math.floor(now.getMilliseconds() / 10).toString().padStart(2, '0');
        setSessionTime(`00:${minutes}:${seconds}.${milliseconds}`);

        // Simulate timing updates
        setTimingData(prevData => 
          prevData.map(driver => ({
            ...driver,
            lastLap: `1:${(23 + Math.random() * 2).toFixed(3)}`,
            speed: (330 + Math.random() * 20).toFixed(0),
            sector1: (23 + Math.random() * 1).toFixed(3),
            sector2: (35 + Math.random() * 1).toFixed(3),
            sector3: (24 + Math.random() * 1).toFixed(3)
          }))
        );
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isLive]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-500';
      case 'pit': return 'text-yellow-500';
      case 'out': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <section id="live" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Live <span className="f1-text-glow">Timing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time race data and timing information during Formula 1 sessions.
          </p>
        </div>

        {/* Session Controls */}
        <div className="max-w-6xl mx-auto mb-8">
          <Card className="f1-border-glow bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Circle className={`h-3 w-3 ${isLive ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`} />
                    <span className="font-semibold">
                      {isLive ? 'LIVE' : 'OFFLINE'}
                    </span>
                  </div>
                  <Badge variant="outline">Practice 3</Badge>
                  <Badge variant="outline">Abu Dhabi GP</Badge>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="font-mono text-lg font-bold">
                    {sessionTime}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant={isLive ? "destructive" : "default"}
                      onClick={() => setIsLive(!isLive)}
                    >
                      {isLive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {isLive ? 'Pause' : 'Start Live'}
                    </Button>
                    <Button size="sm" variant="outline">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Live Timing Table */}
        <div className="max-w-6xl mx-auto">
          <Card className="f1-border-glow bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Timer className="h-6 w-6" />
                <span>Live Timing Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-2 p-4 border-b border-border/40 text-sm font-semibold text-muted-foreground">
                <div className="col-span-1">POS</div>
                <div className="col-span-2">DRIVER</div>
                <div className="col-span-1 hidden sm:block">TEAM</div>
                <div className="col-span-2">LAST LAP</div>
                <div className="col-span-2">BEST LAP</div>
                <div className="col-span-1 hidden md:block">GAP</div>
                <div className="col-span-1 hidden md:block">INT</div>
                <div className="col-span-2 sm:col-span-1">SPEED</div>
              </div>

              {/* Timing Rows */}
              <div className="space-y-1">
                {timingData.map((driver, index) => (
                  <div
                    key={driver.driver}
                    className={`grid grid-cols-12 gap-2 p-4 hover:bg-muted/30 transition-colors ${
                      index !== timingData.length - 1 ? 'border-b border-border/40' : ''
                    }`}
                  >
                    {/* Position */}
                    <div className="col-span-1 font-bold text-lg">
                      {driver.position}
                    </div>

                    {/* Driver */}
                    <div className="col-span-2">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-6 rounded"
                          style={{ backgroundColor: driver.teamColor }}
                        />
                        <div>
                          <div className="font-semibold">{driver.driver}</div>
                          <div className="text-xs text-muted-foreground sm:hidden">
                            {driver.team}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Team (hidden on mobile) */}
                    <div className="col-span-1 hidden sm:block text-sm text-muted-foreground">
                      {driver.team}
                    </div>

                    {/* Last Lap */}
                    <div className="col-span-2 font-mono">
                      <div className="font-semibold">{driver.lastLap}</div>
                      <div className="text-xs text-muted-foreground">
                        S1: {driver.sector1}
                      </div>
                    </div>

                    {/* Best Lap */}
                    <div className="col-span-2 font-mono">
                      <div className="font-semibold text-purple-400">{driver.bestLap}</div>
                      <div className="text-xs text-muted-foreground">
                        S2: {driver.sector2}
                      </div>
                    </div>

                    {/* Gap (hidden on mobile) */}
                    <div className="col-span-1 hidden md:block font-mono text-sm">
                      {driver.gap}
                    </div>

                    {/* Interval (hidden on mobile) */}
                    <div className="col-span-1 hidden md:block font-mono text-sm">
                      {driver.interval}
                    </div>

                    {/* Speed */}
                    <div className="col-span-2 sm:col-span-1">
                      <div className="font-mono font-semibold">{driver.speed}</div>
                      <div className="text-xs text-muted-foreground">km/h</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Session Info */}
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <Card className="f1-border-glow bg-card/50 backdrop-blur">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold f1-text-glow mb-2">
                  1:22.891
                </div>
                <div className="text-sm text-muted-foreground">
                  Fastest Lap (VER)
                </div>
              </CardContent>
            </Card>

            <Card className="f1-border-glow bg-card/50 backdrop-blur">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold f1-text-glow mb-2">
                  342
                </div>
                <div className="text-sm text-muted-foreground">
                  Top Speed (km/h)
                </div>
              </CardContent>
            </Card>

            <Card className="f1-border-glow bg-card/50 backdrop-blur">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold f1-text-glow mb-2">
                  28°C
                </div>
                <div className="text-sm text-muted-foreground">
                  Track Temperature
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveTiming;

