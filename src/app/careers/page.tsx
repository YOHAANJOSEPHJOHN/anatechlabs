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
import { Label } from '@/components/ui/label';
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
import { jobOpenings } from '@/lib/data.tsx';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const evpCards = [
  {
    icon: <TrendingUp className="h-8 w-8 text-secondary" />,
    title: 'Grow With Us',
    description: 'We invest in your professional development with continuous training, workshops, and opportunities for advancement.',
  },
  {
    icon: <Lightbulb className="h-8 w-8 text-secondary" />,
    title: 'Innovate & Impact',
    description: 'Work on challenging projects that make a real-world difference in public health and environmental sustainability.',
  },
  {
    icon: <Users className="h-8 w-8 text-secondary" />,
    title: 'Collaborative Culture',
    description: 'Join a diverse team of experts who are passionate, supportive, and committed to collective success.',
  },
  {
    icon: <Heart className="h-8 w-8 text-secondary" />,
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
  resume: z
    .any()
    .refine((files) => files?.length == 1, 'Resume is required.')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      '.pdf, .doc, and .docx files are accepted.'
    ),
});

type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<typeof jobOpenings[0] | null>(jobOpenings[0]);
  const { toast } = useToast();
  const { firestore } = useFirebase();

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
  });

  const onSubmit = async (data: ApplicationFormValues) => {
    if (!firestore) return;

    try {
      // 1. Upload resume to Firebase Storage
      const file = data.resume[0];
      const storage = getStorage();
      const storageRef = ref(storage, `resumes/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const resumeUrl = await getDownloadURL(snapshot.ref);

      // 2. Add application to Firestore
      await addDoc(collection(firestore, 'job_applications'), {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        coverLetter: data.coverLetter,
        resumeUrl: resumeUrl,
        jobTitle: selectedJob?.title,
        timestamp: serverTimestamp(),
      });

      toast({
        title: 'Application Submitted!',
        description: "We've received your application and will be in touch soon.",
      });
      form.reset();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'There was a problem submitting your application. Please try again.',
      });
    }
  };

  return (
    <>
      <section className="bg-primary/5 dark:bg-primary/10 py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-primary">Join Our Team</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
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
                <p className="mt-2 text-foreground/80">{card.description}</p>
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
              <Accordion type="single" collapsible defaultValue={jobOpenings[0].id} className="w-full">
                {jobOpenings.map((job) => (
                  <AccordionItem key={job.id} value={job.id}>
                    <AccordionTrigger
                      className="hover:no-underline"
                      onClick={() => setSelectedJob(job)}
                    >
                      <div>
                        <h4 className="text-lg font-semibold">{job.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {job.location}</span>
                          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {job.type}</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>{job.description}</p>
                      <Button size="sm" className="mt-4" onClick={() => setSelectedJob(job)}>
                        Apply Now <ArrowRight className="ml-2 h-4 w-4" />
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
                              render={({ field: { onChange, onBlur, name, ref } }) => (
                                <FormItem>
                                  <FormLabel>Upload CV</FormLabel>
                                  <FormControl>
                                     <div className="relative">
                                        <Button type="button" variant="outline" asChild>
                                            <label htmlFor="resume-upload" className="cursor-pointer">
                                                <Upload className="mr-2 h-4 w-4" />
                                                Choose File
                                            </label>
                                        </Button>
                                        <Input 
                                            id="resume-upload" 
                                            type="file" 
                                            className="absolute w-full h-full top-0 left-0 opacity-0 cursor-pointer"
                                            onChange={(e) => onChange(e.target.files)}
                                            onBlur={onBlur}
                                            name={name}
                                            ref={ref}
                                        />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                  <p className="text-xs text-muted-foreground">PDF, DOC, DOCX up to 5MB.</p>
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