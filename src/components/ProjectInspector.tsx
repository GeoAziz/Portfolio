
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Project, SystemsProject, AiExperiment, HardwareProject, OpenSourceProject } from '@/lib/content';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowUpRight, ChevronsUpDown } from 'lucide-react';
import { Button } from './ui/button';

interface ProjectInspectorProps {
  project: Project | SystemsProject | AiExperiment | HardwareProject | OpenSourceProject;
}

function isSystemsProject(project: any): project is SystemsProject {
  return 'long_description' in project && 'diagram_ascii' in project;
}

function isAiExperiment(project: any): project is AiExperiment {
    return 'method' in project && 'observation' in project;
}

function isHardwareProject(project: any): project is HardwareProject {
    return 'components' in project && 'status' in project && 'notes' in project;
}

function isOpenSourceProject(project: any): project is OpenSourceProject {
    return 'repo' in project && 'license' in project;
}

export function ProjectInspector({ project }: ProjectInspectorProps) {
  const image = 'image' in project && project.image ? PlaceHolderImages.find(img => img.id === project.image) : undefined;
  
  const isSystem = isSystemsProject(project);
  const isAi = isAiExperiment(project);
  const isHardware = isHardwareProject(project);
  const isOpenSource = isOpenSourceProject(project);

  const title = isOpenSource ? project.name : project.title ?? (project as Project).name;
  let shortDescription = '';
  if (isSystem) shortDescription = project.short_description;
  else if ('description' in project) shortDescription = project.description;


  let tech: string[] = [];
  if (isAi) tech = project.tags;
  else if (isHardware) tech = project.tags;
  else if (isOpenSource) tech = project.tags;
  else if ('tech' in project) tech = project.tech;

  const link = isOpenSource ? project.repo : ('link' in project ? project.link : '#');
  const interactive = 'interactive' in project ? project.interactive : false;

  return (
    <Card className="bg-card border-border hover:border-accent/50 transition-colors duration-300 overflow-hidden">
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={title} className="border-b-0">
                <div className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 text-left">
                    {image && (
                    <div className="relative w-24 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                        src={image.imageUrl}
                        alt={title}
                        fill
                        className="object-cover"
                        data-ai-hint={image.imageHint}
                        />
                    </div>
                    )}
                    <div className="flex-grow">
                        <h3 className="text-lg md:text-xl font-headline mb-1 md:mb-2">{title}</h3>
                        <p className="text-muted-foreground text-sm">{shortDescription}</p>
                    </div>
                    <div className='flex gap-2 items-center self-end md:self-center'>
                        { link && link !== "#" && (
                            <Button asChild variant="outline" size="sm">
                                <a
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`View project ${title} on GitHub`}
                                >
                                    View <ArrowUpRight className="ml-1 h-4 w-4 hidden sm:inline" />
                                </a>
                            </Button>
                        )}
                        {interactive && (
                            <AccordionTrigger className="p-2 rounded-md hover:bg-secondary [&[data-state=open]>svg]:-rotate-180">
                               <span className="sr-only">Details</span>
                               <ChevronsUpDown className="h-4 w-4 transition-transform duration-200" />
                            </AccordionTrigger>
                        )}
                    </div>
                </div>

                {interactive && (
                     <AccordionContent>
                        <div className="px-6 pb-6 grid md:grid-cols-2 gap-8">
                            <div className="space-y-4 text-sm">
                                <div>
                                    <h4 className="font-semibold mb-2 text-foreground">Tech Stack / Tags</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {(isOpenSource ? [...project.languages, ...project.tags] : tech).map(t => (
                                            <Badge key={t} variant="secondary" className="font-mono">{t}</Badge>
                                        ))}
                                    </div>
                                </div>
                                { isSystem && project.role && (
                                <div>
                                    <h4 className="font-semibold mb-2 text-foreground">Role</h4>
                                    <p className="text-muted-foreground">{project.role}</p>
                                </div>
                                )}
                                { isSystem && (
                                <div>
                                    <h4 className="font-semibold mb-2 text-foreground">Description</h4>
                                    <p className="text-muted-foreground whitespace-pre-wrap">{project.long_description}</p>
                                </div>
                                )}
                                { isAi && (
                                    <>
                                        <div>
                                            <h4 className="font-semibold mb-2 text-foreground">Method</h4>
                                            <p className="text-muted-foreground">{project.method}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-2 text-foreground">Observation</h4>
                                            <p className="text-muted-foreground">{project.observation}</p>
                                        </div>
                                         <div>
                                            <h4 className="font-semibold mb-2 text-foreground">Result</h4>
                                            <p className="text-accent-ai">{project.result}</p>
                                        </div>
                                    </>
                                )}
                                { isHardware && (
                                    <>
                                        <div>
                                            <h4 className="font-semibold mb-2 text-foreground">Components</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {project.components.map(c => <Badge key={c} variant="secondary">{c}</Badge>)}
                                            </div>
                                        </div>
                                         <div>
                                            <h4 className="font-semibold mb-2 text-foreground">Core Skills</h4>
                                            <ul className="list-disc list-inside text-muted-foreground">
                                                {project.skills.map(s => <li key={s}>{s}</li>)}
                                            </ul>
                                        </div>
                                         <div>
                                            <h4 className="font-semibold mb-2 text-foreground">Status</h4>
                                            <p className="text-muted-foreground">{project.status}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-2 text-foreground">Notes</h4>
                                            <p className="text-muted-foreground italic">"{project.notes}"</p>
                                        </div>
                                    </>
                                )}
                                { isOpenSource && (
                                    <>
                                         <div>
                                            <h4 className="font-semibold mb-2 text-foreground">Status</h4>
                                            <p className="text-muted-foreground capitalize">{project.status} ({project.version})</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-2 text-foreground">License</h4>
                                            <p className="text-muted-foreground">{project.license}</p>
                                        </div>
                                    </>
                                )}
                           </div>
                           {isSystem && project.diagram_ascii && (
                                <div>
                                    <h4 className="font-semibold mb-2 text-foreground">Architecture</h4>
                                    <pre className="bg-secondary p-4 rounded-md text-muted-foreground font-mono text-xs whitespace-pre-wrap overflow-x-auto">
                                        <code>
                                        {project.diagram_ascii.join('\n')}
                                        </code>
                                    </pre>
                                     <p className="text-xs text-muted-foreground/80 mt-2 italic text-center">{project.architecture_hint}</p>
                                </div>
                            )}
                        </div>
                    </AccordionContent>
                )}
            </AccordionItem>
        </Accordion>
    </Card>
  );
}
