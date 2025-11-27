
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/lib/content';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowUpRight } from 'lucide-react';
import { Button } from './ui/button';

interface ProjectInspectorProps {
  project: Project;
}

export function ProjectInspector({ project }: ProjectInspectorProps) {
  const image = PlaceHolderImages.find(img => img.id === project.image);

  return (
    <Card className="bg-card border-border hover:border-accent/50 transition-colors duration-300 overflow-hidden">
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={project.name} className="border-b-0">
                <div className="p-6 flex flex-col md:flex-row items-start md:items-center gap-4 text-left">
                    {image && (
                    <div className="relative w-24 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                        src={image.imageUrl}
                        alt={project.name}
                        fill
                        className="object-cover"
                        data-ai-hint={image.imageHint}
                        />
                    </div>
                    )}
                    <div className="flex-grow">
                        <h3 className="text-xl font-headline mb-2">{project.name}</h3>
                        <p className="text-muted-foreground text-sm">{project.description}</p>
                    </div>
                    <div className='flex gap-2 items-center'>
                        {project.link && project.link !== "#" && (
                            <Button asChild variant="outline" size="sm">
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View Project <ArrowUpRight className="ml-1 h-4 w-4" />
                                </a>
                            </Button>
                        )}
                        {project.interactive && (
                            <AccordionTrigger asChild>
                                <Button variant="secondary" size="sm">Details</Button>
                            </AccordionTrigger>
                        )}
                    </div>
                </div>

                {project.interactive && (
                     <AccordionContent>
                        <div className="px-6 pb-6 space-y-6">
                            <div>
                            <h4 className="font-semibold mb-2 text-foreground">Tech Stack</h4>
                            <div className="flex flex-wrap gap-2">
                                {project.tech.map(tech => (
                                <Badge key={tech} variant="secondary">{tech}</Badge>
                                ))}
                            </div>
                            </div>
                        </div>
                    </AccordionContent>
                )}
            </AccordionItem>
        </Accordion>
    </Card>
  );
}
