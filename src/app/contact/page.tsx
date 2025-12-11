'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Phone, Mail, MapPin, Facebook, Linkedin, Twitter, Youtube } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';

const contactInfo = [
  { icon: <Phone className={cn("h-5 w-5 text-secondary", "icon-glow-light dark:icon-glow-dark")} />, text: '9844163329', href: 'tel:9844163329' },
  { icon: <Mail className={cn("h-5 w-5 text-secondary", "icon-glow-light dark:icon-glow-dark")} />, text: 'contact@anatechlabs.com', href: 'mailto:contact@anatechlabs.com' },
  { icon: <MapPin className={cn("h-5 w-5 text-secondary", "icon-glow-light dark:icon-glow-dark")} />, text: '16, 18th A Cross Rd, 1st main, Bhuvaneswari Nagar, Hebbal Kempapura, Bengaluru, Byatarayanapura CMC and OG Part, Karnataka 560024' },
];

const socialLinks = [
  { icon: <Twitter className={cn("h-5 w-5", "icon-glow-light dark:icon-glow-dark")} />, href: '#' },
  { icon: <Linkedin className={cn("h-5 w-5", "icon-glow-light dark:icon-glow-dark")} />, href: '#' },
  { icon: <Facebook className={cn("h-5 w-5", "icon-glow-light dark:icon-glow-dark")} />, href: '#' },
  { icon: <Youtube className={cn("h-5 w-5", "icon-glow-light dark:icon-glow-dark")} />, href: '#' },
];

const contactFormSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  inquiryType: z.string({ required_error: 'Please select an inquiry type.' }),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const { firestore } = useFirebase();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    if (!firestore) return;
    try {
      await addDoc(collection(firestore, 'contact_inquiries'), {
        ...data,
        timestamp: serverTimestamp(),
      });
      toast({
        title: 'Message Sent!',
        description: 'Thank you for your inquiry. We will get back to you shortly.',
      });
      form.reset();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'There was a problem sending your message. Please try again.',
      });
    }
  };

  return (
    <>
      <section className="bg-primary/5 dark:bg-primary/10 py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-primary">Contact Us</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            We're here to help. Reach out to us for inquiries, quotes, or to learn more about our services.
          </p>
        </div>
      </section>

      <section className="container mx-auto py-16">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-7">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-2xl">Send us a Message</CardTitle>
                <CardDescription>We'll get back to you as soon as possible.</CardDescription>
              </CardHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
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
                    </div>
                    <FormField
                      control={form.control}
                      name="inquiryType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inquiry Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a service" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="quote">Request a Quote</SelectItem>
                              <SelectItem value="ohs">OHS Inquiry</SelectItem>
                              <SelectItem value="ehs">EHS Inquiry</SelectItem>
                              <SelectItem value="careers">Careers</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
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
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Your message..." rows={5} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </div>
          {/* Contact Info & Map */}
          <div className="lg:col-span-5 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    {item.icon}
                    {item.href ? (
                      <a href={item.href} className="text-foreground/80 hover:text-secondary">{item.text}</a>
                    ) : (
                      <p className="text-foreground/80">{item.text}</p>
                    )}
                  </div>
                ))}
                <div className="flex pt-4 gap-4">
                    {socialLinks.map((social, idx) => (
                        <a key={idx} href={social.href} className="text-muted-foreground hover:text-secondary transition-colors">
                        {social.icon}
                        </a>
                    ))}
                </div>
              </CardContent>
            </Card>
            <Card>
                <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.7188814904025!2d77.6028031745479!3d13.053557513077205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae17e73522942f%3A0x77edc5d26981a6d3!2sAnatech%20Lab%20%26%20Research%20Centre!5e0!3m2!1sen!2sin!4v1717500000000!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="AnaTech Location"
                    ></iframe>
                </div>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
