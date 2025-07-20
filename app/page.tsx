'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, MapPin, History, Users } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/weather');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <Cloud className="h-16 w-16 text-blue-600" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900">
              WeatherApp
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get comprehensive weather forecasts with detailed insights, 
              clothing recommendations, activity suggestions, and local dining options.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <MapPin className="h-8 w-8 text-blue-600 mx-auto" />
                <CardTitle>Detailed Forecasts</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Get comprehensive weather information including temperature trends,
                  clothing recommendations, and activity suggestions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <History className="h-8 w-8 text-green-600 mx-auto" />
                <CardTitle>Weather History</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Track your weather requests and view historical data
                  with powerful filtering and search capabilities.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-8 w-8 text-purple-600 mx-auto" />
                <CardTitle>Personal Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Secure authentication with personalized weather tracking
                  and data persistence across all your devices.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="space-y-4 mt-16">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              Free to use • Secure authentication • Detailed forecasts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}