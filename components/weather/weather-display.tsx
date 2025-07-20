'use client';

import { WeatherResponse } from '@/types/weather';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Thermometer, 
  TrendingUp, 
  Eye, 
  AlertTriangle, 
  Shirt, 
  Activity,
  Info,
  Lightbulb,
  Calendar,
  MapPin
} from 'lucide-react';

interface WeatherDisplayProps {
  data: WeatherResponse;
}

export function WeatherDisplay({ data }: WeatherDisplayProps) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-900 flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            {data.header}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Temperature Overview */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Thermometer className="h-5 w-5 text-red-500" />
            Temperature Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium text-gray-700">{data.temperature_overview}</p>
        </CardContent>
      </Card>

      {/* General Trend */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-green-500" />
            General Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{data.general_trend}</p>
        </CardContent>
      </Card>

      {/* Key Patterns & Notable Changes */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Eye className="h-5 w-5 text-blue-500" />
              Key Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{data.key_patterns}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Notable Changes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{data.notable_changes}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shirt className="h-5 w-5 text-purple-500" />
              Clothing Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{data.clothing_recommendations}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 text-teal-500" />
              Activity Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{data.activity_suggestions}</p>
          </CardContent>
        </Card>
      </div>

      {/* Weather Context */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Info className="h-5 w-5 text-indigo-500" />
            Weather Context
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{data.weather_context}</p>
        </CardContent>
      </Card>

      {/* Additional Tips (conditional) */}
      {data.additional_tips && (
        <Card className="bg-yellow-50 border-yellow-200 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-yellow-800">
              <Lightbulb className="h-5 w-5" />
              Additional Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700">{data.additional_tips}</p>
          </CardContent>
        </Card>
      )}

      {/* Local Events */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-pink-500" />
            Local Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{data.local_events}</p>
        </CardContent>
      </Card>

      {/* Restaurant Recommendations */}
      {data.restaurant_recommendations && data.restaurant_recommendations.length > 0 && (
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-red-500" />
              Restaurant Recommendations
            </CardTitle>
            <CardDescription>
              Weather-suitable dining options in your area
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.restaurant_recommendations.map((restaurant, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-lg text-gray-900">
                    {restaurant.name}
                  </h4>
                  <Badge variant="secondary" className="text-xs">
                    {restaurant.location}
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {restaurant.weather_suitability}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}