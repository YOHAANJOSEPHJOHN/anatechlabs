
/**
 * @file This file contains the email sending utility for the application.
 * @summary It sets up a Nodemailer transporter using Hostinger SMTP credentials and provides functions to send different types of transactional emails. Gracefully degrades if environment variables are missing.
 * @description The module handles graceful degradation by disabling the email service if required environment variables are missing.
 */
import nodemailer from 'nodemailer';

// Define the shape of the order data needed for emails.
interface OrderData {
    id: string;
    fullName: string;
    email: string;
    companyName?: string;
    country: string;
    finalTotal: number;
    services: { service: string; quantity: number }[];
}

interface CompletionData {
    id: string;
    fullName: string;
    email: string;
}

// Validate that all required environment variables are set.
const requiredEnvVars = [
    'HOSTINGER_EMAIL',
    'HOSTINGER_PASSWORD',
    'HOSTINGER_SMTP_HOST',
    'HOSTINGER_SMTP_PORT',
];
const missingEnvVars = requiredEnvVars.filter(v => !process.env[v]);

if (missingEnvVars.length > 0) {
    console.warn(`Email service is disabled. Missing environment variables: ${missingEnvVars.join(', ')}`);
}

const transporter = missingEnvVars.length === 0 ? nodemailer.createTransport({
    host: process.env.HOSTINGER_SMTP_HOST,
    port: Number(process.env.HOSTINGER_SMTP_PORT),
    secure: Number(process.env.HOSTINGER_SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
        user: process.env.HOSTINGER_EMAIL,
        pass: process.env.HOSTINGER_PASSWORD,
    },
}) : null;

// Generic email sending function
async function sendEmail(to: string, subject: string, html: string) {
    if (!transporter) {
        const errorMsg = "Email service is not configured. Cannot send email.";
        console.error(errorMsg);
        throw new Error(errorMsg);
    }
    
    const mailOptions = {
        from: `AnaTech Labs <${process.env.HOSTINGER_EMAIL}>`,
        to,
        subject,
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Failed to send email:", error);
        throw new Error(`Failed to send email: ${(error as Error).message}`);
    }
}

// --- Email Templates ---

function customerEmailTemplate(order: OrderData): string {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Thank You for Your Order!</h2>
      <p>Dear ${order.fullName},</p>
      <p>We've successfully received your sample submission order. Please find the details below:</p>
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Total Amount:</strong> ₹${order.finalTotal.toLocaleString()}</p>
      <h3>Next Steps: Shipping Your Samples</h3>
      <p>Please securely package your samples and ship them to the address below. It is crucial that you <strong>clearly write your Order ID on the outside of the package</strong> for prompt identification.</p>
      <address style="font-style: normal; border-left: 2px solid #06203A; padding-left: 1rem; margin: 1rem 0;">
          AnaTech Labs<br>
          Attn: Sample Receiving (Order: ${order.id})<br>
          16, 18th A Cross Rd, 1st main, Bhuvaneswari Nagar,<br>
          Hebbal Kempapura, Bengaluru, Karnataka 560024
      </address>
      <p>You can track the status of your order here: <a href="https://anatechlabs.com/order-status?orderId=${order.id}&email=${encodeURIComponent(order.email)}">Track Order</a></p>
      <p>Thank you for choosing AnaTech Labs.</p>
    </div>
  `;
}

function internalEmailTemplate(order: OrderData): string {
  const adminUrl = process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/admin/ssp/orders` : 'Go to Admin Dashboard';
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>New SSP Order Received</h2>
      <p>A new order has been submitted via the Sample Submission Portal.</p>
      <ul>
        <li><strong>Order ID:</strong> ${order.id}</li>
        <li><strong>Customer Name:</strong> ${order.fullName}</li>
        <li><strong>Company:</strong> ${order.companyName || 'N/A'}</li>
        <li><strong>Email:</strong> ${order.email}</li>
        <li><strong>Country:</strong> ${order.country}</li>
        <li><strong>Total Amount:</strong> ₹${order.finalTotal.toLocaleString()}</li>
      </ul>
      <h3>Services Requested:</h3>
      <ul>
        ${order.services.map((item: any) => `<li>${item.service} (Qty: ${item.quantity})</li>`).join('')}
      </ul>
      <p>
        <a href="${adminUrl}">View this order in the Admin Dashboard</a>
      </p>
    </div>
  `;
}

function completionEmailTemplate(order: CompletionData): string {
    return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Your Order is Complete!</h2>
      <p>Dear ${order.fullName},</p>
      <p>This is to notify you that the analysis for your order <strong>#${order.id}</strong> has been completed.</p>
      <p>Our team will be in touch shortly with your results and report. You can also check the final status of your order online:</p>
      <p><a href="https://anatechlabs.com/order-status?orderId=${order.id}&email=${encodeURIComponent(order.email)}">View Order Status</a></p>
      <p>Thank you for choosing AnaTech Labs.</p>
    </div>
  `;
}


// --- Exported Functions ---

export const sendCustomerOrderEmail = async (order: OrderData) => {
    const subject = `AnaTech Order Confirmation: ${order.id}`;
    const html = customerEmailTemplate(order);
    return sendEmail(order.email, subject, html);
};

export const sendInternalOrderEmail = async (order: OrderData) => {
    const internalRecipient = process.env.INTERNAL_EMAIL_RECIPIENT || 'ops@anatechlabs.com';
    const subject = `New SSP Submission: ${order.id}`;
    const html = internalEmailTemplate(order);
    return sendEmail(internalRecipient, subject, html);
};

export const sendCompletionEmail = async (order: CompletionData) => {
    const subject = `Your AnaTech Order #${order.id} is Complete`;
    const html = completionEmailTemplate(order);
    return sendEmail(order.email, subject, html);
}
