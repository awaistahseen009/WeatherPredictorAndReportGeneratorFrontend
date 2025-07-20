import { WeatherResponse, WeatherApiError } from '@/types/weather';

const WEATHER_API_URL = process.env.WEATHER_API_URL || 'http://174.138.70.2:8002/';

export async function fetchWeatherData(city: string): Promise<WeatherResponse> {
  try {
    const url = new URL(WEATHER_API_URL);
    url.searchParams.append('city', city);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Weather API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return data as WeatherResponse;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data. Please try again.');
  }
}

// Mock data for development/testing
export const mockWeatherData: WeatherResponse = {
  header: "Weather Forecast for London, UK, January 15, 2025",
  temperature_overview: "Low of 3.2°C at 6 AM, high of 12.5°C at 2 PM",
  general_trend: "The day will start cold and gradually warm up, reaching its peak in the afternoon.",
  key_patterns: "Expect the warmest temperatures in the afternoon and the coolest in early morning.",
  notable_changes: "Watch for a quick 3.1°C change at 8 AM as morning fog clears.",
  clothing_recommendations: "Dress in warm layers with a waterproof jacket for potential light rain.",
  activity_suggestions: "Perfect weather for indoor activities in the morning, outdoor walks in the afternoon.",
  weather_context: "Temperatures are slightly above historical average for this time of year.",
  additional_tips: "Carry an umbrella as there's a 30% chance of light rain in the evening.",
  local_events: "Check out the winter markets and indoor exhibitions happening around London.",
  restaurant_recommendations: [
    {
      name: "The Ivy Restaurant",
      location: "London",
      weather_suitability: "Cozy indoor dining perfect for the chilly weather."
    },
    {
      name: "Borough Market",
      location: "London",
      weather_suitability: "Great covered market for warm food and drinks on a cold day."
    }
  ]
};