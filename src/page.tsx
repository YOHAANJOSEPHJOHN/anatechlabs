

'use client';
import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Autoplay from "embla-carousel-autoplay"
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
  Atom,
  Award,
  Briefcase,
  CheckCircle,
  FileText,
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
} from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useWorkshopInquiry } from '@/hooks/use-workshop-inquiry';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { cn } from '@/lib/utils';
import { useUserInfoPopup } from '@/hooks/use-user-info-popup';
import { CorporateSafetyIcon, EnvironmentalMonitoringIcon, IndustrialHygieneIcon, LaboratorySkillsIcon } from '@/components/icons';


// --- PageSpeed Optimization ---
// The Carousel is large and not critical for the initial render.
// Loading it dynamically reduces the initial JavaScript bundle size.
const Carousel = dynamic(() => import('@/components/ui/carousel').then(mod => mod.Carousel), { ssr: false, loading: () => <div className="h-[60vh] md:h-[80vh] w-full bg-muted animate-pulse" /> });
const CarouselContent = dynamic(() => import('@/components/ui/carousel').then(mod => mod.CarouselContent), { ssr: false });
const CarouselItem = dynamic(() => import('@/components/ui/carousel').then(mod => mod.CarouselItem), { ssr: false });
const CarouselNext = dynamic(() => import('@/components/ui/carousel').then(mod => mod.CarouselNext), { ssr: false });
const CarouselPrevious = dynamic(() => import('@/components/ui/carousel').then(mod => mod.CarouselPrevious), { ssr: false });


const trainingCards = [
    {
        icon: <LaboratorySkillsIcon className="h-8 w-8 text-secondary icon-glow-light dark:icon-glow-dark" />,
        title: "Laboratory Skills Training",
        description: "Hands-on training in analytical chemistry, instrumentation handling, calibration, contamination control, and ISO-aligned laboratory operations.",
        cta: "Explore Training Modules",
        href: "/training/laboratory-skills",
    },
    {
        icon: <IndustrialHygieneIcon className="h-8 w-8 text-secondary icon-glow-light dark:icon-glow-dark" />,
        title: "Industrial Hygiene & OHS Workshops",
        description: "Practical sessions on exposure monitoring, toxicology basics, air sampling, hazard identification, and workplace health protection.",
        cta: "View Workshop List",
        href: "/training/industrial-hygiene",
    },
    {
        icon: <EnvironmentalMonitoringIcon className="h-8 w-8 text-secondary icon-glow-light dark:icon-glow-dark" />,
        title: "Environmental Monitoring Programs",
        description: "Skill-building workshops covering water testing, air quality assessment, microbial detection, sampling standards, and compliance frameworks.",
        cta: "Learn More",
        href: "/training/environmental-monitoring",
    },
    {
        icon: <CorporateSafetyIcon className="h-8 w-8 text-secondary icon-glow-light dark:icon-glow-dark" />,
        title: "Corporate Safety & Compliance Training",
        description: "Custom corporate packages covering regulatory compliance, audit readiness, safety culture development, and EHS risk management.",
        cta: "Request Corporate Training",
        href: "/training/corporate-safety",
    }
];


export default function Home() {
  const { open: openUserInfoPopup, userInfoPopupsEnabled } = useUserInfoPopup();
  const carouselPlugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  useEffect(() => {
    if (userInfoPopupsEnabled) {
      const timer = setTimeout(() => {
        openUserInfoPopup();
      }, 3000); // 3-second delay
      return () => clearTimeout(timer);
    }
  }, [userInfoPopupsEnabled, openUserInfoPopup]);


  const highlights = [
    {
      icon: <ShieldCheck className="h-10 w-10 text-secondary icon-glow-light dark:icon-glow-dark" />,
      title: 'Certified & Accredited',
      description: 'ISO/NABL certified labs ensuring highest quality standards.',
    },
    {
      icon: <Atom className="h-10 w-10 text-secondary icon-glow-light dark:icon-glow-dark" />,
      title: 'Advanced Technology',
      description: 'State-of-the-art equipment for precise and reliable results.',
    },
    {
      icon: <Users className="h-10 w-10 text-secondary icon-glow-light dark:icon-glow-dark" />,
      title: 'Expert Team',
      description: 'Experienced scientists and technicians dedicated to excellence.',
    },
    {
      icon: <Leaf className="h-10 w-10 text-secondary icon-glow-light dark:icon-glow-dark" />,
      title: 'Sustainable Practices',
      description:
        'Committed to environmental stewardship in all our operations.',
    },
  ];
  
  const stats = [
    {
      value: 200,
      label: 'Successfully Completed Projects',
      icon: <Briefcase className="h-8 w-8 text-white icon-glow-light dark:icon-glow-dark" />
    },
    {
      value: 14,
      label: 'NABL Accredited Sectors',
      icon: <Award className="h-8 w-8 text-white icon-glow-light dark:icon-glow-dark" />
    },
    {
      value: 150,
      label: 'Expert Engineers & Scientists',
      icon: <Users className="h-8 w-8 text-white icon-glow-light dark:icon-glow-dark" />
    },
    {
      value: 30,
      label: 'Prestigious Certifications & Achievements',
      icon: <ShieldCheck className="h-8 w-8 text-white icon-glow-light dark:icon-glow-dark" />
    },
  ]
  
  const ohsServices = services.filter(s => s.category === 'OHS').slice(0, 3);
  const ehsServices = services.filter(s => s.category === 'EHS').slice(0, 3);
  const ptServices = services.filter(s => s.category === 'Product Testing').slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] w-full">
        <Carousel
          opts={{ loop: true }}
          plugins={[carouselPlugin.current]}
          onMouseEnter={carouselPlugin.current.stop}
          onMouseLeave={carouselPlugin.current.reset}
          className="w-full h-full"
        >
          <CarouselContent>
            {heroSlides.map((slide, index) => {
              const image = PlaceHolderImages.find((img) => img.id === slide.imageId);
              return (
                <CarouselItem key={index}>
                  <div className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
                    {image && (
                       <Image
                        src={image.imageUrl}
                        alt={slide.alt}
                        fill
                        className="object-cover"
                        data-ai-hint={image.imageHint}
                        // --- PageSpeed Optimization ---
                        // The `priority` prop is only set on the first slide image to optimize LCP.
                        // The `sizes` prop helps the browser download the most appropriate image size.
                        priority={index === 0}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    )}
                    <div
                      className={cn(
                        "absolute inset-0 flex flex-col items-center justify-center text-center p-4"
                      )}
                    >
                      <h1 
                        className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-black"
                        style={{ textShadow: '0 1px 4px rgba(255,255,255,0.25)', lineHeight: 1.1, letterSpacing: '-0.5px' }}
                      >
                        {slide.title}
                      </h1>
                      <p 
                        className="mt-4 max-w-2xl text-lg md:text-xl text-description-constant"
                        style={{ textShadow: '0 2px 10px rgba(0,0,0,0.25)', lineHeight: 1.4 }}
                      >
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
                <p className="mt-2 text-description-constant">
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
          <div className="grid md:grid-cols-5 gap-12 items-center">
            <div className="md:col-span-3">
              <h2 className="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                AnaTech-Your Partner in Precision Testing for a Sustainable & Safer Tomorrow
              </h2>
              <p className="mt-4 text-lg text-description-constant">
                At AnaTech, we deliver fully-accredited, high-precision laboratory services for occupational health, industrial hygiene and environmental monitoring. Our ISO/IEC 17025-compliant workflows, award-winning analytical protocols and certified audit readiness underpin world-class testing, helping clients manage exposure, assure compliance and drive sustainable, safer operations across complex industrial ecosystems.
              </p>
              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-4">
                  <Rocket className="h-6 w-6 text-secondary mt-1 flex-shrink-0 icon-glow-light dark:icon-glow-dark" />
                  <div>
                    <h4 className="font-semibold text-primary">Our Mission</h4>
                    <p className="text-description-constant">To deliver globally benchmarked Occupational Health & Safety and environmental testing services through accredited methodologies, advanced instrumentation and uncompromising quality systems — providing reliable data, actionable insights and end-to-end compliance support that help our clients safeguard workplaces, strengthen performance and build a safer, cleaner future.</p>
                  </div>
                </div>
                 <div className="flex items-start gap-4">
                  <HeartPulse className="h-6 w-6 text-secondary mt-1 flex-shrink-0 icon-glow-light dark:icon-glow-dark" />
                  <div>
                    <h4 className="font-semibold text-primary">Our Vision</h4>
                    <p className="text-description-constant">To be India’s most trusted leader in precision laboratory testing and environmental intelligence, empowering industries to operate sustainably, comply confidently, and protect human health through scientific excellence and accredited analytical innovation.</p>
                  </div>
                </div>
              </div>
              <Button asChild className="mt-8">
                <Link href="/about/company-info">Learn More About Us <ArrowRight className="ml-2 icon-glow-light dark:icon-glow-dark" /></Link>
              </Button>
            </div>
            <div className="md:col-span-2">
              <Image
                src={PlaceHolderImages.find(p => p.id === 'company-info-1')?.imageUrl || ''}
                alt="AnaTech Laboratory with modern equipment"
                width={600}
                height={800}
                className="rounded-xl shadow-lg w-full h-auto object-cover"
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
              Precision-Driven Testing & Environmental Intelligence
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-description-constant">
              We offer a wide range of services across Occupational Health & Safety, Environmental Health & Safety, and Product Testing.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* OHS Column */}
            <div className="flex flex-col space-y-4">
              <h3 className="font-display text-xl font-bold text-primary text-center">OHS</h3>
              {ohsServices.map(service => (
                <Card key={service.id} className="flex flex-col flex-grow transition-transform hover:scale-105 hover:shadow-xl">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="bg-secondary/10 p-3 rounded-full">
                         {React.cloneElement(service.icon as React.ReactElement, { className: "h-8 w-8 text-secondary icon-glow-light dark:icon-glow-dark" })}
                      </div>
                      <CardTitle className="font-display text-base leading-snug flex-grow">{service.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-description-constant">{service.description.substring(0, 100)}...</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" asChild className="text-secondary hover:text-secondary text-sm">
                      <Link href={`/services#ohs`}>
                        Learn More <ArrowRight className="ml-2 h-4 w-4 icon-glow-light dark:icon-glow-dark" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              <div className="pt-4 text-center mt-auto">
                <Button asChild variant="secondary">
                  <Link href="/services#ohs">Explore All OHS Services</Link>
                </Button>
              </div>
            </div>

            {/* EHS Column */}
            <div className="flex flex-col space-y-4">
              <h3 className="font-display text-xl font-bold text-primary text-center">EHS</h3>
              {ehsServices.map(service => (
                <Card key={service.id} className="flex flex-col flex-grow transition-transform hover:scale-105 hover:shadow-xl">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="bg-secondary/10 p-3 rounded-full">
                          {React.cloneElement(service.icon as React.ReactElement, { className: "h-8 w-8 text-secondary icon-glow-light dark:icon-glow-dark" })}
                      </div>
                      <CardTitle className="font-display text-base leading-snug flex-grow">{service.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-description-constant">{service.description.substring(0, 100)}...</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" asChild className="text-secondary hover:text-secondary text-sm">
                      <Link href={`/services#ehs`}>
                        Learn More <ArrowRight className="ml-2 h-4 w-4 icon-glow-light dark:icon-glow-dark" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
               <div className="pt-4 text-center mt-auto">
                <Button asChild variant="secondary">
                  <Link href="/services#ehs">Explore All EHS Services</Link>
                </Button>
              </div>
            </div>

            {/* Product Testing Column */}
            <div className="flex flex-col space-y-4">
              <h3 className="font-display text-xl font-bold text-primary text-center">Product Testing and Certifications</h3>
              {ptServices.map(service => (
                <Card key={service.id} className="flex flex-col flex-grow transition-transform hover:scale-105 hover:shadow-xl">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="bg-secondary/10 p-3 rounded-full">
                         {React.cloneElement(service.icon as React.ReactElement, { className: "h-8 w-8 text-secondary icon-glow-light dark:icon-glow-dark" })}
                      </div>
                      <CardTitle className="font-display text-base leading-snug flex-grow">{service.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-description-constant">{service.description.substring(0, 100)}...</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" asChild className="text-secondary hover:text-secondary text-sm">
                      <Link href={`/services#product-testing`}>
                        Learn More <ArrowRight className="ml-2 h-4 w-4 icon-glow-light dark:icon-glow-dark" /></Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
               <div className="pt-4 text-center mt-auto">
                <Button asChild variant="secondary">
                  <Link href="/services#product-testing">Explore All Product Testing</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Section */}
       <section className="section-padding relative bg-cover bg-center">
        <div className="grainy absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg'), url('https://imagine-public.x.ai/imagine-public/images/bed53146-8f06-4325-abd7-28e9be4a807c.png?cache=1')", opacity: 0.25 }} />
        <div className="absolute inset-0 bg-white/30 dark:bg-black/30 backdrop-blur-[6px]" />
        <div className="container mx-auto relative z-[2]">
           <div className="text-center" style={{ textShadow: '0 2px 18px rgba(0,0,0,0.45)' }}>
                <h2 className="text-3xl font-bold font-display text-primary dark:text-white">Training & Skill Building</h2>
                <p className="mt-2 max-w-2xl mx-auto text-lg text-description-constant">Empowering professionals through specialized laboratory, safety, and environmental skill-building programs.</p>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {trainingCards.map((card) => (
                    <Card key={card.title} className="relative z-[2] flex flex-col text-center transition-all duration-300 hover:scale-105 shadow-lg bg-white/15 dark:bg-black/25 backdrop-blur-lg border border-white/25 dark:border-white/15 rounded-xl before:content-[''] before:absolute before:inset-0 before:z-[-1] before:rounded-[inherit] before:bg-gradient-to-b from-[rgba(0,0,0,0.35)] via-[rgba(0,0,0,0.15)] to-transparent before:pointer-events-none">
                        <CardHeader>
                             <div className="mx-auto bg-secondary/10 p-4 rounded-full w-fit">
                                {card.icon}
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <h4 className="font-display text-lg font-semibold text-white">{card.title}</h4>
                            <p className="mt-2 text-sm text-white/80">{card.description}</p>
                        </CardContent>
                        <CardFooter className="justify-center">
                            <Button asChild variant="secondary">
                                <Link href={card.href}>{card.cta}</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="section-padding bg-background">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Our Impactful Projects
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-description-constant">
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
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                    <Link href={`/projects/${project.id}`}>View Case Study <ArrowRight className="ml-2 h-4 w-4 icon-glow-light dark:icon-glow-dark" /></Link>
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
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.05)), url('https://imagine-public.x.ai/imagine-public/images/6dcbe0b3-1448-483c-9557-66973b39c0e9.png?cache=1')`,
          backgroundBlendMode: 'multiply, luminosity',
          filter: 'saturate(1.25) contrast(1.15)',
        }}
      >
        <div className="container mx-auto text-center relative z-[2]">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.45)' }}>
            Our Legacy of Excellence
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-white/90" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.45)' }}>
            Excellence with Experience
          </p>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="group relative z-[3]">
                <Card className="p-6 transition-transform duration-300 group-hover:scale-105 shadow-2xl bg-white/10 backdrop-blur-sm border-white/20 text-white before:content-[''] before:absolute before:inset-0 before:z-[-1] before:rounded-[inherit] before:bg-gradient-to-b from-[rgba(0,0,0,0.35)] via-[rgba(0,0,0,0.15)] to-transparent before:pointer-events-none rounded-2xl" style={{boxShadow: '0 10px 30px rgba(0, 0, 0, 0.18)'}}>
                    <div className="bg-white/20 inline-block p-4 rounded-full">
                        {stat.icon}
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
          <p className="mt-4 max-w-2xl mx-auto text-lg text-description-constant">
            Our commitment to quality and results has earned us the trust of clients across various sectors.
          </p>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
            {clients.slice(0,5).map(client => {
              const image = PlaceHolderImages.find(img => img.id === client.logoId);
              return (
                <div key={client.id} className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
                  {image && (
                    <Image src={image.imageUrl} alt={`${client.name} logo`} width={158} height={48} className="mx-auto" data-ai-hint={image.imageHint} />
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
                    <svg key={i} className="h-5 w-5 text-yellow-400 icon-glow-light dark:icon-glow-dark" fill="currentColor" viewBox="0 0 20 20">
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
                  alt="Portrait of Sarah Johnson"
                  width={48}
                  height={48}
                  className="rounded-full"
                  data-ai-hint="person portrait"
                   style={{ height: 'auto' }}
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
            <p className="mt-4 text-lg text-description-constant">
              Have questions? We have answers.
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full mt-12">
            {faqData.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-description-constant">
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
