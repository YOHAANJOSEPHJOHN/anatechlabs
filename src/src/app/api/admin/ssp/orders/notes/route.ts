/**
 * @file This file defines the API routes for managing internal notes on SSP orders.
 * @summary It provides GET to fetch notes and POST to add a new note for a specific order. All routes are protected and require an active admin session.
 * @description All routes are protected and require an active admin session.
 */

import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { getSession } from '@/lib/session';

// GET handler to fetch notes for a specific order
export async function GET(request: Request) {
    const session = await getSession();
    if (!session?.email) {
        return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
        return NextResponse.json({ ok: false, error: 'Order ID is required' }, { status: 400 });
    }

    try {
        const notes = await query('ssp', 'SELECT * FROM ssp_notes WHERE order_id = ? ORDER BY created_at DESC', [orderId]);
        return NextResponse.json({ ok: true, notes });
    } catch (error) {
        console.error("Failed to fetch SSP notes:", error);
        return NextResponse.json({ ok: false, error: 'Failed to fetch notes' }, { status: 500 });
    }
}

// POST handler to add a new note
export async function POST(request: Request) {
    const session = await getSession();
    if (!session?.email) {
        return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, note } = await request.json();

    if (!orderId || !note) {
        return NextResponse.json({ ok: false, error: 'Missing parameters' }, { status: 400 });
    }

    try {
        await query(
            'ssp',
            'INSERT INTO ssp_notes (order_id, note, created_by) VALUES (?, ?, ?)',
            [orderId, note, session.email]
        );
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Failed to add SSP note:", error);
        return NextResponse.json({ ok: false, error: 'Failed to add note' }, { status: 500 });
    }
}
