'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CircuitVisualization as CircuitData } from '@/types/f1';

interface CircuitVisualizationProps {
  circuitId?: string;
  showControls?: boolean;
  className?: string;
  interactive?: boolean;
}

export default function CircuitVisualization({ 
  circuitId, 
  showControls = false,
  className = "",
  interactive = false
}: CircuitVisualizationProps) {
  const [circuitData, setCircuitData] = useState<CircuitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  useEffect(() => {
    const fetchCircuitData = async () => {
      try {
        const url = circuitId 
          ? `/api/f1/circuits?id=${circuitId}`
          : '/api/f1/circuits';
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch circuit data');
        
        const data = await response.json();
        setCircuitData(circuitId ? data : data[0]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchCircuitData();
  }, [circuitId]);

  if (loading) {
    return (
      <Card className={`${className} animate-pulse`}>
        <CardHeader>
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-gray-300 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !circuitData) {
    return (
      <Card className={`${className} border-red-200`}>
        <CardContent className="p-6">
          <p className="text-red-600">
            {error || 'No circuit data available'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const { characteristics, trackLayout } = circuitData;

  return (
    <Card 
      className={`${className} f1-card-hover transition-all duration-300 ${
        interactive ? 'cursor-pointer hover:scale-[1.02] hover:shadow-2xl' : ''
      } ${isHovered && interactive ? 'ring-2 ring-[#00D4FF]/50' : ''}`}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
    >
      <CardHeader>
        <CardTitle className="f1-text-glow flex items-center justify-between">
          {circuitData.circuitName}
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="f1-border-glow">
              {characteristics.trackType}
            </Badge>
            {interactive && isHovered && (
              <Badge variant="outline" className="bg-[#00D4FF]/20 text-[#00D4FF] border-[#00D4FF]/50">
                Interactive
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Track Visualization */}
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-4 f1-border-glow overflow-hidden">
          {trackLayout ? (
            <svg
              width="100%"
              height="200"
              viewBox={trackLayout.viewBox}
              className={`mx-auto transition-all duration-500 ${
                interactive && isHovered ? 'scale-110' : 'scale-100'
              }`}
            >
              <defs>
                <linearGradient id={`trackGradient-${circuitId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E10600" />
                  <stop offset="50%" stopColor="#FF4500" />
                  <stop offset="100%" stopColor="#E10600" />
                </linearGradient>
                <filter id={`glow-${circuitId}`}>
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <path
                d={trackLayout.path}
                stroke={`url(#trackGradient-${circuitId})`}
                strokeWidth="4"
                fill="none"
                className="drop-shadow-lg"
                filter={interactive && isHovered ? `url(#glow-${circuitId})` : undefined}
              />
              <path
                d={trackLayout.path}
                stroke="#00D4FF"
                strokeWidth="2"
                fill="none"
                opacity={interactive && isHovered ? "0.8" : "0.6"}
                className="transition-opacity duration-300"
              />
              
              {/* Interactive hotspots for different track sections */}
              {interactive && (
                <>
                  {/* Start/Finish Line */}
                  <circle
                    cx="50"
                    cy="150"
                    r="6"
                    fill="#00D4FF"
                    className="animate-pulse cursor-pointer"
                    onClick={() => setSelectedSection('start-finish')}
                  />
                  <text
                    x="60"
                    y="155"
                    className="fill-white text-xs font-mono"
                    opacity={selectedSection === 'start-finish' ? 1 : 0.7}
                  >
                    S/F
                  </text>
                </>
              )}
            </svg>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-500">
              Track layout not available
            </div>
          )}
          
          {/* Interactive overlay information */}
          {interactive && selectedSection && (
            <div className="absolute top-2 right-2 bg-black/80 rounded p-2 text-xs text-white">
              {selectedSection === 'start-finish' && (
                <div>
                  <div className="font-bold text-[#00D4FF]">Start/Finish Line</div>
                  <div>Main straight: {characteristics.length}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Circuit Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Length:</span>
              <span className="text-white font-mono">{characteristics.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Corners:</span>
              <span className="text-white font-mono">{characteristics.corners}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">DRS Zones:</span>
              <span className="text-white font-mono">{characteristics.drsZones}</span>
            </div>
          </div>

          {characteristics.lapRecord && (
            <div className="space-y-2">
              <div className="text-gray-400 text-sm">Lap Record:</div>
              <div className="text-[#00D4FF] font-mono text-lg">
                {characteristics.lapRecord.time}
              </div>
              <div className="text-gray-300 text-xs">
                {characteristics.lapRecord.driver} ({characteristics.lapRecord.year})
              </div>
            </div>
          )}
        </div>

        {/* Recent Winner */}
        {circuitData.recentWinners && circuitData.recentWinners.length > 0 && (
          <div className="pt-2 border-t border-gray-700">
            <div className="text-gray-400 text-sm mb-2">Last Year's Winner:</div>
            <div className="flex items-center space-x-2">
              <div className="text-[#E10600] font-bold">
                {circuitData.recentWinners[0].driver.givenName} {circuitData.recentWinners[0].driver.familyName}
              </div>
              <div className="text-gray-300 text-sm">
                ({circuitData.recentWinners[0].constructor.name})
              </div>
            </div>
            {circuitData.recentWinners[0].time && (
              <div className="text-gray-400 text-xs mt-1">
                Race Time: {circuitData.recentWinners[0].time}
              </div>
            )}
          </div>
        )}

        {/* Location */}
        <div className="pt-2 border-t border-gray-700">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Location:</span>
            <span className="text-gray-300">
              {circuitData.location.locality}, {circuitData.location.country}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}