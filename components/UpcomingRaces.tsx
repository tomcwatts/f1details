"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { F1Event } from "@/types/f1";
import { Calendar, MapPin, Clock, ChevronRight, Flag, Zap } from "lucide-react";
import RaceCard from "./RaceCard";

const UpcomingRaces = () => {
  const [upcomingRaces, setUpcomingRaces] = useState<F1Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpcomingRaces = async () => {
      try {
        const response = await fetch("/api/f1/schedule");
        if (!response.ok) throw new Error("Failed to fetch schedule");

        const events: F1Event[] = await response.json();

        // Filter for upcoming race events only (not practice/qualifying)
        const now = new Date();
        const raceEvents = events
          .filter(
            (event) =>
              event.eventType === "race" && new Date(event.utcDateTime) > now
          )
          .slice(0, 6) // Show next 6 races
          .sort(
            (a, b) =>
              new Date(a.utcDateTime).getTime() -
              new Date(b.utcDateTime).getTime()
          );

        setUpcomingRaces(raceEvents);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching upcoming races:", err);
        setError("Failed to load race calendar");
        setLoading(false);
      }
    };

    fetchUpcomingRaces();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  };

  const getDaysUntilRace = (dateString: string): number => {
    const now = new Date();
    const raceDate = new Date(dateString);
    const diffTime = raceDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getCountryFlag = (location: string): string => {
    // Simple country flag mapping - in production you'd use a proper library
    const countryFlags: { [key: string]: string } = {
      Australia: "🇦🇺",
      Bahrain: "🇧🇭",
      "Saudi Arabia": "🇸🇦",
      Japan: "🇯🇵",
      China: "🇨🇳",
      "United States": "🇺🇸",
      Italy: "🇮🇹",
      Monaco: "🇲🇨",
      Canada: "🇨🇦",
      Spain: "🇪🇸",
      Austria: "🇦🇹",
      "United Kingdom": "🇬🇧",
      Hungary: "🇭🇺",
      Belgium: "🇧🇪",
      Netherlands: "🇳🇱",
      Singapore: "🇸🇬",
      Azerbaijan: "🇦🇿",
      Qatar: "🇶🇦",
      Mexico: "🇲🇽",
      Brazil: "🇧🇷",
      "United Arab Emirates": "🇦🇪",
      "Las Vegas": "🇺🇸",
    };

    const country = location.split(", ").pop() || location;
    return countryFlags[country] || "🏁";
  };

  if (loading) {
    return (
      <section id="races" className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Upcoming <span className="f1-text-glow">Races</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card
                key={i}
                className="f1-border-glow bg-card/50 backdrop-blur animate-pulse"
              >
                <CardHeader className="pb-4">
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-20 bg-muted rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="races" className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Upcoming <span className="f1-text-glow">Races</span>
            </h2>
            <p className="text-lg text-muted-foreground">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="races" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Upcoming <span className="f1-text-glow">Races</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay up to date with the Formula 1 calendar. Get detailed schedules,
            circuit information, and race insights.
          </p>
        </div>

        <div className="mb-52"></div>

        <RaceCard
          race={{
            round: 12,
            name: "British Grand Prix",
            country: "United Kingdom",
            flag: "🇬🇧",
            location: "Silverstone",
            circuit: "Silverstone Circuit",
            date: "2025-07-06T14:00:00Z",
            type: "Grand Prix",
          }}
          now={new Date()}
        />

        <div className="mb-52"></div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingRaces.map((race) => (
            <Card
              key={race.id}
              className="f1-card-hover f1-border-glow bg-card/50 backdrop-blur"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        Round {race.round}
                      </Badge>
                      {race.hasSprint && (
                        <Badge className="f1-gradient text-white border-0 text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          Sprint
                        </Badge>
                      )}
                      {race.isNext && (
                        <Badge className="bg-green-600 text-white border-0 text-xs">
                          Next
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl leading-tight">
                      {race.name}
                    </CardTitle>
                  </div>
                  <div className="text-2xl">
                    {getCountryFlag(race.location)}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{race.circuit}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {formatDate(race.utcDateTime)} •{" "}
                      {formatTime(race.utcDateTime)}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Countdown */}
                <div className="text-center p-4 rounded-lg bg-muted/30">
                  <div className="text-2xl font-bold f1-text-glow">
                    {getDaysUntilRace(race.utcDateTime)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    days until race
                  </div>
                </div>

                {/* Circuit Info */}
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-semibold">{race.location}</span>
                  </div>
                  {race.lastYearWinner && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">2024 Winner: </span>
                      {race.lastYearWinner.driver.givenName}{" "}
                      {race.lastYearWinner.driver.familyName}
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <Button className="w-full" variant="outline">
                  View Race Details
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Races Button */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            className="f1-gradient text-white border-0 hover:opacity-90"
          >
            View Full {new Date().getFullYear()} Calendar
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default UpcomingRaces;
