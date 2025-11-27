
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/lib/content';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowUpRight } from 'lucide-react';

interface ProjectInspectorProps {
  project: Project;
}

export function ProjectInspector({ project }: ProjectInspectorProps) {
  const image = PlaceHolderImages.find(img => img.id === project.image);

  return (
    <Card className="bg-card border-border hover:border-accent/50 transition-colors duration-300">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={project.title} className="border-b-0">
          <AccordionTrigger className="p-6 hover:no-underline">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 text-left">
              {image && (
                <div className="relative w-24 h-16 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={image.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover"
                    data-ai-hint={image.imageHint}
                  />
                </div>
              )}
              <div className="flex-grow">
                <CardTitle className="text-xl font-headline mb-2">{project.title}</CardTitle>
                <p className="text-muted-foreground text-sm">{project.summary}</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-6 pb-6 space-y-6">
              {project.architecture && (
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">Architecture</h4>
                  <p className="text-sm text-muted-foreground">{project.architecture}</p>
                </div>
              )}
              {project.responsibilities && (
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">Responsibilities</h4>
                  <p className="text-sm text-muted-foreground">{project.responsibilities}</p>
                </div>
              )}
              {project.stack && (
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map(tech => (
                      <Badge key={tech} variant="secondary" className="bg-surface-lighter text-accent-2-DEFAULT">{tech}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {project.link && project.link !== "#" && (
                <div>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-accent hover:text-accent/80"
                  >
                    View Project <ArrowUpRight className="ml-1 h-4 w-4" />
                  </a>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
