import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Rocket, HeartPulse, ShieldCheck, FlaskConical, Users, Leaf } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React from 'react';

const values = [
    {
      icon: <ShieldCheck className={cn("h-8 w-8 text-secondary", "icon-glow-light dark:icon-glow-dark")} />,
      title: 'Integrity',
      description: 'We uphold the highest ethical standards, ensuring transparency and honesty in all our interactions.',
    },
    {
      icon: <FlaskConical className={cn("h-8 w-8 text-secondary", "icon-glow-light dark:icon-glow-dark")} />,
      title: 'Scientific Excellence',
      description: 'We are committed to rigorous scientific methods, continuous innovation, and delivering accurate, reliable results.',
    },
    {
      icon: <Users className={cn("h-8 w-8 text-secondary", "icon-glow-light dark:icon-glow-dark")} />,
      title: 'Client Partnership',
      description: 'We work collaboratively with our clients, acting as a trusted partner to help them achieve their goals.',
    },
    {
      icon: <Leaf className={cn("h-8 w-8 text-secondary", "icon-glow-light dark:icon-glow-dark")} />,
      title: 'Sustainability',
      description: 'We are dedicated to protecting the environment and promoting sustainable practices within our operations and for our clients.',
    },
]

export default function CompanyInfoPage() {
  const image1 = PlaceHolderImages.find(p => p.id === 'company-info-1');
  const image2 = PlaceHolderImages.find(p => p.id === 'project-detail-1');

  return (
    <>
      <section className="bg-primary/5 dark:bg-primary/10 py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-primary">About AnaTech</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Pioneering a safer, healthier world through scientific excellence and unwavering integrity.
          </p>
        </div>
      </section>

      <section className="container mx-auto py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Our Identity
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              AnaTech was founded on the principle that precise scientific analysis is the bedrock of a safe, healthy, and sustainable society. We are more than just a testing laboratory; we are a team of dedicated scientists, engineers, and consultants committed to solving complex environmental and occupational health challenges.
            </p>
            <p className="mt-4 text-lg text-foreground/80">
              Our approach combines state-of-the-art technology with decades of collective experience, allowing us to provide not just data, but actionable insights that empower our clients to make informed decisions.
            </p>
          </div>
          {image1 && (
            <div className="overflow-hidden rounded-lg shadow-lg">
              <Image
                src={image1.imageUrl}
                alt="Modern laboratory interior"
                width={600}
                height={450}
                className="object-cover w-full h-full"
                data-ai-hint={image1.imageHint}
              />
            </div>
          )}
        </div>
      </section>

      <section className="bg-background py-16">
         <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                {image2 && (
                    <div className="overflow-hidden rounded-lg shadow-lg md:order-last">
                    <Image
                        src={image2.imageUrl}
                        alt="Scientist looking at a sample"
                        width={600}
                        height={450}
                        className="object-cover w-full h-full"
                        data-ai-hint={image2.imageHint}
                    />
                    </div>
                )}
                <div>
                    <div className="relative mb-8">
                        <div className="flex items-start gap-4">
                            <div className="bg-secondary/10 p-3 rounded-lg mt-1"><Rocket className={cn("h-6 w-6 text-secondary", "icon-glow-light dark:icon-glow-dark")} /></div>
                            <div>
                                <h3 className="font-display text-2xl font-semibold">Our Mission</h3>
                                <p className="mt-2 text-lg text-foreground/80">To deliver exceptional scientific services that protect public health, ensure environmental sustainability, and support our clients' success through data-driven insights and unwavering expertise.</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="flex items-start gap-4">
                            <div className="bg-secondary/10 p-3 rounded-lg mt-1"><HeartPulse className={cn("h-6 w-6 text-secondary", "icon-glow-light dark:icon-glow-dark")} /></div>
                            <div>
                                <h3 className="font-display text-2xl font-semibold">Our Vision</h3>
                                <p className="mt-2 text-lg text-foreground/80">To be the most trusted partner and a global leader in creating a safe and sustainable future, recognized for our scientific innovation, integrity, and commitment to a healthier planet.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>
      
      <section className="container mx-auto py-16">
        <h2 className="text-center font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl mb-12">
            Our Core Values
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
                <Card key={index}>
                     <CardHeader>
                        <div className="flex items-center gap-4">
                            <div className="flex-shrink-0 bg-secondary/10 p-3 rounded-full">
                                {value.icon}
                            </div>
                            <CardTitle className="font-display text-xl">{value.title}</CardTitle>
                        </div>
                     </CardHeader>
                    <CardContent>
                        <p className="text-foreground/80">{value.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
      </section>
    </>
  );
}
