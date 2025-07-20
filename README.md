# WeatherApp - Full-Stack Weather Forecast Application

A comprehensive weather application built with Next.js, featuring secure authentication, detailed weather forecasts, and historical data management.

## Features

- **Secure Authentication**: Email/password and Google OAuth authentication using NextAuth.js
- **Weather Forecasts**: Detailed weather information including temperature trends, clothing recommendations, and activity suggestions
- **Historical Data**: Track and filter your weather request history
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Database Integration**: Neon Postgres with Drizzle ORM for data persistence
- **Type Safety**: Built with TypeScript for better development experience

## Tech Stack

- **Frontend**: Next.js 13, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: NextAuth.js v5 with Drizzle adapter
- **Database**: Neon Postgres with Drizzle ORM
- **API**: Custom weather API integration
- **Deployment**: Ready for Vercel deployment

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@ep-example.us-east-1.aws.neon.tech/dbname?sslmode=require"

# NextAuth.js
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Weather API
WEATHER_API_URL="http://174.138.70.2:8002/"
```

### 2. Database Setup

1. Create a Neon Postgres database
2. Run database migrations:
   ```bash
   npm run db:migrate
   ```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Database Schema

### Users Table
- Authentication data compatible with NextAuth.js
- Supports both credential and OAuth authentication

### Weather Data Table (`airflow_weather_data`)
- Stores weather API requests and responses
- JSONB storage for flexible weather data
- User association for personalized history

## API Endpoints

- **POST /api/weather**: Fetch weather data for a city
- **GET /api/weather/history**: Retrieve user's weather history with filtering
- **POST /api/auth/signup**: User registration
- **GET/POST /api/auth/[...nextauth]**: NextAuth.js authentication routes

## Weather Data Structure

The application processes weather responses with the following structure:

```json
{
  "header": "Weather Forecast for City, Country, Date",
  "temperature_overview": "Temperature range and timing",
  "general_trend": "Overall weather pattern",
  "key_patterns": "Important weather patterns to note",
  "notable_changes": "Significant temperature changes",
  "clothing_recommendations": "Suggested attire",
  "activity_suggestions": "Recommended activities",
  "weather_context": "Historical context",
  "additional_tips": "Extra weather tips (optional)",
  "local_events": "Local events and activities",
  "restaurant_recommendations": [
    {
      "name": "Restaurant Name",
      "location": "Location",
      "weather_suitability": "Why it's suitable for the weather"
    }
  ]
}
```

## Components

### Authentication Components
- `SignInForm`: Email/password and Google OAuth sign-in
- `SignUpForm`: User registration with validation

### Weather Components
- `WeatherForm`: City input and weather request form
- `WeatherDisplay`: Modular display of all weather data fields
- `WeatherHistory`: Historical data viewing with filtering

### Layout Components
- `Navbar`: Navigation with user authentication status
- `SessionProvider`: NextAuth.js session management

## Development Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run db:generate`: Generate database migrations
- `npm run db:migrate`: Apply database migrations
- `npm run db:studio`: Open Drizzle Studio for database management

## Security Features

- Input validation and sanitization
- Protected API routes with authentication middleware
- Secure session management
- SQL injection prevention through Drizzle ORM
- Password hashing with bcrypt

## Deployment

The application is configured for deployment on Vercel:

1. Connect your repository to Vercel
2. Add environment variables in the Vercel dashboard
3. Deploy automatically on git push

## Error Handling

- Graceful API error handling with user-friendly messages
- Network error handling with retry suggestions
- Form validation with clear error indicators
- Loading states for better user experience

## Performance Optimizations

- Database query optimization with proper indexing
- Efficient API response caching
- Lazy loading and code splitting
- Optimized bundle size with Next.js

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if necessary
5. Submit a pull request

## License

This project is licensed under the MIT License.