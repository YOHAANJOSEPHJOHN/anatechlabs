
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { serviceCategories, SSPService, industries, classifications, countries, countryStateMap } from '@/lib/ssp-data';
import {
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Trash2,
  Plus,
  ArrowRight,
  ArrowLeft,
  Info,
  CheckCircle,
  FileDown,
  Loader2,
  Workflow,
  Clock,
  ShieldCheck,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { OrderTracker } from '@/components/order-tracker';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const serviceSchema = z.object({
  category: z.string().min(1, "Category is required."),
  service: z.string().min(1, "Service is required."),
  price: z.number().min(0),
  tat: z.string(),
  quantity: z.number().min(1, "Quantity must be at least 1.").max(100, "Quantity cannot exceed 100."),
});

const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  companyName: z.string().optional(),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(10, "A valid phone number is required."),
  address: z.string().min(5, "Address is required."),
  industry: z.string().min(1, "Industry is required."),
  classification: z.string().min(1, "Classification is required."),
  country: z.string().min(1, "Country is required."),
  state: z.string().min(1, "State/Province is required."),
  services: z.array(serviceSchema).min(1, "Please add at least one service."),
});

type FormValues = z.infer<typeof formSchema>;

const STEPS = {
  CUSTOMER_DETAILS: 1,
  SELECT_SERVICES: 2,
  PAYMENT: 3,
  SUCCESS: 4,
};

const WarningCard = () => (
    <div className="relative mb-6">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-red-500 rounded-lg blur-lg opacity-60 animate-pulse"></div>
        <div className="relative p-4 bg-background/80 backdrop-blur-sm border border-destructive/30 rounded-lg flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
                <AlertTriangle className="h-6 w-6 text-yellow-400" style={{ filter: 'drop-shadow(0 0 5px rgba(253, 224, 71, 0.7))' }} />
            </div>
            <div>
                <h3 className="font-bold text-destructive">Warning: We are currently not taking any Orders.</h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Kindly visit our branch, contact us at <a href="tel:9844163329" className="underline hover:text-foreground">9844163329</a>, or click/scan the QR code at the bottom of the website for more information.
                </p>
            </div>
        </div>
    </div>
);


export default function SampleSubmissionPage() {
  const [currentStep, setCurrentStep] = useState(STEPS.CUSTOMER_DETAILS);
  const [orderId, setOrderId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      companyName: '',
      email: '',
      phone: '',
      address: '',
      industry: '',
      classification: '',
      country: '',
      state: '',
      services: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "services",
  });

  const watchServices = form.watch("services");
  const watchCountry = form.watch("country");

  const availableStates = useMemo(() => countryStateMap[watchCountry] || [], [watchCountry]);
  
  useEffect(() => {
    form.setValue('state', '');
  }, [watchCountry, form]);

  const orderSummary = useMemo(() => {
    const subtotal = watchServices.reduce((acc, service) => acc + (service.price * service.quantity), 0);
    const gst = subtotal * 0.18;
    const finalTotal = subtotal + gst;
    const tatValues = watchServices
      .map(s => s.tat.split('-').map(t => parseInt(t.trim(), 10)))
      .flat()
      .filter(t => !isNaN(t));

    let maxTat = '—';
    if (tatValues.length > 0) {
        const minDay = Math.min(...tatValues);
        const maxDay = Math.max(...tatValues);
        if(minDay === maxDay) {
            maxTat = `${maxDay} Business Days`;
        } else {
            maxTat = `${minDay}-${maxDay} Business Days`;
        }
    }

    return { subtotal, gst, finalTotal, maxTat };
  }, [watchServices]);

  const customerDetailFields: (keyof FormValues)[] = ['fullName', 'email', 'phone', 'address', 'industry', 'classification', 'country', 'state'];

  const handleNextStep = async () => {
    if (currentStep === STEPS.CUSTOMER_DETAILS) {
      const isValid = await form.trigger(customerDetailFields);
      if (isValid) {
        setCurrentStep(STEPS.SELECT_SERVICES);
      } else {
        toast({
            variant: "destructive",
            title: "Missing Fields",
            description: "Please fill in all required customer details.",
        })
      }
    } else if (currentStep === STEPS.SELECT_SERVICES) {
       const isValid = await form.trigger('services');
      if (isValid) {
          setCurrentStep(STEPS.PAYMENT);
      } else {
         toast({
            variant: "destructive",
            title: "No Services Selected",
            description: "Please add and configure at least one service.",
        })
      }
    }
  };

  const handlePrevStep = () => {
    if(currentStep > STEPS.CUSTOMER_DETAILS) {
        setCurrentStep(currentStep - 1);
    }
  }

  const addNewService = () => {
    append({ category: '', service: '', price: 0, tat: '', quantity: 1 });
  };
  
  const handleCategoryChange = (index: number, categoryName: string) => {
    const category = serviceCategories.find(c => c.name === categoryName);
    if(category) {
        update(index, {
            ...watchServices[index],
            category: categoryName,
            service: '', // Reset service
            price: 0,
            tat: '',
        });
    }
  };
  
  const handleServiceChange = (index: number, serviceName: string) => {
      const category = serviceCategories.find(c => c.name === watchServices[index].category);
      const service = category?.services.find(s => s.name === serviceName);
      if(service) {
          update(index, {
              ...watchServices[index],
              service: serviceName,
              price: service.price,
              tat: service.tat,
          });
      }
  };

  const handlePayment = async () => {
    setIsSubmitting(true);
    const rawData = form.getValues();
    const payload = {
        ...rawData,
        ...orderSummary,
    };

    try {
        const response = await fetch('/api/ssp/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        // Defensive JSON parsing
        const responseText = await response.text();
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (e) {
            console.error("Failed to parse JSON response:", responseText);
            throw new Error("Received an invalid response from the server.");
        }
        
        if (response.ok && result.ok) {
            setOrderId(result.orderId);
            setCurrentStep(STEPS.SUCCESS);
        } else {
            throw new Error(result.error || 'An unknown error occurred.');
        }
    } catch (error) {
        console.error("Submission failed:", error);
        toast({
            variant: "destructive",
            title: "Submission Failed",
            description: (error as Error).message || "Could not submit your order. Please try again.",
        });
    } finally {
        setIsSubmitting(false);
    }
  };
  

  return (
    <>
      <section className="bg-primary/5 dark:bg-primary/10 py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-primary">Sample Submission Portal</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-description-constant">
            A streamlined process to submit your samples for analysis.
          </p>
           <Button variant="outline" className="mt-4" asChild>
            <Link href="/order-status">Already have an Order ID? Track Your Order</Link>
           </Button>
        </div>
      </section>

      <section className="container mx-auto py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <WarningCard />
              <Form {...form}>
                <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
                <AnimatePresence mode="wait">
                  {currentStep === STEPS.CUSTOMER_DETAILS && (
                      <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                          <Card style={{ borderRadius: '15px' }} className="shadow-lg">
                              <CardHeader>
                                  <CardTitle>Step 1: Customer Details</CardTitle>
                                  <CardDescription>Please provide your contact and company information.</CardDescription>
                              </CardHeader>
                              <CardContent>
                                  <div className="space-y-6">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          <FormField control={form.control} name="fullName" render={({ field }) => (
                                              <FormItem>
                                                  <FormLabel>Full Name</FormLabel>
                                                  <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="John Doe" {...field} className="pl-10" /></FormControl></div>
                                                  <FormMessage />
                                              </FormItem>
                                          )} />
                                          <FormField control={form.control} name="companyName" render={({ field }) => (
                                              <FormItem>
                                                  <FormLabel>Company Name (Optional)</FormLabel>
                                                  <div className="relative"><Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="AnaTech Inc." {...field} className="pl-10" /></FormControl></div>
                                                  <FormMessage />
                                              </FormItem>
                                          )} />
                                          <FormField control={form.control} name="email" render={({ field }) => (
                                              <FormItem>
                                                  <FormLabel>Email</FormLabel>
                                                  <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input type="email" placeholder="john.doe@example.com" {...field} className="pl-10" /></FormControl></div>
                                                  <FormMessage />
                                              </FormItem>
                                          )} />
                                          <FormField control={form.control} name="phone" render={({ field }) => (
                                              <FormItem>
                                                  <FormLabel>Phone Number</FormLabel>
                                                  <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input type="tel" placeholder="+91 12345 67890" {...field} className="pl-10" /></FormControl></div>
                                                  <FormMessage />
                                              </FormItem>
                                          )} />
                                          <FormField control={form.control} name="address" render={({ field }) => (
                                              <FormItem className="md:col-span-2">
                                                  <FormLabel>Address</FormLabel>
                                                  <div className="relative"><MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><FormControl><Textarea placeholder="123 Lab Street, Science City" {...field} className="pl-10" /></FormControl></div>
                                                  <FormMessage />
                                              </FormItem>
                                          )} />
                                          <FormField control={form.control} name="industry" render={({ field }) => (
                                              <FormItem>
                                                  <FormLabel>Industry</FormLabel>
                                                  <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select an industry..." /></SelectTrigger></FormControl>
                                                  <SelectContent>{industries.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent></Select>
                                                  <FormMessage />
                                              </FormItem>
                                          )} />
                                          <FormField control={form.control} name="classification" render={({ field }) => (
                                              <FormItem>
                                                  <FormLabel>Classification</FormLabel>
                                                  <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a classification..." /></SelectTrigger></FormControl>
                                                  <SelectContent>{classifications.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
                                                  <FormMessage />
                                              </FormItem>
                                          )} />
                                          <FormField control={form.control} name="country" render={({ field }) => (
                                              <FormItem>
                                                  <FormLabel>Country</FormLabel>
                                                  <Select onValueChange={(value) => { field.onChange(value); form.setValue('state', ''); }} value={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a country..." /></SelectTrigger></FormControl>
                                                    <SelectContent>{countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                                  </Select>
                                                  <FormMessage />
                                              </FormItem>
                                          )} />
                                          <FormField control={form.control} name="state" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>State / Province</FormLabel>
                                                <AnimatePresence mode="wait">
                                                {availableStates.length > 0 ? (
                                                    <motion.div key="select" initial={{opacity: 0, x: -10}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: 10}}>
                                                        <Select onValueChange={field.onChange} value={field.value} disabled={!watchCountry}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder={!watchCountry ? "Select a country first" : "Select a state/province..."} />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>{availableStates.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                                        </Select>
                                                    </motion.div>
                                                ) : (
                                                    <motion.div key="input" initial={{opacity: 0, x: -10}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: 10}}>
                                                        <FormControl>
                                                            <Input placeholder={!watchCountry ? "Select a country first" : "Enter your state/region"} {...field} disabled={!watchCountry} />
                                                        </FormControl>
                                                    </motion.div>
                                                )}
                                                </AnimatePresence>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                      </div>
                                  </div>
                              </CardContent>
                              <CardFooter className="justify-end">
                                  <Button type="button" onClick={handleNextStep}>Next: Select Services <ArrowRight className="ml-2 h-4 w-4" /></Button>
                              </CardFooter>
                          </Card>
                      </motion.div>
                  )}

                  {currentStep === STEPS.SELECT_SERVICES && (
                      <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                          <Card style={{ borderRadius: '15px' }} className="shadow-lg">
                              <CardHeader>
                                  <CardTitle>Step 2: Select Services</CardTitle>
                                  <CardDescription>Choose the tests you require. You can add multiple services.</CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                {fields.map((field, index) => {
                                    const selectedCategory = serviceCategories.find(c => c.name === watchServices[index]?.category);
                                    return (
                                        <Card key={field.id} className="bg-muted/50" style={{ borderRadius: '10px' }}>
                                            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                                <div className="md:col-span-3">
                                                    <FormLabel>Category</FormLabel>
                                                    <Controller name={`services.${index}.category`} control={form.control} render={({ field }) => (
                                                        <Select onValueChange={(value) => { field.onChange(value); handleCategoryChange(index, value); }} value={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue placeholder="Select Category..." /></SelectTrigger></FormControl>
                                                            <SelectContent>{serviceCategories.map(cat => <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>)}</SelectContent>
                                                        </Select>
                                                    )}/>
                                                </div>
                                                <div className="md:col-span-4">
                                                    <FormLabel>Service</FormLabel>
                                                    <Controller name={`services.${index}.service`} control={form.control} render={({ field }) => (
                                                        <Select onValueChange={(value) => { field.onChange(value); handleServiceChange(index, value); }} value={field.value} disabled={!selectedCategory}>
                                                            <FormControl><SelectTrigger><SelectValue placeholder="Select Service..." /></SelectTrigger></FormControl>
                                                            <SelectContent>{selectedCategory?.services.map(s => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}</SelectContent>
                                                        </Select>
                                                    )}/>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <FormLabel>Price/Sample</FormLabel>
                                                    <Input type="text" readOnly value={watchServices[index]?.price > 0 ? `₹${watchServices[index].price.toLocaleString()}` : '—'} className="bg-background" />
                                                </div>
                                                <div className="md:col-span-1">
                                                    <FormLabel>Qty</FormLabel>
                                                    <Controller name={`services.${index}.quantity`} control={form.control} render={({ field }) => (
                                                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 1)} min="1" max="100" />
                                                    )}/>
                                                </div>
                                                <div className="md:col-span-2 flex items-center gap-2">
                                                    <p className="text-sm w-full">Total: <span className="font-semibold">₹{(watchServices[index]?.price * watchServices[index]?.quantity || 0).toLocaleString()}</span></p>
                                                    <Button variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                                 <FormMessage>{form.formState.errors.services?.root?.message || form.formState.errors.services?.message}</FormMessage>
                                <Button type="button" variant="outline" onClick={addNewService}><Plus className="mr-2 h-4 w-4" /> Add Another Service</Button>
                              </CardContent>
                              <CardFooter className="justify-between">
                                  <Button variant="ghost" type="button" onClick={handlePrevStep}><ArrowLeft className="mr-2 h-4 w-4" /> Back to Details</Button>
                                  <Button type="button" onClick={handleNextStep}>Proceed to Payment <ArrowRight className="ml-2 h-4 w-4" /></Button>
                              </CardFooter>
                          </Card>
                      </motion.div>
                  )}

                  {currentStep === STEPS.PAYMENT && (
                      <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                          <Card style={{ borderRadius: '15px' }} className="shadow-lg">
                              <CardHeader>
                                  <CardTitle>Step 3: Confirm &amp; Pay</CardTitle>
                                  <CardDescription>Review your order and proceed to payment.</CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <Alert>
                                    <Info className="h-4 w-4" />
                                    <AlertTitle>This is a UI demonstration.</AlertTitle>
                                    <AlertDescription>The payment process is a placeholder and no real transaction will be made.</AlertDescription>
                                </Alert>
                                <div className="text-center p-6 border rounded-lg bg-muted/50">
                                    <p className="text-sm text-muted-foreground">Total Amount Due</p>
                                    <p className="text-4xl font-bold font-display text-primary">₹{orderSummary.finalTotal.toLocaleString()}</p>
                                </div>
                              </CardContent>
                              <CardFooter className="justify-between">
                                <Button variant="ghost" type="button" onClick={handlePrevStep} disabled={isSubmitting}><ArrowLeft className="mr-2 h-4 w-4" /> Back to Services</Button>
                                <Button id="pay-now-button" onClick={handlePayment} size="lg" className="bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</> : 'Submit & Pay'}
                                </Button>
                              </CardFooter>
                          </Card>
                      </motion.div>
                  )}

                  {currentStep === STEPS.SUCCESS && (
                        <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                          <Card style={{ borderRadius: '15px' }} className="shadow-lg text-center">
                              <CardHeader>
                                  <motion.div initial={{scale: 0.5, opacity: 0}} animate={{scale: 1, opacity: 1}} transition={{delay: 0.1, type: 'spring', stiffness: 200, damping: 15}} className="mx-auto">
                                      <CheckCircle className="h-20 w-20 text-green-500" />
                                  </motion.div>
                                  <CardTitle className="text-3xl">Payment Successful!</CardTitle>
                                  <CardDescription>Your order has been confirmed.</CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-6">
                                  <div className="p-4 border rounded-lg bg-muted/50">
                                      <p className="text-sm text-muted-foreground">Your Order ID</p>
                                      <p className="font-mono text-lg font-semibold">{orderId}</p>
                                  </div>
                                  <div className="text-left">
                                      <h4 className="font-semibold">Shipping Instructions</h4>
                                      <p className="text-sm text-muted-foreground mt-1">Please securely package your samples and ship them to the address below. Ensure your Order ID is clearly written on the outside of the package.</p>
                                      <address className="mt-2 text-sm not-italic border-l-2 border-primary pl-4">
                                          AnaTech Labs<br/>
                                          Attn: Sample Receiving (Order: {orderId})<br/>
                                          16, 18th A Cross Rd, 1st main, Bhuvaneswari Nagar,<br/>
                                          Hebbal Kempapura, Bengaluru, Karnataka 560024
                                      </address>
                                  </div>
                                  <Separator/>
                                    <div className="text-left space-y-6 text-sm">
                                        <h3 className="font-bold text-lg text-primary">Further Details</h3>
                                        <p>Thank you for choosing ANATECHLABS for your testing and analytical requirements. Once your request is submitted, our technical or coordination team will promptly connect with you to confirm scope, parameters, sample requirements, pricing, and logistics.</p>

                                        <div>
                                            <h4 className="font-semibold flex items-center gap-2"><Workflow className="h-4 w-4 text-secondary"/>Process Overview</h4>
                                            <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                                                <li><strong className="text-foreground">Request Review & Confirmation:</strong> Each request is reviewed by qualified professionals to ensure appropriate test selection and regulatory alignment.</li>
                                                <li><strong className="text-foreground">Sample Collection / Receipt:</strong> Samples are collected or received in accordance with approved handling, labeling, and transport protocols.</li>
                                                <li><strong className="text-foreground">Laboratory Testing & Analysis:</strong> Testing is carried out using validated methods, calibrated equipment, and controlled laboratory environments.</li>
                                                <li><strong className="text-foreground">Reporting & Verification:</strong> Results are verified and issued in structured reports suitable for audits, compliance, and decision-making.</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold flex items-center gap-2"><Clock className="h-4 w-4 text-secondary"/>Turnaround Time</h4>
                                            <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                                                <li>Standard turnaround: 5–15 working days</li>
                                                <li>Dependent on complexity, parameters, and sample volume</li>
                                                <li>Priority timelines available upon discussion</li>
                                            </ul>
                                        </div>
                                        
                                        <div>
                                            <h4 className="font-semibold flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-secondary"/>Quality & Assurance</h4>
                                            <p className="text-muted-foreground mt-1">ANATECHLABS maintains strict standards for accuracy, traceability, and confidentiality through:</p>
                                            <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                                                <li>Experienced technical personnel</li>
                                                <li>Advanced analytical instrumentation</li>
                                                <li>Documented procedures and workflows</li>
                                                <li>Robust quality control systems</li>
                                            </ul>
                                        </div>
                                        
                                        <div>
                                            <h4 className="font-semibold flex items-center gap-2"><FileText className="h-4 w-4 text-secondary"/>Important Notes & Terms</h4>
                                            <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                                                <li>Testing limited to approved parameters only</li>
                                                <li>Results applicable solely to samples tested</li>
                                                <li>Client data handled under strict confidentiality</li>
                                                <li>Observations or limitations disclosed transparently</li>
                                            </ul>
                                        </div>
                                        
                                        <p className="text-xs text-center text-muted-foreground pt-4">By proceeding, you acknowledge the outlined process and timelines. ANATECHLABS ensures professional handling, technical excellence, and dependable reporting at every stage.</p>
                                    </div>
                              </CardContent>
                              <CardFooter className="flex-col sm:flex-row justify-center gap-4">
                                  <Button disabled><FileDown className="mr-2 h-4 w-4" /> Download Summary PDF</Button>
                                  <Button variant="outline" asChild>
                                    <Link href={`/order-status?orderId=${orderId}&email=${form.getValues('email')}`}>Track Order Status</Link>
                                  </Button>
                              </CardFooter>
                          </Card>
                        </motion.div>
                  )}
                </AnimatePresence>
                </form>
              </Form>
            </div>
            
            <div className="lg:col-span-4 sticky top-24">
                <Card style={{ borderRadius: '15px' }} className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 text-sm max-h-48 overflow-y-auto pr-2">
                            {watchServices.length > 0 ? watchServices.map((service, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <span className="text-muted-foreground truncate pr-2">{service.service || 'New Service'} x {service.quantity}</span>
                                    <span className="font-medium">₹{(service.price * service.quantity).toLocaleString()}</span>
                                </div>
                            )) : <p className="text-muted-foreground text-center py-4">No services added yet.</p>}
                        </div>
                        <Separator />
                        <div className="space-y-2 font-medium">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>₹{orderSummary.subtotal.toLocaleString()}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">GST (18%)</span>
                                <span>₹{orderSummary.gst.toLocaleString()}</span>
                            </div>
                             <Separator />
                             <div className="flex justify-between text-lg">
                                <span className="font-bold">Final Total</span>
                                <span className="font-bold">₹{orderSummary.finalTotal.toLocaleString()}</span>
                             </div>
                        </div>
                        <Separator />
                         <div className="text-center text-sm">
                            <p className="font-semibold">Estimated Delivery Time</p>
                            <p className="text-muted-foreground">{orderSummary.maxTat || '—'}</p>
                         </div>
                    </CardContent>
                    {currentStep === STEPS.SELECT_SERVICES && watchServices.length > 0 && (
                         <CardFooter>
                            <Button 
                                type="button"
                                className="w-full"
                                onClick={handleNextStep}
                                disabled={form.formState.isSubmitting || !form.formState.isValid && form.formState.isSubmitted}
                            >
                                Proceed to Payment <ArrowRight className="ml-2 h-4 w-4"/>
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </div>
      </section>

    </>
  );
}
