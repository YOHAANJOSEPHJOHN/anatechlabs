'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Loader, ServerCrash, AlertCircle, PackageCheck, Beaker, ClipboardCheck, FlaskConical, FileText, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const orderStatusSchema = z.object({
  orderId: z.string().min(5, 'Please enter a valid Order ID.'),
  email: z.string().email('Please enter a valid email address.'),
});

type OrderStatusValues = z.infer<typeof orderStatusSchema>;

const trackingStages = [
    { name: 'Order Created', icon: <Package/>, status: 'Pending' },
    { name: 'Payment Confirmed', icon: <CheckCircle/>, status: 'Pending' },
    { name: 'Sample In Transit', icon: <PackageCheck/>, status: 'In Transit' },
    { name: 'Sample Arrived', icon: <Beaker/>, status: 'Received' },
    { name: 'Analysis Started', icon: <FlaskConical/>, status: 'Testing' },
    { name: 'QA Review', icon: <ClipboardCheck/>, status: 'Testing' },
    { name: 'Test Results Ready', icon: <FileText/>, status: 'Completed' },
];

const statusColors: { [key: string]: string } = {
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800',
  'In Transit': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800',
  Received: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800',
  Testing: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-800',
  Completed: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800',
  'Report Ready': 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/50 dark:text-teal-300 dark:border-teal-800',
  Cancelled: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800',
};


// Dummy data for demonstration
const dummyOrderStatus: { [key: string]: any } = {
    'SSP-2024-12345': {
        email: 'test@example.com',
        current_stage: 4, // "Sample Arrived at Lab"
        order_status: 'Testing',
        sample_count: 5,
        payment_status: 'Paid',
        report_date: '2024-08-15',
        assigned_technician: 'Dr. Priya Sharma',
        notes: 'Partial shipment received. Awaiting remaining samples.',
        items: [
            { id: 's1', service_name: 'Heavy Metals Testing', price_per_sample: 500, number_of_samples: 2, line_total: 1000},
            { id: 's2', service_name: 'VOC Analysis', price_per_sample: 600, number_of_samples: 3, line_total: 1800},
        ],
    }
}

export default function OrderStatusPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any | null>(null);

  const form = useForm<OrderStatusValues>({
    resolver: zodResolver(orderStatusSchema),
    defaultValues: {
      orderId: '',
      email: '',
    },
  });

  const onSubmit = (data: OrderStatusValues) => {
    setIsLoading(true);
    setError(null);
    setOrderData(null);

    // Simulate API call to Hostinger backend
    setTimeout(() => {
      const order = dummyOrderStatus[data.orderId.trim()];
      if (order && order.email.toLowerCase() === data.email.trim().toLowerCase()) {
        setOrderData(order);
      } else {
        setError('No order found. Please check your Order ID or Email.');
      }
      setIsLoading(false);
    }, 1500);
  };
  
  const currentStageIndex = orderData ? orderData.current_stage : -1;
  const statusText = orderData ? orderData.order_status : '';
  const timelineStatus = statusText === 'Completed' || statusText === 'Report Ready' ? 'Completed' : (currentStageIndex >= 4 ? 'Testing' : 'Ordered');

  return (
    <div className="container mx-auto py-12">
      <Card className="shadow-lg max-w-4xl mx-auto" style={{ borderRadius: '15px' }}>
        <CardHeader>
          <CardTitle className="font-display text-3xl">Track Your Order</CardTitle>
          <CardDescription>Enter your Order ID and email address to see the current status of your submission.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                 <FormField
                    control={form.control}
                    name="orderId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order ID</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., SSP-2024-12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> Checking Status...</> : 'Check Status'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AnimatePresence>
        {(error || orderData) && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8 max-w-4xl mx-auto"
            >
              {error && (
                <Card className="shadow-lg border-destructive" style={{ borderRadius: '15px' }}>
                    <CardContent className="p-6 flex items-center gap-4 text-destructive">
                      <AlertCircle className="h-6 w-6"/>
                      <div>
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                      </div>
                    </CardContent>
                </Card>
              )}

              {orderData && (
                 <Card className="shadow-lg" style={{ borderRadius: '15px' }}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="font-display text-2xl">Order Status: {orderData.order_id}</CardTitle>
                                <CardDescription>Last updated: {new Date().toLocaleDateString()}</CardDescription>
                            </div>
                            <Badge className={cn('text-base', statusColors[statusText])}>{statusText}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-2 space-y-6">
                        {/* 3-Step Timeline */}
                        <div className="w-full py-4">
                            <div className="flex justify-between items-center relative">
                                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2" />
                                <div 
                                    className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2"
                                    style={{ width: timelineStatus === 'Ordered' ? '0%' : timelineStatus === 'Testing' ? '50%' : '100%'}}
                                />
                                {['Ordered', 'Testing', 'Completed'].map((step, index) => (
                                    <div key={step} className="relative z-10 flex flex-col items-center">
                                        <div className={cn(
                                            "h-6 w-6 rounded-full flex items-center justify-center bg-muted border-2 transition-colors",
                                            (timelineStatus === step) || 
                                            (timelineStatus === 'Testing' && index < 1) ||
                                            (timelineStatus === 'Completed') && 'bg-primary border-primary text-primary-foreground'
                                        )}>
                                            <CheckCircle className="h-4 w-4"/>
                                        </div>
                                        <p className="text-xs mt-1 font-medium">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator/>

                        {/* Full Progress Bar */}
                        <div className="relative w-full pt-4">
                            <div className="absolute left-0 top-1/2 w-full h-1 bg-muted -translate-y-1/2">
                                 <motion.div 
                                    className="h-full bg-primary"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(currentStageIndex / (trackingStages.length - 1)) * 100}%` }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                 />
                            </div>
                            <div className="relative flex justify-between">
                                {trackingStages.map((stage, index) => (
                                    <div key={index} className="flex flex-col items-center text-center w-full group">
                                         <div className={cn(
                                            "relative z-10 h-8 w-8 rounded-full flex items-center justify-center transition-colors duration-300",
                                            index <= currentStageIndex ? 'bg-primary text-white' : 'bg-muted border-2'
                                        )}>
                                            {React.cloneElement(stage.icon, {className: "h-5 w-5"})}
                                        </div>
                                         <p className={cn(
                                            "mt-2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity",
                                            index <= currentStageIndex ? 'text-primary' : 'text-muted-foreground'
                                        )}>
                                            {stage.name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Separator/>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div><dt className="text-muted-foreground">Sample Count</dt><dd className="font-semibold">{orderData.sample_count}</dd></div>
                            <div><dt className="text-muted-foreground">Payment Status</dt><dd className="font-semibold">{orderData.payment_status}</dd></div>
                            <div><dt className="text-muted-foreground">Report Date</dt><dd className="font-semibold">{orderData.report_date || 'N/A'}</dd></div>
                            <div><dt className="text-muted-foreground">Assigned Technician</dt><dd className="font-semibold">{orderData.assigned_technician || 'Pending'}</dd></div>
                        </div>

                         {orderData.items && orderData.items.length > 0 && (
                            <div>
                                <h4 className="font-semibold">Services</h4>
                                <ul className="mt-2 space-y-1 text-sm list-disc list-inside text-muted-foreground">
                                   {orderData.items.map((item: any) => (
                                       <li key={item.id}>
                                            <span className="text-foreground">{item.service_name}</span> (x{item.number_of_samples})
                                        </li>
                                   ))}
                                </ul>
                            </div>
                         )}

                        {orderData.notes && (
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-sm text-blue-800 dark:text-blue-300">
                                <p><span className="font-semibold">Notes:</span> {orderData.notes}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
              )}
            </motion.div>
        )}
        </AnimatePresence>
    </div>
  );
}
