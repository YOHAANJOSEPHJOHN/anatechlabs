
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { services } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { FileText, ChevronRight } from 'lucide-react';
import Image from 'next/image';

type Category = 'OHS' | 'EHS' | 'Product Testing';

const categoryTitles: Record<Category, string> = {
    OHS: 'Occupational Health & Safety',
    EHS: 'Environmental Health & Safety',
    'Product Testing': 'Product Testing and Certifications',
}

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<Category>('OHS');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  useEffect(() => {
    const firstServiceOfCategory = services.find((s) => s.category === activeTab);
    if (firstServiceOfCategory) {
      setSelectedServiceId(firstServiceOfCategory.id);
    }
  }, [activeTab]);

  const handleTabClick = (category: Category) => {
    setActiveTab(category);
  };

  const selectedService = services.find((s) => s.id === selectedServiceId);
  const filteredServices = services.filter((s) => s.category === activeTab);

  return (
    <>
      <section className="bg-primary/5 dark:bg-primary/10 py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-primary">Our Services</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-description-constant">
            Delivering precision and reliability in occupational health, environmental monitoring, and product testing to ensure your safety and compliance.
          </p>
        </div>
      </section>

      <section className="container mx-auto py-16">
        <div className="flex justify-center mb-8">
          <div className="bg-muted p-1 rounded-lg flex flex-wrap gap-1 justify-center">
            <Button
              variant={activeTab === 'OHS' ? 'default' : 'ghost'}
              onClick={() => handleTabClick('OHS')}
              className={cn('w-auto px-4 sm:px-6', activeTab === 'OHS' && 'shadow-sm')}
            >
              OHS
            </Button>
            <Button
              variant={activeTab === 'EHS' ? 'default' : 'ghost'}
              onClick={() => handleTabClick('EHS')}
              className={cn('w-auto px-4 sm:px-6', activeTab === 'EHS' && 'shadow-sm')}
            >
              EHS
            </Button>
             <Button
              variant={activeTab === 'Product Testing' ? 'default' : 'ghost'}
              onClick={() => handleTabClick('Product Testing')}
              className={cn('w-auto px-4 sm:px-6', activeTab === 'Product Testing' && 'shadow-sm')}
            >
              Product Testing and Certifications
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-4 lg:col-span-3">
            <div className="sticky top-24">
                <p className="px-4 text-sm font-semibold text-muted-foreground tracking-wider uppercase">{categoryTitles[activeTab]}</p>
                <div className="mt-2 bg-card border rounded-lg p-2">
                    <ul className="space-y-1">
                    {filteredServices.map((service) => (
                        <li key={service.id}>
                        <button
                            onClick={() => setSelectedServiceId(service.id)}
                            className={cn(
                            'w-full text-left px-3 py-2.5 rounded-md transition-colors duration-150 text-sm font-medium flex items-center gap-3 relative group',
                            selectedServiceId === service.id
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'hover:bg-muted text-foreground/80'
                            )}
                        >
                             {selectedServiceId === service.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-l-md"></div>}
                            {React.createElement(service.icon, { className: 'h-5 w-5 flex-shrink-0 icon-glow-light dark:icon-glow-dark' })}
                            <span>{service.title}</span>
                            <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-50 transition-opacity icon-glow-light dark:icon-glow-dark"/>
                        </button>
                        </li>
                    ))}
                    </ul>
                </div>
            </div>
          </aside>

          {/* Service Detail */}
          <main className="md:col-span-8 lg:col-span-9">
            {selectedService && (
              <Card className="overflow-hidden min-h-[500px]">
                <div className="relative h-60 w-full">
                    <Image
                        src="https://imagine-public.x.ai/imagine-public/images/879ec016-2345-4f7c-a9f6-8a7b12f08edc.png?cache=1"
                        alt={selectedService.title}
                        fill
                        className="object-cover"
                        data-ai-hint="lab equipment"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <CardContent className="p-6 md:p-8" style={{paddingTop: '40px'}}>
                  <div className="flex items-start gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-display text-primary">
                            {selectedService.title}
                        </h1>
                         <p className="mt-6 text-lg text-description-constant leading-relaxed">
                            {selectedService.description}
                        </p>
                    </div>
                  </div>
                 
                  <div className="mt-8 border-t pt-8" style={{marginTop: '20px'}}>
                    <h3 className="text-xl font-semibold font-display mb-4">Downloads</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button asChild>
                        <a href={selectedService.cataloguePdf} target="_blank" rel="noopener noreferrer">
                          <FileText className="mr-2 h-4 w-4 icon-glow-light dark:icon-glow-dark" />
                          Service Catalogue
                        </a>
                      </Button>
                      <Button variant="secondary" asChild>
                        <a href={selectedService.elementsPdf}>
                          <FileText className="mr-2 h-4 w-4 icon-glow-light dark:icon-glow-dark" />
                          Case Study
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </section>
    </>
  );
}
