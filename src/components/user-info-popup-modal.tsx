
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserInfoPopup } from '@/hooks/use-user-info-popup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { X, CheckCircle, User, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const userInfoSchema = z.object({
  fullName: z.string().min(2, 'Name is required.'),
  email: z.string().email('A valid email is required.'),
  phone: z.string().min(10, 'A valid phone number is required.'),
  country: z.string().min(2, 'Country is required.'),
  userType: z.enum(['b2b', 'b2c', 'other']),
  companyName: z.string().optional(),
}).refine(data => {
    if (data.userType === 'b2b') {
        return !!data.companyName && data.companyName.length >= 2;
    }
    return true;
}, {
    message: "Company name is required for B2B.",
    path: ["companyName"],
});


type UserInfoValues = z.infer<typeof userInfoSchema>;

export function UserInfoPopupModal() {
  const { isOpen, close } = useUserInfoPopup();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<UserInfoValues>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      country: '',
      userType: 'b2b',
      companyName: '',
    },
  });

  const userType = form.watch('userType');

  const onSubmit = (data: UserInfoValues) => {
    try {
      localStorage.setItem('userInfo', JSON.stringify(data));
      setIsSubmitted(true);
      toast({
        title: 'Information Saved',
        description: 'Thank you! Your information has been saved.',
      });
    } catch (error) {
      console.error('Failed to save user info to localStorage', error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'Could not save your information. Please try again.',
      });
    }
  };
  
  const handleClose = () => {
    close();
    // Delay form reset to allow for exit animation
    setTimeout(() => {
        form.reset();
        setIsSubmitted(false);
    }, 300);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="relative bg-card rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-10 bg-muted/50 hover:bg-muted rounded-full p-1.5 text-muted-foreground transition-colors"
            >
              <X className="h-4 w-4 icon-glow-light dark:icon-glow-dark" />
              <span className="sr-only">Close</span>
            </button>
            
            <div className="overflow-y-auto p-6">
                {isSubmitted ? (
                    <div className="flex flex-col items-center justify-center text-center py-8">
                        <motion.div initial={{scale: 0.5, opacity: 0}} animate={{scale: 1, opacity: 1}} transition={{delay: 0.1, type: 'spring', stiffness: 200, damping: 15}}>
                            <CheckCircle className="h-16 w-16 text-green-500 icon-glow-light dark:icon-glow-dark"/>
                        </motion.div>
                        <h2 className="mt-4 text-xl font-bold font-display text-primary">Thank You!</h2>
                        <p className="mt-1 text-foreground/80">Your information has been saved.</p>
                        <Button onClick={handleClose} className="mt-6">Close</Button>
                    </div>
                ) : (
                <>
                    <div className="text-center">
                        <h2 className="text-xl font-bold font-display text-primary">Help Us Personalize Your Experience</h2>
                        <p className="mt-1 text-foreground/80 text-sm">Please share a few quick details so we can serve you better.</p>
                    </div>
                    
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
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
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <div className="grid grid-cols-2 gap-4">
                             <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                    <Input type="tel" placeholder="Your phone" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Country / State</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. USA / California" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                         </div>
                        <FormField
                            control={form.control}
                            name="userType"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company / Client Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your client type" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="b2b">B2B</SelectItem>
                                        <SelectItem value="b2c">B2C</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        
                        <AnimatePresence>
                        {userType === 'b2b' && (
                             <motion.div
                                key="companyName"
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden"
                            >
                                <FormField
                                    control={form.control}
                                    name="companyName"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Please specify your company</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your company name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>
                        )}
                        </AnimatePresence>

                        <div className="flex flex-col-reverse sm:flex-row sm:gap-2 sm:justify-end pt-2">
                            <Button type="button" variant="ghost" onClick={handleClose}>Skip for Now</Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Submitting...' : 'Submit Details'}
                            </Button>
                        </div>
                    </form>
                    </Form>
                </>
                )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
