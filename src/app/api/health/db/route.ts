
import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

// Force this route to be evaluated at runtime and not cached.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  // Prevent execution during the build phase on Vercel.
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    // Return a successful response during build to prevent build failures.
    return NextResponse.json({ status: 'ok', database: 'build-skipped', timestamp: new Date().toISOString() }, { status: 200 });
  }

  try {
    // Perform a lightweight, non-blocking query to the main database.
    await query('main', 'SELECT 1');

    // If the query is successful, return a healthy status.
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Log the actual error on the server for debugging purposes.
    console.error('[DB Health Check Error]:', error);

    // Return a 503 Service Unavailable status to indicate a backend problem
    // without crashing the service or leaking sensitive error details to the client.
    return NextResponse.json({
      status: 'error',
      database: 'failed',
      timestamp: new Date().toISOString(),
    }, { status: 503 });
  }
}
