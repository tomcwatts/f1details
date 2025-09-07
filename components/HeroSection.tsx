'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { F1Event } from '@/types/f1';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Thermometer, 
  Wind,
  ChevronRight,
  Play
} from 'lucide-react';

const HeroSection = () => {
  const [timeToRace, setTimeToRace] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [nextRace, setNextRace] = useState<F1Event | null>(null);
  const [relatedSessions, setRelatedSessions] = useState<F1Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNextRace = async () => {
      try {
        const response = await fetch('/api/f1/schedule');
        if (!response.ok) throw new Error('Failed to fetch schedule');
        
        const events: F1Event[] = await response.json();
        
        // Find the next race event
        const nextRaceEvent = events.find(event => event.isNext && event.eventType === 'race');
        
        if (nextRaceEvent) {
          setNextRace(nextRaceEvent);
          
          // Find related sessions for this race weekend
          const raceWeekendSessions = events.filter(event => 
            event.round === nextRaceEvent.round && 
            event.eventType !== 'race'
          ).sort((a, b) => new Date(a.utcDateTime).getTime() - new Date(b.utcDateTime).getTime());
          
          setRelatedSessions(raceWeekendSessions);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching next race:', err);
        setError('Failed to load race data');
        setLoading(false);
      }
    };

    fetchNextRace();
  }, []);

  useEffect(() => {
    if (!nextRace) return;
    
    const calculateTimeToRace = () => {
      const now = new Date().getTime();
      const raceTime = new Date(nextRace.utcDateTime).getTime();
      const difference = raceTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeToRace({ days, hours, minutes, seconds });
      }
    };

    calculateTimeToRace();
    const timer = setInterval(calculateTimeToRace, 1000);

    return () => clearInterval(timer);
  }, [nextRace]);

  if (loading) {
    return (
      <section className="relative min-h-[80vh] flex items-center justify-center f1-hero-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-muted rounded mb-4"></div>
              <div className="h-8 bg-muted rounded mb-8"></div>
              <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-20 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !nextRace) {
    return (
      <section className="relative min-h-[80vh] flex items-center justify-center f1-hero-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
              <span className="f1-text-glow">F1 Insights</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              {error || 'No upcoming races found'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center f1-hero-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="f1-gradient text-white border-0">
                Next Race
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="f1-text-glow">{nextRace.name}</span>
              </h1>
              <div className="flex items-center space-x-4 text-lg text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>{nextRace.circuit}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>{nextRace.location}</span>
                </div>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Days', value: timeToRace.days },
                { label: 'Hours', value: timeToRace.hours },
                { label: 'Minutes', value: timeToRace.minutes },
                { label: 'Seconds', value: timeToRace.seconds }
              ].map((item) => (
                <Card key={item.label} className="f1-border-glow bg-card/50 backdrop-blur">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl md:text-3xl font-bold f1-text-glow">
                      {item.value.toString().padStart(2, '0')}
                    </div>
                    <div className="text-sm text-muted-foreground">{item.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="f1-gradient text-white border-0 hover:opacity-90">
                <Play className="mr-2 h-5 w-5" />
                Watch Live Timing
              </Button>
              <Button size="lg" variant="outline" className="f1-border-glow">
                View Race Schedule
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right Column - Race Weekend Schedule */}
          <div className="space-y-6">
            <Card className="f1-border-glow bg-card/50 backdrop-blur">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  Race Weekend Schedule
                </h3>
                <div className="space-y-3">
                  {/* Show the race session first */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border-l-4 border-primary">
                    <div>
                      <div className="font-medium flex items-center">
                        <span className="mr-2">🏁</span>
                        Race
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(nextRace.utcDateTime).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm">
                        {new Date(nextRace.utcDateTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          timeZoneName: 'short'
                        })}
                      </div>
                    </div>
                  </div>
                  
                  {/* Show related sessions */}
                  {relatedSessions.slice(0, 4).map((session, index) => {
                    const sessionIcon = session.eventType === 'qualifying' ? '⏱️' : 
                                       session.eventType === 'sprint' ? '⚡' : '🔧';
                    const sessionName = session.name.replace(` - ${nextRace.name}`, '');
                    
                    return (
                      <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div>
                          <div className="font-medium flex items-center">
                            <span className="mr-2">{sessionIcon}</span>
                            {sessionName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(session.utcDateTime).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-sm">
                            {new Date(session.utcDateTime).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              timeZoneName: 'short'
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Circuit Info */}
            <Card className="f1-border-glow bg-card/50 backdrop-blur">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Circuit Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-lg font-semibold">{nextRace.circuit}</div>
                    <div className="text-sm text-muted-foreground">{nextRace.location}</div>
                  </div>
                  
                  {nextRace.lastYearWinner && (
                    <div>
                      <div className="text-sm font-semibold text-muted-foreground mb-1">2024 Winner</div>
                      <div className="text-base">
                        {nextRace.lastYearWinner.driver.givenName} {nextRace.lastYearWinner.driver.familyName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {nextRace.lastYearWinner.constructor.name}
                      </div>
                    </div>
                  )}
                  
                  {nextRace.hasSprint && (
                    <div className="flex items-center space-x-2">
                      <Badge className="f1-gradient text-white border-0 text-xs">
                        ⚡ Sprint Weekend
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

