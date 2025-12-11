import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { teamMembers } from '@/lib/data.tsx';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TeamsPage() {
  return (
    <>
      <section className="bg-primary/5 dark:bg-primary/10 py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-primary">Our Expert Team</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Meet the dedicated scientists, engineers, and professionals who drive our mission forward with passion and expertise.
          </p>
        </div>
      </section>

      <section className="container mx-auto py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map(member => {
            const image = PlaceHolderImages.find(p => p.id === member.imageId);
            return (
              <Card key={member.id} className="text-center group overflow-hidden">
                <div className="overflow-hidden h-80 bg-muted flex items-center justify-center">
                  {image ? (
                    <Image
                      src={image.imageUrl}
                      alt={member.name}
                      width={400}
                      height={400}
                      className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-110"
                      data-ai-hint={image.imageHint}
                    />
                  ) : (
                    <User className="h-24 w-24 text-muted-foreground" />
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="font-display">{member.name}</CardTitle>
                  <CardDescription className="text-secondary font-semibold">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80">{member.bio}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

       <section className="bg-background py-16">
        <div className="container mx-auto text-center">
           <h2 className="text-3xl font-bold font-display">Join Our Mission</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
                We are always looking for talented individuals to join our growing team. If you are passionate about science and sustainability, we would love to hear from you.
            </p>
            <Button asChild size="lg" className="mt-8">
                <Link href="/careers">View Open Positions</Link>
            </Button>
        </div>
      </section>
    </>
  );
}
