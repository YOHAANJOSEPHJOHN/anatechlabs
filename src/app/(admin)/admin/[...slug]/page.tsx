
'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { notFound, useSearchParams, useRouter, usePathname } from 'next/navigation';
import { tableConfig } from './config';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Search, AlertCircle, ArrowLeft, Download, X } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth, startOfYesterday, endOfYesterday, subMonths } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getData } from './actions';
import type { DateRange } from 'react-day-picker';
import Link from 'next/link';

type DatePreset = 'today' | 'yesterday' | 'last7' | 'last30' | 'thisMonth' | 'lastMonth';

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

const exportToCsv = (data: any[], columns: string[], filename: string) => {
    const replacer = (key: any, value: any) => value === null ? '' : value;
    const header = columns.map(col => col.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').toUpperCase());
    let csv = data.map(row => columns.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    const csvString = csv.join('\r\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}


export default function AdminTablePage({ params }: { params: { slug: string[] } }) {
    const slug = params.slug.join('/');
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [data, setData] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
    const [totalCount, setTotalCount] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
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

    const handleApplyFilters = () => {
        const newParams = new URLSearchParams();
        if (searchTerm) newParams.set('search', searchTerm);
        if (dateRange?.from) newParams.set('from', format(dateRange.from, 'yyyy-MM-dd'));
        if (dateRange?.to) newParams.set('to', format(dateRange.to, 'yyyy-MM-dd'));
        if (statusFilter && statusFilter !== 'all') newParams.set('status', statusFilter);
        if (countryFilter) newParams.set('country', countryFilter);
        newParams.set('page', '1');
        router.push(`${pathname}?${newParams.toString()}`);
    }

    const handleClearFilters = () => {
        setSearchTerm('');
        setDateRange(undefined);
        setStatusFilter('');
        setCountryFilter('');
        router.push(pathname);
    }
    
    const handleRemoveFilter = (filter: 'search' | 'date' | 'status' | 'country') => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set('page', '1');
        switch(filter) {
            case 'search':
                setSearchTerm('');
                newParams.delete('search');
                break;
            case 'date':
                setDateRange(undefined);
                newParams.delete('from');
                newParams.delete('to');
                break;
            case 'status':
                setStatusFilter('');
                newParams.delete('status');
                break;
            case 'country':
                setCountryFilter('');
                newParams.delete('country');
                break;
        }
        router.push(`${pathname}?${newParams.toString()}`);
    }


    const handlePageChange = (newPage: number) => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set('page', newPage.toString());
        router.push(`${pathname}?${newParams.toString()}`);
    }

    const handleDatePresetChange = (preset: DatePreset) => {
        const now = new Date();
        switch(preset) {
            case 'today': setDateRange({ from: now, to: now }); break;
            case 'yesterday': setDateRange({ from: startOfYesterday(), to: endOfYesterday() }); break;
            case 'last7': setDateRange({ from: subDays(now, 6), to: now }); break;
            case 'last30': setDateRange({ from: subDays(now, 29), to: now }); break;
            case 'thisMonth': setDateRange({ from: startOfMonth(now), to: endOfMonth(now) }); break;
            case 'lastMonth': 
                const lastMonthStart = startOfMonth(subMonths(now, 1));
                const lastMonthEnd = endOfMonth(subMonths(now, 1));
                setDateRange({ from: lastMonthStart, to: lastMonthEnd });
                break;
        }
    }

    const activeFilters = useMemo(() => {
        const filters = [];
        if (searchParams.get('search')) filters.push({type: 'search' as const, value: `Search: "${searchParams.get('search')}"`});
        if (searchParams.get('from')) filters.push({type: 'date' as const, value: `Date: ${format(new Date(searchParams.get('from')!), 'PP')} - ${searchParams.get('to') ? format(new Date(searchParams.get('to')!), 'PP') : '...'}`});
        if (searchParams.get('status') && searchParams.get('status') !== 'all') filters.push({type: 'status' as const, value: `Status: ${searchParams.get('status')}`});
        if (searchParams.get('country')) filters.push({type: 'country' as const, value: `Country: ${searchParams.get('country')}`});
        return filters;
    }, [searchParams]);

    if (!config) {
        notFound();
    }
    
    const pageStart = (currentPage - 1) * 20 + 1;
    const pageEnd = Math.min(currentPage * 20, totalCount);

  return (
    <div className="space-y-6">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
        </Link>
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{formatTitle(slug)}</h1>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => exportToCsv(data, config.columns, `${slug}-export.csv`)} disabled={!data.length || isLoading}>
                    <Download className="mr-2 h-4 w-4"/>
                    Export CSV
                </Button>
                <Button variant="outline" disabled>Export PDF</Button>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative lg:col-span-2">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="search" 
                        placeholder={`Search in ${config.searchColumns.join(', ')}...`}
                        className="pl-8" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                     {config.filterColumns?.includes('status') && (
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
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
                            value={countryFilter}
                            onChange={(e) => setCountryFilter(e.target.value)}
                        />
                     )}

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                                disabled={!config.dateColumn}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                <span>
                                    {dateRange?.from ? 
                                     (dateRange.to ? `${format(dateRange.from, 'LLL d, y')} - ${format(dateRange.to, 'LLL d, y')}`: format(dateRange.from, 'LLL d, y'))
                                     : "Select date range"}
                                </span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 flex" align="start">
                             <div className="p-4 border-r">
                                <div className="grid grid-rows-6 gap-1">
                                    <Button variant="ghost" size="sm" className="justify-start" onClick={() => handleDatePresetChange('today')}>Today</Button>
                                    <Button variant="ghost" size="sm" className="justify-start" onClick={() => handleDatePresetChange('yesterday')}>Yesterday</Button>
                                    <Button variant="ghost" size="sm" className="justify-start" onClick={() => handleDatePresetChange('last7')}>Last 7 Days</Button>
                                    <Button variant="ghost" size="sm" className="justify-start" onClick={() => handleDatePresetChange('last30')}>Last 30 Days</Button>
                                    <Button variant="ghost" size="sm" className="justify-start" onClick={() => handleDatePresetChange('thisMonth')}>This Month</Button>
                                    <Button variant="ghost" size="sm" className="justify-start" onClick={() => handleDatePresetChange('lastMonth')}>Last Month</Button>
                                </div>
                            </div>
                            <Calendar
                                mode="range"
                                selected={dateRange}
                                onSelect={setDateRange}
                                disabled={!config.dateColumn}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </CardContent>
            <CardFooter className="justify-end gap-2">
                <Button variant="ghost" onClick={handleClearFilters}>Clear All Filters</Button>
                <Button onClick={handleApplyFilters}>Apply Filters</Button>
            </CardFooter>
        </Card>

        {activeFilters.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium">Active Filters:</span>
                {activeFilters.map(filter => (
                     <Badge key={filter.type} variant="secondary" className="gap-1">
                        {filter.value}
                        <button onClick={() => handleRemoveFilter(filter.type)} className="rounded-full hover:bg-muted-foreground/20">
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
            </div>
        )}

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
                            if (slug === 'job-applications' && col === 'resumeUrl') {
                                return cellData ? (
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={cellData} target="_blank" rel="noopener noreferrer">
                                            <Download className="mr-2 h-3 w-3" />
                                            Download
                                        </Link>
                                    </Button>
                                ) : (
                                    <span className="text-muted-foreground">Not uploaded</span>
                                );
                            }
                             if ((col === 'order_status' || col === 'status') && slug === 'ssp/orders') {
                                return <StatusDropdown orderId={row.id} currentStatus={cellData} />;
                            }
                             if (cellData === null || cellData === undefined) {
                                return <span className="text-muted-foreground">N/A</span>;
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
