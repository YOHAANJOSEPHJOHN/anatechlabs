
/**
 * @file This file defines the API route for updating an SSP order's status.
 * @summary It handles POST requests to change a status, validates user session, logs the change to an audit trail table, and triggers a customer email on completion.
 * @description This route is protected and requires an active admin session. It also triggers a customer email notification when an order is marked as 'Completed'.
 */
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { withTransaction } from '@/lib/mysql';
import { getSession } from '@/lib/session';
import { sendCompletionEmail } from '@/lib/email';

export async function POST(request: Request) {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
        return NextResponse.json({ ok: false, error: 'Build-time access is disabled.' }, { status: 403 });
    }
    
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
    
    try {
        const { customerEmail, customerName, createdAt, noChange } = await withTransaction('ssp', async (connection) => {
            // 1. Get the current status and other details needed for email
            const [currentOrderResult] = await connection.query('SELECT status, customer_email, customer_name, created_at FROM ssp_orders WHERE id = ?', [orderId]);
            const currentOrder = (currentOrderResult as any)?.[0];
            
            if (!currentOrder) {
                throw new Error('Order not found');
            }

            const oldStatus = currentOrder.status;

            if (oldStatus === newStatus) {
                 return { noChange: true, customerEmail: null, customerName: null, createdAt: null };
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

            return { noChange: false, customerEmail: currentOrder.customer_email, customerName: currentOrder.customer_name, createdAt: currentOrder.created_at };
        });

        if (noChange) {
            return NextResponse.json({ ok: true, message: 'No status change detected.' });
        }
        
        // 4. If status is 'Completed', trigger completion email
        if (newStatus === 'Completed' && customerEmail) {
            try {
                const fullOrderId = `SSP-${new Date(createdAt).getFullYear()}-${orderId}`;
                await sendCompletionEmail({ id: fullOrderId, email: customerEmail, fullName: customerName });
            } catch (emailError) {
                console.error(`SSP Status Update Succeeded (Order ID: ${orderId}), but completion email failed:`, emailError);
            }
        }
        
        return NextResponse.json({ ok: true });

    } catch (error: any) {
        if (error.message === 'Order not found') {
            return NextResponse.json({ ok: false, error: 'Order not found' }, { status: 404 });
        }
        // The transaction helper logs the detailed error
        return NextResponse.json({ ok: false, error: 'Transaction failed' }, { status: 500 });
    }
}
