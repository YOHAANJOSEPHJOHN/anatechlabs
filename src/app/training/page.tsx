'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
import { LaboratorySkillsIcon, IndustrialHygieneIcon, EnvironmentalMonitoringIcon, CorporateSafetyIcon } from '@/components/icons';

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
          <p className="mt-4 max-w-2xl mx-auto text-lg text-description-constant">
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
                        <p className="mt-2 text-sm text-description-constant">{card.description}</p>
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
