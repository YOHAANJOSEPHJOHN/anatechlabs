import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { reviews } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ReviewsPage() {
  return (
    <>
      <section className="bg-primary/5 dark:bg-primary/10 py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-primary">Client Testimonials</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-description-constant">
            Hear directly from our clients about their experience partnering with AnaTech.
          </p>
        </div>
      </section>

      <section className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map(review => {
            const image = PlaceHolderImages.find(p => p.id === review.imageId);
            return (
              <Card key={review.id} className="flex flex-col">
                <CardContent className="p-6 flex-grow">
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(`h-5 w-5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`, "icon-glow-light dark:icon-glow-dark")}
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
      </section>
    </>
  );
}
