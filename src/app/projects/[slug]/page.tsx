import { projects } from '@/lib/data.tsx';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Target, Zap } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.id,
  }));
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.id === params.slug);

  if (!project) {
    notFound();
  }
  
  const heroImage = PlaceHolderImages.find(p => p.id === project.imageId);

  return (
    <>
      <section className="relative h-[40vh] md:h-[50vh] w-full">
        {heroImage && (
             <Image
                src={heroImage.imageUrl}
                alt={project.title}
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
                priority
              />
        )}
        <div className="absolute inset-0 bg-primary/70" />
        <div className="container mx-auto absolute inset-0 flex flex-col items-start justify-end text-primary-foreground p-4 md:p-8">
            <div className="max-w-4xl">
                <Badge variant="secondary" className="bg-accent text-accent-foreground mb-2">{project.category}</Badge>
                <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight drop-shadow-lg">
                    {project.title}
                </h1>
                <p className="mt-2 text-lg text-primary-foreground/90 drop-shadow-md">
                    {project.location} &middot; {project.year}
                </p>
            </div>
        </div>
      </section>

      <section className="container mx-auto py-16">
        <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
                <div className="prose prose-lg dark:prose-invert max-w-full">
                    <h2 className="font-display flex items-center gap-3"><Target className="text-secondary"/> The Challenge</h2>
                    <p>{project.content.challenge}</p>

                    <h2 className="font-display flex items-center gap-3 mt-12"><Zap className="text-secondary"/> Our Solution</h2>
                    <p>{project.content.solution}</p>
                </div>
            </div>

            <div className="lg:col-span-4">
                <Card className="sticky top-24">
                    <CardContent className="p-6">
                        <h3 className="font-display text-2xl font-semibold flex items-center gap-3"><CheckCircle className="text-green-500"/> Key Results</h3>
                        <Separator className="my-4"/>
                        <ul className="space-y-3">
                            {project.content.results.map((result, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                    <span>{result}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>

        <div className="mt-16">
            <h2 className="text-center font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl mb-8">
              Project Gallery
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {project.content.imageIds.map(id => {
                    const image = PlaceHolderImages.find(p => p.id === id);
                    return image ? (
                        <div key={id} className="overflow-hidden rounded-lg shadow-lg">
                            <Image
                                src={image.imageUrl}
                                alt={image.description}
                                width={800}
                                height={600}
                                className="object-cover w-full h-full"
                                data-ai-hint={image.imageHint}
                            />
                        </div>
                    ) : null;
                })}
            </div>
        </div>
      </section>
    </>
  );
}
