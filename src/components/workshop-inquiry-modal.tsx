'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkshopInquiry } from '@/hooks/use-workshop-inquiry';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import {
  FlaskConical,
  X,
  Wind,
  Biohazard,
  CheckCircle,
} from 'lucide-react';
import { useFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const inquiryFormSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters.'),
  company: z.string().optional(),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
  workshop: z.string({ required_error: 'Please select a workshop.' }),
  message: z.string().optional(),
});

type InquiryFormValues = z.infer<typeof inquiryFormSchema>;

const workshops = [
  {
    title: 'Chemical Exposure Assessment',
    icon: <Biohazard className="h-6 w-6 text-secondary icon-glow-light dark:icon-glow-dark" />,
  },
  {
    title: 'Advanced Toxicology & LC-MS/MS Basics',
    icon: <FlaskConical className="h-6 w-6 text-secondary icon-glow-light dark:icon-glow-dark" />,
  },
  {
    title: 'VOC & Indoor Air Quality Monitoring',
    icon: <Wind className="h-6 w-6 text-secondary icon-glow-light dark:icon-glow-dark" />,
  },
];

export function WorkshopInquiryModal() {
  const { isOpen, close, defaultWorkshop } = useWorkshopInquiry();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { firestore } = useFirebase();
  const { toast } = useToast();

  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      fullName: '',
      company: '',
      email: '',
      phone: '',
      workshop: defaultWorkshop || '',
      message: '',
    },
  });
  
  React.useEffect(() => {
    if (defaultWorkshop) {
      form.setValue('workshop', defaultWorkshop);
    }
  }, [defaultWorkshop, form]);

  const onSubmit = async (data: InquiryFormValues) => {
    if (!firestore) return;
    try {
      await addDoc(collection(firestore, 'workshop_requests'), {
        ...data,
        timestamp: serverTimestamp(),
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting workshop inquiry:', error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'There was a problem sending your request. Please try again.',
      });
    }
  };
  
  const handleClose = () => {
    close();
    setTimeout(() => {
        form.reset({
            fullName: '',
            company: '',
            email: '',
            phone: '',
            workshop: '',
            message: '',
        });
        setIsSubmitted(false);
    }, 300); // Delay reset to allow for exit animation
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="relative bg-card rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 bg-muted/50 hover:bg-muted rounded-full p-1.5 text-muted-foreground transition-colors"
            >
              <X className="h-5 w-5 icon-glow-light dark:icon-glow-dark" />
              <span className="sr-only">Close</span>
            </button>
            
            <div className="overflow-y-auto p-8">
                {isSubmitted ? (
                    <div className="flex flex-col items-center justify-center text-center py-12">
                        <motion.div initial={{scale: 0.5, opacity: 0}} animate={{scale: 1, opacity: 1}} transition={{delay: 0.1, type: 'spring', stiffness: 200, damping: 15}}>
                            <CheckCircle className="h-20 w-20 text-green-500 icon-glow-light dark:icon-glow-dark"/>
                        </motion.div>
                        <h2 className="mt-6 text-2xl font-bold font-display text-primary">Thank You!</h2>
                        <p className="mt-2 text-foreground/80 max-w-md">Our team will contact you shortly to discuss your workshop inquiry.</p>
                        <Button onClick={handleClose} className="mt-8">Close</Button>
                    </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Side: Info */}
                <div className="flex flex-col">
                    <h2 className="text-3xl font-bold font-display text-primary">AnaTech Workshops & Training</h2>
                    <p className="mt-3 text-foreground/80">
                    Enhance your team’s capabilities with accredited hands-on workshops in toxicology, industrial hygiene, environmental monitoring, microbiology, and analytical instrumentation. Our programs combine expert instruction, real lab workflows, and industry-approved methodologies.
                    </p>
                    <div className="mt-6 space-y-4">
                    {workshops.map((workshop) => (
                        <Card key={workshop.title} className="bg-background/50">
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="bg-secondary/10 p-3 rounded-lg">
                            {workshop.icon}
                            </div>
                            <h3 className="font-semibold text-card-foreground">{workshop.title}</h3>
                        </CardContent>
                        </Card>
                    ))}
                    </div>
                </div>

                {/* Right Side: Form */}
                <div>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Company (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="Your company name" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                    <Input type="email" placeholder="you@company.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                    <Input type="tel" placeholder="Your phone number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                        control={form.control}
                        name="workshop"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Workshop Interested In</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a workshop" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {workshops.map(w => <SelectItem key={w.title} value={w.title}>{w.title}</SelectItem>)}
                                    <SelectItem value="Custom Training">Custom Training Inquiry</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Message (Optional)</FormLabel>
                            <FormControl>
                                <Textarea
                                placeholder="Tell us more about your training needs..."
                                className="resize-none"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                         {form.formState.isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                        </Button>
                    </form>
                    </Form>
                </div>
                </div>
                )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
