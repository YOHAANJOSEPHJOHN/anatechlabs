import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function POST(req: Request) {
    const { firstName, lastName, email, phone, coverLetter, selectedJob } = await req.json();

    if (!firstName || !lastName || !email || !phone || !coverLetter || !selectedJob) {
        return NextResponse.json({ ok: false, error: 'Missing required fields.' }, { status: 400 });
    }

    try {
        await query(
            'main',
            'INSERT INTO job_applications (firstName, lastName, email, phone, coverLetter, jobTitle, timestamp) VALUES (?, ?, ?, ?, ?, ?, NOW())',
            [firstName, lastName, email, phone, coverLetter, selectedJob]
        );
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Failed to submit job application:", error);
        return NextResponse.json({ ok: false, error: 'Failed to submit application.' }, { status: 500 });
    }
}
