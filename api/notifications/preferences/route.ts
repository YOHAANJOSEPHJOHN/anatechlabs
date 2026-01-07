
import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { cookies } from 'next/headers';

// Helper function to safely parse JSON from cookies
function getObjectFromCookie(cookieName: string) {
    const cookieStore = cookies();
    const cookie = cookieStore.get(cookieName);
    if (!cookie?.value) return null;
    try {
        return JSON.parse(cookie.value);
    } catch (e) {
        return null;
    }
}

// GET handler to fetch user's notification preferences
export async function GET(request: Request) {
    const userInfo = getObjectFromCookie('userInfo');

    if (!userInfo?.email) {
        return NextResponse.json({ ok: false, error: 'User information not found. Please submit your details first.' }, { status: 404 });
    }

    try {
        const results = await query('main', 'SELECT * FROM notification_subscribers WHERE email = ?', [userInfo.email]);
        const preferences = (results as any)?.[0] || null;
        
        return NextResponse.json({ ok: true, email: userInfo.email, preferences });
    } catch (error) {
        console.error("Failed to fetch notification preferences:", error);
        return NextResponse.json({ ok: false, error: 'Failed to fetch settings from database.' }, { status: 500 });
    }
}


// POST handler to update or create notification preferences
export async function POST(request: Request) {
    const userInfo = getObjectFromCookie('userInfo');

    if (!userInfo?.email) {
        return NextResponse.json({ ok: false, error: 'User information not found. Cannot save preferences.' }, { status: 404 });
    }

    const { workshopUpdates, csrAnnouncements, newsletter } = await request.json();

    // Ensure boolean values
    const prefs = {
        workshopUpdates: !!workshopUpdates,
        csrAnnouncements: !!csrAnnouncements,
        newsletter: !!newsletter,
    };

    try {
        // Use INSERT ... ON DUPLICATE KEY UPDATE to handle both new and existing users
        const sql = `
            INSERT INTO notification_subscribers (email, workshopUpdates, csrAnnouncements, newsletter, updatedAt)
            VALUES (?, ?, ?, ?, NOW())
            ON DUPLICATE KEY UPDATE
                workshopUpdates = VALUES(workshopUpdates),
                csrAnnouncements = VALUES(csrAnnouncements),
                newsletter = VALUES(newsletter),
                updatedAt = NOW()
        `;
        
        await query('main', sql, [userInfo.email, prefs.workshopUpdates, prefs.csrAnnouncements, prefs.newsletter]);
        
        return NextResponse.json({ ok: true, message: 'Preferences updated successfully.' });

    } catch (error) {
        console.error("Failed to update notification preferences:", error);
        return NextResponse.json({ ok: false, error: 'Failed to save settings to database.' }, { status: 500 });
    }
}
