export interface WeatherResponse {
  header: string;
  temperature_overview: string;
  general_trend: string;
  key_patterns: string;
  notable_changes: string;
  clothing_recommendations: string;
  activity_suggestions: string;
  weather_context: string;
  additional_tips: string | null;
  local_events: string;
  restaurant_recommendations: RestaurantRecommendation[];
}

export interface RestaurantRecommendation {
  name: string;
  location: string;
  weather_suitability: string;
}

export interface WeatherApiError {
  error: string;
  message: string;
}