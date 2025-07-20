'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Search, MapPin } from 'lucide-react';
import { WeatherResponse } from '@/types/weather';

interface WeatherFormProps {
  onWeatherData: (data: WeatherResponse) => void;
}

export function WeatherForm({ onWeatherData }: WeatherFormProps) {
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/weather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city: city.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to fetch weather data');
        return;
      }

      onWeatherData(data.data);
      setCity('');
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Weather Forecast
        </CardTitle>
        <CardDescription>
          Enter a city name to get detailed weather information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="city">City Name</Label>
            <Input
              id="city"
              type="text"
              placeholder="e.g., London, New York, Tokyo"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              disabled={isLoading}
              className="text-base"
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading || !city.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting forecast...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Get Weather
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}