import { projects } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects – AnaTech Labs',
  description: 'Explore our portfolio of case studies in occupational health, environmental monitoring, and safety compliance.',
};

export default function ProjectsPage() {
  return (
    <>
      <section className="bg-primary/5 dark:bg-primary/10 py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-primary">Our Projects</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-description-constant">
            Explore our portfolio of case studies to see how we tackle complex challenges and deliver impactful results for our clients.
          </p>
        </div>
      </section>

      <section className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => {
            const image = PlaceHolderImages.find(p => p.id === project.imageId);
            return (
              <Card key={project.id} className="flex flex-col overflow-hidden group transition-shadow hover:shadow-xl">
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
                  <CardDescription>
                    {project.category} &middot; {project.location} &middot; {project.year}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-description-constant">{project.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="secondary" asChild className="w-full">
                    <Link href={`/projects/${project.id}`}>
                      View Case Study <ArrowRight className="ml-2 h-4 w-4 icon-glow-light dark:icon-glow-dark" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>
    </>
  );
}
