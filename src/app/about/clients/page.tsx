import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { clients, reviews } from '@/lib/data.tsx';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Star } from 'lucide-react';

export default function ClientsPage() {
  return (
    <>
      <section className="bg-primary/5 dark:bg-primary/10 py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-primary">Our Valued Clients</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            We are proud to partner with industry leaders and innovators, helping them achieve their safety, compliance, and sustainability goals.
          </p>
        </div>
      </section>
      
      {/* Client Logos Grid */}
      <section className="container mx-auto py-16">
        <h2 className="text-center font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl mb-12">
          Trusted by Industry Leaders
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
          {clients.map(client => {
            const image = PlaceHolderImages.find(img => img.id === client.logoId);
            return (
              <div key={client.id} className="flex justify-center items-center p-4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                {image && (
                  <Image 
                    src={image.imageUrl} 
                    alt={client.name} 
                    width={158} 
                    height={48} 
                    className="object-contain"
                    data-ai-hint={image.imageHint} 
                  />
                )}
              </div>
            );
          })}
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="bg-background py-16">
        <div className="container mx-auto">
          <h2 className="text-center font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl mb-12">
            What Our Clients Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map(review => {
              const image = PlaceHolderImages.find(p => p.id === review.imageId);
              return (
                <Card key={review.id} className="flex flex-col">
                  <CardContent className="p-6 flex-grow">
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <blockquote className="text-foreground/90 italic">
                      "{review.review}"
                    </blockquote>
                  </CardContent>
                  <CardFooter className="p-6 pt-0 flex items-center gap-4 bg-muted/50">
                    {image && (
                      <Image
                        src={image.imageUrl}
                        alt={review.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                        data-ai-hint={image.imageHint}
                      />
                    )}
                    <div>
                      <p className="font-semibold text-primary">{review.name}</p>
                      <p className="text-sm text-muted-foreground">{review.role}, {review.company}</p>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
