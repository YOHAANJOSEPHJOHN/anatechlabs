
import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const secretKey = process.env.SESSION_SECRET || 'a-very-secret-key-that-is-at-least-32-bytes-long';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d') // 1 day
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    // console.error('Failed to decrypt session:', error);
    return null;
  }
}

// The payload is now the Firebase ID token or a simplified session object.
// The user's details (like email) can be decoded from the token if needed,
// but for session validity, just having it is enough.
export async function createSession(idToken: string) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
  const session = await encrypt({ idToken, expires });

  cookies().set('session', session, { expires, httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' });
}

export async function getSession() {
  const cookie = cookies().get('session')?.value;
  if (!cookie) return null;
  return await decrypt(cookie);
}

export async function deleteSession() {
  cookies().set('session', '', { expires: new Date(0), path: '/' });
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  if (!parsed) return;

  parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: 'session',
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
