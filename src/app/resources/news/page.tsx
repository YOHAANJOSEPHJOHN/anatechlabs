import { newsArticles } from '@/lib/data.tsx';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Calendar, ArrowRight } from 'lucide-react';

export default function NewsPage() {
  return (
    <>
      <section className="bg-primary/5 dark:bg-primary/10 py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-primary">News & Updates</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Stay informed with the latest industry insights, company news, and technological advancements from AnaTech.
          </p>
        </div>
      </section>

      <section className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsArticles.map((article) => {
            const image = PlaceHolderImages.find(p => p.id === article.imageId);
            return (
              <Card key={article.id} className="flex flex-col overflow-hidden group transition-shadow hover:shadow-xl">
                {image && (
                  <div className="overflow-hidden">
                    <Image
                      src={image.imageUrl}
                      alt={article.title}
                      width={600}
                      height={400}
                      className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-110"
                      data-ai-hint={image.imageHint}
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="font-display">{article.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> 
                    {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-foreground/80">{article.excerpt}</p>
                </CardContent>
                <CardFooter>
                   <Button variant="link" asChild>
                    <Link href="#">
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
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
