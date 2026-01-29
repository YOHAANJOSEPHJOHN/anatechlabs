
import { type NextRequest, NextResponse } from 'next/server';
import { createSession, deleteSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json({ message: 'Missing ID token.' }, { status: 400 });
    }
    
    // The idToken is not being verified here for simplicity,
    // but in a production app, you should verify it using Firebase Admin SDK.
    // For this context, we trust the client and create the session.
    await createSession(idToken);
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await deleteSession();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Session deletion error:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}
