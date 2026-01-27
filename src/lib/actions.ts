
'use server';

import { createSession } from '@/lib/session';
import { query } from '@/lib/mysql';
import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';


export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    const { email, password } = Object.fromEntries(formData.entries());

    if (!email || !password) {
      return 'Please provide both email and password.';
    }
    
    // We no longer authenticate against the DB directly. 
    // Firebase handles authentication. The login page will use signInWithEmailAndPassword.
    // This server action is now deprecated in favor of client-side Firebase login
    // followed by a server-side session creation via an API route.
    
    return 'This authentication method is deprecated.';

  } catch (error) {
    console.error(error);
    if ( (error as any).code === 'auth/invalid-credential') {
        return 'Invalid credentials.';
    }
    return 'An error occurred during authentication. Please try again.';
  }
}
