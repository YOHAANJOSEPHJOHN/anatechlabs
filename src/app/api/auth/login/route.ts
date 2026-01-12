
import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/session';
import { query } from '@/lib/mysql';
// You might need a hashing library if passwords are not stored in plain text
// For example, using bcrypt: import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
        }

        // IMPORTANT: Query your Hostinger MySQL database to find the user
        // This is a simplified example. You must implement your actual user lookup logic.
        const users = await query('main', 'SELECT * FROM admin_users WHERE email = ?', [email]);
        
        if (!users || (users as any[]).length === 0) {
            return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
        }

        const user = (users as any)[0];

        // IMPORTANT: Compare the provided password with the stored hash.
        // The following is a placeholder for plain text comparison.
        // You MUST replace it with a secure hash comparison, e.g., using bcrypt.
        // const passwordsMatch = await bcrypt.compare(password, user.password_hash);
        
        const passwordsMatch = (password === user.password_hash); // Replace with secure comparison

        if (!passwordsMatch) {
            return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
        }

        // Create a session cookie
        await createSession(user.id, user.email);
        
        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error: any) {
         console.error("Session login error:", error);
         return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
    }
}
