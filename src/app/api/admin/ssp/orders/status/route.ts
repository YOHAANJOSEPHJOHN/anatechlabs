
/**
 * @file This file defines the API route for updating an SSP order's status.
 * @summary It handles POST requests to change a status, validates user session, logs the change to an audit trail table, and triggers a customer email on completion.
 * @description This route is protected and requires an active admin session. It also triggers a customer email notification when an order is marked as 'Completed'.
 */
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { db, query } from '@/lib/mysql';
import { getSession } from '@/lib/session';
import { sendCompletionEmail } from '@/lib/email';

export async function POST(request: Request) {
    const session = await getSession();
    if (!session?.email) {
        return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, newStatus } = await request.json();

    if (!orderId || !newStatus) {
        return NextResponse.json({ ok: false, error: 'Missing parameters' }, { status: 400 });
    }

    const validStatuses = ['Pending', 'Confirmed', 'In Progress', 'Completed'];
    if (!validStatuses.includes(newStatus)) {
        return NextResponse.json({ ok: false, error: 'Invalid status value' }, { status: 400 });
    }
    
    const connection = await db.ssp.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Get the current status
        const [currentOrderResult] = await connection.query('SELECT status, customer_email, customer_name FROM ssp_orders WHERE id = ?', [orderId]);
        const currentOrder = (currentOrderResult as any)?.[0];
        
        if (!currentOrder) {
            await connection.rollback();
            return NextResponse.json({ ok: false, error: 'Order not found' }, { status: 404 });
        }

        const oldStatus = currentOrder.status;

        if (oldStatus === newStatus) {
             await connection.rollback(); // No change needed
             return NextResponse.json({ ok: true, message: 'No status change detected.' });
        }
        
        // 2. Update the order status
        await connection.query(
            'UPDATE ssp_orders SET status = ?, order_status = ? WHERE id = ?',
            [newStatus, newStatus, orderId]
        );
        
        // 3. Log the change in the history table
        await connection.query(
            `INSERT INTO ssp_status_history (order_id, old_status, new_status, changed_by) VALUES (?, ?, ?, ?)`,
            [orderId, oldStatus, newStatus, session.email]
        );

        await connection.commit();
        
        // 4. If status is 'Completed', trigger completion email
        if (newStatus === 'Completed') {
            try {
                const fullOrderId = `SSP-${new Date(currentOrder.created_at).getFullYear()}-${orderId}`;
                await sendCompletionEmail({ id: fullOrderId, email: currentOrder.customer_email, fullName: currentOrder.customer_name });
            } catch (emailError) {
                console.error(`SSP Status Update Succeeded (Order ID: ${orderId}), but completion email failed:`, emailError);
            }
        }
        
        return NextResponse.json({ ok: true });

    } catch (error) {
        await connection.rollback();
        console.error("SSP Status Update transaction error", error);
        return NextResponse.json({ ok: false, error: 'Transaction failed' }, { status: 500 });
    } finally {
        connection.release();
    }
}
