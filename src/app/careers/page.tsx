
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Users,
  Lightbulb,
  TrendingUp,
  Heart,
  MapPin,
  Clock,
  ArrowRight,
  Upload,
} from 'lucide-react';
import { jobOpenings } from '@/lib/data';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const evpCards = [
  {
    icon: <TrendingUp className={cn("h-8 w-8 text-secondary", "icon-glow-light dark:icon-glow-dark")} />,
    title: 'Grow With Us',
    description: 'We invest in your professional development with continuous training, workshops, and opportunities for advancement.',
  },
  {
    icon: <Lightbulb className={cn("h-8 w-8 text-secondary", "icon-glow-light dark:icon-glow-dark")} />,
    title: 'Innovate & Impact',
    description: 'Work on challenging projects that make a real-world difference in public health and environmental sustainability.',
  },
  {
    icon: <Users className={cn("h-8 w-8 text-secondary", "icon-glow-light dark:icon-glow-dark")} />,
    title: 'Collaborative Culture',
    description: 'Join a diverse team of experts who are passionate, supportive, and committed to collective success.',
  },
  {
    icon: <Heart className={cn("h-8 w-8 text-secondary", "icon-glow-light dark:icon-glow-dark")} />,
    title: 'Health & Wellbeing',
    description: 'We offer comprehensive benefits and promote a healthy work-life balance to ensure our team thrives.',
  },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const applicationFormSchema = z.object({
  firstName: z.string().min(2, 'First name is required.'),
  lastName: z.string().min(2, 'Last name is required.'),
  email: z.string().email('Please enter a valid email.'),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
  coverLetter: z.string().min(20, 'Please write a short cover letter.'),
  // Resume upload is not handled by this form submission to MySQL
  // It would require a separate file upload service.
  // For now, we make it optional to allow form submission.
  resume: z.any().optional(),
});

type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<typeof jobOpenings[0] | null>(jobOpenings[0]);
  const { toast } = useToast();

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
  });

  const onSubmit = async (data: ApplicationFormValues) => {
    if (!selectedJob) {
        toast({
            variant: "destructive",
            title: "No Job Selected",
            description: "Please select a job opening before applying.",
        });
        return;
    }

    try {
        const response = await fetch('/api/careers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data, selectedJob: selectedJob.title }),
        });

        const result = await response.json();

        if (result.ok) {
            toast({
              title: 'Application Submitted!',
              description: "We've received your application and will be in touch soon.",
            });
            form.reset();
        } else {
            throw new Error(result.error || 'An unknown error occurred.');
        }

    } catch (error) {
        toast({
            variant: "destructive",
            title: 'Submission Failed',
            description: (error as Error).message || 'Could not submit your application.',
        });
    }
  };

  return (
    <>
      <section className="bg-primary/5 dark:bg-primary/10 py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-primary">Join Our Team</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-description-constant">
            Be part of a company that's shaping a safer, more sustainable future. Explore a rewarding career at AnaTech.
          </p>
        </div>
      </section>

      {/* EVP Section */}
      <section className="container mx-auto py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {evpCards.map((card, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="inline-block bg-secondary/10 p-4 rounded-full">
                    {card.icon}
                </div>
                <h3 className="mt-4 text-xl font-bold font-display">{card.title}</h3>
                <p className="mt-2 text-description-constant">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Job Openings & Apply Form */}
      <section className="bg-background py-16">
        <div className="container mx-auto">
            <h2 className="text-center font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl mb-8">
              Current Openings
            </h2>
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <Accordion type="single" collapsible defaultValue={jobOpenings.length > 0 ? jobOpenings[0].id : undefined} className="w-full">
                {jobOpenings.map((job) => (
                  <AccordionItem key={job.id} value={job.id}>
                    <AccordionTrigger
                      className="hover:no-underline"
                      onClick={() => setSelectedJob(job)}
                    >
                      <div>
                        <h4 className="text-lg font-semibold">{job.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1.5"><MapPin className={cn("h-4 w-4", "icon-glow-light dark:icon-glow-dark")} /> {job.location}</span>
                          <span className="flex items-center gap-1.5"><Clock className={cn("h-4 w-4", "icon-glow-light dark:icon-glow-dark")} /> {job.type}</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>{job.description}</p>
                      <Button size="sm" className="mt-4" onClick={() => setSelectedJob(job)}>
                        Apply Now <ArrowRight className={cn("ml-2 h-4 w-4", "icon-glow-light dark:icon-glow-dark")} />
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            <div className="lg:col-span-7">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-display text-2xl">
                           {selectedJob ? `Apply for: ${selectedJob.title}` : 'Apply Now'}
                        </CardTitle>
                        <CardDescription>
                            {selectedJob ? 'Fill out the form below to submit your application.' : 'Select a position to get started.'}
                        </CardDescription>
                    </CardHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="John" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
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
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone</FormLabel>
                                  <FormControl>
                                    <Input type="tel" placeholder="+91 12345 67890" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="coverLetter"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Cover Letter</FormLabel>
                                  <FormControl>
                                    <Textarea placeholder="Tell us why you're a great fit..." {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                             <FormField
                              control={form.control}
                              name="resume"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Upload CV (Optional)</FormLabel>
                                  <FormControl>
                                     <div className="relative">
                                        <Button type="button" variant="outline" asChild>
                                            <label htmlFor="resume-upload" className="cursor-pointer">
                                                <Upload className={cn("mr-2 h-4 w-4", "icon-glow-light dark:icon-glow-dark")} />
                                                Choose File
                                            </label>
                                        </Button>
                                        <Input 
                                            id="resume-upload" 
                                            type="file" 
                                            className="absolute w-full h-full top-0 left-0 opacity-0 cursor-pointer"
                                            onChange={(e) => field.onChange(e.target.files)}
                                            onBlur={field.onBlur}
                                            name={field.name}
                                            ref={field.ref}
                                        />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                  <p className="text-xs text-muted-foreground">PDF, DOC, DOCX up to 5MB. File upload is not active for this form.</p>
                                </FormItem>
                              )}
                            />
                        </CardContent>
                        <CardFooter>
                           <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                             {form.formState.isSubmitting ? 'Submitting...' : 'Submit Application'}
                           </Button>
                        </CardFooter>
                      </form>
                    </Form>
                </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
