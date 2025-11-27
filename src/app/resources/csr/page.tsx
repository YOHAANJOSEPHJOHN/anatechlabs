import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Leaf, Recycle, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const CsrProjects = [
  {
    title: 'Community Water Purification Drive',
    description: 'Partnering with local NGOs to install water purification systems in rural communities, providing access to clean and safe drinking water.',
    icon: <Droplets className="h-10 w-10 text-secondary" />,
  },
  {
    title: 'Green Labs Initiative',
    description: 'Implementing energy-efficient practices and waste reduction programs across all our laboratories to minimize our environmental footprint.',
    icon: <Recycle className="h-10 w-10 text-secondary" />,
  },
  {
    title: 'Reforestation Partnership',
    description: 'Funding and participating in reforestation projects to combat climate change and restore local ecosystems.',
    icon: <Leaf className="h-10 w-10 text-secondary" />,
  },
];

export default function CsrPage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'csr-1');
  const sustainabilityImage = PlaceHolderImages.find(p => p.id === 'csr-2');

  return (
    <>
      <section className="bg-primary/5 dark:bg-primary/10 py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-primary">Corporate Social Responsibility</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            At AnaTech, we are deeply committed to creating a positive impact on society and the environment, beyond our core business.
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="container mx-auto py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Our CSR Mission
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              To leverage our scientific expertise and resources to foster environmental stewardship, support community well-being, and promote sustainable practices for a healthier planet. We believe that responsible business is good business, and we are dedicated to integrating ethical and sustainable principles into every aspect of our operations.
            </p>
            <Button asChild className="mt-6">
                <Link href="/contact">Partner with Us</Link>
            </Button>
          </div>
          {heroImage && (
            <div className="overflow-hidden rounded-lg shadow-lg">
              <Image
                src={heroImage.imageUrl}
                alt="Hands holding a small plant"
                width={600}
                height={400}
                className="object-cover w-full h-full"
                data-ai-hint={heroImage.imageHint}
              />
            </div>
          )}
        </div>
      </section>

      {/* CSR Projects */}
      <section className="bg-background py-16">
        <div className="container mx-auto">
          <h2 className="text-center font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl mb-12">
            Our Key Initiatives
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CsrProjects.map((project, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-8">
                  <div className="inline-block bg-secondary/10 p-4 rounded-full">
                    {project.icon}
                  </div>
                  <h3 className="mt-6 text-xl font-bold font-display">{project.title}</h3>
                  <p className="mt-2 text-foreground/80">{project.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability Message */}
      <section className="container mx-auto py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
        {sustainabilityImage && (
            <div className="overflow-hidden rounded-lg shadow-lg md:order-last">
              <Image
                src={sustainabilityImage.imageUrl}
                alt="Solar panels in a field"
                width={600}
                height={400}
                className="object-cover w-full h-full"
                data-ai-hint={sustainabilityImage.imageHint}
              />
            </div>
          )}
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              A Message on Sustainability
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              Sustainability is not just a buzzword for us; it is a fundamental principle that guides our strategy and actions. We continuously seek innovative ways to reduce our own environmental impact while helping our clients do the same. From adopting renewable energy sources in our facilities to developing greener testing methodologies, we are committed to being part of the solution for a sustainable future.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
