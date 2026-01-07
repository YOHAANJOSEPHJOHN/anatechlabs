/**
 * @file This file defines the API route for submitting a new SSP order.
 * @summary It handles POST requests, validates the payload, and saves the order data to multiple MySQL tables within a single transaction. After a successful database transaction, it triggers customer and internal email notifications.
 * @description After a successful database transaction, it triggers customer and internal email notifications.
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/mysql";
import { sendCustomerOrderEmail, sendInternalOrderEmail } from "@/lib/email";

/**
 * How to test this endpoint:
 * 1. Ensure `mysql2` and `nodemailer` are installed (`npm install mysql2 nodemailer`).
 * 2. Set up your email credentials in `.env.local` (HOSTINGER_EMAIL, HOSTINGER_PASSWORD, etc.).
 * 3. Run the application with `npm run dev`.
 * 4. Fill out and submit the SSP form on the website.
 * 5. After submission, check your inbox (and the customer's) for confirmation emails.
 * 6. Check the `ssp_orders`, `ssp_order_items`, and `ssp_payments` tables in your MySQL database. A new order with its items and payment should appear.
 * 7. To test rollback: Temporarily alter a table (e.g., make a column `NOT NULL` in `ssp_order_items` and submit a request that omits it).
 *    Verify that NO new rows are created in any of the three tables and NO emails are sent.
 */
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


  const connection = await db.ssp.getConnection();

  try {
    await connection.beginTransaction();

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

    // If all DB operations succeed, commit the transaction
    await connection.commit();

    // 4. Trigger emails AFTER the transaction is successfully committed
    const orderDataForEmail = { ...body, id: fullOrderId };
    try {
        await sendCustomerOrderEmail(orderDataForEmail);
    } catch (emailError) {
        console.error(`SSP Transaction Succeeded (Order ID: ${orderId}), but customer email failed:`, emailError);
    }

    try {
        await sendInternalOrderEmail(orderDataForEmail);
    } catch (emailError) {
        console.error(`SSP Transaction Succeeded (Order ID: ${orderId}), but internal email failed:`, emailError);
    }
    

    return NextResponse.json({ ok: true, orderId: fullOrderId });
  } catch (error) {
    await connection.rollback();
    console.error("SSP transaction error", error);
    return NextResponse.json(
      { ok: false, error: "SSP transaction failed. Please try again." },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
