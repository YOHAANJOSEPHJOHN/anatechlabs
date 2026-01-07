
'use server';

import { createSession } from '@/lib/session';
import { query } from '@/lib/mysql';
import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';

export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    const { email, password } = Object.fromEntries(formData.entries());

    if (!email || !password) {
      return 'Please provide both email and password.';
    }

    // In a real scenario, you'd do this:
    const users = await query('main', 'SELECT * FROM admin_users WHERE email = ?', [email]);
    if (!users || (users as any[]).length === 0) {
        return 'Invalid credentials.';
    }
    const user = (users as any)[0];
    
    // For this example, we'll simulate the user record.
    // IMPORTANT: Replace this with your actual database query logic.
    // const user = {
    //     id: '1',
    //     email: 'yohanjosephjohn@gmail.com',
    //     // This is a placeholder hash for "password123". 
    //     // You should generate your own hash for a secure password.
    //     password_hash: '$2b$10$f/CwiA5TOMjIp9Yy3SNN2eT6K4aR2j.sYg/2lR.iB86L2gXg/u/9K' 
    // };

    if (!user || !user.password_hash) {
      return 'Invalid credentials.';
    }

    const passwordsMatch = await bcrypt.compare(password as string, user.password_hash);
    
    if (passwordsMatch) {
      await createSession(user.id, user.email);
      redirect('/admin');
    } else {
      return 'Invalid credentials.';
    }
  } catch (error) {
    console.error(error);
    return 'An error occurred during authentication. Please try again.';
  }
}
