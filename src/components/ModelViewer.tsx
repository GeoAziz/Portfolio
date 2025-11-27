
'use client'
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type ModelViewerProps = {
  imageId: string;
  alt: string;
  modelSrc?: string;
};

export function ModelViewer({ imageId, alt, modelSrc }: ModelViewerProps) {
  const image = PlaceHolderImages.find(img => img.id === imageId);

  if (!image) {
    return (
      <Card className="bg-surface-lighter border-border aspect-video flex items-center justify-center">
        <p className="text-muted-foreground">Model not found</p>
      </Card>
    );
  }

  // NOTE: This is a placeholder for a real 3D model viewer.
  // The interactive model functionality would be implemented here.
  // For now, we are just displaying the image.
  if (modelSrc) {
    console.log(`Loading 3D model from: ${modelSrc}`);
  }


  return (
    <Card className="bg-surface-lighter border-border overflow-hidden">
      <CardContent className="p-0 aspect-video relative">
        <Image
          src={image.imageUrl}
          alt={alt}
          fill
          className="object-cover"
          data-ai-hint={image.imageHint}
        />
        {modelSrc && (
          <div className="absolute bottom-2 right-2 bg-background/70 text-foreground text-xs px-2 py-1 rounded">
            3D Model available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
