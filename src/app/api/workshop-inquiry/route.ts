import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function POST(req: Request) {
    const { fullName, company, email, phone, workshop, message } = await req.json();

    if (!fullName || !email || !phone || !workshop) {
        return NextResponse.json({ ok: false, error: 'Missing required fields.' }, { status: 400 });
    }

    try {
        await query(
            'main',
            'INSERT INTO workshop_requests (fullName, company, email, phone, workshop, message, timestamp) VALUES (?, ?, ?, ?, ?, ?, NOW())',
            [fullName, company, email, phone, workshop, message]
        );
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Failed to submit workshop inquiry:", error);
        return NextResponse.json({ ok: false, error: 'Failed to save inquiry.' }, { status: 500 });
    }
}
