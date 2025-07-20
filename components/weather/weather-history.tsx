'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Calendar, MapPin, RefreshCw } from 'lucide-react';
import { WeatherData } from '@/lib/db/schema';
import { format } from 'date-fns';

export function WeatherHistory() {
  const [weatherHistory, setWeatherHistory] = useState<WeatherData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    startDate: '',
    endDate: '',
  });

  const fetchHistory = async () => {
    setIsLoading(true);
    setError('');

    try {
      const searchParams = new URLSearchParams();
      if (filters.city) searchParams.append('city', filters.city);
      if (filters.startDate) searchParams.append('startDate', filters.startDate);
      if (filters.endDate) searchParams.append('endDate', filters.endDate);

      const response = await fetch(`/api/weather/history?${searchParams}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to fetch weather history');
        return;
      }

      setWeatherHistory(data.data);
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSearch = () => {
    fetchHistory();
  };

  const clearFilters = () => {
    setFilters({ city: '', startDate: '', endDate: '' });
    setTimeout(fetchHistory, 100);
  };

  const getHeaderFromResponse = (responseJson: any): string => {
    if (typeof responseJson === 'object' && responseJson.header) {
      return responseJson.header;
    }
    return 'Weather data';
  };

  const getTemperatureFromResponse = (responseJson: any): string => {
    if (typeof responseJson === 'object' && responseJson.temperature_overview) {
      return responseJson.temperature_overview;
    }
    return 'Temperature data not available';
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filter History
          </CardTitle>
          <CardDescription>
            Search and filter your weather request history
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filter-city">City</Label>
              <Input
                id="filter-city"
                placeholder="Filter by city..."
                value={filters.city}
                onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-start">Start Date</Label>
              <Input
                id="filter-start"
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-end">End Date</Label>
              <Input
                id="filter-end"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Search
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* History Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weather History
          </CardTitle>
          <CardDescription>
            {weatherHistory.length > 0 
              ? `Showing ${weatherHistory.length} weather requests`
              : 'No weather requests found'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading history...</span>
            </div>
          ) : weatherHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No weather history found</p>
              <p className="text-sm">Try adjusting your filters or make some weather requests first</p>
            </div>
          ) : (
            <div className="space-y-4">
              {weatherHistory.map((record) => (
                <Card key={record.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-blue-500" />
                          <Badge variant="secondary" className="font-medium">
                            {record.city}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(record.requestTimestamp!), 'MMM d, yyyy at h:mm a')}
                          </span>
                        </div>
                        <h4 className="font-medium text-sm">
                          {getHeaderFromResponse(record.responseJson)}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {getTemperatureFromResponse(record.responseJson)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // You could implement a detailed view modal here
                            console.log('Weather data:', record.responseJson);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}