import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { airflowWeatherData } from '@/lib/db/schema';
import { eq, desc, and, gte, lte } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '20');

    let whereConditions = [eq(airflowWeatherData.userId, session.user.id)];

    if (city) {
      whereConditions.push(eq(airflowWeatherData.city, city));
    }

    if (startDate) {
      whereConditions.push(gte(airflowWeatherData.requestTimestamp, new Date(startDate)));
    }

    if (endDate) {
      whereConditions.push(lte(airflowWeatherData.requestTimestamp, new Date(endDate)));
    }

    const weatherHistory = await db
      .select()
      .from(airflowWeatherData)
      .where(and(...whereConditions))
      .orderBy(desc(airflowWeatherData.requestTimestamp))
      .limit(Math.min(limit, 100)); // Cap at 100 records

    return NextResponse.json({
      success: true,
      data: weatherHistory,
      count: weatherHistory.length,
    });
  } catch (error) {
    console.error('Weather history error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather history' },
      { status: 500 }
    );
  }
}