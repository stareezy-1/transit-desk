import { NextRequest, NextResponse } from 'next/server';
import { apiRequest, ApiError } from '@/shared/api-client';
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const [resource, id] = path;
  if (
    !['vehicles', 'routes', 'trips'].includes(resource) ||
    path.length > 2 ||
    (id && !/^[\w.-]+$/.test(id))
  ) {
    return NextResponse.json({ error: 'Resource not found.' }, { status: 404 });
  }
  try {
    const data = await apiRequest(
      `/${path.map(encodeURIComponent).join('/')}${request.nextUrl.search}`,
      request.signal,
    );
    return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Transit feed unavailable.' },
      { status: error instanceof ApiError ? error.status : 503 },
    );
  }
}
