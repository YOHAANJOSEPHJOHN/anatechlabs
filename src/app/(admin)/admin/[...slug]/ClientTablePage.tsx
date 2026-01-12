
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
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

// Helper to create a title from a slug
const formatTitle = (slug: string) => slug.replace(/[\/-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

// Separate component for SSP status dropdown to manage its state
function StatusDropdown({ orderId, currentStatus }: { orderId: number | string, currentStatus: string }) {
    const { toast } = useToast();
    const [status, setStatus] = useState(currentStatus);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleStatusChange = async (newStatus: string) => {
        const originalStatus = status;
        setStatus(newStatus); // Optimistic update
        setIsUpdating(true);
        
        try {
            const response = await fetch('/api/admin/ssp/orders/status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, newStatus })
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Could not update order status.'}));
                throw new Error(errorData.error);
            }

            toast({
                title: 'Status Updated',
                description: `Order #${orderId} status changed to ${newStatus}.`
            })
        } catch(error) {
             setStatus(originalStatus); // Revert on failure
             toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: (error as Error).message || 'An unknown error occurred.',
            });
        } finally {
            setIsUpdating(false);
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

export default function ClientTablePage({
    slug,
    config,
    initialData,
    initialTotalPages,
    initialCurrentPage,
    initialTotalCount,
    initialError,
}: {
    slug: string;
    config: any;
    initialData: any[];
    initialTotalPages: number;
    initialCurrentPage: number;
    initialTotalCount: number;
    initialError: string | null;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Filter states initialized from searchParams
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [dateRange, setDateRange] = useState<{ from?: Date, to?: Date }>({
        from: searchParams?.get('from') ? new Date(searchParams.get('from')!) : undefined,
        to: searchParams?.get('to') ? new Date(searchParams.get('to')!) : undefined,
    });
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
    const [countryFilter, setCountryFilter] = useState(searchParams.get('country') || '');
    
    // Data states are initialized from props but are not refetched on the client unless needed.
    const [data, setData] = useState(initialData);
    const [totalPages, setTotalPages] = useState(initialTotalPages);
    const [currentPage, setCurrentPage] = useState(initialCurrentPage);
    const [totalCount, setTotalCount] = useState(initialTotalCount);
    const [error, setError] = useState(initialError);

    // Loading state for client-side navigations
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setData(initialData);
        setTotalPages(initialTotalPages);
        setCurrentPage(initialCurrentPage);
        setTotalCount(initialTotalCount);
        setError(initialError);
        setIsLoading(false);
    }, [initialData, initialTotalPages, initialCurrentPage, initialTotalCount, initialError]);
    
    const handleFilterChange = () => {
        setIsLoading(true);
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
        setIsLoading(true);
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
                        onSelect={(range) => range && setDateRange(range)}
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
                    {config.columns.map((col: string) => <TableHead key={col}>{col.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').toUpperCase()}</TableHead>)}
                </TableRow>
                </TableHeader>
                <TableBody>
                {isLoading ? (
                    Array.from({ length: 10 }).map((_, i) => (
                        <TableRow key={i}>
                            {config.columns.map((col: string) => (
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
                    {config.columns.map((col: string) => (
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

    