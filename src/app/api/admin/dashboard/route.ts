
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { getSession } from '@/lib/session';

async function getDashboardData() {
  try {
    const healthSources = [
      { name: 'Contact Inquiries', table: 'contact_inquiries', db: 'main', dateCol: 'timestamp' },
      { name: 'Workshop Requests', table: 'workshop_requests', db: 'main', dateCol: 'timestamp' },
      { name: 'Job Applications', table: 'job_applications', db: 'main', dateCol: 'timestamp' },
      { name: 'Orders', table: 'orders', db: 'main', dateCol: 'created_at' },
      { name: 'SSP Orders', table: 'ssp_orders', db: 'ssp', dateCol: 'created_at' },
    ];
    
    const activityQueries = [
      { db: 'main' as const, sql: `(SELECT 'Contact' as source, fullName as name, email, timestamp as createdAt, 'new' as status FROM contact_inquiries ORDER BY timestamp DESC LIMIT 3)` },
      { db: 'main' as const, sql: `(SELECT 'Workshop' as source, fullName as name, email, timestamp as createdAt, 'new' as status FROM workshop_requests ORDER BY timestamp DESC LIMIT 3)` },
      { db: 'main' as const, sql: `(SELECT 'Job App' as source, CONCAT(firstName, ' ', lastName) as name, email, timestamp as createdAt, jobTitle as status FROM job_applications ORDER BY timestamp DESC LIMIT 3)` },
      { db: 'main' as const, sql: `(SELECT 'Order' as source, customer_name as name, customer_email as email, created_at as createdAt, order_status as status FROM orders ORDER BY created_at DESC LIMIT 3)` },
      { db: 'ssp' as const, sql: `(SELECT 'SSP Order' as source, customer_name as name, customer_email as email, created_at as createdAt, order_status as status FROM ssp_orders ORDER BY created_at DESC LIMIT 3)` }
    ];

    const summaryQueries = [
      query('main', 'SELECT COUNT(*) as count FROM contact_inquiries'),
      query('main', 'SELECT COUNT(*) as count FROM workshop_requests'),
      query('main', 'SELECT COUNT(*) as count FROM orders'),
      query('ssp', 'SELECT COUNT(*) as count FROM ssp_orders'),
      query('main', 'SELECT COUNT(*) as count FROM job_applications'),
      query('main', 'SELECT COUNT(*) as count FROM customers'),
      query('main', 'SELECT COUNT(*) as count FROM newsletter_subscribers'),
      query('main', 'SELECT COUNT(*) as count FROM notification_subscribers'),
    ];

    const healthDataPromise = Promise.all(healthSources.map(async (source) => {
      const countSql = `SELECT COUNT(*) as count FROM \`${source.table}\` WHERE \`${source.dateCol}\` >= NOW() - INTERVAL 24 HOUR`;
      const lastSql = `SELECT MAX(\`${source.dateCol}\`) as last FROM \`${source.table}\``;
      
      const [countResult, lastResult] = await Promise.all([
        query(source.db as 'main' | 'ssp', countSql),
        query(source.db as 'main' | 'ssp', lastSql),
      ]);
      
      return {
        source: source.name,
        count24h: Number((countResult as any)?.[0]?.count ?? 0),
        lastSubmission: (lastResult as any)?.[0]?.last ? new Date((lastResult as any)[0].last).toISOString() : null,
      };
    }));

    const recentActivityPromise = Promise.all(activityQueries.map(q => query(q.db, q.sql))).then(results => {
        let allActivities: any[] = results.flat();
        allActivities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return allActivities.slice(0, 10);
    });

    const summaryStatsPromise = Promise.all(summaryQueries).then(results => ({
      contactInquiries: (results[0] as any)?.[0]?.count ?? 0,
      workshopRequests: (results[1] as any)?.[0]?.count ?? 0,
      orders: (results[2] as any)?.[0]?.count ?? 0,
      sspOrders: (results[3] as any)?.[0]?.count ?? 0,
      jobApplications: (results[4] as any)?.[0]?.count ?? 0,
      customers: (results[5] as any)?.[0]?.count ?? 0,
      newsletter: (results[6] as any)?.[0]?.count ?? 0,
      notifications: (results[7] as any)?.[0]?.count ?? 0,
    }));

    const [healthData, recentActivity, summaryStats] = await Promise.all([healthDataPromise, recentActivityPromise, summaryStatsPromise]);

    return { healthData, recentActivity, summaryStats, error: null };

  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return {
      healthData: [],
      recentActivity: [],
      summaryStats: { contactInquiries: 0, workshopRequests: 0, orders: 0, sspOrders: 0, jobApplications: 0, customers: 0, newsletter: 0, notifications: 0 },
      error: (error as Error).message
    };
  }
}

export async function GET(request: Request) {
    const session = await getSession();
    if (!session && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await getDashboardData();
    if (data.error) {
        return NextResponse.json({ error: data.error }, { status: 500 });
    }
    return NextResponse.json(data);
}
