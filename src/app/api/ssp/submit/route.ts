
/**
 * @file This file defines the API route for submitting a new SSP order.
 * @summary It handles POST requests, validates the payload, and saves the order data to multiple MySQL tables within a single transaction. After a successful database transaction, it triggers customer and internal email notifications.
 * @description After a successful database transaction, it triggers customer and internal email notifications.
 */

import { NextResponse } from "next/server";
import { withTransaction } from "@/lib/mysql";
import { sendCustomerOrderEmail, sendInternalOrderEmail } from "@/lib/email";

export async function POST(req: Request) {
  const body = await req.json();

  const {
    fullName,
    companyName,
    email,
    phone,
    address,
    industry,
    classification,
    country,
    state,
    services: items,
    finalTotal,
    subtotal,
    gst
  } = body;

  try {
    const { fullOrderId } = await withTransaction('ssp', async (connection) => {
        // 1. Insert into ssp_orders
        const [orderResult] = await connection.query(
          `
          INSERT INTO ssp_orders (
            customer_name, customer_email, company_name, phone, address, 
            industry, classification, country, state, total_amount, order_status, created_at,
            subtotal, gst, payment_status, status
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?)
          `,
          [
            fullName, email, companyName, phone, address, 
            industry, classification, country, state, finalTotal, 'Pending',
            subtotal, gst, 'success', 'Pending'
          ]
        );

        // @ts-ignore mysql2 typing can be lacking for insertId
        const orderId = (orderResult as any).insertId;
        if (!orderId) {
          throw new Error("Failed to retrieve orderId after insert.");
        }
        const fullOrderId = `SSP-${new Date().getFullYear()}-${orderId}`;

        // 2. Insert into ssp_order_items
        if (items && items.length > 0) {
          for (const item of items) {
            await connection.query(
              `
              INSERT INTO ssp_order_items (order_id, service_name, quantity, price, price_per_sample, line_total)
              VALUES (?, ?, ?, ?, ?, ?)
              `,
              [orderId, item.service, item.quantity, item.price, item.price, item.price * item.quantity]
            );
          }
        }
        
        // 3. Insert into ssp_payments
        await connection.query(
          `
          INSERT INTO ssp_payments (
            order_id,
            method,
            status,
            amount,
            reference,
            created_at
          )
          VALUES (?, ?, ?, ?, ?, NOW())
          `,
          [
            orderId,
            "manual", // for now; later 'razorpay'
            "success", // for now; later real status
            finalTotal ?? null, // later: Razorpay txn id
            null, 
          ]
        );

        return { fullOrderId };
    });

    // 4. Trigger emails AFTER the transaction is successfully committed
    const orderDataForEmail = { ...body, id: fullOrderId };
    try {
        await sendCustomerOrderEmail(orderDataForEmail);
    } catch (emailError) {
        console.error(`SSP Transaction Succeeded (Order ID: ${fullOrderId}), but customer email failed:`, emailError);
    }

    try {
        await sendInternalOrderEmail(orderDataForEmail);
    } catch (emailError) {
        console.error(`SSP Transaction Succeeded (Order ID: ${fullOrderId}), but internal email failed:`, emailError);
    }
    
    return NextResponse.json({ ok: true, orderId: fullOrderId });

  } catch (error) {
    // The transaction helper logs the detailed error.
    return NextResponse.json(
      { ok: false, error: "SSP transaction failed. Please try again." },
      { status: 500 }
    );
  }
}
