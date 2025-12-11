'use client';

import { useState } from 'react';
import Image from 'next/image';
import { galleryImages } from '@/lib/data.tsx';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const filters = ['All', 'Labs', 'Teams', 'Workshops', 'Events'];

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState<(typeof galleryImages[0]) | null>(null);

  const filteredImages =
    activeFilter === 'All'
      ? galleryImages
      : galleryImages.filter(
          (image) => image.category === activeFilter
        );

  return (
    <>
      <section className="bg-primary/5 dark:bg-primary/10 py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-primary">Gallery</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            A visual journey through our laboratories, our team in action, and our community events.
          </p>
        </div>
      </section>

      <section className="container mx-auto py-16">
        <div className="flex justify-center mb-8">
          <div className="bg-muted p-1 rounded-lg">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? 'default' : 'ghost'}
                onClick={() => setActiveFilter(filter)}
                className={cn('capitalize', activeFilter === filter && 'shadow-md')}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {filteredImages.map((galleryItem) => {
            const image = PlaceHolderImages.find(p => p.id === galleryItem.imageId);
            return (
              image ? (
                <Dialog key={galleryItem.id}>
                  <DialogTrigger asChild>
                    <div className="overflow-hidden rounded-lg break-inside-avoid group relative cursor-pointer" onClick={() => setSelectedImage(galleryItem)}>
                        <Image
                          src={image.imageUrl}
                          alt={galleryItem.caption}
                          width={600}
                          height={image.imageUrl.includes('800') ? 800 : 400} // Basic aspect ratio logic
                          className="w-full h-auto object-cover"
                          data-ai-hint={image.imageHint}
                        />
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                            <p className="text-white text-center text-sm">{galleryItem.caption}</p>
                        </div>
                    </div>
                  </DialogTrigger>
                </Dialog>
              ) : null
            );
          })}
        </div>
      </section>
      
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
            <DialogContent className="max-w-4xl p-0">
                 <DialogHeader className="p-4 sr-only">
                    <DialogTitle>{selectedImage.caption}</DialogTitle>
                    <DialogDescription>{selectedImage.category}</DialogDescription>
                </DialogHeader>
                <div className="relative">
                    <Image
                        src={PlaceHolderImages.find(p => p.id === selectedImage.imageId)?.imageUrl || ''}
                        alt={selectedImage.caption}
                        width={1200}
                        height={800}
                        className="w-full h-auto object-contain rounded-t-lg"
                        data-ai-hint={PlaceHolderImages.find(p => p.id === selectedImage.imageId)?.imageHint}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                        <p className="text-white font-semibold">{selectedImage.caption}</p>
                        <p className="text-sm text-white/80">{selectedImage.category}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
      )}
    </>
  );
}
