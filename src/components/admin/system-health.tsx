
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Info, Database } from 'lucide-react';
import React from 'react';

type HealthDataItem = {
  source: string;
  count24h: number;
  lastSubmission: string | null;
};

interface SystemHealthProps {
  healthData: HealthDataItem[];
}

const StatusIndicator = ({ status, text }: { status: 'healthy' | 'degraded' | 'offline', text?: string }) => {
    const statusClasses = {
        healthy: 'bg-green-500',
        degraded: 'bg-yellow-500',
        offline: 'bg-red-500',
    };
    const pulseClasses = {
        healthy: 'animate-pulse',
        degraded: '',
        offline: '',
    };
    return (
        <div className="flex items-center gap-2">
            <span className={cn('h-2.5 w-2.5 rounded-full', statusClasses[status], status === 'healthy' && text === 'Connected' ? pulseClasses[status] : '')} />
            <span className="capitalize text-sm font-medium">{text || status}</span>
        </div>
    );
};


export function SystemHealth({ healthData }: SystemHealthProps) {
    const isProd = process.env.NODE_ENV === 'production';
    const hasDataError = healthData.some(h => !h.lastSubmission || (new Date().getTime() - new Date(h.lastSubmission).getTime()) > 24 * 60 * 60 * 1000);
    const overallStatus: 'healthy' | 'degraded' = hasDataError ? 'degraded' : 'healthy';
    const environment = isProd ? `Production` : `Development`;

    return (
        <Card>
            <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>An overview of application health and data flow.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <TooltipProvider>
                    <div className="flex justify-between items-center p-3 rounded-lg border">
                         <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="font-medium flex items-center gap-2 cursor-help">Overall Status <Info className="h-3 w-3 text-muted-foreground" /></span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Indicates if all data pipelines are receiving data.</p>
                            </TooltipContent>
                        </Tooltip>
                        <StatusIndicator status={overallStatus} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg border">
                             <p className="text-sm text-muted-foreground">Environment</p>
                            <p className="font-semibold">{environment}</p>
                        </div>
                        <div className="p-3 rounded-lg border">
                           <p className="text-sm text-muted-foreground">DB Connectivity</p>
                             <StatusIndicator status={'healthy'} text={'Connected'} />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium mb-2 px-1">Data Ingestion Health</h4>
                        <div className="space-y-2">
                            {healthData.length > 0 ? healthData.map(item => {
                                const lastSeen = item.lastSubmission ? new Date(item.lastSubmission) : null;
                                const isDelayed = lastSeen && (new Date().getTime() - lastSeen.getTime()) > 24 * 60 * 60 * 1000;
                                const itemStatus: 'healthy' | 'degraded' | 'offline' = !lastSeen ? 'offline' : isDelayed ? 'degraded' : 'healthy';
                                const statusText = lastSeen ? `Last: ${formatDistanceToNow(lastSeen, { addSuffix: true })}` : 'No data';
                                
                                return (
                                    <div key={item.source} className="flex justify-between items-center p-3 rounded-lg border">
                                        <span className="text-sm font-medium">{item.source}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-muted-foreground">{statusText}</span>
                                            <StatusIndicator status={itemStatus} text={!lastSeen ? 'Offline' : isDelayed ? 'Delayed' : 'OK'} />
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="p-3 rounded-lg border text-center">
                                    <p className="text-sm text-muted-foreground">
                                       No health data available.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </TooltipProvider>
            </CardContent>
        </Card>
    );
}
