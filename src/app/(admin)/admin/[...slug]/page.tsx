'use client';
import { useState, useEffect, useCallback } from 'react';
import { notFound, useSearchParams, useRouter, usePathname } from 'next/navigation';
import { tableConfig } from './config';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Search, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

async function getData(slug: string, searchParams: { [key: string]: string | undefined }) {
    'use server';
    const config = tableConfig[slug];
    if (!config) {
        return { data: [], totalPages: 0, currentPage: 1, totalCount: 0, error: 'Invalid configuration for this view.' };
    }

    const ITEMS_PER_PAGE = 20;
    const page = parseInt(searchParams.page || '1', 10);
    const offset = (page - 1) * ITEMS_PER_PAGE;
    
    const search = searchParams.search || '';
    const from = searchParams.from;
    const to = searchParams.to;
    const status = searchParams.status;
    const country = searchParams.country;

    // Use a dynamic import for the query function only when needed
    const { query } = await import('@/lib/mysql');

    let whereClauses: string[] = [];
    let queryParams: any[] = [];

    if (search && config.searchColumns.length > 0) {
        const searchClause = config.searchColumns.map(col => `\`${col}\` LIKE ?`).join(' OR ');
        whereClauses.push(`(${searchClause})`);
        config.searchColumns.forEach(() => queryParams.push(`%${search}%`));
    }

    if (from && to && config.dateColumn) {
        whereClauses.push(`\`${config.dateColumn}\` BETWEEN ? AND ?`);
        queryParams.push(from, `${to} 23:59:59`);
    } else if (from && config.dateColumn) {
        whereClauses.push(`\`${config.dateColumn}\` >= ?`);
        queryParams.push(from);
    } else if (to && config.dateColumn) {
        whereClauses.push(`\`${config.dateColumn}\` <= ?`);
        queryParams.push(`${to} 23:59:59`);
    }
    
    if (status && config.filterColumns?.includes('status')) {
        whereClauses.push('`status` = ?');
        queryParams.push(status);
    }
    
    if (country && config.filterColumns?.includes('country')) {
        whereClauses.push('`country` = ?');
        queryParams.push(country);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const countSql = `SELECT COUNT(*) as total FROM \`${config.table}\` ${whereSql}`;
    const dataSql = `SELECT * FROM \`${config.table}\` ${whereSql} ORDER BY ${config.dateColumn || 'id'} DESC LIMIT ? OFFSET ?`;
    
    try {
        const [countResult, dataResult] = await Promise.all([
            query(config.db, countSql, queryParams),
            query(config.db, dataSql, [...queryParams, ITEMS_PER_PAGE, offset])
        ]);
        
        const totalCount = (countResult as any)?.[0]?.total ?? 0;
        const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

        return {
            data: dataResult as any[],
            totalPages,
            currentPage: page,
            totalCount
        };
    } catch (error) {
        console.error("Failed to fetch admin table data:", error);
        return { data: [], totalPages: 0, currentPage: 1, totalCount: 0, error: (error as Error).message };
    }
}

// Separate component for SSP status dropdown to manage its state
function StatusDropdown({ orderId, currentStatus }: { orderId: number, currentStatus: string }) {
    const { toast } = useToast();
    const [status, setStatus] = useState(currentStatus);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleStatusChange = async (newStatus: string) => {
        const originalStatus = status;
        setStatus(newStatus); // Optimistic update
        setIsUpdating(true);
        
        const response = await fetch('/api/admin/ssp/orders/status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, newStatus })
        });
        
        setIsUpdating(false);

        if (!response.ok) {
            setStatus(originalStatus); // Revert on failure
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: 'Could not update order status.'
            });
        } else {
            toast({
                title: 'Status Updated',
                description: `Order #${orderId} status changed to ${newStatus}.`
            })
        }
    };

    return (
        <Select value={status} onValueChange={handleStatusChange} disabled={isUpdating}>
            <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Change status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
        </Select>
    );
}

export default function AdminTablePage({ params }: { params: { slug: string[] } }) {
    const slug = params.slug.join('/');
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [data, setData] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Filter states
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [dateRange, setDateRange] = useState<{ from?: Date, to?: Date }>({
        from: searchParams.get('from') ? new Date(searchParams.get('from')!) : undefined,
        to: searchParams.get('to') ? new Date(searchParams.get('to')!) : undefined,
    });
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
    const [countryFilter, setCountryFilter] = useState(searchParams.get('country') || '');
    
    const config = tableConfig[slug];

    const fetchTableData = useCallback(async () => {
        if (!config) return;
        
        setIsLoading(true);
        const currentParams = Object.fromEntries(searchParams.entries());
        const result = await getData(slug, currentParams);
        
        if (result.error) {
            setError(result.error);
            setData([]);
        } else {
            setData(result.data);
            setTotalPages(result.totalPages);
            setCurrentPage(result.currentPage);
            setTotalCount(result.totalCount);
            setError(null);
        }
        setIsLoading(false);
    }, [slug, searchParams, config]);

    useEffect(() => {
        fetchTableData();
    }, [fetchTableData]);

    if (!config) {
        notFound();
    }
    
    const handleFilterChange = () => {
        const newParams = new URLSearchParams();
        if (searchTerm) newParams.set('search', searchTerm);
        if (dateRange.from) newParams.set('from', format(dateRange.from, 'yyyy-MM-dd'));
        if (dateRange.to) newParams.set('to', format(dateRange.to, 'yyyy-MM-dd'));
        if (statusFilter) newParams.set('status', statusFilter);
        if (countryFilter) newParams.set('country', countryFilter);
        newParams.set('page', '1'); // Reset to first page on filter change
        router.push(`${pathname}?${newParams.toString()}`);
    }

    const handlePageChange = (newPage: number) => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set('page', newPage.toString());
        router.push(`${pathname}?${newParams.toString()}`);
    }

    const pageStart = (currentPage - 1) * 20 + 1;
    const pageEnd = Math.min(currentPage * 20, totalCount);

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{formatTitle(slug)}</h1>
            <div className="flex gap-2">
                <Button variant="outline" disabled>Export CSV</Button>
                <Button variant="outline" disabled>Export PDF</Button>
            </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder={`Search in ${config.searchColumns.join(', ')}...`}
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFilterChange()}
              />
            </div>
             {config.filterColumns?.includes('status') && (
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All Statuses</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                </Select>
             )}
             {config.filterColumns?.includes('country') && (
                <Input
                    type="text"
                    placeholder="Filter by Country"
                    className="w-full md:w-[180px]"
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleFilterChange()}
                />
             )}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full md:w-auto justify-start text-left font-normal"
                        disabled={!config.dateColumn}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>
                            {dateRange.from && dateRange.to ? `${format(dateRange.from, 'LLL d, y')} - ${format(dateRange.to, 'LLL d, y')}` : "Date range"}
                        </span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={setDateRange}
                        disabled={!config.dateColumn}
                    />
                </PopoverContent>
            </Popover>
            <Button onClick={handleFilterChange}>Filter</Button>
        </div>

        <Card>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    {config.columns.map(col => <TableHead key={col}>{col.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').toUpperCase()}</TableHead>)}
                </TableRow>
                </TableHeader>
                <TableBody>
                {isLoading ? (
                    Array.from({ length: 10 }).map((_, i) => (
                        <TableRow key={i}>
                            {config.columns.map(col => (
                                <TableCell key={col}><Skeleton className="h-4 w-full" /></TableCell>
                            ))}
                        </TableRow>
                    ))
                ) : error ? (
                    <TableRow>
                        <TableCell colSpan={config.columns.length} className="text-center h-24 text-destructive">
                           <div className="flex items-center justify-center gap-2">
                                <AlertCircle className="h-5 w-5"/>
                                Error fetching data: {error}
                           </div>
                        </TableCell>
                    </TableRow>
                ) : data.length > 0 ? (data as any[]).map((row: any, index: number) => (
                    <TableRow key={row.id || index}>
                    {config.columns.map(col => (
                        <TableCell key={col}>
                        {(() => {
                            const cellData = row[col];
                             if ((col === 'order_status' || col === 'status') && slug === 'ssp/orders') {
                                return <StatusDropdown orderId={row.id} currentStatus={cellData} />;
                            }
                             if (cellData === null || cellData === undefined) {
                                return 'N/A';
                            }
                            if (typeof cellData === 'boolean' || (typeof cellData === 'number' && (cellData === 0 || cellData === 1))) {
                                return <Badge variant={cellData ? 'default' : 'secondary'}>{cellData ? 'Yes' : 'No'}</Badge>;
                            }
                            if ((config.dateColumn === col || col.includes('_at') || col.includes('timestamp')) && typeof cellData === 'string' && !isNaN(Date.parse(cellData))) {
                                try {
                                    return format(new Date(cellData), 'Pp');
                                } catch (e) {
                                    return cellData.toString();
                                }
                            }
                            return cellData.toString();
                        })()}
                        </TableCell>
                    ))}
                    </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={config.columns.length} className="text-center h-24">No results found.</TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
      
        <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
                {totalCount > 0 ? `Showing ${pageStart} to ${pageEnd} of ${totalCount} results` : 'No results'}
            </p>
            <div className="flex gap-2">
                <Button 
                    variant="outline" 
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    Previous
                </Button>
                <Button 
                    variant="outline" 
                    disabled={currentPage >= totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Next
                </Button>
            </div>
      </div>
    </div>
  );
}

// Helper to create a title from a slug
const formatTitle = (slug: string) => slug.replace(/[\/-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
