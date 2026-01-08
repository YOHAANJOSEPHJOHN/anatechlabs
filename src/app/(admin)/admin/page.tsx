import { query } from '@/lib/mysql';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import { AlertCircle, CheckCircle, Clock, Contact, ShoppingCart, FlaskConical, Package, Users, Briefcase, FileText, Newspaper, Bell, Tags, Wrench, Truck, PackageOpen, PackageSearch } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type SystemHealth = {
  source: string;
  count24h: number;
  lastSubmission: Date | null;
};

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

    return { healthData, recentActivity, summaryStats };

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

  if (error) {
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
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-xs">{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</TableCell>
                    <TableCell><Badge variant="secondary">{item.source}</Badge></TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{item.email}</TableCell>
                    <TableCell><Badge variant={item.status === 'new' || !item.status ? 'default' : 'outline'}>{item.status || 'New'}</Badge></TableCell>
                  </TableRow>
                ))}
                {recentActivity.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">No recent activity found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* System Health */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {healthData.map(item => (
                  <div key={item.source} className={cn('p-3 rounded-lg border', item.lastSubmission && (new Date().getTime() - new Date(item.lastSubmission).getTime()) > 24 * 60 * 60 * 1000 && 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800')}>
                      <div className="flex items-center justify-between text-sm font-medium">
                          <span>{item.source}</span>
                          <span className="font-bold">{item.count24h} <span className="font-normal text-muted-foreground">in 24h</span></span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
                          {item.lastSubmission ? (
                             <div className="flex items-center gap-1">
                               <Clock className="h-3 w-3"/>
                               <span>Last: {formatDistanceToNow(item.lastSubmission, { addSuffix: true })}</span>
                             </div>
                          ) : (
                             <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                               <AlertCircle className="h-3 w-3"/>
                               <span>No submissions found</span>
                             </div>
                          )}
                           {item.lastSubmission && (new Date().getTime() - new Date(item.lastSubmission).getTime()) < 24 * 60 * 60 * 1000 ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                          )}
                      </div>
                  </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
