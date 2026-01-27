
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

// Mapping from database status strings to numerical stage for the frontend timeline
const statusToStage: { [key: string]: number } = {
    'Pending': 1,
    'Confirmed': 2,
    'In Progress': 4,
    'Completed': 6,
    // Add other potential statuses from ssp_tracking_status if needed
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const email = searchParams.get('email');

    if (!orderId || !email) {
        return NextResponse.json({ error: 'Order ID and email are required.' }, { status: 400 });
    }
    
    // The order ID format is 'SSP-YYYY-ID'
    const idParts = orderId.split('-');
    const numericId = idParts.length === 3 ? idParts[2] : orderId;

    try {
        const [orderResult] = await query(
            'ssp', 
            'SELECT * FROM ssp_orders WHERE id = ? AND customer_email = ?', 
            [numericId, email]
        );

        const order = (orderResult as any)?.[0];

        if (!order) {
            return NextResponse.json({ error: 'No order found. Please check your Order ID or Email.' }, { status: 404 });
        }
        
        const [itemsResult] = await query('ssp', 'SELECT * FROM ssp_order_items WHERE order_id = ?', [order.id]);
        const [trackingResult] = await query('ssp', 'SELECT * FROM ssp_tracking_status WHERE order_id = ? ORDER BY updated_at DESC', [order.id]);

        const responseData = {
            ...order,
            current_stage: statusToStage[order.status] || 0,
            order_status: order.status,
            items: itemsResult,
            trackingHistory: trackingResult,
            notes: (trackingResult as any)?.[0]?.notes || '',
            // Mocking some fields from the dummy data structure for UI compatibility
            sample_count: (itemsResult as any[]).reduce((acc, item) => acc + item.quantity, 0),
            payment_status: order.payment_status || 'Paid',
            report_date: 'Pending', // This would need a real source
            assigned_technician: 'Pending', // This would need a real source
        };
        
        return NextResponse.json(responseData);

    } catch (error) {
        console.error("Failed to fetch order status:", error);
        return NextResponse.json({ error: 'Failed to retrieve order status from the database.' }, { status: 500 });
    }
}
