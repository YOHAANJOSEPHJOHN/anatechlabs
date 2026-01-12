import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function POST(req: Request) {
    const { fullName, email, inquiryType, message } = await req.json();

    if (!fullName || !email || !inquiryType || !message) {
        return NextResponse.json({ ok: false, error: 'Missing required fields.' }, { status: 400 });
    }

    try {
        await query(
            'main',
            'INSERT INTO contact_inquiries (fullName, email, inquiryType, message, timestamp) VALUES (?, ?, ?, ?, NOW())',
            [fullName, email, inquiryType, message]
        );
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Failed to submit contact inquiry:", error);
        return NextResponse.json({ ok: false, error: 'Failed to save inquiry.' }, { status: 500 });
    }
}
