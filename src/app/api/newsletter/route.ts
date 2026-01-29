
import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function POST(req: Request) {
    const { email } = await req.json();

    if (!email) {
        return NextResponse.json({ ok: false, error: 'Email is required.' }, { status: 400 });
    }

    try {
        // Use INSERT IGNORE to prevent errors if the email already exists.
        // The user doesn't need to know if they were already subscribed.
        await query(
            'main',
            'INSERT IGNORE INTO newsletter_subscribers (email, subscribed_at) VALUES (?, NOW())',
            [email]
        );
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Failed to subscribe to newsletter:", error);
        // Provide a generic error to the user for security.
        return NextResponse.json({ ok: false, error: 'Could not process subscription.' }, { status: 500 });
    }
}
