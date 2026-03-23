import { NextRequest, NextResponse } from 'next/server';
import { getSeasonDetails } from '@/lib/tmdb';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tvId = searchParams.get('tvId');
  const season = searchParams.get('season');

  if (!tvId || !season) {
    return NextResponse.json({ error: 'Missing tvId or season' }, { status: 400 });
  }

  try {
    const data = await getSeasonDetails(parseInt(tvId), parseInt(season));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch season data' }, { status: 500 });
  }
}
