import { achievements } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Award, CheckCheck, Handshake } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const getIconForType = (type: string) => {
    switch(type) {
        case 'Accreditation': return <CheckCheck className={cn('h-6 w-6 text-green-500', "icon-glow-light dark:icon-glow-dark")} />;
        case 'Award': return <Award className={cn('h-6 w-6 text-amber-500', "icon-glow-light dark:icon-glow-dark")} />;
        case 'Collaboration': return <Handshake className={cn('h-6 w-6 text-blue-500', "icon-glow-light dark:icon-glow-dark")} />;
        default: return null;
    }
}

export default function AchievementsPage() {
  return (
    <>
      <section className="bg-primary/5 dark:bg-primary/10 py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-primary">Accreditations & Achievements</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-description-constant">
            Our commitment to quality, innovation, and excellence is recognized by leading industry bodies and awards.
          </p>
        </div>
      </section>

      <section className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map((item) => {
            const image = PlaceHolderImages.find(p => p.id === item.imageId);
            return (
              <Card key={item.id} className="flex flex-col overflow-hidden group transition-shadow hover:shadow-xl">
                {image && (
                  <div className="overflow-hidden relative">
                    <Image
                      src={image.imageUrl}
                      alt={item.title}
                      width={600}
                      height={400}
                      className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-110"
                      data-ai-hint={image.imageHint}
                    />
                    <Badge className="absolute top-2 right-2">{item.type}</Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {getIconForType(item.type)}
                    <CardTitle className="font-display">{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-description-constant">{item.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="text-center mt-12">
            <Button asChild size="lg">
                <Link href="/about/quality-policy">View Our Quality Policy</Link>
            </Button>
        </div>
      </section>
    </>
  );
}
