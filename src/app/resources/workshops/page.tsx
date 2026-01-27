'use client';
import { useEffect } from 'react';
import { workshops } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';
import { useWorkshopInquiry } from '@/hooks/use-workshop-inquiry';
import { cn } from '@/lib/utils';

export default function WorkshopsPage() {
  const { open, popupsEnabled } = useWorkshopInquiry();
  
  useEffect(() => {
    if (popupsEnabled) {
      open();
    }
  }, [open, popupsEnabled]);
  
  return (
    <>
      <section className="bg-primary/5 dark:bg-primary/10 py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-primary">Training & Workshops</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-description-constant">
            Empower your team with expert-led training sessions designed to enhance skills, ensure compliance, and promote a culture of safety and quality.
          </p>
        </div>
      </section>

      <section className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workshops.map((workshop) => {
            const image = PlaceHolderImages.find(p => p.id === workshop.imageId);
            return (
              <Card key={workshop.id} className="flex flex-col overflow-hidden group transition-shadow hover:shadow-xl">
                {image && (
                  <div className="overflow-hidden">
                    <Image
                      src={image.imageUrl}
                      alt={workshop.title}
                      width={600}
                      height={400}
                      className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-110"
                      data-ai-hint={image.imageHint}
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="font-display">{workshop.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-description-constant">{workshop.description}</p>
                </CardContent>
                <CardFooter>
                   <Button 
                     variant="secondary" 
                     className="w-full"
                     onClick={() => open(workshop.title)}
                   >
                     Request This Workshop <ArrowRight className="ml-2 h-4 w-4 icon-glow-light dark:icon-glow-dark" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
         <div className="text-center mt-16">
            <h2 className="text-2xl font-bold font-display">Customized Training Solutions</h2>
            <p className="mt-2 max-w-xl mx-auto text-description-constant">
                Don't see what you're looking for? We can develop custom workshops tailored to your organization's specific needs.
            </p>
            <Button asChild className="mt-6">
                <Link href="/contact?subject=Custom+Workshop+Inquiry">Inquire About Custom Training</Link>
            </Button>
        </div>
      </section>
    </>
  );
}
