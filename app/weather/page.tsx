'use client';

import { useState } from 'react';
import { WeatherForm } from '@/components/weather/weather-form';
import { WeatherDisplay } from '@/components/weather/weather-display';
import { Navbar } from '@/components/layout/navbar';
import { WeatherResponse } from '@/types/weather';

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Weather Forecast Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Get detailed weather information for any city worldwide
            </p>
          </div>
          
          <WeatherForm onWeatherData={setWeatherData} />
          
          {weatherData && (
            <div className="mt-8">
              <WeatherDisplay data={weatherData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}