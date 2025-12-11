
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const LaboratorySkillsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M10 10.25c.1-.25.2-.5.3-.75"/><path d="M14 14.75c-.1.25-.2.5-.3.75"/><path d="M12 6V5a2 2 0 1 0-4 0v1"/><path d="M12 6h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2"/><path d="m14 14-2 2-2-2"/></svg>
);
const IndustrialHygieneIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 13.4V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.4a2 2 0 0 0 .5 1.3L9 18v2h6v-2l2.5-3.3a2 2 0 0 0 .5-1.3Z"/><path d="m9.4 11 1.6 2.6 1.6-2.6"/><path d="M8 5h.01"/><path d="M16 5h.01"/><path d="M12 5h.01"/></svg>
);
const EnvironmentalMonitoringIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-3.5-6V2"/><path d="M12 22a7 7 0 0 1-7-7c0-2 1-3.9 3-5.5s3.5-4 3.5-6"/><path d="M2 13h2.7a2.5 2.5 0 0 0 4.6 0H22"/><path d="M10.4 13c-.1-.6-.4-1.2-.9-1.6"/><path d="M13.6 13c.1-.6.4-1.2.9-1.6"/></svg>
);
const CorporateSafetyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="m9 12 2 2 4-4"/></svg>
);

const trainingCards = [
    {
        icon: <LaboratorySkillsIcon className="h-8 w-8 text-secondary" />,
        title: "Laboratory Skills Training",
        description: "Hands-on training in analytical chemistry, instrumentation handling, calibration, contamination control, and ISO-aligned laboratory operations.",
        cta: "Explore Training Modules",
        href: "/training/laboratory-skills",
    },
    {
        icon: <IndustrialHygieneIcon className="h-8 w-8 text-secondary" />,
        title: "Industrial Hygiene & OHS Workshops",
        description: "Practical sessions on exposure monitoring, toxicology basics, air sampling, hazard identification, and workplace health protection.",
        cta: "View Workshop List",
        href: "/training/industrial-hygiene",
    },
    {
        icon: <EnvironmentalMonitoringIcon className="h-8 w-8 text-secondary" />,
        title: "Environmental Monitoring Programs",
        description: "Skill-building workshops covering water testing, air quality assessment, microbial detection, sampling standards, and compliance frameworks.",
        cta: "Learn More",
        href: "/training/environmental-monitoring",
    },
    {
        icon: <CorporateSafetyIcon className="h-8 w-8 text-secondary" />,
        title: "Corporate Safety & Compliance Training",
        description: "Custom corporate packages covering regulatory compliance, audit readiness, safety culture development, and EHS risk management.",
        cta: "Request Corporate Training",
        href: "/training/corporate-safety",
    }
];

export default function TrainingPage() {
  return (
    <>
      <section className="bg-primary/5 dark:bg-primary/10 py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-primary">Training & Skill Building</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Empowering professionals through specialized laboratory, safety, and environmental skill-building programs.
          </p>
        </div>
      </section>

      <section className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {trainingCards.map((card) => (
                <Card key={card.title} className="flex flex-col text-center transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <CardHeader>
                         <div className="mx-auto bg-secondary/10 p-4 rounded-full w-fit">
                            {card.icon}
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <h4 className="font-display text-lg font-semibold">{card.title}</h4>
                        <p className="mt-2 text-sm text-foreground/80">{card.description}</p>
                    </CardContent>
                    <CardFooter className="justify-center">
                        <Button asChild variant="secondary">
                            <Link href={card.href}>{card.cta}</Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
      </section>
    </>
  );
}
