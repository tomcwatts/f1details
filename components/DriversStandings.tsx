'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { DriverStanding } from '@/types/f1';
import { 
  Trophy, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ChevronRight,
  Crown
} from 'lucide-react';

const DriversStandings = () => {
  const [driversStandings, setDriversStandings] = useState<DriverStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDriverStandings = async () => {
      try {
        const response = await fetch('/api/f1/standings/drivers');
        if (!response.ok) throw new Error('Failed to fetch driver standings');
        
        const standings: DriverStanding[] = await response.json();
        setDriversStandings(standings);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching driver standings:', err);
        setError('Failed to load driver standings');
        setLoading(false);
      }
    };

    fetchDriverStandings();
  }, []);

  const getTeamColor = (constructorName: string): string => {
    // Team color mapping based on 2025 F1 teams
    const teamColors: { [key: string]: string } = {
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
    
    // Try to match constructor name with team colors
    for (const [team, color] of Object.entries(teamColors)) {
      if (constructorName.includes(team)) {
        return color;
      }
    }
    
    return '#888888'; // Default gray
  };

  const getNationalityFlag = (nationality: string): string => {
    const flagMap: { [key: string]: string } = {
      'Dutch': '🇳🇱',
      'British': '🇬🇧',
      'Monégasque': '🇲🇨',
      'Australian': '🇦🇺',
      'Spanish': '🇪🇸',
      'Mexican': '🇲🇽',
      'German': '🇩🇪',
      'Canadian': '🇨🇦',
      'French': '🇫🇷',
      'Japanese': '🇯🇵',
      'Thai': '🇹🇭',
      'Finnish': '🇫🇮',
      'Chinese': '🇨🇳',
      'American': '🇺🇸',
      'Danish': '🇩🇰'
    };
    
    return flagMap[nationality] || '🏁';
  };

  const maxPoints = driversStandings.length > 0 ? parseInt(driversStandings[0].points) : 100;

  if (loading) {
    return (
      <section id="drivers" className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Drivers <span className="f1-text-glow">Championship</span>
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card className="f1-border-glow bg-card/50 backdrop-blur animate-pulse">
              <CardHeader>
                <div className="h-8 bg-muted rounded"></div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {[1,2,3,4,5,6,7,8].map(i => (
                    <div key={i} className="p-4 border-b border-border/40">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-1">
                          <div className="h-6 w-6 bg-muted rounded"></div>
                        </div>
                        <div className="col-span-4 sm:col-span-3">
                          <div className="h-4 bg-muted rounded mb-2"></div>
                          <div className="h-3 bg-muted rounded"></div>
                        </div>
                        <div className="col-span-7 sm:col-span-8">
                          <div className="h-4 bg-muted rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="drivers" className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Drivers <span className="f1-text-glow">Championship</span>
            </h2>
            <p className="text-lg text-muted-foreground">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="drivers" className="py-20 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Drivers <span className="f1-text-glow">Championship</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Current standings in the Formula 1 World Drivers' Championship with points, wins, and recent form.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="f1-border-glow bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <span>{new Date().getFullYear()} Drivers' Standings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {driversStandings.map((driver, index) => (
                  <div
                    key={`${driver.driver.code}-${driver.position}`}
                    className={`p-4 hover:bg-muted/30 transition-colors ${
                      index !== driversStandings.length - 1 ? 'border-b border-border/40' : ''
                    }`}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Position */}
                      <div className="col-span-1 text-center">
                        <div className="flex items-center justify-center">
                          {driver.position === '1' && (
                            <Crown className="h-4 w-4 text-yellow-500 mr-1" />
                          )}
                          <span className="text-lg font-bold">{driver.position}</span>
                        </div>
                      </div>

                      {/* Driver Info */}
                      <div className="col-span-4 sm:col-span-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-xl">{getNationalityFlag(driver.driver.nationality)}</div>
                          <div>
                            <div className="font-semibold">
                              {driver.driver.givenName} {driver.driver.familyName}
                            </div>
                            <div className="text-sm text-muted-foreground">{driver.constructor.name}</div>
                          </div>
                        </div>
                      </div>

                      {/* Team Color */}
                      <div className="col-span-1 hidden sm:block">
                        <div
                          className="w-4 h-8 rounded"
                          style={{ backgroundColor: getTeamColor(driver.constructor.name) }}
                        />
                      </div>

                      {/* Points */}
                      <div className="col-span-2 text-center">
                        <div className="text-xl font-bold">{driver.points}</div>
                        <div className="text-xs text-muted-foreground">PTS</div>
                      </div>

                      {/* Progress Bar */}
                      <div className="col-span-2 hidden md:block">
                        <Progress 
                          value={(parseInt(driver.points) / maxPoints) * 100} 
                          className="h-2"
                        />
                      </div>

                      {/* Stats */}
                      <div className="col-span-2 hidden lg:block">
                        <div className="flex space-x-4 text-sm">
                          <div className="text-center">
                            <div className="font-semibold">{driver.wins}</div>
                            <div className="text-xs text-muted-foreground">WINS</div>
                          </div>
                        </div>
                      </div>

                      {/* Driver Code */}
                      <div className="col-span-2 sm:col-span-1 text-center">
                        <div className="text-sm font-mono font-bold">
                          {driver.driver.code}
                        </div>
                      </div>
                    </div>

                    {/* Mobile Stats */}
                    <div className="lg:hidden mt-3 pt-3 border-t border-border/40">
                      <div className="flex justify-between text-sm">
                        <div className="flex space-x-4">
                          <span><strong>{driver.wins}</strong> wins</span>
                          <span><strong>{driver.points}</strong> points</span>
                        </div>
                        <div className="md:hidden">
                          <Progress 
                            value={(parseInt(driver.points) / maxPoints) * 100} 
                            className="h-2 w-20"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Championship Stats */}
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <Card className="f1-border-glow bg-card/50 backdrop-blur">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold f1-text-glow mb-2">
                  {driversStandings.length > 1 ? 
                    (parseInt(driversStandings[0].points) - parseInt(driversStandings[1].points)) : 
                    '0'
                  }
                </div>
                <div className="text-sm text-muted-foreground">
                  Points lead for {driversStandings[0]?.driver.familyName || 'Leader'}
                </div>
              </CardContent>
            </Card>

            <Card className="f1-border-glow bg-card/50 backdrop-blur">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold f1-text-glow mb-2">
                  {driversStandings.reduce((sum, driver) => sum + parseInt(driver.wins || '0'), 0)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total wins this season
                </div>
              </CardContent>
            </Card>

            <Card className="f1-border-glow bg-card/50 backdrop-blur">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold f1-text-glow mb-2">
                  {new Set(driversStandings.filter(d => parseInt(d.wins || '0') > 0).map(d => d.driver.familyName)).size}
                </div>
                <div className="text-sm text-muted-foreground">
                  Different race winners
                </div>
              </CardContent>
            </Card>
          </div>

          {/* View More Button */}
          <div className="text-center mt-8">
            <Button size="lg" className="f1-gradient text-white border-0 hover:opacity-90">
              View Detailed Driver Stats
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DriversStandings;