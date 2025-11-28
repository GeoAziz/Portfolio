
'use client'
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Cube } from 'lucide-react';

type ModelViewerProps = {
  imageId: string;
  alt: string;
  modelSrc?: string;
};

export function ModelViewer({ imageId, alt, modelSrc }: ModelViewerProps) {
  const image = PlaceHolderImages.find(img => img.id === imageId);

  // Fallback for when the image isn't found
  if (!image) {
    return (
      <Card className="bg-secondary border-border aspect-video flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Cube className="w-8 h-8 mx-auto mb-2" />
          <p>Model preview not available</p>
        </div>
      </Card>
    );
  }
  
  const isInteractive = !!modelSrc;

  return (
    <Card className="bg-secondary border-border overflow-hidden group">
      <CardContent className="p-0 aspect-video relative">
        <Image
          src={image.imageUrl}
          alt={alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={image.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs">
           <p className="text-white/80 font-semibold">{alt}</p>
          {isInteractive && (
             <div className="bg-background/70 text-foreground px-2 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
                <Cube className="w-3 h-3 text-accent"/>
                <span>3D Model</span>
            </div>
          )}
        </div>
        {!isInteractive && (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white/90 bg-black/40 p-4 rounded-lg backdrop-blur-sm">
                    <p className="font-semibold">2D Image Preview</p>
                    <p className="text-xs text-white/70">Interactive 3D model coming soon</p>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
