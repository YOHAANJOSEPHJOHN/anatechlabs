'use client';
import React, { useState } from 'react';
import { services } from '@/lib/data.tsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { FileText } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type Category = 'OHS' | 'EMS';

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<Category>('OHS');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    services.find((s) => s.category === 'OHS')?.id || ''
  );

  const handleTabClick = (category: Category) => {
    setActiveTab(category);
    setSelectedServiceId(services.find((s) => s.category === category)?.id || '');
  };

  const selectedService = services.find((s) => s.id === selectedServiceId);
  const filteredServices = services.filter((s) => s.category === activeTab);

  return (
    <>
      {/* Page Header */}
      <section className="bg-primary/5 dark:bg-primary/10 py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-primary">Our Services</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Delivering precision and reliability in occupational health and environmental monitoring to ensure your safety and compliance.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto py-16">
        <div className="flex justify-center mb-8">
          <div className="bg-muted p-1 rounded-lg flex gap-1">
            <Button
              variant={activeTab === 'OHS' ? 'default' : 'ghost'}
              onClick={() => handleTabClick('OHS')}
              className={cn('w-auto px-6', activeTab === 'OHS' && 'shadow-sm')}
            >
              OHS (Occupational Health)
            </Button>
            <Button
              variant={activeTab === 'EMS' ? 'default' : 'ghost'}
              onClick={() => handleTabClick('EMS')}
              className={cn('w-auto px-6', activeTab === 'EMS' && 'shadow-sm')}
            >
              EMS (Environmental)
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg">
                  {activeTab === 'OHS'
                    ? 'Occupational Health & Safety'
                    : 'Environmental Monitoring'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {filteredServices.map((service) => (
                    <li key={service.id}>
                      <button
                        onClick={() => setSelectedServiceId(service.id)}
                        className={cn(
                          'w-full text-left px-3 py-2 rounded-md transition-colors text-sm flex items-center gap-3',
                          selectedServiceId === service.id
                            ? 'bg-secondary text-secondary-foreground font-semibold'
                            : 'hover:bg-accent/50 text-foreground/80'
                        )}
                      >
                        <div className="flex-shrink-0">{service.icon && React.cloneElement(service.icon, { className: 'h-5 w-5' })}</div>
                        {service.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </aside>

          {/* Service Detail */}
          <main className="lg:col-span-8 xl:col-span-9">
            {selectedService && (
              <Card className="overflow-hidden">
                <div className="relative h-64 w-full">
                    <Image 
                        src={PlaceHolderImages.find(p => p.id === 'project-detail-2')?.imageUrl || ''}
                        alt={selectedService.title}
                        fill
                        className="object-cover"
                        data-ai-hint="lab equipment"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-4">
                     <div className="bg-primary/10 p-4 rounded-lg mt-1">
                        {selectedService.icon && React.cloneElement(selectedService.icon, { className: 'h-8 w-8 text-primary' })}
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold font-display text-primary">
                            {selectedService.title}
                        </h2>
                         <p className="mt-4 text-lg text-foreground/90">
                            {selectedService.description}
                        </p>
                    </div>
                  </div>
                 
                  <div className="mt-8 border-t pt-8">
                    <h3 className="text-xl font-semibold font-display mb-4">Downloads</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button variant="outline" asChild>
                        <a href={selectedService.cataloguePdf} download>
                          <FileText className="mr-2 h-4 w-4" />
                          Service Catalogue
                        </a>
                      </Button>
                      <Button variant="outline" asChild>
                        <a href={selectedService.elementsPdf} download>
                          <FileText className="mr-2 h-4 w-4" />
                          Elements PDF
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
