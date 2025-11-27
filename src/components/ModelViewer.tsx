
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type ModelViewerProps = {
  imageId: string;
  alt: string;
};

export function ModelViewer({ imageId, alt }: ModelViewerProps) {
  const image = PlaceHolderImages.find(img => img.id === imageId);

  if (!image) {
    return (
      <Card className="bg-surface-lighter border-border aspect-video flex items-center justify-center">
        <p className="text-muted-foreground">Model not found</p>
      </Card>
    );
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
      </CardContent>
    </Card>
  );
}
