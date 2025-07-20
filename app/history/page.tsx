'use client';

import { Navbar } from '@/components/layout/navbar';
import { WeatherHistory } from '@/components/weather/weather-history';

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Weather History
            </h1>
            <p className="text-lg text-gray-600">
              View and search your previous weather requests
            </p>
          </div>
          
          <WeatherHistory />
        </div>
      </div>
    </div>
  );
}