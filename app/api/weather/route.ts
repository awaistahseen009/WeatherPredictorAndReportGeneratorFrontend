import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { airflowWeatherData } from '@/lib/db/schema';
import { fetchWeatherData } from '@/lib/weather-api';
import { z } from 'zod';

const weatherSchema = z.object({
  city: z.string().min(2, 'City name must be at least 2 characters').max(50, 'City name too long'),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { city } = weatherSchema.parse(body);

    // Fetch weather data from external API
    const weatherResponse = await fetchWeatherData(city);

    // Store the request and response in database
    const weatherRecord = await db
      .insert(airflowWeatherData)
      .values({
        city: city.trim(),
        responseJson: weatherResponse,
        userId: session.user.id,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: weatherResponse,
      recordId: weatherRecord[0].id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid city name', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}