
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Mail, FlaskConical, Briefcase, ShoppingBag, Package, Users, Newspaper, Bell, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { SystemHealth } from '@/components/admin/system-health';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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
type HealthData = { source: string; count24h: number; lastSubmission: string | null };
type Activity = { source: string; name: string; email: string; createdAt: string; status: string };

type DashboardData = {
  summaryStats: SummaryStats;
  recentActivity: Activity[];
  healthData: HealthData[];
  error: string | null;
};

const summaryCardsConfig = [
    { key: 'contactInquiries' as keyof SummaryStats, title: 'Contact Inquiries', href: '/admin/contacts', icon: <Mail/> },
    { key: 'workshopRequests' as keyof SummaryStats, title: 'Workshop Requests', href: '/admin/workshops', icon: <FlaskConical/> },
    { key: 'jobApplications' as keyof SummaryStats, title: 'Job Applications', href: '/admin/job-applications', icon: <Briefcase/> },
    { key: 'customers' as keyof SummaryStats, title: 'Customers', href: '/admin/customers', icon: <Users/> },
    { key: 'orders' as keyof SummaryStats, title: 'Total Orders', href: '/admin/orders', icon: <ShoppingBag/> },
    { key: 'sspOrders' as keyof SummaryStats, title: 'SSP Orders', href: '/admin/ssp/orders', icon: <Package/> },
    { key: 'newsletter' as keyof SummaryStats, title: 'Newsletter Subs', href: '/admin/newsletter-subscribers', icon: <Newspaper/> },
    { key: 'notifications' as keyof SummaryStats, title: 'Notification Subs', href: '/admin/notification-subscribers', icon: <Bell/> },
];

const activityIcons: { [key: string]: React.ReactElement } = {
    'Contact': <Mail className="h-4 w-4 text-blue-500" />,
    'Workshop': <FlaskConical className="h-4 w-4 text-purple-500" />,
    'Job App': <Briefcase className="h-4 w-4 text-green-500" />,
    'Order': <ShoppingBag className="h-4 w-4 text-orange-500" />,
    'SSP Order': <Package className="h-4 w-4 text-teal-500" />,
};

const statusColors: { [key: string]: string } = {
    new: 'bg-blue-100 text-blue-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Completed: 'bg-green-100 text-green-800',
    Confirmed: 'bg-cyan-100 text-cyan-800',
    'In Progress': 'bg-indigo-100 text-indigo-800',
};


export default function AdminDashboardClient() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/dashboard');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch dashboard data.');
      }
      const result = await response.json();
      if(result.error) {
        throw new Error(result.error);
      }
      setData(result);
      if (isRefresh) {
        toast({ title: "Dashboard Refreshed", description: "Latest data has been loaded." });
      }
    } catch (err: any) {
      setError(err.message || 'Could not load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData(); 
    const interval = setInterval(() => fetchData(true), 30000); 
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-32"/>)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Skeleton className="h-96 lg:col-span-2" />
              <Skeleton className="h-96" />
          </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <Alert variant="destructive" className="max-w-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Dashboard Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (!data) {
    return null; // Should be covered by loading/error states
  }

  const { summaryStats, recentActivity, healthData } = data;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryCardsConfig.map((card) => (
            <Link href={card.href} key={card.key}>
                <Card className="hover:bg-muted/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                        <div className="text-muted-foreground">{card.icon}</div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{String(summaryStats[card.key as keyof SummaryStats] ?? 0)}</div>
                    </CardContent>
                </Card>
            </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest submissions and events from across the site.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-12">Type</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead className="hidden sm:table-cell">Status</TableHead>
                        <TableHead className="text-right">Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentActivity.map((item: any, index: number) => (
                        <TableRow key={index}>
                            <TableCell>{activityIcons[item.source] || <FileText/>}</TableCell>
                            <TableCell>
                            <div className="font-medium truncate">{item.name}</div>
                            <div className="text-sm text-muted-foreground truncate">{item.email}</div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                                <Badge className={cn('capitalize', statusColors[item.status] || 'bg-gray-100 text-gray-800')}>{item.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center border-2 border-dashed rounded-lg">
                    <p className="text-lg font-medium">No Recent Activity</p>
                    <p className="text-sm text-muted-foreground">New submissions will appear here automatically.</p>
                </div>
            )}
          </CardContent>
        </Card>

        {/* System Health */}
        <SystemHealth healthData={healthData} />
      </div>
    </div>
  );
}
