'use client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
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
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  Briefcase,
  CheckCircle,
  FileText,
  FlaskConical,
  HeartPulse,
  Leaf,
  Rocket,
  ShieldCheck,
  Users,
} from 'lucide-react';
import {
  clients,
  faqData,
  heroSlides,
  projects,
  services,
} from '@/lib/data.tsx';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import React, { useEffect } from 'react';
import { useWorkshopInquiry } from '@/hooks/use-workshop-inquiry';
import { AnimatedCounter } from '@/components/ui/animated-counter';


export default function Home() {
  const { open } = useWorkshopInquiry();

  useEffect(() => {
    const timer = setTimeout(() => {
      open();
    }, 5000);
    return () => clearTimeout(timer);
  }, [open]);

  const highlights = [
    {
      icon: <ShieldCheck className="h-10 w-10 text-secondary" />,
      title: 'Certified & Accredited',
      description: 'ISO/NABL certified labs ensuring highest quality standards.',
    },
    {
      icon: <FlaskConical className="h-10 w-10 text-secondary" />,
      title: 'Advanced Technology',
      description: 'State-of-the-art equipment for precise and reliable results.',
    },
    {
      icon: <Users className="h-10 w-10 text-secondary" />,
      title: 'Expert Team',
      description: 'Experienced scientists and technicians dedicated to excellence.',
    },
    {
      icon: <Leaf className="h-10 w-10 text-secondary" />,
      title: 'Sustainable Practices',
      description:
        'Committed to environmental stewardship in all our operations.',
    },
  ];
  
  const stats = [
    {
      value: 200,
      label: 'Successfully Completed Projects',
      icon: <Briefcase className="h-8 w-8 text-secondary" />
    },
    {
      value: 14,
      label: 'NABL Accredited Sectors',
      icon: <Award className="h-8 w-8 text-secondary" />
    },
    {
      value: 150,
      label: 'Expert Engineers & Scientists',
      icon: <Users className="h-8 w-8 text-secondary" />
    },
    {
      value: 30,
      label: 'Prestigious Certifications & Achievements',
      icon: <ShieldCheck className="h-8 w-8 text-secondary" />
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] w-full">
        <Carousel
          opts={{ loop: true }}
          className="w-full h-full"
          autoplayDelay={5000}
        >
          <CarouselContent>
            {heroSlides.map((slide, index) => {
              const image = PlaceHolderImages.find((img) => img.id === slide.imageId);
              return (
                <CarouselItem key={index}>
                  <div className="relative h-[60vh] md:h-[80vh] w-full">
                    {image && (
                      <Image
                        src={image.imageUrl}
                        alt={slide.alt}
                        fill
                        className="object-cover"
                        data-ai-hint={image.imageHint}
                        priority={index === 0}
                      />
                    )}
                    <div className="absolute inset-0 bg-white/50" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-primary-foreground p-4">
                      <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight drop-shadow-lg">
                        {slide.title}
                      </h1>
                      <p className="mt-4 max-w-2xl text-lg md:text-xl text-primary-foreground/90 drop-shadow-md">
                        {slide.description}
                      </p>
                      <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                          <Link href="/services">Our Services</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground bg-transparent hover:bg-primary-foreground hover:text-primary">
                          <Link href="/contact">Request a Quote</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-foreground" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-foreground" />
          </div>
        </Carousel>
      </section>

      {/* Highlights Section */}
      <section className="section-padding bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((highlight, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6 bg-card rounded-xl shadow-md transition-transform hover:scale-105">
                {highlight.icon}
                <h3 className="mt-4 font-display text-xl font-semibold text-card-foreground">
                  {highlight.title}
                </h3>
                <p className="mt-2 text-card-foreground/80">
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Preview */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                AnaTech-Your Partner in Precision Testing for a Sustainable & Safer Tomorrow
              </h2>
              <p className="mt-4 text-lg text-foreground/80">
                At AnaTech, we deliver fully-accredited, high-precision laboratory services for occupational health, industrial hygiene and environmental monitoring. Our ISO/IEC 17025-compliant workflows, award-winning analytical protocols and certified audit readiness underpin world-class testing, helping clients manage exposure, assure compliance and drive sustainable, safer operations across complex industrial ecosystems.
              </p>
              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-4">
                  <Rocket className="h-6 w-6 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-primary">Our Mission</h4>
                    <p className="text-foreground/80">To deliver globally benchmarked OHS and environmental testing services through accredited methodologies, advanced instrumentation and uncompromising quality systems — providing reliable data, actionable insights and end-to-end compliance support that help our clients safeguard workplaces, strengthen performance and build a safer, cleaner future.</p>
                  </div>
                </div>
                 <div className="flex items-start gap-4">
                  <HeartPulse className="h-6 w-6 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-primary">Our Vision</h4>
                    <p className="text-foreground/80">To be India’s most trusted leader in precision laboratory testing and environmental intelligence, empowering industries to operate sustainably, comply confidently, and protect human health through scientific excellence and accredited analytical innovation.</p>
                  </div>
                </div>
              </div>
              <Button asChild className="mt-8">
                <Link href="/about/company-info">Learn More About Us <ArrowRight className="ml-2" /></Link>
              </Button>
            </div>
            <div>
              <Image
                src={PlaceHolderImages.find(p => p.id === 'company-info-1')?.imageUrl || ''}
                alt="AnaTech Laboratory"
                width={600}
                height={400}
                className="rounded-xl shadow-lg"
                data-ai-hint="modern laboratory"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-background">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Comprehensive Testing & Monitoring
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
              We offer a wide range of services across Occupational Health & Safety and Environmental Monitoring.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.slice(0, 6).map((service) => (
              <Card key={service.id} className="flex flex-col transition-transform hover:scale-105 hover:shadow-xl">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="bg-secondary/10 p-3 rounded-full">
                       {service.icon}
                    </div>
                    <CardTitle className="font-display">{service.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p>{service.description.substring(0, 100)}...</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" asChild className="text-secondary hover:text-secondary">
                    <Link href={`/services#${service.category.toLowerCase()}`}>
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/services">Explore All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Our Impactful Projects
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
              Discover how we've partnered with industries to solve complex challenges and drive positive change.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.slice(0, 3).map((project) => {
              const image = PlaceHolderImages.find((img) => img.id === project.imageId);
              return (
              <Card key={project.id} className="overflow-hidden group">
                 {image && (
                  <div className="overflow-hidden">
                    <Image
                      src={image.imageUrl}
                      alt={project.title}
                      width={600}
                      height={400}
                      className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-110"
                      data-ai-hint={image.imageHint}
                    />
                  </div>
                 )}
                <CardHeader>
                  <CardTitle className="font-display">{project.title}</CardTitle>
                  <CardDescription>{project.category} &middot; {project.location} &middot; {project.year}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{project.description.substring(0,120)}...</p>
                </CardContent>
                 <CardFooter>
                  <Button variant="link" asChild>
                    <Link href={`/projects/${project.id}`}>View Case Study <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </CardFooter>
              </Card>
            )})}
          </div>
        </div>
      </section>

      {/* Legacy of Excellence Section */}
      <section
        className="section-padding relative bg-cover bg-center"
        style={{ backgroundImage: "url('https://imagine-public.x.ai/imagine-public/images/6dcbe0b3-1448-483c-9557-66973b39c0e9.png?cache=1')" }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="container mx-auto text-center relative">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Our Legacy of Excellence
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-white/90">
            Excellence with Experience
          </p>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="group">
                <Card className="p-6 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl bg-white/10 backdrop-blur-sm border-white/20 text-white">
                    <div className="bg-white/20 inline-block p-4 rounded-full">
                        {React.cloneElement(stat.icon, { className: 'h-8 w-8 text-white' })}
                    </div>
                    <div className="mt-4">
                        <span className="font-display text-4xl font-bold text-white">
                            <AnimatedCounter value={stat.value} />+
                        </span>
                        <p className="mt-2 text-white/90">{stat.label}</p>
                    </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-background">
        <div className="container mx-auto text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Trusted by Industry Leaders
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Our commitment to quality and results has earned us the trust of clients across various sectors.
          </p>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
            {clients.slice(0,5).map(client => {
              const image = PlaceHolderImages.find(img => img.id === client.logoId);
              return (
                <div key={client.id} className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
                  {image && (
                    <Image src={image.imageUrl} alt={client.name} width={158} height={48} className="mx-auto" data-ai-hint={image.imageHint} />
                  )}
                </div>
              )
            })}
          </div>
          <div className="mt-16 max-w-2xl mx-auto">
            <Card className="text-left">
              <CardContent className="p-8">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="mt-4 text-lg font-medium text-foreground">
                  "AnaTech's expertise and professionalism are unmatched. They delivered precise results ahead of schedule, enabling us to meet our compliance goals effortlessly."
                </blockquote>
              </CardContent>
              <CardFooter className="flex items-center gap-4 p-8 pt-0">
                <Image
                  src={PlaceHolderImages.find(p => p.id === 'client-avatar-1')?.imageUrl || ''}
                  alt="Client representative"
                  width={48}
                  height={48}
                  className="rounded-full"
                  data-ai-hint="person portrait"
                />
                <div>
                  <p className="font-semibold text-primary">Sarah Johnson</p>
                  <p className="text-sm text-foreground/80">Environmental Manager, EcoCorp</p>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              Have questions? We have answers.
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full mt-12">
            {faqData.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-foreground/80">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
