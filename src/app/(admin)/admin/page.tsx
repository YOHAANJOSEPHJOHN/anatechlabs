
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

import { query } from '@/lib/mysql';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { 
    AlertCircle, 
    Contact, 
    ShoppingCart, 
    FlaskConical, 
    Package, 
    Users, 
    Briefcase, 
    Newspaper, 
    Bell, 
    Mail,
    FileText
} from 'lucide-react';
import Link from 'next/link';
import { SystemHealth } from '@/components/admin/system-health';

type SummaryStats = {
  contactInquiries: number;
  workshopRequests: number;
  orders: number;
  sspOrders: number;
  jobApplications: number;
  customers: number;
  newsletter: number;
  notifications: number;
};

async function getDashboardData() {
  // DEV/STUDIO ONLY: Return empty data in non-production environments to avoid DB errors.
  if (process.env.NODE_ENV !== 'production') {
    console.log("DEV/STUDIO MODE: Skipping MySQL connection for Admin Dashboard. Returning mock data.");
    return {
      healthData: [],
      recentActivity: [],
      summaryStats: { contactInquiries: 0, workshopRequests: 0, orders: 0, sspOrders: 0, jobApplications: 0, customers: 0, newsletter: 0, notifications: 0 },
      error: null
    };
  }
  
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
        lastSubmission: (lastResult as any)?.[0]?.last ? new Date((lastResult as any)[0].last) : null,
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
    // Return default empty state on error to prevent page crash
    return {
      healthData: [],
      recentActivity: [],
      summaryStats: { contactInquiries: 0, workshopRequests: 0, orders: 0, sspOrders: 0, jobApplications: 0, customers: 0, newsletter: 0, notifications: 0 },
      error: (error as Error).message
    };
  }
}

// Icon mapping
const activityIcons: { [key: string]: React.ReactElement } = {
  'Contact': <Mail className="h-4 w-4" />,
  'Workshop': <FlaskConical className="h-4 w-4" />,
  'Job App': <FileText className="h-4 w-4" />,
  'Order': <ShoppingCart className="h-4 w-4" />,
  'SSP Order': <Package className="h-4 w-4" />,
};

const ActivityRow = ({ item }: { item: any }) => (
    <div className="flex items-center gap-4 py-3 px-4 hover:bg-muted/50 transition-colors rounded-lg">
        <div className="p-2 bg-muted rounded-full text-muted-foreground">
            {activityIcons[item.source] || <AlertCircle className="h-4 w-4" />}
        </div>
        <div className="flex-1">
            <p className="font-medium text-sm">{item.name}</p>
            <p className="text-xs text-muted-foreground">
                <span className="font-semibold">{item.source}</span> from {item.email}
            </p>
        </div>
        <div className="text-right">
             <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</p>
             <Badge variant={item.status === 'new' || !item.status ? 'default' : 'outline'} className="mt-1">{item.status || 'New'}</Badge>
        </div>
    </div>
);

const EmptyState = () => {
    const staticPlaceholderItems = [
        { source: 'Contact', name: 'Jane Doe', email: 'jane.d@example.com', createdAt: '5m ago', status: 'new' },
        { source: 'SSP Order', name: 'John Smith', email: 'j.smith@example.com', createdAt: '30m ago', status: 'Pending' },
        { source: 'Job App', name: 'Emily White', email: 'ewhite@example.com', createdAt: '2h ago', status: 'Senior Analyst' },
    ];

    const PlaceholderActivityRow = ({ item }: { item: any }) => (
        <div className="flex items-center gap-4 py-3 px-4">
            <div className="p-2 bg-muted rounded-full text-muted-foreground">
                {activityIcons[item.source] || <AlertCircle className="h-4 w-4" />}
            </div>
            <div className="flex-1">
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                    <span className="font-semibold">{item.source}</span> from {item.email}
                </p>
            </div>
            <div className="text-right">
                <p className="text-xs text-muted-foreground">{item.createdAt}</p>
                <Badge variant={item.status === 'new' || !item.status ? 'default' : 'outline'} className="mt-1">{item.status || 'New'}</Badge>
            </div>
        </div>
    );
    
    return (
        <div className="text-center py-12 px-6">
            <div className="mx-auto w-fit p-3 bg-muted rounded-full">
                <Bell className="h-8 w-8 text-muted-foreground"/>
            </div>
            <h3 className="mt-4 text-lg font-medium">No recent activity yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
                New user submissions and system events will appear here as they happen.
            </p>
            <div className="mt-8 text-left border-t pt-4 opacity-50">
                <p className="text-xs text-muted-foreground text-center mb-4 font-semibold uppercase tracking-wider">Example Activity</p>
                <div className="divide-y">
                    {staticPlaceholderItems.map((item, index) => (
                        <PlaceholderActivityRow key={index} item={item} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default async function AdminDashboard() {
  const { healthData, recentActivity, summaryStats, error } = await getDashboardData();
  
  const summaryCards = [
    { title: 'Contact Inquiries', count: summaryStats.contactInquiries, icon: <Contact className="h-4 w-4 text-muted-foreground" />, href: '/admin/contacts' },
    { title: 'Workshop Requests', count: summaryStats.workshopRequests, icon: <FlaskConical className="h-4 w-4 text-muted-foreground" />, href: '/admin/workshops' },
    { title: 'Job Applications', count: summaryStats.jobApplications, icon: <Briefcase className="h-4 w-4 text-muted-foreground" />, href: '/admin/job-applications' },
    { title: 'Customers', count: summaryStats.customers, icon: <Users className="h-4 w-4 text-muted-foreground" />, href: '/admin/customers' },
    { title: 'Total Orders', count: summaryStats.orders, icon: <ShoppingCart className="h-4 w-4 text-muted-foreground" />, href: '/admin/orders' },
    { title: 'Total SSP Orders', count: summaryStats.sspOrders, icon: <Package className="h-4 w-4 text-muted-foreground" />, href: '/admin/ssp/orders' },
    { title: 'Newsletter Subs', count: summaryStats.newsletter, icon: <Newspaper className="h-4 w-4 text-muted-foreground" />, href: '/admin/newsletter-subscribers' },
    { title: 'Notification Subs', count: summaryStats.notifications, icon: <Bell className="h-4 w-4 text-muted-foreground" />, href: '/admin/notification-subscribers' },
  ]

  if (error && process.env.NODE_ENV === 'production') {
    return (
        <div className="flex items-center justify-center h-full">
            <Card className="w-full max-w-md border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive flex items-center gap-2">
                        <AlertCircle /> Dashboard Error
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Could not load dashboard data. Please check the database connection.</p>
                    <p className="text-xs text-muted-foreground mt-2">{error}</p>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Summary Cards */}
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card, index) => (
          <Link href={card.href} key={index}>
            <Card className="hover:bg-muted/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.count}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             {recentActivity.length > 0 ? (
                <div className="divide-y">
                  {recentActivity.map((item, index) => (
                    <ActivityRow key={index} item={item} />
                  ))}
                </div>
             ) : (
                <EmptyState />
             )}
          </CardContent>
        </Card>

        {/* System Health */}
        <div className="space-y-6">
          <SystemHealth healthData={healthData} dbError={error} />
        </div>
      </div>
    </div>
  );
}
